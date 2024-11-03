import React, { useState, useEffect } from 'react';

function LatestLab({ labResults, selectedTestType, onUpdate }) {
    const [latestTests, setLatestTests] = useState([]);

    useEffect(() => {
        if (labResults && selectedTestType) {
            // Filter the data based on the selected test type
            const filteredData = labResults.filter(result =>
                result.test.testName.toLowerCase() === selectedTestType.toLowerCase()
            );

            // Update the state with filtered results
            setLatestTests(filteredData);

            // Prepare data to send back to the parent component
            const data = filteredData.map(result => ({
                date: result.test.date,
                value1: result.test.result[0].value,
                value2: result.test.result[1].value,
            }));

            // Only call onUpdate if filtered data has changed
            if (onUpdate && data.length > 0) {
                onUpdate(data);
            }
        }
    }, [labResults, selectedTestType, onUpdate]); // Depend on labResults, selectedTestType, and onUpdate

    if (latestTests.length === 0) {
        return (
            <div className='w-full flex justify-center items-center h-full text-sm text-center text-[#D3D3D3]'>
                No data available for the selected test.
            </div>
        );
    }

    return (
        <div>
            <h3 className='w-full py-1 bg-[#4673FF] text-center text-base font-semibold text-white rounded-tl-xl rounded-tr-xl'>
                HISTORY
            </h3>
            <table className='w-full text-sm text-center'>
                <thead>
                    <tr className='text-base text-[#4673FF] border-b border-slate'>
                        <th className='w-1/3 p-1'>Date</th>
                        <th>mmol/l</th>
                        <th>mg/dl</th>
                    </tr>
                </thead>
                <tbody>
                    {latestTests.map((test, index) => (
                        <tr key={index} className='border-b border-slate'>
                            <td className='p-1'>{test.test.date}</td>
                            <td>{test.test.result[0].value}</td>
                            <td>{test.test.result[1].value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default LatestLab;
