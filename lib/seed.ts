import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/prabal-dev";

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  // Seed admin user
  const userCollection = mongoose.connection.collection("users");
  const existingUser = await userCollection.findOne({ email: "prabaltripathiofficial@gmail.com" });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("Kx9$mR#vL2@nZp!Q4wF8", 12);
    await userCollection.insertOne({
      name: "Prabal Tripathi",
      email: "prabaltripathiofficial@gmail.com",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Admin user created");
  } else {
    console.log("Admin user already exists");
  }

  // Seed portfolio
  const portfolioCollection = mongoose.connection.collection("portfolios");
  const existingPortfolio = await portfolioCollection.findOne({});
  if (!existingPortfolio) {
    await portfolioCollection.insertOne({
      name: "Prabal Tripathi",
      title: "Software Engineer",
      tagline: "Building scalable systems & crafting elegant code. SDE @ Keploy | GSoC Mentor | Full-Stack Engineer",
      bio: "I'm a Software Engineer at Keploy Inc, where I architect scalable multi-pod setups, implement security-first solutions, and optimize performance across the stack. As a Google Summer of Code 2025 Mentor, I guide contributors on building intelligent code analysis tools. I'm passionate about distributed systems, developer tooling, and building products that make a real impact.",
      email: "prabaltripathiofficial@gmail.com",
      phone: "+91-8299085201",
      location: "Bengaluru, India",
      avatarUrl: "",
      resumeUrl: "",
      socialLinks: {
        github: "https://github.com/prabaltripathi",
        linkedin: "https://linkedin.com/in/prabaltripathiofficial",
        twitter: "",
        leetcode: "https://leetcode.com/prabaltripathi",
      },
      skills: [
        { name: "Java", category: "Languages" },
        { name: "GoLang", category: "Languages" },
        { name: "JavaScript", category: "Languages" },
        { name: "TypeScript", category: "Languages" },
        { name: "Python", category: "Languages" },
        { name: "SQL", category: "Languages" },
        { name: "Next.js", category: "Frontend" },
        { name: "React.js", category: "Frontend" },
        { name: "Tailwind CSS", category: "Frontend" },
        { name: "Node.js", category: "Backend" },
        { name: "Express", category: "Backend" },
        { name: "GraphQL", category: "Backend" },
        { name: "WebRTC", category: "Backend" },
        { name: "Socket.io", category: "Backend" },
        { name: "MongoDB", category: "Database" },
        { name: "MySQL", category: "Database" },
        { name: "Redis", category: "Database" },
        { name: "Docker", category: "DevOps" },
        { name: "Git", category: "DevOps" },
        { name: "SigNoz", category: "DevOps" },
        { name: "Vercel", category: "DevOps" },
      ],
      experience: [
        {
          company: "Keploy Inc",
          role: "Software Engineer 1",
          location: "Bengaluru, Karnataka",
          period: "April 2025 – Present",
          description: [
            "Architected scalable Multi-POD setup with MongoDB Change Streams and CQRS, enabling efficient data sync and modular deployments",
            "Implemented Rate Limiting in the API Test Generation (ATG) tool to prevent resource exhaustion while ensuring consistent response times",
            "Resolved 5 major security vulnerabilities, enabling critical security certifications and strengthening client POCs",
            "Migrated authentication from Local Storage to HTTP-only cookies for improved security across integrations",
            "Developed custom logging with trace IDs using SigNoz, enhancing observability and accelerating root cause identification",
            "Optimized UI performance by revamping pages and implementing Recycler List View, reducing DOM load and improving render efficiency",
          ],
          current: true,
        },
        {
          company: "Google Summer of Code – Keploy",
          role: "GSoC 2025 Mentor",
          location: "Remote",
          period: "May 2025 – Present",
          description: [
            "Mentored GSoC 2025 project on 'Code Reviewer Bot', leveraging static and dynamic analysis for automated code reviews",
            "Developed architecture of the Code Reviewer Bot, ensuring seamless integration between Go backend and dynamic Ollama models",
            "Enhanced bot capabilities with robust static code analysis, improving bug detection and enforcing coding standards",
          ],
          current: true,
        },
      ],
      projects: [
        {
          title: "BroBot",
          description: "An LLM aggregator integrating responses from ChatGPT, DeepSeek, and Claude for unified insights. Built with Next.js and TypeScript, leveraging SSR and modular architecture with GraphQL APIs.",
          techStack: ["Next.js", "TypeScript", "GraphQL", "Vercel"],
          githubUrl: "https://github.com/prabaltripathi",
          liveUrl: "",
          image: "",
          featured: true,
        },
        {
          title: "Convo-Connect",
          description: "Real-time communication platform using WebRTC for video/audio interactions with Socket.io for signaling and messaging. Features secured CORS and HOF-based AuthGuards.",
          techStack: ["WebRTC", "Socket.io", "Node.js", "React"],
          githubUrl: "https://github.com/prabaltripathi",
          liveUrl: "",
          image: "",
          featured: true,
        },
      ],
      achievements: [
        {
          title: "Google Summer of Code 2025 Mentor",
          description: "Mentoring under Keploy for the project 'Code Reviewer Bot'",
          year: "2025",
        },
        {
          title: "HackWithInfy 2024 – Specialist Programmer",
          description: "Selected as Specialist Programmer at Infosys through HackWithInfy 2024",
          year: "2024",
        },
        {
          title: "IIT Kanpur Parliamentary Debate Winner",
          description: "Winner of IIT Kanpur's Parliamentary Debate in Antaragni 2023",
          year: "2023",
        },
      ],
      education: [
        {
          institution: "Dr. A P J Abdul Kalam Technical University (AKTU)",
          degree: "Bachelor of Technology in Computer Science and Engineering",
          period: "Nov 2021 – May 2025",
          gpa: "7.89/10",
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Portfolio data seeded");
  } else {
    console.log("Portfolio already exists");
  }

  // Seed a sample blog post
  const postsCollection = mongoose.connection.collection("posts");
  const existingPost = await postsCollection.findOne({});
  if (!existingPost) {
    await postsCollection.insertOne({
      title: "Building Scalable Systems with MongoDB Change Streams",
      slug: "building-scalable-systems-mongodb-change-streams",
      excerpt: "A deep dive into how we architected a multi-pod setup using MongoDB Change Streams and CQRS pattern at Keploy, enabling efficient data synchronization across distributed services.",
      content: `# Building Scalable Systems with MongoDB Change Streams

When you're working on a platform that needs to scale horizontally, one of the biggest challenges is keeping data in sync across multiple service instances. At **Keploy**, I tackled this exact problem by implementing a **Multi-POD setup** using MongoDB Change Streams and the CQRS pattern.

## The Problem

Our API Test Generation tool was growing fast. A single instance couldn't handle the load, and we needed to:

- Scale horizontally across multiple pods
- Keep data consistent across all instances
- Maintain real-time sync without polling
- Handle failures gracefully

## The Solution: Change Streams + CQRS

### What are MongoDB Change Streams?

Change Streams allow applications to access real-time data changes. Think of them as a firehose of every insert, update, delete, and replace operation happening in your database.

\`\`\`javascript
const changeStream = collection.watch();
changeStream.on('change', (change) => {
  console.log('Something changed:', change);
});
\`\`\`

### Implementing CQRS

We separated our read and write models:

\`\`\`go
// Write Model - handles all mutations
type WriteModel struct {
    db *mongo.Database
    publisher EventPublisher
}

// Read Model - optimized for queries
type ReadModel struct {
    cache *redis.Client
    db    *mongo.Database
}
\`\`\`

## Key Takeaways

1. **Change Streams are powerful** - They provide a reliable way to react to data changes
2. **CQRS adds complexity** - Only use it when you genuinely need to scale reads and writes independently
3. **Error handling is crucial** - Always implement resume tokens for change streams
4. **Monitor everything** - We used SigNoz with custom trace IDs for observability

## Results

After implementing this architecture:
- **3x improvement** in request handling capacity
- **Zero data inconsistencies** across pods
- **Sub-second sync** between instances

The key lesson? Don't over-engineer early, but when you need to scale, MongoDB Change Streams + CQRS is a battle-tested combination.

---

*Have questions about scaling MongoDB? Drop a comment below!*`,
      coverImage: "",
      tags: ["MongoDB", "System Design", "Backend", "Scalability"],
      category: "Engineering",
      status: "published",
      readingTime: 5,
      views: 0,
      author: "Prabal Tripathi",
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Sample blog post created");
  }

  await mongoose.disconnect();
  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
