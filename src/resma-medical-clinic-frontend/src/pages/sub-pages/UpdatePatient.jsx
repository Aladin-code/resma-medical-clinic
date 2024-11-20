import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resma_medical_clinic_backend } from 'declarations/resma-medical-clinic-backend';
import Sidebar from '../Sidebar.jsx';
import { IoIosArrowBack } from "react-icons/io";
import { NavLink } from 'react-router-dom';
import MoonLoader from "react-spinners/ClipLoader";
function UpdatePatient({userInfo,handleLogout}) {
    const user = userInfo[0];
    const username = user.name;
    const role = user.role;
    const navigate = useNavigate();
    const { id } = useParams(); // Get the id from the URL

    const [saveLoader, setSaveLoader] = useState(false);
    let [color, setColor] = useState("#fff");

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
        },
        reports: [],
        laboratory: [],
        checkups: []
    });
    const [errors, setErrors] = useState({});

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
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
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

        // Clear the error for the specific field in emergencyContact
    setErrors((prevErrors) => ({
        ...prevErrors,
        emergencyContact: {
            ...prevErrors.emergencyContact,
            [name]: '' // Clear the error for the specific field in emergencyContact
        }
    }));
    };
    const validate = () => {
        let formErrors = {};

        // Validate fields
        if (!patient.lastName.trim()) {
            formErrors.lastName = "Last name is required";
        }
        if (!patient.firstName.trim()) {
            formErrors.firstName = "First name is required";
        }
        if (!patient.middleName.trim()) {
            formErrors.middleName = "Middle name is required";
        }
        if (!patient.dateOfBirth) {
            formErrors.dateOfBirth = "Date of birth is required";
        }
        if (!patient.contact.trim()) {
            formErrors.contact = "Contact number is required";
        } else if (!/^\d{10,12}$/.test(patient.contact)) {
            formErrors.contact = "Enter a valid contact number (10-12 digits)";
        }
        if (!patient.gender) {
            formErrors.gender = "Gender is required";
        }
        if (!patient.address) {
            formErrors.address = "Address is required";
        }
        if (!patient.height.trim()) {
            formErrors.height = "Height is required";
        } else if (!/^\d+(\.\d{1,2})?$/.test(patient.height)) {
            formErrors.height = "Enter a valid height (e.g., 170 or 5.9)";
        }
        if (!patient.weight.trim()) {
            formErrors.weight = "Weight is required";
        } else if (isNaN(patient.weight) || patient.weight.trim() === "") {
            formErrors.weight = "Enter a valid weight (e.g., 70 or 70.5)";
        }
        
        if (!patient.emergencyContact.name.trim()) {
            formErrors.emergencyContactName = "Emergency contact name is required";
        }
        if (!patient.emergencyContact.address.trim()) {
            formErrors.emergencyContactAddress = "Emergency contact address is required";
        }
        if (!patient.emergencyContact.relationship.trim()) {
            formErrors.emergencyContactRelationship = "Emergency contact relationship is required";
        }
        if (!patient.emergencyContact.contact.trim()) {
            formErrors.emergencyContactContact = "Emergency contact number is required";
        } else if (!/^\d{10,12}$/.test(patient.emergencyContact.contact)) {
            formErrors.emergencyContactContact = "Enter a valid emergency contact number (10-12 digits)";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        const currentDate = new Date().toISOString().split('T')[0];
        setSaveLoader(true);
    
        try {
       
            // Call the backend function
            const result = await resma_medical_clinic_backend.updatePatient(
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
                patient.emergencyContact,
                currentDate,           // Pass the registration date as the current date
               
            );
    
            if (result) {
                setSaveLoader(false);
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
                    },
                    currentDate: ''
                  
                });
                navigate(`/records/viewPatient/${patient.id}`, { state: { success: true } });
            } else {
                navigate(-1, { state: { failed: true } });
            }
        } catch (error) {
            console.error("Error updating patient:", error);
            alert('Error updating patient');
        }
    };
    


    const handleCancel = () => {
        navigate(-1); // Go back to the previous page
    };

    
    return (
         <>
            <Sidebar role={user.role} handleLogout={handleLogout} />
            <div className='max-h-screen ml-64 flex-grow font-poppins p-3 md:ml-[70px] lg:ml-64'>
                <div className='flex justify-between items-center mb-4'>
                    <div className=''>
                        <NavLink to="/records" className="fw-32 font-semibold   text-xl text-[#A9A9A9] hover:text-[#014BA8]" href="">MEDICAL RECORDS</NavLink>
                        <NavLink to="/AddPatient" className="fw-32 font-semibold  text-xl text-[#4673FF] " href=""> / UPDATE PATIENT</NavLink>
                    </div>

                    <div className='flex justify-center'>
                        <button className="w-24 py-1 rounded-3xl font-semibold text-lg bg-[#4673FF] text-white transition-all duration-300 transform hover:bg-[#365ec4] hover:scale-105 hover:shadow-lg" onClick={handleSubmit}>
                            {saveLoader ? (
                                     <p className='flex items-center justify-center'><MoonLoader className=""size={25} color={color} loading={true} /></p>
                            ): (
                               "SAVE"
                            )}
                        
                        </button>
                        <button className="w-24 ml-1 py-1 rounded-3xl font-semibold text-lg bg-[#A9A9A9] text-white transition-all duration-300 transform hover:bg-gray-600 hover:scale-105 hover:shadow-md" onClick={handleCancel}>
                      CANCEL</button>
                    </div>
                </div>
           
                <main className='max-h-screen border-2 shadow-lg rounded-xl relative'>
                    <div className='w-full bg-[#4673FF]  rounded rounded-tl-xl rounded-tr-xl px-5 py-2 text-white font-semibold text-base'>I. Demographic Information </div>
                    <div className='w-full mt-2'>
                        <form className="form text-sm" onSubmit={handleSubmit}>
                            <div className='w-full flex px-7 py-1 mt-3'>
                              
                               <div className='w-1/3 mr-4'>
                                <label className=' mr-1  font-semibold text-black ' htmlFor="fullName">Last Name</label>
                                        <br></br>
                                        <input
                                            className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded  focus:outline-none focus:ring-2 focus:ring-blue-500 input-placeholder-padding"
                                            type="text"
                                            name="lastName"
                                            value={patient.lastName}
                                            onChange={handleInputChange}
                                            placeholder='Enter here'
                                            required
                                             autoComplete='off'
                                        />
                                         {errors.lastName && <p className="bg-red-100 text-red-500 text-xs py-1 px-2 rounded mt-1">{errors.lastName}</p>}
                               </div>

                               <div className='w-1/3 mr-4'>
                                <label className=' mr-1  font-semibold text-black ' htmlFor="fullName">First Name</label>
                                        <br></br>
                                        <input
                                        className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded  focus:outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 input-placeholder-padding"
                                            type="text" 
                                            name="firstName"
                                            value={patient.firstName}
                                            onChange={handleInputChange}
                                            placeholder='Enter here'
                                            required
                                             autoComplete='off'
                                        />
                                         {errors.firstName && <p className="bg-red-100 text-red-500 text-xs py-1 px-2 rounded mt-1">{errors.firstName}</p>}
                               </div>

                               <div className='w-1/3 mr-4'>
                                <label className=' mr-1 font-semibold text-black '  htmlFor="fullName">Middle Name</label>
                                        <br></br>
                                        <input
                                        className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded  focus:outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 input-placeholder-padding"
                                            type="text"
                                            name="middleName"
                                            value={patient.middleName}
                                            onChange={handleInputChange}
                                            placeholder='Enter here'
                                             autoComplete='off'
                                        />
                                        {errors.middleName && <p className="bg-red-100 text-red-500 text-xs py-1 px-2 rounded mt-1">{errors.middleName}</p>}

                               </div>
                                   
                               <div className='flex-grow'>
                                <label className=' mr-1 font-semibold text-black ' htmlFor="fullName">Ext. Name</label>
                                        <br></br>
                                        <input
                                        className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:outline-none focus:ring- focus:ring-blue-500 input-placeholder-padding"
                                            type="text"
                                            name="extName"
                                            value={patient.extName}
                                            onChange={handleInputChange}
                                            placeholder='Enter here'
                                             autoComplete='off'
                                        />
                               </div>

                            </div>
                             
                         
                            <div className='w-full flex px-7 py-1'>
                                <div className='w-1/3 mr-4'>
                                    <label className=' mr-1 font-semibold text-black '  htmlFor="dateOfBirth">Date of Birth</label><br></br>
                                    <input
                                        className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 input-placeholder-padding"
                                        type="date"
                                        name="dateOfBirth"
                                        value={patient.dateOfBirth}
                                        onChange={handleInputChange}
                                        placeholder='mm/dd/yyyy'
                                        required
                                         autoComplete='off'
                                    />
                                    {errors.dateOfBirth && <p className="bg-red-100 text-red-500 text-xs py-1 px-2 rounded mt-1">{errors.dateOfBirth}</p>}
                                </div>

                                <div className='w-1/3 mr-4'>
                                    <label className=' mr-1 font-semibold text-black ' htmlFor="contact">Contact Number</label>
                                    <input
                                        className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 input-placeholder-padding"
                                        type="text"
                                        name="contact"
                                        value={patient.contact}
                                        onChange={handleInputChange}
                                        placeholder='Enter here'
                                        required
                                         autoComplete='off'
                                    />
                                    {errors.contact && <p className="bg-red-100 text-red-500 text-xs py-1 px-2 rounded mt-1">{errors.contact}</p>}
                                </div>

                                <div className="w-1/2 ">
                                    <div className=' w-full flex' >
                                    <div className='w-1/2 mr-4'>
                                    <label className="mr-1 font-semibold text-black" htmlFor="gender">Gender</label>
                                    <select
                                    id="gender"
                                    name="gender"
                                    value={patient.gender}
                                    onChange={handleInputChange}
                                    className="mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                    <option value="" disabled>Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    </select>
                                    {errors.gender && <p className="bg-red-100 text-red-500 text-xs py-1 px-2 rounded mt-1">{errors.gender}</p>}
                                    </div>

                                    <div className='w-1/3 mr-4'>
                                        <label className=' mr-1 font-semibold text-black ' htmlFor="height">Height</label><br></br>
                                        <input
                                            className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 input-placeholder-padding"
                                            type="text"
                                            name="height"
                                            value={patient.height}
                                            onChange={handleInputChange}
                                            placeholder='cm'
                                             autoComplete='off'
                                        />
                                        {errors.height && <p className="bg-red-100 text-red-500 text-xs py-1 px-2 rounded mt-1">{errors.height}</p>}
                                    </div>

                                    <div className='w-1/3 mr-4'>
                                        <label className=' mr-1 font-semibold text-black ' htmlFor="weight">Weight</label>
                                            <input
                                                className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:outline-none focus:ring-2  focus:ring-blue-500 input-placeholder-padding"
                                                type="text"
                                                name="weight"
                                                value={patient.weight}
                                                onChange={handleInputChange}
                                                placeholder='kg'
                                                 autoComplete='off'
                                            />
                                            {errors.weight && <p className="bg-red-100 text-red-500 text-xs py-1 px-2 rounded mt-1">{errors.weight}</p>}
                                        </div>
                                    </div>     
                                </div>
                                
                               
                               
                             </div>
                             <div className='w-full flex px-7 py-1'>
                             <div className='w-1/2 '>
                                    <label className=' mr-1 font-semibold text-black ' htmlFor="address">Address</label>
                                    <input
                                       className=" mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 input-placeholder-padding"
                                        type="text"
                                        name="address"
                                        value={patient.address}
                                        onChange={handleInputChange}
                                        placeholder='Barangay, Municipality, Province'
                                         autoComplete='off'
                                    />
                                    {errors.address && <p className="bg-red-100 text-red-500 text-xs py-1 px-2 rounded mt-1">{errors.address}</p>}
                                </div>

                            </div>
                            
                               
                           
                      
                              
                            <div className='w-full bg-[#4673FF]  rounded rounded-tl-xl rounded-tr-xl px-5 py-2 text-white font-semibold text-base mt-3 '>II. Emergency Contact </div>
                        
                            
                            <div className='w-full  flex px-7 py-1 mt-3'>
    <div className='w-1/3 mr-4'>
        <label className='mr-1 font-semibold text-black' htmlFor="name">Full Name</label><br />
        <input
            className="mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 input-placeholder-padding"
            type="text"
            name="name"
            value={patient.emergencyContact.name}
            onChange={handleEmergencyContactChange}
            placeholder='Enter here'
             autoComplete='off'
        />
        {errors.emergencyContactName && <p className="bg-red-100 text-red-500 text-xs py-1 px-2 rounded mt-1">{errors.emergencyContactName}</p>}
    </div>

    <div className='w-1/3 mr-4'>
        <label className='mr-1 font-semibold text-black' htmlFor="address">Address</label>
        <input
            className="mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 input-placeholder-padding"
            type="text"
            name="address"
            value={patient.emergencyContact.address}
            onChange={handleEmergencyContactChange}
            placeholder='Barangay, Municipality, Province'
             autoComplete='off'
        />
        {errors.emergencyContactAddress && <p className="bg-red-100 text-red-500 text-xs py-1 px-2 rounded mt-1">{errors.emergencyContactAddress}</p>}
    </div>

    <div className='w-1/3 mr-4'>
        <label className='mr-1 font-semibold text-black' htmlFor="relationship">Relationship</label>
        <input
            className="mt-1 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 input-placeholder-padding"
            type="text"
            name="relationship"
            value={patient.emergencyContact.relationship}
            onChange={handleEmergencyContactChange}
            placeholder='Enter here'
             autoComplete='off'
        />
        {errors.emergencyContactRelationship && <p className="bg-red-100 text-red-500 text-xs py-1 px-2 rounded mt-1">{errors.emergencyContactRelationship}</p>}
    </div>
</div>

<div className='w-full flex px-7 py-1'>
    <div className='w-1/3 mr-4'>
        <label className='mr-1 font-semibold text-black' htmlFor="contact">Contact Number</label>
        <input
            className="mt-1 mb-7 py-1 w-full border text-black border-[#858796]-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 input-placeholder-padding"
            type="text"
            name="contact"
            value={patient.emergencyContact.contact}
            onChange={handleEmergencyContactChange}
            placeholder='09122978320'
             autoComplete='off'
        />
        {errors.emergencyContactContact && <p className="bg-red-100 text-red-500 text-xs py-1 px-2 rounded mt-1">{errors.emergencyContactContact}</p>}
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
