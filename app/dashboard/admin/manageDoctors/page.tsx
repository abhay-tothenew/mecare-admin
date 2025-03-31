"use client";
import React, { useState, useEffect } from "react";
import styles from "../../../styles/RemoveDoctors.module.css";
import { Doctor } from "./type";
import SuccessModal from "@/app/components/SuccessModal";
import { FaSpinner } from "react-icons/fa";
import { redirect, useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/app/utils/config";

const RemoveDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [removingDoctorId, setRemovingDoctorId] = useState<string | null>(null);
  const router = useRouter();

  const fetchDoctors = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.DOCTORS);
      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }
      const doctorsData = await response.json();
      //   console.log("doctorsData--->", doctorsData);

      // To Fetch slots for each doctor and update their status
      const doctorsWithStatus = await Promise.all(
        doctorsData.doctors.map(async (doctor: Doctor) => {
          //   console.log("doctor--->", doctor);
          try {
            const slotsResponse = await fetch(
              API_ENDPOINTS.SLOTS(doctor.doctor_id)
            );

            const slots = await slotsResponse.json();
            // console.log("slots--->", slots);

            if (!slots.success) {
              throw new Error("Failed to fetch slots");
            }
            return {
              ...doctor,
              status: slots.slots.length > 0 ? "active" : "inactive",
            };
          } catch (error) {
            console.error(
              `Error fetching slots for doctor ${doctor.id}:`,
              error
            );
            return {
              ...doctor,
              status: "inactive",
            };
          }
        })
      );

      setDoctors(doctorsWithStatus);
      setLoading(false);
    } catch (error) {
      console.log("error--->", error);
      setError("Failed to fetch doctors");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleRemove = async (id: string) => {
    setRemovingDoctorId(id);
    try {
      const response = await fetch(API_ENDPOINTS.DOCTOR_BY_ID(id), {
        method: "DELETE",
      });

      console.log("response--->", response);

      if (!response.ok) {
        throw new Error("Failed to delete doctor");
      }

      const data = await response.json();
      console.log("data--->", data);

      setShowSuccessModal(true);

      // Wait for 3 seconds before updating the UI
      setTimeout(() => {
        setDoctors(doctors.filter((doctor) => doctor.id !== id));
        setRemovingDoctorId(null);
        location.reload();
      }, 3000);
    } catch (error) {
      console.log("error--->", error);
      setError("Failed to delete doctor");
      setRemovingDoctorId(null);
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

  const handleEdit = (doctor_id: string) => {
    console.log("---",doctor_id)
    redirect(`/dashboard/admin/editDoctor/${doctor_id}`);
  };

  //   console.log("doctors--->", doctors[0].doctor_id);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Doctors</h1>
        <button 
          onClick={() => router.push("/dashboard/admin/addDoctors")} 
          className={styles.addDoctorButton}
        >
          Add Doctor
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialization</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.name}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.email}</td>
                <td>
                  <span className={`${styles.status} ${styles[doctor.status]}`}>
                    {doctor.status}
                  </span>
                </td>
                <td
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <button
                    onClick={() => handleRemove(doctor.doctor_id)}
                    className={`${styles.removeButton} ${
                      removingDoctorId === doctor.doctor_id
                        ? styles.removing
                        : ""
                    }`}
                    disabled={removingDoctorId === doctor.doctor_id}
                  >
                    {removingDoctorId === doctor.doctor_id ? (
                      <FaSpinner className={styles.buttonSpinner} />
                    ) : (
                      "Remove"
                    )}
                  </button>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit(doctor.doctor_id)}
                  >
                    Edit Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showSuccessModal && (
        <SuccessModal
          message="Doctor removed successfully!"
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default RemoveDoctors;
