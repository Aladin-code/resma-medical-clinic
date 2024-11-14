import React, { useState, useEffect } from 'react';

function LatestLab({ labResults, selectedTestType, onUpdate }) {
    const [latestTests, setLatestTests] = useState([]);
    const [testUnit, setUnit] = useState(null);

    const formatDate = (bigIntDate) => {
        const timestamp = Number(bigIntDate);  // Convert BigInt to Number
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(timestamp).toLocaleDateString('en-US', options);
    };

    useEffect(() => {
        if (labResults && selectedTestType) {
            // Filter the data based on the selected test type
            const filteredData = labResults.filter(result =>
                result.test.testName.toLowerCase() === selectedTestType.toLowerCase()
            );

            // Get the latest 6 results by slicing the filtered data (no sorting)
            const latest6Tests = filteredData.slice(-6); 

            // Update the state with the latest 6 results
            setLatestTests(latest6Tests);

            // Set the unit if the filtered data is not empty
            if (latest6Tests.length > 0) {
                setUnit(latest6Tests[0].test.result[0].unit);
            }

            // Prepare data to send back to the parent component
            const data = latest6Tests.map(result => ({
                date: result.test.date,
                value1: result.test.result[0].value,
            }));

            // Only call onUpdate if filtered data has changed
            if (onUpdate && data.length > 0) {
                onUpdate(data);
            }
        }
    }, [labResults, selectedTestType, onUpdate]);

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
            <table className='w-full text-sm text-center border'>
                <thead>
                    <tr className='text-base text-[#4673FF] border-b border-slate'>
                        <th className='w-1/3 p-1'>Date <span className="text-sm">(Earliest to Latest)</span></th>
                        <th className='w-1/3 p-1'>Result</th>
                        <th className='w-1/3 p-1'>Unit</th>
                    </tr>
                </thead>
                <tbody>
                    {latestTests.map((test, index) => (
                        <tr key={index} className='border-b border-slate'>
                            <td className='p-1'>
                                {formatDate(test.test.date)}
                            </td>
                            <td>{test.test.result[0].value}</td>
                            <td>{test.test.result[0].unit}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default LatestLab;
