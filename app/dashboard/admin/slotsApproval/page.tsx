"use client";
import React, { useState, useEffect } from "react";
import styles from "../../../styles/SlotsApproval.module.css";
import { TimeSlot, Appointment, Doctor } from "./type";
import { useAuth } from "@/app/utils/context/Authcontext";
import SuccessModal from "@/app/components/SuccessModal";
import { FaSpinner } from "react-icons/fa";
import { API_ENDPOINTS } from "@/app/utils/config";

const SlotsApproval = () => {
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
        const appointmentsResponse = await fetch(API_ENDPOINTS.APPOINTMENTS);
        if (!appointmentsResponse.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const appointments: Appointment[] = await appointmentsResponse.json();

        const slotsWithDoctorDetails = await Promise.all(
          appointments.map(async (appointment) => {
            const doctorResponse = await fetch(
              API_ENDPOINTS.DOCTOR_BY_ID(appointment.doctor_id)
            );
            if (!doctorResponse.ok) {
              throw new Error("Failed to fetch doctor details");
            }
            const doctor: Doctor = await doctorResponse.json();

            const formattedDate = new Date(appointment.appointment_date)
              .toISOString()
              .split("T")[0];

            return {
              id: appointment.appointment_id,
              date: formattedDate,
              time: appointment.appointment_time,
              doctorName: doctor.doctor.name,
              patientName: appointment.patient_name || "Not specified",
              status: appointment.status as
                | "pending"
                | "confirmed"
                | "cancelled",
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

  const handleChange = async (
    id: string,
    newStatus: "confirmed" | "cancelled"
  ) => {
    try {
      setActionLoading(id);
      const response = await fetch(API_ENDPOINTS.APPOINTMENT_BY_ID(id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update appointment status");
      }

      const data = await response.json();
      console.log("data--->", data);

      setSlots(
        slots.map((slot) =>
          slot.id === id ? { ...slot, status: newStatus } : slot
        )
      );

      setSuccessMessage(
        `Appointment ${
          newStatus === "confirmed" ? "approved" : "rejected"
        } successfully`
      );

      setTimeout(() => {
        setActionLoading(null);
      }, 3000);
    } catch (error) {
      console.log("error while changing status", error);
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
        <p>Loading appointments...</p>
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

  console.log("slots---", slots);

  return (
    <div className={styles.container}>
      {successMessage && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
      <h1 className={styles.title}>Appointment Slots Approval</h1>
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
                onClick={() => handleChange(slot.id, "confirmed")}
                className={`${styles.actionButton} ${styles.approveButton} ${
                  actionLoading === slot.id ? styles.processing : ""
                }`}
                disabled={
                  slot.status !== "pending" || actionLoading === slot.id
                }
              >
                {actionLoading === slot.id ? (
                  <FaSpinner className={styles.buttonSpinner} />
                ) : (
                  "Approve"
                )}
              </button>
              <button
                onClick={() => handleChange(slot.id, "cancelled")}
                className={`${styles.actionButton} ${styles.rejectButton} ${
                  actionLoading === slot.id ? styles.processing : ""
                }`}
                disabled={
                  slot.status !== "pending" || actionLoading === slot.id
                }
              >
                {actionLoading === slot.id ? (
                  <FaSpinner className={styles.buttonSpinner} />
                ) : (
                  "Reject"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlotsApproval;
