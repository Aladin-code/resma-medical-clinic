import Sidebar from '../Sidebar';
import React, { useEffect, useState } from 'react';
import { resma_medical_clinic_backend } from 'declarations/resma-medical-clinic-backend';
import { IoIosArrowBack } from "react-icons/io";
import { NavLink } from 'react-router-dom';

function AddReport() {
    function generateRandomID() {
        const prefix = "APMNT-";
        
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let randomLetters = '';
        for (let i = 0; i < 4; i++) {
            randomLetters += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        const newID = prefix + randomLetters;
        return newID;
    }
    const fullName="";
    const [patients,setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [appointment, setAppointment] = useState({
        id: '',
        name: '',
        doctor: '',
        purpose: '',
        status: ''
    });

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
        if(searchTerm == ""){
            setFilteredPatients([]); 
        }else{
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
    const handlePatientSelect = (selectedPatientName) => {
        setAppointment((prevAppointment) => ({
            ...prevAppointment,
            name: selectedPatientName // Update the name of the patient in the appointment
        }));
        setFilteredPatients([]); // Clear the filtered list after selection
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newID = generateRandomID();
        const dateTimeString = `${date}T${time}:00`; // Combine date and time to create a full datetime string
        const timestamp = new Date(dateTimeString).getTime(); // Convert to Unix timestamp
        try {
            const result = await resma_medical_clinic_backend.addAppointment(
                newID,
                timestamp,
                appointment.name,
                appointment.doctor,
                appointment.purpose,
                "Upcoming"
            );

            if (result) {
                alert('Appointment created successfully');
                setAppointment({
                    id: '',
                    name: '',
                    doctor: '',
                    purpose: '',
                    status: ''
                });
                setDate('');
                setTime('');
            } else {
                alert('Failed to create appointment');
                console.log("Failed");
            }
        } catch (error) {
            console.error("Error creating patient:", error);
            alert('Error creating patient');
        }
    }
    useEffect(() =>{
        async function fetchPatients() {
            const patientList = await resma_medical_clinic_backend.getAllPatients();
            setPatients(patientList);
        }
        fetchPatients();
    },[]);
    return (
        <>
            <Sidebar />
            <div className='ml-64 flex-grow font-poppins p-3'>
            <div className='flex justify-between items-center mb-4'>
                    <div className=''>
                        <NavLink to="/appointments" className="fw-32 font-semibold   text-xl text-[#A9A9A9] hover:text-[#014BA8]" href="">APPOINTMENTS</NavLink>
                        <NavLink to="" className="fw-32 font-semibold  text-xl text-[#014BA8] " href=""> / ADD APPOINTMENT</NavLink>
                    </div>

                    <div className=''>
                    <button className="w-24 py-1 rounded-3xl font-semibold text-lg bg-[#014BA8] text-white" onClick={handleSubmit}>SAVE</button>
                    <button className="w-24  ml-1 py-1 rounded-3xl  font-semibold text-lg bg-[#A9A9A9] text-white"><NavLink to="/appointments"   >CANCEL</NavLink></button>
                    </div>
                </div>
                <div className="h-screen relative">
                <div className='w-full bg-[#014BA8]  rounded rounded-tl-xl rounded-tr-xl px-5 py-2 text-white font-semibold text-base'>Appointment Details </div>
                    <form action="" className="form px-6" onSubmit={handleSubmit}>
                        <div className=' w-full text-sm '>
                            <div className='w-full flex px-7 py-1 mt-3'>
                                <div className='w-1/2 mr-4'>
                                    <label className=' mr-1  font-semibold text-black ' htmlFor="date">Date of Appointment<span className='text-[red]'>*</span></label>
                                    <input
                                        className=" mt-2 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-200 input-placeholder-padding"
                                        type="date"
                                        name="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>

                                <div className='w-1/2 mr-4'>
                                    <label className=' mr-1  font-semibold text-black ' >Time of Appointment<span className='text-[red]'>*</span></label>
                                    <input
                                         className=" mt-2 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-200 input-placeholder-padding"
                                        type="time"
                                        name="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                    />
                                </div>
                            </div>


                            <div className='w-full flex px-7 py-1 mt-3'>
                                <div className='w-1/2 mr-4'>
                                    <label className=' mr-1  font-semibold text-black ' htmlFor="name">Name of Patient<span className='text-[red]'>*</span></label>
                                    <input
                                        className=" mt-2 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-200 input-placeholder-padding"
                                        type="text"
                                        name="name"
                                        value={appointment.name}
                                        onChange={handlePatientSearch}
                                        placeholder='Search patient...'
                                    />

                                {filteredPatients.length > 0 && (
                                    <ul className="border border-gray-300 mt-1 max-h-40 overflow-y-auto">
                                        {filteredPatients.map(([id, patient]) => (
                                            <>
                                                <li
                                                    key={patient.id}
                                                    className="cursor-pointer py-1 px-2 hover:bg-gray-100"
                                                    onClick={() => handlePatientSelect(patient.firstName + " " + patient.lastName)}
                                                >
                                                    {patient.firstName} {patient.lastName}
                                                </li>
                                            </>
                                        ))}
                                    </ul>
                                )}

                                </div>
                                <div className='w-1/2 mr-4'>
                                    <label  className=' mr-1  font-semibold text-black ' htmlFor="">Purpose<span className='text-[red]'>*</span></label>
                                    <input 
                                       className=" mt-2 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-200 input-placeholder-padding"
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
                                    <label className=' mr-1  font-semibold text-black ' htmlFor="doctor">Doctor in Charge<span className='text-[red]'>*</span></label>
                                    <input
                                        className=" mt-2 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-200 input-placeholder-padding"
                                        type="text"
                                        name="doctor"
                                        value={appointment.doctor}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className='w-1/2 mr-4'>
                                    <label  className=' mr-1  font-semibold text-black ' htmlFor="">Status<span className='text-[red]'>*</span></label>
                                    <select name="status" id="cars"
                                     className=" mt-2 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-200 input-placeholder-padding"
                                     onChange={handleInputChange}
                                     value={appointment.status}>
                                        <option value="Upcoming">Upcoming</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Canceled">Canceled</option>
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

export default AddReport;
