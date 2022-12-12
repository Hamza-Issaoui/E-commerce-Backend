const Category = require("../Models/Category");
const { populate } = require("../Models/SubCategory");

module.exports = {
  createCategory: async (req, res) => {
    try {
      const newCategory = new Category(req.body);
      await newCategory.save();
      res.status(201).json({ msg: "Category created !", data: newCategory });
    } catch (error) {
      res.status(406).json({ msg: error.msg });
    }
  },
  GetAllCategories: async (req, res) => {
    try {
      const listeCategories = await Category.find().populate("subCategories");
      res.status(200).json({
        msg: "read all category",
        data: listeCategories,
      });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  GetCategoryById: async (req, res) => {
    try {
      const category = await Category.findById({
        _id: req.params.id,
      }).populate("subCategories");
      res.status(200).json({
        msg: "Category found by id",
        data: category,
      });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  GetCategoryByName: async (req, res, next) => {
    let { q } = req.query;

    let data = await Category.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    });
    res.status(201).json(data);
  },
  UpdateCategory: async (req, res) => {
    try {
      //console.log(req.body)
      await Category.updateOne(
        {
          _id: req.params.id,
        },
        req.body
      );
      res.status(200).json({
        msg: "Category update",
      });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
       await Category.deleteOne({
        _id: req.params.id,
      });
      res.status(200).json({
        msg: "category deleted",
      });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
};
