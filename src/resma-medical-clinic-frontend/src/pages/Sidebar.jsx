import logo from '../assets/resma.png';
import { NavLink } from 'react-router-dom';
import { MdDashboard } from "react-icons/md";
import { PiFolderSimplePlusFill } from "react-icons/pi";
import { AiFillSchedule } from "react-icons/ai";
import { IoLogOut } from "react-icons/io5";

function Sidebar({role,handleLogout}) {
   console.log("User", role);
//    const user = userInfo[0];
//    const role = user.role;
    return (
        <>      
            <nav className='fixed top-0 left-0 bg-[#639DFF] w-64 font-poppins h-screen pt-5 shadow-lg md:w-[70px] lg:w-64 transition-all duration-300'>
                <div className='md:hidden  lg:block'>
                    <img className='rounded-2xl md:w-[50px]  md:rounded-sm lg:w-[215px] lg:rounded-2xl ' src={logo} alt="Logo" width="215px" height="66px" />
                </div>

                <div className='w-full px-5 mt-8 md:px-1'>
                    <div className='bg-white w-full h-[3px] rounded-lg shadow-lg'></div>
                </div>
                <div className='text-sm font-bold text-white mt-6 flex flex-col justify-center items-center'>
                {
                        role != "Admin" && (
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => 
                            `flex items-center h-12 w-10/12 flex justify-start items-center rounded-xl mt-5 border-4 shadow-xl px-2 ${isActive ? 'bg-white text-[#4673FF]' : 'bg-[#639DFF] text-white'} hover:bg-white hover:text-[#4673FF] active:bg-white`
                        }
                    >
                        <MdDashboard size={25} className='mx-1 '/> <div className='md:hidden lg:block'>MY DASHBOARD</div>
                    </NavLink>
                        )}
                    {
                        role != "Admin" && (
                    <NavLink 
                        to="/records"  end={false}
                        className={({ isActive }) => 
                            `flex items-center h-12 w-10/12 flex justify-start items-center rounded-xl mt-5 border-4 shadow-xl px-2 ${isActive ? 'bg-white text-[#4673FF]' : 'bg-[#639DFF] text-white'} hover:bg-white hover:text-[#4673FF] active:bg-white`
                        }
                    >
                       
                        <PiFolderSimplePlusFill size={25} className='mx-1 mt-[-4px]' /><div className='md:hidden lg:block'>MEDICAL RECORDS</div>
                  
                       
                    </NavLink>
                    )}

                    {
                        role != "Admin" && (
                    <NavLink 
                        to={"/appointments" } end={false}
                        className={({ isActive }) => 
                            `h-12 w-10/12 flex justify-start items-center rounded-xl mt-5 border-4 shadow-xl px-2 ${isActive ? 'bg-white text-[#4673FF]' : 'bg-[#639DFF] text-white'} hover:bg-white hover:text-[#4673FF] active:bg-white`
                        }
                    >
                        <AiFillSchedule size={25} className='mx-1 mt-[-4px]' /><div className='md:hidden lg:block'>APPOINTMENTS</div>
                    </NavLink>
                        )}
                    {
                        role === "Admin" && (
                            <NavLink 
                                to="/users" end={false}// Only the path "/users" is needed, since || "/users" will always be true
                                className={({ isActive }) => 
                                    `h-12 w-10/12 flex justify-start items-center rounded-xl mt-5 border-4 shadow-xl px-2 ${isActive ? 'bg-white text-[#4673FF]' : 'bg-[#639DFF] text-white'} hover:bg-white hover:text-[#4673FF] active:bg-white`
                                }
                            >
                                <AiFillSchedule size={25} className='mx-1 mt-[-4px]' /><div className='md:hidden lg:block'>USERS</div>
                            </NavLink>
                        )
                    }

                    
                    
                    
                </div>
                <div className=" absolute bottom-2 text-center w-full px-4 text-white md:px-1 lg:px-4">
                    <button  className="bg-[#FF6347]  flex items-center text-sm py-3 w-full text-left rounded-xl font-semibold px-3"  onClick={handleLogout}>  <IoLogOut className='mx-1 text-xl hover:bg-red-3 00'/><div className='md:hidden lg:block'>LOGOUT</div></button>
                </div>
                 
            </nav>
            
        </>
    );
}

export default Sidebar;
