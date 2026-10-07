import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import dotenv from "dotenv";
dotenv.config();
// ===============================
// CONNECT TO DB
// ===============================
await connectDB();

try {
  // ===============================
  // GET CATEGORIES
  // ===============================
  const ringsCategory = await Category.findOne({ name: "Rings" });
  const necklacesCategory = await Category.findOne({ name: "Necklaces" });
  const earringsCategory = await Category.findOne({ name: "Earrings" });
  const braceletsCategory = await Category.findOne({ name: "Bracelets" });

  if (!ringsCategory || !necklacesCategory || !earringsCategory || !braceletsCategory) {
    throw new Error("❌ One or more categories not found. Insert categories first.");
  }

  // ===============================
  // COMMON IMAGES (4 per product)
  // ===============================
  const commonImages = [
    "1769520110989-Ring.jpeg",
    "1769521675156-Rings1.jpeg",
    "1769521675157-Ring2.jpeg",
    "1769521675157-Ring3.jpeg"
  ];

  // ===============================
  // PRODUCTS DATA
  // ===============================
  const products = [
    // ========= RINGS =========
    {
      name: "Classic Gold Ring",
      price: 299.99,
      description: "Elegant classic gold ring perfect for any occasion. Made from 18k gold with polished finish.",
      image: commonImages,
      stock: 50,
      categoryId: ringsCategory._id,
      categoryName: ringsCategory.name
    },
    {
      name: "Diamond Engagement Ring",
      price: 899.99,
      description: "Stunning diamond engagement ring with brilliant cut center stone and pavé band.",
      image: commonImages,
      stock: 15,
      categoryId: ringsCategory._id,
      categoryName: ringsCategory.name
    },
    {
      name: "Silver Statement Ring",
      price: 149.99,
      description: "Bold sterling silver ring with intricate filigree design and oxidized finish.",
      image: commonImages,
      stock: 35,
      categoryId: ringsCategory._id,
      categoryName: ringsCategory.name
    },

    // ========= NECKLACES =========
    {
      name: "Pearl Pendant Necklace",
      price: 399.99,
      description: "Timeless pearl pendant necklace with 18k white gold chain and cultured pearl.",
      image: commonImages,
      stock: 25,
      categoryId: necklacesCategory._id,
      categoryName: necklacesCategory.name
    },
    {
      name: "Diamond Tennis Necklace",
      price: 2499.99,
      description: "Luxurious diamond tennis necklace with brilliant cut diamonds in platinum setting.",
      image: commonImages,
      stock: 8,
      categoryId: necklacesCategory._id,
      categoryName: necklacesCategory.name
    },
    {
      name: "Gold Chain Necklace",
      price: 599.99,
      description: "Classic 14k gold chain necklace available in multiple lengths and styles.",
      image: commonImages,
      stock: 40,
      categoryId: necklacesCategory._id,
      categoryName: necklacesCategory.name
    },

    // ========= EARRINGS =========
    {
      name: "Diamond Stud Earrings",
      price: 799.99,
      description: "Elegant diamond stud earrings with brilliant cut diamonds in 18k gold settings.",
      image: commonImages,
      stock: 20,
      categoryId: earringsCategory._id,
      categoryName: earringsCategory.name
    },
    {
      name: "Hoop Earrings Gold",
      price: 299.99,
      description: "Classic gold hoop earrings perfect for everyday wear and special occasions.",
      image: commonImages,
      stock: 45,
      categoryId: earringsCategory._id,
      categoryName: earringsCategory.name
    },
    {
      name: "Chandelier Drop Earrings",
      price: 449.99,
      description: "Elegant chandelier drop earrings with crystal accents and silver finish.",
      image: commonImages,
      stock: 30,
      categoryId: earringsCategory._id,
      categoryName: earringsCategory.name
    },

    // ========= BRACELETS =========
    {
      name: "Tennis Bracelet",
      price: 1899.99,
      description: "Stunning diamond tennis bracelet with brilliant cut stones in 18k white gold.",
      image: commonImages,
      stock: 12,
      categoryId: braceletsCategory._id,
      categoryName: braceletsCategory.name
    },
    {
      name: "Charm Bracelet",
      price: 349.99,
      description: "Personalizable silver charm bracelet with various decorative charms included.",
      image: commonImages,
      stock: 55,
      categoryId: braceletsCategory._id,
      categoryName: braceletsCategory.name
    },
    {
      name: "Bangle Set Gold",
      price: 699.99,
      description: "Set of three 14k gold bangles with textured finishes and elegant design.",
      image: commonImages,
      stock: 18,
      categoryId: braceletsCategory._id,
      categoryName: braceletsCategory.name
    }
  ];

  // ===============================
  // INSERT PRODUCTS
  // ===============================
  await Product.insertMany(products);

  console.log("✅ Products inserted successfully");
  process.exit(0);

} catch (error) {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
}
