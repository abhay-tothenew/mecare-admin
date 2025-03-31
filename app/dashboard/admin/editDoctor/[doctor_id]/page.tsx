import { API_ENDPOINTS } from "@/app/utils/config";
import EditDoctorForm from "../EditForm";

export default async function EditDoctor({
  params,
}: {
  params: Promise<{ doctor_id: string }>;
}) {
  const { doctor_id } = await params;

  // Fetch doctor data
  const response = await fetch(API_ENDPOINTS.DOCTOR_BY_ID(doctor_id));
  const data = await response.json();

  if (!data.success) {
    return (
      <div className="error-container">
        <p className="error-message">Failed to fetch doctor details</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Edit Doctor</h1>
      <EditDoctorForm doctor={data.doctor} />
    </div>
  );
}
