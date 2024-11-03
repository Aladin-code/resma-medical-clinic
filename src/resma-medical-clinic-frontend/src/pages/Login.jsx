import React from 'react';
import icon from '../assets/check-up.png';
import logo from '../assets/resma.png';
import icplogo from '../assets/icp-logo.png';

function Login({ handleLogin }) {
    return (
        <div className="w-full flex h-screen">
            <div className="w-1/2 border flex items-center justify-center">
                <img src={icon} alt="Health icon" />
            </div>
            <div className="w-1/2 bg-gradient-to-r from-[#81c9ff] to-[#4673ff] rounded-tl-2xl rounded-bl-2xl shadow-5xl">

                <img src={logo} width="300px" height="100px" alt="logo" className="rounded-xl mt-[30%]" />
                <div className="text-center">
                    <button
                        onClick={handleLogin} // Call the handleLogin function on button click
                        className='bg-white rounded-xl text-base py-7 px-11 font-semibold text-[#4673FF] mt-[10%]'
                    >
                        <img src={icplogo} width="30px" className="inline-block mr-2" alt="Internet Identity Logo" />
                        Login with Internet Identity
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
