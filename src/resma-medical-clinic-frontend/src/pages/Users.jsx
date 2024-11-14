import React, { useState, useEffect } from 'react';
import { Modal, Box, Button } from '@mui/material';
import { resma_medical_clinic_backend } from 'declarations/resma-medical-clinic-backend';
import Sidebar from './Sidebar.jsx';
import DataTable from 'react-data-table-component';
import { Principal } from '@dfinity/principal';
import logo from '../assets/resma.png';
import { IoMdClose } from "react-icons/io";
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
function Users({userInfo, handleLogout }) {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [circleLoading, setCircleLoading] = useState(false);
    const columns = [
        { name: 'Name', selector: row => row.name, sortable: true },
        { name: 'Specialization', selector: row => row.specialization, sortable: true },
        { name: 'Role', selector: row => row.role, sortable: true },
        { name: 'Status', selector: row => row.status, sortable: true },
        {
            name: 'Actions',
            cell: row => (
                <button  className="text-center text-xs w-30 rounded-md py-2.5 px-3 bg-[#4673FF] text-white font-semibold transition-all duration-300 transform hover:bg-[#365ec4] hover:scale-105 hover:shadow-lg" onClick={() => handleUpdateClick(row)}>
                    UPDATE
                </button>
            ),
        },
    ];

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        const filteredData = users.filter(user => user.name.toLowerCase().includes(value));
        setFilteredUsers(filteredData);
    };

    const fetchUsers = async () => {
        const allUsers = await resma_medical_clinic_backend.getAllUsers();
        setLoading(true);
        setUsers(allUsers);
        setFilteredUsers(allUsers);
    };

    const handleUpdateClick = (user) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedUser(null);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSelectedUser(prevUser => ({ ...prevUser, [name]: value }));
    };

    const handleSave = async (event) => {
        event.preventDefault();
        
        // Create the updated user object with changes
        const updatedUser = {
            id: Principal.fromText(selectedUser.principalID.toString()), // Assuming principalID uniquely identifies the user
            name: selectedUser.name,
            specialization: selectedUser.specialization,
            role: selectedUser.role,
            status: selectedUser.status,
        };
    
        setLoading(true); // Start loading before backend call
        setCircleLoading(true);
        try {
            // Update the user in the backend
            const result = await resma_medical_clinic_backend.registerUser(
                updatedUser.id, updatedUser.name, updatedUser.specialization, updatedUser.role, updatedUser.status
            );
    
            if (result) {
                alert("User updated successfully.");
                setCircleLoading(false);
                // Update users list in state immediately
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.principalID === selectedUser.principalID ? updatedUser : user
                    )
                );
                setFilteredUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.principalID === selectedUser.principalID ? updatedUser : user
                    )
                );
            } else {
                alert("Update failed.");
            }
            
            handleModalClose();
        } catch (error) {
            console.error("Error updating user:", error);
            alert("An error occurred while updating the user.");
        } finally {
            setLoading(false); // End loading after backend call
        }
    };
    

    useEffect(() => {
        fetchUsers();
    }, []);

    const user = userInfo[0];
    const username = user.name;
    const role = user.role;

    // Options for "Role" and "Status"
    const roleOptions = ['Select','Admin', 'Doctor', 'Secretary'];
    const statusOptions = ['Select','Active', 'Inactive'];
    // if (users.length === 0) {
    //     return (
    //               <div className="flex justify-center items-center h-screen">
    //                   <img className="shadow-xl rounded-xl animate-subtle-spin" src={logo} alt="Loading..." width="200px" />
    //               </div>
    //           );
    //   }
    return (
        <>
              <Sidebar role={role} handleLogout={handleLogout} />
            <div className="max-h-screen ml-64 flex-grow font-poppins p-3">
                <h1 className="mt-4 mb-4 px-3 text-2xl font-bold text-[#4673FF]">USER MANAGEMENT</h1>

                <main className="h-full border-2 shadow-lg rounded-xl p-3">
                    <div className="flex justify-between items-center">
                        <h3 className='text-[#4673FF] font-semibold text-base'>USERS</h3>
                        <input
                            type="text"
                            className="w-72 text-[12px] pl-4 pr-10 py-2 border rounded-lg focus:outline-none"
                            placeholder="Search User Here..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <DataTable
                        columns={columns}
                        data={filteredUsers}
                        pagination
                        paginationPerPage={rowsPerPage}
                        noDataComponent={
                            loading? (
                               null
                            ) :( <Box sx={{ width: '100%',mt:1 }}>
                            <LinearProgress />
                          </Box>)
                        }
                       
                    />
                </main>
            </div>

            <Modal open={modalOpen} onClose={handleModalClose} className="text-base">
                <Box
                    sx={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: 400, bgcolor: 'background.paper', boxShadow: 24, borderRadius: 2
                    }}
                >
                    <div className="w-full relative">
                    <h2 className='w-full bg-[#4673FF] rounded-tl-[8px] rounded-tr-[8px] text-white text-center text-xl p-2 font-semibold'>UPDATE USER</h2>
                        <button
                        className="text-white text-3xl font-semibold absolute top-2 right-2"
                        onClick={handleModalClose}
                        >
                        <IoMdClose />
                        </button>
                    </div>
                   
                    <div className="py-4 px-5">
                    {selectedUser && (
                        <form>
                             <div className="flex flex-col w-full text-sm">
                            {circleLoading && (
                                <LinearProgress />
                            )}
                            
                            <div className="mb-4 ">
                                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={selectedUser.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 "
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="specialization" className="block text-sm font-medium mb-1">Specialization</label>
                                <input
                                    id="specialization"
                                    type="text"
                                    name="specialization"
                                    value={selectedUser.specialization}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded  focus:outline-none focus:ring-2 focus:ring-blue-500 "
                                />
                            </div>
                           
                            <div className="mb-4 ">
                                <label htmlFor="role" className="block text-sm font-medium mb-1">Role</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={selectedUser.role}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded  focus:outline-none focus:ring-2 focus:ring-blue-500 "
                                >
                                    {roleOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4 ">
                                <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={selectedUser.status }
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded  focus:outline-none focus:ring-2 focus:ring-blue-500 "
                                >
                                    {statusOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            </div>
                            

                            <button className="text-center text-sm w-30 rounded-md py-2.5 px-10 bg-[#4673FF] text-white font-semibold transition-all duration-300 transform hover:bg-[#365ec4] hover:scale-105 hover:shadow-lg" onClick={handleSave}>
                                    SAVE
                            </button>
                        </form>
                    )}
                      </div>
                </Box>
            </Modal>
        </>
    );
}

export default Users;
