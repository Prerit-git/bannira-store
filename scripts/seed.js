const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const CLIENT_URI = "MONGO_DB_URI";

const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

async function seedData() {
  try {
    console.log("Connecting to Client's MongoDB Atlas...");
    await mongoose.connect(CLIENT_URI);
    console.log("Connected Successfully! ✅");

    const filePath = path.join(__dirname, "products.json");
    const products = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    console.log("Cleaning existing products...");
    await Product.deleteMany({});

    console.log(`Inserting ${products.length} products...`);
    await Product.insertMany(products);

    console.log("✅ Data pushed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error occured:", error);
    process.exit(1);
  }
}

seedData();