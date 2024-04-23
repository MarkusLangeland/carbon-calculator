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
import 'jspdf-autotable';  
import moment from 'moment';
import 'chartjs-adapter-moment';

import { IoLeaf } from "react-icons/io5";

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
import { Separator } from "@/components/ui/separator"


import { TreeAnimation } from "@/components/treeAnimation"

import { MdDelete } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";
import { FaFileExport } from "react-icons/fa6";

export default function Home() {
  const initialMaterials = [
    { name: 'Aluminum', quantityGreen: 0, quantity: 0, emissionsCO2: 2, emissionsCO2Green: 1.5, price: 250, greenPrice: 500 },
    { name: 'Concrete', quantityGreen: 0, quantity: 0, emissionsCO2: 2, emissionsCO2Green: 1.5, price: 400, greenPrice: 800 },
    { name: 'Plastic', quantityGreen: 0, quantity: 0, emissionsCO2: 2, emissionsCO2Green: 1.5, price: 50, greenPrice: 100 },
    { name: 'Glass', quantityGreen: 0, quantity: 0, emissionsCO2: 2, emissionsCO2Green: 1.5, price: 120, greenPrice: 240 },
    { name: 'Timber', quantityGreen: 0, quantity: 0, emissionsCO2: 2, emissionsCO2Green: 1.5, price: 80, greenPrice: 160 },
    { name: 'Steel', quantityGreen: 0, quantity: 0, emissionsCO2: 2, emissionsCO2Green: 1.5, price: 300, greenPrice: 600 },
  ];

  const [data, setData] = useState(initialMaterials)
  const [history, setHistory] = useState([initialMaterials])

  const totalCO2 = 10000; 
  const CO2PerTreePerYear = 48; 
  const treesNeeded = 100; 

  const doughnutChartRef = useRef(null);
  const analysisChartRef = useRef(null);
  const polarChartRef = useRef(null);
  const quotaChartRef = useRef(null);

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

const [windowWidth, setWindowWidth] = useState(undefined);

useEffect(() => {
  // Ensure window is defined (i.e., running in the browser)
  if (typeof window !== 'undefined') {
    // Set initial width
    setWindowWidth(window.innerWidth);

    // Handle resize events
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }
}, []);

const prepareTableData = (data) => {
  return data.map(material => {
    const totalMoneySpent = (material.quantity*material.price) + (material.quantityGreen*material.greenPrice)
    return [
      material.name,
      material.emissionsCO2.toFixed(2),
      material.emissionsCO2Green.toFixed(2),
      material.price.toFixed(2),
      material.greenPrice.toFixed(2),
      totalMoneySpent.toFixed(2),
    ];
  });
}

const addTable = (data, pdf, startY) => {
  const headers = [["Material", "CO2 (kg)", "Green CO2 (kg)", "Price (kr)", "Green Price (kr)", "Total Cost (kr)"]];

  const body = prepareTableData(data);

  pdf.autoTable({
    head: headers,
    body: body,
    startY: startY,
    styles: { font: "Times-Roman", fontSize: 10 },
    theme: 'grid',
    headStyles: { fillColor: [221, 222, 226], textColor: [78, 53, 73], fontStyle: 'bold' },
    columnStyles: { 0: { cellWidth: 35 }, 1: { cellWidth: 25 }, 2: { cellWidth: 25 }, 3: { cellWidth: 25 }, 4: { cellWidth: 25 }, 5: { cellWidth: 30 } },
    margin: {left: 20},
    didDrawPage: function (data) {
      startY = data.cursor.y; // Update startY for the next possible content
    }
  });

  // Add extra space below the table
  const spaceBelowTable = 20; // Adjust this value as needed
  startY += spaceBelowTable;

  return startY; // Return the updated startY for further use
}

const prepareTableDatas = (data) => {
  return data.map(material => {
    const totalRegularCost = material.quantity * material.price;
    const totalGreenCost = material.quantityGreen * material.greenPrice;
    const totalCost = totalRegularCost + totalGreenCost;
    const regularPercentage = totalRegularCost / totalCost * 100;
    const greenPercentage = totalGreenCost / totalCost * 100;
    const hypotheticalGreenCost = material.quantity * material.greenPrice; // Find total cost if regular materials are switched to green
    const priceToGoAllGreen = hypotheticalGreenCost - totalRegularCost; // Subtract total cost if the materials were regular to get gap

    return [
      material.name,
      material.quantity.toFixed(2),
      material.quantityGreen.toFixed(2),
      material.price.toFixed(2),
      material.greenPrice.toFixed(2),
      regularPercentage.toFixed(2) + '%',
      greenPercentage.toFixed(2) + '%',
      priceToGoAllGreen.toFixed(2)
    ];
  });
}

const addNewTable = (data, pdf, startY) => {
  const headers = [["Material", "Qty Regular", "Qty Green", "Price (kr)", "Green Price (kr)", "Regular %", "Green %", "Price to Go Green (kr)"]];

  const body = prepareTableDatas(data);

  pdf.autoTable({
    head: headers,
    body: body,
    startY: startY,
    styles: { font: "Times-Roman", fontSize: 10 },
    theme: 'grid',
    headStyles: { fillColor: [221, 222, 226], textColor: [78, 53, 73], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25 },
      3: { cellWidth: 20 },
      4: { cellWidth: 20 },
      5: { cellWidth: 20 },
      6: { cellWidth: 20 },
      7: { cellWidth: 25 }
    },
    margin: {left: 13, right: 20},
    didDrawPage: function (data) {
      startY = data.cursor.y;
    }
  });

  // Adjust startY for any subsequent content
  startY += 20;
  return startY;
}

/*
  <div className="border md:w-4/12 w-10/12 rounded-md p-8">
      <h1>Carbon quote Calculator</h1>
            <Input
              type="number"
              name="co2Amount"
              value={totalCO2EUquota}
              defaultValue={totalCO2EUquota}
              onChange={e => setTotalCO2EUquota(Number(e.target.value))}
              placeholder={`Enter total CO2 (kg) or use default: ${totalCO2EUquota.toFixed(2)} kg`}
              className="input mb-4"
            />

            <p>Total CO2: ${totalCO2EUquota.toFixed(2)} kg</p>
            <p>EU Quota Cost per tonne: €${lastQuotaValue.toFixed(2)}</p>
            <p>Total Cost: €${calculateCarbonCosts(totalCO2EUquota).toFixed(2)}</p>
        <div id="calculationResults"></div>  
  </div>
</div>
*/ 

const prepareDataForEUTable = (totalCO2EUquota, lastQuotaValue) => {
  const co2Price = parseFloat(lastQuotaValue);
  const totalCost = calculateCarbonCosts(totalCO2EUquota);

  return [
    [totalCO2EUquota.toFixed(2) + " kg", " kr " + (co2Price).toFixed(2), " kr " + (totalCost).toFixed(2)]
  ];
};

const addNewTableEU = (totalCO2EUquota, lastQuotaValue, calculateCarbonCosts, pdf, startY) => {
  const headers = [["Total CO2", "EU Quota Cost Per Tonne", "Total Cost EU Quota"]];
  const body = prepareDataForEUTable(totalCO2EUquota, lastQuotaValue, calculateCarbonCost);

  pdf.autoTable({
    head: headers,
    body: body,
    startY: startY,
    styles: { font: "Times-Roman", fontSize: 10 },
    theme: 'grid',
    headStyles: { fillColor: [221, 222, 226], textColor: [78, 53, 73], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 40 },
      2: { cellWidth: 40 }
    },
    margin: {left: 42.5, right: 20},
    didDrawPage: function (data) {
      startY = data.cursor.y;
    }
  });

  // Adjust startY for any subsequent content
  startY += 20;
  return startY;
}



const downloadPDF = () => {
  const pdf = new jsPDF('portrait');

  let yPosition = 10;

  const addChartToPDF = (chartRef, width, height, title) => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');

      tempCtx.fillStyle = '#FFFFFF';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      tempCtx.drawImage(canvas, 0, 0);

      const base64Image = tempCanvas.toDataURL('image/jpeg', 1.0);

      pdf.setFont('Times-Roman', 'bold');
      pdf.setFontSize(14);

      const titleWidth = pdf.getStringUnitWidth(title) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
      const titleX = (pdf.internal.pageSize.getWidth() - titleWidth) / 2;

      const chartX = (pdf.internal.pageSize.getWidth() - width) / 2;

      const titleHeight = 20; 
      if (yPosition + titleHeight + height > pdf.internal.pageSize.getHeight()) {
        pdf.addPage();
        yPosition = 10; 
      }


      pdf.text(title, titleX, yPosition);
      yPosition += titleHeight; 

      pdf.addImage(base64Image, 'JPEG', chartX, yPosition, width, height);

      yPosition += height + 10; 
    } else {
      console.error('Chart is not yet rendered.');
    }
  };

  yPosition = addNewTable(data, pdf, yPosition + 10); 
  yPosition = addNewTableEU(totalCO2EUquota, lastQuotaValue, calculateCarbonCosts, pdf, yPosition);
  
  addChartToPDF(doughnutChartRef, 100, 100, 'Pie Chart');
  addChartToPDF(analysisChartRef, 180, 100, 'Cost and CO2 Analysis Chart');
  addChartToPDF(quotaChartRef, 180, 90, 'Quota Chart');
  addChartToPDF(polarChartRef, 120, 120, 'Polar Chart');


  pdf.save('combined-report.pdf');
};

  // Code for 'Carbon quote Calculator'
  const calculateCarbonCost = (co2Emissions) => {
    const lastQuotaValue = parseFloat(Quota[Quota.length - 1]);
    return co2Emissions * lastQuotaValue;
  };





  const lastQuotaValue = 71.55; // Placeholder for the last EU quota value in euros/tonne
  
  const InitialTotalCO2EUquota = initialMaterials.reduce((acc, material) => {
    return acc + (material.quantity * material.emissionsCO2) + (material.quantityGreen * material.emissionsCO2Green);
  }, 0);
  const [totalCO2EUquota, setTotalCO2EUquota] = useState(InitialTotalCO2EUquota)
  useEffect(() => {
    const newTotalCO2EUquota = data.reduce((acc, material) => {
      return acc + (material.quantity * material.emissionsCO2) + (material.quantityGreen * material.emissionsCO2Green);
    }, 0);
    setTotalCO2EUquota(newTotalCO2EUquota)
  }, [data])


  const calculateCarbonCosts = (co2Amount) => {
    return co2Amount * (lastQuotaValue / 1000); 
  };

  
  const fileInputRef = useRef(null);
  
  function handleInputChange(materialName, field, newValue) {
    // Updated regex to allow numbers that end with a decimal point
    if (!newValue || newValue.match(/^-?\d*\.?\d*$|^-?\d+\.$/)) {
      setData(currentData =>
        currentData.map(material => {
          if (material.name === materialName) {
            // Temporarily store incomplete numbers as strings to preserve input
            const processedValue = newValue.match(/\.$/) ? newValue : Number(newValue);
            return { ...material, [field]: processedValue };
          }
          return material;
        })
      );
    }
  }
  
  
    
  const handleButtonClick = () => {
    fileInputRef.current.click();
};

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const text = e.target.result;
            parseCsv(text);
        };
        reader.readAsText(file);
    }
};


const parseCsv = (csvData) => {
  const lines = csvData.split('\n').map(line => line.trim()).filter(line => line);
  const result = [];
  
  // Check the delimiter used in your CSV and ensure consistency
  const delimiter = ';'; // Use '\t' if your CSV is tab-delimited
  const headers = lines[0].split(delimiter).map(header => header.trim());

  for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(delimiter);
      if (values.length === headers.length) { // Ensure each row has the correct number of columns
          const entry = {
              name: values[0], // Assuming the first column is the material name
              quantity: parseFloat(values[1]),
              quantityGreen: parseFloat(values[2]),
              emissionsCO2: parseFloat(values[3]),
              emissionsCO2Green: parseFloat(values[4]),
              price: parseFloat(values[5]),
              greenPrice: parseFloat(values[6])
          };

          // Check for NaN values and handle them appropriately
          Object.keys(entry).forEach(key => {
              if (isNaN(entry[key]) && typeof entry[key] === 'number') {
                  entry[key] = 0; // Set defaults or handle errors
              }
          });

          result.push(entry);
      } else {
          console.error('Data mismatch in row ' + i);
      }
  }
  setData(result);
  setHistory(prevHistory => [...prevHistory, result])

};


  function updateHistory() {
    if(JSON.stringify(data) !== JSON.stringify(history[history.length - 1])) {
      setHistory(prevHistory => [...prevHistory, data])
    }
  }

  function calculateCarbonCreditSavings() {
    let carbonCreditSavings = [];
    data.forEach(ele => {
      let materialCostDifference = (ele.greenPrice - ele.price) * ele.quantity; // Cost associated with turning all regular materials into green materials
      let emissionsReduction = (ele.emissionsCO2 - ele.emissionsCO2Green) * ele.quantity; // Amount of CO2 saved by making the switch
      let carbonCreditCostDifference = emissionsReduction * lastQuotaValue / 1000;  
      let totalSavings = -(materialCostDifference + (carbonCreditCostDifference * 11.74)); 
  
      carbonCreditSavings.push({
        name: ele.name,
        savings: totalSavings  
      });
    });
    // console.log("Length", carbonCreditSavings.forEach(c => {
    //   console.log(c)
      
    //   if(Number(c) > 0) {
    //     console.log("yoooo")
    //   }
    // }))
    return carbonCreditSavings;
  }
  

/*
function calculateCarbonCreditSavings() {
  let carbonCreditSavings = []
  data.forEach(ele => {
    carbonCreditSavings.push({name: ele.name ,savings: (ele.price * ele.quantity) - (ele.greenPrice * ele.quantity) - Math.floor((ele.emissionsCO2 - ele.emissionsCO2Green) * lastQuotaValue * 11.74 * 1000)}) //11.74 NOK per EURO
  })
  return carbonCreditSavings
}
*/


function MakeGreen(materialName) {
  const newData = data.map(material => {
    if (material.name === materialName) {
        return {
            ...material,
            quantityGreen: material.quantityGreen + material.quantity,
            quantity: 0
        };
    }
    return material;
});
  setData(newData);
}


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

function GetRatioRanking() {
  const ratio = calculateRatios(data)

  const sortedRegular = [...ratio].sort((a, b) => b.regularRatio - a.regularRatio);
  const sortedGreen = [...ratio].sort((a, b) => b.greenRatio - a.greenRatio);
  return {sortedRegular, sortedGreen}
}

const { sortedRegular, sortedGreen } = GetRatioRanking(data);

const savings = calculateCarbonCreditSavings();
const hasPositiveSavings = savings.some(e => e.savings > 0);
  
  return (
    <main className="">
      <div className="border w-full h-16 flex justify-between items-center pr-20 pl-10">
        <h1 className=" font-bold">Carbon calculator</h1>
        <div className="flex gap-4">

        <Button variant="secondary" onClick={handleButtonClick} className="flex items-center justify-center gap-2">
    <span className="hidden md:flex">Upload CSV</span> 
    <FaFileUpload size={16} />
    </Button>
    <input
        ref={fileInputRef}
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        accept=".csv"
        style={{ display: 'none' }}
    />

    <Button variant="secondary" onClick={downloadPDF} className="flex items-center justify-center gap-2">
        <span className="hidden md:flex">Export PDF</span> 
        <FaFileExport size={16} />
    </Button>

    <Button variant="destructive" className="flex items-center justify-center gap-2" onClick={() => {
        setHistory(prevHistory => [...prevHistory, initialMaterials])
        setData(initialMaterials)}}>
        <span className="hidden md:flex">Reset</span> 
        <MdDelete size={21} />
    </Button>


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
            <TableHead>CO<sub>2</sub> emissions (kg)</TableHead>
            <TableHead>CO<sub>2</sub> emissions green (kg)</TableHead>
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

    <h2 className="text-xl font-bold text-center mt-16 underline mb-4">Overview</h2>

    <div className="flex flex-col md:flex-row justify-center items-center w-full gap-10">
      <AreaChartTwoAxis history={history} ref={analysisChartRef}/>
      <PieChartCO2 data={data} ref={doughnutChartRef}/>
    </div>

    <TreeAnimation data={data} treesNeeded={treesNeeded} windowWidth={windowWidth} />

    <h2 className='text-center text-2xl font-bold mt-16 underline'>EU Carbon credits</h2>

<div className="flex flex-col md:flex-row justify-center items-center w-full gap-10 mt-4">
    <div className="flex md:w-6/12 w-10/12  flex-col justify-center items-center aspect-[2/1]">
      <QuotaChart ref={quotaChartRef}/>
    </div>

  <div className="border md:w-4/12 w-10/12 rounded-md p-8 shadow-md border-gray-200">
      <h1 className="text-md mb-2 font-semibold text-lg">Carbon credits calculator</h1>
            <Input
              type="number"
              name="co2Amount"
              value={Number(totalCO2EUquota).toFixed(2)} //was tofixed(2)
              defaultValue={totalCO2EUquota} //was tofixed(2)
              onChange={e => setTotalCO2EUquota(Number(e.target.value))}
              placeholder={`Enter total CO2 (kg) or use default: ${totalCO2EUquota.toFixed(2)} kg`}
              className="input mb-4"
            />

            <p><span className="font-semibold">Total CO2:</span> {totalCO2EUquota.toFixed(2)} kg</p>
            <p><span className="font-semibold">EU Quota Cost per tonne:</span> {(11.74*lastQuotaValue).toFixed(2)} kr</p>
            <p><span className="font-semibold">Total Cost:</span> {(11.74*calculateCarbonCosts(totalCO2EUquota)).toFixed(2)} kr</p>

            
            {calculateCarbonCreditSavings().filter(value => value.savings > 0).length > 0 ? <div><Separator className="my-4" /><h1 className="mt-4">By switching to the green materials option you can save:</h1></div>: null}
            {calculateCarbonCreditSavings().map(e => {
              if (e.savings > 0) {
                return (
                  <div key={e.name} className="flex gap-2 items-center justify-between mt-2">
                    <p><span className="font-semibold">{e.name}</span>: {Math.round(e.savings)} kr</p>
                    <Button className="bg-green-100 py-1 hover:bg-green-300 text-black" onClick={() => MakeGreen(e.name)}>Make Green <IoLeaf /></Button>
                  </div>
                )
              }
            })}
        <div id="calculationResults"></div>  
  </div>
</div>

<h2 className="text-xl font-bold text-center mt-16 underline ">Green Investment Efficiency Metric</h2>
    
    <div className="flex flex-col md:flex-row justify-center items-center w-full gap-10 mb-10">
      <RadarChartExample data={data} ref={polarChartRef}/>
      <div className="border md:w-4/12 w-10/12 rounded-md h-full shadow-md p-5 py-8">
        
        <h1 className="text-center font-semibold text-lg">Ranking of Cost/CO2</h1>

    <div className="flex justify-around mt-2">
      <div>
        <h2 className="text-left font-semibold">Regular Material Efficiency</h2>
        <ul>
          {sortedRegular.map((material, index) => (
            <li key={index}>{index+1}. {material.name}: {Number(material.regularRatio).toFixed(1)}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-left font-semibold">Green Material Efficiency</h2>
        <ul>
          {sortedGreen.map((material, index) => (
            <li key={index}>{index+1}. {material.name}: {Number(material.greenRatio).toFixed(1)}</li>
          ))}
        </ul>
      </div>
    </div>
        <Separator className="my-4"/>
    <p className="italic">This chart shows an overview of cost to CO2 emissions ratio. If a material shows a high ratio in this chart
        it means that you pay more money, but your CO2 emissions are low compared to this price.
        </p>
            
      
      </div>
    </div>

    </main>
  );
}







const PieChartCO2 = forwardRef(({ data }, doughnutChartRef) => {
  const labels = data.map(material => 
    // if(material.name !== "Timber") {
       {
        if(material.name === "Timber") return 0
        return material.name}
    // }
  );
  const totalCO2Data = data.map(material => 
    {if(material.name === "Timber") return 0
     return material.quantity * material.emissionsCO2 + material.quantityGreen * material.emissionsCO2Green
    }
  );
  const regularCO2Data = data.map(material => 
    {if(material.name === "Timber") return 0
        return material.quantity * material.emissionsCO2
    }
    );
  const greenCO2Data = data.map(material =>
    {if(material.name === "Timber") return 0
      return material.quantityGreen * material.emissionsCO2Green
    }
    );
  
  const outerColors = [
    'rgba(255, 99, 132, 0.7)',   // Red
    'rgba(54, 162, 235, 0.7)',   // Blue
    'rgba(255, 206, 86, 0.7)',   // Yellow
    'rgba(75, 192, 192, 0.7)',   // Green
    'rgba(255, 159, 64, 0.7)',    // Orange
    'rgba(153, 102, 255, 0.7)',  // Purple
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
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Materials overview'
    },
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
  }
};

  
  return (<>
  {totalCO2Data.every(element => element === 0) ? <div className="rounded-full bg-slate-100 md:w-3/12 w-7/12 aspect-square flex justify-center items-center shadow-md"><p>No Data</p></div> :
      <div className="aspect-square md:w-3/12 w-7/12">
        <Doughnut data={chartData} options={options} ref={doughnutChartRef} />
    </div>}
  </>);
});
// Set displayName for the component
PieChartCO2.displayName = 'PieChartCO2';



const AreaChartTwoAxis = forwardRef(({ history }, analysisChartRef) => {
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
    responsive: true,
    maintainAspectRatio: false,
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
        text: 'Design history',
      },
      legend: {
        display: true,
        position: 'top',
      }
    }
  };


  return (
  <>
  {history.length === 1 ? 
  // <div className="aspect-[2/1] md:w-6/12 w-10/12 bg-slate-100 text-center rounded-r-xl">No history data</div>:
  <div class="aspect-[2/1] md:w-6/12 w-10/12 bg-slate-100 text-center rounded-r-xl flex items-center justify-center shadow-md">No history data</div>:

  <div className="aspect-[2/1] md:w-6/12 w-10/12"><Line data={data} options={options} ref={analysisChartRef}/></div>
  }
  
  </>)
}
)


// Set displayName for the component
AreaChartTwoAxis.displayName = 'AreaChartTwoAxis';

const RadarChartExample = forwardRef(({data}, polarChartRef) => {

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
    plugins: {
      title: {
        display: true,
        text: 'Cost Efficiency and CO2 Emissions Ratio'
      }
    },
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
    <div className="md:w-6/12 w-10/12 flex justify-center flex-col items-center mt-10 aspect-square">
      <Radar data={dataRadar} options={options} ref={polarChartRef}/>
    </div>
  );
}
)


// Set displayName for the component
RadarChartExample.displayName = 'RadarChartExample';

//const PieChartCO2 = forwardRef(({ data }, doughnutChartRef) => {
// const QuotaChart = forwardRef(({props},quotaChartRef) => {
//   const dates = Dates; 
//   const quota = Quota.map(q => parseFloat(q));

//   const data = {
//     labels: dates,
//     datasets: [
//       {
//         label: 'Climate Quota',
//         data: quota,
//         fill: false,
//         borderColor: 'rgb(75, 192, 192)',
//         tension: 0.1,
//         pointRadius: 0, 
//         borderWidth: 2 
//       }
//     ]
//   };

//   // const options = {
//   //   scales: {
//   //     x: {
//   //       type: 'category', 
//   //       ticks: {
//   //         autoSkip: true,
//   //         maxTicksLimit: 20 // Adjust based on your preference
//   //       }
//   //     },
//   //     y: {
//   //       beginAtZero: false
//   //     }
//   //   },
//   //   maintainAspectRatio: true,
//   //   plugins: {
//   //     title: {
//   //       display: true,
//   //       text: 'EU trading emissions quotas ',
//   //     },
//   //     legend: {
//   //       display: false,
//   //       position: 'top'
//   //     }
//   //   }
//   // };

//   const options = {
//     scales: {
//       x: {
//         type: 'time',
//         time: {
//           unit: 'day',
//           tooltipFormat: 'll',
//           displayFormats: {
//             day: 'MMM D'
//           }
//         },
//         ticks: {
//           autoSkip: true,
//           maxTicksLimit: 10, // Adjust based on your preference
//           callback: function(val, index) {
//             // This function formats each tick as needed
//             return moment(val).format('MMM D');
//           }
//         }
//       },
//       y: {
//         beginAtZero: false
//       }
//     },
//     maintainAspectRatio: true,
//     plugins: {
//       title: {
//         display: true,
//         text: 'EU Trading Emissions Quotas',
//       },
//       legend: {
//         display: false,
//         position: 'top'
//       }
//     }
//   };
  

//   return (
//       <Line data={data} options={options} ref={quotaChartRef}/>
//   );
// }
// )

const QuotaChart = forwardRef(({props}, quotaChartRef) => {
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
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'll',
          displayFormats: {
            day: 'MMM D'
          }
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10, // Adjust based on your preference
        }
      },
      y: {
        beginAtZero: false
      }
    },
    maintainAspectRatio: true,
    plugins: {
      title: {
        display: true,
        text: 'EU Trading Emissions Quotas',
      },
      legend: {
        display: false,
        position: 'top'
      }
    }
  };

  return (
      <Line data={data} options={options} ref={quotaChartRef}/>
  );
});

QuotaChart.displayName = 'QuotaChart';



