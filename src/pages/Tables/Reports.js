import React, { useMemo } from "react";
import { Button } from "reactstrap";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/DataTableContainer";

const Reports = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const basePath = location.pathname.startsWith("/qm") ? "/qm" : "/admin";

  const handleEdit = (id) => {
    navigate(`${basePath}/addReport?id=${id}`);
  };

  const handleDelete = (id) => {
    console.log("Delete record with ID:", id);
    // Add delete logic here
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
      { header: "Session ID", accessorKey: "session_id" },
      { header: "Session Text", accessorKey: "session_text" },
      { header: "Similarity", accessorKey: "similarity" },
      { header: "Bad Words", accessorKey: "bad_word" },
      { header: "Noise", accessorKey: "noise" },
      { header: "Upnormal Behaviour", accessorKey: "upnormal_behaviour" },
      { header: "Time Tracking", accessorKey: "time_tracking" },
      {
        header: "Report Link",
        accessorKey: "report_link",
        cell: ({ row }) => (
          <Link to={`${basePath}/report-temp?id=${row.original.session_id}`} >
            View Report
          </Link>
        ),
      },
      {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row }) => (
          <>
            <Button
              color="primary"
              size="sm"
              className="me-2"
              onClick={() => handleEdit(row.original.session_id)}
            >
              Edit
            </Button>
            <Button
              color="danger"
              size="sm"
              onClick={() => handleDelete(row.original.session_id)}
            >
              Delete
            </Button>
          </>
        ),
      },
    ],
    [navigate, basePath]
  );

  const data = [
    {
      session_id: "1",
      session_text: "Sample text",
      similarity: 95,
      bad_word: "None",
      noise: "Low",
      upnormal_behaviour: "None",
      time_tracking: "10:00 - 10:30 (Speak)",
    },
  ];

  document.title = "Data Tables | Skote - React Admin & Dashboard Template";

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Reports" breadcrumbItem="All Reports" />
        <TableContainer
          columns={columns}
          data={data}
          isGlobalFilter={true}
          isPagination={true}
          SearchPlaceholder="Search reports..."
          pagination="pagination"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
    </div>
  );
};

export default Reports;
