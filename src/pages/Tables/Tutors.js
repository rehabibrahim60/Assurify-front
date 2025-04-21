import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/DataTableContainer";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

const Tutors = () => {
  const [tutors, setTutors] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [tutorToDelete, setTutorToDelete] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  // Fetch tutors from API
  useEffect(() => {
    axios
      .get("http://localhost:3005/tutor", {
        headers: { token },
      })
      .then((res) => {
        if (res.data.success) {
          setTutors(res.data.tutors);
        } else {
          toast.error("Error: " + res.data.message);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch tutors.");
      });
  }, [token]);

  // Redirect to Edit Page
  const handleEdit = (id) => {
    const basePath = location.pathname.startsWith("/qm") ? "/qm" : "/admin";
    navigate(`${basePath}/addTutor?id=${id}`);
  };

  // Show confirm modal
  const confirmDelete = (id) => {
    setTutorToDelete(id);
    setModalOpen(true);
  };

  // Handle confirmed deletion
  const handleDeleteConfirmed = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3005/tutor/${tutorToDelete}`,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Tutor deleted successfully!");
        setTutors((prev) =>
          prev.filter((tutor) => tutor._id !== tutorToDelete)
        );
      } else {
        toast.error("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Error deleting tutor:", error);
      toast.error("An error occurred while deleting the tutor.");
    } finally {
      setModalOpen(false);
      setTutorToDelete(null);
    }
  };

  // Table Columns
  const columns = useMemo(
    () => [
      { header: "ID", accessorKey: "id_by_organization", enableSorting: true },
      { header: "Name", accessorKey: "name", enableSorting: true },
      { header: "NID", accessorKey: "national_id", enableSorting: true },
      { header: "Phone", accessorKey: "phone", enableSorting: true },
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

  document.title = "Tutors | Data Table - React Admin Dashboard";

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Tutors" breadcrumbItem="All Tutors" />

        <TableContainer
          columns={columns}
          data={tutors || []}
          isGlobalFilter={true}
          isPagination={true}
          SearchPlaceholder="Search tutors..."
          pagination="pagination"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />

        {/* Confirm Modal */}
        <ConfirmModal
          isOpen={isModalOpen}
          title="Confirm Deletion"
          message="Are you sure you want to delete this tutor?"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Tutors;
