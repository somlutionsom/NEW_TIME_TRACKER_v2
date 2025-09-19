'use client'

import { useState } from 'react'
import { ClientTask } from '@/lib/supabase'
import styles from './TaskList.module.css'

interface TaskListProps {
  tasks: ClientTask[]
  onDeleteTask: (index: number) => Promise<void>
  onEditTask: (index: number) => void
}

const TaskList = ({ tasks, onDeleteTask, onEditTask }: TaskListProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className={styles.taskListContainer}>
      <button
        className={`${styles.taskListToggle} ${isCollapsed ? styles.collapsed : styles.expanded}`}
        onClick={toggleCollapse}
      />
      <div className={`${styles.taskList} ${isCollapsed ? styles.collapsed : ''}`}>
        {tasks.map((task, index) => (
          <div key={index} className={styles.taskLabel}>
            <span
              className={styles.colorDot}
              style={{ backgroundColor: task.color }}
            />
            <span className={styles.taskName}>{task.name}</span>
            <button
              className={styles.deleteBtn}
              onClick={() => onDeleteTask(index)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TaskList
