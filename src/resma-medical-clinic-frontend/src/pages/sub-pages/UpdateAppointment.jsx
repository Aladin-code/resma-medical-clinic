import React, {useState, useEffect } from 'react';
import { resma_medical_clinic_backend } from 'declarations/resma-medical-clinic-backend';
import { useParams }  from 'react-router-dom';
import Sidebar from '../Sidebar';
import { IoIosArrowBack } from "react-icons/io";
import { NavLink } from 'react-router-dom';
function UpdateAppointment(){

    const {id} = useParams();
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dateTimeString = `${date}T${time}:00`; // Combine date and time to create a full datetime string
        const timestamp = new Date(dateTimeString).getTime(); // Convert to Unix timestamp
        try {
            const result = await resma_medical_clinic_backend.addAppointment(
                appointment.id,
                timestamp,
                appointment.name,
                appointment.doctor,
                appointment.purpose,
                appointment.status
            );

            if (result) {
                alert('Appointment created successfully');
                setAppointment({
                    id: '',
                    name: '',
                    doctor: '',
                    purpose: '',
                    status:''
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

    useEffect(()=>{
        const fetchAppointmentData = async () => {
            try {
                const result = await resma_medical_clinic_backend.readAppointment(id);
                console.log(result); // Log result to verify data

                // Check if result is an array and handle accordingly
                const appointmentData = Array.isArray(result) ? result[0] : result;
                setAppointment(appointmentData);
            } catch (error) {
                console.error('Error fetching appointment data:', error);
            }
        };
        fetchAppointmentData();
    }, [id]);


    return(
        <>
            <Sidebar />
            <div className=' ml-64 flex-grow  font-poppins p-3'>
            <div className='flex justify-between items-center mb-4'>
                    <div className=''>
                        <NavLink to="/appointments" className="fw-32 font-semibold   text-xl text-[#A9A9A9] hover:text-[#014BA8]" href="">APPOINTMENTS</NavLink>
                        <NavLink to="" className="fw-32 font-semibold  text-xl text-[#014BA8] " href=""> / UPDATE APPOINTMENT</NavLink>
                    </div>

                    <div className=''>
                    <button className="w-24 py-1 rounded-3xl font-semibold text-lg bg-[#014BA8] text-white" onClick={handleSubmit}>SAVE</button>
                    <button className="w-24  ml-1 py-1 rounded-3xl  font-semibold text-lg bg-[#A9A9A9] text-white"><NavLink to="/appointments"   >CANCEL</NavLink></button>
                    </div>
                </div>
                <div className="h-screen relative">
               
               
                <div className='w-full bg-[#014BA8]  rounded rounded-tl-xl rounded-tr-xl px-5 py-2 text-white font-semibold text-base'>Appointment Details </div>
                <form action="" className="form px-6 " onSubmit={handleSubmit}>
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
                                        onChange={handleInputChange}
                                    />
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
export default UpdateAppointment