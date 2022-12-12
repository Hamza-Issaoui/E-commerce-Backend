const SubCategory = require("../Models/SubCategory");
const Category = require("../Models/Category");

module.exports = {
  createSubCategory: async (req, res) => {
    
    try {
      const newSubCategory = new SubCategory(req.body);
      const subCategory = await newSubCategory.save();

      await Category.findByIdAndUpdate(req.body.category,
        { $push: { subCategories: subCategory } } );
      res
        .status(201)
        .json({ msg: "SubCategory created !", data: newSubCategory });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  GetAllSubCategories: async (req, res) => {
    try {
      const listeSubCategories = await SubCategory.find({}).populate("category").populate("products");
      res.status(200).json({
        msg: "read all SubCategories",
        data: listeSubCategories,
      });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  GetSubCategoryById: async (req, res) => {
    try {
      const subCategory = await SubCategory.findById({
        _id: req.params.id,
      }).populate("category").populate("products");
      res.status(200).json({
        msg: "SubCategory found by id",
        data: subCategory,
      });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  GetSubCategoryByName: async (req, res, next) => {
    let { q } = req.query;

    let data = await SubCategory.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    });
    res.status(201).json(data);
  },
  UpdateSubCategory: async (req, res) => {
    try {
      await SubCategory.updateOne(
        {
          _id: req.params.id,
        },
        req.body
      );
      res.status(200).json({
        msg: "SubCategory updated",
      });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  deleteSubCategory: async (req, res) => {
    try {
      const sub = await SubCategory.findById({_id: req.params.id});

      await Category.findByIdAndUpdate(sub.category, {
        $pull: { subCategories: sub._id},
      });
      await SubCategory.deleteOne({
        _id: req.params.id,
      });
      
      res.status(200).json({
        msg: "subCategory deleted",
      });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  GetSubCategoryByCategory: async (req, res) => {
    try {
      const listesubcategories = await SubCategory.find({
        category: req.query.category
      }).populate("category");
      res.status(200).json({
        msg: "read SubCategories",
        data: listesubcategories,
      });
    } catch (error) {
      res.status(406).json({ status: 406, msg: error.message });
    }
  },
};
