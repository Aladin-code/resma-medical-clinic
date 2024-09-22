import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { resma_medical_clinic_backend } from 'declarations/resma-medical-clinic-backend';
import Sidebar from '../Sidebar.jsx';
import patientImg from '../../assets/profile.png';
import rx from '../../assets/rxicon.svg';
import { NavLink } from 'react-router-dom';
function ViewPatient(){
    const { id } = useParams(); // Get patient ID from URL
    const [patient, setPatient] = useState(null);

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

    return(
        <>
            <Sidebar />
            <div className=' ml-64 flex-grow  font-poppins p-3'>
            <div className='mb-4 mt-4'>
                        <NavLink to="/records" className="fw-32 font-semibold   text-xl text-[#A9A9A9] hover:text-[#014BA8]" href="">MEDICAL RECORDS  </NavLink>
                        <NavLink to="/AddPatient" className="fw-32 font-semibold  text-xl text-[#014BA8] " href=""> / VIEW PATIENT</NavLink>
            </div>
            <section className='flex'>
           
                <div className='flex-col h-screen fixed w-80 border rounded-lg shadow-lg '>
                    <div className='text-center p-2  mb-1'>
                        <h1 className='text-[#014BA8] text-lg font-bold mb-2'>PATIENT INFORMATION</h1>
                        <img className="border border-slate-300 rounded-full" src={patientImg} alt="150px"  width="150px" height="150px" />
                    
                       

                        <div className='text-center'>
                        <NavLink to={`/updatePatient/${patient.id}`} className="left-3 text-[#014BA8] text-sm font-semibold">Edit Profile</NavLink>

                    </div>
                    </div>
                    <div className='w-full bg-[#014BA8] text-center text-sm text-white py-2 font-semibold'>
                        <h1>DEMOGRAPHIC INFORMATION</h1>
                    </div>
                    <div className="flex justify-center px-4 text-xs leading-5">
                        <div className='w-2/5 p-2 font-semibold'>
                          
                            <p>Full Name:</p>
                            <p>Date of Birth:</p>
                            <p>Gender:</p>
                            <p>Address:</p>
                            <p>Contact:</p>
                            <p>Height:</p>
                            <p>Weight:</p>
                        </div>

                        <div className='w-3/5 p-2 '>
                           
                            <p>{patient.firstName} {patient.middleName} {patient.lastName} {patient.extName}</p>
                            <p>{patient.dateOfBirth}</p>
                            <p>{patient.gender}</p>
                            <p>{patient.address}</p>
                            <p>{patient.contact}</p>
                            <p>{patient.height}</p>
                            <p>{patient.weight}</p>
                        </div>
                    </div>
                    <div className='w-full bg-[#014BA8] text-center text-sm text-white py-2 font-semibold'>
                        <h1>EMERGENCY CONTACT</h1>
                    </div>
                    <div className="flex justify-center px-4 text-xs leading-5">
                        <div className='w-2/5 p-2 font-semibold'>
                            <p>Name:</p>
                            <p>Relationship:</p>
                            <p>Address:</p>
                            <p>Contact:</p>
                        </div>

                        <div className='w-3/5 p-2 '>
                            <p>{patient.emergencyContact.name}</p>
                            <p>{patient.emergencyContact.relationship}</p>
                            <p>{patient.emergencyContact.address}</p>
                            <p>{patient.emergencyContact.contact}</p>
                        </div>
                    </div>
                  
                  
                </div>

                <div className='flex-grow  ml-[330px] border rounded-lg ml-3 p-3'>
                    <div className="w-full text-center flex justify-between items-center mb-2">
                        <h1 className='text-[#014BA8] text-lg font-bold '>GENERAL MEDICAL HISTORY</h1>
                        <div className=" text-right">
                        <NavLink to="/addReport" className='bg-[#014BA8] text-white text-xs  font-semibold px-3 py-2 rounded-lg'>ADD NEW REPORT</NavLink>
                        </div>
                    </div>

                   
                    <div className='bg-[#F5F9FF]'>
                    <p className='w-full text-right text-lg font-semibold mt-2 pt-3 pr-3'>Date: <span className=''>01-09-03</span></p>
                    <div className="w-full flex  bg-[#F5F9FF] px-3">
                        <div className='w-1/2'>
                            <p className='w-full text-center text-primary text-base font-semibold mb-2'>Clinical Findings</p>
                            <div>
                                <p className='text-xs leading-5'>
                                    <li>Chest Pain + Shortness of Breath</li>
                                    <li>Upper Respiratory Infection (URI)</li>
                                    <li>Urinary Track Infection (UTI)</li>
                                    <li>Mild Ear Infection</li>
                                    <li>Tuberous Sclerosis</li>
                                </p>
                                
                            </div>
                        </div>

                        <div className='w-1/2 mb-4 border-l-2 border-blue-100'>
                            <p className='w-full text-center text-primary text-base font-semibold mb-2'>Prescriptions</p>

                            <div className="flex bg-white text-xs p-2 ">

                                <div className='px-1 '>
                                    <img src={rx} alt="rx" width="40px" height="40px" />
                                </div>

                                <div className='leading-5'>
                                    <p>Amoxil(Amoxicillin) 400 mg Chewable Tabs</p>
                                    <p>Disp: #56(Fifty-Six)</p>
                                    <p>Sig: Chew 2 tablets po bid x 14 days for Ear Infection</p>
                                    <p>Refills: 6</p>
                                </div>
                                
                            </div>

                            <div className="flex bg-white text-xs p-2 mt-1">
                                <div className='px-1 '>
                                    <img src={rx} alt="rx" width="40px" height="40px" />
                                </div>

                                <div className='leading-5'>
                                    <p>Amoxil(Amoxicillin) 400 mg Chewable Tabs</p>
                                    <p>Disp: #56(Fifty-Six)</p>
                                    <p>Sig: Chew 2 tablets po bid x 14 days for Ear Infection</p>
                                    <p>Refills: 6</p>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className='bg-[#F5F9FF]'>
                    <p className='w-full text-right text-xs font-semibold mt-2 pt-3 pr-3'>Date: <span className='font-normal'>01-09-03</span></p>
                    <div className="w-full flex  bg-[#F5F9FF] px-3">
                        <div className='w-1/2'>
                            <p className='w-full text-center text-primary text-base font-semibold mb-2'>Clinical Findings</p>
                            <div>
                                <p className='text-xs leading-5'>
                                    <li>Chest Pain + Shortness of Breath</li>
                                    <li>Upper Respiratory Infection (URI)</li>
                                    <li>Urinary Track Infection (UTI)</li>
                                    <li>Mild Ear Infection</li>
                                    <li>Tuberous Sclerosis</li>
                                </p>
                                
                            </div>
                        </div>

                        <div className='w-1/2 mb-4 border-l-2 border-blue-100'>
                            <p className='w-full text-center text-primary text-base font-semibold mb-2'>Prescriptions</p>

                            <div className="flex bg-white text-xs p-2 ">

                                <div className='px-1 '>
                                    <img src={rx} alt="rx" width="40px" height="40px" />
                                </div>

                                <div className='leading-5'>
                                    <p>Amoxil(Amoxicillin) 400 mg Chewable Tabs</p>
                                    <p>Disp: #56(Fifty-Six)</p>
                                    <p>Sig: Chew 2 tablets po bid x 14 days for Ear Infection</p>
                                    <p>Refills: 6</p>
                                </div>
                                
                            </div>

                            <div className="flex bg-white text-xs p-2 mt-1">
                                <div className='px-1 '>
                                    <img src={rx} alt="rx" width="40px" height="40px" />
                                </div>

                                <div className='leading-5'>
                                    <p>Amoxil(Amoxicillin) 400 mg Chewable Tabs</p>
                                    <p>Disp: #56(Fifty-Six)</p>
                                    <p>Sig: Chew 2 tablets po bid x 14 days for Ear Infection</p>
                                    <p>Refills: 6</p>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    </div>

                    <div className='bg-[#F5F9FF]'>
                    <p className='w-full text-right text-xs font-semibold mt-2 pt-3 pr-3'>Date: <span className='font-normal'>01-09-03</span></p>
                    <div className="w-full flex  bg-[#F5F9FF] px-3">
                        <div className='w-1/2'>
                            <p className='w-full text-center text-primary text-base font-semibold mb-2'>Clinical Findings</p>
                            <div>
                                <p className='text-xs leading-5'>
                                    <li>Chest Pain + Shortness of Breath</li>
                                    <li>Upper Respiratory Infection (URI)</li>
                                    <li>Urinary Track Infection (UTI)</li>
                                    <li>Mild Ear Infection</li>
                                    <li>Tuberous Sclerosis</li>
                                </p>
                                
                            </div>
                        </div>

                        <div className='w-1/2 mb-4 border-l-2 border-blue-100'>
                            <p className='w-full text-center text-primary text-base font-semibold mb-2'>Prescriptions</p>

                            <div className="flex bg-white text-xs p-2 ">

                                <div className='px-1 '>
                                    <img src={rx} alt="rx" width="40px" height="40px" />
                                </div>

                                <div className='leading-5'>
                                    <p>Amoxil(Amoxicillin) 400 mg Chewable Tabs</p>
                                    <p>Disp: #56(Fifty-Six)</p>
                                    <p>Sig: Chew 2 tablets po bid x 14 days for Ear Infection</p>
                                    <p>Refills: 6</p>
                                </div>
                                
                            </div>

                            <div className="flex bg-white text-xs p-2 mt-1">
                                <div className='px-1 '>
                                    <img src={rx} alt="rx" width="40px" height="40px" />
                                </div>

                                <div className='leading-5'>
                                    <p>Amoxil(Amoxicillin) 400 mg Chewable Tabs</p>
                                    <p>Disp: #56(Fifty-Six)</p>
                                    <p>Sig: Chew 2 tablets po bid x 14 days for Ear Infection</p>
                                    <p>Refills: 6</p>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </section>

            </div>
        </>
    );
}
export default ViewPatient