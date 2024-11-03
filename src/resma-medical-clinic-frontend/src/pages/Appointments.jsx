import React, { useState, useEffect } from 'react';
import { resma_medical_clinic_backend } from 'declarations/resma-medical-clinic-backend';
import Sidebar from './Sidebar.jsx';
import checkup from '../assets/check-up.png';
import { NavLink } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { DiBlackberry } from 'react-icons/di';
import { FaCalendarCheck } from "react-icons/fa";
import { MdEditCalendar } from "react-icons/md";
import { MdCancelPresentation } from "react-icons/md";
import Tooltip from '@mui/material/Tooltip';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Badge from '@mui/material/Badge';
import { Modal } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import MoonLoader from "react-spinners/ClipLoader";
import { useLocation } from 'react-router-dom';

function Appointments({userInfo, handleLogout}) {
    const [appointmentsEntries, setAppointmentsEntries] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);  
    const [selectedDate, setSelectedDate] = useState(null);
    const [openModal, setOpenModal] = useState(false); 
    const [doneLoader, setDoneLoader] = useState({});
    const [cancelLoader, setCancelLoader] = useState({});
    const [success, setSuccess] = useState();
    const [failed, setFailed] = useState(false);
    const [vertical, setVertical] = useState('top'); // Default vertical position
    const [horizontal, setHorizontal] = useState('right');
    let [color, setColor] = useState("#fff");

    const location = useLocation();
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        if (location.state?.success) {
            setSuccess(true);
        }else if(location.state?.failed){
            setFailed(true);
        }
    }, [location]);

    useEffect(() => {
        console.log('userInfo:', userInfo);
      }, [userInfo]);
    
      if (userInfo.length === 0) {
        return <div>Loading user information...</div>;
      }
      const user = userInfo[0];

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setSuccess(false);
        setFailed(false)
      };
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
                color: '#4673FF'
            },
        }
    };// De rows per page

    const fetchAllAppointments = async () => {
        const allAppointments = await resma_medical_clinic_backend.getAllAppointments();
        
        // Sort appointments by date, from soonest to latest
        const sortedAppointments = allAppointments.sort(([idA, appA], [idB, appB]) => {
            return Number(appA.timestamp) - Number(appB.timestamp);
        });
    
        setAppointmentsEntries(sortedAppointments);
        setFilteredAppointments(sortedAppointments); // Initialize with all appointments
    
        // Find the earliest upcoming appointment
        const upcomingAppointments = sortedAppointments.filter(([id, app]) => app.status === "Upcoming");
        const earliestUpcomingAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;
        setLatestAppointment(earliestUpcomingAppointment); // Save the earliest upcoming appointment in state
    };
    
     // Handle tab changes to filter appointments based on tab selection
    
     const [latestAppointment, setLatestAppointment] = useState(null);
    useEffect(() => {
        fetchAllAppointments();
    }, []);

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

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        const filteredData = appointmentsEntries.filter(([id, app]) => {
            const patientName = app.name.toLowerCase();        
            const searchValue = value.toLowerCase();
            return (
                patientName.includes(searchValue) ||
                formatDate(app.timestamp).toLowerCase().includes(searchValue) ||
                formatTime(app.timestamp).toLowerCase().includes(searchValue)
            );
        });

        setFilteredAppointments(filteredData);
    };

    const handleDateChange = (newDate) => {
        const formattedDate = newDate.format('MMMM D, YYYY');
        setSelectedDate(formattedDate);
        // filterAppointments(searchTerm, formattedDate);
        setOpenModal(true);  // Open modal when a date is selected
    };

    const handleCloseModal = () => {
        setOpenModal(false);
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
            // <div className={`mx-auto py-1 px-4 rounded-lg border ${row.status == 'Completed' ? 'bg-[#EBFEEF]'} `}>{row.status}</div>
        ),
        sortable: true,
    },
    ...(user.role === "Admin" || user.role === "Secretary" ? [{
        name: 'Actions',  // Always include the Actions column
        cell: row => (
            <>
            {row.status === 'Upcoming' ? (
                <>
                    <Tooltip title="Done" placement="top" arrow>
                        <button
                            onClick={() => markCompleted(row.id)}
                            className='w-28 rounded-md py-1.5 px-4 bg-green-700 text-center text-white text-base m-1'
                            style={{ position: 'relative', minHeight: '40px' }} // Set a consistent height
                        >
                            {doneLoader[row.id] ? (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <MoonLoader size={20} color={color} loading={true} />
                                </div>
                            ) : (
                                <FaCalendarCheck className='text-xl' />
                            )}
                        </button>
                    </Tooltip>
                    <Tooltip title="Reschedule" placement="top" arrow>
                        <NavLink
                            to={`/updateAppointment/${row.id}`}
                            className='w-28 rounded-md py-1.5 px-4 bg-[#4673FF] text-white text-base  m-1 flex justify-center items-center'
                            style={{ position: 'relative', minHeight: '40px' }} // Set a consistent height
                        >
                            <MdEditCalendar className='text-xl' />
                        </NavLink>
                    </Tooltip>
                    <Tooltip title="Cancel" placement="top" arrow>
                        <button 
                            onClick={() => markCancelled(row.id)} 
                            className='w-28 rounded-md py-1.5 px-4 bg-red-700 text-white text-base text-center m-1'
                            style={{ position: 'relative', minHeight: '40px' }} // Set a consistent height
                        >
                            {cancelLoader[row.id] ? (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <MoonLoader size={20} color={color} loading={true} />
                                </div>
                            ) : (
                                <MdCancelPresentation className='text-xl' />
                            )}
                        </button>
                    </Tooltip>
                </>
             )   : (
                    <div className='text-gray-500 text-center w-full    '>No Action</div> // Message when no actions are available
                )}
            
        
        </>
        )
    }] : []),  // This will include the Actions column only if the user role is Admin or Secretary
];

    
    const markCompleted = async (id) => {
        let status = "Completed";
        setDoneLoader((prev) => ({
            ...prev,
            [id]: true
        }));

      try {
        let result = await resma_medical_clinic_backend.updateStatus(id, status);
        if (result) {
            setSuccess(true);
           
            // Directly update the state by filtering the completed appointment
            const updatedEntries = appointmentsEntries.map(([entryId, app]) => {
                if (entryId === id) {
                    return [entryId, { ...app, status: "Completed" }];
                }
                return [entryId, app];
        });

        // Set both the main state and the filtered state
        setAppointmentsEntries(updatedEntries);

        // Filter based on the current active tab
        const updatedFiltered = updatedEntries.filter(([entryId, app]) => {
            if (value === 0) return true; // 'All' tab
            if (value === 1) return app.status === 'Upcoming'; // 'Upcoming' tab
            if (value === 2) return app.status === 'Completed'; // 'Completed' tab
            if (value === 3) return app.status === 'Cancelled'; // 'Cancelled' tab
            return false;
        });

        setFilteredAppointments(updatedFiltered); // Update filtered appointments based on active tab
        } else {
            setFailed(true);
        }
    }catch (error) {
            // Show failure message if something goes wrong
            setFailed('Failed to mark appointment as done.');
            console.error('Error marking appointment as done:', error);
        } finally {
            // Reset loading state for this specific appointment
            setDoneLoader((prev) => ({
                ...prev,
                [id]: false
            }));
        }
    
    };
    
    const markCancelled = async (id) => {
        setCancelLoader((prev) => ({
            ...prev,
            [id]: true
        }));
        let status = "Cancelled";

        try {
        let result = await resma_medical_clinic_backend.updateStatus(id, status);
        if (result) {
            setSuccess(true);
            
            // Directly update the state by filtering out the canceled appointment
            const updatedEntries = appointmentsEntries.map(([entryId, app]) => {
                if (entryId === id) {
                    return [entryId, { ...app, status: "Cancelled" }];
                }
                return [entryId, app];
            });
    
            // Set both the main state and the filtered state
            setAppointmentsEntries(updatedEntries);
    
            // Filter based on the current active tab
            const updatedFiltered = updatedEntries.filter(([entryId, app]) => {
                if (value === 0) return true; // 'All' tab
                if (value === 1) return app.status === 'Upcoming'; // 'Upcoming' tab
                if (value === 2) return app.status === 'Completed'; // 'Completed' tab
                if (value === 3) return app.status === 'Cancelled'; // 'Cancelled' tab
                return false;
            });
    
            setFilteredAppointments(updatedFiltered); // Update filtered appointments based on active tab
        } else {
            setFailed(true);
        }}catch (error) {
            // Show failure message if something goes wrong
            setFailed('Failed to mark appointment as done.');
            console.error('Error marking appointment as done:', error);
        } finally {
            // Reset loading state for this specific appointment
            setCancelLoader((prev) => ({
                ...prev,
                [id]: false
            }));
        }
    };
    
    
    const handlePageChange = page => {
        setCurrentPage(page);
    }; 

    const handleRowsPerPageChange = newPerPage => {
        setRowsPerPage(newPerPage);
    };
    function CustomTabPanel(props) {
        const { children, value, index, ...other } = props;
    
        return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
        );
    }
        
    CustomTabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };
        
    function a11yProps(index) {
        return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    const [value, setValue] = React.useState(0);
    const handleTabChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 0) {
            setFilteredAppointments(appointmentsEntries); // All
        } else if (newValue === 1) {
            const upcomingAppointments = appointmentsEntries.filter(([id, app]) => app.status === 'Upcoming');
            setFilteredAppointments(upcomingAppointments);
        } else if (newValue === 2) {
            const completedAppointments = appointmentsEntries.filter(([id, app]) => app.status === 'Completed');
            setFilteredAppointments(completedAppointments);
        } else if (newValue === 3) {
            const cancelledAppointments = appointmentsEntries.filter(([id, app]) => app.status === 'Cancelled');
            setFilteredAppointments(cancelledAppointments);
        }
    };
      
    return (
        <>
           <Sidebar handleLogout={handleLogout} />
            <div className='ml-64 flex-grow font-poppins p-3'>
            <h1 className='mt-4  mb-4 px-3 text-2xl font-bold text-[#4673FF]'>APPOINTMENTS</h1>
            <div>
            </div>
            <div>
            <Snackbar
                    open={failed}
                    autoHideDuration={3000}
                    message=""
                    onClose={handleClose}
                    anchorOrigin={{ vertical, horizontal }}  // Corrected anchorOrigin
                    key={`${vertical}${horizontal}`}
                   >
                     <Alert
                        onClose={handleClose}
                        severity="error"
                        variant="filled"
                        sx={{ width: '100%' }}
                     >
                     Something went wrong!
                    </Alert>
            </Snackbar>
            </div>
                <div className="flex w-full">
                    <div className="w-1/2 rounded-xl border-2 border-slate-200 shadow-lg px-3 py-5 relative min-h-72">
                        <h1 className='mt-5 text-[#4673FF] text-lg font-semibold'>YOUR NEXT APPOINTMENT</h1>

                        {latestAppointment && (
                            <>
                            <h1 className='my-3 text-xl font-bold  '>{formatDate(latestAppointment[1].timestamp)}</h1>
                            <div className='text-sm my-3 leading-6'>
                                <p><span className='font-semibold'>Time</span>: {formatTime(latestAppointment[1].timestamp)}</p>
                                <p><span className='font-semibold'>Patient</span>: {latestAppointment[1].name}</p>
                                <p><span className='font-semibold'>Purpose</span>: {latestAppointment[1].purpose}</p>
                            </div>
                            </>

                        )}
                        <img className="absolute bottom-0 right-0" src={checkup} alt="" width="255px" height="286px" />
                    </div>
                    <div className="ml-2 w-1/2 border-2 border-slate-200 rounded-xl shadow-lg  min-h-72 py-0">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateCalendar
                                    sx={{
                                        width: '100%',          
                                        backgroundColor: '#fff',  
                                        borderRadius: '10px',
                                        // Calendar Header (Month and Year)
                                        '& .MuiPickersCalendarHeader-root': {
                                            backgroundColor: '#4673FF',
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            fontSize: '1rem',
                                            width: '100%',
                                            marginTop: 0,
                                        
                                        },
                                        // Weekday Labels (Mon, Tue, Wed, etc.)
                                        '& .MuiDayCalendar-weekDayLabel': {
                                            color: '#4673FF',
                                            fontSize: '1rem',
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            width: 'calc(100% / 7)',
                                            
                                        // Adding border to weekday labels
                                        },
                                        // Days (Individual Date Cells)
                                        '& .MuiPickersDay-root': {
                                            fontSize: '16px',
                                            color: '#333',
                                            width: '100px',
                                            height: '45px',
                                            borderRadius: '0px',
                                            textAlign:'left',
                                            margin:0,
                                            '&:hover': {
                                                backgroundColor: '#4673FF',
                                                color: '#fff',
                                            },
                                            '&.Mui-selected': {
                                                backgroundColor: '#4673FF',
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                border: 'none',
                                            },
                                        },

                                        // Highlight "Today"
                                        '& .MuiPickersDay-today': {
                                            backgroundColor: '#4673FF',
                                            border: '2px solid #4673FF',  
                                            color: 'white',
                                        },

                                        // Container for the days grid
                                        '& .MuiDayCalendar-slideTransition': {
                                            width: '100%',
                                        },
                                    }}
                                    onChange={handleDateChange}
                                />
                        </LocalizationProvider>
                    </div>
                </div>
                <div className='min-h-[550px] mt-3 p-3 border-2 border-slate-200 rounded-2xl shadow-lg'>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className='text-[#4673FF] text-base font-bold'>APPOINTMENTS</p>
                        </div>
                        <div className='flex justify-between items-center'> 
                        <input
                            type="text"
                            placeholder="Search appointments..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-72 text-[12px] pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2 "
                        />
                            <NavLink to='/addAppointment' className='text-center text-xs w-30 rounded-md py-2.5 px-3 bg-[#4673FF] text-white font-semibold transition-all duration-300 transform hover:bg-[#365ec4] hover:scale-105 hover:shadow-lg'>NEW APPOINTMENT</NavLink>
                        </div>
                    </div>
                    <div className='mt-3'>
                    <Box sx={{ width: '100%' }}  >
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example" className="text-sm">
                            <Tab label="All" {...a11yProps(0)} />
                            <Tab label="Upcoming" {...a11yProps(1)} />
                            <Tab label="Completed" {...a11yProps(2)} />
                            <Tab label="Cancelled" {...a11yProps(3)} />
                            </Tabs>
                    </Box>
                        <CustomTabPanel value={value} index={0}>
                        <DataTable
                            columns={columns}
                            data={filteredAppointments.map(([id, app]) => ({ id, ...app }))}
                            pagination
                            paginationPerPage={rowsPerPage}
                            paginationRowsPerPageOptions={[5,10, 20, 30, 50]}
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handleRowsPerPageChange}
                            paginationTotalRows={filteredAppointments.length}
                            
                            customStyles={customStyles}
                            noDataComponent={
                                <div className='flex justify-center items-center'>
                                    <h2 className='text-gray-600 text-sm '>No Records Found</h2>
                                </div>
                            }
                        />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                        <DataTable
                            columns={columns}
                            data={filteredAppointments.map(([id, app]) => ({ id, ...app }))}
                            pagination
                            paginationPerPage={rowsPerPage}
                            paginationRowsPerPageOptions={[5,10, 20, 30, 50]}
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handleRowsPerPageChange}
                            paginationTotalRows={filteredAppointments.length}
                          
                            customStyles={customStyles}
                            noDataComponent={
                                <div className='flex justify-center items-center'>
                                    <h2 className='text-gray-600 text-sm '>No Records Found</h2>
                                </div>
                            }
                        />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={2}>
                        <DataTable
                            columns={columns}
                            data={filteredAppointments.map(([id, app]) => ({ id, ...app }))}
                            pagination
                            paginationPerPage={rowsPerPage}
                            paginationRowsPerPageOptions={[5,10, 20, 30, 50]}
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handleRowsPerPageChange}
                            paginationTotalRows={filteredAppointments.length}
                          
                            customStyles={customStyles}
                            noDataComponent={
                                <div className='flex justify-center items-center'>
                                    <h2 className='text-gray-600 text-sm '>No Records Found</h2>
                                </div>
                            }
                        />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={3}>
                        <DataTable
                            columns={columns}
                            data={filteredAppointments.map(([id, app]) => ({ id, ...app }))}
                            pagination
                            paginationPerPage={rowsPerPage}
                            paginationRowsPerPageOptions={[5,10, 20, 30, 50]}
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handleRowsPerPageChange}
                            paginationTotalRows={filteredAppointments.length}

                            customStyles={customStyles}
                            noDataComponent={
                                <div className='flex justify-center items-center'>
                                    <h2 className='text-gray-600 text-sm '>No Records Found</h2>
                                </div>
                            }
                        />
                        </CustomTabPanel>
                        </Box>
                    </div>
                </div>
            </div>
            <Modal open={openModal} onClose={handleCloseModal}>
                <div className="modal-content">
                    <h2>Appointments for {selectedDate}</h2>
                  <li>Cacho - 10:00 AM</li>
                    <li>Linsangan - 1:00 PM</li>
                    <li>Gabor - 3:00 PM</li>
                    <button className="bg-blue-700"onClick={handleCloseModal}>Close</button>
                </div>
            </Modal> 
        </>
    );
}

export default Appointments;
