import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
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
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from "react-select";
import { toast } from "react-toastify";

const AddPdf = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pdfId = queryParams.get("id");
    const basePath = location.pathname.startsWith("/admin") ? "/admin" : "/qm";

    const [formData, setFormData] = useState({
        course_id: "",
        lesson_id: "",
        file: null,
        pdfTitle : ""
    });

    const [courses, setCourses] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        // Fetch courses
        axios.get("http://localhost:3005/course", {
        headers: { token },
        })
        .then((res) => setCourses(res.data.courses || []))
        .catch((err) => console.error("Error fetching courses:", err));


        // If editing an existing PDF record
        if (pdfId) {
        setEditMode(true);
        axios.get(`http://localhost:3005/pdf/${pdfId}`, {
            headers: { token },
        })
            .then((res) => {
            if (res.data.success) {
                setFormData({
                course_id: res.data.pdf.course_id,
                lesson_id: res.data.pdf.lesson_id,
                file: null, // file can't be pre-filled
                });

                axios.get(`http://localhost:3005/course/lesson/${res.data.pdf.course_id}`, {
                headers: { token },
                })
                .then((res) => setLessons(res.data.lessons || []))
                .catch((err) => console.error("Error fetching lessons:", err));


            } else {
                console.error("Error fetching PDF:", res.data.message);
            }
            })
            .catch((err) => console.error("Fetch error:", err));
        }
    }, [pdfId]);

    const handleChange = (e) => {
        const { id, value, files } = e.target;
        if (id === "file") {
        setFormData({ ...formData, file: files[0] });
        } else {
        setFormData({ ...formData, [id]: value });
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const selectedCourse = courses.find((c) => c._id === formData.course_id);
        const selectedLesson = lessons.find((l) => l._id === formData.lesson_id);
        const dynamicTitle = `${selectedCourse?.title || "Unknown Course"} /lesson ${selectedLesson?.lesson || "Unknown Lesson"}`;
        const form = new FormData();
        form.append("course_id", formData.course_id);
        form.append("lesson_id", formData.lesson_id);
        form.append("pdfTitle", dynamicTitle);
        if (formData.file) form.append("file", formData.file);

        const method = editMode ? "patch" : "post";
        const url = editMode
        ? `http://localhost:3005/pdf/${pdfId}`
        : "http://localhost:3005/pdf";

        try {
        const response = await axios({
            method,
            url,
            headers: {
            token,
            "Content-Type": "multipart/form-data",
            },
            data: form,
        });

        if (response.data.success) {
            toast.success(editMode ? "PDF updated successfully!" : "PDF uploaded successfully!");
            navigate(`${basePath}/pdf`); // Or adjust route as needed
        } else {
            toast.error("Error: " + response.data.message);
        }
        } catch (error) {
        console.error("Upload error:", error);
        }
    };

    const handleSelectChange = async (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    const value = selectedOption ? selectedOption.value : "";

    setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "course_id" ? { lesson_id: "" } : {}) // reset lesson if course changes
    }));

    if (name === "course_id" && value) {
        const token = localStorage.getItem("token");
        try {
        const res = await axios.get(`http://localhost:3005/course/lesson/${value}`, {
            headers: { token },
        });
        if (res.data.success) {
            setLessons(res.data.lessons);
        } else {
            toast.error("Failed to load lessons for selected course.");
        }
        } catch (err) {
        console.error("Error fetching lessons:", err);
        toast.error("Error fetching lessons.");
        }
    }

    // Optionally, clear lessons if course is cleared
    if (name === "course_id" && !value) {
        setLessons([]);
    }
    };


    document.title = editMode
        ? "Edit PDF | React Admin Dashboard"
        : "Add PDF | React Admin Dashboard";

return (
    <React.Fragment>
    <div className="page-content">
        <Container fluid={true}>
        <Breadcrumbs title="PDFs" breadcrumbItem={editMode ? "Edit PDF" : "Add PDF"} />

        <Row>
            <Col lg={12}>
            <Card>
                <CardBody>
                <Form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <Label htmlFor="course_id">Course</Label>
                    <Select
                        name="course_id"
                        value={courses.find((c) => c._id === formData.course_id)
                            ? { value: formData.course_id, label: courses.find((c) => c._id === formData.course_id)?.title }
                            : null}
                        onChange={handleSelectChange}
                        options={courses.map((course) => ({
                            value: course._id,
                            label: course.title,
                        }))}
                        isClearable
                    />

                    </div>

                    <div className="mb-3">
                    <Label htmlFor="lesson_id">Lesson</Label>
                    <Select
                        name="lesson_id"
                        value={lessons.find((l) => l._id === formData.lesson_id)
                            ? { value: formData.lesson_id, label: lessons.find((l) => l._id === formData.lesson_id)?.lesson }
                            : null}
                        onChange={handleSelectChange}
                        options={lessons.map((lesson) => ({
                            value: lesson._id,
                            label: lesson.lesson,
                        }))}
                        isClearable
                    />

                    </div>


                    <div className="mb-3">
                        <Label htmlFor="file">Upload PDF</Label>
                        <Input
                            type="file"
                            id="file"
                            accept=".pdf"
                            onChange={handleChange}
                            required={!editMode}
                        />
                        </div>

                        <Button type="submit" color="primary">
                        {editMode ? "Update PDF" : "Upload PDF"}
                        </Button>
                    </Form>
                    </CardBody>
                </Card>
                </Col>
            </Row>
            </Container>
        </div>
    </React.Fragment>
    );    
};

export default AddPdf;
