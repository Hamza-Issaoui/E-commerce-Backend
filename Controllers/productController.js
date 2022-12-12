const Product = require("../Models/Product");
const SubCategory = require("../Models/SubCategory");

module.exports = {
  createProduct: async (req, res) => {

    try { 
      req.body['galleries'] = req.files.length <= 0 ? [] : req.files.map(function(file) {
        return { name: file.filename, description: "add prod" };
    });  // insert pictures 
      const newProduct = new Product(req.body);
      const product = await newProduct.save();

      await SubCategory.findByIdAndUpdate(req.body.subCategory,
      { $push: { products: product} } ); // insert product in subCategory by id
      res.status(201).json({ msg: "Product created !", data: newProduct });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  GetAllProducts: async (req, res) => {
    try {
      const listeProducts = await Product.find().populate("subCategory");
      res.status(200).json({
        msg: "read all products",
        data: listeProducts,
      });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  GetProductById: async (req, res) => {
    try {
      const product = await Product.findById({
        _id: req.params.id,
      }).populate("subCategory");
      res.status(200).json({
        msg: "Product found by id",
        data: product,
      });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  ProductByRef: async (req, res, next) => {
    let { q } = req.query;

    let data = await Product.find({
      $or: [
        { ref: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    });
    res.status(201).json(data);
  },
  UpdateProduct: async (req, res) => {
    try {
      req.body['galleries'] = !req.files ? [] : req.files.map((file) =>file.filename); // insert pictures 

      await Product.updateOne(
        {
          _id: req.params.id,
        },
        req.body
      );
      res.status(200).json({
        msg: "Product update",
      });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      // delete the product in subCategory
      const prod = await Product.findById({_id: req.params.id});

      await SubCategory.findByIdAndUpdate(prod.subCategory, {
        $pull: { products: prod._id},
      })
     await Product.deleteOne({
        _id: req.params.id,
      });
      
      res.status(200).json({
        msg: "product deleted",
      });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  GetProductBySubCategory: async (req, res) => {
    try {
      const listproducts = await Product.find({
        subCategory: req.query.subCategory,
      }).populate("subCategory");
      res.status(200).json({
        msg: "read Products",
        data: listproducts,
      });
    } catch (error) {
      res.status(406).json({ status: 406, msg: error.message });
    }
  },
};
