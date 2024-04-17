"use client"

import React, {useState, useEffect, useRef, forwardRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'
import { Line } from 'react-chartjs-2';
// import { Pie } from 'react-chartjs-2';
import { Radar } from 'react-chartjs-2';
import {Dates, Quota} from '@/lib/chartdata.js'
import jsPDF from 'jspdf';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);



import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";



import { TreeAnimation } from "@/components/treeAnimation"

import { MdDelete } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";
import { FaFileExport } from "react-icons/fa6";

export default function Home() {
  const initialMaterials = [
    { name: 'Aluminum', quantityGreen: 0, quantity: 0, emissionsCO2: 2, emissionsCO2Green: 1.5, price: 250, greenPrice: 250 },
    { name: 'Concrete', quantityGreen: 0, quantity: 0, emissionsCO2: 2, emissionsCO2Green: 1.5, price: 400, greenPrice: 400 },
    { name: 'Plastic', quantityGreen: 0, quantity: 0, emissionsCO2: 2, emissionsCO2Green: 1.5, price: 50, greenPrice: 50 },
    { name: 'Glass', quantityGreen: 0, quantity: 0, emissionsCO2: 2, emissionsCO2Green: 1.5, price: 120, greenPrice: 120 },
    { name: 'Timber', quantityGreen: 0, quantity: 0, emissionsCO2: 2, emissionsCO2Green: 1.5, price: 80, greenPrice: 80 },
    { name: 'Steel', quantityGreen: 0, quantity: 0, emissionsCO2: 2, emissionsCO2Green: 1.5, price: 300, greenPrice: 300 },
  ];

  const [data, setData] = useState(initialMaterials)
  const [history, setHistory] = useState([initialMaterials])

  const totalCO2 = 10000; 
  const CO2PerTreePerYear = 48; 
  const treesNeeded = 10; 

  const doughnutChartRef = useRef(null);

//   const downloadPDF = () => {
//     const pdf = new jsPDF('landscape');
// pdf.text("Hello World!", 10, 10);  // Just to test text addition
// pdf.save('test.pdf');

//     // if (doughnutChartRef.current) {
//     //   // Get the canvas
//     //   const canvas = doughnutChartRef.current.canvas;
  
//     //   // Set the dimensions for the PDF if needed (example: 280x150)
//     //   canvas.width = 280;
//     //   canvas.height = 150;
  
//     //   // Temporarily draw a background before exporting to an image
//     //   const ctx = canvas.getContext('2d');
//     //   // Save the current state before applying changes
//     //   ctx.save();
//     //   // Set a white background or any other non-transparent color
//     //   ctx.globalCompositeOperation = 'destination-over';
//     //   ctx.fillStyle = '#fff';  // White background or any color of choice
//     //   ctx.fillRect(0, 0, canvas.width, canvas.height);
  
//     //   // Convert canvas to image
//     //   const base64Image = canvas.toDataURL('image/jpeg', 1.0);
  
//     //   // Restore the canvas state if further operations are needed with it
//     //   ctx.restore();
  
//     //   // Generate PDF
//     //   const pdf = new jsPDF('landscape');
//     //   pdf.addImage(base64Image, 'JPEG', 10, 10, 280, 150);
//     //   pdf.save('download.pdf');
//     // } else {
//     //   console.error('Chart is not yet rendered.');
//     // }
//   };

  const downloadPDF = () => {
    if (doughnutChartRef.current) {
      // Here, we need to directly access the canvas as the instance structure might vary based on react-chartjs-2 version
      const base64Image = doughnutChartRef.current.toBase64Image('image/jpeg', 1);

      const pdf = new jsPDF('landscape');
      pdf.addImage(base64Image, 'JPEG', 10, 10, 280, 150);
      pdf.save('download.pdf');
    } else {
      console.error('Chart is not yet rendered.');
    }
  };



  // Code for 'Carbon quote Calculator'
  const calculateCarbonCost = (co2Emissions) => {
    const lastQuotaValue = parseFloat(Quota[Quota.length - 1]);
    return co2Emissions * lastQuotaValue;
  };

  const handleCarbonCalculation = (event) => {
    event.preventDefault();
    const co2Emissions = parseFloat(event.target.elements.co2Amount.value);
    const totalCost = calculateCarbonCost(co2Emissions);
    const lastQuotaValue = parseFloat(Quota[Quota.length - 1]);
    const resultsDiv = document.getElementById('calculationResults');
    resultsDiv.innerHTML = `
      <p>Total cost based on last CO2 price: ${totalCost.toFixed(2)} euros</p>
      <p>Used quota: ${lastQuotaValue.toFixed(2)}/kg CO2</p>
    `;
    //alert(`Total cost based on last CO2 price: $${totalCost.toFixed(2)}`);
  };

  

  function handleInputChange(materialName, field, newValue) {
    if (!newValue || newValue.match(/^\d*\.?\d*$/)) {
      setData(currentData =>
        currentData.map(material => {
          if (material.name === materialName) {
            return { ...material, [field]: Number(newValue) };
          }
          return material;
        })
      );
    }
  }

  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          setData(results.data);
        },
        header: true,
        skipEmptyLines: true
      });
    }
  };
    
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
      fileInputRef.current.click();
  };

  function updateHistory() {
    if(JSON.stringify(data) !== JSON.stringify(history[history.length - 1])) {
      setHistory(prevHistory => [...prevHistory, data])
    }
  }

  
  return (
    <main className="">
      <div className="border w-full h-16 flex justify-between items-center pr-20 pl-10">
        <h1 className=" font-bold">Carbon calculator</h1>
        <div className="flex gap-4">

        <Button variant="secondary" onClick={handleButtonClick}>
                Upload CSV <FaFileUpload size={16} className="ml-2"/>
            </Button>
            <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
      
          <Button variant="secondary" onClick={downloadPDF}>Export PDF <FaFileExport  size={16} className="ml-2"/></Button>
          <Button variant="destructive" onClick={() => {
            setHistory(prevHistory => [...prevHistory, initialMaterials])
            setData(initialMaterials)}}>Reset <MdDelete size={21} className="ml-2"/></Button>

        </div>
      </div>

    <div className="flex justify-center items-center w-full">
    <div className="w-10/12 mt-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Materials</TableHead>
            <TableHead>Quantity (kg)</TableHead>
            <TableHead>Quantity green (kg)</TableHead>
            <TableHead>CO2 emissions (kg)</TableHead>
            <TableHead>CO2 emissions green (kg)</TableHead>
            <TableHead>Price (Kr/kg)</TableHead>
            <TableHead>Green Price (Kr/kg)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {data.map(row => {
          return (
            <TableRow key={row.name}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell><Input onBlur={updateHistory} onChange={(e) => handleInputChange(row.name, 'quantity', e.target.value)} value={row.quantity}/></TableCell>
              <TableCell><Input onBlur={updateHistory} onChange={(e) => handleInputChange(row.name, 'quantityGreen', e.target.value)} value={row.quantityGreen}/></TableCell>
              <TableCell><Input onBlur={updateHistory} onChange={(e) => handleInputChange(row.name, 'emissionsCO2', e.target.value)} value={row.emissionsCO2}/></TableCell>
              <TableCell><Input onBlur={updateHistory} onChange={(e) => handleInputChange(row.name, 'emissionsCO2Green', e.target.value)} value={row.emissionsCO2Green}/></TableCell>
              <TableCell><Input onBlur={updateHistory} onChange={(e) => handleInputChange(row.name, 'price', e.target.value)} value={row.price}/></TableCell>
              <TableCell><Input onBlur={updateHistory} onChange={(e) => handleInputChange(row.name, 'greenPrice', e.target.value)} value={row.greenPrice}/></TableCell>
            </TableRow>
          );
        })}
        </TableBody>
      </Table>
      </div>
    </div>

    <div className="md:flex justify-center w-full gap-10">
      <AreaChartTwoAxis history={history}/>
      <PieChartCO2 data={data} ref={doughnutChartRef}/>
    </div>

    <TreeAnimation treesNeeded={treesNeeded} />


    <div className="flex justify-center">
      <RadarChartExample data={data}/>
    </div>



<div className="w-full flex justify-center items-center gap-20 mt-20">
  <div className="md:flex-1 w-full px-4">
  <p className='text-center font-bold mb-4'>EU Climate quota euros/tonne</p>
      <div className='w-full'>
      <QuotaChart />
      </div>
    </div>
  <div className="border w-4/12 rounded-md p-8">
      <h1>Carbon quote Calculator</h1>
      <form onSubmit={handleCarbonCalculation}>
            <Input
              type="number"
              name="co2Amount"
              placeholder="Enter total CO2 (kg)"
              className="input mb-4"
            />
            <Button type="submit" className="button">Calculate Cost</Button>
          </form>    
          <div id="calculationResults"></div>  
  </div>
</div>


    </main>
  );
}







const PieChartCO2 = forwardRef(({ data }, doughnutChartRef) => {
  const labels = data.map(material => material.name);
  const totalCO2Data = data.map(material => material.quantity * material.emissionsCO2 + material.quantityGreen * material.emissionsCO2Green);
  const regularCO2Data = data.map(material => material.quantity * material.emissionsCO2);
  const greenCO2Data = data.map(material => material.quantityGreen * material.emissionsCO2Green);
  
  const outerColors = [
    'rgba(255, 99, 132, 0.7)',   // Red
    'rgba(54, 162, 235, 0.7)',   // Blue
    'rgba(255, 206, 86, 0.7)',   // Yellow
    'rgba(75, 192, 192, 0.7)',   // Green
    'rgba(153, 102, 255, 0.7)',  // Purple
    'rgba(255, 159, 64, 0.7)'    // Orange
  ];

  const innerColors = [
    'rgba(60, 153, 153, 0.7)',
    'rgba(90, 230, 230, 0.7)',
    'rgba(122, 81, 204, 0.7)',
    'rgba(183, 122, 255, 0.7)',
    'rgba(204, 127, 51, 0.7)',
    'rgba(255, 190, 76, 0.7)',
    'rgba(204, 79, 105, 0.7)',
    'rgba(255, 118, 158, 0.7)',
    'rgba(43, 129, 188, 0.7)',
    'rgba(64, 194, 255, 0.7)',
    'rgba(204, 164, 68, 0.7)',
    'rgba(255, 247, 103, 0.7)']


  const innerData = [];
  const innerLabels = []; 
  totalCO2Data.forEach((total, i) => {
    if (total > 0) { 
      innerData.push(regularCO2Data[i]); 
      innerData.push(greenCO2Data[i]); 
      innerLabels.push(`${labels[i]} (Regular)`);
      innerLabels.push(`${labels[i]} (Green)`);
    }
  });

  const chartData = {
    labels: [...labels, ...innerLabels], 
    datasets: [
      {
        label: 'Total CO2 Emissions',
        data: [...totalCO2Data], 
        backgroundColor: outerColors.slice(0, labels.length), 
        borderColor: outerColors.slice(0, labels.length).map(color => color.replace('0.7', '1')),
        borderWidth: 1
      },
      {
        label: 'Detailed CO2 Emissions',
        data: Array(totalCO2Data.length).fill(0).concat(innerData), 
        backgroundColor: innerColors,
        borderColor: innerColors,
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          generateLabels: function(chart) {
            const data = chart.data;
            return data.labels
              .map((label, i) => {
                const meta = chart.getDatasetMeta(0); 
                const totalEmissionsValue = data.datasets[0].data[i]; 
  

                if (totalEmissionsValue > 0) {
                  const style = meta.controller.getStyle(i);
                  return {
                    text: label, 
                    fillStyle: style.backgroundColor,
                    strokeStyle: style.borderColor,
                    lineWidth: style.borderWidth,
                    hidden: !chart.getDataVisibility(i),
                    index: i
                  };
                }
                return null; 
              })
              .filter(item => item !== null); 
          }
        }
      },
      background: {
        color: 'white', // This sets a background color which helps in PDF export
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
  
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed + ' kg CO2';
            }
            return label;
          }
        }
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      // onComplete: () => {
      //   const chartInstance = doughnutChartRef.current.chartInstance;
      //   const ctx = chartInstance.ctx;
      //   ctx.save();
      //   ctx.globalCompositeOperation = 'destination-over';
      //   ctx.fillStyle = 'white';  // set background color
      //   ctx.fillRect(0, 0, chartInstance.width, chartInstance.height);
      //   ctx.restore();
      // }
    }
  };
  

  // const options = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: 'top',
  //       labels: {
  //         generateLabels: function(chart) {
  //           const data = chart.data;
  //           const innerDataIndexStart = data.labels.findIndex(label => label.includes('(Regular)'));
  //           return chart.data.labels.slice(0, innerDataIndexStart).map((label, i) => {
  //             const meta = chart.getDatasetMeta(0);
  //             const style = meta.controller.getStyle(i);
              
  //             return {
  //               text: label, 
  //               fillStyle: style.backgroundColor,
  //               strokeStyle: style.borderColor,
  //               lineWidth: style.borderWidth,
  //               hidden: !chart.getDataVisibility(i),
  //               index: i
  //             };
  //           });
  //         }
  //       },
  //       onClick: (e, legendItem, legend) => {
  //         //needed?
  //       }
  //     }
  //   },
  //   animation: {
  //     animateScale: true,
  //     animateRotate: true
  //   }
  // };
  

  // const options = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: 'top',
  //       onClick: (e, legendItem, legend) => {
  //         const index = legendItem.datasetIndex;
  //         const chart = legend.chart;
  //         if (index === 1) {  
  //           chart.getDatasetMeta(index).hidden = !chart.getDatasetMeta(index).hidden;
  //           chart.update();
  //         }
  //       }
  //     }
  //   },
  //   animation: {
  //     animateScale: true,
  //     animateRotate: true
  //   }
  // };

  return (<>
  {totalCO2Data.every(element => element === 0) ? <div className="rounded-full bg-slate-100 w-3/12 aspect-square flex justify-center items-center"><p>No Data</p></div> :
  <div className="w-3/12"><Doughnut data={chartData} options={options} ref={doughnutChartRef} /></div>}
  </>);
});




// const PieChartCO2 = ({ data }) => {
//   const originalData = [];
//   const labels = []

//   data.forEach(material => {
//     originalData.push(material.quantity*material.emissionsCO2 + material.quantityGreen*material.emissionsCO2Green)
//     labels.push(material.name)
//   })

//   const outerDataMultiplier = [0.4, 0.6]; 

//   const innerData = originalData;

//   const outerData = originalData.flatMap((d, index) => 
//      outerDataMultiplier.map(m => d * m) // Adjust visibility based on state
//   );

//   const dataPie = {
//     labels,
//     datasets: [
//       {
//         label: 'CO2 Data Inner',
//         data: innerData,
//         backgroundColor: [
//           'rgba(255, 99, 132, 0.2)',
//           'rgba(54, 162, 235, 0.2)',
//           'rgba(255, 206, 86, 0.2)'
//         ],
//         borderColor: [
//           'rgba(255, 99, 132, 1)',
//           'rgba(54, 162, 235, 1)',
//           'rgba(255, 206, 86, 1)'
//         ],
//         borderWidth: 1,
//         weight: 0.5
//       },
//       {
//         label: 'CO2 Data Outer',
//         data: outerData,
//         backgroundColor: [
//           'rgba(255, 99, 132, 0.5)',
//           'rgba(255, 99, 132, 0.7)',
//           'rgba(54, 162, 235, 0.5)',
//           'rgba(54, 162, 235, 0.7)',
//           'rgba(255, 206, 86, 0.5)',
//           'rgba(255, 206, 86, 0.7)'
//         ],
//         borderColor: [
//           'rgba(255, 99, 132, 1)',
//           'rgba(255, 99, 132, 1)',
//           'rgba(54, 162, 235, 1)',
//           'rgba(54, 162, 235, 1)',
//           'rgba(255, 206, 86, 1)',
//           'rgba(255, 206, 86, 1)'
//         ],
//         borderWidth: 1,
//         weight: 0.5
//       }
//     ]
//   };

//   const options = {
//     plugins: {
//       legend: {
//         onClick: (e, legendItem, legend) => {
//           // Here you would typically toggle the visibility of the dataset
//           const index = legendItem.datasetIndex;
//           const chart = legend.chart;

//           // If clicking on outerData's legend, toggle its visibility
//           if (index === 1) { // Assuming outerData is always the second dataset
//             chart.getDatasetMeta(index).hidden = !chart.getDatasetMeta(index).hidden;
//             chart.update();
//           }
//         }
//       }
//     }
//   };

//   return <div className="w-3/12"><Doughnut data={dataPie} options={options} /></div>;
// };


function AreaChartTwoAxis({ history }) {
  let tempArr = [...history]
  let dataCost = []
  let dataCO2 = []
  tempArr.forEach(data => {
    let CO2Totatl = 0;
    let CashTotatl = 0;
    data.forEach(ele => {
      CO2Totatl += ele.emissionsCO2Green * ele.quantityGreen + ele.emissionsCO2 * ele.quantity
      CashTotatl += ele.price * ele.quantity + ele.greenPrice * ele.quantityGreen
    })
    dataCost.push(CashTotatl)
    dataCO2.push(CO2Totatl)
  });


  const data = {
    labels: history.map((_, index) => `V ${index + 1}`),
    datasets: [
      {
        label: 'Cost',
        data: dataCost, 
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y',
        fill: true,
        tension: 0.4
      },
      {
        label: 'CO2',
        data: dataCO2, 
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y1',
        fill: true,
        tension: 0.4
      },
    ],
  };

  const options = {
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Monthly Analysis of Cost and CO2',
        font: {
          size: 20
        },
        padding: {
          top: 20,
          bottom: 10
        }
      },
      legend: {
        display: true,
        position: 'top',
      }
    }
  };


  return <div className="w-6/12"><Line data={data} options={options} /></div>;
}


// const RadarChartExample = ({data}) => {
//   // Data for the chart
//   const labels = data.map(material => material.name);

//   const dataRadar = {
//     labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
//     datasets: [
//       {
//         label: 'Person A',
//         data: [65, 59, 90, 81, 56, 55, 40],
//         fill: true,
//         backgroundColor: 'rgba(255, 99, 132, 0.2)',
//         borderColor: 'rgb(255, 99, 132)',
//         pointBackgroundColor: 'rgb(255, 99, 132)',
//         pointBorderColor: '#fff',
//         pointHoverBackgroundColor: '#fff',
//         pointHoverBorderColor: 'rgb(255, 99, 132)'
//       }
//     ]
//   };

//   // Configuration options
//   const options = {
//     elements: {
//       line: {
//         borderWidth: 3
//       }
//     },
//     scales: {
//       r: {
//         angleLines: {
//           display: false
//         },
//         suggestedMin: 0,
//         suggestedMax: 100
//       }
//     }
//   };

//   return (
//     <div>
//       <h2>My Radar Chart</h2>
//       <Radar data={dataRadar} options={options} />
//     </div>
//   );
// };

const RadarChartExample = ({data}) => {

  const calculateRatios = (data) => {
    return data.map(material => {
      const regularRatio = material.quantity > 0 ? ( material.price / material.emissionsCO2).toFixed(4) : 0;
      const greenRatio = material.quantityGreen > 0 ? ( material.greenPrice / material.emissionsCO2Green).toFixed(4) : 0;
      return {
        name: material.name,
        regularRatio,
        greenRatio
      };
    });
  };
  

  const ratioData = calculateRatios(data);
  const labels = ratioData.map(material => material.name);
  const regularData = ratioData.map(material => Number(material.regularRatio));
  const greenData = ratioData.map(material => Number(material.greenRatio));


  const dataRadar = {
    labels,
    datasets: [
      {
        label: 'Regular Material Cost/CO2 Ratio',
        data: regularData,
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
      },
      {
        label: 'Green Material Cost/CO2 Ratio',
        data: greenData,
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        pointBackgroundColor: 'rgb(75, 192, 192)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(75, 192, 192)'
      }
    ]
  };


  const options = {
    elements: {
      line: {
        borderWidth: 3
      }
    },
    scales: {
      r: {
        angleLines: {
          display: false
        },
        suggestedMin: 0,
        suggestedMax: Math.max(...regularData.concat(greenData)) 
      }
    }
  };

  return (
    <div className="w-7/12 flex justify-center flex-col items-center">
      <h2 className="text-xl font-bold">Cost Efficiency and CO2 Emissions Ratio</h2>
      <Radar data={dataRadar} options={options} />
    </div>
  );
};


const QuotaChart = () => {
  const dates = Dates; 
  const quota = Quota.map(q => parseFloat(q));

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Climate Quota',
        data: quota,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        pointRadius: 0, 
        borderWidth: 2 
      }
    ]
  };

  const options = {
    scales: {
      x: {
        type: 'category', 
        ticks: {
          autoSkip: true,
          maxTicksLimit: 20 // Adjust based on your preference
        }
      },
      y: {
        beginAtZero: false
      }
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Line data={data} options={options} />
    </div>
  );
};



/*
const QuotaChart = () => {
  const data = {
    labels: Dates,
    datasets: [
      {
        label: 'Climate Quota',
        data: Quota.map(q => parseFloat(q)), // Ensure numbers are parsed correctly
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      }
    ]
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'yyyy-MM-dd'
        },
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Quota'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Line data={data} options={options} />
    </div>
  );
};
*/




