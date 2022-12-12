const route = require("express").Router(); //importation
const orderController = require("../Controllers/orderController");
const check_auth = require("../Middlewares/chek_authentification");

const passport = require("passport");
//require("../Middlewares/passport_authentification").passport; // as strategy in passport

route.post(
  "/createOrder",
  orderController.createOrder
);
route.get(
  "/GetAllOrders",
  orderController.GetAllOrders
);
route.put(
  "/UpdateOrder/:id",
  orderController.UpdateOrder
);
route.get(
  "/GetOrderByCustomer",
  
  orderController.GetOrderByCustomer
);
route.get(
  "/GetOrderById/:id",
  
  orderController.GetOrderById
);
route.delete(
  "/deleteOrder/:id",orderController.deleteOrder
);

module.exports = route;
