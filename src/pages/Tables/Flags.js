import React, { useMemo, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/DataTableContainer";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

const Flags = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [flags, setFlags] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [flagToDelete, setFlagToDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:3005/flag", {
        headers: { token },
      })
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setFlags(data);
        } else if (data.success) {
          setFlags(data.flags);
        } else {
          toast.error("Error fetching flags.");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch flags.");
      });
  }, []);

  const handleEdit = (id) => {
    const basePath = location.pathname.startsWith("/qm") ? "/qm" : "/admin";
    navigate(`${basePath}/addFlag?id=${id}`);
  };

  const confirmDelete = (id) => {
    setFlagToDelete(id);
    setModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(`http://localhost:3005/flag/${flagToDelete}`, {
        headers: {
          token,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data.success) {
        toast.success("Flag deleted successfully!");
        setFlags((prev) => prev.filter((flag) => flag._id !== flagToDelete));
      } else {
        toast.error(`Error: ${response.data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting flag:", error);
      toast.error("An error occurred while deleting the flag.");
    } finally {
      setModalOpen(false);
      setFlagToDelete(null);
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
        header: "Flag Name",
        accessorKey: "flag_name",
        enableSorting: true,
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

  document.title = "Flags | Data Table - React Admin Dashboard";

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Flags" breadcrumbItem="Flags" />

        <TableContainer
          columns={columns}
          data={flags}
          isGlobalFilter={true}
          isPagination={true}
          SearchPlaceholder="Search flags..."
          pagination="pagination"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />

        <ConfirmModal
          isOpen={modalOpen}
          title="Delete Flag"
          message="Are you sure you want to delete this flag?"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => {
            setModalOpen(false);
            setFlagToDelete(null);
          }}
        />
      </div>
    </div>
  );
};

export default Flags;
