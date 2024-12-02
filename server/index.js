const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/userRoute.js");
const categoryRoutes = require("./routes/categoryRoute.js");
const productRoutes = require("./routes/productRoute.js");
const imageUploadRoutes = require("./helper/imageUpload.js");
const productWeightRoutes = require("./routes/productWeightRoute.js");
const productRAMSRoutes = require("./routes/productRamRoute.js");
const productSIZESRoutes = require("./routes/productSizeRoute.js");
const productReviews = require("./routes/productReviewRoute.js");
const cartSchema = require("./routes/cartRoute.js");
const myListSchema = require("./routes/myListRoute.js");
const ordersSchema = require("./routes/orderRoute.js");
const homeBannerSchema = require("./routes/homeBannerRoute.js");
const searchRoutes = require("./routes/searchRoute.js");
const bannersSchema = require("./routes/bannerRoute.js");
const homeSideBannerSchema = require("./routes/homeSideBannerRoute.js");
const homeBottomBannerSchema = require("./routes/homeBottomBannerRoute.js");
const databaseConnection = require("./config/databaseConfig.js");

const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin: [process.env.CLIENT_BASE_URL, process.env.ADMIN_BASE_URL],
  credentials: true,
};

app.use(cors(corsOptions));

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Routes
app.use("/api/user", userRoutes);
app.use("/uploads", express.static("uploads"));
app.use(`/api/category`, categoryRoutes);
app.use(`/api/products`, productRoutes);
app.use(`/api/imageUpload`, imageUploadRoutes);
app.use(`/api/productWeight`, productWeightRoutes);
app.use(`/api/productRAMS`, productRAMSRoutes);
app.use(`/api/productSIZE`, productSIZESRoutes);
app.use(`/api/productReviews`, productReviews);
app.use(`/api/cart`, cartSchema);
app.use(`/api/my-list`, myListSchema);
app.use(`/api/orders`, ordersSchema);
app.use(`/api/homeBanner`, homeBannerSchema);
app.use(`/api/search`, searchRoutes);
app.use(`/api/banners`, bannersSchema);
app.use(`/api/homeSideBanners`, homeSideBannerSchema);
app.use(`/api/homeBottomBanners`, homeBottomBannerSchema);

//Database
databaseConnection();

app.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});
