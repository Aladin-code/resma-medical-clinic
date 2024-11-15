import React, { useRef } from 'react';

const Prints = () => {
  const componentRef = useRef();

  const handlePrint = () => {
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
        .container {
          width: 100%;
          text-align: center;
        }
        h1 {
          color: #4673FF;
          font-size: 2rem;
          margin-bottom: 1rem;
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
      </style>
    `;

    // Write the content to the new window
    newWindow.document.body.innerHTML = `<div class="container mx-auto p-4">${content}</div>`;

    newWindow.document.close(); // Close the document stream
    newWindow.print(); // Trigger the print dialog
  };

  return (
    <>
      <div className="container mx-auto p-4" ref={componentRef}>
        <h1 className="text-[#4673FF] text-2xl font-semibold mb-4">YSMAEL, MAE A. DEL PRADO, MD</h1>
        <p className="text-base mb-6">Adult Diseases Specialist</p>
        <p>Diplomatate, Philippine Specialty Board of Internal Medicine</p>
        <hr />
        <div className="flex w-full info " >
          <p>Name: Juan Dela Cruz</p>
          <p>Age: 23</p>
          <p>Gender: Male</p>
          <p>Address: Curva, Bongabon</p>
          <p>Date: 01/12/2024</p>
      </div>
      </div>
      
      <button
        className="bg-[#4673FF] text-white py-2 px-6 rounded-lg hover:bg-[#365fa3] transition-colors"
        onClick={handlePrint}
      >
        Print
      </button>
    </>
  );
};

export default Prints;
