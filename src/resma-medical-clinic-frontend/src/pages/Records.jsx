import React, { useState, useEffect } from 'react';
import { resma_medical_clinic_backend } from 'declarations/resma-medical-clinic-backend';
import Sidebar from './Sidebar.jsx';
import { CiSearch } from "react-icons/ci";
import { IoSearch } from "react-icons/io5";
import { NavLink } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { TbBackground } from 'react-icons/tb';
function Records({userInfo, handleLogout}){
    const [patientEntries, setPatientEntries] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);  

    const customStyles = {
        rows: {
            style: {
                padding: '',  // Add padding to the entire row
                margin: '0',
                borderLeft: '1px solid #EFF2F7',
                textAlign: 'center', 
                 // Corrected from textAlignment to textAlign
            },
        },
    
        cells: {
            style: {
                padding: '8px',  // Add padding to header cells
                margin: '0',
                // fontSize: '12px',  // Fixed extra space after 12px
                border: '1px solid #EFF2F7',
                textAlign: 'center',
               
            },
        },
    
        headCells: {
            style: {
                padding: '8px',  // Add padding to header cells
                margin: '0',
                fontSize: '12px',
                fontWeight: '700',
                borderTop: '1px solid #EFF2F7',
                borderLeft: '1px solid #EFF2F7',
                borderRight: '1px solid #EFF2F7',
                textAlign: 'center',  // Ensure textAlign is correct here too
            },
        },
    };
    
    const columns = [
        {
            name: 'Last Name',
            selector: row =>row.lastName,
            sortable:true,
        },

        {
            name: 'First Name',
            selector: row =>row.firstName,
            sortable:true,
        },
        {
            name: 'Middle Name',
            selector: row =>row.middleName,
            sortable:true,
        },

        {
            name: 'Date of Birth',
            selector: row =>row.dateOfBirth,
            sortable:true,
        },

        {
            name: 'Gender',
            selector: row =>row.gender,
            sortable:true,
        },

        {
            name: 'Contact',
            selector: row =>row.contact,
            sortable:true,
        },
        

        {
            name: 'Emergency Contact',
            selector: row =>row.emergencyContact.name,
            sortable:true,
        },
        {
            name: 'Actions',
            cell: row =>  <NavLink 
                            to={`/records/viewPatient/${row.id}`} 
                            className='w-28 rounded-md py-1.5 bg-[#4673FF] text-white text-center inline-block transition-all duration-300 transform hover:bg-[#365ec4] hover:scale-105 hover:shadow-lg'
                         >
                            View
                         </NavLink>
        
        },
    ];

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
    
        const filteredData = patientEntries.filter(([id, patient]) => {
            const firstName = patient.firstName.toLowerCase();
            const lastName = patient.lastName.toLowerCase();
        
            return (
                firstName.includes(value) ||
                lastName.includes(value) 
            );
        });
    
        setFilteredPatients(filteredData);
    };
    
    const handlePageChange = page => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = newPerPage => {
        setRowsPerPage(newPerPage);
    };

    const fetchAllPatients = async ()=> {
        const allPatients = await resma_medical_clinic_backend.getAllPatients();
        setPatientEntries(allPatients);
        setFilteredPatients(allPatients);
        console.log(patientEntries)
    };
    
    useEffect(() => {
        fetchAllPatients();
    }, []);
    const user = userInfo[0];
return(
    <>
        <Sidebar role={user.role} handleLogout={handleLogout} />
      <div className='h-screen ml-64 flex-grow  font-poppins p-3'>
      <h1 className='mt-4 mb-4 px-3 text-2xl font-bold text-[#4673FF]'>MEDICAL RECORDS</h1>
            <main className='h-full border-2 shadow-lg rounded-xl p-3'>
                   <div className='flex justify-between items-center'>
                        <h1 className='text-[#4673FF]  text-base font-bold'>ALL PATIENTS</h1>
                        <div className='flex justify-between items-center '>
                            <div className='relative flex items-center'>
                                    <input type="text" className=" w-72 text-[12px] pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search Patient Here..."  value={searchTerm}
                            onChange={handleSearch}/>
                                    
                            </div>
                            {(user.role === "Admin" || user.role === "Secretary") && (
                               <NavLink to="/records/AddPatient" className="fw-32 font-semibold px-6 ml-1 p-2.5 text-[10px] text-white bg-[#4673FF] rounded-md transition-all duration-300 transform hover:bg-[#365ec4] hover:scale-105 hover:shadow-lg" href="">NEW PATIENT</NavLink>
                              )}
                            
                        </div>
                   </div>
                   <div className='mt-4'>   
                        <DataTable
                            columns={columns}
                            data={filteredPatients.map(([id, patientEntries]) => ({ id, ...patientEntries }))}
                            pagination
                              
                            paginationPerPage={rowsPerPage}
                            paginationRowsPerPageOptions={[5,10, 20, 30, 50]}
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handleRowsPerPageChange}
                            paginationTotalRows={filteredPatients.length}
                            customStyles={customStyles}
                            noDataComponent={
                                <div className='flex justify-center items-center'>
                                    <h2 className='text-gray-600 text-sm '>No Records Found</h2>
                                </div>
                            }
                             className="datatable"
                        />
                </div>
            </main>
    </div>
    </>
  
);
}
export default Records