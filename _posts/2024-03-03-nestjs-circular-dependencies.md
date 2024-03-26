---
title: Get Rid of Tightly Coupled Modules and Circular Dependencies in NestJS
date: 2024-03-03 00:00:00 +0000
categories: [Software Engineering, Web Development]
tags: [NestJS, NodeJS, Event-Driven Architecture, Microservices, TypeScript, Web Development]     
image: 
  path: /assets/img/0_Zbr0_Ig-pL9uiwA2.webp
  caption: Photo by <a href="https://unsplash.com/@sarahmutter?utm_source=medium&utm_medium=referral">Sarah Mutter</a> on <a href="https://unsplash.com/?utm_source=medium&utm_medium=referral">Unsplash</a>
---

NestJS is a great NodeJS framework that injects a lot of refreshment into the ecosystem of Node’s backend solutions. With its robust module system, it allows planning and building scalable architecture that contains modules responsible for wrapping related logic together. While working within a modular environment like this, you may sometimes encounter an issue of circular dependencies caused by tightly coupled modules. In most cases, you will recognize this as an error presented below.

```text
[Nest] 2788 - 06/10/2023, 12:56:50 PM LOG [InjectorLogger] 
> Nest encountered an undefined dependency. 
> This may be due to a circular import or a missing dependency declaration. 
[Nest] 2788 - 06/10/2023, 12:56:50 PM ERROR [ExceptionHandler] 
> Nest can't resolve dependencies of the UserService (?). 
> Please make sure that the argument dependency at index [0] is available in the UserModule context.
```

This is caused by two services that depend on each other to perform their logic. In this example above, the `PostService` is a dependency of `UserService`, but also `UserService` is a dependency of `PostService`. This causes Nest’s dependency injection container to be unable to resolve this situation.

As per Nest’s documentation, you may, of course, use the `forwardRef()` function. However, this is only a temporary solution. If you don't truly solve the problem of tight coupling and circular dependencies, adding newer modules will become quite painful, and you will have to wrap most of your dependencies with the mentioned function.

In today’s post, I would like to suggest another solution, which, of course, may not be applicable to all cases. But even if it solves only half of your circular dependencies, this may be already a good step forward. So, before further ado, let’s examine an example problem and the proposed solution.

### The problem

Let’s consider a not too simple application for writing blog posts. But, apart from just creating posts, we were required to implement a bunch of additional actions like sending notifications to the author’s followers, increasing the author’s reputation after post creation, configuring a payment gateway if the post is behind a paywall, and some other fancy features. At the end, we may end up with code similar to the following.

```typescript
class PostService {
  constructor(
    private readonly postRepositiory: PostRepository,
    private readonly userService: UserService,
    private readonly reputationService: ReputationService,
    private readonly notificationService: NotificationService,
    private readonly trackingService: TrackingService,
    private readonly paymentService: PaymentService,
    private readonly moderationService: ModerationService 
  ) {}

  public createPost(args: CreatePostArgs): Post {
    const post = this.postRepository.create(args);
    
    this.reputationService.increaseReputation(args.userId);
    this.notificationService.notifyFollowersAboutPost(post);
    this.userService.updateUserActivity('post.created', post);
    this.trackingService.registerTrackable('post', post);
    this.moderationService.checkPostContentForViolations(post.content);    
    
    if (args.isPremium) {
      this.paymentService.chargeUserForPremiumPost(args.userId);
    }
    
    return post;
  }
}
```

This example is obviously made up, so please don’t pay too much attention to the details. I just want you to notice how many services `PostService` is dependent on and imagine that these services may also be dependent on `PostService`. For example, the notification service may require additional data from the post service to dispatch notifications, or the `ModerationService` may need to modify the post again via PostService after moderation. This is where circular dependencies occur.

So now that we have a grasp of the problem, let’s explore the solution that I want to propose.

### The solution

The solution I want to propose for this problem is to use the well-known concept of Event-Driven Architecture. Instead of calling all subsequent actions from the `createPost` method, we will simply create the post there and emit an event. Then, any module interested in performing some action related to the event may do so without crossing its logical borders.

NestJS already comes with handy tools that we can use to benefit from events. If you don't yet have the package installed, you can simply add `@nestjs/event-emitter` to your application.

```shell
yarn add @nestjs/event-emitter
```

And when the package is installed, add the EventEmitterModule to the root module of your application.

```typescript
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    // ...
  ],
})
export class AppModule {}
```

When we have it ready, we may simply get rid of all `PostService` dependencies and replace them with only one — `EventEmitter2`. After this, we may also remove subsequent method invocations from the `createPost` method and instead emit an event with its key and payload. The payload may be defined as a separate interface or class if you wish, but here, for presentation purposes, I will just emit the created post as a payload.

```typescript
class PostsService {
  constructor(private eventEmitter: EventEmitter2) {}

  public createPost(args: CreatePostArgs): Post {
    const post = this.db.posts.create({ ... });
    this.eventEmitter.emit('post.created', post);
    
    return post;
  }
}
```

The last thing we have to do is to add a listener to the modules that may be interested in this event. For example, in the notification module, we may have a listener as below. In the other modules, the code will be pretty much the same, just other services will be involved in event handling.

```typescript
class NotificationsListener {
  constructor(
    private readonly notificationsService: NotificationsService
  ) {}
  
  @OnEvent('post.created')
  handlePostCreated(post: Post) {
    this.reputationService.notifyFollowersAboutPost(post);
  }
}
```

This way, the `NotificationService` and `PostService` are only loosely coupled now. The `PostService` is no longer dependent on `NotificationService`. We get rid of circular dependency here, yet we keep the functionality still working — Yay!

### Summary

To sum up, in this article we explored the proposition of introducing events into your application to solve the issue of circular dependencies. This approach helps modules to stay within their borders yet react to actions performed in another module as well. Even though this way may not be applicable to all solutions it definitely may fix the one presented today.

I want to say thank you to all who read this article. I would love to hear your thoughts about this proposal and your ways of tackling circular dependencies in your applications, so feel free to share.

Don’t forget to check out my other articles for more tips and insights. Happy hacking!
