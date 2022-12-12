const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
      trim: true,
  },
  description: {
      type: String,
      required: true,
      trim: true,
  },
});
const schemaProduct = new mongoose.Schema(
  {
    ref: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      
    },

    galleries: [
      GallerySchema
    ],

    qte: {
      type: Number,
      required: true,
    },
    
    subCategory: {
        type:mongoose.Types.ObjectId,
        ref: 'subcategories',
        required: true
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", schemaProduct);

