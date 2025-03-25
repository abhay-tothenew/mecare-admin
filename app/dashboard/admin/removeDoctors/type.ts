export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  doctor_id: string;
  status: 'active' | 'inactive';
}
