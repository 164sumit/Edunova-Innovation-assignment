"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
} from "@tanstack/react-table";
import { faker } from "@faker-js/faker";
import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Person } from "@/app/types";

import PersonForm from "./PersonForm";

import { Badge } from "./ui/badge";
import { ArrowDown, ArrowUp, ArrowUp01, ChevronLeftIcon } from "lucide-react";
import UserProfile from "./UserProfile";
import EditProfile from "./EditProfile";

const PeopleDirectory = ({ pdata }: { pdata: Person[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<Person[]>(pdata);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showRoles, setShowRoles] = useState(false);
  const [showTeams, setShowTeams] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // For selection checkboxes
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    personId: string | null;
  }>({ isOpen: false, personId: null });
  const handleFilterClick = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  const handleRoleClick = () => {
    setShowRoles(!showRoles);
    setShowTeams(false);
  };

  const handleTeamClick = () => {
    setShowTeams(!showTeams);
    setShowRoles(false);
  };

  const handleRoleSelect = (role: string) => {
    if(selectedRoles.includes(role)){
        setSelectedRoles([]);
        return;
    }
    setSelectedRoles([role]); // Single selection for roles
  };

  const handleTeamSelect = (team: string) => {
    setSelectedTeams(prev => 
      prev.includes(team) ? prev.filter(t => t !== team) : [...prev, team]
    );
  };

  const handleApplyFilter = () => {
    // Apply the filter for roles
    if (selectedRoles.length > 0) {
      table.getColumn('role')?.setFilterValue(selectedRoles[0]); // Assuming single selection for roles
    } else {
      table.getColumn('role')?.setFilterValue(undefined);
    }
  
    // Apply the filter for teams
    if (selectedTeams.length > 0) {
      table.getColumn('teams')?.setFilterValue(selectedTeams);
    } else {
      table.getColumn('teams')?.setFilterValue(undefined);
    }
  
    setShowFilterDropdown(false);
  };

  const uniqueRoles = useMemo(
    () => Array.from(new Set(pdata.map((person) => person.role))),
    [pdata]
  );
  const uniqueTeams = useMemo(
    () => Array.from(new Set(pdata.flatMap((person) => person.teams))),
    [pdata]
  );

  const columns = useMemo<ColumnDef<Person>[]>(
    () => [
        {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            className="size-4"
            onChange={(e) => {
              setSelectedIds(
                e.target.checked
                  ? table.getRowModel().rows.map((row) => row.original.id)
                  : []
              );
              table.toggleAllPageRowsSelected(e.target.checked);
            }}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            // className="size-4 text-gray-600"
            // onClick={()=>{
            //     handleCloseDetails();
            // }}
            onChange={() => {
              row.toggleSelected();
              setSelectedIds((prev) =>
                row.getIsSelected()
                  ? [...prev, row.original.id]
                  : prev.filter((id) => id !== row.original.id)
              );
            }}
          />
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        // cell: (info) => info.getValue(),
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              height="2em"
              viewBox="0 0 50 50"
            >
              <g
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.4"
              >
                <path
                  stroke="#344054"
                  d="M18.75 31.25h12.5a10.417 10.417 0 0 1 10.417 10.417a2.083 2.083 0 0 1-2.084 2.083H10.417a2.083 2.083 0 0 1-2.084-2.083A10.417 10.417 0 0 1 18.75 31.25"
                />
                <path
                  stroke="#306cfe"
                  d="M25 22.917A8.333 8.333 0 1 0 25 6.25a8.333 8.333 0 0 0 0 16.667"
                />
              </g>
            </svg>
            {/* <Image
        src={row.original.avatar} // Replace with your image path
        alt="Description of your image"
        width={24} // Adjust width as needed
        height={24} // Adjust height as needed
        layout="responsive"
      /> */}
            <div>
              <p className="font-medium">{row.original.name}</p>
              <p className="text-sm text-gray-500">{row.original.username}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div className="flex items-center px-2 py-2 rounded border-[1.5px] border-solid  border-[#D0D5DD]">
              <div className={`w-2 h-2 rounded-full ${row.original.status==='Active' ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="ml-2 text-sm">{row.original.status}</span>
            </div>
          ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "email",
        header: "Email address",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "teams",
        header: "Teams",
        cell: ({ row }) => {
            const sortedTeams = [...row.original.teams].sort((a, b) => {
              const order = ["Design", "Product", "Engineering"];
              return order.indexOf(a) - order.indexOf(b);
            });
        
            const displayTeams = sortedTeams.slice(0, 3);
            const remainingTeams = sortedTeams.length - 3;
        
            return (
              <div className="flex space-x-2">
                {displayTeams.map((team, idx) => (
                  <Badge
                    className={` border-solid border-[1.5px] ${
                      team === "Design"
                        ? "bg-[#F9F5FF] border-[#E9D7FE] text-[#6941C6]"
                        : team === "Product"
                        ? "bg-[#EFF8FF] border-[#B2DDFF] text-[#175CD3]"
                        : "bg-[#EEF4FF] border-[#C7D7FE] text-[#3538CD]"
                    }`}
                    key={idx}
                    variant="secondary"
                  >
                    {team}
                  </Badge>
                ))}
                  <Badge
                    variant="secondary"
                    className="bg-inherit border-solid border-[1.5px] border-[#E4E7EC]"
                  >
                    +{4}
                  </Badge>
                {remainingTeams > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-inherit border-solid border-[1.5px] border-[#E4E7EC]"
                  >
                    +{remainingTeams}
                  </Badge>
                )}
              </div>
            );
          },
        filterFn: (row, columnId, filterValue) => {
            if (!filterValue || filterValue.length === 0) return true;
            return filterValue.every((team:string) => row.original.teams.includes(team));
          }
      },
      {
        
        id: "actions",
        cell: ({ row }) => (
          <div className="flex gap-4 mr-3">
            <button
            //   onClick={(e) => {
            //     e.stopPropagation();
            //     handleDeletePerson(row.original.id);
            //   }}
            onClick={(e) => {
                e.stopPropagation();
                setDeleteConfirmation({
                  isOpen: true,
                  personId: row.original.id,
                });
              }}

              className="text-gray-600 hover:text-red-600"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditPerson(row.original);
              }}
              className="text-gray-600 hover:text-blue-600"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (globalFilter) {
      params.set("query", globalFilter);
    } else {
      params.delete("query");
    }
    router.push(`/people?${params.toString()}`, { scroll: false });
  }, [globalFilter, router, searchParams]);

  const handleRowClick = (person: Person) => {
    setSelectedPerson(person);
  };

  const handleCloseDetails = () => {
    setSelectedPerson(null);
  };

  const handleAddMember = () => {
    setEditingPerson(null);
    setIsFormOpen(true);
  };

  const handleEditPerson = (person: Person) => {
    setEditingPerson(person);
    setIsFormOpen(true);
  };

  const handleDeletePerson = () => {
    if (deleteConfirmation.personId) {
      setData((prevData) =>
        prevData.filter((p) => p.id !== deleteConfirmation.personId)
      );
      setDeleteConfirmation({ isOpen: false, personId: null });
    }
  };

  const handleFormSubmit = (formData: Omit<Person, "id">) => {
    if (editingPerson) {
      setData((prevData) =>
        prevData.map((p) =>
          p.id === editingPerson.id ? { ...p, ...formData } : p
        )
      );
    } else {
      const newPerson: Person = {
        id: faker.string.uuid(),
        ...formData,
      };
      setData((prevData) => [...prevData, newPerson]);
    }
    setIsFormOpen(false);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="mt-4 mr-4 bg-white  rounded-lg relative border-2  border-gray-400  ">
      {/* <h1 className="text-2xl font-bold mb-4">People Directory</h1> */}
      {selectedPerson && (
        <UserProfile onClose={handleCloseDetails} person={selectedPerson} />
      )}
      <div className="flex items-center justify-between p-3 pb-6 border-b">
        <div className="flex flex-row space-x-4">
          <h2 className="text-xl pl-4 font-semibold">Team members</h2>
          <span className="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">{`${data?.length} users`}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center border rounded-md">
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              //   className="p-2 border rounded"
              className="flex-1 px-4 py-2 underline-offset-4 "
              placeholder="Search..."
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute right-3"
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="m19.485 20.154l-6.262-6.262q-.75.639-1.725.989t-1.96.35q-2.402 0-4.066-1.663T3.808 9.503T5.47 5.436t4.064-1.667t4.068 1.664T15.268 9.5q0 1.042-.369 2.017t-.97 1.668l6.262 6.261zM9.539 14.23q1.99 0 3.36-1.37t1.37-3.361t-1.37-3.36t-3.36-1.37t-3.361 1.37t-1.37 3.36t1.37 3.36t3.36 1.37"
              />
            </svg>
          </div>
          {/* filter icon  */}
          
          <div className="relative">
          <svg
          onClick={handleFilterClick}

            className="hover:text-purple-400"
            xmlns="http://www.w3.org/2000/svg"
            width="2em"
            height="2em"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={0.7}
              d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2.586a1 1 0 0 1-.293.707l-6.414 6.414a1 1 0 0 0-.293.707V17l-4 4v-6.586a1 1 0 0 0-.293-.707L3.293 7.293A1 1 0 0 1 3 6.586z"
            ></path>
          </svg>
        {/* <button
          onClick={handleFilterClick}
          className="flex items-center space-x-2 px-4 py-2 border rounded"
        >
          <span>Filter</span>
          <ChevronDownIcon className="w-5 h-5" />
        </button> */}
        
        {showFilterDropdown && (
          <div className="absolute z-10 right-0 mt-2 w-64 bg-white border rounded shadow-lg">
            <div className="p-2 border-b">
              <button onClick={handleRoleClick} className="w-full text-left flex justify-between items-center">
                <span>Roles</span>
                {showRoles&&<ChevronUpIcon className="w-5 h-5" />}
                {!showRoles&&<ChevronDownIcon className="w-5 h-5" />}
              </button>
              {showRoles && (
                <div className="mt-2">
                  {uniqueRoles.map(role => (
                    <div key={role} className="flex items-center">
                      <input
                        type="checkbox"
                        
                        checked={selectedRoles.includes(role)}
                        onChange={() => handleRoleSelect(role)}
                      />
                      <span className="ml-2">{role}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-2 border-b">
              <button onClick={handleTeamClick} className="w-full text-left flex justify-between items-center">
                <span>Teams</span>
                {!showTeams&&<ChevronDownIcon className="w-5 h-5" />}
                {showTeams&&<ChevronUpIcon className="w-5 h-5" />}
              </button>
              {showTeams && (
                <div className="mt-2">
                  {uniqueTeams.map(team => (
                    <div key={team} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTeams.includes(team)}
                        onChange={() => handleTeamSelect(team)}
                      />
                      <span className="ml-2">{team}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-2">
              <button
                onClick={handleApplyFilter}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded"
              >
                Select
              </button>
            </div>
          </div>
        )}
      </div>
          {/* <FilterDropdown
            options={[
              "Product Designer",
              "Frontend Developer",
              "Backend Developer",
            ]}
            value={table.getColumn("role")?.getFilterValue() as string}
            onChange={(value) => table.getColumn("role")?.setFilterValue(value)}
            placeholder="All Roles"
          />
          <FilterDropdown
            options={["Design", "Product", "Marketing"]}
            value={table.getColumn("teams")?.getFilterValue() as string}
            onChange={(value) =>
              table.getColumn("teams")?.setFilterValue(value)
            }
            placeholder="All Teams"
          /> */}
          <button
            onClick={handleAddMember}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            + ADD MEMBER
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="divide-y border-[#E4E7EC]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="p-2 text-left "
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() && (
                          <span className="ml-2">
                            {header.column.getIsSorted() === "asc" ? <ArrowUp/> : <ArrowDown/>}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row,index) => (
              <tr
                key={row.id}
                // className="divide-y cursor-pointer"
                className={`${index% 2 === 0 ? 'bg-white cursor-pointer' : 'bg-[#F9FAFB] '} cursor-pointer divide-y `}
                // className=" hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="m-4 flex justify-between items-center space-x-2">
      <button
    onClick={() => table.previousPage()}
    disabled={!table.getCanPreviousPage()}
    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 flex items-center"
  >
    <ChevronLeftIcon className="h-5 w-5 mr-1" />
    Previous
  </button>
  <div className="flex gap-2">

  {Array.from({ length: table.getPageCount() }, (_, i) => i + 1).map((page) => {
    if (
      page === 1 ||
      page === table.getPageCount() ||
      (page >= table.getState().pagination.pageIndex && page <= table.getState().pagination.pageIndex + 2) ||
      (page <= table.getState().pagination.pageIndex + 1 && page >= table.getState().pagination.pageIndex - 1)
    ) {
      return (
        <button
          key={page}
          onClick={() => table.setPageIndex(page - 1)}
          className={`px-3 py-1 rounded ${
            table.getState().pagination.pageIndex + 1 === page
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'
          }`}
        >
          {page}
        </button>
      );
    } else if (
      (page === 2 && table.getState().pagination.pageIndex > 2) ||
      (page === table.getPageCount() - 1 && table.getState().pagination.pageIndex < table.getPageCount() - 3)
    ) {
      return <span key={page}>...</span>;
    }
    return null;
  })}
  </div>


  <button
    onClick={() => table.nextPage()}
    disabled={!table.getCanNextPage()}
    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 flex items-center"
  >
    Next
    <ChevronRightIcon className="h-5 w-5 ml-1" />
  </button>
</div>
{/* Delete Confirmation Popup */}
{deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this member?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() =>
                  setDeleteConfirmation({ isOpen: false, personId: null })
                }
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePerson}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

       {/* Add/Edit Form Modal */}
      
      {isFormOpen&&!editingPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">
              {editingPerson ? "Edit Member" : "Add Member"}
            </h2>
            
            <PersonForm
              initialData={editingPerson || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}
      {
        isFormOpen&&editingPerson && (
            <div>
                <EditProfile
                initialData={editingPerson || undefined}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                />
            </div>
        )
      }
    </div>
  );
};

export default PeopleDirectory;
