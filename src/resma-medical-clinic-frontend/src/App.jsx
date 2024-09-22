import { useState } from 'react';
import { resma_medical_clinic_backend } from 'declarations/resma-medical-clinic-backend';
import Dashboard from './pages/Dashboard.jsx';
import Records from './pages/Records.jsx';
import Appointments from './pages/Appointments.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddPatient from '././pages/sub-pages/AddPatient.jsx'
import UpdatePatient from '././pages/sub-pages/UpdatePatient.jsx'
import ViewPatient from '././pages/sub-pages/ViewPatient.jsx'
import AddReport from '././pages/sub-pages/AddReport.jsx'
import AddAppointment from '././pages/sub-pages/AddAppointment.jsx'
import UpdateAppointment from '././pages/sub-pages/UpdateAppointment.jsx'
import Sidebar from './pages/Sidebar.jsx';
import './tailwind.css';


function App() {
  return (
    <>
     <Sidebar />
    <Routes>
      <Route path="/" element={ <Dashboard />}></Route>
      <Route path="/records" element={ <Records />}></Route>
      <Route path="/appointments" element={ <Appointments />}></Route>
      <Route path="/addPatient" element={ <AddPatient />}></Route>
      <Route path="/viewPatient/:id" element={<ViewPatient />} />
      <Route path="/updatePatient/:id" element={ <UpdatePatient />}></Route>
      <Route path="/addReport" element={ <AddReport />}></Route>
      <Route path="/addAppointment" element={ <AddAppointment />}></Route>
      <Route path="/UpdateAppointment/:id" element={ <UpdateAppointment />}></Route>
    </Routes>
    </>
  );
}

export default App;
