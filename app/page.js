"use client"

// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'
// ChartJS.register(ArcElement, Tooltip, Legend);
import { Line } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import React, {useState, useEffect, useRef} from "react";

import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


export default function Home() {
  const initialMaterials = [
    { name: 'Aluminum', quantityGreen: 0, quantity: 0, emissionsCO2: 2, emissionsCO2Green: 1.5, price: 250 },
    { name: 'Concrete', quantityGreen: 0, quantity: 0, emissionsCO2: 2, emissionsCO2Green: 1.5, price: 400 },
    { name: 'Plastic', quantityGreen: 0, quantity: 0, emissionsCO2: 2, emissionsCO2Green: 1.5, price: 50 },
    { name: 'Glass', quantityGreen: 0, quantity: 0, emissionsCO2: 2, emissionsCO2Green: 1.5, price: 120 },
    { name: 'Timber', quantityGreen: 0, quantity: 0, emissionsCO2: 2, emissionsCO2Green: 1.5, price: 80 },
    { name: 'Steel', quantityGreen: 0, quantity: 0, emissionsCO2: 2, emissionsCO2Green: 1.5, price: 300 },
  ];

  const [data, setData] = useState(initialMaterials)
  const [history, setHistory] = useState([initialMaterials])

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

    
    
  
  return (
    <main className="">
      <div className="border w-full h-16 flex justify-between items-center pr-20 pl-10">
        <h1 className=" font-bold">Carbon calculator</h1>
        <div className="flex gap-4">
          {/* <p>s</p>
          <p>s</p>
          <p>s</p> */}
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
          </TableRow>
        </TableHeader>
        <TableBody>
        {data.map(row => {
          return (
            <TableRow key={row.name}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell><Input onBlur={() => setHistory(prevHistory => [...prevHistory, data])} onChange={(e) => handleInputChange(row.name, 'quantity', e.target.value)} value={row.quantity}/></TableCell>
              <TableCell><Input onBlur={() => setHistory(prevHistory => [...prevHistory, data])} onChange={(e) => handleInputChange(row.name, 'quantityGreen', e.target.value)} value={row.quantityGreen}/></TableCell>
              <TableCell><Input onBlur={() => setHistory(prevHistory => [...prevHistory, data])} onChange={(e) => handleInputChange(row.name, 'emissionsCO2', e.target.value)} value={row.emissionsCO2}/></TableCell>
              <TableCell><Input onBlur={() => setHistory(prevHistory => [...prevHistory, data])} onChange={(e) => handleInputChange(row.name, 'emissionsCO2Green', e.target.value)} value={row.emissionsCO2Green}/></TableCell>
              <TableCell><Input onBlur={() => setHistory(prevHistory => [...prevHistory, data])} onChange={(e) => handleInputChange(row.name, 'price', e.target.value)} value={row.price}/></TableCell>
            </TableRow>
          );
        })}
        </TableBody>
      </Table>
      </div>
    </div>

    <div className="md:flex justify-center md:h-[750px] w-full xl:gap-20 ">
      <AreaChartTwoAxis data={data}/>
      <PieChartCO2 />
    </div>




    </main>
  );
}






const MaterialsForm = () => {
  const [materials, setMaterials] = useState(initialMaterials);

  const handleInputChange = (index, field, value) => {
    const newMaterials = [...materials];
    newMaterials[index][field] = value;
    setMaterials(newMaterials);
  };

  const handleSubmit = () => {
    // Handle the form submission, likely updating the chart data
    console.log('Form data:', materials);
  };

  return (
    <div>
      <table className="min-w-full">
        <thead>
          <tr>
            <th>Materials</th>
            <th>Quantity Green</th>
            <th>Quantity</th>
            <th>Emissions CO2</th>
            <th>Emissions CO2 Green</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material, index) => (
            <tr key={material.name}>
              <td>{material.name}</td>
              <td>
                <input
                  type="number"
                  value={material.quantityGreen}
                  onChange={(e) => handleInputChange(index, 'quantityGreen', e.target.value)}
                  className="border p-1"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={material.quantity}
                  onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                  className="border p-1"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={material.emissionsCO2}
                  onChange={(e) => handleInputChange(index, 'emissionsCO2', e.target.value)}
                  className="border p-1"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={material.emissionsCO2Green}
                  onChange={(e) => handleInputChange(index, 'emissionsCO2Green', e.target.value)}
                  className="border p-1"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={material.price}
                  onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                  className="border p-1"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Material
      </button>
    </div>
  );
};



const PieChartCO2 = () => {
  const originalData = [10, 20, 30]; 
  const labels = ['M1', 'M2', 'M3'];

  // Initially, all datasets are visible
  // const [outerDataVisibility, setOuterDataVisibility] = useState([true, true, true]);

  const outerDataMultiplier = [0.4, 0.6]; 

  const innerData = originalData;

  const outerData = originalData.flatMap((d, index) => 
     outerDataMultiplier.map(m => d * m) // Adjust visibility based on state
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'CO2 Data Inner',
        data: innerData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1,
        weight: 0.5
      },
      {
        label: 'CO2 Data Outer',
        data: outerData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(255, 206, 86, 0.7)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1,
        weight: 0.5
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        onClick: (e, legendItem, legend) => {
          // Here you would typically toggle the visibility of the dataset
          const index = legendItem.datasetIndex;
          const chart = legend.chart;

          // If clicking on outerData's legend, toggle its visibility
          if (index === 1) { // Assuming outerData is always the second dataset
            chart.getDatasetMeta(index).hidden = !chart.getDatasetMeta(index).hidden;
            chart.update();
          }
        }
      }
    }
  };

  return <div className="w-3/12"><Doughnut data={data} options={options} /></div>;
};




function AreaChartTwoAxis({ data }) {
  const [allChanges, setAllChanges] = useState([]);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Cost',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y-cost',
      },
      {
        label: 'CO2',
        data: [],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y-co2',
      },
    ]
  });

  useEffect(() => {
    let newDataCost = 0;
    let newDataCO2 = 0;


    data.forEach(material => {
      newDataCO2 += material.quantity * material.emissionsCO2 + material.quantityGreen * material.emissionsCO2Green;
      newDataCost += material.quantity * material.price + material.quantityGreen * material.price;
    });


    setAllChanges(prevAllChanges => [...prevAllChanges, { newDataCost, newDataCO2 }]);

  }, [data]); 

  useEffect(() => {
    setChartData({
      labels: allChanges.map((_, index) => `V ${index + 1}`),
      datasets: [
        {
          label: 'Cost',
          data: allChanges.map(change => change.newDataCost),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          yAxisID: 'y-cost',
          fill: true,
        },
        {
          label: 'CO2',
          data: allChanges.map(change => change.newDataCO2),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          yAxisID: 'y-co2',
          fill: true,
        },
      ],
    });
  }, [allChanges]);

  const options = {
    scales: {
      'y-cost': {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
      },
      'y-co2': {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        grid: {
          drawOnChartArea: false, 
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Analysis of Cost and CO2 emissions',
        font: {
          size: 20
        },
        padding: {
          top: 20,
          bottom: 30
        }
      },
      legend: {
        display: true,
        position: 'top',
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return <div className="w-6/12"><Line data={chartData} options={options} /></div>;
}




