import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// Import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/DataTableContainer";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

const Sessions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sessions, setSessions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  

  const [pagination, setPagination] = useState(() => {
    const savedPageIndex = sessionStorage.getItem("pageIndex");
    const savedPageSize = sessionStorage.getItem("pageSize");
    return {
      pageIndex: savedPageIndex ? parseInt(savedPageIndex) : 0,
      pageSize: savedPageSize ? parseInt(savedPageSize) : 10,
    };
  });

  // // Fetch sessions
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   axios
  //     .get("http://localhost:3005/session", {
  //       headers: {
  //         token,
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then((res) => {
  //       if (res.data.success) {
  //         setSessions(res.data.sessions);
  //       } else {
  //         toast.error("Error: " + res.data.message);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Fetch error:", err);
  //       toast.error("Failed to fetch sessions.");
  //     });
  // }, []);

  // Redirect to Edit Page
  const handleEdit = (id) => {
    const basePath = location.pathname.startsWith("/qm") ? "/qm" : "/admin";
    navigate(`${basePath}/addSession?id=${id}`);
  };

  const fetchSessions = async () => {
    const token = localStorage.getItem("token");
  
    try {
      const res = await axios.get("http://localhost:3005/session", {
        headers: {
          token,
          "Content-Type": "application/json",
        },
      });
  
      if (res.data.success) {
        setSessions(res.data.sessions);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch sessions.");
    }
  };
  

  const handleSearch = async (query) => {
    const token = localStorage.getItem("token");
  
    if (!query) {
      // If search is cleared, re-fetch all sessions
      return fetchSessions();
    }
  
    try {
      const response = await axios.get("http://localhost:3005/session/search", {
        headers: {
          token,
        },
        params: {
          query,
        },
      });
  
      if (response.data.success) {
        setSessions(response.data.sessions);
      } else {
        toast.error("Search failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Error searching sessions.");
    }
  };
  
  useEffect(() => {
    fetchSessions();
  }, []);
  


  // Ask to confirm delete
  const confirmDelete = (id) => {
    setSessionToDelete(id);
    setModalOpen(true);
  };

  // Delete a session after confirm
  const handleDeleteConfirmed = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `http://localhost:3005/session/${sessionToDelete}`,
        {
          headers: {
            token,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Session deleted successfully!");
        setSessions((prev) => prev.filter((s) => s._id !== sessionToDelete));
      } else {
        toast.error("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("An error occurred while deleting the session.");
    } finally {
      setModalOpen(false);
      setSessionToDelete(null);
    }
  };

  // Table Columns
  const columns = useMemo(() => {
    const basePath = location.pathname.startsWith("/qm") ? "/qm" : "/admin";

    return [
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
      { header: "Title", accessorKey: "title", enableSorting: true },
      {
        header: "Tutor ID",
        cell: ({ row }) => row.original.tutor_id?.id_by_organization || "N/A",
      },
      {
        header: "Assigned To (QM)",
        cell: ({ row }) => row.original.assigned_to?.name || "N/A",
      },
      { header: "Date", accessorKey: "date", enableSorting: true },
      {
        header: "Video Link",
        accessorKey: "video.url",
        cell: ({ row }) => {
          const sessionId = row.original._id;

          return row.original.video?.url ? (
            <button
              className="btn btn-sm btn-info"
              onClick={() => navigate(`${basePath}/video?id=${sessionId}`)}
            >
              Watch Video
            </button>
          ) : (
            "No Video Available"
          );
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => <span>{row.original.status}</span>,
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
    ];
  }, [location.pathname]);

  document.title = "Assigned Sessions | React Admin Template";

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Sessions" breadcrumbItem="All Sessions" />

        <TableContainer
          columns={columns}
          data={sessions || []}
          isGlobalFilter={true}
          isPagination={true}
          SearchPlaceholder="Search Sessions..."
          paginationState={pagination}
          setPagination={setPagination}
          pagination="pagination"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />

        {/* Confirm Delete Modal */}
        <ConfirmModal
          isOpen={modalOpen}
          title="Confirm Deletion"
          message="Are you sure you want to delete this session?"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Sessions;
