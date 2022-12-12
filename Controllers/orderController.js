const Order = require("../Models/Order");
const Customer = require("../Models/Customer");

module.exports = {
  createOrder: async (req, res) => {
    try {

      const newOrder = new Order(req.body);
      const order = await newOrder.save();

      await Customer.findByIdAndUpdate(req.body.customer, {
        $push: { orders: order},
      });
      res.status(201).json({ msg: "Order created !", data: order,
     });
    } catch (error) {
      res.status(500).json({ msg: error.msg || 'There is an error in recieving order', });
      //res.status(500).json(error);
    }
  },
  UpdateOrder: async (req, res) => {
    try {
      await Order.updateOne(
        {
          _id: req.params.id,
        },
        req.body
      );
      res.status(200).json({
        msg: "Order updated",
      });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  GetAllOrders: async (req, res) => {
    try {
      const listeOrders = await Order.find();
      res.status(200).json({
        msg: "Read all orders",
        data: listeOrders,
      });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  GetOrderById: async (req, res) => {
    try {
      const order = await Order.findById({
        _id: req.params.id,
      });
      res.status(200).json({
        msg: "Order found by id",
        data: order,
      });
    } catch (error) {
      res.status(406).json({ msg: error.message });
    }
  },
  GetOrderByCustomer: async (req, res) => {
    try {
      const orders = req.user.orders;
        res.status(200).json({ data: orders});
  
    } catch (error) {
      res.status(500).json({ msg: error.message || 'There is an error in retrieving order', });
    }
  },
  deleteOrder: async (req, res) => {
    try {
      // await Customer.findByIdAndUpdate(req.user._id,{
      //   $pull: { orders: req.params.id},
      //  });
      await Order.deleteOne({ _id: req.params.id });
      res.status(200).json({
        msg: "Order deleted",
        status: 200,
      });
    } catch (error) {
      res.status(500).json({ msg: error.message ||'There is an error in retrieving order'  });
    }
  },
};
