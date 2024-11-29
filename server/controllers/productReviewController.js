const { ProductReviews } = require("../models/productReviews");

// Get all reviews or reviews filtered by product ID
const getAllReviews = async (req, res) => {
  try {
    if (
      req.query.productId !== undefined &&
      req.query.productId !== null &&
      req.query.productId !== ""
    ) {
      reviews = await ProductReviews.find({ productId: req.query.productId });
    } else {
      reviews = await ProductReviews.find();
    }

    if (!reviews) {
      res.status(500).json({ success: false });
    }

    return res.status(200).json(reviews);
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch reviews" });
  }
};

// Get review count
const getReviewCount = async (req, res) => {
  const productsReviews = await ProductReviews.countDocuments();

  if (!productsReviews) {
    res.status(500).json({ success: false });
  } else {
    res.send({
      productsReviews: productsReviews,
    });
  }
};

// Get a specific review by ID
const getReviewById = async (req, res) => {
  const review = await ProductReviews.findById(req.params.id);

  if (!review) {
    res
      .status(500)
      .json({ message: "The review with the given ID was not found." });
  }
  return res.status(200).send(review);
};

// Add a new review
const addReview = async (req, res) => {
  let review = new ProductReviews({
    customerId: req.body.customerId,
    customerName: req.body.customerName,
    review: req.body.review,
    customerRating: req.body.customerRating,
    productId: req.body.productId,
  });

  if (!review) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }

  review = await review.save();

  res.status(201).json(review);
};

module.exports = {
  getAllReviews,
  getReviewCount,
  getReviewById,
  addReview,
};
