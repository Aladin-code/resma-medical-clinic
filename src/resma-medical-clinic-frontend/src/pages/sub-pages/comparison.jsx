import React from 'react';
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { IoArrowUpSharp } from 'react-icons/io5';
import { MdArrowDownward } from 'react-icons/md';

// Utility function to format the date
const formatDate = (bigIntDate) => {
    const timestamp = Number(bigIntDate);  // Convert BigInt to Number
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    return new Date(timestamp).toLocaleDateString('en-US', options);
};

function Comparison({ data }) {
    console.log("Data received:", data);
    console.log(data.length);
    if (data.length < 2) {
        return (
            <div className='w-full min-h-[200px] shadow-xl rounded-xl  flex justify-center items-center h-full text-sm text-center text-[#D3D3D3]'>
                No enough data to compare.
            </div>
        );
    }

    // const sortedData = [...data].sort((a, b) => {
    //     // Convert BigInt to Number before comparison
    //     const dateA = Number(a.test.date);
    //     const dateB = Number(b.test.date);
    //     return dateB - dateA;  // Sorting in descending order (latest first)
    // });
    

    // console.log("Sorted data:", sortedData);
    
    // Assuming the first item is currentTest and the second item is prevTest
    const currentTest = data[data.length -1]; // Last element (latest)
    const prevTest = data[data.length -2]; // Second last element (previous)

    console.log("Latest Test:", currentTest);
    console.log("Previous Test:", prevTest);
    // Accessing values correctly
    const prevValue1 = prevTest.test.result[0].value; // Accessing value1 from result array
    const currentValue1 = currentTest.test.result[0].value; // Accessing value1 from result array

    // Convert the BigInt date values to Numbers for comparisons
    const prevTestDate = formatDate(prevTest.test.date); // Convert to formatted date
    const currentTestDate = formatDate(currentTest.test.date); // Convert to formatted date

    // Compare the values
    const isHigherValue1 = currentValue1 > prevValue1; // Compare current and previous value1
   
   
    return (
        <div className='w-full flex'>
            {/* Before comparison box */}
            <div className="w-1/2 text-white text-sm rounded-xl shadow-xl">
                <h5 className='w-full text-center rounded-tl-xl rounded-tr-xl bg-[#4673FF] py-1'>
                    Previous: {prevTestDate}
                </h5> 
                <div className="flex text-[#4673FF] font-bold text-base mt-3">
                    <h1 className='w-1/2 pl-[100px] text-left'>mmol/l</h1>
                </div>
                <div className="flex justify-evenly items-center text-black font-bold text-base text-[30px] pl-[60px] mb-5">
                    <h1 className='text-center'>{prevValue1}</h1>
                    <HiMiniArrowsUpDown className='text-[30px] font-[900]'/>
                </div>
            </div>

            {/* After comparison box */}
            <div className="w-1/2 mx-1 text-white text-sm rounded-xl shadow-xl">
                <h5 className='w-full text-center rounded-tl-xl rounded-tr-xl bg-[#4673FF] py-1'>
                    Latest: {currentTestDate}
                </h5>
                <div className="flex text-[#4673FF] font-bold text-base mt-3">
                    <h1 className='w-1/2 pl-[100px] text-left'>mmol/l</h1>
                </div>
                <div className="flex justify-evenly items-center text-black font-bold text-base text-[30px] pl-[60px] mb-5">
                    <h1 className='text-center'>{currentValue1}</h1>
                    {isHigherValue1 ? <IoArrowUpSharp className='text-[30px] font-[900]'/> : <MdArrowDownward className='text-[30px] font-[900]'/>}
                </div>
            </div>
        </div>
    );
}

export default Comparison;
