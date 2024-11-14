import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { resma_medical_clinic_backend } from 'declarations/resma-medical-clinic-backend';
import Sidebar from '../Sidebar.jsx';
import patientImg from '../../assets/profile.png';
import rx from '../../assets/rxicon.svg';
import { NavLink } from 'react-router-dom';
import { Modal } from '@mui/material';
import { IoMdClose } from "react-icons/io";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ApexChart from './chart.jsx';
import LatestLab from './latestLab.jsx';
import Comparison from './comparison.jsx';
import { IoArrowUpSharp } from "react-icons/io5";
import { MdArrowDownward } from "react-icons/md";
import logo from '../../assets/resma.png';
import MoonLoader from "react-spinners/ClipLoader";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useLocation } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
function ViewPatient({userInfo,handleLogout}){

  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reportFailed, setReportFailed] = useState(false);
  const [vertical, setVertical] = useState('bottom'); // Default vertical position
  const [horizontal, setHorizontal] = useState('right');

  const location = useLocation();
  useEffect(() => {
    if (location.state?.success) {
        setSuccess(true);
    }else if(location.state?.failed){
        setFailed(true);
    }
  }, [location]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSuccess(false);
    setFailed(false)
    setReportFailed(false)
  };

    const { id } = useParams(); // Get patient ID from URL
    const [patient, setPatient] = useState(null);

    const [isDisabled, setIsDisabled] = useState(true);

    const [open, setOpen] = useState(false);
    const [openLab, setLab] = useState(false);
    const addReport = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const addLab = () => setLab(true);

    const [diagnosis, setDiagnosis] = useState('');
    const [medicationName, setMedicationName] = useState('');
    const [dosage, setDosage] = useState('');
    const [quantity, setQuantity] = useState('');
    const [frequency, setFrequency] = useState('');
    const [instructions, setInstructions] = useState('');

    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0'); // Get day and pad with zero
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and pad with zero
    const year = currentDate.getFullYear(); // Get full year
    const formattedDate = new Date(year, month - 1, day).getTime();

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const reportDate = currentDate.toLocaleDateString('en-US', options);
    // const formattedDate = "2024-09-26"; 
  // State to store multiple medications
    const [medications, setMedications] = useState([]);

    const tests = [
      { name: 'Blood Sugar Test', units: ['mg/dL'] },
      { name: 'Cholesterol Test', units: ['mg/dL'] },
      { name: 'Hemoglobin Test',  units: ['g/dL'] },
      { name: 'Hemoglobin Test',  units: ['g/dL'] },
      { name: 'Hemoglobin Test',  units: ['g/dL'] },
      { name: 'Hemoglobin Test',  units: ['g/dL'] },
      // Add other tests as needed
    ];
    const [newTest, setNewTest] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(''); 
    const [labResults, setLabResults] = useState([{ result: '', unit: '' }]);
    // const [testName, setTestName] = useState('');

    let [saveLoader, setSaveLoader] = useState(false);
    let [color, setColor] = useState("#fff");

    const [selectedTest, setSelectedTest] = useState();

    const handleTestChange = (e) => {
      const testName = e.target.value;
      const test = tests.find((t) => t.name === testName);
    
      setNewTest(test);
      setLabResults(test.units.map(() => ({ result: '', unit: '' }))); // Initialize results for each unit
    };
    const handleTestNameChange = (e) => {
        setTestName(e.target.value);
    };
    const handleSelectedTestChange = (event) => {
      const selectedTestName = event.target.value;
      setSelectedTest(selectedTestName);
    
      // // Update newTest with the selected test data if needed
      // const selectedTest = patient.laboratory.find(lab => lab.test.testName === selectedTestName);
      // if (selectedTest) {
      //   setNewTest(selectedTest);
      // }
    };
    
    const closeLab = () => {
      setLab(false);
      setLabResults([{ result: '', unit: 'mmo/l' },{ result: '', unit: 'mg/dl' }]);
      setNewTest('');
    }
    // Function to handle adding new result and unit inputs
    // const addLabResult = () => {
    //   setLabResults([...labResults, 
    //     { result: '', unit: '' },
    //     { result: '', unit: '' },
    //   ]);
    // };

    const handleLabChange = (index, field, value) => {
      setLabResults((prevResults) =>
        prevResults.map((result, i) =>
          i === index ? { ...result, [field]: value } : result
        )
      );
    };
      const handleUnitChange = (e) => {
        const unit = e.target.value;
        setSelectedUnit(unit);

        setLabResults((prevResults) =>
          prevResults.map((result, index) => ({
            ...result,
            unit,
          }))
        );
      };

    const addMedication = () => {

      
      const newMedication = {
        medicationName,
        dosage,
        quantity,
        frequency,
        instructions
      };
      setMedications([...medications, newMedication]);

      // Clear inputs
      setMedicationName('');
      setDosage('');
      setQuantity('');
      setFrequency('');
      setInstructions('');
    };

    function formatDate(dateString) {
      // Split the input date string into parts
      const [month, day, year] = dateString.split('-');
      
      // Create a new date object
      const date = new Date(`${year}-${month}-${day}`);
      
      // Format options for the date
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      
      // Format the date
      return date.toLocaleDateString('en-US', options);
  }
  const submitLab = async () => {
      const unit = newTest.units[0];
      const value = labResults[0].result;
      const testName = newTest.name;
      console.log(testName);
      console.log(unit);
      console.log(value);
      console.log(newTest.name);
    // Validate testName input
    if ( !newTest.name || !unit || !value ) {
     setReportFailed(true);
      return; // Prevent submission if testName is empty
    }

    console.log("newTest",newTest);
    console.log("Units",selectedUnit);
    console.log("Lab",labResults);
    setSaveLoader(true);
  
    try {
      const labReport = {
        test: {
          date: formattedDate,
          testName: newTest.name,
          result: [
            {
            value:parseFloat(value), 
            unit: unit
          }
          ],
        }
      };
  
      // Attempt to submit the lab report
      const result = await resma_medical_clinic_backend.addLaboratory(id, labReport);
      if (result) {
        // Successful submission
        setSaveLoader(false);
        setSuccess(true);
        console.log('Submitting lab report:', labReport);
  
        // Reset form and close modal
        handleClose(); 
        fetchPatientData();
        setNewTest('');
        setLab(false);
        setLabResults([{ result: '', unit: 'mmol/L' }, { result: '', unit: 'mg/dL' }]);
      } else {
        setSaveLoader(false); // Stop loader if result is falsey
        alert("Failed to save the lab report.");
      }
  
    } catch (error) {
      console.error('Error submitting laboratory report:', error);
      setSaveLoader(false); // Stop loader on error
      alert("An error occurred while submitting the lab report. Please try again.");
    }
  };
  
    const submitReport = async () => {
      if (medications.length === 0 || !diagnosis) {
        setReportFailed(true);
        return;
      }
      setSaveLoader(true);
      const report = {
          date: reportDate,
          diagnosis,
          prescriptions: medications,
        };
      try{
            const result = await resma_medical_clinic_backend.addReport(id,report);
            console.log(result); // Log result to verify the response from the backend
    
            // Optionally, handle the result
            if (result) {
                setSaveLoader(false);
                setSuccess(true);
                setDiagnosis('');
                setMedications([]);
                handleClose(); 
                fetchPatientData();// Close the modal or reset the form if needed
            } else {
                setSuccess(false);
            }
      }catch (error) {
          console.error('Error submitting report:', error);
      }

    
  }
  const fetchPatientData = async () => {
    try {
      const result = await resma_medical_clinic_backend.read(id);
      console.log(result); // Log result to verify data
  
      // Check if result is an array and handle accordingly
      const patientData = Array.isArray(result) ? result[0] : result;
      setPatient(patientData);
  
      // Ensure laboratory exists, has at least one entry, and that the test property exists
      if (
        patientData &&
        patientData.laboratory &&
        Array.isArray(patientData.laboratory) &&
        patientData.laboratory.length > 0 &&
        patientData.laboratory[0] &&
        patientData.laboratory[0].test
      ) {
        setSelectedTest(patientData.laboratory[0].test.testName || "Unnamed");
      } else {
        setSelectedTest("No test available");
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };
  
  const [comparisonData, setComparisonData] = useState(null);

  useEffect(() => {
    if (patient && patient.laboratory && selectedTest) {
      // Filter lab results for the selected test
      const filteredLabResults = patient.laboratory
        .filter(lab => lab.test.testName === selectedTest)  // Filter by selected test
    
  
      // Update the state with the filtered and sorted results
      setComparisonData(filteredLabResults);
    }
  }, [patient, selectedTest]); // Dependencies are patient and selectedTest

useEffect(() => {
  if (!medicationName || !dosage || !quantity || !frequency || !instructions) {
    setIsDisabled(true);
  } else {
    setIsDisabled(false);
  }
}, [medicationName, dosage, quantity, frequency, instructions]);
const deleteMedication = (index) => {
  // Remove the medication at the specified index
  setMedications((prevMedications) =>
    prevMedications.filter((_, i) => i !== index)
  );
};
// Optional logging effect to track when isDisabled changes
useEffect(() => {
  console.log(isDisabled);
}, [isDisabled]);

useEffect(() => {
    fetchPatientData();
}, [id]);

useEffect(() => {

}, [medications, diagnosis]);

if (!patient) {
  return <div className='h-screen w-full flex justify-center items-center transition-all duration-700 ease-in-out '><img className='shadow-xl rounded-xl animate-subtle-spin' src={logo} alt="logo" width="200px" /></div>;
}
const user = userInfo[0];


    return(
        <>
            <Sidebar role={user.role} handleLogout={handleLogout} />
            <Snackbar
                    open={success}
                    autoHideDuration={3000}
                    message=""
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical, horizontal }}  // Corrected anchorOrigin
                    key={`success-${vertical}${horizontal}`} 
                   >
                     <Alert
                        onClose={handleSnackbarClose}
                        severity="success"
                        variant="filled"
                        sx={{ width: '100%' }}
                     >
                     Changes saved successfully!
                    </Alert>
            </Snackbar>
            <Snackbar
                    open={failed}
                    autoHideDuration={3000}
                    message=""
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical, horizontal }}  // Corrected anchorOrigin
                    key={`failed-${vertical}${horizontal}`} 
                   >
                     <Alert
                        onClose={handleSnackbarClose}
                        severity="error"
                        variant="filled"
                        sx={{ width: '100%' }}
                     >
                     Something went wrong!
                    </Alert>
            </Snackbar>
            <Snackbar
                    open={reportFailed}
                    autoHideDuration={3000}
                    message=""
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical, horizontal }}  // Corrected anchorOrigin
                    key={`reportFailed-${vertical}${horizontal}`} 
                   >
                     <Alert
                        onClose={handleSnackbarClose}
                        severity="error"
                        variant="filled"
                        sx={{ width: '100%' }}
                     >
                     Please fill in all fields.
                    </Alert>
            </Snackbar>
            <Modal
              open={open}
              onClose={handleClose}
              className="flex items-center justify-center"
              BackdropProps={{
                className: 'bg-white-200',
              }}
            >
                <main className="w-[550px] bg-white rounded-tl-2xl rounded-tr-2xl">
                  <div className="w-full relative">
                    <h1 className="w-full bg-[#4673FF] rounded-tl-xl rounded-tr-xl text-white text-center text-xl p-2 font-semibold">
                      NEW REPORT
                    </h1>
                    <button
                      className="text-white text-3xl font-semibold absolute top-2 right-2"
                      onClick={handleClose}
                    >
                      <IoMdClose />
                    </button>
                  </div>

                  <section className="p-5">
                    {/* Diagnosis input */}
                    <h1 className="text-base font-bold">
                      DIAGNOSIS <span className="text-sm font-semibold text-[red]">*</span>
                    </h1>
                    <p className="text-xs text-[#B3B3B3]">Please enter diagnosis and findings here</p>
                    <input
                      type="text"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      className="w-full border rounded-lg border-black text-sm p-1 mb-2"
                    />
                    
                
                    <h1 className="text-base font-bold mb-[0px]">PRESCRIPTION</h1>

                    <div className="mt-1">
                      <p className="text-base">Medicine <span className="text-sm font-semibold text-[red]">*</span></p>
                      <input
                        type="text"
                        value={medicationName}
                        onChange={(e) => setMedicationName(e.target.value)}
                        className="w-full border rounded-lg border-black text-sm p-1"
                      />
                    </div>

                    <div className="flex">
                      <div className="w-1/2 mr-1">
                        <p className="text-base">Dosage <span className="text-sm font-semibold text-[red]">*</span></p>
                        <input
                          type="text"
                          value={dosage}
                          onChange={(e) => setDosage(e.target.value)}
                          className="w-full border rounded-lg border-black text-sm p-1"
                        />
                      </div>
                      <div className="w-1/2 ml-1">
                        <p className="text-base">Quantity <span className="text-sm font-semibold text-[red]">*</span></p>
                        <input
                          type="text"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="w-full border rounded-lg border-black text-sm p-1"
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-base">Frequency <span className="text-sm font-semibold text-[red]">*</span></p>
                      <input
                        type="text"
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        className="w-full border rounded-lg border-black text-sm p-1"
                      />
                    </div>

                    <h1 className="text-base font-bold mt-2">INSTRUCTIONS</h1>
                    <input
                      type="text"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      className="w-full border rounded-lg border-black text-sm p-1"
                    />

                    {/* Add button */}
                    <div className="w-full text-right">
                      <button
                        type="button"
                        onClick={addMedication}
                        className="disabled:bg-gray-400 disabled:cursor-not-allowed bg-[#4673FF] py-1 px-9 font-semibold rounded-lg text-white text-sm mb-1 transition-all duration-300 transform hover:bg-[#365ec4] hover:scale-105 hover:shadow-lg"
                        disabled={isDisabled}
                      >
                        ADD
                      </button>
                    </div>

                
                    <hr />
                    <table className="w-full text-white text-sm mt-2">
                      <thead className="h-4 bg-[#4673FF] px-3 rounded-xl">
                        <tr>
                          <th className="py-1" scope="col">Medication</th>
                          <th scope="col">Dosage</th>
                          <th scope="col">Quantity</th>
                          <th scope="col">Frequency</th>
                          <th scope="col">Instructions</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-black text-center text-xs">
                        {medications.map((medication, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">{medication.medicationName}</td>
                            <td>{medication.dosage}</td>
                            <td>{medication.quantity}</td>
                            <td>{medication.frequency}</td>
                            <td>{medication.instructions}</td>
                            <td>
                            {/* Delete button */}
                            <button
                              onClick={() => deleteMedication(index)}
                              className="text-red-500 hover:text-red-700 text-base"
                            >
                              <MdDelete />
                            </button>
                          </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Save button */}
                    <div className="w-full text-center mt-9">
                      <button
                        type="button"
                        onClick={submitReport}
                        className="w-96 bg-[#4673FF] px-10 text-xl font-bold py-2 text-white rounded-xl transition-all duration-300 transform hover:bg-[#365ec4] hover:scale-105 hover:shadow-lg"
                      >
                        {saveLoader ? (
                                  <p className='flex items-center justify-center '><MoonLoader className=""size={30} color={color} loading={true} /></p>
                              ): (
                                  "SAVE"
                              )}
                       
                      </button>
                    </div>
                  </section>
                </main>
            </Modal>
            <Modal
    open={openLab}
    onClose={closeLab}
    className="flex items-center justify-center"
    BackdropProps={{
      className: 'bg-white-200',
    }}
  >
    <main className="w-[550px] bg-white rounded-tl-2xl rounded-tr-2xl">
      <div className="w-full relative">
        <h1 className="w-full bg-[#4673FF] rounded-tl-xl rounded-tr-xl text-white text-center text-xl p-2 font-semibold">
          LABORATORY REPORT
        </h1>
        <button
          className="text-white text-3xl font-semibold absolute top-2 right-2"
          onClick={closeLab}
        >
          <IoMdClose />
        </button>
      </div>
      <div className="p-3">
        <p className="text-base font-bold">LABORATORY</p>
        <div className="flex items-center mt-3">
          <p className="text-base">
            Name of test<span className="text-sm font-semibold text-[red]">*</span>
          </p>
          <select
            className="flex-grow border rounded-lg border-black text-sm p-1 ml-2"
            onChange={handleTestChange}
            value={newTest ? newTest.name : ''}
          >
            <option value="" disabled>
              Select a test
            </option>
            {tests.map((test, index) => (
              <option key={index} value={test.name}>
                {test.name}
              </option>
            ))}
          </select>
        </div>

        {newTest &&
          newTest.units.map((unit, index) => (
            <div key={index} className="flex items-center mt-2 ml-[100px]">
              <p className="text-base">
                Result<span className="text-sm font-semibold text-[red]">*</span>
              </p>
              <input
                type="text"
                className="w-15 flex-grow border rounded-lg border-black text-sm p-1 ml-2"
                placeholder="Enter result value"
                value={labResults[index]?.result || ''}
                onChange={(e) => handleLabChange(index, 'result', e.target.value)}
              />
              <input
                type="text"
                className="w-10 flex-grow border rounded-lg border-black text-sm p-1 ml-2"
                placeholder="Unit"
                value={unit}
                readOnly
              />
            </div>
          ))}

        

        <div className="w-full text-center mt-9">
          <button
            type="button"
            onClick={submitLab}
            className="w-96 bg-[#4673FF] px-10 text-xl font-bold py-2 text-white rounded-xl transition-all duration-300 transform hover:bg-[#365ec4] hover:scale-105 hover:shadow-lg"
          >
            {saveLoader ? (
              <p className="flex items-center justify-center transition-all duration-300 transform hover:bg-[#365ec4] hover:scale-105 hover:shadow-lg">
                <MoonLoader className="" size={30} color={color} loading={true} />
              </p>
            ) : (
              "SAVE"
            )}
          </button>
        </div>
      </div>
    </main>
  </Modal>
            <div className=' ml-64 flex-grow  font-poppins p-3'>
           
                <div className='mb-4 mt-4'>
                            <NavLink to="/records" className="fw-32 font-semibold   text-xl text-[#A9A9A9] hover:text-[#014BA8]" href="">MEDICAL RECORDS  </NavLink>
                            <NavLink to="/AddPatient" className="fw-32 font-semibold  text-xl text-[#4673FF] " href=""> / VIEW PATIENT</NavLink>
                </div>
                <main className='flex border-2 rounded-xl shadow-lg'>
                    <section className="w-1/5 flex justify-center items-center">
                        <div className='text-center p-2  mb-1'>
                            <img className="border border-slate-300 rounded-full" src={patientImg} alt="150px"  width="150px" height="150px" />
                            <div className='text-center'>
                           
                            {(user.role === "Secretary" || user.role === "Admin" )&&(
                                 <NavLink to={`/records/updatePatient/${patient.id}`} className="left-3 text-[#4673FF] text-sm font-semibold">Edit Profile</NavLink>
                            )}
                            </div>
                        </div>
                    </section>
                    <section className="flex-grow">
                        <div className=' bg-[#4673FF] text-center text-sm text-white py-2 font-semibold rounded-tr-xl'>
                            <h1>DEMOGRAPHIC INFORMATION</h1>
                        </div>
                        <div className="w-full flex mt-2 ">
                            <div className="w-1/5 text-xs leading-6 pl-8 font-semibold">
                                <p>Patient ID:</p>
                            </div>
                            <div className="w-1/4 text-xs leading-6  ">
                                <p>{patient.id}</p>
                            </div>
                            <div className="w-1/5 text-xs leading-6 pl-8  font-semibold">
                                <p>Address:</p>
                            </div>
                            <div className="w-1/5 text-xs leading-6  ">
                                <p>{patient.address}</p>
                            </div>
                        </div>
                        <div className="w-full flex">
                            <div className="w-1/5 text-xs leading-6 pl-8 font-semibold">
                                <p>Full Name:</p>
                            </div>
                            <div className="w-1/4 text-xs leading-6  ">
                                <p>{patient.firstName} {patient.middleName} {patient.lastName} {patient.extName}</p>
                            </div>
                            <div className="w-1/5 text-xs leading-6 pl-8  font-semibold">
                                <p>Contact:</p>
                            </div>
                            <div className="w-1/5 text-xs leading-6  ">
                                <p>{patient.contact}</p>
                            </div>
                        </div>
                        <div className="w-full flex">
                            <div className="w-1/5 text-xs leading-6 pl-8 font-semibold">
                                <p>Date of Birth:</p>
                            </div>
                            <div className="w-1/4 text-xs leading-6  ">
                                <p>{patient.dateOfBirth}</p>
                            </div>
                            <div className="w-1/5 text-xs leading-6 pl-8  font-semibold">
                                <p>Weight:</p>
                            </div>
                            <div className="w-1/5  text-xs leading-6  ">
                                <p>{patient.weight}</p>
                            </div>
                        </div>

                        <div className="w-full flex">
                            <div className="w-1/5 text-xs leading-6 pl-8 font-semibold">
                                <p>Gender:</p>
                            </div>
                            <div className="w-1/4 text-xs leading-6  ">
                                <p>{patient.gender}</p>
                            </div>
                            <div className="w-1/5 text-xs leading-6 pl-8  font-semibold">
                                <p>Height:</p>
                            </div>
                            <div className="w-1/5  text-xs leading-6  mb-2">
                                <p>{patient.height}</p>
                            </div>
                        </div>

                        <div className=' bg-[#4673FF] text-center text-sm text-white py-2 font-semibold'>
                            <h1>EMERGENCY CONTACT</h1>
                        </div>
                        <div className="w-full flex mt-2">
                            <div className="w-1/5 text-xs leading-6 pl-8 font-semibold">
                                <p>Name:</p>
                            </div>
                            <div className="w-1/4 text-xs leading-6  ">
                                <p>{patient.emergencyContact.name}</p>
                            </div>
                            <div className="w-1/5 text-xs leading-6 pl-8  font-semibold">
                                <p>Address:</p>
                            </div>
                            <div className="w-1/5 text-xs leading-5\6  ">
                                <p>{patient.emergencyContact.address}</p>
                            </div>
                        </div>

                        <div className="w-full flex mb-5">
                            <div className="w-1/5  text-xs leading-6 pl-8 font-semibold">
                                <p>Relationship:</p>
                            </div>
                            <div className="w-1/4  text-xs leading-6  ">
                                <p>{patient.emergencyContact.relationship}</p>     
                            </div>
                            <div className="w-1/5  text-xs leading-6 pl-8  font-semibold">
                                <p>Contact:</p>
                            </div>
                            <div className="w-1/5  text-xs leading-6 ">
                                <p>{patient.emergencyContact.contact}</p>
                            </div>
                        </div>
                    </section>
                </main>
   
   
         <main className='border-2 mt-5 rounded-xl shadow-lg px-3 pb-3'>
            <section className='flex-grow p-3'>
                <div className="w-full text-center flex justify-between items-center mb-2">
                    <h1 className='text-[#4673FF] text-lg font-bold'>LABORATORY RESULTS</h1>
                    <div className="text-right">
                        {(user.role === "Admin" || user.role === "Secretary") && (
                            <button onClick={addLab} className='bg-[#4673FF] text-white text-xs font-semibold py-2 rounded-lg transition-all duration-300 transform hover:bg-[#365ec4] hover:scale-105 hover:shadow-lg w-[130px]'>
                                NEW LAB REPORT
                            </button>
                        )}
                    </div>
                </div>
            </section>
            {patient.laboratory && patient.laboratory.length > 0 ? ( // Check if there are lab results
            <>
            <div className="w-96 py-3">
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Laboratory Test</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        label="Laboratory Test"
                        value={selectedTest}
                        onChange={handleSelectedTestChange}
                    >
                        {[...new Set(patient.laboratory.map(labResult => labResult.test.testName))].map((uniqueTestName, index) => (
                        <MenuItem key={index} value={uniqueTestName || "Unnamed"}>
                          {uniqueTestName || "Unnamed"}
                        </MenuItem>
                      ))}
                    </Select>
                </FormControl>
            </div>
            <div className='flex'>
                <div className="w-1/2 m-1 rounded-xl shadow-lg">
                    <ApexChart test={selectedTest} lab_results={patient.laboratory} />
                </div>
                <div className="w-1/2 m-1  relative flex flex-col">
                      <div className='rounded-xl shadow-lg h-[70%] mb-3'>
                      <LatestLab labResults={patient.laboratory} selectedTestType={selectedTest} />
                      </div>
                      
                    <div>{comparisonData && <Comparison data={comparisonData} />}</div>
                    
                </div>
               
            </div>
          
            </>
        
      ) : (
        <div className='w-full min-h-[200px] shadow-xl rounded-xl  flex justify-center items-center h-full text-sm text-center text-[#D3D3D3]'>
        No laboratory results recorded yet.
    </div>
      )}
    </main>
     
                <main className='border-2 mt-5 rounded-xl shadow-lg px-3 pb-3'>
                    <section className='flex-grow  p-3'>
                        <div className="w-full text-center flex justify-between items-center mb-2">
                            <h1 className='text-[#4673FF] text-lg font-bold '>GENERAL MEDICAL HISTORY</h1>
                            <div className=" text-right">
                            {(user.role === "Admin" || user.role === "Doctor" || user.role === "Secretary") && (
                                  <button onClick={addReport} className='bg-[#4673FF] text-white text-xs font-semibold  py-2 rounded-lg transition-all duration-300 transform hover:bg-[#365ec4] hover:scale-105 hover:shadow-lg w-[130px]'>NEW REPORT</button>
                              )}
                            
                            </div>
                        </div>
                      {patient.reports && patient.reports.length > 0 ? ( // Check if there are lab results
                  
                      patient.reports.slice().reverse().map((report, index) => (
                        <div key={index}className='bg-[#F3FAFF] rounded-xl p-1 mb-2'>
                            <div className="flex w-full   p-3 text-xs ">
                                <div className="w-1/5">
                                    <p className='text-[grey] font-semibold'>Date</p>
                                    <p className='font-semibold'>{report.date}</p>
                                </div>
                                <div className="flex-grow ">
                                    <p className='text-[grey] font-semibold'>Diagnosis</p>
                                    <p className='font-semibold'>{report.diagnosis}</p>
                                </div>
                            </div>
                            <div className="w-full h-2 border-b-2 border-[grey ] "></div>
                            <div className="w-full text-xs px-3 mt-2 ">
                            <table className='w-full text-white'>
                                <thead className='h-7  bg-[#4673FF] px-3 rounded-xl '>
                                    <tr>
                                    <th scope="col">Medication</th>
                                    <th scope="col">Dosage</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Frequency</th>
                                    <th scope="col">Instructions</th>
                                    </tr>
                                </thead>
                                <tbody className='text-black text-center'>
                                {report.prescriptions.map((medication, index) => (
                                    <tr className='border-b' key={index}>
                                        <td className='p-3'>{medication.medicationName}</td>
                                        <td className='p-3'>{medication.dosage}</td>
                                        <td className='p-3'>{medication.quantity}</td>
                                        <td className='p-3'>{medication.frequency}</td>
                                        <td className='p-3'>{medication.instructions}</td>
                                    </tr>
                                ))}

                                </tbody>
                            </table>
                            </div>
                        </div>
                      ))

                    ): (
                      <div className='w-full min-h-[200px]  rounded-xl  flex justify-center items-center h-full text-sm text-center text-[#D3D3D3]'>
                      No medical history found.
                  </div>
                    )}
                    </section>   
                </main>
            </div>
        </>
    );
}
export default ViewPatient