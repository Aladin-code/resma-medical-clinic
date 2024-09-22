import Sidebar from '../Sidebar';
import { IoIosArrowBack } from "react-icons/io";
import { NavLink } from 'react-router-dom';
function AddReport(){
    return(
        <>
            <Sidebar />
            <div className=' ml-64 flex-grow  font-poppins p-3'>
                <div className='flex justify-between p-3'>
                    <a href=''> <h1 className='flex justify-center items-center text-xl text-primary font-semibold'><IoIosArrowBack className='ml-1' />BACK</h1></a>
                    <div><h1 className='text-xl text-primary font-semibold'>ADD NEW REPORT</h1></div>
                    <div></div>
                </div>
                <form action="" className="form ">
                    <div className='flex w-full'>
                        <div className='w-1/2 p-3 bg-[#F5F9FF] m-1'>
                            <div className='w-full text-center'><p className='text-lg font-semibold text-primary '>CLINICAL FINDINGS</p></div>
                            <textarea className="p-2 text-xs min-h-64  w-full" name="" placeholder='Enter clinical findings here...' id=""></textarea>
                            <h1 className='text-sm font-semibold mb-1'>REMARKS (Optional)</h1>
                            <textarea className="p-2 text-xs min-h-32  w-full" name="" placeholder='Enter remarks here...' id=""></textarea>
                        </div>
                        <div className='w-1/2 p-3 text-xs bg-[#F5F9FF] m-1'>
                            <div className='w-full text-center'><p className='text-lg font-semibold text-primary '>PRESCRIBE MEDICINE</p></div>
                            <div className="w-full flex  ">
                                <div className="flex-grow flex items-center">
                                    <label  className="font-semibold" htmlFor="">Medication<span className='text-[red]'>*</span></label>
                                    <select className='mx-2 py-1 px-2 w-64 border border-blue-200  rounded-lg ' name="medications" id="medications">
                                        <option value="Paracetamol">Paracetamol</option>
                                        <option value="Amoxicilin">Amoxicilin</option>
                                        <option value="Biogesic">Biogesic</option>
                                        <option value="Amlodepin">Amlodepin</option>
                                    </select>
                                </div>
                                <div className="flex items-center flex-grow">
                                        <label  className="font-semibold" htmlFor="">Strenght<span className='text-[red]'>*</span></label>
                                        <input className="ml-2 w-full py-1 px-2 border border-blue-200  rounded-lg"type="text" name="" id="" />
                                </div>
                            </div>
                            <div className="w-full flex mt-2  ">
                                <div className="flex items-center flex-grow ">
                                        <label  className="font-semibold" htmlFor="">Dispense<span className='text-[red]'>*</span></label>
                                        <input className="mx-2 w-full py-1 px-2 border border-blue-200  rounded-lg"type="text" name="" id="" />
                                </div>
                                <div className="flex-grow flex items-center">
                                    <label  className="font-semibold mr-2" htmlFor="">Signa<span className='text-[red]'>*</span></label>
                                    <input className=' py-1 px-2 w-64 border border-blue-200  rounded-lg ' name="medications" id="medications"></input>
                                </div>
                            </div>
                            <div className="w-full flex mt-2  ">
                                <div className="flex flex-grow items-center w-84 ">
                                        <label  className="font-semibold" htmlFor="">Indication<span className='text-[red]'>*</span></label>
                                        <input className="mx-2 w-64 py-1 px-2 border border-blue-200  rounded-lg" type="text" name="" id="" />
                                </div>
                                <div className="flex-grow flex items-center">
                                    <label  className="font-semibold mr-2" htmlFor="">Refills<span className='text-[red]'>*</span></label>
                                    <input className=' py-1 px-2  w-full border border-blue-200  rounded-lg 'type="text" name="" id=""  ></input>
                                </div>
                            </div>
                            <div className='w-full text-right mt-5'>
                                <NavLink to="/addReport" className='bg-primary text-white text-xs  font-semibold px-3 py-2 rounded-lg'>ADD MEDICATION</NavLink>
                            </div>
                            <div className='mt-5 bg-white min-h-80'></div>
                        </div>
                    </div>

                    
                    <div className='w-full text-right mt-5 '>
                                <NavLink to="/addReport" className='bg-primary text-white text-base  font-semibold px-10 py-2 rounded-lg'>ADD REPORT</NavLink>
                            </div>
                 
                </form>
            </div>
        </>
           
    );
}
export default AddReport