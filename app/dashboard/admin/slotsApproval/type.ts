export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  doctorName: string;
  patientName: string;
  status: "pending" | "confirmed" | "cancelled";
}

export interface Appointment {
    id: number;
    appointment_id: string;
    doctor_id: string;
    status: string;
    appointment_date: string;
    appointment_time: string;
    patient_name: string | null;
  }
  
  export interface Doctor {
    doctor: {
      id: string;
      name: string;
    };
  }