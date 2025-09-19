'use client'

import { useAuth } from '@/contexts/AuthContext'
import styles from './LogoutSection.module.css'

const LogoutSection = () => {
  const { user, signOut } = useAuth()

  if (!user) return null

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <div className={styles.logoutContainer}>
      <span className={styles.logoutText} onClick={handleLogout}>
        log-out
      </span>
    </div>
  )
}

export default LogoutSection
