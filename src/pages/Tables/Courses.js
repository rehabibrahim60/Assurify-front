import React, { useMemo, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/DataTableContainer";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:3005/course", {
        headers: { token },
      })
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setCourses(data);
        } else if (data.success) {
          setCourses(data.courses);
        } else {
          toast.error("Error fetching courses.");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch courses.");
      });
  }, []);

  const handleEdit = (id) => {
    const basePath = location.pathname.startsWith("/qm") ? "/qm" : "/admin";
    navigate(`${basePath}/addCourse?id=${id}`);
  };

  const confirmDelete = (id) => {
    setCourseToDelete(id);
    setModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(`http://localhost:3005/course/${courseToDelete}`, {
        headers: {
          token,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data.success) {
        toast.success("Course deleted successfully!");
        setCourses((prev) => prev.filter((course) => course._id !== courseToDelete));
      } else {
        toast.error(`Error: ${response.data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("An error occurred while deleting the course.");
    } finally {
      setModalOpen(false);
      setCourseToDelete(null);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "ID",
        cell: ({ row, table }) => {
          const pageIndex = table.getState().pagination.pageIndex;
          const pageSize = table.getState().pagination.pageSize;
          const rowIndex = row.index + 1 + pageIndex * pageSize;
          return <span>{rowIndex}</span>;
        },
        enableSorting: false,
      },
      {
        header: "Course Name",
        accessorKey: "title",
      },
      {
        header: "Number of Lessons",
        accessorKey: "num_of_lessons",
      },
      {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row }) => (
          <>
            <button
              className="btn btn-sm btn-primary me-2"
              onClick={() => handleEdit(row.original._id)}
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => confirmDelete(row.original._id)}
            >
              Delete
            </button>
          </>
        ),
      },
    ],
    []
  );

  document.title = "Courses | Data Table - React Admin Dashboard";

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Courses" breadcrumbItem="Courses" />

        <TableContainer
          columns={columns}
          data={courses}
          isGlobalFilter={true}
          isPagination={true}
          SearchPlaceholder="Search Courses..."
          pagination="pagination"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />

        <ConfirmModal
          isOpen={modalOpen}
          title="Delete Course"
          message="Are you sure you want to delete this course?"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => {
            setModalOpen(false);
            setCourseToDelete(null);
          }}
        />
      </div>
    </div>
  );
};

export default Courses;
