'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import styles from './AuthSection.module.css'

const AuthSection = () => {
  const { user, signIn, signUp, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAuth = async () => {
    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요.')
      return
    }

    setIsLoading(true)
    if (user) {
      // 로그아웃
      await signOut()
    } else {
      // 로그인
      const { error } = await signIn(email, password)
      if (error) {
        alert('로그인 실패: ' + error.message)
      }
    }
    setIsLoading(false)
  }

  const handleSignUp = async () => {
    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요.')
      return
    }

    if (password.length < 6) {
      alert('비밀번호는 6자리 이상이어야 합니다.')
      return
    }

    setIsLoading(true)
    const { error } = await signUp(email, password)
    if (error) {
      alert('회원가입 실패: ' + error.message)
    } else {
      alert('회원가입 성공! 이메일 확인이 필요할 수 있습니다.')
    }
    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !user) {
      handleAuth()
    }
  }

  return (
    <>
      {!user && (
        <div className={styles.authContainer}>
          <div className={styles.authContent}>
            <div className={styles.loginSection}>
              <h3 className={styles.title}>로그인</h3>
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
              <br />
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className={styles.input}
                required
              />
              <br />
              <button
                onClick={handleAuth}
                disabled={isLoading}
                className={styles.authButton}
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
              <button
                onClick={handleSignUp}
                disabled={isLoading}
                className={styles.signupButton}
              >
                {isLoading ? '가입 중...' : '회원가입'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AuthSection
