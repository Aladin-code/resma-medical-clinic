import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { resma_medical_clinic_backend } from 'declarations/resma-medical-clinic-backend';
import Dashboard from './pages/Dashboard.jsx';
import Records from './pages/Records.jsx';
import Login from './pages/Login.jsx';
import Appointments from './pages/Appointments.jsx';
import AddPatient from './pages/sub-pages/AddPatient.jsx';
import UpdatePatient from './pages/sub-pages/UpdatePatient.jsx';
import ViewPatient from './pages/sub-pages/ViewPatient.jsx';
import AddReport from './pages/sub-pages/AddReport.jsx';
import AddAppointment from './pages/sub-pages/AddAppointment.jsx';
import UpdateAppointment from './pages/sub-pages/UpdateAppointment.jsx';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import './tailwind.css';
import logo from './assets/resma.png';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);  // Loading state
  const [status, setStatus] = useState('');
  const [userInfo, setUserInfo] = useState(null); // Store user information
  const navigate = useNavigate();

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      const authClient = await AuthClient.create();
      const isAuth = await authClient.isAuthenticated();
  
      if (isAuth) {
        const principal = authClient.getIdentity().getPrincipal().toString();
        console.log('Principal:', principal);
        const storedPrincipal = localStorage.getItem('principal');
  
        // Principal consistency check
        if (!storedPrincipal) {
          localStorage.setItem('principal', principal);
        } else if (storedPrincipal !== principal) {
          console.error("Principal mismatch detected. Logging out.");
          await authClient.logout();
          setIsAuthenticated(false);
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('principal');
          navigate('/login');
          return;
        }
  
        // Authenticate user with backend
        const principalObj = Principal.fromText(principal);
        const userDetails = await resma_medical_clinic_backend.authenticateUser(principalObj);
  
        // If userDetails is null or undefined, redirect to login
        if (userDetails.length === 0) { // Strict check for null
          console.error("User authentication failed. Redirecting to login.");
          await authClient.logout();
          setIsAuthenticated(false);
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('principal');
          navigate('/login');
        } else {
          console.log("Authenticated user:", userDetails);
          setUserInfo(userDetails);
          setIsAuthenticated(true);
          localStorage.setItem('isAuthenticated', 'true');
        }
      } else {
        console.log('User is not authenticated');
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('principal');
      }
    } catch (error) {
      console.error('Error checking authentication status: ', error);
    } finally {
      setLoading(false);
    }
  };
  
  
  
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      checkAuthStatus();  // Validate principal on each load
    } else {
      setLoading(false); // No need to check if not authenticated
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true); // Start loading immediately
    try {
      const authClient = await AuthClient.create();
      await authClient.login({
        onSuccess: async () => {
          const principal = authClient.getIdentity().getPrincipal();
          console.log('Principal:', principal.toString());
          const principalObj = Principal.fromText(principal.toString());
  
          // Call backend to authenticate and get user details
          const userDetails = await resma_medical_clinic_backend.authenticateUser(principalObj);
  
          if (userDetails.length === 0) {
            console.error("User authentication failed. Logging out.");
            await authClient.logout();
            setStatus('Login failed. Please try again.');
          } else {
            console.log('User logged in successfully:', userDetails);
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
            setUserInfo(userDetails);  // Store user info
            setLoading(false); // Turn off loading after successful login
            navigate('/');  // Navigate to the dashboard or home page
          }
        },
        onError: (error) => {
          console.error('Login failed: ', error);
          setStatus(`Login failed: ${error.message || 'Please try again.'}`);
          setLoading(false); // Turn off loading after failure
        }
      });
    } catch (error) {
      console.error('Login error: ', error);
      setStatus('Login failed. Please try again.');
      setLoading(false); // Turn off loading on error
    }
  };
  
  const handleLogout = async () => {
    const authClient = await AuthClient.create();
    await authClient.logout();
    setIsAuthenticated(false);
    setUserInfo(null); // Clear user info on logout
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('principal'); // Clear stored principal
    navigate('/login');
  };

  if (loading) {
    return <div className='h-screen w-full flex justify-center items-center transition-all duration-700 ease-in-out '><img className='shadow-xl rounded-xl animate-subtle-spin' src={logo} alt="logo" width="200px" /></div>;  // Show loading screen while checking auth status
  }

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Dashboard userInfo={userInfo} handleLogout={handleLogout}/> : <Navigate to="/login" />} />
      <Route path="/records" element={isAuthenticated ? <Records userInfo={userInfo} handleLogout={handleLogout}/> : <Navigate to="/login" />} />
      <Route path="/appointments" element={isAuthenticated ? <Appointments userInfo={userInfo} handleLogout={handleLogout}/> : <Navigate to="/login" />} />
      <Route path="/addPatient" element={isAuthenticated ? <AddPatient userInfo={userInfo} handleLogout={handleLogout}/> : <Navigate to="/login" />} />
      <Route path="/viewPatient/:id" element={isAuthenticated ? <ViewPatient userInfo={userInfo} handleLogout={handleLogout}/> : <Navigate to="/login" />} />
      <Route path="/updatePatient/:id" element={isAuthenticated ? <UpdatePatient userInfo={userInfo} handleLogout={handleLogout}/> : <Navigate to="/login" />} />
      <Route path="/addReport" element={isAuthenticated ? <AddReport userInfo={userInfo} handleLogout={handleLogout}/> : <Navigate to="/login" />} />
      <Route path="/addAppointment" element={isAuthenticated ? <AddAppointment userInfo={userInfo} handleLogout={handleLogout}/> : <Navigate to="/login" />} />
      <Route path="/updateAppointment/:id" element={isAuthenticated ? <UpdateAppointment userInfo={userInfo} handleLogout={handleLogout}/> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login handleLogin={handleLogin} status={status} />} />
    </Routes>
  );
}

export default App;
