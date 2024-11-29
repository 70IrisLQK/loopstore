const mongoose = require("mongoose");

const recentlyViewSchema = mongoose.Schema({
  prodId: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  brand: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
  },
  oldPrice: {
    type: Number,
    default: 0,
  },
  catName: {
    type: String,
    default: "",
  },
  subCatId: {
    type: String,
    default: "",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCat: {
    type: String,
    default: "",
  },
  countInStock: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  discount: {
    type: Number,
    required: true,
  },
  productRam: [
    {
      type: String,
      default: null,
    },
  ],
  size: [
    {
      type: String,
      default: null,
    },
  ],
  productWeight: [
    {
      type: String,
      default: null,
    },
  ],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

recentlyViewSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

recentlyViewSchema.set("toJSON", {
  virtuals: true,
});

exports.RecentlyView = mongoose.model("RecentlyView", recentlyViewSchema);
