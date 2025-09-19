'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTimeTracker } from '@/hooks/useTimeTracker'
import AuthSection from './AuthSection'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import Timetable from './Timetable'
import LogoutSection from './LogoutSection'
import styles from './TimeTracker.module.css'

const TimeTracker = () => {
  const { user, loading: authLoading } = useAuth()
  const {
    tasks,
    taskColors,
    loading: dataLoading,
    addTask,
    deleteTask,
    editTask,
    resetAll
  } = useTimeTracker()

  const [editIndex, setEditIndex] = useState<number | null>(null)

  if (authLoading) {
    return <div className={styles.loading}>로딩 중...</div>
  }

  return (
    <div className={styles.container}>
      <AuthSection />
      
      {user && (
        <div className={styles.mainCard}>
          <TaskForm
            onAddTask={addTask}
            onEditTask={editTask}
            onReset={resetAll}
            editIndex={editIndex}
            setEditIndex={setEditIndex}
            tasks={tasks}
            taskColors={taskColors}
          />
          
          <TaskList
            tasks={tasks}
            onDeleteTask={deleteTask}
            onEditTask={(index) => setEditIndex(index)}
          />
          
          <Timetable tasks={tasks} />
          
          <LogoutSection />
        </div>
      )}
    </div>
  )
}

export default TimeTracker
