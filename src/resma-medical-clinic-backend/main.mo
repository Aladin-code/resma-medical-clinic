import Text "mo:base/Text";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";

actor ResmaMedicalClinic{
    type Medication = {
      name: Text;
      dosage: Text;
      instructions: Text;
      refills: Nat;
    };

    type ClinicalFinding = {
      description: Text;
    };

    type Report = {
    date: Text;
    clinicalFindings: [ClinicalFinding];
    prescriptions: [Medication];
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
    reports: [Report];
  };

  type Appointment = {
    id: Text;
    timestamp: Int;
    name: Text;
    doctor: Text;
    purpose:Text;
    status: Text;
  };

  var patients = HashMap.HashMap<Text, Patient>(500, Text.equal, Text.hash);
  var appointments = HashMap. HashMap<Text, Appointment>(500, Text.equal, Text.hash);

   stable var patientsList: [(Text, Patient)] = [];
   stable var appointmentsList: [(Text,Appointment)] = [];


    for ((id, patient) in patientsList.vals()) {
      patients.put(id, patient)
    };

    for ((id, appointment) in appointmentsList.vals()) {
      appointments.put(id, appointment);
    };

    public func addPatient(
      id:Text, 
      lastName:Text,
      firstName:Text,
      middleName:Text,
      extName: Text,
      dateOfBirth: Text, 
      gender: Text, 
      address:Text, 
      contact: Text, 
      height:Text, 
      weight:Text, 
      emergencyContact: EmergencyContact):async Bool{
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
        reports = [];
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
  public func addAppointment(id:Text, timestamp:Int, name:Text, doctor:Text, purpose:Text, status: Text): async Bool{
    let appointment: Appointment = {
      id =id;
      timestamp = timestamp;
      name = name;
      doctor = doctor;
      purpose = purpose;
      status = status;
    };
    appointments.put(id, appointment);
    appointmentsList := Array.append(appointmentsList, [(id, appointment)]);
    return true;
  };
    public query func getAllPatients(): async [(Text, Patient)]{
        var entries: [(Text, Patient)] = [];
        let iterator = patients.entries();

         for (entry in iterator) {
          entries := Array.append(entries, [entry]);
         };
        return entries;
    };
    public query func getAllAppointments(): async [(Text, Appointment)]{
        var entries: [(Text, Appointment)] = [];
        let iterator = appointments.entries();

         for (entry in iterator) {
          entries := Array.append(entries, [entry]);
         };
        return entries;
    };
    public func updateStatus(id: Text, status: Text): async Bool{
        let maybeAppointment = appointments.get(id);
        switch maybeAppointment {
          case (?appointment){
            let updatedStatus = status;
            let updatedAppointment = {
              id = appointment.id;
              timestamp = appointment.timestamp;
              name = appointment.name;
              doctor = appointment.doctor;
              purpose = appointment.purpose;
              status = updatedStatus;
            };
             appointments.put(id, updatedAppointment); 
              // Update the patient in the patientsList as well
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
                    reports = updatedReports;
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
  public query func read(id: Text): async ?Patient {
    return patients.get(id);
  };
 public query func readAppointment(id: Text): async ?Appointment {
    return appointments.get(id);
  }
};
