"use client";

import React, { useState } from "react";
import styles from "../../../styles/AddDoctors.module.css";
import { useAuth } from "@/app/utils/context/Authcontext";
import { useRouter } from "next/navigation";
import SuccessModal from "@/app/components/SuccessModal";
import { EditDoctorFormProps } from "./type";
import { API_ENDPOINTS } from "@/app/utils/config";

const EditDoctorForm = ({ doctor }: EditDoctorFormProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    name: doctor.name,
    email: doctor.email,
    specialization: doctor.specialization,
    qualification: doctor.qualification,
    experience: doctor.experience.toString(),
    phone: doctor.phone,
    location: doctor.location,
  });

  const handleSubmit = async () => {
    // console.log("--", doctor.doctor_id);
    const response = await fetch(
      API_ENDPOINTS.DOCTOR_BY_ID(doctor.doctor_id),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          specialization: formData.specialization,
          qualification: formData.qualification,
          experience: parseInt(formData.experience),
          location: formData.location,
          phone: formData.phone,
          email: formData.email,
        }),
      }
    );

    const data = await response.json();
    // console.log("data---", data);

    if (!data.success) {
      throw new Error(data.message || "Failed to update doctors");
    }

    setShowSuccessModal(true);

    setTimeout(() => {
      router.push("/dashboard/admin/manageDoctors");
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="specialization">Specialization</label>
          <select
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
          >
            <option value="">Select Specialization</option>
            <option value="cardiology">Cardiology</option>
            <option value="neurology">Neurology</option>
            <option value="orthopedics">Orthopedics</option>
            <option value="pediatrics">Pediatrics</option>
            <option value="dermatology">Dermatology</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="experience">Years of Experience</label>
          <input
            type="number"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="qualification">Qualification</label>
          <input
            type="text"
            id="qualification"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="location">Address</label>
          <textarea
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <button className={styles.submitButton} onClick={handleSubmit}>
          Update Doctor Details
        </button>
      </div>

      {showSuccessModal && (
        <SuccessModal
          message="Doctor details updated successfully!"
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default EditDoctorForm;
