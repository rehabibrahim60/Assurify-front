import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { Container, Row, Col, CardBody, Card, Form, FormFeedback, Input, Alert, Spinner } from "reactstrap";
import axios from "axios";

// Import images
import logo from "../../assets/images/logo-sm.png";

const TutorData = () => {
  const [tutorData, setTutorData] = useState(null);
  const [tutorReports, setTutorReports] = useState([]); // Separate state for reports
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: { nid: "" },
    validationSchema: Yup.object({
      nid: Yup.string()
        .required("Please Enter NID")
        .matches(/^\d{14}$/, "NID must be 14 digits"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      setTutorData(null);
      setTutorReports([]); // Clear previous reports

      const token = localStorage.getItem("token"); // Get token from localStorage

      try {
        console.log(values.nid);
        const response = await axios.get(`http://localhost:3005/tutor/nid/${values.nid}`, {
          headers: {
            token, // Include token in request headers
            "Content-Type": "application/json",
          },
        });

        const tutor = response.data.tutor;
        setTutorData(tutor); // Store tutor data

        // Fetch reports only if tutor exists
        if (tutor?._id) {
          fetchReports(tutor._id, token);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Tutor not found. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  // Fetch reports using tutor ID
  const fetchReports = async (tutorId, token) => {
    try {
      const reportsResponse = await axios.get(`http://localhost:3005/report/tutor/${tutorId}`, {
        headers: {
          token,
          "Content-Type": "application/json",
        },
      });

      setTutorReports(reportsResponse.data.reports || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setTutorReports([]); // Ensure empty reports if request fails
    }
  };

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/dashboard" className="text-dark">
          <i className="fas fa-home h2"></i>
        </Link>
      </div>

      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <Container fluid>
          <Row className="justify-content-center">
            <Col md="10" lg="8" xl="6">
              <Card className="overflow-hidden w-100">
                <div className="bg-primary">
                  <div className="text-primary text-center p-4">
                    <h5 className="text-white font-size-20">Tutor Credentials</h5>
                    <p className="text-white-50">Enter your national ID</p>
                    <Link to="/dashboard" className="logo logo-admin">
                      {/* <img src={logo} height="24" alt="logo" /> */}
                    </Link>
                  </div>
                </div>

                <CardBody className="p-5">
                  {/* Search Form */}
                  <Form
                    className="mt-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                    }}
                  >
                    <div className="mb-3">
                      <label className="form-label" htmlFor="nid">NID</label>
                      <Input
                        name="nid"
                        className="form-control"
                        placeholder="Enter your national ID"
                        type="text"
                        id="nid"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.nid || ""}
                        invalid={validation.touched.nid && validation.errors.nid ? true : false}
                      />
                      {validation.touched.nid && validation.errors.nid ? (
                        <FormFeedback type="invalid">{validation.errors.nid}</FormFeedback>
                      ) : null}
                    </div>

                    <div className="text-end">
                      <button className="btn btn-primary w-100 waves-effect waves-light" type="submit" disabled={loading}>
                        {loading ? <Spinner size="sm" /> : "Search"}
                      </button>
                    </div>
                  </Form>

                  {/* Error Alert */}
                  {error && <Alert color="danger" className="mt-3">{error}</Alert>}

                  {/* Tutor Data (if available) */}
                  {tutorData && (
                    <div className="mt-4 p-3 border rounded bg-white">
                      <h5 className="text-primary">Tutor Details</h5>
                      <p><strong>Name:</strong> {tutorData.name}</p>
                      <p><strong>National Id:</strong> {tutorData.national_id}</p>
                      <p><strong>ID:</strong> {tutorData.id_by_organization}</p>
                      <p><strong>Phone:</strong> {tutorData.phone}</p>

                      <h5 className="text-primary mt-4">Reports</h5>
                      {tutorReports.length > 0 ? (
                        <ul className="list-unstyled">
                          {tutorReports.map((report, index) => (
                            <li key={report} className="mb-2">
                              <Link to={`/report-temp?id=${report}`} className="text-primary text-decoration-underline">
                                Report {index + 1}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No reports available.</p>
                      )}

                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default TutorData;
