/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import Logo from "../../assets/images/logo.png";
import { MyContext } from "../../App";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { postData } from "../../utils/api";

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    context.setIsHeaderFooterShow(false);

    context.setEnableFilterTab(false);
  }, []);

  const [formfields, setFormfields] = useState({
    email: localStorage.getItem("userEmail"),
    newPassword: "",
    confirmPassword: "",
  });

  const onchangeInput = (e) => {
    setFormfields(() => ({
      ...formfields,
      [e.target.name]: e.target.value,
    }));
  };

  const changePassword = (e) => {
    e.preventDefault();
    if (formfields.newPassword === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please input new password",
      });
      return false;
    }
    if (formfields.confirmPassword === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please input confirm password",
      });
      return false;
    }

    if (formfields.confirmPassword !== formfields.newPassword) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "New password don't match with confirm password",
      });
      return false;
    }
    postData(`/api/user/resetPassword`, formfields).then((res) => {
      if (res.status === "SUCCESS") {
        context.setAlertBox({
          open: true,
          error: false,
          msg: res.msg,
        });
        localStorage.removeItem("changePassword");
        history("/signIn");
      } else {
        context.setAlertBox({
          open: true,
          error: true,
          msg: res.msg,
        });
      }
    });
  };

  return (
    <section className="section signInPage">
      <div className="container">
        <div className="box card p-3 shadow border-0">
          <div className="text-center">
            <img className="w-50" src={Logo} alt="logo" />
          </div>

          <form className="mt-3" onSubmit={changePassword}>
            <h2 className="mb-4">Change Password</h2>

            <div className="form-group">
              <TextField
                id="new-password-input"
                label="New Password"
                type="password"
                required
                variant="standard"
                className="w-100"
                name="newPassword"
                onChange={onchangeInput}
              />
              {/* Email credential */}
            </div>
            <div className="form-group">
              <TextField
                id="confirm-password-input"
                label="Confirm Password"
                type="password"
                required
                variant="standard"
                className="w-100"
                name="confirmPassword"
                onChange={onchangeInput}
              />
              {/* Password credential */}
            </div>

            <div className="d-flex align-items-center mt-3 mb-3 ">
              <Button type="submit" className="btn-blue col btn-lg btn-big">
                {isLoading === true ? <CircularProgress /> : "Change Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;
