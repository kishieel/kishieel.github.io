---
title: CouchGO! — Enhancing CouchDB with Query Server Written in Go
date: 2024-06-15 00:00:00 +0000
categories: [Software Engineering, Web Development]
tags: [CouchDB, Go, Database, Document, NoSQL]     
image: 
  path: /assets/img/0_N5lU9si66pxgl7i4.webp
  caption: Photo by <a href="https://unsplash.com/@enginakyurt">engin akyurt</a> on <a href="https://unsplash.com">Unsplash</a>

---

Over the past month, I’ve been actively working on proof-of-concept projects related to CouchDB, exploring its features and preparing for future tasks. During this period, I’ve gone through the CouchDB documentation multiple times to ensure I understand how everything works. While reading through the documentation, I came across a statement that despite CouchDB shipping with a default Query Server written in JavaScript, creating a custom implementation is relatively simple and custom solutions already exist in the wild.

I did some quick research and found implementations written in Python, Ruby, or Clojure. Since the whole implementation didn’t seem too long, I decided to experiment with CouchDB by trying to write my own custom Query Server. To do this, I chose Go as the language. I haven’t had much experience with this language before, except for using Go templates in Helm’s charts, but I wanted to try something new and thought this project would be a great opportunity for it.

## Understanding the Query Server
Before starting work, I revisited the CouchDB documentation once more to understand how the Query Server actually works. According to the documentation, the high-level overview of the Query Server is quite simple:

> The Query server is an external process that communicates with CouchDB via the JSON protocol over a stdio interface and handles all design function calls […].

The structure of the commands sent by CouchDB to the Query Server can be expressed as `[<command>, <*arguments>]` or `["ddoc", <design_doc_id>, [<subcommand>, <funcname>], [<argument1>, <argument2>, …]]` in the case of design documents.

So basically, what I had to do was write an application capable of parsing this kind of JSON from STDIO, performing the expected operations, and returning responses as specified in the documentation. There was a lot of type casting involved to handle a wide range of commands in Go code. Specific details about each command can be found under the [Query Server Protocol](https://docs.couchdb.org/en/stable/query-server/protocol.html) section of the documentation.

One problem I faced here was that the Query Server should be able to interpret and execute arbitrary code provided in design documents. Knowing that Go is a compiled language, I expected to be stuck at this point. Thankfully, I quickly found the [Yeagi](https://github.com/traefik/yaegi) package, which is capable of interpreting Go code with ease. It allows creating a sandbox and controlling access to which packages can be imported in the interpreted code. In my case, I decided to expose only my package called `couchgo`, but other standard packages can be easily added as well.

## Introducing CouchGO!
As a result of my work, an application called CouchGO! emerged. Although it follows the Query Server Protocol, it is not a one-to-one reimplementation of the JavaScript version as it has its own approaches to handling design document functions.

For example, in CouchGO!, there is no helper function like `emit`. To emit values, you simply return them from the map function. Additionally, each function in the design document follows the same pattern: it has only one argument, which is an object containing function-specific properties, and is supposed to return only one value as a result. This value doesn't have to be a primitive; depending on the function, it may be an object, a map, or even an error.

To start working with CouchGO!, you just need to download the executable binary from my [GitHub repository](https://github.com/kishieel/couchdb-query-server-go), place it somewhere in the CouchDB instance, and add an environment variable that allows CouchDB to start the CouchGO! process.

For instance, if you place the `couchgo` executable into the `/opt/couchdb/bin` directory, you would add following environment variable to enable it to work.

```shell
export COUCHDB_QUERY_SERVER_GO="/opt/couchdb/bin/couchgo"
```

## Writing Functions with CouchGO!
To gain a quick understanding of how to write functions with CouchGO!, let’s explore the following function interface:

```go
func Func(args couchgo.FuncInput) couchgo.FuncOutput { ... }
```

Each function in CouchGO! will follow this pattern, where Func is replaced with the appropriate function name. Currently, CouchGO! supports the following function types:

- Map
- Reduce
- Filter
- Update
- Validate (validate_doc_update)

Let’s examine an example design document that specifies a view with map and reduce functions, as well as a validate_doc_update function. Additionally, we need to specify that we are using Go as the language.

```json
{
  "_id": "_design/ddoc-go",
  "views": {
    "view": {
      "map": "func Map(args couchgo.MapInput) couchgo.MapOutput {\n\tout := couchgo.MapOutput{}\n\tout = append(out, [2]interface{}{args.Doc[\"_id\"], 1})\n\tout = append(out, [2]interface{}{args.Doc[\"_id\"], 2})\n\tout = append(out, [2]interface{}{args.Doc[\"_id\"], 3})\n\t\n\treturn out\n}",
      "reduce": "func Reduce(args couchgo.ReduceInput) couchgo.ReduceOutput {\n\tout := 0.0\n\n\tfor _, value := range args.Values {\n\t\tout += value.(float64)\n\t}\n\n\treturn out\n}"
    }
  },
  "validate_doc_update": "func Validate(args couchgo.ValidateInput) couchgo.ValidateOutput {\n\tif args.NewDoc[\"type\"] == \"post\" {\n\t\tif args.NewDoc[\"title\"] == nil || args.NewDoc[\"content\"] == nil {\n\t\t\treturn couchgo.ForbiddenError{Message: \"Title and content are required\"}\n\t\t}\n\n\t\treturn nil\n\t}\n\n\tif args.NewDoc[\"type\"] == \"comment\" {\n\t\tif args.NewDoc[\"post\"] == nil || args.NewDoc[\"author\"] == nil || args.NewDoc[\"content\"] == nil {\n\t\t\treturn couchgo.ForbiddenError{Message: \"Post, author, and content are required\"}\n\t\t}\n\n\t\treturn nil\n\t}\n\n\tif args.NewDoc[\"type\"] == \"user\" {\n\t\tif args.NewDoc[\"username\"] == nil || args.NewDoc[\"email\"] == nil {\n\t\t\treturn couchgo.ForbiddenError{Message: \"Username and email are required\"}\n\t\t}\n\n\t\treturn nil\n\t}\n\n\treturn couchgo.ForbiddenError{Message: \"Invalid document type\"}\n}",
  "language": "go"
}
```

Now, let’s break down each function starting with the map function:

```go
func Map(args couchgo.MapInput) couchgo.MapOutput {
  out := couchgo.MapOutput{}
  out = append(out, [2]interface{}{args.Doc["_id"], 1})
  out = append(out, [2]interface{}{args.Doc["_id"], 2})
  out = append(out, [2]interface{}{args.Doc["_id"], 3})

  return out
}
```

In CouchGO!, there is no emit function; instead, you return a slice of key-value tuples where both key and value can be of any type. The document object isn't directly passed to the function as in JavaScript; rather, it's wrapped in an object. The document itself is simply a hashmap of various values.

Next, let’s examine the reduce function:

```go
func Reduce(args couchgo.ReduceInput) couchgo.ReduceOutput {
  out := 0.0
  for _, value := range args.Values {
    out += value.(float64)
  }
  return out
}
```

Similar to JavaScript, the reduce function in CouchGO! takes keys, values, and a rereduce parameter, all wrapped into a single object. This function should return a single value of any type that represents the result of the reduction operation.

Finally, let’s look at the Validate function, which corresponds to the `validate_doc_update` property:

```go
func Validate(args couchgo.ValidateInput) couchgo.ValidateOutput {
  if args.NewDoc["type"] == "post" {
    if args.NewDoc["title"] == nil || args.NewDoc["content"] == nil {
      return couchgo.ForbiddenError{Message: "Title and content are required"}
    }

    return nil
  }

  if args.NewDoc["type"] == "comment" {
    if args.NewDoc["post"] == nil || args.NewDoc["author"] == nil || args.NewDoc["content"] == nil {
      return couchgo.ForbiddenError{Message: "Post, author, and content are required"}
    }

    return nil
  }

  return nil
}
```

In this function, we receive parameters such as the new document, old document, user context, and security object, all wrapped into one object passed as a function argument. Here, we’re expected to validate if the document can be updated and return an error if not. Similar to the JavaScript version, we can return two types of errors: `ForbiddenError` or `UnauthorizedError`. If the document can be updated, we should return nil.

For more detailed examples, they can be found in my GitHub repository. One important thing to note is that the function names are not arbitrary; they should always match the type of function they represent, such as `Map`, `Reduce`, `Filter`, etc.

## CouchGO! Performance
Even though writing my own Query Server was a really fun experience, it wouldn’t make much sense if I didn’t compare it with existing solutions. So, I prepared a few simple tests in a Docker container to check how much faster CouchGO! can:

- Index 100k documents (indexing in CouchDB means executing map functions from views)
- Execute reduce function for 100k documents
- Filter change feed for 100k documents
- Perform update function for 1k requests

I seeded the database with the expected number of documents and measured response times or differentiated timestamp logs from the Docker container using dedicated shell scripts. The details of the implementation can be found in my GitHub repository. The results are presented in the table below.

| Test                  | CouchGO! |  CouchJS | Boost |
|-----------------------|---------:|---------:|------:|
| Indexing              | 141.713s | 421.529s | 2.97x |
| Reducing              |   7672ms |  15642ms | 2.04x |
| Filtering             |  28.928s |  80.594s | 2.79x |
| Updating              |   7.742s |   9.661s | 1.25x |

As you can see, the boost over the JavaScript implementation is significant: almost three times faster in the case of indexing, more than twice as fast for reduce and filter functions. The boost is relatively small for update functions, but still faster than JavaScript.

## Conclusion
As the author of the documentation promised, writing a custom Query Server wasn’t that hard when following the Query Server Protocol. Even though CouchGO! lacks a few deprecated functions in general, it provides a significant boost over the JavaScript version even at this early stage of development. I believe there is still plenty of room for improvements.

If you need all the code from this article in one place, you can find it in my [GitHub repository](https://github.com/kishieel/couchdb-query-server-go).

Thank you for reading this article. I would love to hear your thoughts about this solution. Would you use it with your CouchDB instance, or maybe you already use some custom-made Query Server? I would appreciate hearing about it in the comments.

Don’t forget to check out my other articles for more tips, insights, and other parts of this series as they are created. Happy hacking!
