import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// Import components
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/DataTableContainer";

const QmFlags = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [flags, setFlags] = useState([]);

  // Fetch flags from the backend using axios
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:3005/flag", {
        headers: { token },
      })
      .then((response) => {
        const data = response.data;
        console.log("Fetched data:", data);

        if (Array.isArray(data)) {
          // API is returning an array directly
          setFlags(data);
        } else if (data.success) {
          setFlags(data.flags);
        } else {
          console.error("Error fetching flags:", data);
        }
      })
      .catch((err) => {
        console.error("Axios error:", err);
      });
  }, []);

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
        enableColumnFilter: false,
        enableSorting: true,
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
      </div>
    </div>
  );
};

export default QmFlags;
