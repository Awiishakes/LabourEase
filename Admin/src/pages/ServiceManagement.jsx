import { useState, useMemo, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useTable, usePagination, useSortBy } from "react-table";
import ManagementLoader from "../components/Loaders/ManagementLoader";
import { useGlobal } from "../context/ContextHolder";
import { Link, useNavigate } from "react-router-dom";

const ServiceManagement = () => {
  const {loading} = useGlobal()
  const navigateTo = useNavigate()
  const [services, setServices] = useState([])
  const [filter, setFilter] = useState({ city: "", status: "", search: '' });

  const fetchData= useCallback(async ()=>{
    await axios.get('http://localhost:4000/api/admin/getAllServices', { withCredentials:true })
    .then((res)=>{
        setServices(res.data.allServices || [])
    }).catch((err)=>toast.error(err.response.data.message))
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])
  
  const filteredServices = useMemo(()=> {
    return services.filter((service)=>{
      const matchesCity = filter.city? service.city === filter.city : true
      const matchesStatus = filter.status? service.active === filter.status : true
      const matchesSearch = filter.search? 
          service.title.toLowerCase().includes(filter.search.toLowerCase()) ||
          service.category.toLowerCase().includes(filter.search.toLowerCase()) : true
      return matchesCity && matchesStatus && matchesSearch
    })
  }, [filter.city, filter.search, filter.status, services])

  const handleDelete = useCallback(async (service) => {
    await axios.delete(`http://localhost:4000/api/admin/deleteService/${service._id}`, { withCredentials:true })
    .then((res)=>{
      toast.success(res.data.message)
      fetchData()
    })
    .catch((err)=>toast.error(err.response.data.message))
  }, [fetchData])

  const handleView = useCallback((service) => {
    navigateTo('detials/'+service._id)    
  }, [navigateTo])

  const columns = useMemo(
    () => [
      { Header: "Title", accessor: "title" },
      { Header: "City", accessor: "city" },
      { Header: "Category", accessor: "category" },
      { Header: "Posted By", accessor: "postedBy" },
      { Header: "Status", accessor: "active" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => handleView(row.original)}>
              View
            </button>
            <button className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => handleDelete(row.original)}>
              Delete
            </button>
          </div>
        ),
      },
    ],
    [handleDelete, handleView]
  );

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page, canPreviousPage,
          canNextPage, pageOptions, nextPage, previousPage, setPageSize, state: { pageIndex, pageSize },
        } = useTable( { columns, data: filteredServices, initialState: { pageIndex: 0 }, },
              useSortBy, usePagination );

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  if (loading) return <ManagementLoader />

  return (
    <div className="p-4">
      <div className="w-full flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold mb-4 text-[#101820]">Service Management</h1>
        <Link to={'new'} className='bg-[#101820] text-white px-4 py-2 rounded-md shadow-md'>
          + New Service
        </Link>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input className="bg-[#101820] rounded-md p-2 text-gray-400"
            placeholder="Search by title and Category"
            name="search"
            value={filter.search}
            onChange={handleFilterChange}
          />
          <select className="bg-[#101820] rounded-md p-2 text-gray-400"
            name="city"
            value={filter.city}
            onChange={handleFilterChange}
          >
            <option value="">All City</option>
            <option value="hyderabad">Hyderabad</option>
            <option value="paretabad">Paretabad</option>
            <option value="latifabad">Latifabad</option>
          </select>
          <select className="bg-[#101820] rounded-md p-2 text-gray-400"
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inActive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto" style={{scrollbarWidth:'thin', scrollbarColor:'#facc15 #101820'}}>
        <table {...getTableProps()} className="table-auto w-full">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.getHeaderGroupProps().key} role={headerGroup.getHeaderGroupProps().role}>
                {headerGroup.headers.map((column) => (
                  <th
                    key={column.getHeaderProps(column.getSortByToggleProps()).key} 
                    colSpan={column.getHeaderProps(column.getSortByToggleProps()).colSpan}
                    role={column.getHeaderProps(column.getSortByToggleProps()).role}
                    style={{...column.getHeaderProps(column.getSortByToggleProps()).style}}
                    title={column.getHeaderProps(column.getSortByToggleProps()).title}
                    onClick={column.getHeaderProps(column.getSortByToggleProps()).onClick}
                    className="px-4 py-3 text-left text-yellow-400 font-medium bg-[#101820] border-b-2"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-[#101820]">
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr key={row.getRowProps().key} role={row.getRowProps().role} className="border-t hover:bg-slate-800">
                  {row.cells.map((cell) => (
                    <td key={cell.getCellProps().key} role={cell.getCellProps().role} className="px-4 py-2 text-white/70">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex space-x-2 text-[#101820]">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="px-2 sm:px-3 py-1 max-sm:text-sm bg-yellow-400 rounded hover:bg-yellow-600 disabled:bg-yellow-400"
          >
            Previous
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="px-2 sm:px-3 py-1 max-sm:text-sm bg-yellow-400 rounded hover:bg-yellow-600 disabled:bg-yellow-400"
          >
            Next
          </button>
        </div>
        <span className="max-sm:text-sm">
          Page {pageIndex + 1} of {pageOptions.length}
        </span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="border border-[#101802] rounded px-1 sm:px-2 py-1 max-sm:text-sm"
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ServiceManagement;
