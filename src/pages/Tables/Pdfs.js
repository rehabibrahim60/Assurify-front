import React, { useMemo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/DataTableContainer";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

const PDFs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [pdfs, setPdfs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pdfToDelete, setPdfToDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:3005/pdf", {
        headers: { token },
      })
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setPdfs(data);
        } else if (data.success) {
          setPdfs(data.pdfs);
        } else {
          toast.error("Error fetching PDFs.");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch PDFs.");
      });
  }, []);

  const handleEdit = (id) => {
    const basePath = location.pathname.startsWith("/qm") ? "/qm" : "/admin";
    navigate(`${basePath}/addPdf?id=${id}`);
  };

  const confirmDelete = (id) => {
    setPdfToDelete(id);
    setModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(`http://localhost:3005/pdf/${pdfToDelete}`, {
        headers: {
          token,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data.success) {
        toast.success("PDF deleted successfully!");
        setPdfs((prev) => prev.filter((pdf) => pdf._id !== pdfToDelete));
      } else {
        toast.error(`Error: ${response.data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting PDF:", error);
      toast.error("An error occurred while deleting the PDF.");
    } finally {
      setModalOpen(false);
      setPdfToDelete(null);
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
        header: "PDF Link",
        accessorKey: "file.url",
        cell: ({ row }) => (
          <a href={row.original.file.url} target="_blank" rel="noopener noreferrer">
            View PDF
          </a>
        ),
        enableSorting: false,
      },
      {
        header: "Course Name",
        accessorKey: "course_id.title",
        cell: ({ row }) => row.original.course_id?.title || "N/A",
      },
      {
        header: "Lesson",
        accessorKey: "lesson_id.lesson",
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

  document.title = "PDFs | Data Table - React Admin Dashboard";

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="PDFs" breadcrumbItem="PDFs" />

        <TableContainer
          columns={columns}
          data={pdfs}
          isGlobalFilter={true}
          isPagination={true}
          SearchPlaceholder="Search PDFs..."
          pagination="pagination"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />

        <ConfirmModal
          isOpen={modalOpen}
          title="Delete PDF"
          message="Are you sure you want to delete this PDF?"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => {
            setModalOpen(false);
            setPdfToDelete(null);
          }}
        />
      </div>
    </div>
  );
};

export default PDFs;
