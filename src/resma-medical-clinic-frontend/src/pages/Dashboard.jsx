import Sidebar from './Sidebar.jsx';
import checkup from '../assets/check-up.png';
import React, { useState } from 'react';


function Dashboard(){
    return(
        <>
           
            <div className='ml-64 flex-grow  font-poppins'>
                <div className='flex h-screen'>
                    <div className='w-3/5 flex flex-col  '>
                        <h1 className='mt-4 mx-3 px-3 text-2xl font-bold '>DASHBOARD</h1>
                        <div className='relative h-52 mt-2 mx-3 p-3 border-2 shadow-lg rounded-2xl'>
                            <p className='text-base font-semibold'>Welcome</p>
                            <p  className='text-2xl font-bold'> DRA. PAOLA YSABEL LINSANGAN!</p>
                            <p  className='text-sm font-semibold'>Licensed Doctor</p>
                            <span ><img className='absolute bottom-0 right-0' src={checkup} alt="checkup" width="200px" height="300px"/></span>
                            <span className=' absolute bottom-3 left-3 text-[#4673FF] text-sm font-semibold'><a href="">Edit Profile</a></span>
                        </div>
                        <div  className='m-3 p-3 border-2 border-slate-200 rounded-2xl shadow-lg '>
                            <p className='text-[#4673FF] text-base font-bold'>APPOINTMENTS</p>
                            <p className='text-xs text-black font-semibold'>TODAY: April 5, 2024</p>
                            <div className='mt-5'>
                            <table className="w-full table-auto text-xs ">
                                <thead className='bg-[#F7FAFC]  border-b-2 border-gray-200'>
                                    <tr>
                                    <th>Patient-ID</th>
                                    <th>Patient Name</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody className='text-center'>
                                    <tr className='border-b border-gray-300' >
                                    <td className='p-2'>RMC0001</td>
                                    <td className='p-2'>Aladin Cacho</td>
                                    <td className='p-2'>July 24, 2024</td>
                                    <td className='p-2'>8: 30 Am</td>
                                    <td className='p-2 '><span className='w-1/2 rounded-sm px-1 bg-green-100 text-[#8DE7A2]'>Completed</span></td>
                                    </tr>
                                    
                                    <tr className='border-b border-gray-300' >
                                    <td className='p-2'>RMC0001</td>
                                    <td className='p-2'>Aladin Cacho</td>
                                    <td className='p-2'>July 24, 2024</td>
                                    <td className='p-2'>8: 30 Am</td>
                                    <td className='p-2'><span className=' w-1/2 rounded-sm px-1 bg-green-100 text-[#97BDFF]'>Upcoming</span></td>
                                    </tr>
                                    
                                    <tr className='border-b border-gray-300' >
                                    <td className='p-2'>RMC0001</td>
                                    <td className='p-2'>Aladin Cacho</td>
                                    <td className='p-2'>July 24, 2024</td>
                                    <td className='p-2'>8: 30 Am</td>
                                    <td className='p-2'><span className='w-1/2 rounded-sm px-1 bg-green-100 text-[#FFB2B2]'>Cancelled</span></td>
                                    </tr>

                                    <tr className='border-b border-gray-300' >
                                    <td className='p-2'>RMC0001</td>
                                    <td className='p-2'>Aladin Cacho</td>
                                    <td className='p-2'>July 24, 2024</td>
                                    <td className='p-2'>8: 30 Am</td>
                                    <td className='p-2 '><span className='w-1/2 rounded-sm px-1 bg-green-100 text-[#8DE7A2]'>Completed</span></td>
                                    </tr>
                                    
                                    <tr className='border-b border-gray-300' >
                                    <td className='p-2'>RMC0001</td>
                                    <td className='p-2'>Aladin Cacho</td>
                                    <td className='p-2'>July 24, 2024</td>
                                    <td className='p-2'>8: 30 Am</td>
                                    <td className='p-2'><span className=' w-1/2 rounded-sm px-1 bg-green-100 text-[#97BDFF]'>Upcoming</span></td>
                                    </tr>
                                    
                                    <tr className='border-b border-gray-300' >
                                    <td className='p-2'>RMC0001</td>
                                    <td className='p-2'>Aladin Cacho</td>
                                    <td className='p-2'>July 24, 2024</td>
                                    <td className='p-2'>8: 30 Am</td>
                                    <td className='p-2'><span className='w-1/2 rounded-sm px-1 bg-green-100 text-[#FFB2B2]'>Cancelled</span></td>
                                    </tr>

                                    <tr className='border-b border-gray-300' >
                                    <td className='p-2'>RMC0001</td>
                                    <td className='p-2'>Aladin Cacho</td>
                                    <td className='p-2'>July 24, 2024</td>
                                    <td className='p-2'>8: 30 Am</td>
                                    <td className='p-2 '><span className='w-1/2 rounded-sm px-1 bg-green-100 text-[#8DE7A2]'>Completed</span></td>
                                    </tr>
                                    
                                    <tr className='border-b border-gray-300' >
                                    <td className='p-2'>RMC0001</td>
                                    <td className='p-2'>Aladin Cacho</td>
                                    <td className='p-2'>July 24, 2024</td>
                                    <td className='p-2'>8: 30 Am</td>
                                    <td className='p-2'><span className=' w-1/2 rounded-sm px-1 bg-green-100 text-[#97BDFF]'>Upcoming</span></td>
                                    </tr>
                                    
                                    <tr className='border-b border-gray-300' >
                                    <td className='p-2'>RMC0001</td>
                                    <td className='p-2'>Aladin Cacho</td>
                                    <td className='p-2'>July 24, 2024</td>
                                    <td className='p-2'>8: 30 Am</td>
                                    <td className='p-2'><span className='w-1/2 rounded-sm px-1 bg-green-100 text-[#FFB2B2]'>Cancelled</span></td>
                                    </tr>

                                    <tr className='border-b border-gray-300' >
                                    <td className='p-2'>RMC0001</td>
                                    <td className='p-2'>Aladin Cacho</td>
                                    <td className='p-2'>July 24, 2024</td>
                                    <td className='p-2'>8: 30 Am</td>
                                    <td className='p-2 '><span className='w-1/2 rounded-sm px-1 bg-green-100 text-[#8DE7A2]'>Completed</span></td>
                                    </tr>
                                  
                                    
                                </tbody>
                            </table>
                            </div>
                            
                        </div>
                    </div>

                    <div className='w-2/5 k'>
                        <div  className='h-72 mt-14 m-3 p-3 border-2 shadow-lg rounded-2xl'>
                        
                        </div>
                        <div  className='h-52 mt-7 m-3 p-3 border-2 shadow-lg rounded-2xl'>
                         
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
