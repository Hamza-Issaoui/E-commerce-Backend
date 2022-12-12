const mongoose = require("mongoose");
const User = require("./User");
const schemaCustomer = new mongoose.Schema({
  
    adress: {
        type: String,
        trim: true,
    },
    city: {
        type: String,
        trim: true,
    },
    cin: {
        type: Number,
        required: true,
    
        trim: true,
    },
    orders: [
        {
          type: mongoose.Types.ObjectId,
          ref: "Order",
        },
      ],

},
{timestamps:true}
);
module.exports = User.discriminator("Customer", schemaCustomer);

