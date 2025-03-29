"use client";
import React, { useState, useEffect } from "react";
import styles from "@/app/styles/Dashboard.module.css";
import { FaSpinner, FaUserMd, FaCalendarCheck, FaCalendarTimes } from "react-icons/fa";

interface DashboardStats {
  totalDoctors: number;
  activeDoctors: number;
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalDoctors: 0,
    activeDoctors: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [doctorsResponse, appointmentsResponse] = await Promise.all([
        fetch("http://localhost:5000/api/doctors"),
        fetch("http://localhost:5000/api/appointments"),
      ]);

      if (!doctorsResponse.ok || !appointmentsResponse.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const doctors = await doctorsResponse.json();
      const appointments = await appointmentsResponse.json();

      const doctorsWithStatus = await Promise.all(
              doctors.doctors.map(async (doctor: any) => {
                //   console.log("doctor--->", doctor);
                try {
                  const slotsResponse = await fetch(
                    `http://localhost:5000/api/slots/${doctor.doctor_id}`
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


            // console.log("---->",doctorsWithStatus);
      setStats({
        totalDoctors: doctors.doctors.length,
        activeDoctors: doctorsWithStatus.filter((d: any) => d.status === "active").length,
        totalAppointments: appointments.length,
        pendingAppointments: appointments.filter((a: any) => a.status === "pending").length,
        completedAppointments: appointments.filter((a: any) => a.status === "completed").length,
        cancelledAppointments: appointments.filter((a: any) => a.status === "cancelled").length,
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.spinner} />
        <p>Loading dashboard...</p>
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
      <h1 className={styles.title}>Dashboard Overview</h1>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaUserMd />
          </div>
          <div className={styles.statInfo}>
            <h3>Total Doctors</h3>
            <p>{stats.totalDoctors}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.active}`}>
            <FaUserMd />
          </div>
          <div className={styles.statInfo}>
            <h3>Active Doctors</h3>
            <p>{stats.activeDoctors}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.appointments}`}>
            <FaCalendarCheck />
          </div>
          <div className={styles.statInfo}>
            <h3>Total Appointments</h3>
            <p>{stats.totalAppointments}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.pending}`}>
            <FaCalendarTimes />
          </div>
          <div className={styles.statInfo}>
            <h3>Pending Approvals</h3>
            <p>{stats.pendingAppointments}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.completed}`}>
            <FaCalendarCheck />
          </div>
          <div className={styles.statInfo}>
            <h3>Completed Appointments</h3>
            <p>{stats.completedAppointments}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.cancelled}`}>
            <FaCalendarTimes />
          </div>
          <div className={styles.statInfo}>
            <h3>Cancelled Appointments</h3>
            <p>{stats.cancelledAppointments}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
