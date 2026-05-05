import React from 'react';
import Chart from 'react-apexcharts';

const Graph = ({ dataList }) => {
    const categories = ['Personal', 'Business', 'Charity', 'Medical'];

    const counts = categories.map(
        (cat) => dataList.filter((trip) => trip?.category?.name === cat).length
    );

    const series = [
        {
            name: 'Trips Count',
            data: counts,
        },
    ];

    // Find max count or default to 5 if all counts are zero
    const maxCount = Math.max(...counts, 0);
    const xaxisMax = maxCount === 0 ? 5 : maxCount;

    const options = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                endingShape: 'rounded',
                columnWidth: '20%',
            },
        },
        dataLabels: {
            enabled: true,
            formatter: val => val,
        },
        colors: ['#4ea396'],
        xaxis: {
            categories: categories,
            min: 0,
            max: xaxisMax + 1,
            type: 'category',
            tickAmount: xaxisMax + 1,
            labels: {
                show: true,
            },
        },
        yaxis: {
            type: 'numeric',
            labels: {
                show: true,
            },
        },
        tooltip: {
            enabled: true,
            y: {
                formatter: val => `${val} Trips`,
            },
        },
    };

    return <Chart options={options} series={series} type="bar" height={350} style={{ width: '100%' }} />;
};

export default Graph;
