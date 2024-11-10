import React, { useState, useEffect } from 'react';
import { Modal, Box, Button } from '@mui/material';
import { resma_medical_clinic_backend } from 'declarations/resma-medical-clinic-backend';
import Sidebar from './Sidebar.jsx';
import DataTable from 'react-data-table-component';

function Users({ userInfo, handleLogout }) {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const columns = [
        { name: 'Name', selector: row => row.name, sortable: true },
        { name: 'Specialization', selector: row => row.specialization, sortable: true },
        { name: 'Role', selector: row => row.role, sortable: true },
        { name: 'Status', selector: row => row.status, sortable: true },
        {
            name: 'Actions',
            cell: row => (
                <Button variant="contained" color="primary" onClick={() => handleUpdateClick(row)}>
                    Update
                </Button>
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

    const handleSave = async () => {
        await resma_medical_clinic_backend.updateUser(selectedUser);
        fetchUsers();
        handleModalClose();
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Options for "Role" and "Status"
    const roleOptions = ['Select','Admin', 'Doctor', 'Nurse', 'Staff'];
    const statusOptions = ['Select','Active', 'Inactive', 'On Leave'];

    return (
        <>
            <Sidebar handleLogout={handleLogout} />
            <div className="h-screen ml-64 flex-grow font-poppins p-3">
                <h1 className="mt-4 mb-4 px-3 text-2xl font-bold text-[#4673FF]">USER MANAGEMENT</h1>
                <main className="h-full border-2 shadow-lg rounded-xl p-3">
                    <div className="flex justify-between items-center">
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
                        noDataComponent={<h2 className="text-gray-600 text-sm">No Users Found</h2>}
                    />
                </main>
            </div>

            <Modal open={modalOpen} onClose={handleModalClose}>
                <Box
                    sx={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2
                    }}
                >
                    <h2>Update User</h2>
                    {selectedUser && (
                        <form>
                             <div className="flex flex-col w-full">
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={selectedUser.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="specialization" className="block text-sm font-medium">Specialization</label>
                                <input
                                    id="specialization"
                                    type="text"
                                    name="specialization"
                                    value={selectedUser.specialization}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                           
                            <div className="mb-4 ">
                                <label htmlFor="role" className="block text-sm font-medium">Role</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={selectedUser.role}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                >
                                    {roleOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4 ">
                                <label htmlFor="status" className="block text-sm font-medium">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={selectedUser.status }
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                >
                                    {statusOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            </div>
                            

                            <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
                                Save
                            </Button>
                        </form>
                    )}
                </Box>
            </Modal>
        </>
    );
}

export default Users;
