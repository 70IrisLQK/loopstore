import { useContext, useEffect, useState } from "react";
import Logo from "../../assets/images/logo.png";
import pattern from "../../assets/images/pattern.webp";
import { MyContext } from "../../App";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";

import googleIcon from "../../assets/images/googleIcon.png";
import { IoMdHome } from "react-icons/io";
import { postData } from "../../utils/api";

import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const SignUp = () => {
  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formfields, setFormfields] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isAdmin: true,
  });

  const history = useNavigate();

  const context = useContext(MyContext);

  useEffect(() => {
    context.setIsHideSidebarAndHeader(true);
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focusInput = (index) => {
    setInputIndex(index);
  };

  const onchangeInput = (e) => {
    setFormfields(() => ({
      ...formfields,
      [e.target.name]: e.target.value,
    }));
  };

  const signUp = (e) => {
    e.preventDefault();
    try {
      if (formfields.name === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Name can not be blank!",
        });
        return false;
      }

      if (formfields.email === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Email can not be blank!",
        });
        return false;
      }

      if (formfields.phone === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Phone can not be blank!",
        });
        return false;
      }

      if (formfields.password === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Password can not be blank!",
        });
        return false;
      }

      if (formfields.confirmPassword === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Confirm password can not be blank!",
        });
        return false;
      }

      if (formfields.confirmPassword !== formfields.password) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Password not match",
        });
        return false;
      }

      setIsLoading(true);

      postData("/api/user/signup", formfields)
        .then((res) => {
          if (res.status !== "FAILED") {
            context.setAlertBox({
              open: true,
              error: false,
              msg: res?.msg,
            });

            setTimeout(() => {
              setIsLoading(true);
              history("/login");
            }, 2000);
          } else {
            setIsLoading(false);
            context.setAlertBox({
              open: true,
              error: true,
              msg: res.msg,
            });
          }
        })
        .catch((error) => {
          setIsLoading(false);
          context.setAlertBox({
            open: true,
            error: true,
            msg: "Something went wrong",
          });
          // Handle error (e.g., show an error message)
        });
    } catch (error) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Something went wrong",
      });
    }
  };

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;

        const fields = {
          name: user.providerData[0].displayName,
          email: user.providerData[0].email,
          password: null,
          images: user.providerData[0].photoURL,
          phone: user.providerData[0].phoneNumber,
          isAdmin: true,
        };

        postData("/api/user/authWithGoogle", fields).then((res) => {
          try {
            if (res.error !== true) {
              localStorage.setItem("token", res.token);

              const user = {
                name: res.user?.name,
                email: res.user?.email,
                userId: res.user?.id,
              };

              localStorage.setItem("user", JSON.stringify(user));
              context.setUser(JSON.stringify(user));
              context.setAlertBox({
                open: true,
                error: false,
                msg: res.msg,
              });

              setTimeout(() => {
                context.setIsLogin(true);
                history("/dashboard");
              }, 2000);
            } else {
              context.setAlertBox({
                open: true,
                error: true,
                msg: res.msg,
              });
              setIsLoading(false);
            }
          } catch (error) {
            context.setAlertBox({
              open: true,
              error: true,
              msg: "Something went wrong",
            });
            setIsLoading(false);
          }
        });

        context.setAlertBox({
          open: true,
          error: false,
          msg: "User authentication successfully!",
        });

        // window.location.href = "/";
      })
      .catch((error) => {
        // Handle Errors here.
        // The email of the user's account used.
        // The AuthCredential type that was used.
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Internal Server Error",
        });
        // ...
      });
  };

  return (
    <>
      <img src={pattern} className="loginPattern" alt="pattern" />
      <section className="loginSection signUpSection">
        <div className="row">
          <div className="col-md-8 d-flex align-items-center flex-column part1 justify-content-center">
            <h1>
              <span className="text-sky text-center">
                Online Shopping DASHBOARD
              </span>
            </h1>
            <div className="w-100 mt-4 d-flex align-items-center flex-column part1 justify-content-center">
              <Link to={"/"}>
                {" "}
                <Button className="btn-blue btn-lg btn-big">
                  <IoMdHome /> Go To Home
                </Button>
              </Link>
            </div>
          </div>

          <div className="col-md-4 pr-0">
            <div className="loginBox">
              <Link
                to={"/"}
                className="d-flex align-items-center flex-column logo"
              >
                <img src={Logo} alt="logo" />
                <span className="ml-2">Online Shopping</span>
              </Link>

              <div className="wrapper mt-3 card border">
                <form onSubmit={signUp}>
                  <div
                    className={`form-group position-relative ${
                      inputIndex === 0 && "focus"
                    }`}
                  >
                    <span className="icon">
                      <FaUserCircle />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                      onFocus={() => focusInput(0)}
                      onBlur={() => setInputIndex(null)}
                      autoFocus
                      name="name"
                      onChange={onchangeInput}
                    />
                  </div>

                  <div
                    className={`form-group position-relative ${
                      inputIndex === 1 && "focus"
                    }`}
                  >
                    <span className="icon">
                      <MdEmail />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your email"
                      onFocus={() => focusInput(1)}
                      onBlur={() => setInputIndex(null)}
                      name="email"
                      onChange={onchangeInput}
                    />
                  </div>

                  <div
                    className={`form-group position-relative ${
                      inputIndex === 2 && "focus"
                    }`}
                  >
                    <span className="icon">
                      <FaPhoneAlt />
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter your Phone"
                      onFocus={() => focusInput(2)}
                      onBlur={() => setInputIndex(null)}
                      name="phone"
                      onChange={onchangeInput}
                    />
                  </div>

                  <div
                    className={`form-group position-relative ${
                      inputIndex === 3 && "focus"
                    }`}
                  >
                    <span className="icon">
                      <RiLockPasswordFill />
                    </span>
                    <input
                      type={`${isShowPassword === true ? "text" : "password"}`}
                      className="form-control"
                      placeholder="Enter your password"
                      onFocus={() => focusInput(3)}
                      onBlur={() => setInputIndex(null)}
                      name="password"
                      onChange={onchangeInput}
                    />

                    <span
                      className="toggleShowPassword"
                      onClick={() => setIsShowPassword(!isShowPassword)}
                    >
                      {isShowPassword === true ? <IoMdEyeOff /> : <IoMdEye />}
                    </span>
                  </div>

                  <div
                    className={`form-group position-relative ${
                      inputIndex === 4 && "focus"
                    }`}
                  >
                    <span className="icon">
                      <IoShieldCheckmarkSharp />
                    </span>
                    <input
                      type={`${
                        isShowConfirmPassword === true ? "text" : "password"
                      }`}
                      className="form-control"
                      placeholder="Confirm your password"
                      onFocus={() => focusInput(4)}
                      onBlur={() => setInputIndex(null)}
                      name="confirmPassword"
                      onChange={onchangeInput}
                    />

                    <span
                      className="toggleShowPassword"
                      onClick={() =>
                        setIsShowConfirmPassword(!isShowConfirmPassword)
                      }
                    >
                      {isShowConfirmPassword === true ? (
                        <IoMdEyeOff />
                      ) : (
                        <IoMdEye />
                      )}
                    </span>
                  </div>

                  <div className="form-group">
                    <Button
                      type="submit"
                      className="btn-blue btn-lg w-100 btn-big"
                    >
                      {isLoading === true ? <CircularProgress /> : "Sign Up "}
                    </Button>
                  </div>

                  <div className="form-group text-center mb-0">
                    <div className="d-flex align-items-center justify-content-center or mt-3 mb-3">
                      <span className="line"></span>
                      <span className="txt">or</span>
                      <span className="line"></span>
                    </div>

                    <Button
                      variant="outlined"
                      className="w-100 btn-lg btn-big loginWithGoogle"
                      onClick={signInWithGoogle}
                    >
                      <img src={googleIcon} width="25px" alt="google-icon" />{" "}
                      &nbsp; Sign In with Google
                    </Button>
                  </div>
                </form>

                <span className="text-center d-block mt-3">
                  Don't have an account?
                  <Link to={"/login"} className="link color ml-2">
                    Sign In
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
