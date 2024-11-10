import Sidebar from '../Sidebar';
import React, { useEffect, useState, useRef } from 'react';
import { resma_medical_clinic_backend } from 'declarations/resma-medical-clinic-backend';
import { IoIosArrowBack } from "react-icons/io";
import { NavLink, useNavigate } from 'react-router-dom';
import MoonLoader from "react-spinners/ClipLoader";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useLocation } from 'react-router-dom';
function AddAppointment() {

   

    const navigate = useNavigate();
    function generateRandomID() {
        const prefix = "APMNT-";
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let randomLetters = '';
        for (let i = 0; i < 4; i++) {
            randomLetters += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        return prefix + randomLetters;
    }

    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [selectedPatientID, setSelectedPatientID] = useState(null); // Store selected patient ID
    const [saveLoader, setSaveLoader] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState(false);
    const [appointmentFailed, setAppFailed] = useState(false);
    const [vertical, setVertical] = useState('top'); // Default vertical position
    const [horizontal, setHorizontal] = useState('right');
    const [appointment, setAppointment] = useState({
        id: '',
        name: '',
        doctor: '',
        purpose: '',
        status: 'Upcoming'
    });

    const location = useLocation();
    useEffect(() => {
        if (location.state?.success) {
            setSuccess(true);
        }else if(location.state?.failed){
            setFailed(true);
        }
    }, [location]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setSuccess(false);
        setFailed(false)
        setAppFailed(false)
      };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAppointment({
            ...appointment, [name]: value
        });
    };

    const [isPatientSelected, setIsPatientSelected] = useState(false); // State to track if a patient has been selected

    // Handle patient selection
    const handlePatientSelect = (patient) => {
        setAppointment((prevAppointment) => ({
            ...prevAppointment,
            name: `${patient.firstName} ${patient.lastName}` // Set full patient name in input
        }));
        setSelectedPatientID(patient.id); // Store selected patient's ID
        setFilteredPatients([]); // Clear the filtered list after selection
        setIsPatientSelected(true); // Mark patient as selected
    };
    
    // Modify patient search logic to reset the selected state when typing
    const handlePatientSearch = (e) => {
        const searchTerm = e.target.value;
        setAppointment({
            ...appointment,
            name: searchTerm
        });
        setIsPatientSelected(false); // Reset patient selection when user types
    
        if (searchTerm === "") {
            setFilteredPatients(patients.slice(0, 10)); // Show first 10 patients if input is empty
        } else {
            const filteredData = patients.filter(([id, patient]) => {
                const fullName = `${patient.firstName.toLowerCase()} ${patient.lastName.toLowerCase()}`;
                return fullName.includes(searchTerm.toLowerCase());
            });
            
            if (filteredData.length === 0) {
                setFilteredPatients([]); // No match found
            } else {
                setFilteredPatients(filteredData); // Matches found
            }
        }
    };
    const [showPatientsList, setShowPatientsList] = useState(false);
    const inputRef = useRef(null); // Reference for the input field
    const handleInputFocus = () => {
        if (appointment.name === "") {
            setFilteredPatients(patients.slice(0, 10));
        }
        setShowPatientsList(true); // Show patients list when input is focused
    };
   

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newID = generateRandomID();
        const dateTimeString = `${date}T${time}:00`; // Combine date and time
        const timestamp = new Date(dateTimeString).getTime(); // Convert to Unix timestamp
        const appointmentStatus = "Upcoming";
        // Log arguments for debugging
        console.log("Arguments:", newID, timestamp, selectedPatientID, appointment.doctor, appointment.purpose);
    
        // Check for undefined values
        if (!newID || !timestamp || !selectedPatientID || !appointment.doctor || !appointment.purpose) {
            console.error("One or more arguments are undefined");
            setAppFailed(true);
            return;
        }
        setSaveLoader(true);
        try {
            const result = await resma_medical_clinic_backend.addAppointment(
                newID,
                timestamp,
                selectedPatientID,
                appointment.name,
                appointment.doctor,
                appointment.purpose,
                appointmentStatus
            );
    
            if (result) {
                setSaveLoader(false);
                // Reset form
                setAppointment({ id: '', name: '', doctor: '', purpose: '', status: '' });
                setDate('');
                setTime('');
                setSelectedPatientID(null);
                navigate('/appointments', { state: { success: true } });
            } else {
                setFailed(true);
                console.log("Failed");
                navigate('/appointments', { state: { failed: true } });
            }
        } catch (error) {
            console.error("Error creating appointment:", error);
            alert('Error creating appointment');
        }
    };
    
    const [doctors, setDoctors] = useState([]); // New state to store doctors
    useEffect(() => {
        async function fetchPatients() {
            const patientList = await resma_medical_clinic_backend.getAllPatients();
            setPatients(patientList);
        }
        async function fetchDoctors() {
            const doctors = await resma_medical_clinic_backend.getAllDoctors();
            setDoctors(doctors); // Assuming you have a setDoctors function to set the state for your dropdown
        }

        
        fetchPatients();
        fetchDoctors();
        console.log(doctors);

        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowPatientsList(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    let [color, setColor] = useState("#fff");
    return (
        <>
            <Sidebar />
            <Snackbar
                    open={success}
                    autoHideDuration={3000}
                    message=""
                    onClose={handleClose}
                    anchorOrigin={{ vertical, horizontal }}  // Corrected anchorOrigin
                    key={`${vertical}${horizontal}`}
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
            <Snackbar
                    open={appointmentFailed}
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
                    Please fill in all fields.
                    </Alert>
            </Snackbar>
            <div className='ml-64 flex-grow font-poppins p-3 max-h-screen '>
                <div className='flex justify-between items-center mb-4'>
                    <div className=''>
                        <NavLink to="/appointments" className="fw-32 font-semibold text-xl text-[#A9A9A9] hover:text-[#4673FF]">APPOINTMENTS</NavLink>
                        <NavLink to="" className="fw-32 font-semibold text-xl text-[#4673FF]"> / ADD APPOINTMENT</NavLink>
                    </div>
                    <div className='flex justify-center'>
                        <button className="w-24 py-1 rounded-3xl font-semibold text-lg bg-[#4673FF] text-white transition-all duration-300 transform hover:bg-[#365ec4] hover:scale-105 hover:shadow-lg " onClick={handleSubmit}>
                            {saveLoader ? (
                                     <p className='flex items-center justify-center'><MoonLoader className=""size={25} color={color} loading={true} /></p>
                            ): (
                               "SAVE"
                            )}
                        
                        </button>
                        <button className="w-24 ml-1 py-1 rounded-3xl font-semibold text-lg bg-[#A9A9A9] text-white transition-all duration-300 transform hover:bg-gray-600 hover:scale-105 hover:shadow-md">
                        <NavLink to="/appointments">CANCEL</NavLink></button>
                    </div>
                </div>
                
                <div className=" relative">
                    <div className='w-full bg-[#4673FF] rounded-tl-xl rounded-tr-xl px-5 py-2 text-white font-semibold text-base'>Appointment Details </div>
                    <form className="form " onSubmit={handleSubmit}>
                        <div className='w-full text-sm '>
                        <div className='w-full flex px-7 py-1 mt-3'>
                                <div className='w-1/2 mr-4 relative ' ref={inputRef}>
                                    <div className="flex justify-between">
                                    <label className='mr-1 font-semibold text-black'>Name of Patient<span className='text-[red]'>*</span></label>
                                   
                                    </div>
                                    
                                    <input
        className="mt-2 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 input-placeholder-padding"
        type="text"
        name="name"
        value={appointment.name}
        onChange={handlePatientSearch}
        onFocus={handleInputFocus} // Trigger patients list when input is focused
        placeholder='Search patient...'
    />

    {/* Show error only when no match is found AND no valid patient is selected */}
    {!isPatientSelected && filteredPatients.length === 0 && appointment.name !== "" && (
        <p className="text-red-500 mt-2">
            No patients found. Please check the name or <NavLink to="/AddPatient" className="text-[#4673FF]">Register here</NavLink>.
        </p>
    )}

    {showPatientsList && filteredPatients.length > 0 && (
        <ul className="border border-gray-300 mt-1 max-h-40 overflow-y-auto rounded absolute top-15 w-full bg-white z-10">
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
                                        id="purpose"
                                        value={appointment.purpose}
                                        onChange={handleInputChange}
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
                                    <select
                                        className="mt-2 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 input-placeholder-padding"
                                        name="doctor"
                                        value={appointment.doctor}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select</option>
                                        {doctors.map((doctor, index) => (
                                            <option key={`${doctor.principal}-${index}`} value={doctor.name}>
                                                {doctor.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                               
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AddAppointment;
