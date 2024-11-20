import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { resma_medical_clinic_backend } from 'declarations/resma-medical-clinic-backend';
import Dashboard from './pages/Dashboard.jsx';
import User from './pages/Users.jsx';
import Records from './pages/Records.jsx';
import Login from './pages/Login.jsx';
import Appointments from './pages/Appointments.jsx';
import AddPatient from './pages/sub-pages/AddPatient.jsx';
import Prints from './pages/sub-pages/Prints.jsx';
import UpdatePatient from './pages/sub-pages/UpdatePatient.jsx';
import ViewPatient from './pages/sub-pages/ViewPatient.jsx';
import AddReport from './pages/sub-pages/AddReport.jsx';
import AddAppointment from './pages/sub-pages/AddAppointment.jsx';
import UpdateAppointment from './pages/sub-pages/UpdateAppointment.jsx';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import './tailwind.css';
import logo from './assets/resma.png';
import Swal from 'sweetalert2';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);  // Loading state
  const [status, setStatus] = useState('');
  const [userInfo, setUserInfo] = useState(null); // Store user information
  const [swalTrial , setTrial] = useState(true); 
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
          const userStatus = await resma_medical_clinic_backend.authenticateUser(principalObj);

          if (userStatus === "User is active.") {
              console.log("Authenticated and active user:", userStatus);
              setIsAuthenticated(true);
              localStorage.setItem('isAuthenticated', 'true');
              const userDetails = await resma_medical_clinic_backend.getAuthenticatedUser(principalObj);
              setUserInfo(userDetails);
          } else if (userStatus === "User is registered but inactive.") {
              Swal.fire({
                  title: 'Account Pending Approval',
                  text: "Your account has been registered but is awaiting admin approval. You’ll be notified once it’s verified.",
                  icon: 'info',
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#4673FF'
              });
              setIsAuthenticated(false);
              setStatus("User registered but inactive. Awaiting admin approval.");
          } else {
              console.error("User not found.");
              setIsAuthenticated(false);
            //   Swal.fire({
            //       title: 'Account Not Registered',
            //       text: 'It appears you do not have an account yet. Would you like to register?',
            //       icon: 'warning',
            //       showCancelButton: true,
            //       confirmButtonText: 'Register',
            //       confirmButtonColor: '#4673FF',
            //       cancelButtonText: 'Cancel'
            //   }).then((result) => {
            //       if (result.isConfirmed) {
            //           navigate('/login');
            //       }
            //   });
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
    setLoading(true);
    console.log(loading);
    try {
       
        const authClient = await AuthClient.create();
        await authClient.login({
            onSuccess: async () => {
                const principal = authClient.getIdentity().getPrincipal();
                console.log(principal);
                const principalObj = Principal.fromText(principal.toString());
                const userStatus = await resma_medical_clinic_backend.authenticateUser(principalObj);
             console.log(principal.toText());
                console.log("Backend response:", userStatus);  // Log backend response here
                if (userStatus === "User is active.") {

                    console.log("User logged in successfully:", userStatus);
                    setIsAuthenticated(true);
                    localStorage.setItem('isAuthenticated', 'true');
                    const userDetails = await resma_medical_clinic_backend.getAuthenticatedUser(principalObj);
                   
                   // Navigate to the dashboard or home page
                   if(userDetails){
                    setUserInfo(userDetails);
                    navigate('/'); 
                    setLoading(false);
                   }
                } else if (userStatus === "User is registered but inactive.") {
                    
                    setLoading(true);
                    Swal.fire({
                        title: 'Acces Denied!',
                        html: `
                            <p>Your account has been created and is pending approval. Thank you for your patience!</p>
                        `,
                        icon: 'warning',
                        confirmButtonText: 'Okay',
                        confirmButtonColor: '#4673FF'
                    });
                    setIsAuthenticated(false);
                    setStatus("User registered but inactive. Awaiting admin approval.");
                    setLoading(false);
                } else {
                    setLoading(false);
                    console.log("Principal", principal);
                    Swal.fire({
                        title: 'User Not Registered',
                        text: 'Would you like to register a new account?',
                        icon: 'info',
                        showCancelButton: true,
                        confirmButtonText: 'Register',
                        confirmButtonColor: '#4673FF',
                        cancelButtonText: 'Cancel'
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            // Show a second prompt to get the name and specialization
                            const { value: formValues,isDismissed } = await Swal.fire({
                              
                                html:
                                    '<h1 class=" mb-4 w-full uppercase text-xl font-[800]  tracking-wide text-[#4673FF]">ACCOUNT REGISTRATION</h1>'+
                                    '<div class="w-full text-left mb-[-2]"><p class=" text-xs text-gray">Please fill out the required information below</p></div>'+
                                    '<div class="w-full text-left text-black"><p class="text-sm font-[600] mb-[2px]    ">Complete Name<span class="text-[red] text-lg">*</span></p></div>'+
                                    '<input class="text-black mb-[1px]  bg-[#E9E9E9] rounded-[5px] h-[35px] w-full border-2 border-[#858796]-300 rounded focus:outline-none input-placeholder-padding" id="swal-input1" class="swal2-input"  autocomplete="off">' +
                                    '<div class="w-full text-left mb-[-2] text-black"><p class="text-sm font-[600]">Specialization<span class="text-[red] text-lg">*</span></p></div>'+
                                    '<input class="h-[35px] bg-[#E9E9E9] rounded-[5px]  w-full border-2 border-[#858796]-300 rounded  focus:outline-none input-placeholder-padding" id="swal-input2" class="swal2-input"  autocomplete="off">',
                                focusConfirm: false,
                                showCancelButton: true,
                                confirmButtonText: 'REGISTER',
                                cancelButtonText: 'CANCEL',
                                confirmButtonColor: '#4673FF',
                                width: '450px', 
                                padding: '10px',
                                customClass: {
                                  
                                    cancelButton: 'custom-cancel-button', // Apply custom class
                                    confirmButton: 'custom-swal-button',
                                  },
                               
                                preConfirm: () => {
                                    const name = document.getElementById('swal-input1').value;
                                    const specialization = document.getElementById('swal-input2').value;
                                    if (!name || !specialization) {
                                        Swal.showValidationMessage('<span class="custom-validation">Please enter both name and specialization</span>');
                                        return false;
                                    }
                                    return { name, specialization };
                                },
                                
                            });
                    
                            if (formValues) {
                                // Proceed to register user with inputted name and specialization
                                const { name, specialization } = formValues;
                                const registrationStatus = await resma_medical_clinic_backend.registerUser(
                                    principalObj,
                                    name,
                                    specialization,
                                    "User",
                                    "pending" // Default role
                                );
                    
                                if (registrationStatus === "User registered but inactive.") {
                                    Swal.fire({
                                        title: 'Registration Successful!',
                                        text: `Account created. Awaiting admin approval.`,
                                        icon: 'success',
                                        confirmButtonText: 'OK',
                                        confirmButtonColor: '#4673FF'
                                    });
                                }
                            }else if (isDismissed) {
                                // Set loading to false if registration form is canceled
                                setLoading(false);
                            }
                        }else{
                            setLoading(false);
                        }
                    });
                    
                  
                }
            },
            onError: (error) => {
                console.error('Login failed: ', error);
                setStatus(`Login failed: ${error.message || 'Please try again.'}`);
                setLoading(false);
            }
        });
    } catch (error) {
        console.error('Login error: ', error);
        setStatus('Login failed. Please try again.');
    } finally {
        // setLoading(false);
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
console.log(isAuthenticated);
  return (
            <div className="flex justify-center items-center h-screen">
                <img className="shadow-xl rounded-xl animate-pulse" src={logo} alt="Loading..." width="200px" />
            </div>
        );
}

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Dashboard userInfo={userInfo} handleLogout={handleLogout}/> : <Navigate to="/login" />} />
      <Route path="/users" element={isAuthenticated ? <User userInfo={userInfo} handleLogout={handleLogout}/> : <Navigate to="/login" />} />
      <Route path="/records" element={isAuthenticated ? <Records userInfo={userInfo} handleLogout={handleLogout}/> : <Navigate to="/login" />} />
      <Route path="/appointments" element={isAuthenticated ? <Appointments userInfo={userInfo} handleLogout={handleLogout}/> : <Navigate to="/login" />} />
      <Route path="/records/addPatient" element={isAuthenticated ? <AddPatient userInfo={userInfo} handleLogout={handleLogout}/> : <Navigate to="/login" />} />
      <Route path="/records/viewPatient/:id" element={isAuthenticated ? <ViewPatient userInfo={userInfo} handleLogout={handleLogout}/> : <Navigate to="/login" />} />
      <Route path="/records/updatePatient/:id" element={isAuthenticated ? <UpdatePatient userInfo={userInfo} handleLogout={handleLogout}/> : <Navigate to="/login" />} />
      <Route path="/addReport" element={isAuthenticated ? <AddReport userInfo={userInfo} handleLogout={handleLogout}/> : <Navigate to="/login" />} />
      <Route path="appointments/addAppointment" element={isAuthenticated ? <AddAppointment userInfo={userInfo} handleLogout={handleLogout}/> : <Navigate to="/login" />} />
      <Route path="appointments/updateAppointment/:id" element={isAuthenticated ? <UpdateAppointment userInfo={userInfo} handleLogout={handleLogout}/> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login handleLogin={handleLogin} status={status} />} />
      <Route path="/prints" element={isAuthenticated ? <Prints userInfo={userInfo} handleLogout={handleLogout}/> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
