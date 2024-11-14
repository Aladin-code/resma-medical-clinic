import Text "mo:base/Text";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";

// Define the types used in the actor
actor ResmaMedicalClinic {
    type Medication = {
        medicationName: Text;
        dosage: Text;
        quantity: Text;
        frequency: Text;
        instructions: Text;
    };

    type Report = {
        date: Text;
        diagnosis: Text;
        prescriptions: [Medication];
    };

    type Checkup = {
        date: Int;
    };

    type Result = {
        value: Float;
        unit: Text;
    };

    type Laboratory = {
        test: {
            date: Int;
            testName: Text;
            result: [Result];
        }
    };

    type EmergencyContact = {
        name: Text;
        relationship: Text;
        address: Text;
        contact: Text;
    };

    type Patient = {
        id: Text;
        lastName: Text;
        firstName: Text;
        middleName: Text;
        extName: Text;
        dateOfBirth: Text;
        gender: Text;
        address: Text;
        contact: Text;
        height: Text;
        weight: Text;
        emergencyContact: EmergencyContact;
        registrationDate: Text;
        reports: [Report];
        laboratory: [Laboratory];
        checkups: [Checkup];  
    };

    type Appointment = {
        id: Text;
        timestamp: Int;
        patientID: Text;
        name: Text;
        doctor: Text;
        purpose: Text;
        status: Text;
        duration: Int;
    };

    type User = {
        principalID: Principal;
        name: Text;
        specialization: Text;
        role: Text;
        status: Text;
    };

    var users = HashMap.HashMap<Principal, User>(500, Principal.equal, Principal.hash);
     // HashMaps to store patients, appointments, and users
    var patients = HashMap.HashMap<Text, Patient>(500, Text.equal, Text.hash);
    var appointments = HashMap.HashMap<Text, Appointment>(500, Text.equal, Text.hash);

    stable var patientsList: [(Text, Patient)] = [];
    stable var appointmentsList: [(Text, Appointment)] = [];
    stable var usersList: [(Principal, User)] = [];
    
     let adminPrincipal: Principal = Principal.fromText("4c5n7-lcy3e-5gcqk-ksbgp-2ihm3-uqopn-weliy-phhft-oho2q-2lryc-kae");
    // let doctorPrincipal: Principal = Principal.fromText("uhcpf-jc6sg-fefyq-6y7ji-5q2df-yl6fc-b6dim-j4sri-x2bv4-xsx5l-3ae");
    // let secretaryPrincipal: Principal = Principal.fromText("f6772-5hh27-jb7u5-hi4nx-lcvbu-legux-cme7o-mtjvk-wfahm-rrtpa-fae");
     let adminUser: User = {
        principalID = adminPrincipal;
        name = "Dra. Abegail G. Resma";  // Replace with actual admin name
        specialization = "Internist";  // Replace with actual specialization if needed
        role = "Admin";
        status = "Active";
    };
    users.put(adminPrincipal, adminUser);

      for ((id, user) in usersList.vals()) {
        users.put(id, user);
    }; 

    for ((id, patient) in patientsList.vals()) {
        patients.put(id, patient);
    }; 

    for ((id, appointment) in appointmentsList.vals()) {
        appointments.put(id, appointment);
    };
   
   public shared func authenticateUser(principalId: Principal): async Text {
    switch (users.get(principalId)) {
        case (?user) {
            if (user.status == "Active") {
                return "User is active.";
            } else {
                return "User is registered but inactive.";
            }
        };
        case null {
            return "User not found. Please register.";
        };
    }
};

public shared func registerUser(principalId: Principal, name: Text, specialization: Text, role: Text, status: Text): async Text {
            let newUser: User = {
                principalID = principalId;
                name = name;
                specialization = specialization;
                role = role;
                status = status; // Set default status to inactive
            };
            users.put(principalId, newUser);
             usersList := Array.filter(usersList, func(entry: (Principal, User)) : Bool {
                let (pid, _) = entry;
                pid != principalId;
            });
            usersList := Array.append(usersList, [(principalId, newUser)]);
            return "User registered but inactive.";
};

    public shared func getAuthenticatedUser(principalId: Principal): async ?User {
        switch(users.get(principalId)) {
            case (?user) {
                // If user exists, return the user details
                return ?user;
            };
            case null {
                // If user does not exist, return null
                return null;
            };
        }
    };
    public shared func getAllDoctors(): async [User] {
        var activeUsers: [User] = [];

        for ((_, user) in users.entries()) {
            if (user.status == "Active" and user.role == "Doctor") {
                activeUsers := Array.append<User>(activeUsers, [user]);
            }else if (user.status == "Active" and user.role == "Admin") {
                activeUsers := Array.append<User>(activeUsers, [user]);
            }
        };
        return activeUsers;
    };
     public shared func getAllUsers(): async [User] {
        var activeUsers: [User] = [];

        for ((_, user) in users.entries()) {
            
                activeUsers := Array.append<User>(activeUsers, [user]);
            
        };
        return activeUsers;
    };

    // public shared func authenticateUser(principal: Principal): async ?{ principal: Principal; name: Text; role: Text } {
   
public func updatePatient(
    id: Text, 
    lastName: Text,
    firstName: Text,
    middleName: Text,
    extName: Text,
    dateOfBirth: Text, 
    gender: Text, 
    address: Text, 
    contact: Text, 
    height: Text, 
    weight: Text, 
    emergencyContact: EmergencyContact,
    registrationDate: Text,
): async Bool {
    // Retrieve the patient from the map
    let maybePatient = patients.get(id);
    
    switch maybePatient {
        case (?patient) {
            // If the patient exists, retrieve the current reports, laboratory, and checkups
            let currentLab = patient.laboratory;
            let currentReport = patient.reports;
            let currentCheckup = patient.checkups;

            // Create the updated patient object with the new values and current data
            let updatepatient: Patient = {
                id = id;
                lastName = lastName;
                firstName = firstName;
                middleName = middleName;
                extName = extName;
                dateOfBirth = dateOfBirth;
                gender = gender;
                address = address;
                contact = contact;
                height = height;
                weight = weight;
                emergencyContact = emergencyContact;
                registrationDate = registrationDate;
                reports = currentReport;      // Existing reports
                laboratory = currentLab;      // Existing laboratory data
                checkups = currentCheckup;    // Existing checkups
            };

            // Update the patient in the HashMap
            patients.put(id, updatepatient);

            // Filter out the old patient record from the patientsList
            patientsList := Array.filter(patientsList, func(entry: (Text, Patient)) : Bool {
                let (pid, _) = entry;
                pid != id;
            });

            // Add the updated patient to the patientsList
            patientsList := Array.append(patientsList, [(id, patient)]);

            return true;
        };
        case null {
            // Return false if the patient was not found
            return false;
        };
    };
};



      // Function to add a new patient
    public func addPatient(
        id: Text, 
        lastName: Text,
        firstName: Text,
        middleName: Text,
        extName: Text,
        dateOfBirth: Text, 
        gender: Text, 
        address: Text, 
        contact: Text, 
        height: Text, 
        weight: Text, 
        emergencyContact: EmergencyContact,
        registrationDate: Text,
    ): async Bool {
        let patient: Patient = {
            id = id;
            lastName = lastName;
            firstName = firstName;
            middleName = middleName;
            extName = extName;
            dateOfBirth = dateOfBirth;
            gender = gender;
            address = address;
            contact = contact;
            height = height;
            weight = weight;
            emergencyContact = emergencyContact;
            registrationDate = registrationDate;
            reports = [];
            laboratory = [];
            checkups = [];

        };

        // Update the patient in the HashMap
        patients.put(id, patient);

        // Filter out the old patient record from the patientsList
        patientsList := Array.filter(patientsList, func(entry: (Text, Patient)) : Bool {
            let (pid, _) = entry;
            pid != id;
        });

        // Add the updated patient to the patientsList
        patientsList := Array.append(patientsList, [(id, patient)]);

        return true;
    };

    // Function to get all patients
    public query func getAllPatients(): async [(Text, Patient)] {
        var entries: [(Text, Patient)] = [];
        let iterator = patients.entries();

        for (entry in iterator) {
            entries := Array.append(entries, [entry]);
        };
        return entries;
    };

    // Function to get all appointments
    public query func getAllAppointments(): async [(Text, Appointment)] {
        var entries: [(Text, Appointment)] = [];
        let iterator = appointments.entries();

        for (entry in iterator) {
            entries := Array.append(entries, [entry]);
        };
        return entries;
    };

    // Function to update appointment status
    public func updateStatus(id: Text, status: Text): async Bool {
        let maybeAppointment = appointments.get(id);
        switch maybeAppointment {
            case (?appointment) {
                let updatedStatus = status;
                let updatedAppointment = {
                    id = appointment.id;
                    timestamp = appointment.timestamp;
                    patientID = appointment.patientID;
                    name = appointment.name;
                    doctor = appointment.doctor;
                    purpose = appointment.purpose;
                    status = updatedStatus;
                    duration = appointment.duration;
                };
                appointments.put(id, updatedAppointment); 
                
                // Update the appointment in the appointmentsList as well
                appointmentsList := Array.filter(appointmentsList, func(entry: (Text, Appointment)) : Bool {
                    let (pid, _) = entry;
                    pid != id;
                });
                appointmentsList := Array.append(appointmentsList, [(id, updatedAppointment)]);
                return true;
            };
            case null {
                return false;
            };
        }
    };

    // Function to add a laboratory result for a patient
    public func addLaboratory(patientId: Text, laboratory: Laboratory): async Bool {
        let maybeLab = patients.get(patientId);
        switch maybeLab {
            case (?patient) {
                let updatedLab = Array.append(patient.laboratory, [laboratory]);
                let updatedPatient = {
                    id = patient.id;
                    lastName = patient.lastName;
                    firstName = patient.firstName;
                    middleName = patient.middleName;
                    extName = patient.extName;
                    dateOfBirth = patient.dateOfBirth;
                    gender = patient.gender;
                    address = patient.address;
                    contact = patient.contact;
                    height = patient.height;
                    weight = patient.weight;
                    emergencyContact = patient.emergencyContact;
                    registrationDate = patient.registrationDate;
                    reports = patient.reports;
                    laboratory = updatedLab;
                    checkups = patient.checkups;
                };

                // Update the patient in the HashMap
                patients.put(patientId, updatedPatient);
                
                // Update the patient in the patientsList as well
                patientsList := Array.filter(patientsList, func(entry: (Text, Patient)) : Bool {
                    let (pid, _) = entry;
                    pid != patientId;
                });
                patientsList := Array.append(patientsList, [(patientId, updatedPatient)]);
                return true;
            };
            case null {
                return false;
            };
        }
    };

    
   public func addAppointment(id: Text, timestamp: Int, patientID: Text, name: Text, doctor: Text, purpose: Text, status: Text, duration:Int): async Bool {
    let appointment: Appointment = {
        id = id;
        timestamp = timestamp;
        patientID = patientID;
        name = name;
        doctor = doctor;
        purpose = purpose;
        status = status;
        duration = duration
    };

    appointments.put(id, appointment);
    appointmentsList := Array.append(appointmentsList, [(id, appointment)]);

    let maybePatient = patients.get(patientID);
    switch maybePatient {
        case (?patient) {
            // Create a new Checkup object
            let newCheckup: Checkup = {
                date = timestamp; 
            };

            // Update the checkups list
            let updatedCheckups = Array.append(patient.checkups, [newCheckup]);
            let updatedPatient = { 
                id = patient.id;
                lastName = patient.lastName;
                firstName = patient.firstName;
                middleName = patient.middleName;
                extName = patient.extName;
                dateOfBirth = patient.dateOfBirth;
                gender = patient.gender;
                address = patient.address;
                contact = patient.contact;
                height = patient.height;
                weight = patient.weight;
                emergencyContact = patient.emergencyContact;
                registrationDate = patient.registrationDate;
                reports = patient.reports;
                laboratory = patient.laboratory;
                checkups = updatedCheckups; // Update the checkups
            };

            // Update the patient in the HashMap
            patients.put(patientID, updatedPatient);
            
            // Update the patient in the patientsList as well
            patientsList := Array.filter(patientsList, func(entry: (Text, Patient)) : Bool {
                let (pid, _) = entry;
                pid != patientID;
            });
            patientsList := Array.append(patientsList, [(patientID, updatedPatient)]);
            return true;
        };
        case null {
            return false; // Patient not found
        };
    };

    return false; // Default return value
};


    // Function to add a report for a patient
    public func addReport(patientId: Text, report: Report): async Bool {
        let maybePatient = patients.get(patientId);
        switch maybePatient {
            case (?patient) {
                let updatedReports = Array.append(patient.reports, [report]);
                let updatedPatient = { 
                    id = patient.id;
                    lastName = patient.lastName;
                    firstName = patient.firstName;
                    middleName = patient.middleName;
                    extName = patient.extName;
                    dateOfBirth = patient.dateOfBirth;
                    gender = patient.gender;
                    address = patient.address;
                    contact = patient.contact;
                    height = patient.height;
                    weight = patient.weight;
                    emergencyContact = patient.emergencyContact;
                    registrationDate = patient.registrationDate;
                    reports = updatedReports;
                    laboratory = patient.laboratory;
                    checkups = patient.checkups;
                };

                // Update the patient in the HashMap
                patients.put(patientId, updatedPatient);
                
                // Update the patient in the patientsList as well
                patientsList := Array.filter(patientsList, func(entry: (Text, Patient)) : Bool {
                    let (pid, _) = entry;
                    pid != patientId;
                });
                patientsList := Array.append(patientsList, [(patientId, updatedPatient)]);
                return true;
            };
            case null {
                return false;
            };
        }
    };

    // Function to read a patient by ID
    public query func read(id: Text): async ?Patient {
        return patients.get(id);
    };

    // Function to read an appointment by ID
    public query func readAppointment(id: Text): async ?Appointment {
        return appointments.get(id);
    };

   public func deleteAllPatients(): async Bool {
    // Reinitialize the patients HashMap
    patients := HashMap.HashMap<Text, Patient>(500, Text.equal, Text.hash);
    
    // Clear the stable patientsList
    patientsList := [];
    
    return true;
};

// Function to delete all appointments
public func deleteAllAppointments(): async Bool {
    // Reinitialize the appointments HashMap
    appointments := HashMap.HashMap<Text, Appointment>(500, Text.equal, Text.hash);
    // Clear the stable appointmentsList
    appointmentsList := [];
    
    return true;
};

// Function to delete all appointments
public func deleteAllUsers(): async Bool {
    // Reinitialize the appointments HashMap
    users := HashMap.HashMap<Principal, User>(500, Principal.equal, Principal.hash);
    // Clear the stable appointmentsList
    usersList := [];
    
    return true;
};

public func initializeAdmin(): async Bool{
      users.put(adminPrincipal, adminUser);
       return true;
}
};
