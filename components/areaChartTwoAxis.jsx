// function AreaChartTwoAxis({ history }) {
//     let tempArr = [...history]
//     let dataCost = []
//     let dataCO2 = []
//     tempArr.forEach(data => {
//       let CO2Totatl = 0;
//       let CashTotatl = 0;
//       data.forEach(ele => {
//         CO2Totatl += ele.emissionsCO2Green * ele.quantityGreen + ele.emissionsCO2 * ele.quantity
//         CashTotatl += ele.price * ele.quantity + ele.greenPrice * ele.quantityGreen
//       })
//       dataCost.push(CashTotatl)
//       dataCO2.push(CO2Totatl)
//     });
  
  
//     const data = {
//       labels: history.map((_, index) => `V ${index + 1}`),
//       datasets: [
//         {
//           label: 'Cost',
//           data: dataCost, 
//           borderColor: 'rgb(255, 99, 132)',
//           backgroundColor: 'rgba(255, 99, 132, 0.5)',
//           yAxisID: 'y',
//           fill: true,
//           tension: 0.4
//         },
//         {
//           label: 'CO2',
//           data: dataCO2, 
//           borderColor: 'rgb(53, 162, 235)',
//           backgroundColor: 'rgba(53, 162, 235, 0.5)',
//           yAxisID: 'y1',
//           fill: true,
//           tension: 0.4
//         },
//       ],
//     };
  
//     const options = {
//       scales: {
//         y: {
//           type: 'linear',
//           display: true,
//           position: 'left',
//         },
//         y1: {
//           type: 'linear',
//           display: true,
//           position: 'right',
//           grid: {
//             drawOnChartArea: false,
//           },
//         },
//       },
//       plugins: {
//         title: {
//           display: true,
//           text: 'Monthly Analysis of Cost and CO2',
//           font: {
//             size: 20
//           },
//           padding: {
//             top: 20,
//             bottom: 10
//           }
//         },
//         legend: {
//           display: true,
//           position: 'top',
//         }
//       }
//     };
  
  
//     return <div className="w-6/12"><Line data={data} options={options} /></div>;
//   }


//   export { AreaChartTwoAxis }
