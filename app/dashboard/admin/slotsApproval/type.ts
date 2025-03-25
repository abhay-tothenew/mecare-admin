export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  doctorName: string;
  patientName: string;
  status: "pending" | "confirmed" | "cancelled";
}