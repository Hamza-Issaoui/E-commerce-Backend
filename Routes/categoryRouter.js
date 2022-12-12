const route = require("express").Router(); //importation
const categoryController = require("../Controllers/categoryController");

route.post("/createCategory", categoryController.createCategory);
route.get("/GetAllCategories", categoryController.GetAllCategories);
route.get("/GetCategoryById/:id", categoryController.GetCategoryById);
route.get("/GetCategoryByName", categoryController.GetCategoryByName);
route.put("/UpdateCategory/:id", categoryController.UpdateCategory);
route.delete("/deleteCategory/:id", categoryController.deleteCategory);
module.exports = route;
