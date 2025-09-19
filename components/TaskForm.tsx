'use client'

import { useState, useEffect } from 'react'
import { ClientTask } from '@/lib/supabase'
import styles from './TaskForm.module.css'

interface TaskFormProps {
  onAddTask: (name: string, startTime: string, endTime: string) => Promise<void>
  onEditTask: (index: number, name: string, startTime: string, endTime: string) => Promise<void>
  onReset: () => Promise<void>
  editIndex: number | null
  setEditIndex: (index: number | null) => void
  tasks: ClientTask[]
  taskColors: Record<string, string>
}

const TaskForm = ({
  onAddTask,
  onEditTask,
  onReset,
  editIndex,
  setEditIndex,
  tasks,
  taskColors
}: TaskFormProps) => {
  const [taskName, setTaskName] = useState('')
  const [startHour, setStartHour] = useState('')
  const [startMin, setStartMin] = useState('')
  const [endHour, setEndHour] = useState('')
  const [endMin, setEndMin] = useState('')

  // 편집 모드일 때 폼 필드 채우기
  useEffect(() => {
    if (editIndex !== null && tasks[editIndex]) {
      const task = tasks[editIndex]
      setTaskName(task.name)
      const [sh, sm] = task.start.split(':')
      const [eh, em] = task.end.split(':')
      setStartHour(sh)
      setStartMin(sm)
      setEndHour(eh)
      setEndMin(em)
    }
  }, [editIndex, tasks])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!taskName) return

    // 시/분 입력값 보정
    const sh = startHour ? String(Number(startHour)).padStart(2, '0') : '00'
    const sm = startMin ? String(Number(startMin)).padStart(2, '0') : '00'
    const eh = endHour ? String(Number(endHour)).padStart(2, '0') : '00'
    const em = endMin ? String(Number(endMin)).padStart(2, '0') : '00'

    // 범위 체크 (8~22시만 허용)
    if (Number(sh) < 8 || Number(sh) > 22 || Number(eh) < 8 || Number(eh) > 22) {
      alert('시간은 8~22시 사이로 입력해주세요.')
      return
    }

    // 시작이 끝보다 늦으면 오류
    if (sh > eh || (sh === eh && sm > em)) {
      alert('시작 시간이 끝 시간보다 빠르거나 같아야 합니다.')
      return
    }

    const startTime = `${sh}:${sm}`
    const endTime = `${eh}:${em}`

    if (editIndex !== null) {
      // 수정 모드
      await onEditTask(editIndex, taskName, startTime, endTime)
      setEditIndex(null)
    } else {
      // 추가 모드
      await onAddTask(taskName, startTime, endTime)
    }

    // 폼 리셋
    setTaskName('')
    setStartHour('')
    setStartMin('')
    setEndHour('')
    setEndMin('')
  }

  const handleReset = async () => {
    await onReset()
    setTaskName('')
    setStartHour('')
    setStartMin('')
    setEndHour('')
    setEndMin('')
    setEditIndex(null)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.taskForm}>
      <input
        type="text"
        placeholder="할일"
        maxLength={10}
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        className={styles.taskInput}
        required
      />
      <input
        type="number"
        min="0"
        max="23"
        placeholder="시"
        value={startHour}
        onChange={(e) => setStartHour(e.target.value)}
        className={styles.timeInput}
        required
      />
      <span>:</span>
      <input
        type="number"
        min="0"
        max="59"
        placeholder="분"
        value={startMin}
        onChange={(e) => setStartMin(e.target.value)}
        className={styles.minInput}
      />
      <span>~</span>
      <input
        type="number"
        min="0"
        max="23"
        placeholder="시"
        value={endHour}
        onChange={(e) => setEndHour(e.target.value)}
        className={styles.timeInput}
        required
      />
      <span>:</span>
      <input
        type="number"
        min="0"
        max="59"
        placeholder="분"
        value={endMin}
        onChange={(e) => setEndMin(e.target.value)}
        className={styles.minInput}
      />
      <button type="submit" className={styles.formBtn}>
        +
      </button>
      <button type="button" onClick={handleReset} className={styles.formBtn}>
        R
      </button>
    </form>
  )
}

export default TaskForm
