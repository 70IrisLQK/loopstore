const { Orders } = require("../models/orders");

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const ordersList = await Orders.find(req.query);

    if (!ordersList) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found" });
    }

    res.status(200).json(ordersList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch orders" });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Orders.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).send(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch order" });
  }
};

// Get total order count
const getOrderCount = async (req, res) => {
  try {
    const orderCount = await Orders.countDocuments();

    res.status(200).send({ orderCount });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch order count" });
  }
};

// Create a new order
const createOrder = async (req, res) => {
  try {
    const newOrder = new Orders({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      pincode: req.body.pincode,
      amount: req.body.amount,
      paymentId: req.body.paymentId,
      email: req.body.email,
      userid: req.body.userid,
      products: req.body.products,
      date: req.body.date,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to create order" });
  }
};

// Update an order
const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Orders.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        pincode: req.body.pincode,
        amount: req.body.amount,
        paymentId: req.body.paymentId,
        email: req.body.email,
        userid: req.body.userid,
        products: req.body.products,
        status: req.body.status,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to update order" });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Orders.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found!" });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to delete order" });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  getOrderCount,
  createOrder,
  updateOrder,
  deleteOrder,
};
