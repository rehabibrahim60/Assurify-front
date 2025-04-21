import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  CardBody,
  Card,
  Container,
  Label,
  Form,
  FormFeedback,
  Input,
} from "reactstrap";

// Redux
import { connect, useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import withRouter from "components/Common/withRouter";
import axios from "axios";

// Formik + Yup
import * as Yup from "yup";
import { useFormik } from "formik";

// Actions
import { loginUser, apiError } from "../../store/actions";

// Assets
import logo3 from "../../assets/images/A-logo2.png";

const Login = (props) => {
  const dispatch = useDispatch();
  const [userLogin, setUserLogin] = useState({});

  const { user } = useSelector((state) => ({
    user: state.Account.user,
  }));

  useEffect(() => {
    if (user) {
      setUserLogin({
        email: user.email,
        password: user.password,
      });
    }
  }, [user]);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: userLogin.email || "",
      password: userLogin.password || "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: async (values) => {
      try {
        console.log("Sending login request with axios...");

        const response = await axios.post(
          "http://localhost:3005/user/login",
          values,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = response.data;
        console.log("Login response:", data);

        if (data.success) {
          const { token } = data.results;
          localStorage.setItem("token", token);

          // Decode JWT token
          const decoded = JSON.parse(atob(token.split(".")[1]));
          const userRole = decoded.role;

          // Redirect by role
          if (userRole === "admin") {
            props.router.navigate("/admin");
          } else if (userRole === "quality_member") {
            props.router.navigate("/qm");
          } else {
            props.router.navigate("/");
          }
        } else {
          alert("Invalid email or password");
        }
      } catch (error) {
        console.error("Login failed:", error);
        alert("Something went wrong. Please try again.");
      }
    },
  });

  document.title = "Login | Veltrix - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={4}>
              <Card className="overflow-hidden">
                <div className="bg-primary">
                  <div className="text-primary text-center p-4">
                    <h5 className="text-white font-size-20">Welcome To Assurify!</h5>
                    <p className="text-white-50">Sign in to Our Quality Control system.</p>
                    <Link to="/" className="logo logo-admin">
                      <img src={logo3} height="70" width="80" alt="logo" />
                    </Link>
                  </div>
                </div>

                <CardBody className="p-4">
                  <div className="p-3">
                    <Form
                      className="mt-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                      }}
                    >
                      <div className="mb-3">
                        <Label className="form-label" htmlFor="username">Email</Label>
                        <Input
                          name="email"
                          id="username"
                          placeholder="Enter Your Email"
                          type="email"
                          value={validation.values.email || ""}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={validation.touched.email && !!validation.errors.email}
                        />
                        <FormFeedback>{validation.errors.email}</FormFeedback>
                      </div>

                      <div className="mb-3">
                        <Label className="form-label" htmlFor="userpassword">Password</Label>
                        <Input
                          name="password"
                          type="password"
                          placeholder="Enter Password"
                          value={validation.values.password || ""}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={validation.touched.password && !!validation.errors.password}
                        />
                        <FormFeedback>{validation.errors.password}</FormFeedback>
                      </div>

                      <div className="mb-3 row">
                        <div className="col-sm-6">
                          <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="customControlInline" />
                            <label className="form-check-label" htmlFor="customControlInline">Remember me</label>
                          </div>
                        </div>
                        <div className="col-sm-6 text-end">
                          <button type="submit" className="btn btn-primary w-md waves-effect waves-light">
                            Log In
                          </button>
                        </div>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <div className="mt-5 text-center">
                <p>
                  © {new Date().getFullYear()} Assurify. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger" /> by our Team
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  error: state.Login.error,
});

export default withRouter(connect(mapStateToProps, { loginUser, apiError })(Login));

Login.propTypes = {
  error: PropTypes.any,
  history: PropTypes.object,
  loginUser: PropTypes.func,
};
