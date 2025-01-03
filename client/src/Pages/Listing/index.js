import Sidebar from "../../Components/Sidebar";
import Button from "@mui/material/Button";
import { IoIosMenu } from "react-icons/io";
import { CgMenuGridR } from "react-icons/cg";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { useContext, useEffect, useState } from "react";
import ProductItem from "../../Components/ProductItem";

import { useNavigate, useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";

import { MyContext } from "../../App";

const Listing = () => {
  const [productView, setProductView] = useState("four");
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, setFilterId] = useState("");

  const history = useNavigate();

  const context = useContext(MyContext);

  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
    setFilterId("");

    let url = window.location.href;
    let apiEndPoint = "";

    if (url.includes("subCat")) {
      apiEndPoint = `/api/products/subCatId?subCatId=${id}`;
    }
    if (url.includes("category")) {
      apiEndPoint = `/api/products/catId?catId=${id}`;
    }

    setIsLoading(true);
    fetchDataFromApi(`${apiEndPoint}`).then((res) => {
      setProductData(res);
      setIsLoading(false);
    });

    context.setEnableFilterTab(true);
  }, [id]);

  const handleChangePage = (event, value) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    let url = window.location.href;
    let apiEndPoint = "";

    if (url.includes("subCat")) {
      apiEndPoint = `/api/products/subCatId?subCatId=${id}&page=${value}&perPage=8`;
    }
    if (url.includes("category")) {
      apiEndPoint = `/api/products/catId?catId=${id}&page=${value}&perPage=8`;
    }

    setIsLoading(true);
    fetchDataFromApi(`${apiEndPoint}`).then((res) => {
      setProductData(res);
      setIsLoading(false);
    });
  };

  const filterData = (subCatId) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    history(`/products/subCat/${subCatId}`);
  };

  const filterByPrice = (price, subCatId) => {
    var window_url = window.location.href;
    var api_EndPoint = "";

    if (window_url.includes("subCat")) {
      api_EndPoint = `/api/products/filterByPrice?minPrice=${price[0]}&maxPrice=${price[1]}&subCatId=${id}`;
    }
    if (window_url.includes("category")) {
      api_EndPoint = `/api/products/filterByPrice?minPrice=${price[0]}&maxPrice=${price[1]}&catId=${id}`;
    }

    setIsLoading(true);

    fetchDataFromApi(api_EndPoint).then((res) => {
      setProductData(res);
      setIsLoading(false);
    });
  };

  const filterByRating = (rating, subCatId) => {
    setIsLoading(true);
    let url = window.location.href;
    let apiEndPoint = "";

    if (url.includes("subCat")) {
      apiEndPoint = `/api/products/rating?rating=${rating}&subCatId=${id}`;
    }
    if (url.includes("category")) {
      apiEndPoint = `/api/products/rating?rating=${rating}&catId=${id}`;
    }

    fetchDataFromApi(apiEndPoint).then((res) => {
      setProductData(res);
      setIsLoading(false);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  };

  const handleChange = (event, value) => {
    setIsLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    fetchDataFromApi(
      `/api/products?subCatId=${id}&page=${value}&perPage=6`
    ).then((res) => {
      setProductData(res);
      setIsLoading(false);
    });
  };

  return (
    <>
      <section className="product_Listing_Page pt-5">
        <div className="container">
          <div className="productListing d-flex">
            <Sidebar
              filterData={filterData}
              filterByPrice={filterByPrice}
              filterByRating={filterByRating}
              isOpenFilter={context?.isOpenFilters}
            />

            <div className="content_right">
              <div className="showBy mt-0 mb-3 d-flex align-items-center">
                <div className="d-flex align-items-center btnWrapper">
                  <Button
                    className={productView === "one" && "act"}
                    onClick={() => setProductView("one")}
                  >
                    <IoIosMenu />
                  </Button>

                  <Button
                    className={productView === "three" && "act"}
                    onClick={() => setProductView("three")}
                  >
                    <CgMenuGridR />
                  </Button>
                  <Button
                    className={productView === "four" && "act"}
                    onClick={() => setProductView("four")}
                  >
                    <TfiLayoutGrid4Alt />
                  </Button>
                </div>
              </div>

              <div className="productListing">
                {isLoading === true ? (
                  <div className="loading d-flex align-items-center justify-content-center">
                    <CircularProgress color="inherit" />
                  </div>
                ) : (
                  <>
                    {productData?.products
                      ?.slice(0)
                      .reverse()
                      .map((item, index) => {
                        return (
                          <ProductItem
                            key={index}
                            itemView={productView}
                            item={item}
                          />
                        );
                      })}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Listing;
