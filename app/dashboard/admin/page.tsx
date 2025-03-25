'use client';

import styles from '../../styles/Dashboard.module.css';
import { FaUserMd, FaUserMinus, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../utils/context/Authcontext';
import { useRouter } from 'next/navigation';
export default function Dashboard() {
    const router = useRouter();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Admin Dashboard</h1>
        <p className={styles.headerSubtitle}>
          Manage doctors, appointments and system settings from one central location.
        </p>
      </div>

      <div className={styles.cardsContainer}>
        <div className={styles.card} onClick={() => router.push('/dashboard/admin/addDoctors')}>
          <div className={styles.iconContainer}>
            <FaUserMd className={styles.icon} />
          </div>
          <h3 className={styles.cardTitle}>Add Doctor</h3>
          <p className={styles.cardDescription}>
            Add new healthcare providers to the system with their specialties and availability.
          </p>
        </div>

        <div className={styles.card} onClick={() => router.push('/dashboard/admin/removeDoctors')}>
          <div className={styles.iconContainer}>
            <FaUserMinus className={styles.icon} />
          </div>
          <h3 className={styles.cardTitle}>Remove Doctor</h3>
          <p className={styles.cardDescription}>
            Remove healthcare providers who are no longer associated with the platform.
          </p>
        </div>

        <div className={styles.card} onClick={() => router.push('/dashboard/admin/slotsApproval')}>
          <div className={styles.iconContainer}>
            <FaCheckCircle className={styles.icon} />
          </div>
          <h3 className={styles.cardTitle}>Slots Approval</h3>
          <p className={styles.cardDescription}>
            Review and approve new appointment and registration requests from providers.
          </p>
        </div>
      </div>

      <div className={styles.statsContainer}>
        <div className={styles.statsCard}>
          <p className={styles.statsTitle}>Total Doctors</p>
          <p className={styles.statsNumber}>12</p>
        </div>

        <div className={styles.statsCard}>
          <p className={styles.statsTitle}>Active Users</p>
          <p className={styles.statsNumber}>13</p>
        </div>
      </div>
    </div>
  );
}