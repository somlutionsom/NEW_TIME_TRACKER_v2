'use client'

import { ClientTask } from '@/lib/supabase'
import styles from './Timetable.module.css'

interface TimetableProps {
  tasks: ClientTask[]
}

const Timetable = ({ tasks }: TimetableProps) => {
  const hours = Array.from({ length: 15 }, (_, i) => i + 8) // 8~22시
  const minutes = [0, 10, 20, 30, 40, 50]

  const renderTableRows = () => {
    return hours.map((hour) => {
      const cells = []
      let mIdx = 0

      // 시간 라벨 셀
      cells.push(
        <td key="hour-label" className={styles.hourLabel}>
          {hour}
        </td>
      )

      while (mIdx < minutes.length) {
        // 이 칸에 시작하는 할 일 찾기
        let found = null
        let colspan = 1
        let isTrueStart = false

        for (let t = 0; t < tasks.length; t++) {
          const task = tasks[t]
          const [sh, sm] = task.start.split(':').map(Number)
          const [eh, em] = task.end.split(':').map(Number)

          // 진짜 시작 셀인가?
          if (hour === sh && minutes[mIdx] === sm) {
            found = task
            isTrueStart = true
            // 이 할 일이 이 행에서 차지하는 셀 개수 계산
            const startIdx = mIdx
            const endIdx = hour === eh ? minutes.findIndex(m => m === em) : minutes.length
            colspan = endIdx - startIdx
            if (colspan < 1) colspan = 1
            break
          }

          // 이 행의 중간(이전 행에서 시작해서 이 행에 걸친) 셀인가?
          if (hour > sh && (hour < eh || (hour === eh && minutes[mIdx] < em)) && mIdx === 0) {
            found = task
            isTrueStart = false
            // 이 할 일이 이 행에서 차지하는 셀 개수 계산
            const startIdx = 0
            const endIdx = hour === eh ? minutes.findIndex(m => m === em) : minutes.length
            colspan = endIdx - startIdx
            if (colspan < 1) colspan = 1
            break
          }
        }

        if (found) {
          cells.push(
            <td key={`${hour}-${mIdx}`} colSpan={colspan}>
              <div
                className={styles.cellBlock}
                style={{ backgroundColor: found.color }}
                title={found.name}
              >
                {isTrueStart ? found.name : ''}
              </div>
            </td>
          )
          mIdx += colspan
        } else {
          // 빈 셀
          cells.push(
            <td key={`${hour}-${mIdx}`}>
              <div className={styles.cellBlock} />
            </td>
          )
          mIdx += 1
        }
      }

      return (
        <tr key={hour}>
          {cells}
        </tr>
      )
    })
  }

  return (
    <div className={styles.timetableWrap}>
      <table className={styles.timetable}>
        <thead>
          <tr>
            <th className={styles.hourLabel}></th>
            <th>00</th>
            <th>10</th>
            <th>20</th>
            <th>30</th>
            <th>40</th>
            <th>50</th>
          </tr>
        </thead>
        <tbody>
          {renderTableRows()}
        </tbody>
      </table>
    </div>
  )
}

export default Timetable
