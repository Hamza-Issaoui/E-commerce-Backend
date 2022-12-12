const mongoose = require("mongoose");
const schemaSubCategory = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      //relation between category and subCategory
      type: mongoose.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    // insert table products  subCategory
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);


module.exports = mongoose.model("subcategories", schemaSubCategory);


