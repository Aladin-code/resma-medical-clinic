import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

function ApexChart(props) {
    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: {
                height: 350,
                type: 'line',
            },
            title: {
                text: "", // Dynamic title based on filtered test name
                align: 'left',
                style: {
                    color: '#4673FF',
                },
            },
            xaxis: {
                categories: [], // Dates will be populated later
            },
            colors: ['#4673FF', '#FF4560', '#FFC107', '#008FFB'], // Add more colors if needed
            stroke: {
                curve: 'smooth', // Smooth curve for line chart
            },
            markers: {
                size: 4, // Customize marker size
            },
        },
    });

    // Function to process and group data by unit
    const processDataByUnit = (filteredData) => {
        const unitData = {};

        filteredData.forEach(result => {
            const { date, result: results } = result.test; // Destructure for clarity

            const parsedDate = Number(date);
            const newdate = new Date(parsedDate);
            const formattedDate = newdate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              });
            results.forEach(res => {
                const unit = res.unit;
                const parsedValue = parseFloat(res.value); // Parse the value to float
                if (!isNaN(parsedValue)) {
                    if (!unitData[unit]) {
                        unitData[unit] = { dates: [], values: [] };
                    }
                    unitData[unit].dates.push(formattedDate);
                    unitData[unit].values.push(parsedValue);
                }
            });
        });

        return unitData;
    };

    // Effect to update chart data when props change
    useEffect(() => {
        // Filter results for the specific test name provided in props
        const filteredData = props.lab_results.filter(result =>
            result.test.testName.toLowerCase() === props.test.toLowerCase() // Exact match for test name
        );

        // If no filtered data, show a warning
        if (filteredData.length === 0) {
            console.warn('No matching results found for the specified test.');
            setChartData(prevChartData => ({
                ...prevChartData,
                options: {
                    ...prevChartData.options,
                    title: {
                        text: 'No Data Available', // Set title when no data is available
                    },
                },
            }));
            return; // Exit early if no data
        }

        const unitData = processDataByUnit(filteredData);
        const series = Object.keys(unitData).map(unit => ({
            name: unit,
            data: unitData[unit].values,
        }));

        // Get the dates from the first unit (if exists)
        const dates = Object.values(unitData).length > 0 ? unitData[Object.keys(unitData)[0]].dates : [];
        
        // Set the chart data with dynamic title
        setChartData(prevChartData => ({
            series: series.length > 0 ? series : [{ name: 'No Data', data: [0] }],
            options: {
                ...prevChartData.options,
                title: {
                    text: props.test, // Set the title based on the filtered test name
                },
                xaxis: {
                    categories: dates.length > 0 ? dates : ['No Data'], // Fallback if no dates
                },
            },
        }));
    }, [props.lab_results, props.test]);

    return (
        <div className="chart">
            {chartData.series.length > 0 ? ( // Only render chart if there's data
                <Chart options={chartData.options} series={chartData.series} type="line" height={350} />
            ) : (
                <div>No data available for this test.</div> // Message if no data
            )}
        </div>
    );
}

export default ApexChart;
