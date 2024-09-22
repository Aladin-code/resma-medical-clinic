import React, { useState } from 'react';
import { resma_medical_clinic_backend } from 'declarations/resma-medical-clinic-backend';
import Sidebar from '../Sidebar.jsx';
import { IoIosArrowBack } from "react-icons/io";
import { NavLink } from 'react-router-dom';
function generateRandomID() {
    const prefix = "RM-";
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomLetters = '';
    for (let i = 0; i < 4; i++) {
        randomLetters += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    const newID = prefix + randomLetters;
    return newID;
}

    function AddPatient() {
        const [patientInfo, setPatientInfo] = useState({
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatientInfo({
            ...patientInfo,
            [name]: value
        });
    };

    const handleEmergencyContactChange = (e) => {
        const { name, value } = e.target;
        setPatientInfo({
            ...patientInfo,
            emergencyContact: {
                ...patientInfo.emergencyContact,
                [name]: value
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newID = generateRandomID();
        try {
            const result = await resma_medical_clinic_backend.addPatient(
                newID,
                patientInfo.lastName,
                patientInfo.firstName,
                patientInfo.middleName,
                patientInfo.extName,
                patientInfo.dateOfBirth,
                patientInfo.gender,
                patientInfo.address,
                patientInfo.contact,
                patientInfo.height,
                patientInfo.weight,
                patientInfo.emergencyContact
            );

            if (result) {
                alert('Patient created successfully');
                console.log("Success");
                setPatientInfo({
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
            } else {
                alert('Failed to create patient');
                console.log("Failed");
            }
        } catch (error) {
            console.error("Error creating patient:", error);
            alert('Error creating patient');
        }
    };

    return (
        <>
            <Sidebar />
            <div className='h-screen ml-64 flex-grow font-poppins p-3'>
                <div className='flex justify-between items-center mb-4'>
                    <div className=''>
                        <NavLink to="/records" className="fw-32 font-semibold   text-xl text-[#A9A9A9] hover:text-[#014BA8]" href="">MEDICAL RECORDS</NavLink>
                        <NavLink to="/AddPatient" className="fw-32 font-semibold  text-xl text-[#014BA8] " href=""> / ADD PATIENT</NavLink>
                    </div>

                    <div className=''>
                    <button className="w-24 py-1 rounded-3xl font-semibold text-lg bg-[#014BA8] text-white" onClick={handleSubmit}>SAVE</button>
                    <button className="w-24  ml-1 py-1 rounded-3xl  font-semibold text-lg bg-[#A9A9A9] text-white"><NavLink to="/records"   >CANCEL</NavLink></button>
                    </div>
                </div>
           
                <main className='h-full border-2 shadow-lg rounded-xl relative'>
                    <div className='w-full bg-[#014BA8]  rounded rounded-tl-xl rounded-tr-xl px-5 py-2 text-white font-semibold text-base'>I. Demographic Information </div>
                    <div className='w-full mt-2'>
                        <form className="form text-sm" onSubmit={handleSubmit}>
                            <div className='w-full flex px-7 py-1 mt-3'>
                              
                               <div className='w-1/3 mr-4'>
                                <label className=' mr-1  font-semibold text-black ' htmlFor="fullName">Last Name</label>
                                        <br></br>
                                        <input
                                            className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-200 input-placeholder-padding"
                                            type="text"
                                            name="lastName"
                                            value={patientInfo.lastName}
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
                                            value={patientInfo.firstName}
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
                                            value={patientInfo.middleName}
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
                                            value={patientInfo.extName}
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
                                        value={patientInfo.dateOfBirth}
                                        onChange={handleInputChange}
                                        placeholder='mm/dd/yyyy'
                                    />
                                </div>

                                <div className='w-1/3 mr-4'>
                                    <label className=' mr-1 font-semibold text-black ' htmlFor="contact">Contact Number</label>
                                    <input
                                        className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-200 input-placeholder-padding"
                                        type="text"
                                        name="contact"
                                        value={patientInfo.contact}
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
                                            value={patientInfo.gender}
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
                                            value={patientInfo.height}
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
                                                value={patientInfo.weight}
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
                                        value={patientInfo.address}
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
                                            value={patientInfo.emergencyContact.name}
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
                                            value={patientInfo.emergencyContact.address}
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
                                            value={patientInfo.emergencyContact.relationship}
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
                                            value={patientInfo.emergencyContact.contact}
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

export default AddPatient;
