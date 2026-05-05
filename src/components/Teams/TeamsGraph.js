import React from 'react';
import Chart from 'react-apexcharts';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const TeamsGraph = ({ dataList }) => {
    if (!dataList || dataList.length === 0) {
        return <p>No data available</p>;
    }

    // Get the range of years from data (min and max)
    const minYear = Math.min(...dataList.map(d => d.year));
    const maxYear = Math.max(...dataList.map(d => d.year));

    // Build full list of months for all years between minYear and maxYear (inclusive)
    const fullMonths = [];
    for (let year = minYear; year <= maxYear; year++) {
        for (let month = 1; month <= 12; month++) {
            fullMonths.push({ year, month });
        }
    }

    // Build a map 'year-month' => totalPotential
    const dataMap = {};
    dataList.forEach(({ year, month, totalPotential }) => {
        const key = `${year}-${month}`;
        dataMap[key] = (dataMap[key] || 0) + (totalPotential || 0);
    });

    // Prepare x-axis categories: just month names (ignoring year here)
    // If data spans multiple years, this will repeat month names. You can adjust if needed.
    const categories = fullMonths.map(({ month }) => monthNames[month - 1]);

    // Prepare y-axis data
    const potentials = fullMonths.map(({ year, month }) => {
        const key = `${year}-${month}`;
        return dataMap[key] || 0;
    });

    const maxPotential = Math.max(...potentials, 0);
    const yAxisMax = maxPotential === 0 ? 10 : maxPotential + 10;

    const series = [
        {
            name: "Total Potential",
            data: potentials,
        },
    ];

    const options = {
        chart: {
            type: "bar",
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                endingShape: "rounded",
                columnWidth: "50%",
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => val.toFixed(2),
        },
        colors: ["#4ea396"],
        xaxis: {
            categories,
            labels: {
                rotate: -45,
                style: {
                    fontSize: "12px",
                },
            },
        },
        yaxis: {
            min: 0,          // <-- This forces y-axis to start at zero
            max: yAxisMax,
            labels: {
                formatter: (val) => val.toFixed(0),
            },
            title: {
                text: "Potential",
            },
        },
        tooltip: {
            enabled: true,
            y: {
                formatter: (val) => `${val.toFixed(2)}`,
            },
        },
    };


    return <Chart options={options} series={series} type="bar" height={350} style={{ width: "100%" }} />;
};

export default TeamsGraph;
