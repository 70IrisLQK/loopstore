import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";
import OtpBox from "../../Components/OtpBox";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import Shield from "../../assets/images/shield.png";
import { Link } from "react-router-dom";

const VerifyOTP = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const context = useContext(MyContext);
  const history = useNavigate();

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  useEffect(() => {
    context.setIsHeaderFooterShow(false);
    context.setEnableFilterTab(false);
  }, []);

  const verify = (e) => {
    e.preventDefault();
    const object = {
      otp: otp,
      email: localStorage.getItem("userEmail"),
    };

    if (otp !== "") {
      const actionType = localStorage.getItem("actionType");
      postData(`/api/user/verifyEmail`, object).then((res) => {
        if (res?.success === true) {
          context.setAlertBox({
            open: true,
            error: false,
            msg: res?.message,
          });
          setIsLoading(false);
          if (actionType === "changePassword") {
            history("/changePassword");
          } else {
            localStorage.removeItem("userEmail");
            history("/signIn");
          }
        } else {
          context.setAlertBox({
            open: true,
            error: true,
            msg: res?.message,
          });
          setIsLoading(false);
        }
      });
    } else {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please input OTP",
      });
    }
  };

  return (
    <section className="section signInPage otpPage">
      <div className="shape-bottom">
        <svg></svg>
      </div>

      <div className="container">
        <div className="box card p-3 shadow border-0">
          <div className="text-center">
            <img src={Shield} alt="shield" width={"100px "} />
          </div>
          <form className="mt-3" onSubmit={verify}>
            <h2 className="mb-1 text-center"> OTP Verification</h2>
            <p className="text-center  text-light">
              OTP has been sent to <b>{localStorage.getItem("userEmail")}</b>
            </p>
            <OtpBox length={6} onChange={handleOtpChange} />
            <div className="d-flex align-items-center mt-3 mb-3">
              <Button type="submit" className="btn-blue col btn-lg btn-big">
                {isLoading === true ? <CircularProgress /> : "Verify OTP"}
              </Button>
            </div>

            <p className="text-center">
              <Link className="border-effect cursor txt" to="/">
                Back to home
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default VerifyOTP;
