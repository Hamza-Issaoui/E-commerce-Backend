const route = require("express").Router();
const authController = require("../Controllers/authController");
const uploadImage = require("../Middlewares/UploadImage"); // importation du ficher uploadImage
const check_auth = require("../Middlewares/chek_authentification");
const passport = require("passport");
require("../Middlewares/passport_authentification").passport; // as strategy in passport

route.post(
  "/registerAdmin",
  uploadImage.single("photo"),
  authController.registerAdmin
);
route.post(
  "/registerCustomer",
  uploadImage.single("photo"),
  authController.registerCustomer
);
route.get("/verify-now/:verificationCode", authController.verifyEmail);
route.post("/login", authController.logIn);
route.get("/getAllUsers", authController.GetAllCustomers);
route.delete("/deleteUser/:id", authController.deleteUser);
route.post("/refreshToken", check_auth, authController.refreshToken);
//route.get('/profile',check_auth, authController.profile);
//route.put('/updateProfile',check_auth, authController.updateProfile);
route.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  authController.profile
);
route.put("/updateProfile/:id",uploadImage.single("photo"), authController.updateProfile);
route.get("/UserByName", authController.UserByName)
route.get("/getByName", authController.GetUserByName)
route.get("/getOne/:id", authController.GetUserById);
route.delete(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  authController.logout
);

route.post("/forgetPassword", authController.forgetPassword);
route.post("/resetPassword/:resetPassWordToken", authController.resetPassword);

module.exports = route;
