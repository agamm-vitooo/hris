import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const UserChart = ({ users }) => {
  const [chartData, setChartData] = useState([]);

  // Process data for chart
  useEffect(() => {
    if (users.length > 0) {
      const departmentCount = users.reduce((acc, user) => {
        const { department } = user;
        if (department) {
          acc[department] = acc[department] ? acc[department] + 1 : 1;
        }
        return acc;
      }, {});

      const chartArray = Object.keys(departmentCount).map((department) => ({
        name: department,
        y: departmentCount[department],
      }));

      setChartData(chartArray);
    }
  }, [users]);

  const chartOptions = {
    chart: {
      type: 'column',
      backgroundColor: '#f8fafc',
      borderRadius: 8,
      style: {
        fontFamily: 'Arial, sans-serif',
      },
    },
    title: {
      text: 'Users per Department',
      style: {
        color: '#333',
        fontSize: '18px',
      },
    },
    xAxis: {
      type: 'category',
      labels: {
        style: {
          color: '#666',
          fontSize: '12px',
        },
      },
    },
    yAxis: {
      title: {
        text: 'Number of Users',
        style: {
          color: '#666',
          fontWeight: 'bold',
        },
      },
      gridLineColor: '#ddd',
    },
    tooltip: {
      headerFormat: '<span style="font-size:14px">{point.key}</span><br>',
      pointFormat: '<b>{point.y}</b> users',
      backgroundColor: '#ffffff',
      borderColor: '#bbb',
      shadow: true,
      style: {
        color: '#333',
        fontSize: '12px',
      },
    },
    plotOptions: {
      column: {
        borderRadius: 5,
        dataLabels: {
          enabled: true,
          style: {
            color: '#000',
            fontWeight: 'bold',
          },
        },
        states: {
          hover: {
            brightness: -0.1,
          },
        },
      },
      series: {
        animation: {
          duration: 1500,
        },
      },
    },
    series: [
      {
        name: 'Department',
        data: chartData,
        colorByPoint: true, // Automatically assign colors
        colors: ['#4caf50', '#2196f3', '#ff5722', '#9c27b0', '#ffeb3b'], // Custom palette
      },
    ],
    credits: {
      enabled: false,
    },
  };

  return (
    <HighchartsReact highcharts={Highcharts} options={chartOptions} />
  );
};

export default UserChart;
