const route = require("express").Router();
const subCategoryController = require("../Controllers/subCategoryController");

route.post("/createSubCategory", subCategoryController.createSubCategory);
route.get("/GetAllSubCategories", subCategoryController.GetAllSubCategories);
route.get("/GetSubCategoryById/:id", subCategoryController.GetSubCategoryById);
route.get("/GetSubCategoryByName", subCategoryController.GetSubCategoryByName);
route.put("/UpdateSubCategory/:id", subCategoryController.UpdateSubCategory);
route.delete("/deleteSubCategory/:id", subCategoryController.deleteSubCategory);
route.get("/GetSubCategoryByCategory", subCategoryController.GetSubCategoryByCategory);

module.exports = route;
