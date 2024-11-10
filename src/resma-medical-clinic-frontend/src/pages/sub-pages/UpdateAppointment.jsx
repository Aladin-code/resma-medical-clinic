import React, { useState, useEffect } from 'react';
import { resma_medical_clinic_backend } from 'declarations/resma-medical-clinic-backend';
import { useParams } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { IoIosArrowBack } from "react-icons/io";
import { NavLink, useNavigate } from 'react-router-dom';
import MoonLoader from "react-spinners/ClipLoader";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function UpdateAppointment() {
    const navigate = useNavigate();
    const [saveLoader, setSaveLoader] = useState(false);
    const { id } = useParams();
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [selectedPatientID, setSelectedPatientID] = useState(null); // To store the selected patient ID
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    let [color, setColor] = useState("#fff");
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

    const handleSubmit = async (e) => {
        e.preventDefault();
           // Check for undefined values
       
    
        const dateTimeString = `${date}T${time}:00`; // Combine date and time to create a full datetime string
        const timestamp = new Date(dateTimeString).getTime(); // Convert to Unix timestamp
        if (!date || !time || !selectedPatientID || !appointment.doctor || !appointment.purpose) {
            setAppFailed(true); // Show error if any required field is missing
            return;
        }
        setSaveLoader(true);
        try {
            const result = await resma_medical_clinic_backend.addAppointment(
                id,
                timestamp,
                selectedPatientID, // Send the selected patient ID
                appointment.name,
                appointment.doctor,
                appointment.purpose,
                appointment.status
            );

            if (result) {
                setSaveLoader(false);
                setAppointment({
                    id: '',
                    name: '',
                    doctor: '',
                    purpose: '',
                    status: ''
                });
                setDate('');
                setTime('');
                setSelectedPatientID(null);
                navigate('/appointments', { state: { success: true } });
            } else {
                setSaveLoader(false);
                navigate('/appointments', { state: { failed: true } });
            }
        } catch (error) {
            console.error("Error updating appointment:", error);
            alert('Error updating appointment');
        }
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

    return (
        <>
            <Sidebar />
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
            <div className='ml-64 flex-grow font-poppins p-3'>
                <div className='flex justify-between items-center mb-4'>
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
                <div className="h-screen relative">
                    <div className='w-full bg-[#4673FF] rounded-tl-xl rounded-tr-xl px-5 py-2 text-white font-semibold text-base'>Appointment Details</div>
                    <form className="form px-6" onSubmit={handleSubmit}>
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
                                    />
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
