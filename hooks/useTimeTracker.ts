'use client'

import { useState, useEffect } from 'react'
import { supabase, ClientTask } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

// 파스텔톤 색상 배열
const pastelColors = [
  "#FFD6E0", "#FFECB3", "#B2EBF2", "#C8E6C9", "#FFF9C4",
  "#F8BBD0", "#B3E5FC", "#D1C4E9", "#FFCCBC", "#E1BEE7",
  "#FCE4EC", "#E0F7FA", "#FFFDE7", "#F3E5F5", "#E0F2F1"
]

export const useTimeTracker = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<ClientTask[]>([])
  const [taskColors, setTaskColors] = useState<Record<string, string>>({})
  const [colorIndex, setColorIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  // 사용자 데이터 로드
  const loadUserData = async () => {
    if (!user) return

    setLoading(true)
    try {
      // 사용자 설정 로드
      const { data: settings } = await supabase
        .from('time_tracker_settings')
        .select('color_index')
        .eq('user_id', user.id)
        .eq('app_name', 'time-tracker')
        .single()
      
      if (settings) {
        setColorIndex(settings.color_index)
      }

      // 색상 설정 로드
      const { data: colors } = await supabase
        .from('time_tracker_colors')
        .select('task_name, color')
        .eq('user_id', user.id)
        .eq('app_name', 'time-tracker')
      
      if (colors) {
        const colorMap: Record<string, string> = {}
        colors.forEach(item => {
          colorMap[item.task_name] = item.color
        })
        setTaskColors(colorMap)
      }

      // 작업 데이터 로드
      const { data: tasksData } = await supabase
        .from('time_tracker_tasks')
        .select('name, start_time, end_time, color')
        .eq('user_id', user.id)
        .eq('app_name', 'time-tracker')
        .order('created_at', { ascending: true })
      
      if (tasksData) {
        const clientTasks: ClientTask[] = tasksData.map(task => ({
          name: task.name,
          start: task.start_time,
          end: task.end_time,
          color: task.color
        }))
        setTasks(clientTasks)
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  // 특정 데이터로 저장하는 함수
  const saveUserDataWithTasks = async (tasksToSave: ClientTask[], colorsToSave: Record<string, string>, colorIdx: number) => {
    if (!user) return

    try {
      // 설정 저장 (upsert)
      await supabase
        .from('time_tracker_settings')
        .upsert({
          user_id: user.id,
          app_name: 'time-tracker',
          color_index: colorIdx
        }, {
          onConflict: 'user_id,app_name'
        })

      // 기존 데이터 삭제 후 새로 저장
      await supabase
        .from('time_tracker_tasks')
        .delete()
        .eq('user_id', user.id)
        .eq('app_name', 'time-tracker')

      await supabase
        .from('time_tracker_colors')
        .delete()
        .eq('user_id', user.id)
        .eq('app_name', 'time-tracker')

      // 작업 데이터 저장
      if (tasksToSave.length > 0) {
        const tasksData = tasksToSave.map(task => ({
          user_id: user.id,
          app_name: 'time-tracker',
          name: task.name,
          start_time: task.start,
          end_time: task.end,
          color: task.color
        }))

        await supabase
          .from('time_tracker_tasks')
          .insert(tasksData)
      }

      // 색상 데이터 저장
      const colorEntries = Object.entries(colorsToSave).map(([taskName, color]) => ({
        user_id: user.id,
        app_name: 'time-tracker',
        task_name: taskName,
        color: color
      }))

      if (colorEntries.length > 0) {
        await supabase
          .from('time_tracker_colors')
          .insert(colorEntries)
      }
    } catch (error) {
      console.error('데이터 저장 실패:', error)
    }
  }

  // 사용자 데이터 저장
  const saveUserData = async () => {
    if (!user) return

    try {
      // 설정 저장 (upsert)
      await supabase
        .from('time_tracker_settings')
        .upsert({
          user_id: user.id,
          app_name: 'time-tracker',
          color_index: colorIndex
        }, {
          onConflict: 'user_id,app_name'
        })

      // 기존 데이터 삭제 후 새로 저장
      await supabase
        .from('time_tracker_tasks')
        .delete()
        .eq('user_id', user.id)
        .eq('app_name', 'time-tracker')

      await supabase
        .from('time_tracker_colors')
        .delete()
        .eq('user_id', user.id)
        .eq('app_name', 'time-tracker')

      // 작업 데이터 저장
      if (tasks.length > 0) {
        const tasksToSave = tasks.map(task => ({
          user_id: user.id,
          app_name: 'time-tracker',
          name: task.name,
          start_time: task.start,
          end_time: task.end,
          color: task.color
        }))

        await supabase
          .from('time_tracker_tasks')
          .insert(tasksToSave)
      }

      // 색상 데이터 저장
      const colorsToSave = Object.entries(taskColors).map(([taskName, color]) => ({
        user_id: user.id,
        app_name: 'time-tracker',
        task_name: taskName,
        color: color
      }))

      if (colorsToSave.length > 0) {
        await supabase
          .from('time_tracker_colors')
          .insert(colorsToSave)
      }
    } catch (error) {
      console.error('데이터 저장 실패:', error)
    }
  }

  // 할 일 추가
  const addTask = async (name: string, startTime: string, endTime: string) => {
    let newColor = taskColors[name]
    let newColorIndex = colorIndex

    if (!newColor) {
      newColor = pastelColors[colorIndex % pastelColors.length]
      setTaskColors(prev => ({ ...prev, [name]: newColor }))
      newColorIndex = colorIndex + 1
      setColorIndex(newColorIndex)
    }

    const newTask: ClientTask = {
      name,
      start: startTime,
      end: endTime,
      color: newColor
    }

    const newTasks = [...tasks, newTask]
    setTasks(newTasks)

    // 즉시 저장
    if (user) {
      await saveUserDataWithTasks(newTasks, { ...taskColors, [name]: newColor }, newColorIndex)
    }
  }

  // 할 일 삭제
  const deleteTask = async (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index)
    setTasks(newTasks)

    // 즉시 저장
    if (user) {
      await saveUserDataWithTasks(newTasks, taskColors, colorIndex)
    }
  }

  // 할 일 수정
  const editTask = async (index: number, name: string, startTime: string, endTime: string) => {
    const updatedTask: ClientTask = {
      name,
      start: startTime,
      end: endTime,
      color: taskColors[name] || pastelColors[colorIndex % pastelColors.length]
    }

    const newTasks = tasks.map((task, i) => i === index ? updatedTask : task)
    setTasks(newTasks)

    // 즉시 저장
    if (user) {
      await saveUserDataWithTasks(newTasks, taskColors, colorIndex)
    }
  }

  // 전체 리셋
  const resetAll = async () => {
    setTasks([])
    setTaskColors({})
    setColorIndex(0)

    // 즉시 저장
    if (user) {
      await saveUserDataWithTasks([], {}, 0)
    }
  }

  // 사용자 로그인 시 데이터 로드
  useEffect(() => {
    if (user) {
      loadUserData()
    } else {
      setTasks([])
      setTaskColors({})
      setColorIndex(0)
    }
  }, [user])

  // 자동 저장 제거 - 각 액션에서 직접 저장하도록 변경

  return {
    tasks,
    taskColors,
    colorIndex,
    loading,
    addTask,
    deleteTask,
    editTask,
    resetAll,
    pastelColors
  }
}
