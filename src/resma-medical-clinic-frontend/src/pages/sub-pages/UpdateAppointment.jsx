import React, { useState, useEffect } from 'react';
import { resma_medical_clinic_backend } from 'declarations/resma-medical-clinic-backend';
import { useParams } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { IoIosArrowBack } from "react-icons/io";
import { NavLink, useNavigate } from 'react-router-dom';
import MoonLoader from "react-spinners/ClipLoader";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Swal from 'sweetalert2';
function UpdateAppointment({userInfo,handleLogout}) {
    const user = userInfo[0];
    const username = user.name;
    const role = user.role;
    const [duration, setDuration] = useState("");
    const navigate = useNavigate();
    const [saveLoader, setSaveLoader] = useState(false);
    const { id } = useParams();
    const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState(false);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [selectedPatientID, setSelectedPatientID] = useState(null); // To store the selected patient ID
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    let [color, setColor] = useState("#fff");
    const [appointmentFailed, setAppFailed] = useState(false);
    const [vertical, setVertical] = useState('bottom'); // Default vertical position
    const [horizontal, setHorizontal] = useState('right');
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [appointment, setAppointment] = useState({
        id: '',
        name: '',
        doctor: '',
        purpose: '',
        status: 'Upcoming',
        duration:''
    });
     
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setAppFailed(false)
      };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAppointment({
            ...appointment, [name]: value
        });
    };

    const handlePatientSearch = (e) => {
        const searchTerm = e.target.value;
        setAppointment({
            ...appointment,
            name: searchTerm
        });
        if (searchTerm === "") {
            setFilteredPatients([]);
        } else {
            const filteredData = patients.filter(([id, patient]) => {
                const firstName = patient.firstName.toLowerCase();
                const lastName = patient.lastName.toLowerCase();
                const value = searchTerm.toLowerCase();
                return (
                    firstName.includes(value) ||
                    lastName.includes(value)
                );
            });
            setFilteredPatients(filteredData);
        }
    };

    const handlePatientSelect = (patient) => {
        setAppointment((prevAppointment) => ({
            ...prevAppointment,
            name: patient.firstName + " " + patient.lastName // Update the name of the patient in the appointment
        }));
        setSelectedPatientID(patient.id); // Store the selected patient's ID
        setFilteredPatients([]); // Clear the filtered list after selection
    };
    const handleDurationChange = (e) => {
        setDuration(e.target.value);
   }
   const handleSubmit = async (e) => {
    e.preventDefault();

    // Get timestamp as a number (milliseconds)
    const dateTimeString = `${date}T${time}:00`;
    const timestamp = new Date(dateTimeString).getTime(); // This is a number, not BigInt

    // Convert duration to BigInt
    const durationMilliseconds = BigInt(appointment.duration) * 60n * 1000n; // Ensure duration is BigInt (in milliseconds)

    // Now safely add the two values (timestamp remains a number, duration is BigInt)
    const timeFormat = BigInt(timestamp) + durationMilliseconds; // Convert timestamp to BigInt for addition

    console.log("Timeformat", timeFormat);

  

  
    const appointmentStatus = "Upcoming";

    // Log arguments for debugging
    console.log("Arguments:", id, timestamp, selectedPatientID, appointment.doctor, appointment.purpose,appointment.duration);

    // Check for undefined values
    if ( !id || !time || !date   || !selectedPatientID || !appointment.doctor || !appointment.purpose || !appointment.duration) {
        console.error("One or more arguments are undefined");
        setAppFailed(true);
        return;
    }
    if (await checkForConflict(timeFormat,durationMilliseconds) === false) {
        // setAppFailed(true); // Optionally, handle failure here
        return;
    }
    setSaveLoader(true);
  
    try {
        const result = await resma_medical_clinic_backend.addAppointment(
            id,
            BigInt(timestamp), // Ensure timestamp is passed as BigInt
            selectedPatientID,
            appointment.name,
            appointment.doctor,
            appointment.purpose,
            appointmentStatus,
            durationMilliseconds
        );

        if (result) {
            setSaveLoader(false);
            // Reset form
            setAppointment({ id: '', name: '', doctor: '', purpose: '', status: '', duration: '' });
            setDate('');
            setTime('');
            setSelectedPatientID(null);
            navigate('/appointments', { state: { success: true } });
        } else {
            // setFailed(true);
            console.log("Failed");
            navigate('/appointments', { state: { failed: true } });
        }
    } catch (error) {
        console.error("Error creating appointment:", error);
        alert('Error creating appointment');
    }
};

const calculateEndTime = (startTimestamp, durationMinutes) => {
        
    return startTimestamp + durationMinutes;
};
const checkForConflict = async (timestampToCheck, durationMilliseconds) => {
    console.log(filteredAppointments);
    const conflictingAppointment = filteredAppointments.find(appArray => {
        const app = appArray[1];
        if (app.timestamp === undefined || app.duration === undefined) {
            console.error('Missing timestamp or duration in appointment:', app);
            return false; // Skip this appointment if the values are missing
        }
        const start = BigInt(app.timestamp); // Make sure it's BigInt
                
        const duration = BigInt(app.duration); // Make sure it's BigInt
                
        const end = calculateEndTime(start, duration);
                
        const newStart = timestampToCheck - durationMilliseconds
              
        console.log("Appointment duration", app.duration);
        console.log("Appointment start", start);
        console.log("Appointment end", end);
        console.log("Appointment time to check", timestampToCheck);
        
        return (newStart >= start && newStart < end) || (timestampToCheck > start && timestampToCheck <= end);


                   
    });

    if (conflictingAppointment) {
        const start = new Date(Number(conflictingAppointment[1].timestamp)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const end = new Date(Number(calculateEndTime(BigInt(conflictingAppointment[1].timestamp), BigInt(conflictingAppointment[1].duration)))).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const result = await Swal.fire({
            icon: 'warning',
            title: 'Conflict Detected!',
            html: `<div class="text-base">
                      <p class="text-center">There is already an appointment on this date that conflicts with the time that was scheduled.</p>
                      <p><strong>Appointment Details:</strong></p>
                      <p>Time: ${start} - ${end}</p>
                  </div>`,
            text: 'Would you like to continue?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            confirmButtonColor: '#4673FF',
        });

        // Handle the result
        if (result.isConfirmed) {
            return true; // Proceed with submission if user clicks 'Yes'
        } else {
            return false; // Prevent submission if user clicks 'Cancel'
        }
    }

    return true; // Proceed with submission if no conflict
};
    useEffect(() => {
        const fetchAppointmentData = async () => {
            try {
                const result = await resma_medical_clinic_backend.readAppointment(id);
                const appointmentData = Array.isArray(result) ? result[0] : result;
                setAppointment(appointmentData);
                setSelectedPatientID(appointmentData.patientID); // Set the selected patient ID from fetched data
                console.log( appointment);
                console.log(selectedPatientID);
            } catch (error) {
                console.error('Error fetching appointment data:', error);
            }
        };

        const fetchPatients = async () => {
            const patientList = await resma_medical_clinic_backend.getAllPatients();
            setPatients(patientList);
        };

        fetchAppointmentData();
        fetchPatients();
    }, [id]);

    useEffect(() => {
        fetchAllAppointments(role, username);
    }, []);

    const fetchAllAppointments = async (userRole, doctorName) => {
        try {
            const allAppointments = await resma_medical_clinic_backend.getAllAppointments();
            
            if (!Array.isArray(allAppointments)) {
                console.error('Expected an array from API, received:', allAppointments);
                return; // Exit the function if data isn't an array
            }
            
            // Sort appointments by date, from soonest to latest
            const sortedAppointments = allAppointments.sort(([idA, appA], [idB, appB]) => {
                return Number(appA.timestamp) - Number(appB.timestamp);
            });
    
            let filteredAppointments = [];
    
            // Check if the user is a secretary or doctor
            if (userRole === 'Secretary') {
                // Secretary: show all appointments
                filteredAppointments = sortedAppointments;  
            } else if (userRole === 'Admin' || userRole === 'Doctor') {
                // Doctor: show only appointments where the doctor's name matches
                filteredAppointments = sortedAppointments.filter(([id, app]) => app.doctor === doctorName);
            }
            
      
            setFilteredAppointments(filteredAppointments); // Initialize with all appointments
            console.log(filteredAppointments);
            // // Find the earliest upcoming appointment
            // const upcomingAppointments = filteredAppointments.filter(([id, app]) => app.status === "Upcoming");
            // const earliestUpcomingAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;
            // setLatestAppointment(earliestUpcomingAppointment); // Save the earliest upcoming appointment in state

        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };
    return (
        <>
           <Sidebar role={user.role} handleLogout={handleLogout} />
            <Snackbar
  open={success}
  autoHideDuration={3000}
  message=""
  onClose={handleClose}
  anchorOrigin={{ vertical, horizontal }}
  key={`success-${vertical}${horizontal}`}  // Unique key for success Snackbar
>
  <Alert
    onClose={handleClose}
    severity="success"
    variant="filled"
    sx={{ width: '100%' }}
  >
    Changes saved successfully!
  </Alert>
</Snackbar>

<Snackbar
  open={failed}
  autoHideDuration={3000}
  message=""
  onClose={handleClose}
  anchorOrigin={{ vertical, horizontal }}
  key={`failed-${vertical}${horizontal}`}  // Unique key for failed Snackbar
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

<Snackbar
  open={appointmentFailed}
  autoHideDuration={3000}
  message=""
  onClose={handleClose}
  anchorOrigin={{ vertical, horizontal }}
  key={`appointmentFailed-${vertical}${horizontal}`}  // Unique key for appointmentFailed Snackbar
>
  <Alert
    onClose={handleClose}
    severity="error"
    variant="filled"
    sx={{ width: '100%' }}
  >
    Please fill in all fields.
  </Alert>
</Snackbar>
            <div className=' ml-64 flex-grow font-poppins p-3 max-h-screen md:ml-[70px] lg:ml-64'>
                <div className='flex justify-between items-center mb-4  '>
                    <div className=''>
                        <NavLink to="/appointments" className="fw-32 font-semibold text-xl text-[#A9A9A9] hover:text-[#4673FF]">APPOINTMENTS</NavLink>
                        <NavLink to="" className="fw-32 font-semibold text-xl text-[#4673FF]"> / UPDATE APPOINTMENT</NavLink>
                    </div>
                    <div className='flex justify-center'>
                    <button className="w-24 py-1 rounded-3xl font-semibold text-lg bg-[#4673FF] text-white transition-all duration-300 transform hover:bg-[#365ec4] hover:scale-105 hover:shadow-lg" onClick={handleSubmit}>
                            {saveLoader ? (
                                     <p className='flex items-center justify-center'><MoonLoader className=""size={25} color={color} loading={true} /></p>
                            ): (
                               "SAVE"
                            )}
                        
                        </button>
                        <button className="w-24 ml-1 py-1 rounded-3xl font-semibold text-lg bg-[#A9A9A9] text-white transition-all duration-300 transform hover:bg-gray-600 hover:scale-105 hover:shadow-md"><NavLink to="/appointments">CANCEL</NavLink></button>
                    </div>
                </div>
                <div className=" relative">
                    <div className='w-full bg-[#4673FF] rounded-tl-xl rounded-tr-xl px-5 py-2 text-white font-semibold text-base'>Appointment Details</div>
                    <form className="form " onSubmit={handleSubmit}>
                        <div className='w-full text-sm'>
                        <div className='w-full flex px-7 py-1 mt-3'>
                                <div className='w-1/2 mr-4'>
                                    <div className="flex justify-between">
                                        <label className='mr-1 font-semibold text-black'>Name of Patient<span className='text-[red]'>*</span></label>
                                    </div>
                                    <input
                                        className="mt-2 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 input-placeholder-padding"
                                        type="text"
                                        name="name"
                                        value={appointment.name}
                                        onChange={handlePatientSearch}
                                        placeholder='Search patient...'
                                        disabled

                                    />
                                    {filteredPatients.length > 0 && (
                                        <ul className="border border-gray-300 mt-1 max-h-40 overflow-y-auto">
                                            {filteredPatients.map(([id, patient]) => (
                                                <li
                                                    key={patient.id}
                                                    className="cursor-pointer py-1 px-2 hover:bg-gray-100"
                                                    onClick={() => handlePatientSelect(patient)}
                                                >
                                                    {patient.firstName} {patient.lastName}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className='w-1/2 mr-4'>
                                    <label className='mr-1 font-semibold text-black'>Purpose<span className='text-[red]'>*</span></label>
                                    <input
                                        className="mt-2 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 input-placeholder-padding"
                                        type="text"
                                        name="purpose"
                                        value={appointment.purpose}
                                        onChange={handleInputChange}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className='w-full flex px-7 py-1 mt-3'>
                                <div className='w-1/2 mr-4'>
                                    <label className='mr-1 font-semibold text-black'>Date of Appointment<span className='text-[red]'>*</span></label>
                                    <input
                                        className="mt-2 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 input-placeholder-padding"
                                        type="date"
                                        name="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>
                                <div className='w-1/2 mr-4'>
                                    <label className='mr-1 font-semibold text-black'>Time of Appointment<span className='text-[red]'>*</span></label>
                                    <input
                                        className="mt-2 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 input-placeholder-padding"
                                        type="time"
                                        name="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='w-full flex px-7 py-1 mt-3'>
                                <div className='w-1/2 mr-4'>
                                    <label className='mr-1 font-semibold text-black'>Doctor in Charge<span className='text-[red]'>*</span></label>
                                    <input
                                        className="mt-2 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 input-placeholder-padding"
                                        type="text"
                                        name="doctor"
                                        value={appointment.doctor}
                                        onChange={handleInputChange}
                                        disabled
                                    />
                                </div>
                                <div className='w-1/2 mr-4'>
                                    <label className='mr-1 font-semibold text-black'>Duration<span className='text-[red]'>*</span></label>
                                    <input
                                        className="mt-2 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 input-placeholder-padding"
                                        name="duration"
                                        value={appointment.duration}
                                        onChange={handleInputChange}
                                        type="number"
                                        placeholder='Enter estimated minutes'
                                         autoComplete='off'
                                    >  
                                    </input>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default UpdateAppointment;
