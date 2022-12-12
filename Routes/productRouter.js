const route = require("express").Router();
const productController = require("../Controllers/productController");
const uploadImage = require('../Middlewares/UploadImage') // import uploadImage file

route.post("/createProduct", uploadImage.array('photos'), productController.createProduct); //ajout de plusieur images 
// upload.single('photo')===une seul image 

route.get("/GetAllProducts", productController.GetAllProducts);
route.get("/GetProductById/:id", productController.GetProductById);
route.get("/GetProductByRef", productController.ProductByRef);
route.put("/UpdateProduct/:id", uploadImage.array('photos'), productController.UpdateProduct);
route.delete("/deleteProduct/:id", productController.deleteProduct);
route.get("/GetProductBySubCategory", productController.GetProductBySubCategory);

module.exports = route;
