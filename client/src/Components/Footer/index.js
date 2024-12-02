import { LuShirt } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { CiDiscount1 } from "react-icons/ci";
import { CiBadgeDollar } from "react-icons/ci";
import { Link } from "react-router-dom";
import { FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import newsLetterImg from "../../assets/images/newsletter.png";
import { useContext } from "react";
import { MyContext } from "../../App";

const Footer = () => {
  const context = useContext(MyContext);

  return (
    <>
      <div className="container"></div>
      <section className="newsLetterSection mt-3 mb-3 d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <p className="text-white mb-1">
                20 % discount for your first order
              </p>
              <h3 className="text-white">Join our newsletter and get...</h3>
              <p className="text-light">
                Join our email subscription now to get updates on
                <br /> promotions and coupons.
              </p>
            </div>

            <div className="col-md-6">
              <img src={newsLetterImg} alt="letter-img" />
            </div>
          </div>
        </div>
      </section>
      <footer>
        <div className="container">
          <div className="topInfo row">
            <div className="col d-flex align-items-center">
              <span>
                <LuShirt />
              </span>
              <span className="ml-2">Everyday fresh products</span>
            </div>

            <div className="col d-flex align-items-center">
              <span>
                <TbTruckDelivery />
              </span>
              <span className="ml-2">Free delivery for order over $70</span>
            </div>

            <div className="col d-flex align-items-center">
              <span>
                <CiDiscount1 />
              </span>
              <span className="ml-2">Daily Mega Discounts</span>
            </div>

            <div className="col d-flex align-items-center">
              <span>
                <CiBadgeDollar />
              </span>
              <span className="ml-2">Best price on the market</span>
            </div>
          </div>

          <div className="row mt-5 linksWrap">
            {context.categoryData?.length !== 0 &&
              context.categoryData?.slice(0, 4).map((item, key) => {
                return (
                  <div className="col" key={key}>
                    <Link to={`/products/category/${item?._id}`}>
                      <h5>{item?.name}</h5>
                    </Link>
                    <ul>
                      {item?.children?.length !== 0 &&
                        item?.children?.map((subCat, key) => {
                          return (
                            <li key={key}>
                              <Link
                                to={`/products/subCat/${subCat?._id}`}
                                key={key}
                              >
                                {subCat?.name}
                              </Link>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                );
              })}
          </div>

          <div className="copyright mt-3 pt-3 pb-3 d-flex">
            <p className="mb-0">
              {" "}
              Developed By <b>70irisLQK 💖</b>{" "}
            </p>
            <ul className="list list-inline ml-auto mb-0 socials">
              <li className="list-inline-item">
                <Link to="#">
                  <FaLinkedin />
                </Link>
              </li>

              <li className="list-inline-item">
                <Link to="#">
                  <FaXTwitter />
                </Link>
              </li>

              <li className="list-inline-item">
                <Link to="#">
                  <FaInstagram />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
