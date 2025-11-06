// prisma/seed.ts
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  // Clean up existing data to ensure a fresh start
  // The order is important to respect foreign key constraints
  await prisma.courseApplication.deleteMany({});
  await prisma.venture.deleteMany({});
  await prisma.story.deleteMany({});
  await prisma.memberProfile.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.kpi.deleteMany({});

  // 1. Seed Users
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@buildbarguna.coop",
      name: "Admin User",
      role: UserRole.ADMIN,
    },
  });

  const editorUser = await prisma.user.create({
    data: {
      email: "editor@buildbarguna.coop",
      name: "Editor User",
      role: UserRole.EDITOR,
    },
  });

  const memberUser = await prisma.user.create({
    data: {
      email: "member@buildbarguna.coop",
      name: "Member User",
      role: UserRole.MEMBER,
      memberProfile: {
        create: {
          nationalId: "1234567890",
          phone: "01700000000",
          address: "Barguna, Bangladesh",
          isApproved: true,
          policyConsent: true,
        }
      }
    },
  });

  console.log(`Created users: admin, editor, member`);

  // 2. Seed Courses (6)
  await prisma.course.createMany({
    data: [
      {
        titleEn: "Digital Marketing for Local Artisans",
        titleBn: "স্থানীয় কারিগরদের জন্য ডিজিটাল মার্কেটিং",
        descriptionEn: "Learn how to market your products online and reach a wider audience.",
        descriptionBn: "আপনার পণ্য অনলাইনে বাজারজাত করতে এবং বৃহত্তর দর্শকের কাছে পৌঁছাতে শিখুন।",
        fee: 1500,
        isScholarshipAvailable: true,
        startDate: new Date("2026-01-10"),
        endDate: new Date("2026-02-10"),
      },
      {
        titleEn: "Advanced Fisheries Value Addition",
        titleBn: "উন্নত মৎস্য মান সংযোজন",
        descriptionEn: "Techniques for processing, packaging, and branding fish products.",
        descriptionBn: "মাছ পণ্য প্রক্রিয়াজাতকরণ, প্যাকেজিং এবং ব্র্যান্ডিংয়ের কৌশল।",
        fee: 2500,
        startDate: new Date("2026-01-15"),
        endDate: new Date("2026-03-15"),
      },
      {
        titleEn: "Sustainable Agro-Food Processing",
        titleBn: "টেকসই কৃষি-খাদ্য প্রক্রিয়াজাতকরণ",
        descriptionEn: "Modern methods for sustainable food processing and preservation.",
        descriptionBn: "টেকসই খাদ্য প্রক্রিয়াজাতকরণ এবং সংরক্ষণের আধুনিক পদ্ধতি।",
        fee: 2000,
        startDate: new Date("2026-02-01"),
        endDate: new Date("2026-03-01"),
      },
      {
        titleEn: "Web Development Fundamentals",
        titleBn: "ওয়েব ডেভেলপমেন্টের মৌলিক বিষয়",
        descriptionEn: "Build modern websites and applications with the latest technologies.",
        descriptionBn: "সর্বশেষ প্রযুক্তি দিয়ে আধুনিক ওয়েবসাইট এবং অ্যাপ্লিকেশন তৈরি করুন।",
        fee: 5000,
        isScholarshipAvailable: true,
        startDate: new Date("2026-02-20"),
        endDate: new Date("2026-05-20"),
      },
      {
        titleEn: "Hospitality and Tourism Management",
        titleBn: "আতিথেয়তা ও পর্যটন ব্যবস্থাপনা",
        descriptionEn: "Skills for managing local tourism ventures and guest services.",
        descriptionBn: "স্থানীয় পর্যটন উদ্যোগ এবং অতিথি সেবা পরিচালনার জন্য দক্ষতা।",
        fee: 3000,
        startDate: new Date("2026-03-05"),
        endDate: new Date("2026-04-05"),
      },
      {
        titleEn: "Co-operative Management & Governance",
        titleBn: "সমবায় ব্যবস্থাপনা ও সুশাসন",
        descriptionEn: "Learn the principles of running a successful and transparent co-operative.",
        descriptionBn: "একটি সফল এবং স্বচ্ছ সমবায় পরিচালনার নীতি শিখুন।",
        fee: 1000,
        startDate: new Date("2026-04-01"),
        endDate: new Date("2026-04-15"),
      },
    ],
  });
  console.log("Seeded 6 courses.");

  // 3. Seed Brands (4)
  await prisma.brand.createMany({
    data: [
      {
        slug: "barguna-foods",
        nameEn: "Barguna Foods",
        nameBn: "বরগুনা ফুডস",
        descriptionEn: "Locally sourced, hygienically processed agro-food products.",
        descriptionBn: "স্থানীয়ভাবে সংগৃহীত, স্বাস্থ্যসম্মতভাবে প্রক্রিয়াজাত কৃষি-খাদ্য পণ্য।",
        logoUrl: "/brands/barguna-foods-logo.png",
      },
      {
        slug: "delta-crafts",
        nameEn: "Delta Crafts",
        nameBn: "ডেল্টা ক্রাফটস",
        descriptionEn: "Handmade crafts from the artisans of the coastal region.",
        descriptionBn: "উপকূলীয় অঞ্চলের কারিগরদের হাতে তৈরি কারুশিল্প।",
        logoUrl: "/brands/delta-crafts-logo.png",
      },
      {
        slug: "seashore-services",
        nameEn: "Seashore Services",
        nameBn: "সীশোর সার্ভিসেস",
        descriptionEn: "Providing reliable local services from plumbing to digital assistance.",
        descriptionBn: "প্লাম্বিং থেকে ডিজিটাল সহায়তা পর্যন্ত নির্ভরযোগ্য স্থানীয় পরিষেবা প্রদান।",
        logoUrl: "/brands/seashore-services-logo.png",
      },
      {
        slug: "barguna-digital-hub",
        nameEn: "Barguna Digital Hub",
        nameBn: "বরগুনা ডিজিটাল হাব",
        descriptionEn: "Your one-stop shop for web design, development, and marketing.",
        descriptionBn: "ওয়েব ডিজাইন, ডেভেলপমেন্ট এবং মার্কেটিংয়ের জন্য আপনার ওয়ান-স্টপ শপ।",
        logoUrl: "/brands/digital-hub-logo.png",
      },
    ],
  });
  console.log("Seeded 4 brands.");

  // 4. Seed Ventures (3)
  await prisma.venture.createMany({
    data: [
       {
        proposerId: memberUser.id,
        titleEn: "Community Fish Drying Yard",
        titleBn: "কমিউনিটি মাছ শুকানোর চত্বর",
        descriptionEn: "A project to establish a modern, hygienic fish drying yard for local fishermen.",
        descriptionBn: "স্থানীয় জেলেদের জন্য একটি আধুনিক, স্বাস্থ্যসম্মত মাছ শুকানোর চত্বর স্থাপনের প্রকল্প।",
        budget: 500000,
        status: "PROPOSED",
      },
      {
        proposerId: memberUser.id,
        titleEn: "Local E-commerce Platform",
        titleBn: "স্থানীয় ই-কমার্স প্ল্যাটফর্ম",
        descriptionEn: "An online marketplace for Barguna's local products.",
        descriptionBn: "বরগুনার স্থানীয় পণ্যের জন্য একটি অনলাইন মার্কেটপ্লেস।",
        budget: 250000,
        status: "APPROVED",
      },
      {
        proposerId: memberUser.id,
        titleEn: "Eco-tourism Rickshaw Service",
        titleBn: "ইকো-ট্যুরিজম রিকশা পরিষেবা",
        descriptionEn: "Offering guided tours to local spots on decorated, eco-friendly rickshaws.",
        descriptionBn: "সজ্জিত, পরিবেশ-বান্ধব রিকশায় স্থানীয় স্থানগুলিতে গাইডেড ট্যুর অফার করা।",
        budget: 150000,
        status: "ACTIVE",
      },
    ]
  });
  console.log("Seeded 3 ventures.");

  // 5. Seed Stories (8)
  await prisma.story.createMany({
    data: [
      {
        slug: "our-journey-begins",
        titleEn: "Our Journey Begins: The Founding of Build Barguna Co-op",
        titleBn: "আমাদের যাত্রা শুরু: বিল্ড বরগুনা কো-অপারেটিভের প্রতিষ্ঠা",
        bodyEn: "## Our Vision\n\nThis is the story of how a group of young individuals decided to take matters into their own hands...",
        bodyBn: "## আমাদের লক্ষ্য\n\nএটি একদল তরুণের নিজেদের হাতে বিষয়গুলি তুলে নেওয়ার গল্প...",
        authorId: adminUser.id,
        publishedAt: new Date(),
      },
      // ... add 7 more stories
       {
        slug: "first-training-success",
        titleEn: "First Training Program a Resounding Success",
        titleBn: "প্রথম প্রশিক্ষণ কর্মসূচির অভূতপূর্ব সাফল্য",
        bodyEn: "Our Digital Marketing course concluded last week with 25 participants graduating...",
        bodyBn: "আমাদের ডিজিটাল মার্কেটিং কোর্স গত সপ্তাহে ২৫ জন অংশগ্রহণকারীর স্নাতকের মাধ্যমে শেষ হয়েছে...",
        authorId: editorUser.id,
        publishedAt: new Date(),
      },
       {
        slug: "why-cooperatives-matter",
        titleEn: "Why Co-operatives Matter for Youth Employment",
        titleBn: "যুব কর্মসংস্থানে সমবায়ের গুরুত্ব",
        bodyEn: "An opinion piece on the power of the co-operative model.",
        bodyBn: "সমবায় মডেলের শক্তি নিয়ে একটি মতামত।",
        authorId: adminUser.id,
        publishedAt: new Date(),
      },
      {
        slug: "barguna-foods-launch",
        titleEn: "Barguna Foods Hits Local Markets",
        titleBn: "বরগুনা ফুডস স্থানীয় বাজারে",
        bodyEn: "Our first brand, Barguna Foods, has officially launched its line of processed fish products.",
        bodyBn: "আমাদের প্রথম ব্র্যান্ড, বরগুনা ফুডস, আনুষ্ঠানিকভাবে প্রক্রিয়াজাত মাছের পণ্য বাজারে এনেছে।",
        authorId: editorUser.id,
        publishedAt: new Date(),
      },
      {
        slug: "member-spotlight-rahim",
        titleEn: "Member Spotlight: The Story of Rahim",
        titleBn: "সদস্য পরিচিতি: রহিমের গল্প",
        bodyEn: "Meet Rahim, a young entrepreneur who joined our co-operative with a dream.",
        bodyBn: "দেখা করুন রহিমের সাথে, একজন তরুণ উদ্যোক্তা যিনি স্বপ্ন নিয়ে আমাদের সমবায়ে যোগ দিয়েছেন।",
        authorId: editorUser.id,
        publishedAt: new Date(),
      },
      {
        slug: "understanding-jips",
        titleEn: "Understanding Joint Investment Projects (JIPs)",
        titleBn: "যৌথ বিনিয়োগ প্রকল্প (JIPs) বোঝা",
        bodyEn: "A deep dive into how our member-pooled investment model works.",
        bodyBn: "আমাদের সদস্য-পুলড বিনিয়োগ মডেল কীভাবে কাজ করে তার একটি গভীর বিশ্লেষণ।",
        authorId: adminUser.id,
        publishedAt: new Date(),
      },
       {
        slug: "digital-hub-services",
        titleEn: "Barguna Digital Hub Launches New Services",
        titleBn: "বরগুনা ডিজিটাল হাব নতুন পরিষেবা চালু করেছে",
        bodyEn: "From web design to social media management, the Digital Hub is ready to serve local businesses.",
        bodyBn: "ওয়েব ডিজাইন থেকে সোশ্যাল মিডিয়া ম্যানেজমেন্ট, ডিজিটাল হাব স্থানীয় ব্যবসাগুলিকে পরিবেশন করতে প্রস্তুত।",
        authorId: editorUser.id,
        publishedAt: new Date(),
      },
       {
        slug: "annual-general-meeting-2025",
        titleEn: "Notice: Annual General Meeting 2025",
        titleBn: "বিজ্ঞপ্তি: বার্ষিক সাধারণ সভা ২০২৫",
        bodyEn: "The AGM will be held on December 15th, 2025. All members are requested to attend.",
        bodyBn: "বার্ষিক সাধারণ সভা ২০২৫ সালের ১৫ই ডিসেম্বর অনুষ্ঠিত হবে। সকল সদস্যকে উপস্থিত থাকার জন্য অনুরোধ করা হচ্ছে।",
        authorId: adminUser.id,
        publishedAt: new Date(),
      },
    ],
  });
  console.log("Seeded 8 stories.");

  // 6. Seed Governance Docs (6)
  await prisma.document.createMany({
    data: [
      { titleEn: "Co-operative By-Laws (Amended 2025)", titleBn: "সমবায় উপ-আইন (সংশোধিত ২০২৫)", fileUrl: "/docs/by-laws-2025.pdf", category: "by-laws", publishedAt: new Date("2025-01-01") },
      { titleEn: "Conflict of Interest Policy", titleBn: "স্বার্থের সংঘাত নীতি", fileUrl: "/docs/coi-policy.pdf", category: "policy", publishedAt: new Date("2025-01-01") },
      { titleEn: "AGM Minutes - Dec 2024", titleBn: "বার্ষিক সাধারণ সভার কার্যবিবরণী - ডিসেম্বর ২০২৪", fileUrl: "/docs/agm-minutes-2024.pdf", category: "minutes", publishedAt: new Date("2024-12-20") },
      { titleEn: "Procurement Guidelines", titleBn: "ক্রয় নির্দেশিকা", fileUrl: "/docs/procurement-guidelines.pdf", category: "policy", publishedAt: new Date("2025-02-01") },
      { titleEn: "Monthly Financials - Oct 2025", titleBn: "মাসিক আর্থিক প্রতিবেদন - অক্টোবর ২০২৫", fileUrl: "/docs/financials-oct-2025.pdf", category: "financials", publishedAt: new Date("2025-11-05") },
      { titleEn: "Member Code of Conduct", titleBn: "সদস্যদের আচরণবিধি", fileUrl: "/docs/code-of-conduct.pdf", category: "by-laws", publishedAt: new Date("2025-01-01") },
    ]
  });
  console.log("Seeded 6 documents.");

  // 7. Seed Testimonials (6)
  await prisma.testimonial.createMany({
    data: [
      {
        quoteEn: "The digital marketing course opened up a new world for my small business. I can't thank BBC enough!",
        quoteBn: "ডিজিটাল মার্কেটিং কোর্সটি আমার ছোট ব্যবসার জন্য একটি নতুন দিগন্ত উন্মোচন করেছে। আমি বিবিসি-কে যথেষ্ট ধন্যবাদ জানাতে পারব না!",
        authorEn: "Fatima Akhtar",
        authorBn: "ফাতেমা আক্তার",
        roleEn: "Trainee & Artisan",
        roleBn: "প্রশিক্ষণার্থী ও কারিগর",
      },
      {
        quoteEn: "Being a member of this co-operative gives me a sense of ownership and hope for the future.",
        quoteBn: "এই সমবায়ের সদস্য হওয়া আমাকে মালিকানার অনুভূতি এবং ভবিষ্যতের জন্য আশা দেয়।",
        authorEn: "Rahim Islam",
        authorBn: "রহিম ইসলাম",
        roleEn: "Member",
        roleBn: "সদস্য",
      },
      // ... add 4 more testimonials
      {
        quoteEn: "The JIP model is innovative. It allows us to pool small resources for a bigger impact.",
        quoteBn: "জেআইপি মডেলটি উদ্ভাবনী। এটি আমাদের ছোট সম্পদগুলিকে একটি বড় প্রভাবের জন্য একত্রিত করতে দেয়।",
        authorEn: "Dr. Anisur Rahman",
        authorBn: "ডঃ আনিসুর রহমান",
        roleEn: "Mentor",
        roleBn: "পরামর্শদাতা",
      },
      {
        quoteEn: "Transparent governance is key, and Build Barguna is setting a great example.",
        quoteBn: "স্বচ্ছ শাসনই মূল বিষয়, এবং বিল্ড বরগুনা একটি দুর্দান্ত উদাহরণ স্থাপন করছে।",
        authorEn: "Sultana Begum",
        authorBn: "সুলতানা বেগম",
        roleEn: "Local Partner",
        roleBn: "স্থানীয় অংশীদার",
      },
      {
        quoteEn: "The training on food processing was practical and directly applicable to my family's business.",
        quoteBn: "খাদ্য প্রক্রিয়াজাতকরণের প্রশিক্ষণটি ব্যবহারিক এবং আমার পারিবারিক ব্যবসার জন্য সরাসরি প্রযোজ্য ছিল।",
        authorEn: "Kamal Hossain",
        authorBn: "কামাল হোসেন",
        roleEn: "Trainee",
        roleBn: "প্রশিক্ষণার্থী",
      },
      {
        quoteEn: "Finally, a platform for the youth of Barguna to collaborate and build something for themselves.",
        quoteBn: "অবশেষে, বরগুনার তরুণদের জন্য নিজেদের জন্য কিছু তৈরি করার এবং সহযোগিতা করার একটি প্ল্যাটফর্ম।",
        authorEn: "Maria Khatun",
        authorBn: "মারিয়া খাতুন",
        roleEn: "Member",
        roleBn: "সদস্য",
      },
    ]
  });
  console.log("Seeded 6 testimonials.");

  // 8. Seed KPIs
  await prisma.kpi.createMany({
    data: [
      { metric: "members_joined", value: 75, labelEn: "Active Members", labelBn: "সক্রিয় সদস্য" },
      { metric: "youth_trained", value: 120, labelEn: "Youth Trained", labelBn: "প্রশিক্ষিত যুবক" },
      { metric: "ventures_funded", value: 5, labelEn: "Ventures Funded", labelBn: "অর্থায়নকৃত উদ্যোগ" },
      { metric: "capital_pooled", value: 1200000, labelEn: "BDT Pooled", labelBn: "টাকা পুলড" },
    ]
  });
  console.log("Seeded 4 KPIs.");


  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
