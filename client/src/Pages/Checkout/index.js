import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { IoBagCheckOutline } from "react-icons/io5";

import { MyContext } from "../../App";
import { fetchDataFromApi, postData, deleteData } from "../../utils/api";

import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [formFields, setFormFields] = useState({
    fullName: "",
    country: "VietNamese",
    streetAddressLine1: "",
    streetAddressLine2: "",
    city: "",
    zipCode: "",
    phoneNumber: "",
    email: "",
  });

  const [cartData, setCartData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("online");

  useEffect(() => {
    window.scrollTo(0, 0);
    const user = JSON.parse(localStorage.getItem("user"));
    fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
      setCartData(res);

      setTotalAmount(
        res.length !== 0 &&
          res
            .map((item) => parseInt(item.price) * item.quantity)
            .reduce((total, value) => total + value, 0)
      );
    });
  }, []);

  const onChangeInput = (e) => {
    setFormFields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const context = useContext(MyContext);
  const history = useNavigate();

  const handlePaymentSuccess = (paymentId) => {
    const user = JSON.parse(localStorage.getItem("user"));

    const addressInfo = {
      name: formFields.fullName,
      phoneNumber: formFields.phoneNumber,
      address: formFields.streetAddressLine1 + formFields.streetAddressLine2,
      pincode: formFields.zipCode,
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    const payLoad = {
      name: addressInfo.name,
      phoneNumber: formFields.phoneNumber,
      address: addressInfo.address,
      pincode: addressInfo.pincode,
      amount: parseInt(totalAmount),
      paymentId: paymentId,
      email: user.email,
      userid: user.userId,
      products: cartData,
      date: addressInfo?.date,
      paymentMethod: paymentMethod,
    };

    postData(`/api/orders/create`, payLoad).then((res) => {
      fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
        res?.length !== 0 &&
          res?.map((item) => {
            deleteData(`/api/cart/${item?.id}`).then(() => {});
          });
        setTimeout(() => {
          context.getCartData();
        }, 1000);
        history("/orders");
      });
    });
  };

  const checkout = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (paymentMethod === "online") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Online payment is not available due to Stripe account being inactive. Please use Cash on Delivery.",
      });
      return;
    }

    if (paymentMethod === "cod") {
      handlePaymentSuccess("COD");
    }
  };

  const validateForm = () => {
    if (!formFields.fullName) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill full name",
      });
      return false;
    }
    if (!formFields.country) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill country",
      });
      return false;
    }
    if (!formFields.streetAddressLine1) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill street address",
      });
      return false;
    }
    if (!formFields.city) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill city",
      });
      return false;
    }
    if (!formFields.zipCode) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill zip code",
      });
      return false;
    }
    const zipCodeRegex = /^[0-9]{4,10}$/; // Allow 4 to 10 digits for flexibility
    if (!zipCodeRegex.test(formFields.zipCode)) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please provide a valid zip code",
      });
      return false;
    }
    if (!formFields.phoneNumber) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill phone number",
      });
      return false;
    }
    if (!formFields.email) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill email",
      });
      return false;
    }
    // Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formFields.email)) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please provide a valid email address",
      });
      return false;
    }

    // Phone Number Validation
    const phoneRegex = /^[0-9]{10,15}$/; // Customize based on expected format
    if (!phoneRegex.test(formFields.phoneNumber)) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please provide a valid phone number",
      });
      return false;
    }
    return true;
  };

  return (
    <section className="section">
      <div className="container">
        <form className="checkoutForm" onSubmit={checkout}>
          <div className="row">
            <div className="col-md-8">
              <h2 className="hd">ADDRESS INFORMATION</h2>

              <div className="row mt-3">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="Fullname *"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="fullName"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <h6>Address *</h6>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="House number and street name"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="streetAddressLine1"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <h6>District *</h6>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label=""
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="district"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <h6>City *</h6>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label=""
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="city"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <h6>ZipCode *</h6>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label=""
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="zipCode"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Phone"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="phoneNumber"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Email"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="email"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card orderInfo">
                <h4 className="hd">YOUR ORDER</h4>
                <div className="table-responsive mt-3">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                      </tr>
                    </thead>

                    <tbody>
                      {cartData?.length !== 0 &&
                        cartData?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                {item?.productTitle?.substr(0, 20) + "..."}{" "}
                                <b>× {item?.quantity}</b>
                              </td>

                              <td>
                                {item?.subTotal?.toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                })}
                              </td>
                            </tr>
                          );
                        })}

                      <tr>
                        <td>Total </td>

                        <td>
                          {(cartData?.length !== 0
                            ? cartData
                                ?.map(
                                  (item) => parseInt(item.price) * item.quantity
                                )
                                .reduce((total, value) => total + value, 0)
                            : 0
                          )?.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="form-group mt-1 button-group">
                  <div className="paymentOptions mt-3">
                    <FormLabel id="paymentMethod">Payment Method</FormLabel>
                    <RadioGroup
                      aria-labelledby="paymentMethod"
                      defaultValue="online"
                      name="paymentMethod"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <FormControlLabel
                        value="online"
                        control={<Radio />}
                        label="Online Payment"
                      />
                      <FormControlLabel
                        value="cod"
                        control={<Radio />}
                        label="Cash on Delivery"
                      />
                    </RadioGroup>
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className="placeOrderBtn"
                    startIcon={<IoBagCheckOutline />}
                    type="submit"
                  >
                    Place Order
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Checkout;
