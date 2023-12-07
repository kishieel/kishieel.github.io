export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="grid grid-cols-12 max-w-7xl w-full gap-6">
                <div className="col-span-3 bg-ebony-clay-500 p-6 rounded-2xl drop-shadow-md">
                    <img className="rounded-full" src="/avatar.jpg" alt="Hello.. it's me :)"/>
                    <p className="text-center">Tomasz Kisiel</p>
                    <p className="text-center">Software Engineer</p>
                    <h1 className="font-extrabold">Skills</h1>
                    <p>Problem-solving</p>
                    <p>Software Architecture</p>
                    <p>Algorithm Design & Analysis</p>
                    <p>Object-Oriented Design</p>
                    <p>System Optimization</p>
                    <p>Agile Methodologies</p>
                    <p>Code Refactoring & Maintenance</p>
                    <p>Documentation & Communication</p>
                    <p>Testing & Quality Assurance</p>
                    <p>Continuous Learning & Adaptability</p>
                    <h1 className="font-extrabold">Languages</h1>
                    <div className="flex justify-between"><p>Polish</p><p>Native</p></div>
                    <div className="flex justify-between"><p>English</p><p>B2</p></div>
                    <div className="flex justify-between"><p>French</p><p>B2</p></div>
                </div>
                <div className="col-span-9 bg-ebony-clay-500 p-6 rounded-2xl drop-shadow-md">
                    <h1 className="font-extrabold">About</h1>
                    <p>
                        I'm a passionate software engineer who enjoys coding and exploring new technologies. In addition
                        to my love for programming, I have a diverse set of hobbies that includes sports, reading books,
                        and learning languages.
                    </p>
                    <ul>
                        <li>💻 Software Developer by profession, coding enthusiast by passion.</li>
                        <li>📚 I'm an avid reader and always open to book recommendations.</li>
                        <li>⚽ I enjoy doing sports, especially strength training and calisthenics.</li>
                        <li>🌍 I'm learning English and French, while Polish is my native language.</li>
                    </ul>
                    <h1 className="font-extrabold">Experience</h1>
                    <p>Dev And Deliver, Cracow - Software Engineer</p>
                    <p>June 2021 - December 2023</p>
                    <p>Played a pivotal role as a software engineer within a dynamic team, focusing on the development and maintenance of applications using microservices architecture.</p>
                    <p>Led the integration efforts with numerous external services, ensuring seamless connectivity and functionality across multiple platforms.</p>
                    <p>Spearheaded the design and implementation of a GraphQL API, enhancing data querying capabilities and streamlining communication between various components of the system.</p>
                    <p>Collaborated closely with cross-functional teams to architect, build, and optimize microservices, contributing to a more scalable and robust infrastructure.</p>
                    <p>Employed best practices and cutting-edge technologies to ensure high performance, security, and maintainability within the microservices ecosystem.</p>
                    <p>Actively participated in code reviews, debugging sessions, and continuous integration processes to maintain code quality and foster a collaborative development environment.</p>
                    <h1 className="font-extrabold">Education</h1>
                    <p>Cracow University of Technology, Cracow – Computer Science</p>
                    <p>October 2021 – Present</p>
                    <p>
                        Focusing on designing and constructing modern solutions for practical
                        problems in computer science and digital electronics.
                    </p>
                    <p>
                        Actively participated in the Cosmo PK student group as a software
                        developer, contributing to projects involving space experimentation,
                        measuring probes and cube satellites.
                    </p>
                    <p>University of Science and Technology, Cracow – Electronics</p>
                    <p>October 2020 – September 2021</p>
                    <p>
                        Introduced to the basics of electronics and provided me with a
                        foundational understanding of the field.
                    </p>
                    <h1 className="font-extrabold">Pet Projects</h1>
                    <p>Letters and Numbers – Educational Game For Kids</p>
                    <p>
                        Designed and developed an engaging vocalized learning game tailored for
                        Polish children, utilizing gamification techniques to facilitate learning of
                        letters, numbers, basic mathematical equations, and vocabulary
                        Implemented interactive and gamified elements to encourage children's
                        participation and interest in learning, fostering a fun and educational
                        environment that enhances language and math skills in young learners.
                    </p>
                    <p>Carrot Garden – Idle Clicker Game</p>
                    <p>
                        Developed a whimsical idle clicker game featuring humorous Easter eggs,
                        centered around cultivating and collecting carrots and herbs to enhance
                        your virtual garden.
                        Designed and crafted original graphics using hand-drawn pictures on a
                        graphics tablet, creating a visually engaging and unique gaming
                        experience with self-made artwork.
                    </p>
                    <h1 className="font-extrabold">Achievements</h1>
                    <p>mObywatel mHack – Centralny Ośrodek Informatyki</p>
                    <p>
                        Our team clinched victory and secured 1st place at the mObywatel mHack,
                        where we proposed and implemented a groundbreaking solution for
                        seamless complaint submissions, warranty requests, and product defect
                        monitoring within the government application mObywatel. Our
                        innovative integration with the Office of Competition and Consumer
                        Protection garnered us the top prize in this hackathon.
                    </p>
                    <p>Kościuszkon – University of Science and Technology</p>
                    <p>
                        Our team secured 3rd place at the Kościuszko Hackathon by developing a
                        real-time chat platform designed to provide mental health support. Our
                        solution featured an AI-powered assistant, enabling immediate
                        assistance in scenarios where a specialist was unavailable at the moment.
                    </p>

                </div>
            </div>
        </main>
    )
}
