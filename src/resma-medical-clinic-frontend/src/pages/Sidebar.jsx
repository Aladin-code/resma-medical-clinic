import logo from '../assets/resma.png';
import { NavLink } from 'react-router-dom';
import { MdDashboard } from "react-icons/md";
import { PiFolderSimplePlusFill } from "react-icons/pi";
import { AiFillSchedule } from "react-icons/ai";


function Sidebar() {

    return (
        <>      
            <nav className='fixed top-0 left-0 bg-[#014BA8] w-64 font-poppins h-screen pt-5 shadow-lg'>
                <div>
                    <img className='rounded-2xl' src={logo} alt="Logo" width="215px" height="66px" />
                </div>

                <div className='w-full px-5 mt-8'>
                    <div className='bg-white w-full h-[3px] rounded-lg shadow-lg'></div>
                </div>
                <div className='text-sm font-bold text-white mt-6 flex flex-col justify-center items-center'>
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => 
                            `h-12 w-10/12 flex justify-start items-center rounded-xl mt-5 border-4 shadow-xl px-2 ${isActive ? 'bg-white text-[#014BA8]' : 'bg-[#014BA8] text-white'} hover:bg-white hover:text-[#014BA8] active:bg-white`
                        }
                    >
                        <MdDashboard size={25} className='mx-1'/>MY DASHBOARD
                    </NavLink>
                    <NavLink 
                        to="/records" 
                        className={({ isActive }) => 
                            `h-12 w-10/12 flex justify-start items-center rounded-xl mt-5 border-4 shadow-xl px-2 ${isActive ? 'bg-white text-[#014BA8]' : 'bg-[#014BA8] text-white'} hover:bg-white hover:text-[#014BA8] active:bg-white`
                        }
                    >
                        <PiFolderSimplePlusFill size={25} className='mx-1' />MEDICAL RECORDS
                    </NavLink>
                    <NavLink 
                        to={"/appointments" || "/addAppointment"} 
                        className={({ isActive }) => 
                            `h-12 w-10/12 flex justify-start items-center rounded-xl mt-5 border-4 shadow-xl px-2 ${isActive ? 'bg-white text-[#014BA8]' : 'bg-[#014BA8] text-white'} hover:bg-white hover:text-[#014BA8] active:bg-white`
                        }
                    >
                        <AiFillSchedule size={25} className='mx-1' />APPOINTMENTS
                    </NavLink>
                </div>
            </nav>
        </>
    );
}

export default Sidebar;
