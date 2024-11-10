import logo from '../assets/resma.png';
import { NavLink } from 'react-router-dom';
import { MdDashboard } from "react-icons/md";
import { PiFolderSimplePlusFill } from "react-icons/pi";
import { AiFillSchedule } from "react-icons/ai";
import { IoLogOut } from "react-icons/io5";

function Sidebar({handleLogout}) {

    return (
        <>      
            <nav className='fixed top-0 left-0 bg-[#639DFF] w-64 font-poppins h-screen pt-5 shadow-lg'>
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
                            `flex items-center h-12 w-10/12 flex justify-start items-center rounded-xl mt-5 border-4 shadow-xl px-2 ${isActive ? 'bg-white text-[#4673FF]' : 'bg-[#639DFF] text-white'} hover:bg-white hover:text-[#4673FF] active:bg-white`
                        }
                    >
                        <MdDashboard size={25} className='mx-1'/> <div>MY DASHBOARD</div>
                    </NavLink>
                    <NavLink 
                        to="/records" 
                        className={({ isActive }) => 
                            `flex items-center h-12 w-10/12 flex justify-start items-center rounded-xl mt-5 border-4 shadow-xl px-2 ${isActive ? 'bg-white text-[#4673FF]' : 'bg-[#639DFF] text-white'} hover:bg-white hover:text-[#4673FF] active:bg-white`
                        }
                    >
                       
                        <PiFolderSimplePlusFill size={25} className='mx-1 mt-[-4px]' /><div>MEDICAL RECORDS</div>
                  
                       
                    </NavLink>
                    <NavLink 
                        to={"/appointments" || "/addAppointment"} 
                        className={({ isActive }) => 
                            `h-12 w-10/12 flex justify-start items-center rounded-xl mt-5 border-4 shadow-xl px-2 ${isActive ? 'bg-white text-[#4673FF]' : 'bg-[#639DFF] text-white'} hover:bg-white hover:text-[#4673FF] active:bg-white`
                        }
                    >
                        <AiFillSchedule size={25} className='mx-1 mt-[-4px]' />APPOINTMENTS
                    </NavLink>

                    <NavLink 
                        to={"/users" || "/users"} 
                        className={({ isActive }) => 
                            `h-12 w-10/12 flex justify-start items-center rounded-xl mt-5 border-4 shadow-xl px-2 ${isActive ? 'bg-white text-[#4673FF]' : 'bg-[#639DFF] text-white'} hover:bg-white hover:text-[#4673FF] active:bg-white`
                        }
                    >
                        <AiFillSchedule size={25} className='mx-1 mt-[-4px]' />USERS
                    </NavLink>
                    
                    
                </div>
                <div className=" absolute bottom-2 text-center w-full px-4 text-white ">
                    <button  className="bg-[#FF6347]  flex items-center text-sm py-3 w-full text-left rounded-xl font-semibold px-3"  onClick={handleLogout}>  <IoLogOut className='mx-1 text-xl hover:bg-red-3 00'/>LOGOUT</button>
                </div>
                 
            </nav>
            
        </>
    );
}

export default Sidebar;
