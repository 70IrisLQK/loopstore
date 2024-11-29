const { Cart } = require("../models/cart");

const getCartItems = async (req, res) => {
  try {
    const cartList = await Cart.find(req.query);

    if (!cartList) {
      return res.status(500).json({ success: false });
    }

    return res.status(200).json(cartList);
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

const addCartItem = async (req, res) => {
  try {
    const cartItem = await Cart.find({
      productId: req.body.productId,
      userId: req.body.userId,
    });

    if (cartItem.length === 0) {
      let cartList = new Cart({
        productTitle: req.body.productTitle,
        image: req.body.image,
        rating: req.body.rating,
        price: req.body.price,
        quantity: req.body.quantity,
        subTotal: req.body.subTotal,
        productId: req.body.productId,
        userId: req.body.userId,
        countInStock: req.body.countInStock,
      });

      cartList = await cartList.save();
      return res.status(201).json(cartList);
    } else {
      return res
        .status(401)
        .json({ status: false, msg: "Product already added in the cart" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to add item to cart" });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
      return res
        .status(404)
        .json({ msg: "The cart item with the given ID was not found!" });
    }

    const deletedItem = await Cart.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({
        message: "Cart item not found!",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart Item Deleted!",
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete cart item" });
  }
};

const getCartItemById = async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
      return res
        .status(500)
        .json({ message: "The cart item with the given ID was not found." });
    }

    return res.status(200).send(cartItem);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch cart item" });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const cartList = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        productTitle: req.body.productTitle,
        image: req.body.image,
        rating: req.body.rating,
        price: req.body.price,
        quantity: req.body.quantity,
        subTotal: req.body.subTotal,
        productId: req.body.productId,
        userId: req.body.userId,
      },
      { new: true }
    );

    if (!cartList) {
      return res.status(500).json({
        message: "Cart item cannot be updated!",
        success: false,
      });
    }

    return res.status(200).send(cartList);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update cart item" });
  }
};

module.exports = {
  getCartItems,
  addCartItem,
  deleteCartItem,
  getCartItemById,
  updateCartItem,
};
