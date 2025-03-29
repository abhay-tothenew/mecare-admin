"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/utils/context/Authcontext';
import { FaHome, FaUserMd, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import styles from '../styles/Sidebar.module.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/dashboard/admin', label: 'Dashboard', icon: <FaHome /> },
    { path: '/dashboard/admin/manageDoctors', label: 'Manage Doctors', icon: <FaUserMd /> },
    { path: '/dashboard/admin/slotsApproval', label: 'Slots Approval', icon: <FaUserMd /> },
    { path: '/dashboard/admin/approvedSlots', label: 'Confirmed', icon: <FaUserMd /> },
    { path: '/dashboard/admin/cancelledSlots', label: 'Cancelled', icon: <FaUserMd /> },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <button 
        className={styles.menuButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.logo}>
          <h2>Mecare Admin</h2>
        </div>
        
        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`${styles.navLink} ${pathname === item.path ? styles.active : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button className={styles.logoutButton} onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
};

export default Sidebar; 