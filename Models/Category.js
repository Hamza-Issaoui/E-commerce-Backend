const mongoose = require("mongoose"); // appel du mongoose
const schemaCategory = new mongoose.Schema({ //schema du collection , contenu du collection
name: {
    type: String,
    required: true,
    trim: true,
},
description: {
    type: String,
},
subCategories: [
    {
        type: mongoose.Types.ObjectId,
        ref:'subcategories',
    },
],
},
{timestamps: true}
);
module.exports = mongoose.model("categories", schemaCategory);










