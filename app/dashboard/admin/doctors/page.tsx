"use client";

import React, { useState, useEffect } from "react";
import styles from "../../../styles/Doctors.module.css";
import { FaSpinner } from "react-icons/fa";
import SuccessModal from "@/app/components/SuccessModal";
import { API_ENDPOINTS } from "@/app/utils/config";

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  status: "active" | "inactive";
}

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.DOCTORS);
      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }
      const data = await response.json();
      setDoctors(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (doctorId: string, newStatus: "active" | "inactive") => {
    try {
      setActionLoading(doctorId);
      const response = await fetch(API_ENDPOINTS.DOCTOR_BY_ID(doctorId), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update doctor status");
      }

      setDoctors(doctors.map(doctor => 
        doctor.id === doctorId ? { ...doctor, status: newStatus } : doctor
      ));

      setSuccessMessage(`Doctor ${newStatus === "active" ? "activated" : "deactivated"} successfully`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update doctor status");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.spinner} />
        <p>Loading doctors...</p>
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
      <h1 className={styles.title}>Manage Doctors</h1>
      <div className={styles.doctorsGrid}>
        {doctors.map((doctor) => (
          <div key={doctor.id} className={styles.doctorCard}>
            <div className={styles.doctorInfo}>
              <h3>{doctor.name}</h3>
              <p>{doctor.email}</p>
              <p className={styles.specialization}>{doctor.specialization}</p>
            </div>
            <div className={styles.doctorActions}>
              <span className={`${styles.status} ${styles[doctor.status]}`}>
                {doctor.status}
              </span>
              <button
                onClick={() => handleStatusChange(
                  doctor.id,
                  doctor.status === "active" ? "inactive" : "active"
                )}
                className={`${styles.actionButton} ${
                  doctor.status === "active" ? styles.deactivateButton : styles.activateButton
                } ${actionLoading === doctor.id ? styles.processing : ""}`}
                disabled={actionLoading === doctor.id}
              >
                {actionLoading === doctor.id ? (
                  <FaSpinner className={styles.buttonSpinner} />
                ) : (
                  doctor.status === "active" ? "Deactivate" : "Activate"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsPage; 