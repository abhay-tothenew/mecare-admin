"use client";
import React, { useState } from "react";
import styles from "../../../styles/AddDoctors.module.css";
import { useAuth } from "@/app/utils/context/Authcontext";
import { API_ENDPOINTS } from "@/app/utils/config";

const AddDoctors = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    qualification: "",
    experience: "",
    phone: "",
    location: "",
  });

  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("formdata--->", user);
   
    // console.log("req_body--->", req_body);

    try {
      const response = await fetch(API_ENDPOINTS.DOCTORS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },

        body: JSON.stringify({
          name: formData.name,
          specialization: formData.specialization,
          qualification: formData.qualification,
          experience: formData.experience,
          location: formData.location,
          phone: formData.phone,
          email: formData.email,
        }),
      });

      const data = await response.json();
      // console.log("data--->", data);

      if (!data.success) {
        throw new Error("Invalid Credentials");
      }
    } catch (error) {
      console.log("error while adding doctor", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
  //   }
  // };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add New Doctor</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
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
            <option value="General Physician">General Physician</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
            <option value="Pediatrician">Pediatrician</option>
            <option value="Psychiatrist">Psychiatrist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="ENT Specialist">ENT Specialist</option>
            <option value="Dentist">Dentist</option>
            <option value="Diabetologist">Diabetologist</option>
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

        <button type="submit" className={styles.submitButton}>
          Add Doctor
        </button>
      </form>
    </div>
  );
};

export default AddDoctors;
