import TimeTracker from '@/components/TimeTracker'
import { AuthProvider } from '@/contexts/AuthContext'

export default function Home() {
  return (
    <AuthProvider>
      <TimeTracker />
    </AuthProvider>
  )
}