import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal"; // Adjust path
import axios from "axios";

// Components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/DataTableContainer";

const Users = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
const [userToDelete, setUserToDelete] = useState(null);

// Open modal
const confirmDelete = (id) => {
  setUserToDelete(id);
  setModalOpen(true);
};

// Confirm action
const handleDeleteConfirmed = async () => {
  try {
    const { data } = await axios.delete(`http://localhost:3005/user/${userToDelete}`, {
      headers: { token },
    });

    if (data.success) {
      toast.success("User deleted successfully!");
      setUsers((prev) => prev.filter((user) => user._id !== userToDelete));
    } else {
      toast.error(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    toast.error("An error occurred while deleting the user.");
  } finally {
    setModalOpen(false);
    setUserToDelete(null);
  }
};


  const token = localStorage.getItem("token");

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("http://localhost:3005/user", {
          headers: { token },
        });

        if (data.success) {
          setUsers(data.users);
        } else {
          console.error("Error fetching users:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchUsers();
  }, [token]);

  // Handle Edit
  const handleEdit = (id) => {
    const basePath = location.pathname.startsWith("/qm") ? "/qm" : "/admin";
    navigate(`${basePath}/addQm?id=${id}`);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const { data } = await axios.delete(`http://localhost:3005/user/${id}`, {
        headers: { token },
      });

      if (data.success) {
        toast.success("User deleted successfully!");
        setUsers((prev) => prev.filter((user) => user.id_by_organization !== id));
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred while deleting the user.");
    }
  };

  // Table Columns
  const columns = useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "id_by_organization",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Name",
        accessorKey: "name",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Phone",
        accessorKey: "phone",
        enableColumnFilter: false,
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

  document.title = "Users | React Admin Dashboard";

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Users" breadcrumbItem="All Users" />

        <TableContainer
          columns={columns}
          data={users}
          isGlobalFilter={true}
          isPagination={true}
          SearchPlaceholder="Search users..."
          pagination="pagination"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this user?"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setModalOpen(false)}
      />

    </div>
  );
};

export default Users;
