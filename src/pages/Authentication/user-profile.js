import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Alert,
  Button,
  Form,
  FormFeedback,
  Label,
  Input
} from "reactstrap";

import * as Yup from "yup";
import {jwtDecode} from 'jwt-decode';
import { useFormik } from "formik";

import Breadcrumb from "../../components/Common/Breadcrumb";
import avatar from "../../assets/images/users/user-4.jpg";

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        
        console.log(decoded);
        
        const res = await axios.get(`http://localhost:3005/user/${decoded._id}`, {
          headers: { token }
        });
        setUser(res.data.user); 
      } catch (err) {
        console.error(err);
        setError("Failed to load user data.");
      }
    };

    fetchUser();
  }, []);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      id_by_organization: user.id_by_organization || ""
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string().required("Phone is required"),
      id_by_organization: Yup.string().required("ID is required"),
    }),
    onSubmit: async (values) => {
      try {
        console.log(user);
        
        const res = await axios.patch(`http://localhost:3005/user/${user._id}`, values, {
          headers: { token }
        });
        setSuccess("User updated successfully");
        setError("");
        console.log(res.data.user);
        
        setUser(res.data.user);
      } catch (err) {
        setError("Failed to update user.");
        setSuccess("");
        console.error(err);
      }
    }
  });

  document.title = "Profile | React Admin Dashboard";

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="Dashboard" breadcrumbItem="Profile" />

        <Row>
          <Col lg="12">
            {error && <Alert color="danger">{error}</Alert>}
            {success && <Alert color="success">{success}</Alert>}

            <Card>
              <CardBody>
                <div className="d-flex">
                  <div className="mx-3">
                    <img
                      src={avatar}
                      alt=""
                      className="avatar-md rounded-circle img-thumbnail"
                    />
                  </div>
                  <div className="align-self-center flex-1">
                    <div className="text-muted">
                      <p><h5>Name: </h5>{user.name}</p>
                      <p className="mb-1"><h5>Email: </h5>{user.email}</p>
                      <p className="mb-0"><h5>ID: </h5>{user.id_by_organization}</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <h4 className="card-title mb-4">Edit Profile</h4>

        <Card>
          <CardBody>
            <Form
              className="form-horizontal"
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
              }}
            >
              <div className="form-group">
                <Label className="form-label">Name</Label>
                <Input
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="Enter Name"
                  value={validation.values.name}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  invalid={!!(validation.touched.name && validation.errors.name)}
                />
                <FormFeedback>{validation.errors.name}</FormFeedback>
              </div>

              <div className="form-group">
                <Label className="form-label">Email</Label>
                <Input
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="Enter Email"
                  value={validation.values.email}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  invalid={!!(validation.touched.email && validation.errors.email)}
                />
                <FormFeedback>{validation.errors.email}</FormFeedback>
              </div>

              <div className="form-group">
                <Label className="form-label">Phone</Label>
                <Input
                  name="phone"
                  type="text"
                  className="form-control"
                  placeholder="Enter Phone"
                  value={validation.values.phone}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  invalid={!!(validation.touched.phone && validation.errors.phone)}
                />
                <FormFeedback>{validation.errors.phone}</FormFeedback>
              </div>

              <div className="form-group">
                <Label className="form-label">ID by Organization</Label>
                <Input
                  name="id_by_organization"
                  type="text"
                  className="form-control"
                  placeholder="Enter ID"
                  value={validation.values.id_by_organization}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  invalid={!!(validation.touched.id_by_organization && validation.errors.id_by_organization)}
                />
                <FormFeedback>{validation.errors.id_by_organization}</FormFeedback>
              </div>

              <div className="text-center mt-4">
                <Button type="submit" color="primary">
                  Update Profile
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default UserProfile;
