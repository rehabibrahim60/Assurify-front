import React, { Fragment, useEffect, useState } from "react";
import { Row, Table, Button, Col } from "reactstrap";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table';

import { rankItem } from '@tanstack/match-sorter-utils';
import JobListGlobalFilter from "./GlobalSearchFilter";

// Column Filter
const Filter = ({ column }) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '')}
        onChange={value => column.setFilterValue(value)}
        placeholder="Search..."
        className="w-36 border shadow rounded"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </>
  );
};

// Global Filter
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <React.Fragment>
      <Col sm={4}>
        <input {...props} value={value} onChange={e => setValue(e.target.value)} />
      </Col>
    </React.Fragment>
  );
};

const TableContainer = ({
  columns,
  data,
  tableClass,
  theadClass,
  divClassName,
  isBordered,
  isPagination,
  isGlobalFilter,
  paginationWrapper,
  SearchPlaceholder,
  paginationClassName,
  buttonClass,
  buttonName,
  isAddButton,
  isCustomPageSize,
  handleUserClick,
  isJobListGlobalFilter,
  pagination: externalPagination,
  setPagination: setExternalPagination,
  onSearch,
}) => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Always use internal pagination for client-side pagination
  const [pagination, setPagination] = useState(() => {
    // Try to restore from sessionStorage
    const savedPageIndex = sessionStorage.getItem("sessions_pageIndex");
    const savedPageSize = sessionStorage.getItem("sessions_pageSize");
    return {
      pageIndex: savedPageIndex ? parseInt(savedPageIndex) : 0,
      pageSize: savedPageSize ? parseInt(savedPageSize) : 10,
    };
  });

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({ itemRank });
    return itemRank.passed;
  };

  // Handle global filter change
  const handleGlobalFilterChange = (value) => {
    if (onSearch) {
      onSearch(value);
      // Reset to first page when searching
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    } else {
      setGlobalFilter(value);
    }
  };

  // Handle pagination change and save to sessionStorage
  const handlePaginationChange = (updater) => {
    setPagination(prev => {
      const newPagination = typeof updater === 'function' ? updater(prev) : updater;
      
      // Save to sessionStorage
      sessionStorage.setItem("sessions_pageIndex", newPagination.pageIndex.toString());
      sessionStorage.setItem("sessions_pageSize", newPagination.pageSize.toString());
      
      return newPagination;
    });
  };

  const table = useReactTable({
    columns,
    data,
    filterFns: { fuzzy: fuzzyFilter },
    state: {
      columnFilters,
      globalFilter: onSearch ? '' : globalFilter,
      pagination,
    },
    onPaginationChange: handlePaginationChange,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: onSearch ? () => {} : setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: false, // Always use client-side pagination
    pageCount: -1,
  });

  const {
    getHeaderGroups,
    getRowModel,
    getCanPreviousPage,
    getCanNextPage,
    getPageOptions,
    setPageIndex,
    nextPage,
    previousPage,
    getState,
    setPageSize,
  } = table;

  return (
    <Fragment>
      <Row className="mb-2">
        {isCustomPageSize && (
          <Col sm={2}>
            <select
              className="form-select pageSize mb-2"
              value={getState().pagination.pageSize}
              onChange={e => {
                const newPageSize = Number(e.target.value);
                setPageSize(newPageSize);
              }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </Col>
        )}

        {isGlobalFilter && (
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={handleGlobalFilterChange}
            className="form-control search-box me-2 mb-2 d-inline-block"
            placeholder={SearchPlaceholder}
          />
        )}

        {isJobListGlobalFilter && <JobListGlobalFilter setGlobalFilter={setGlobalFilter} />}

        {isAddButton && (
          <Col sm={6}>
            <div className="text-sm-end">
              <Button type="button" className={buttonClass} onClick={handleUserClick}>
                <i className="mdi mdi-plus me-1"></i> {buttonName}
              </Button>
            </div>
          </Col>
        )}
      </Row>

      <div className={divClassName ? divClassName : "table-responsive"}>
        <Table hover className={tableClass} bordered={isBordered}>
          <thead className={theadClass}>
            {getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} colSpan={header.colSpan} className={`${header.column.columnDef.enableSorting ? "sorting sorting_desc" : ""}`}>
                    {header.isPlaceholder ? null : (
                      <React.Fragment>
                        <div
                          className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{ asc: ' \u25B2', desc: ' \u25BC' }[header.column.getIsSorted()] ?? null}
                        </div>
                        {header.column.getCanFilter() && (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        )}
                      </React.Fragment>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {isPagination && (
        <Row className="justify-content-md-end justify-content-center align-items-center">
          <Col>
            <div className="dataTables_info">
              Showing {getState().pagination.pageIndex * getState().pagination.pageSize + 1} to{' '}
              {Math.min((getState().pagination.pageIndex + 1) * getState().pagination.pageSize, data.length)} of{' '}
              {data.length} Results
            </div>
          </Col>
          <Col className="col-md-auto">
            <div className={paginationWrapper}>
              <ul className={paginationClassName}>
                <li className={`paginate_button page-item previous ${!getCanPreviousPage() ? "disabled" : ""}`}>
                  <button 
                    className="page-link" 
                    onClick={() => previousPage()}
                    disabled={!getCanPreviousPage()}
                  >
                    <i className="mdi mdi-chevron-left"></i>
                  </button>
                </li>

                {getPageOptions().map((pageIndex) => (
                  <li
                    key={pageIndex}
                    className={`paginate_button page-item ${getState().pagination.pageIndex === pageIndex ? "active" : ""}`}
                  >
                    <button 
                      className="page-link" 
                      onClick={() => setPageIndex(pageIndex)}
                    >
                      {pageIndex + 1}
                    </button>
                  </li>
                ))}

                <li className={`paginate_button page-item next ${!getCanNextPage() ? "disabled" : ""}`}>
                  <button 
                    className="page-link" 
                    onClick={() => nextPage()}
                    disabled={!getCanNextPage()}
                  >
                    <i className="mdi mdi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      )}
    </Fragment>
  );
};

export default TableContainer;