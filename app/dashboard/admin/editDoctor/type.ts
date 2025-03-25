export interface Doctor {
    id: number;
    name: string;
    specialization: string;
    qualification: string;
    experience: number;
    location: string;
    phone: string;
    doctor_id: string;
    email: string;
  }
  
  export interface EditDoctorFormProps {
    doctor: Doctor;
  }