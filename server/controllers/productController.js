const { Category } = require("../models/category.js");
const { Product } = require("../models/products.js");
const { MyList } = require("../models/myList.js");
const { Cart } = require("../models/cart.js");
const { RecentlyView } = require("../models/recentlyView.js");
const { ImageUpload } = require("../models/imageUpload.js");
const fs = require("fs");
const { cloudinaryDestroy, cloudinaryHelper } = require("../helper/cloudinary");

// Create Product
const uploadImageProduct = async (req, res) => {
  imagesArr = [];

  try {
    // Upload each file in parallel and store the URLs in `imagesArr`
    for (const file of req.files) {
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      };

      const secureUrl = await cloudinaryHelper(file.path, options); // Use the helper
      imagesArr.push(secureUrl);

      fs.unlinkSync(file.path);
    }

    // Save image URLs to the database
    const imagesUploaded = new ImageUpload({ images: imagesArr });
    await imagesUploaded.save();

    return res.status(200).json(imagesArr); // Respond with the uploaded image URLs
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Image upload failed" });
  }
};

const getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage);
  const totalPosts = await Product.countDocuments();
  const totalPages = Math.ceil(totalPosts / perPage);

  if (page > totalPages) {
    return res.status(404).json({ message: "Page not found" });
  }

  let productList = [];

  productList = await Product.find()
    .populate("category")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();

  return res.status(200).json({
    products: productList,
    totalPages: totalPages,
    page: page,
  });
};
const filterByCategoryName = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage);
  const totalPosts = await Product.countDocuments();
  const totalPages = Math.ceil(totalPosts / perPage);

  if (page > totalPages) {
    return res.status(404).json({ message: "Page not found" });
  }

  let productList = [];

  if (req.query.page !== "" && req.query.perPage !== "") {
    productList = await Product.find({
      catName: req.query.catName,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return res.status(200).json({
      products: productList,
      totalPages: totalPages,
      page: page,
    });
  } else {
    productList = await Product.find({
      catName: req.query.catName,
    });

    return res.status(200).json({
      products: productList,
    });
  }
};
const filterByCategoryId = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage);
  var totalPosts = [];
  var totalPages = 0;
  // const totalPosts = await Product.countDocuments();
  // const totalPages = Math.ceil(totalPosts / perPage);

  // if (page > totalPages) {
  //   return res.status(404).json({ message: "Page not found" });
  // }

  let productList = [];

  if (req.query.page !== "" && req.query.perPage !== "") {
    productList = await Product.find({
      catId: req.query.catId,
    }).populate("category");

    totalPosts = await productList.length;
    totalPages = Math.ceil(totalPosts / perPage);

    productList = await Product.find({
      catId: req.query.catId,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return res.status(200).json({
      products: productList,
      totalPages: totalPages,
      page: page,
    });
  } else {
    productList = await Product.find({
      catId: req.query.catId,
    });

    totalPosts = await productList.length;
    totalPages = Math.ceil(totalPosts / perPage);

    return res.status(200).json({
      products: productList,
    });
  }
};
const filterBySubCategoryId = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage);
  const totalPosts = await Product.countDocuments();
  const totalPages = Math.ceil(totalPosts / perPage);

  if (page > totalPages) {
    return res.status(404).json({ message: "Page not found" });
  }

  let productList = [];

  if (req.query.page !== "" && req.query.perPage !== "") {
    productList = await Product.find({
      subCatId: req.query.subCatId,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return res.status(200).json({
      products: productList,
      totalPages: totalPages,
      page: page,
    });
  } else {
    productList = await Product.find({
      subCatId: req.query.subCatId,
    });

    return res.status(200).json({
      products: productList,
    });
  }
};
const filterByPrice = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage);
  const totalPosts = await Product.countDocuments();
  const totalPages = Math.ceil(totalPosts / perPage);

  if (page > totalPages) {
    return res.status(404).json({ message: "Page not found" });
  }

  let productList = [];

  if (req.query.catId !== "" && req.query.catId !== undefined) {
    if (req.query.page !== "" && req.query.perPage !== "") {
      productList = await Product.find({
        catId: req.query.catId,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    } else {
      productList = await Product.find({
        catId: req.query.catId,
      });
    }
  } else if (req.query.subCatId !== "" && req.query.subCatId !== undefined) {
    if (req.query.page !== "" && req.query.perPage !== "") {
      productList = await Product.find({
        subCatId: req.query.subCatId,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    } else {
      productList = await Product.find({
        subCatId: req.query.subCatId,
      });
    }
  }

  const filteredProducts = productList.filter((product) => {
    if (req.query.minPrice && product.price < parseInt(+req.query.minPrice)) {
      return false;
    }
    if (req.query.maxPrice && product.price > parseInt(+req.query.maxPrice)) {
      return false;
    }
    return true;
  });

  return res.status(200).json({
    products: filteredProducts,
    totalPages: totalPages,
    page: page,
  });
};
const productRating = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage);
  const totalPosts = await Product.countDocuments();
  const totalPages = Math.ceil(totalPosts / perPage);

  if (page > totalPages) {
    return res.status(404).json({ message: "Page not found" });
  }

  let productList = [];

  if (req.query.catId !== "" && req.query.catId !== undefined) {
    if (req.query.page !== "" && req.query.perPage !== "") {
      productList = await Product.find({
        catId: req.query.catId,
        rating: req.query.rating,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    } else {
      productList = await Product.find({
        catId: req.query.catId,
        rating: req.query.rating,
      });
    }
  } else if (req.query.subCatId !== "" && req.query.subCatId !== undefined) {
    if (req.query.page !== "" && req.query.perPage !== "") {
      productList = await Product.find({
        subCatId: req.query.subCatId,
        rating: req.query.rating,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    } else {
      productList = await Product.find({
        subCatId: req.query.subCatId,
        rating: req.query.rating,
      });
    }
  }

  return res.status(200).json({
    products: productList,
    totalPages: totalPages,
    page: page,
  });
};
const productCount = async (req, res) => {
  const productsCount = await Product.countDocuments();

  if (!productsCount) {
    res.status(500).json({ success: false });
  } else {
    res.send({
      productsCount: productsCount,
    });
  }
};
const productFeatured = async (req, res) => {
  let productList = "";

  productList = await Product.find({ isFeatured: true });

  if (!productList) {
    res.status(500).json({ success: false });
  }

  return res.status(200).json(productList);
};
const getProductRecentlyView = async (req, res) => {
  let productList = [];
  productList = await RecentlyView.find(req.query).populate("category");

  if (!productList) {
    res.status(500).json({ success: false });
  }

  return res.status(200).json(productList);
};
const createProductRecentlyView = async (req, res) => {
  let findProduct = await RecentlyView.find({ prodId: req.body.id });

  var product;

  if (findProduct.length === 0) {
    product = new RecentlyView({
      prodId: req.body.id,
      name: req.body.name,
      description: req.body.description,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      oldPrice: req.body.oldPrice,
      subCatId: req.body.subCatId,
      catName: req.body.catName,
      subCat: req.body.subCat,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
      discount: req.body.discount,
      productRam: req.body.productRam,
      size: req.body.size,
      productWeight: req.body.productWeight,
    });

    product = await product.save();

    if (!product) {
      res.status(500).json({
        error: err,
        success: false,
      });
    }

    res.status(201).json(product);
  }
};

const createProduct = async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(404).send("invalid Category!");
  }

  const images_Array = [];
  const uploadedImages = await ImageUpload.find();

  const images_Arr = uploadedImages?.map((item) => {
    item.images?.map((image) => {
      images_Array.push(image);
      console.log(image);
    });
  });

  product = new Product({
    name: req.body.name,
    description: req.body.description,
    images: images_Array,
    brand: req.body.brand,
    price: req.body.price,
    oldPrice: req.body.oldPrice,
    catId: req.body.catId,
    catName: req.body.catName,
    subCat: req.body.subCat,
    subCatId: req.body.subCatId,
    subCatName: req.body.subCatName,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    isFeatured: req.body.isFeatured,
    discount: req.body.discount,
    productRam: req.body.productRam,
    size: req.body.size,
    productWeight: req.body.productWeight,
  });

  product = await product.save();

  if (!product) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }

  imagesArr = [];

  res.status(201).json(product);
};

const getProductById = async (req, res) => {
  productEditId = req.params.id;

  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    res
      .status(500)
      .json({ message: "The product with the given ID was not found." });
  }
  return res.status(200).send(product);
};

const deleteImageProduct = async (req, res) => {
  const imgUrl = req.query.img;

  const urlArr = imgUrl.split("/");
  const image = urlArr[urlArr.length - 1];

  const imageName = image.split(".")[0];

  const response = await cloudinaryDestroy(imageName);
  if (response) {
    res.status(200).send(response);
  }
};

const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  const images = product.images;

  for (img of images) {
    const imgUrl = img;
    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];

    const imageName = image.split(".")[0];

    if (imageName) {
      await cloudinaryDestroy(imageName);
    }
  }

  const deletedProduct = await Product.findByIdAndDelete(req.params.id);

  const myListItems = await MyList.find({ productId: req.params.id });

  for (var i = 0; i < myListItems.length; i++) {
    await MyList.findByIdAndDelete(myListItems[i].id);
  }

  const cartItems = await Cart.find({ productId: req.params.id });

  for (var i = 0; i < cartItems.length; i++) {
    await Cart.findByIdAndDelete(cartItems[i].id);
  }

  if (!deletedProduct) {
    res.status(404).json({
      message: "Product not found!",
      success: false,
    });
  }

  res.status(200).json({
    success: true,
    message: "Product Deleted!",
  });
};
const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      subCat: req.body.subCat,
      description: req.body.description,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      oldPrice: req.body.oldPrice,
      catId: req.body.catId,
      subCat: req.body.subCat,
      subCatId: req.body.subCatId,
      subCatName: req.body.subCatName,
      catName: req.body.catName,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
      productRam: req.body.productRam,
      size: req.body.size,
      productWeight: req.body.productWeight,
    },
    { new: true }
  );

  if (!product) {
    res.status(404).json({
      message: "The product can not be updated!",
      status: false,
    });
  }

  imagesArr = [];

  res.status(200).json({
    message: "The product is updated!",
    status: true,
  });
};
module.exports = {
  uploadImageProduct,
  getProducts,
  filterByCategoryName,
  filterByCategoryId,
  filterBySubCategoryId,
  filterByPrice,
  productRating,
  productCount,
  productFeatured,
  getProductRecentlyView,
  createProductRecentlyView,
  createProduct,
  getProductById,
  deleteImageProduct,
  deleteProduct,
  updateProduct,
};
