"use client";
import React, { useState, useEffect } from "react";
import styles from "../../../styles/SlotsApproval.module.css";
import { TimeSlot, Appointment, Doctor } from "../slotsApproval/type";
import SuccessModal from "@/app/components/SuccessModal";
import { FaSpinner } from "react-icons/fa";
import { API_ENDPOINTS } from "@/app/utils/config";

const CancelledSlots = () => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Fetch appointments
        const appointmentsResponse = await fetch(
          API_ENDPOINTS.APPOINTMENTS
        );
        if (!appointmentsResponse.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const appointments: Appointment[] = await appointmentsResponse.json();

        // Filter only cancelled appointments
        const cancelledAppointments = appointments.filter(
          (appointment) => appointment.status === "cancelled"
        );

        const slotsWithDoctorDetails = await Promise.all(
          cancelledAppointments.map(async (appointment) => {
            const doctorResponse = await fetch(
              API_ENDPOINTS.DOCTOR_BY_ID(appointment.doctor_id)
            );
            if (!doctorResponse.ok) {
              throw new Error("Failed to fetch doctor details");
            }
            const doctor: Doctor = await doctorResponse.json();

            // Format the date from ISO string to YYYY-MM-DD
            const formattedDate = new Date(appointment.appointment_date)
              .toISOString()
              .split("T")[0];

            return {
              id: appointment.appointment_id,
              date: formattedDate,
              time: appointment.appointment_time,
              doctorName: doctor.doctor.name,
              patientName: appointment.patient_name || "Not specified",
              status: appointment.status as "cancelled",
            };
          })
        );

        setSlots(slotsWithDoctorDetails);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.spinner} />
        <p>Loading cancelled appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {successMessage && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
      <h1 className={styles.title}>Cancelled Appointments</h1>
      <div className={styles.slotsContainer}>
        {slots.map((slot) => (
          <div key={slot.id} className={styles.slotCard}>
            <div className={styles.slotHeader}>
              <h3>{slot.date}</h3>
              <span className={styles.time}>{slot.time}</span>
            </div>
            <div className={styles.slotDetails}>
              <p>
                <strong>Doctor:</strong> {slot.doctorName}
              </p>
              <p>
                <strong>Patient:</strong> {slot.patientName}
              </p>
            </div>
            <div className={styles.slotStatus}>
              <span className={`${styles.status} ${styles[slot.status]}`}>
                {slot.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CancelledSlots; 