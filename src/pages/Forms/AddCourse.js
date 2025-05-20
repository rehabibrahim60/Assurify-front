import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Label,
  Input,
  Button,
  Container,
  CardTitle,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import { toast } from "react-toastify";

const AddCourse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get("id");

  const [formData, setFormData] = useState({
    title: "",
    num_of_lessons: "",
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (courseId) {
      setEditMode(true);
      const token = localStorage.getItem("token");

      axios
        .get(`http://localhost:3005/course/${courseId}`, {
          headers: {
            token,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const data = response.data;
          if (data.success && data.course) {
            setFormData({
              title: data.course.title,
              num_of_lessons: data.course.num_of_lessons,
            });
          } else {
            toast.error("Course not found.");
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          toast.error("Failed to fetch course data.");
        });
    }
  }, [courseId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "num_of_lessons" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const method = editMode ? "patch" : "post";
    const url = editMode
      ? `http://localhost:3005/course/${courseId}`
      : `http://localhost:3005/course`;

    try {
      const response = await axios({
        method,
        url,
        headers: {
          token,
          "Content-Type": "application/json",
        },
        data: formData,
      });

      const result = response.data;
      if (result.success) {
        toast.success(editMode ? "Course updated successfully!" : "Course added successfully!");
        navigate("/admin/course");
      } else {
        toast.error("Error: " + (result.message || "Something went wrong"));
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Request failed. Please try again later.");
    }
  };

  document.title = editMode
    ? "Edit Course | React Admin Dashboard"
    : "Add Course | React Admin Dashboard";

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Courses" breadcrumbItem={editMode ? "Edit Course" : "Add Course"} />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <CardTitle className="h4">{editMode ? "Edit Course" : "Course Form"}</CardTitle>
                <Form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <Label htmlFor="title">Course Name</Label>
                    <Input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <Label htmlFor="num_of_lessons">Number of Lessons</Label>
                    <Input
                      type="number"
                      id="num_of_lessons"
                      value={formData.num_of_lessons}
                      onChange={handleChange}
                      min={1}
                      required
                    />
                  </div>

                  <Button type="submit" color="primary">
                    {editMode ? "Update" : "Submit"}
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddCourse;
