import mongoose from "mongoose";
import { Event } from "./models/Event";
import { Score } from "./models/Score";
import { User } from "./models/User";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/macfiesta";

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
    console.log("Connected to MongoDB database successfully.");
    await seedDatabase();
  } catch (error) {
    console.warn("Database connection failure. Running server in Local In-Memory Fallback Mode.");
  }
}

async function seedDatabase() {
  try {
    // 1. Seed Events
    const eventCount = await Event.countDocuments();
    let seededEvents: any[] = [];
    if (eventCount === 0) {
      console.log("Seeding default events...");
      const eventsToSeed = [
        {
          title: "Urumi Gaming Arena",
          slug: "urumi-gaming",
          description: "Prepare your triggers and coordination as we host the ultimate esports arena showdown. Featuring competitive lobbies in Valorant, BGMI and FIFA formats.",
          rules: [
            "All squad members must belong to the same college/institution.",
            "Players must bring their own mobile devices, charging adapters, and headsets.",
            "Emulators are strictly prohibited for BGMI battles.",
            "Decisions of the gaming coordinators are final and binding."
          ],
          coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
          date: "24 Sep 2026",
          time: "Day 1, 11:00 AM onwards",
          venue: "MACFAST Esports Lounge",
          category: "gaming",
          type: "squad",
          prizePool: 30000,
          maxSeats: 8,
          registeredCount: 0,
          isLive: true,
          coordinator: {
            name: "Abhijith R.",
            phone: "+91 94470 12345",
            email: "abhijith@macfast.org"
          }
        },
        {
          title: "Dusk 'N Dawn Concert",
          slug: "dusk-n-dawn",
          description: "MacFiesta's signature ending performance featuring national music tracks, DJ battles, and EDM showcase from guest artists.",
          rules: [
            "Gates open at 05:30 PM. Unified entry pass / QR badge is mandatory.",
            "Alcohol, smoking, and narcotic substances are strictly prohibited inside the grounds.",
            "Outside food or metal items are not allowed.",
            "Re-entry is allowed only under coordinator authorization."
          ],
          coverImage: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop",
          date: "25 Sep 2026",
          time: "Day 2, 06:00 PM - 10:00 PM",
          venue: "Main Campus Athletic Grounds",
          category: "cultural",
          type: "group",
          prizePool: 50000,
          maxSeats: 120,
          registeredCount: 0,
          isLive: false,
          coordinator: {
            name: "Suresh Pillai",
            phone: "+91 94470 54321",
            email: "suresh@macfast.org"
          }
        },
        {
          title: "Byte & Code Hackathon",
          slug: "byte-and-code",
          description: "24-hour design and code sprint where developers form teams to construct digital solutions addressing real-world problem statements.",
          rules: [
            "Work must be started from scratch. Pre-built templates are disqualified.",
            "All code must be committed to a public GitHub repository.",
            "Teams must present their live demonstration before the panel.",
            "Use of open source libraries is encouraged with attribution."
          ],
          coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
          date: "24 Sep 2026",
          time: "Day 1, 10:00 AM onwards",
          venue: "MACFAST Computer Labs",
          category: "technical",
          type: "duo",
          prizePool: 25000,
          maxSeats: 12,
          registeredCount: 0,
          isLive: true,
          coordinator: {
            name: "Anjali Mathew",
            phone: "+91 94470 98765",
            email: "anjali@macfast.org"
          }
        }
      ];
      seededEvents = await Event.insertMany(eventsToSeed);
      console.log(`Seeded ${seededEvents.length} events successfully.`);
    } else {
      seededEvents = await Event.find();
    }

    // 2. Seed Scoreboards
    const scoreCount = await Score.countDocuments();
    if (scoreCount === 0) {
      console.log("Seeding default scoreboards...");
      const gamingEvent = seededEvents.find(e => e.slug === "urumi-gaming");
      const codingEvent = seededEvents.find(e => e.slug === "byte-and-code");

      const scoresToSeed = [];

      if (gamingEvent) {
        scoresToSeed.push({
          eventId: gamingEvent._id,
          teams: [
            { rank: 1, name: "Apex Overlords", college: "CET Trivandrum", score: 95 },
            { rank: 2, name: "Silent Killers", college: "MACFAST Tiruvalla", score: 80 },
            { rank: 3, name: "Hyper Void", college: "TKM Kollam", score: 78 },
            { rank: 4, name: "Nexus Knights", college: "SJCET Pala", score: 60 }
          ],
          isLive: true
        });
      }

      if (codingEvent) {
        scoresToSeed.push({
          eventId: codingEvent._id,
          teams: [
            { rank: 1, name: "Byte Busters", college: "MACFAST Tiruvalla", score: 400 },
            { rank: 2, name: "Syntax Sorcerers", college: "AJCE Kanjirappally", score: 380 },
            { rank: 3, name: "Null Pointers", college: "MITS Kochi", score: 320 },
            { rank: 4, name: "Stack Overflowers", college: "CET Trivandrum", score: 250 }
          ],
          isLive: true
        });
      }

      if (scoresToSeed.length > 0) {
        await Score.insertMany(scoresToSeed);
        console.log("Seeded default scores successfully.");
      }
    }

    // 3. Seed Default Admin & Student Users
    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      console.log("Seeding default admin user...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      await User.create({
        name: "Admin User",
        email: "admin@macfast.org",
        password: hashedPassword,
        phone: "+91 99999 99999",
        college: "MACFAST Tiruvalla",
        department: "Management",
        year: "Faculty",
        role: "admin",
        xpPoints: 1000,
        badges: [{ id: "god-mode", name: "Grand Organizer" }]
      });
      console.log("Seeded default admin user successfully.");
    }

    const studentUser = await User.findOne({ email: "student@macfast.org" });
    if (!studentUser) {
      console.log("Seeding default student user...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("student123", salt);
      await User.create({
        name: "Joel Shaji",
        email: "student@macfast.org",
        password: hashedPassword,
        phone: "+91 94470 99999",
        college: "MACFAST Tiruvalla",
        department: "Computer Applications",
        year: "MCA 2nd Year",
        role: "student",
        xpPoints: 120,
        badges: [{ id: "newcomer", name: "Festival Pioneer" }]
      });
      console.log("Seeded default student user successfully.");
    }
  } catch (error) {
    console.error("Database seeding failure:", error);
  }
}
