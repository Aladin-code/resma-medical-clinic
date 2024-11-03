import React from 'react';
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { IoArrowUpSharp } from 'react-icons/io5';
import { MdArrowDownward } from 'react-icons/md';

// Utility function to format the date
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

function Comparison({ data }) {
    console.log(data);
    if (!data || data.length < 2) {
        return <div></div>; // Display a loading message when data is not available
    }

    // Assuming the first item is prevTest and the second item is currentTest
    const prevTest = data[0];
    const currentTest = data[1];

    // Accessing values correctly
    const prevValue1 = prevTest.test.result[0].value; // Accessing value1 from result array
    const prevValue2 = prevTest.test.result[1].value; // Accessing value2 from result array
    const currentValue1 = currentTest.test.result[0].value; // Accessing value1 from result array
    const currentValue2 = currentTest.test.result[1].value; // Accessing value2 from result array

    const isHigherValue1 = currentValue1 > prevValue1; // Compare current and previous value1
    const isHigherValue2 = currentValue2 > prevValue2; // Compare current and previous value2

    return (
        <div className='w-full flex mt-2'>
            {/* Before comparison box */}
            <div className="w-1/2 mx-1 text-white text-sm rounded-xl shadow-xl">
                <h5 className='w-full text-center rounded-tl-xl rounded-tr-xl bg-[#4673FF] py-1'>
                    Before: {formatDate(prevTest.test.date)}
                </h5> 
                <div className="flex text-[#4673FF] font-bold text-base mt-3">
                    <h1 className='w-1/2 pl-[100px] text-left'>mmol/l</h1>
                    <h1 className="w-1/2 pl-[80px] text-left">mg/dl</h1>
                </div>
                <div className="flex justify-evenly items-center text-black font-bold text-base text-[30px] pl-[60px] mb-5">
                    <h1 className='text-center'>{prevValue1}</h1>
                    <HiMiniArrowsUpDown className='text-[30px] font-[900]'/>
                    <h1 className='pl-[70px] text-right'>{prevValue2}</h1>
                    <HiMiniArrowsUpDown className='text-[30px] font-[900]'/>
                </div>
            </div>

            {/* After comparison box */}
            <div className="w-1/2 mx-1 text-white text-sm rounded-xl shadow-xl">
                <h5 className='w-full text-center rounded-tl-xl rounded-tr-xl bg-[#4673FF] py-1'>
                    After: {formatDate(currentTest.test.date)}
                </h5>
                <div className="flex text-[#4673FF] font-bold text-base mt-3">
                    <h1 className='w-1/2 pl-[100px] text-left'>mmol/l</h1>
                    <h1 className="w-1/2 pl-[80px] text-left">mg/dl</h1>
                </div>
                <div className="flex justify-evenly items-center text-black font-bold text-base text-[30px] pl-[60px] mb-5">
                    <h1 className='text-center'>{currentValue1}</h1>
                    {isHigherValue1 ? <IoArrowUpSharp className='text-[30px] font-[900]'/> : <MdArrowDownward className='text-[30px] font-[900]'/>}
                    <h1 className='pl-[70px] text-right'>{currentValue2}</h1>
                    {isHigherValue2 ? <IoArrowUpSharp className='text-[30px] font-[900]'/> : <MdArrowDownward className='text-[30px] font-[900]'/>}
                </div>
            </div>
        </div>
    );
}

export default Comparison;
