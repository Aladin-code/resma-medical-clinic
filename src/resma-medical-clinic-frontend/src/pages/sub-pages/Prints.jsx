import React, { useRef } from 'react';
import rx from '../../assets/hc.jpg';
import hc from '../../assets/rx.jpg';
import { IoMdPrint } from "react-icons/io";
import { IoCheckmarkSharp } from "react-icons/io5";
const Prints = ({medication, patient, date}) => {
  const componentRef = useRef();
  console.log(medication);
  
function formatDate(dateString) {
  const date = new Date(dateString); // Convert the input string to a Date object
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${day}/${year}`; // Return the formatted date
}
  const referenceTimes = ['8:00 AM', '1:00 PM', '6:00 PM', '8:00 PM'];

  const length = (13 - medication.length );
  const Emptyrows = [];
  for (let i = 0; i < length; i++) {
    Emptyrows.push(
      <tr key={i} className='empty-rows'>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    );
  }
  const handlePrint = ({}) => {
    const content = componentRef.current.innerHTML; // Get the content to be printed
    const newWindow = window.open('', '', 'width=800,height=600'); // Open a new window for printing

    // Add custom CSS and title to the new window
    newWindow.document.head.innerHTML = `
      <title>Print Preview</title>
      
      <style>
        /* Tailwind CSS styles for the print preview */
        body {
          font-family: Arial, sans-serif;
          background-color: #f8f8f8;
          color: #333;
        }
        .info-1{
          display:flex;
          width: 100%;
        }
            .info-2{
          display:flex;
         
        }
        .container {
          width: 100%;
          text-align: center;
        }
        h1 {
          font-size: 28px;
          margin-bottom: 1rem;
          text-decoration: underline;
          margin-top: 50px;
          margin-bottom: -17px; 
          font-weight:600;

        }
          .spec, .dip{
          font-size:20px;
         
        }
          .flex{
            display:flex;
            align-items:center;
          }
        .spec{
          margin-bottom: -20px;
        }
        .dip{
          margin-bottom:-7px;
        }
        
        p {
          font-size: 1rem;
          margin-bottom: 1.5rem;
        }
        button {
          background-color: #4673FF;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background-color: #365fa3;
        }
         

        /* Tailwind + @media print for hiding elements */
        @media print {
          /* Hide the title and button when printing */
          title {
            display: none;
          }
          button {
            display: none; /* Hide the button during printing */
          }
        }
        .hc-cont{
            display:flex;
            justify-content:center;
            align-items-center;
            padding-bottom: 10px;
            border-bottom: 4px solid black;
        }
        .rx-cont{
            display:flex;
            align-items-center;
            padding-bottom: 10px;
            margin-top:-5px;
            margin-left:45px;
            margin-right:45px;    
            font-size: 20px;
        }
        #hc{
           margin-top:80px;
        }
        #rx{
            margin-top:10px;
        }
        .img{
          width: 20%;
        }
        .info{
          width: 100%;
          text-left;
          display: flex;
          margin-bottom:-25px;
          margin-top:20px;
        
        }   
          
        .info-2{
          width: 100%;
          text-left;
          display: flex;
             
        }
        .name-info, .age-info,.gender-info,.address-info,.date-info{
          display: flex;
        }
        .name-info{
          width: 57%;
          size: 56px;
        }
        .age-info{
          width: 20%; 
        }
           .gender-info{
          width: 20%; 
        }
           .address-info{
          width: 70%; 
        }
           .date-info{
          width: 30%; 
        }
       
        .name{
           width: 100%;
           border-bottom: 1px solid black;
           text-align: left;
           margin-left: 5px;
           padding-left: 5px;
        }
           .age{
              width:100%;
              border-bottom:1px solid black;
              text-align: left;
              margin-left: 5px;
              padding-left: 5px;
           }
              .gender{
              width:100%;
              border-bottom: 1px solid black;
              text-align: left;
              margin-left: 5px;
              padding-left: 5px;
           }
                .address{
              width:100%;
              border-bottom: 1px solid black;
              text-align: left;
              margin-left: 5px;
              padding-left: 5px;
           }
              .date{
              width:100%;
              border-bottom: 1px solid black;
              text-align: left;
              margin-left: 5px;
              padding-left: 5px;
           }
            .information-container{
            width: 100%;
            }
            .prescription{
             
              padding-left: 35px;
              padding-right: 35px;
              text-align: center;
              
            }
              table{
                width: 100%;
                border: 1px solid black;
                border-collapse: collapse;
              }
            
            
            .styled-table th,
            .styled-table td {
              padding: 10px;
              border: 1px solid black;
            }
              .styled-table tr{
              text-align:center;
              height: 40px !important;
              }
            .footer{
              display: flex;
              border: 1px solid black;
              width: 100%;
            margin-top: 5px;
            }
            .footer .left{
              text-align: left;
              width: 67%;
              padding: 10px;
            }
              .right{
              text-align: right;
                 width: 33%;
                  padding: 10px;
           
            }
            .footer p {
              margin-bottom: -5px;
              font-size: 16px;
            }

             #span{
                width: 80% !important;
                border: 1px solid yellow;
            }
              
            .p1{
              display: flex;
              width: 100%;
              
            }
              .p1 .lic{
                  width: 40%;
                  text-align: left;
                  
              }
              .p1 .lic-value{
                width: 100%;
                text-align: left;
                border-bottom: 1px solid black;
                font-weight: 600;
              }
                .right .name-med{
                  font-size:16px;
                  width: 100%;
                  text-align: right;
                  font-weight: 600;
                  border-bottom: 1px solid black;
                }
      </style>
    `;
    // Write the content to the new window
    newWindow.document.body.innerHTML = `<div class="container mx-auto p-4">${content}</div>`;

    newWindow.document.close(); // Close the document stream
    newWindow.print(); // Trigger the print dialog
  };
  return (
    <>
      <div className="container mx-auto p-4 mt-4 hidden" ref={componentRef}>
        <div className="flex hc-cont ">
          <img id="hc"src={hc} alt="" width="90px"/>
          <div>
          <h1 className="text-[black] text-2xl font-semibold mb-4">YSMAEL MAE A. DEL PRADO MD</h1>
          <p className="text-lg mb-6 spec">Adult Diseases Specialist</p>
          <p className='dip'>Diplomatate, Philippine Specialty Board of Internal Medicine</p>
          </div>
        </div>
       <div className="flex rx-cont">
          <div className='img'>
            <img id="rx" src={rx} alt="" width="90px" />
          </div>
          <div className='information-container'>
          <div className="info">
              <div className='name-info'>
                  <p>Name: </p>
                  <p className='name'>{patient.firstName} {patient.middleName} {patient.lastName}</p>
              </div>
              <div className='age-info'>
                  <p>Age: </p>
                  <p className='age'>25</p>
              </div>
              <div className='gender-info'>
                  <p>Gender: </p>
                  <p className='gender'>{patient.gender}</p>
              </div>
          </div>
          <div className="info-2">
              <div className='address-info'>
                  <p>Address: </p>
                  <p className='address'>{patient.address}</p>
              </div>
              <div className='date-info'>
                  <p>Date: </p>
                  <p className='date'>{formatDate(date)}</p>
              </div>
          </div>
        </div>
        
        
          
       </div>
       <div className="prescription">
          <table className='styled-table'>
            <thead>
              <th>MEDICATIONS</th>
              <th>QTY</th>
              <th>8 AM</th>
              <th>12NN</th>
              <th>6PM</th>
              <th>8PM</th>
              <th>REMARKS</th>
            </thead>
            <tbody>
            {medication.slice(0, 12).map((item, index) => {
              // Split the instructions and create an array
              const instructionArray = item.instructions.split(", ");

              // Predefined times that we want to check for
              const checkTimeMatch = ['8:00 AM', '12:00 NN', '6:00 PM', '8:00 PM'];

              return (
                <tr key={index}>
                  <td className="border border-gray-300 px-2 py-1">
                    {item.medicationName} ({item.dosage})
                  </td>
                  <td className="border border-gray-300 px-2 py-1">{item.quantity}</td>

                  {/* Iterate through the predefined times (4 times) */}
                  {checkTimeMatch.map((time, idx) => {
                    // Check if the time exists in the instructionArray
                    const matchesTime = instructionArray.includes(time);

                    return (
                      <td key={idx} className="border border-gray-300 px-2 py-1">
                        {matchesTime ? <IoCheckmarkSharp /> : ""} {/* Render "/" if matches, otherwise empty */}
                      </td>
                    );
                  })}
                  <td></td>
                </tr>
              );
            })}
            {Emptyrows}


             
            </tbody>
          </table>
          <div className="footer">
                <div className="left">
                    <p>A. Resma Medical Clinic</p>
                    <p>Brgy. Curva, bongabon, N.E</p>
                    <p>Beside RBC Gas Station</p>
                    <p>Monday to Wednesday</p>
                    <p>CP#: 09533289578</p>
                </div>
                <div className="right">
                    <p className='name-med'>Ysrael Mae A. Del Prado, MD</p>
                    <div className="p1">
                          <p className='lic'>LIC NO:</p><p className='lic-value'>: 014058</p>
                    </div>
                    <div className="p1">
                          <p className='lic'>PTR:</p><p className='lic-value'>:</p>
                    </div>
                    <div className="p1">
                          <p className='lic'>S2:</p><p className='lic-value'>:</p>
                    </div>
                  
                    
                </div>

          </div>
        </div>
      </div>
      
      <button
        className="bg-[#4673FF] text-white py-2 px-6 rounded-lg hover:bg-[#365fa3] transition-colors"
        onClick={handlePrint}
      >
        <IoMdPrint />
      </button>
    </>
  );
};

export default Prints;
