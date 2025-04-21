import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/DataTableContainer";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { Button } from "reactstrap";
import { toast } from "react-toastify";

const TutorFlags = () => {
  const [flags, setFlags] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [flagToDelete, setFlagToDelete] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/qm") ? "/qm" : "/admin";
  const token = localStorage.getItem("token");

  // Fetch tutor flags
  useEffect(() => {
    axios
      .get("http://localhost:3005/tutorFlag", {
        headers: {
          token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.success) {
          setFlags(res.data.tutorFlags);
        } else {
          toast.error("Error: " + res.data.message);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch tutor flags.");
      });
  }, [token]);

  // Open confirm modal
  const confirmDelete = (id) => {
    setFlagToDelete(id);
    setModalOpen(true);
  };

  // Handle delete after confirmation
  const handleDeleteConfirmed = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3005/tutorFlag/${flagToDelete}`,
        {
          headers: {
            token,
          },
        }
      );

      if (response.data.success) {
        toast.success("Flag deleted successfully!");
        setFlags((prevFlags) =>
          prevFlags.filter((flag) => flag._id !== flagToDelete)
        );
      } else {
        toast.error("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Error deleting flag:", error);
      toast.error("An error occurred while deleting the flag.");
    } finally {
      setModalOpen(false);
      setFlagToDelete(null);
    }
  };

  // Table columns
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
        header: "Session",
        cell: ({ row }) => {
          const sessionId = row.original.session_id;
          return sessionId ? (
            <Button
              size="sm"
              color="info"
              onClick={() => navigate(`${basePath}/video?id=${sessionId}`)}
            >
              Watch Session
            </Button>
          ) : (
            "No Session Available"
          );
        },
      },
      {
        header: "Flag Name",
        cell: ({ row }) => row.original.flag_id?.flag_name || "N/A",
        enableSorting: true,
      },
      { header: "Comment", accessorKey: "comment" },
      {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row }) => (
          <>
            <Button
              color="primary"
              size="sm"
              onClick={() => navigate(`${basePath}/addTutorFlag?id=${row.original._id}`)}
            >
              Edit
            </Button>
            <Button
              color="danger"
              size="sm"
              className="ms-2"
              onClick={() => confirmDelete(row.original._id)}
            >
              Delete
            </Button>
          </>
        ),
      },
    ],
    [navigate, basePath]
  );

  document.title = "Tutor Flags | React Admin Dashboard";

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Flags" breadcrumbItem="Tutor Flags" />

        <TableContainer
          columns={columns}
          data={flags || []}
          isGlobalFilter={true}
          isPagination={true}
          SearchPlaceholder="Search flags..."
          pagination="pagination"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />

        {/* Confirm Delete Modal */}
        <ConfirmModal
          isOpen={isModalOpen}
          title="Confirm Deletion"
          message="Are you sure you want to delete this flag?"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default TutorFlags;
