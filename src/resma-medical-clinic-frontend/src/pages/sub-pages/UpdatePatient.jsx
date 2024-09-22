import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resma_medical_clinic_backend } from 'declarations/resma-medical-clinic-backend';
import Sidebar from '../Sidebar.jsx';
import { IoIosArrowBack } from "react-icons/io";
import { NavLink } from 'react-router-dom';
function UpdatePatient() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the id from the URL
    const [patient, setPatient] = useState({
        id: '',
        lastName: '',
        firstName: '',
        middleName: '',
        extName: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        contact: '',
        height: '',
        weight: '',
        emergencyContact: {
            name: '',
            address: '',
            relationship: '',
            contact: ''
        }
    });

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const result = await resma_medical_clinic_backend.read(id);
                console.log(result); // Log result to verify data

                // Check if result is an array and handle accordingly
                const patientData = Array.isArray(result) ? result[0] : result;
                setPatient(patientData);
            } catch (error) {
                console.error('Error fetching patient data:', error);
            }
        };

        fetchPatientData();
    }, [id]);

    if (!patient) {
        return <div>Loading...</div>; // Show loading state while fetching data
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPatient({ 
            ...patient,
            [name]: value
        });
          
    };
    const handleEmergencyContactChange = (e) => {
        const { name, value } = e.target;
        setPatient({
            ...patient,
            emergencyContact: {
                ...patient.emergencyContact,
                [name]: value
            }
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const result = await resma_medical_clinic_backend.addPatient(
                patient.id,
                patient.lastName,
                patient.firstName,
                patient.middleName,
                patient.extName,
                patient.dateOfBirth,
                patient.gender,
                patient.address,
                patient.contact,
                patient.height,
                patient.weight,
                patient.emergencyContact
            );

            if (result) {
                alert('Patient updated successfully');
                console.log("Success");
                setPatient({
                    id: '',
                    lastName: '',
                    firstName: '',
                    middleName: '',
                    extName: '',
                    dateOfBirth: '',
                    gender: '',
                    address: '',
                    contact: '',
                    height: '',
                    weight: '',
                    emergencyContact: {
                        name: '',
                        address: '',
                        relationship: '',
                        contact: ''
                    }
                });
                navigate(-1);
            } else {
                alert('Failed to create patient');
                console.log("Failed");
            }
        } catch (error) {
            console.error("Error creating patient:", error);
            alert('Error creating patient');
        }
    };

    const handleCancel = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <>
            <Sidebar />
            <div className='h-screen ml-64 flex-grow font-poppins p-3'>
            <div className='flex justify-between items-center mb-4'>
                    <div className=''>
                        <NavLink to="/records" className="fw-32 font-semibold   text-xl text-[#A9A9A9] hover:text-[#014BA8]" href="">MEDICAL RECORDS / </NavLink>
                        <button onClick={handleCancel} className="fw-32 font-semibold   text-xl text-[#A9A9A9] hover:text-[#014BA8]" href="">PATIENT INFORMATION  </button>
                        <NavLink  className="fw-32 font-semibold  text-xl text-[#014BA8] " href=""> / UPDATE PATIENT</NavLink>
                    </div>

                    <div className=''>
                    <button className="w-24 py-1 rounded-3xl font-semibold text-lg bg-[#014BA8] text-white" onClick={handleSubmit}>SAVE</button>
                    <button onClick={handleCancel} className="w-24  ml-1 py-1 rounded-3xl  font-semibold text-lg bg-[#A9A9A9] text-white">CANCEL</button>
                    </div>
                </div>
                <main className='h-full border-2 shadow-lg rounded-xl relative'>
               
                <div className='w-full bg-[#014BA8]  rounded rounded-tl-xl rounded-tr-xl px-5 py-2 text-white font-semibold text-base'>I. Demographic Information </div>
                    <div className='w-full mt-2'>
                    <form className="form text-sm" onSubmit={handleSubmit}>
                            <div className='w-full flex px-7 py-1 mt-3'>
                              
                               <div className='w-1/3 mr-4'>
                                <label className=' mr-1  font-semibold text-black ' htmlFor="lastName">Last Name</label>
                                        <br></br>
                                        <input
                                            className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-200 input-placeholder-padding"
                                            type="text"
                                            name="lastName"
                                            value={patient.lastName}
                                            onChange={handleInputChange}
                                            placeholder='Enter here'
                                        />
                               </div>

                               <div className='w-1/3 mr-4'>
                                <label className=' mr-1  font-semibold text-black ' htmlFor="fullName">First Name</label>
                                        <br></br>
                                        <input
                                        className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-200 input-placeholder-padding"
                                            type="text"
                                            name="firstName"
                                            value={patient.firstName}
                                            onChange={handleInputChange}
                                            placeholder='Enter here'
                                        />
                               </div>

                               <div className='w-1/3 mr-4'>
                                <label className=' mr-1 font-semibold text-black '  htmlFor="fullName">Middle Name</label>
                                        <br></br>
                                        <input
                                        className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-200 input-placeholder-padding"
                                            type="text"
                                            name="middleName"
                                            value={patient.middleName}
                                            onChange={handleInputChange}
                                            placeholder='Enter here'
                                        />
                               </div>
                                   
                               <div className='flex-grow'>
                                <label className=' mr-1 font-semibold text-black ' htmlFor="fullName">Ext. Name</label>
                                        <br></br>
                                        <input
                                        className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-200 input-placeholder-padding"
                                            type="text"
                                            name="extName"
                                            value={patient.extName}
                                            onChange={handleInputChange}
                                            placeholder='Enter here'
                                        />
                               </div>

                            </div>
                             
                         
                            <div className='w-full flex px-7 py-1'>
                                <div className='w-1/3 mr-4'>
                                    <label className=' mr-1 font-semibold text-black '  htmlFor="dateOfBirth">Date of Birth</label><br></br>
                                    <input
                                        className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-200 input-placeholder-padding"
                                        type="date"
                                        name="dateOfBirth"
                                        value={patient.dateOfBirth}
                                        onChange={handleInputChange}
                                        placeholder='mm/dd/yyyy'
                                    />
                                </div>

                                <div className='w-1/3 mr-4'>
                                    <label className=' mr-1 font-semibold text-black ' htmlFor="contact">Contact #</label>
                                    <input
                                        className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-200 input-placeholder-padding"
                                        type="text"
                                        name="contact"
                                        value={patient.contact}
                                        onChange={handleInputChange}
                                        placeholder='Enter here'
                                    />
                                </div>

                                <div className="w-1/2 ">
                                    <div className=' w-full flex' >
                                    <div className='w-1/2 mr-4'>
                                        <label className=' mr-1 font-semibold text-black ' htmlFor="gender">Gender</label>
                                        <input
                                            className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-200 input-placeholder-padding"
                                            type="text"
                                            name="gender"
                                            value={patient.gender}
                                            onChange={handleInputChange}
                                            placeholder='Enter here'
                                        />
                                    </div>

                                    <div className='w-1/3 mr-4'>
                                        <label className=' mr-1 font-semibold text-black ' htmlFor="height">Height</label><br></br>
                                        <input
                                            className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-200 input-placeholder-padding"
                                            type="text"
                                            name="height"
                                            value={patient.height}
                                            onChange={handleInputChange}
                                            placeholder='cm'
                                        />
                                    </div>

                                    <div className='w-1/3 mr-4'>
                                        <label className=' mr-1 font-semibold text-black ' htmlFor="weight">Weight</label>
                                            <input
                                                className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-200 input-placeholder-padding"
                                                type="text"
                                                name="weight"
                                                value={patient.weight}
                                                onChange={handleInputChange}
                                                placeholder='kg'
                                            />
                                        </div>
                                    </div>     
                                </div>
                                
                               
                               
                             </div>
                             <div className='w-full flex px-7 py-1'>
                             <div className='w-1/2 '>
                                    <label className=' mr-1 font-semibold text-black ' htmlFor="address">Address</label>
                                    <input
                                       className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-200 input-placeholder-padding"
                                        type="text"
                                        name="address"
                                        value={patient.address}
                                        onChange={handleInputChange}
                                        placeholder='Barangay, Municipality, Province'
                                    />
                                </div>

                            </div>
                            
                               
                           
                      
                              
                            <div className='w-full bg-[#014BA8]  rounded rounded-tl-xl rounded-tr-xl px-5 py-2 text-white font-semibold text-base mt-3'>II. Emergency Contact </div>
                        
                            
                            <div className='w-full flex px-7 py-1'>
                                    <div className='w-1/3 mr-4'>
                                        <label className=' mr-1 font-semibold text-black ' htmlFor="name">Full Name</label><br></br>
                                        <input
                                            className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-200 input-placeholder-padding"
                                            type="text"
                                            name="name"
                                            value={patient.emergencyContact.name}
                                            onChange={handleEmergencyContactChange}
                                            placeholder='Enter here'
                                        />
                                    </div>

                                    <div className='w-1/3 mr-4'>
                                        <label className=' mr-1 font-semibold text-black' htmlFor="address">Address</label>
                                        <input
                                            className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-200 input-placeholder-padding"
                                            type="text"
                                            name="address"
                                            value={patient.emergencyContact.address}
                                            onChange={handleEmergencyContactChange}
                                            placeholder='Barangay, Municipality, Province'
                                        />
                                    </div>

                                    <div  className='w-1/3 mr-4'>
                                        <label className=' mr-1 font-semibold text-black' htmlFor="relationship">Relationship</label>
                                        <input
                                            className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-200 input-placeholder-padding"
                                            type="text"
                                            name="relationship"
                                            value={patient.emergencyContact.relationship}
                                            onChange={handleEmergencyContactChange}
                                            placeholder='Enter here'
                                        />
                                    </div>
                            
                                 
                        
                               
                       
                          
                              
                            </div>

                            <div className='w-full flex px-7 py-1'>
                                 <div  className='w-1/3 mr-4'>
                                    <label className=' mr-1 font-semibold text-black' htmlFor="contact">Contact #</label>
                                        <input
                                           className=" mt-1 py-1 w-full border text-[#858796] border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-200 input-placeholder-padding"
                                            type="text"
                                            name="contact"
                                            value={patient.emergencyContact.contact}
                                            onChange={handleEmergencyContactChange}
                                            placeholder='09122978320'
                                        />
                                    </div>


                            </div>
                           
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}

export default UpdatePatient;
