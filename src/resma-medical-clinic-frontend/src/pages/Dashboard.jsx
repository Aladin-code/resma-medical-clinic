import Sidebar from './Sidebar.jsx';
import checkup from '../assets/check-up.png';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';
import { resma_medical_clinic_backend } from 'declarations/resma-medical-clinic-backend';
function Dashboard({userInfo, handleLogout}){

    const [appointmentsEntries, setAppointmentsEntries] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);  

     // Empty dependency array means this runs only on mount
    console.log(userInfo.length)
    
    if (userInfo.length === 0) {
        console.log(userInfo);
    return
    }

          
    const user = userInfo[0];
    const username = user.name;
    
    const role = user.role;

    if (role === "Admin") {
        window.location.href = "/users"; // Redirects to the /users page
        return;
    }
    

    const customStyles = {
    rows: {
        style: {
            padding: '0',  // Add padding to the entire row
            margin: '0',
            borderLeft: '1px solid #EFF2F7',
            // Add margin to the entire row
        },
    },

    cells: {
        style: {
            padding: '8px',  // Add padding to header cells
            margin: '0', 
            fontSize: '12px ', 
            border: '1px solid #EFF2F7',
                // Add margin to header cells if needed
        },
    },
    headCells: {
        style:{
            padding: '8px',  // Add padding to header cells
            margin: '0', 
            fontSize: '12px ',
            fontWeight: '700',
            borderTop: '1px solid #EFF2F7',
            borderLeft: '1px solid #EFF2F7',
            borderRight: '1px solid #EFF2F7',
        },
    }
    };

    const fetchAllAppointments = async (userRole, doctorName) => {
        const allAppointments = await resma_medical_clinic_backend.getAllAppointments();
        console.log("All Appointments:", allAppointments);
        // Filter for appointments with status "upcoming"
        const upcomingAppointments = allAppointments
            .filter(([id, app]) => app.status.toLowerCase() === "upcoming")
            .sort(([idA, appA], [idB, appB]) => {
                return Number(appA.timestamp) - Number(appB.timestamp);  // Sort by timestamp
            });

            let filteredAppointments;
    
            // Check if the user is a secretary or doctor
            if (userRole === 'Secretary' ) {
                // Secretary: show all appointments
                filteredAppointments = upcomingAppointments;
            } else if (userRole === 'Doctor' || userRole === "Admin") {
                // Doctor: show only appointments where the doctor's name matches
                filteredAppointments = upcomingAppointments.filter(([id, app]) => app.doctor === doctorName);
            }
    
        setAppointmentsEntries(filteredAppointments);
        setFilteredAppointments(filteredAppointments);  // Initialize with upcoming appointments
        console.log(filteredAppointments)
    };
    
    
    

    const formatDate = (timestamp) => {
        const date = new Date(Number(timestamp));
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatTime = (timestamp) => {
        const date = new Date(Number(timestamp));
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handlePageChange = page => {
        setCurrentPage(page);
    }; 

    const handleRowsPerPageChange = newPerPage => {
        setRowsPerPage(newPerPage);
    };
 
    const columns = [
        {
            name: 'Patient Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => formatDate(row.timestamp),
            // sortable: true,
        },
        {
            name: 'Time',
            selector: row => formatTime(row.timestamp),
            // sortable: true,
        },
        {
            name: 'Doctor',
            selector: row => row.doctor,
            // sortable: true,
        },
        {
            name: 'Status',
            selector: row => (
                <>
                {row.status == "Completed" && (
                 <>
                 <div className='w-[100px] text-center py-1  rounded-sm font-semibold bg-[#EBFEEF] text-[#8DE7A2]'>{row.status}</div>
     
                 </>
                )}
     
             {row.status == "Upcoming" && (
                 <>
                 <div className='w-[100px] py-1 text-center rounded-sm font-semibold bg-[#E2F1FF] text-[#97BDFF]'>{row.status}</div>
     
                 </>
                )}
     
             {row.status == "Cancelled" && (
                 <>
                 <div className='w-[100px] py-1 text-center rounded-sm font-semibold bg-[#FFEFEF] text-[#FFB2B2]'>{row.status}</div>
     
                 </>
                )}   
             </> 
            ),
            sortable: true,
        },
     // This will include the Actions column only if the user role is Admin or Secretary
    ];


    const getTodayAppointments = () => {
        if (!Array.isArray(appointmentsEntries)) {
           
            return 0; // or handle it in a way that makes sense for your application
        }
    
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)).getTime();
        const endOfDay = new Date(today.setHours(23, 59, 59, 999)).getTime();
    
        const todayAppointments = appointmentsEntries.filter(([id, app]) => {
            const appointmentTime = Number(app.timestamp);
            return appointmentTime >= startOfDay && appointmentTime <= endOfDay;
        });
    
        return todayAppointments.length;
    };

    const getUpcomingAppointments = () => {
        const now = new Date().getTime();
        return filteredAppointments.filter(([id, app]) => Number(app.timestamp) > now).length;
    };
    
    
      

    const [patientEntries, setPatientEntries] = useState([]);
    const fetchAllPatients = async ()=> {
        const allPatients = await resma_medical_clinic_backend.getAllPatients();
        setPatientEntries(allPatients);
       
    };
    const getTotalPatients = () => {
        return patientEntries.length;  // Assuming you have a `patients` array
    };

    const clearPatients = async () => {
        const clear = await resma_medical_clinic_backend.deleteAllPatients();
        alert("Success");
    }
    const clearAppointments = async () => {
        const clear = await resma_medical_clinic_backend.deleteAllAppointments();
    }

    const getNewPatientsThisMonth = () => { 
        const now = new Date();
        const currentMonth = now.getMonth(); // 0-based
        const currentYear = now.getFullYear();
    
       
        const newPatients = patientEntries.filter((patientEntry, index) => {
            // Log the current patient object to debug
          
    
            const patient = patientEntry[1]; // Access the patient object (assuming it's in the second position)
    
            if (!patient.hasOwnProperty('registrationDate')) {
                
                return false;  // Skip this patient if registrationDate is missing
            }
    
            const registrationDateStr = patient.registrationDate;
            if (!registrationDateStr || typeof registrationDateStr !== 'string') {
        
                return false; // Skip if registrationDate is not a valid string
            }
            const [year, month, day] = registrationDateStr.split('-').map(Number); // Split into components
    
            // Log parsed date components
        
    
            const registrationDate = new Date(year, month - 1, day); // Month is 0-indexed in JS Date
    
            // Log the created date object to verify it
           
    
            // Compare the registration date with the current date's month and year
            return registrationDate.getMonth() === currentMonth && registrationDate.getFullYear() === currentYear;
        });
    
        return newPatients.length;
    };

    const today = new Date();
    const dateToday = formatDate(today);
    console.log(appointmentsEntries)

    const tableData = appointmentsEntries.map(([id, app]) => ({
        id,
        name: app.name,
        timestamp: app.timestamp,
        doctor: app.doctor,
        status: app.status,
    }));
    useEffect(() => {
        console.log('Dashboard userInfo:', userInfo);
        fetchAllAppointments(role, username);
        fetchAllPatients();
    }, []);
    return(
        <>
          <Sidebar role={user.role} handleLogout={handleLogout} />
            <div className='ml-64 flex-grow  font-poppins px-1 md:ml-[70px] lg:ml-64 transition-all duration-300'>
                <div className='flex-col'>
                {/* <div className="w-full text-right">
                <button className="w-40 mx-1 text-sm p-2 bg-red-500 rounded-xl text-white hover:bg-red-700"onClick={clearPatients}>Clear Patients</button>
                <button className="w-40 mx-1 text-sm p-2 bg-red-500 rounded-xl text-white hover:bg-red-700" onClick={clearAppointments}>Clear Appointments</button>
                <button className="w-40 mx-1 text-sm p-2 bg-red-500 rounded-xl text-white hover:bg-red-700" onClick={clearAppointments}>Clear Users</button>
                </div> */}
                
                <h1 className='mt-7 mx-3 px-3 text-2xl font-bold text-[#4673FF]'>DASHBOARD</h1>
                    <div className='w-full flex  '>
                        <div className='w-1/2'>
                            <div className='relative h-72 mt-2 mx-3 py-3 px-5 border-2 shadow-lg rounded-2xl'>
                                <p className='text-base font-semibold mt-[30px]'>WELCOME</p>
                                <p  className='text-2xl font-bold md:text-xl lg:text-2xl'> {user?.name || 'user'}</p>
                                <p className='text-sm font-semibold'>
                                    {user.specialization}
                                </p>
                                <span className=''><img className='absolute bottom-0 right-0 md:w-[200px] lg:w-[270px]' src={checkup} alt="checkup" width="270px" height="500px"/></span>
                                {/* <span className=' absolute bottom-3 left-3 text-[#4673FF] text-sm font-semibold'><a href="">Edit Profile</a></span> */}
                            </div> 
                        </div>
                        <div className="w-1/2 h-74 mt-2 mx-1  ">
                            <main className="flex h-[140px] border border-2  rounded-2xl mx-1 py-4">
                                <div className='w-1/2 flex flex-col justify-center items-center border-r-2 text-[#4673FF] '>
                                    <p className='font-semibold text-6xl'>{getTodayAppointments()}</p>
                                    <p className='text-sm md:text-xs lg:text-sm'>Appointments Today</p>

                                </div>
                                <div className='w-1/2 flex flex-col justify-center items-center text-[#77DD77]'>
                                    <p className='font-semibold text-6xl'> {getUpcomingAppointments()}</p>
                                    <p className='text-sm md:text-xs lg:text-sm'>Upcoming Appointments    </p>
                                </div>
                            </main>
                            <main className="flex h-[140px] border border-2  rounded-2xl mx-1 mt-2  py-4">
                                <div className='w-1/2 flex flex-col justify-center items-center border-r-2 text-yellow-300'>
                                    <p className='font-semibold text-6xl'>{getTotalPatients()}</p>
                                    <p className='text-sm md:text-xs lg:text-sm'>Registered Patients</p>
                                </div>
                                <div className='w-1/2 flex flex-col justify-center items-center '>
                                    <p className='font-semibold text-6xl'> {getNewPatientsThisMonth()}</p>
                                    <p className='text-sm md:text-xs lg:text-sm'>New Patients  for this month   </p>
                                </div>
                            </main>
                        </div>            
                    </div>

                    <div  className='m-3 p-3 border-2 border-slate-200 rounded-2xl shadow-lg '>
                            <p className='text-[#4673FF] text-base font-bold'>APPOINTMENTS</p>
                            {/* <p className='text-sm font-semibold'>TODAY: {dateToday}</p> */}
                            <div className='mt-5'>
                            {appointmentsEntries && appointmentsEntries.length > 0 ? (
                               <DataTable
                               columns={columns}
                               data={tableData} // Use the formatted tableData
                               pagination
                               paginationRowsPerPageOptions={[5, 10, 15, 20]}
                               customStyles={customStyles}
                           />
                           
                            ) : (
                                <div className='flex justify-center items-center min-h-[300px]'>
                                <h2 className='text-gray-600 text-sm '>No appointments today</h2>
                            </div>
                            )}
                            </div>
                            
                        </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
