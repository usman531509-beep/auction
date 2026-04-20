import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Auction from "../models/Auction";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing");
  await mongoose.connect(uri);

  const adminEmail = "admin@drivebid.test";
  const userEmail = "user@drivebid.test";

  const [admin, user] = await Promise.all([
    User.findOneAndUpdate(
      { email: adminEmail },
      {
        name: "Admin",
        email: adminEmail,
        password: await bcrypt.hash("admin123", 12),
        role: "admin",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ),
    User.findOneAndUpdate(
      { email: userEmail },
      {
        name: "Demo User",
        email: userEmail,
        password: await bcrypt.hash("user123", 12),
        role: "user",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ),
  ]);

  const now = Date.now();
  const samples = [
    {
      title: "2019 BMW M4 Competition",
      brand: "BMW",
      carModel: "M4",
      year: 2019,
      description: "Low-mileage M4 with carbon roof and full service history.",
      startingPrice: 6300000,
      images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200"],
      hoursLeft: 48,
    },
    {
      title: "2021 Porsche 911 Carrera S",
      brand: "Porsche",
      carModel: "911",
      year: 2021,
      description: "Guards Red, PDK, Sport Chrono pack.",
      startingPrice: 14700000,
      images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200"],
      hoursLeft: 24,
    },
    {
      title: "2018 Audi RS5",
      brand: "Audi",
      carModel: "RS5",
      year: 2018,
      description: "Nardo Grey, immaculate condition.",
      startingPrice: 5700000,
      images: ["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200"],
      hoursLeft: 72,
    },
    {
      title: "2020 Mercedes-AMG C63",
      brand: "Mercedes",
      carModel: "C63",
      year: 2020,
      description: "AMG Driver's Package, pano roof.",
      startingPrice: 7800000,
      images: ["https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200"],
      hoursLeft: 6,
    },
    {
      title: "2017 Ford Mustang GT",
      brand: "Ford",
      carModel: "Mustang",
      year: 2017,
      description: "5.0 V8, manual transmission, performance package.",
      startingPrice: 3300000,
      images: ["https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1200"],
      hoursLeft: 36,
    },
    {
      title: "2022 Tesla Model S Plaid",
      brand: "Tesla",
      carModel: "Model S",
      year: 2022,
      description: "Tri-motor, 1,020 hp, full self-driving.",
      startingPrice: 13400000,
      images: ["https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200"],
      hoursLeft: 96,
    },
  ];

  await Auction.deleteMany({ createdBy: admin!._id });
  for (const s of samples) {
    await Auction.create({
      title: s.title,
      brand: s.brand,
      carModel: s.carModel,
      year: s.year,
      description: s.description,
      images: s.images,
      startingPrice: s.startingPrice,
      currentPrice: s.startingPrice,
      startTime: new Date(now - 60 * 60 * 1000),
      endTime: new Date(now + s.hoursLeft * 60 * 60 * 1000),
      status: "active",
      createdBy: admin!._id,
    });
  }

  console.log("Seeded:");
  console.log("  admin:", adminEmail, "/ admin123");
  console.log("  user :", userEmail, "/ user123");
  console.log("  auctions:", samples.length);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
