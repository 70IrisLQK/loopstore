const { MyList } = require("../models/myList");

// Get all items in MyList
const getAllItems = async (req, res) => {
  try {
    const myList = await MyList.find(req.query);

    if (!myList) {
      return res
        .status(404)
        .json({ success: false, message: "No items found" });
    }

    res.status(200).json(myList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch items" });
  }
};

// Get a single item by ID
const getItemById = async (req, res) => {
  try {
    const item = await MyList.findById(req.params.id);

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch item" });
  }
};

// Add a new item to MyList
const addItem = async (req, res) => {
  try {
    const existingItem = await MyList.find({
      productId: req.body.productId,
      userId: req.body.userId,
    });

    if (existingItem.length > 0) {
      return res.status(409).json({
        status: false,
        msg: "Product already added to My List",
      });
    }

    const list = new MyList({
      productTitle: req.body.productTitle,
      image: req.body.image,
      rating: req.body.rating,
      price: req.body.price,
      productId: req.body.productId,
      userId: req.body.userId,
    });

    const savedList = await list.save();
    res.status(201).json(savedList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to add item" });
  }
};

// Delete an item by ID
const deleteItem = async (req, res) => {
  try {
    const item = await MyList.findById(req.params.id);

    if (!item) {
      return res
        .status(404)
        .json({ msg: "The item with the given ID is not found!" });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to delete item" });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  addItem,
  deleteItem,
};
