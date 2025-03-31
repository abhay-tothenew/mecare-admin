"use client";
import React, { useState, useEffect } from "react";
import styles from "../../../styles/SlotsApproval.module.css";
import { TimeSlot, Appointment, Doctor } from "../slotsApproval/type";
import { useAuth } from "@/app/utils/context/Authcontext";
import SuccessModal from "@/app/components/SuccessModal";
import { FaSpinner } from "react-icons/fa";
import { API_ENDPOINTS } from "@/app/utils/config";

const ApprovedSlots = () => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { user } = useAuth();

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

        // Filter only confirmed appointments
        const confirmedAppointments = appointments.filter(
          (appointment) => appointment.status === "confirmed"
        );

        const slotsWithDoctorDetails = await Promise.all(
          confirmedAppointments.map(async (appointment) => {
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
              status: appointment.status as "confirmed",
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

  const handleComplete = async (id: string) => {
    try {
      setActionLoading(id);
      const response = await fetch(
        API_ENDPOINTS.APPOINTMENT_BY_ID(id),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            status: "completed",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update appointment status");
      }

      // Remove the completed appointment from the list
      setSlots(slots.filter((slot) => slot.id !== id));

      setSuccessMessage("Appointment marked as completed successfully");

      setTimeout(() => {
        setActionLoading(null);
      }, 3000);
    } catch (error) {
      console.log("error while completing appointment", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update appointment status"
      );
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.spinner} />
        <p>Loading confirmed appointments...</p>
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
      <h1 className={styles.title}>Confirmed Appointments</h1>
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
            <div className={styles.slotActions}>
              <button
                onClick={() => handleComplete(slot.id)}
                className={`${styles.actionButton} ${styles.approveButton} ${
                  actionLoading === slot.id ? styles.processing : ""
                }`}
                disabled={actionLoading === slot.id}
              >
                {actionLoading === slot.id ? (
                  <FaSpinner className={styles.buttonSpinner} />
                ) : (
                  "Mark as Completed"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovedSlots;
