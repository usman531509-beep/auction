import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Car from "../models/Car";
import Brand from "../models/Brand";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing");
  await mongoose.connect(uri);

  const adminEmail = "admin@carstore.test";
  const userEmail = "user@carstore.test";

  const [admin] = await Promise.all([
    User.findOneAndUpdate(
      { email: adminEmail },
      {
        name: "Store Admin",
        email: adminEmail,
        password: await bcrypt.hash("admin123", 12),
        role: "admin",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ),
    User.findOneAndUpdate(
      { email: userEmail },
      {
        name: "Demo Customer",
        email: userEmail,
        password: await bcrypt.hash("user123", 12),
        role: "user",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ),
  ]);

  const brandNames = ["BMW", "Porsche", "Audi", "Mercedes", "Ford", "Tesla", "Toyota"];
  for (const name of brandNames) {
    await Brand.findOneAndUpdate({ name }, { name }, { upsert: true, setDefaultsOnInsert: true });
  }

  const samples = [
    {
      title: "2019 BMW M4 Competition",
      brand: "BMW",
      carModel: "M4",
      year: 2019,
      description: "Low-mileage M4 with carbon roof and full service history.",
      price: 6300000,
      mileage: 32000,
      color: "Alpine White",
      transmission: "automatic" as const,
      fuel: "petrol" as const,
      images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200"],
      featured: true,
    },
    {
      title: "2021 Porsche 911 Carrera S",
      brand: "Porsche",
      carModel: "911",
      year: 2021,
      description: "Guards Red, PDK, Sport Chrono pack.",
      price: 14700000,
      mileage: 18000,
      color: "Guards Red",
      transmission: "automatic" as const,
      fuel: "petrol" as const,
      images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200"],
      featured: true,
    },
    {
      title: "2018 Audi RS5",
      brand: "Audi",
      carModel: "RS5",
      year: 2018,
      description: "Nardo Grey, immaculate condition.",
      price: 5700000,
      mileage: 41000,
      color: "Nardo Grey",
      transmission: "automatic" as const,
      fuel: "petrol" as const,
      images: ["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200"],
    },
    {
      title: "2020 Mercedes-AMG C63",
      brand: "Mercedes",
      carModel: "C63",
      year: 2020,
      description: "AMG Driver's Package, pano roof.",
      price: 7800000,
      mileage: 25000,
      color: "Obsidian Black",
      transmission: "automatic" as const,
      fuel: "petrol" as const,
      images: ["https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200"],
    },
    {
      title: "2017 Ford Mustang GT",
      brand: "Ford",
      carModel: "Mustang",
      year: 2017,
      description: "5.0 V8, manual transmission, performance package.",
      price: 3300000,
      mileage: 55000,
      color: "Race Red",
      transmission: "manual" as const,
      fuel: "petrol" as const,
      images: ["https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=1200"],
    },
    {
      title: "2022 Tesla Model S Plaid",
      brand: "Tesla",
      carModel: "Model S",
      year: 2022,
      description: "Tri-motor, 1,020 hp, full self-driving.",
      price: 13400000,
      mileage: 12000,
      color: "Pearl White",
      transmission: "automatic" as const,
      fuel: "electric" as const,
      images: ["https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200"],
      featured: true,
    },
  ];

  await Car.deleteMany({ createdBy: admin!._id });
  for (const s of samples) {
    await Car.create({
      ...s,
      stock: 1,
      status: "available",
      createdBy: admin!._id,
    });
  }

  console.log("Seeded:");
  console.log("  admin:", adminEmail, "/ admin123");
  console.log("  user :", userEmail, "/ user123");
  console.log("  cars :", samples.length);
  console.log("  brands:", brandNames.length);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
