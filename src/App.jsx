import { useState, useEffect, useRef } from 'react'
import './App.css'

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <polyline
        points="1.5,5 4,7.5 8.5,2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TaskItem({ task, onToggle, onDelete, index }) {
  return (
    <div
      className={`task-item${task.completed ? ' completed' : ''}`}
      style={{ '--i': index }}
    >
      <button
        className="checkbox"
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? '未完了にする' : '完了にする'}
        aria-pressed={task.completed}
      >
        <CheckIcon />
      </button>
      <span className="task-text">{task.text}</span>
      <button
        className="delete-btn"
        onClick={() => onDelete(task.id)}
        aria-label="タスクを削除"
      >
        ×
      </button>
    </div>
  )
}

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('task-board-v1') || '[]')
    } catch {
      return []
    }
  })
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('task-board-v1', JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    const text = input.trim()
    if (!text) return
    setTasks(prev => [{ id: Date.now(), text, completed: false }, ...prev])
    setInput('')
    inputRef.current?.focus()
  }

  const toggleTask = id =>
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    )

  const deleteTask = id =>
    setTasks(prev => prev.filter(t => t.id !== id))

  const completedCount = tasks.filter(t => t.completed).length

  return (
    <div className="app">
      <div className="board">
        <header className="header">
          <h1 className="title">TASKS</h1>
          <span className="counter" aria-live="polite">
            {tasks.length > 0 ? `${completedCount} / ${tasks.length}` : '—'}
          </span>
        </header>

        <ul className="task-list" role="list">
          {tasks.length === 0 ? (
            <li className="empty">タスクがありません</li>
          ) : (
            tasks.map((task, i) => (
              <li key={task.id}>
                <TaskItem
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  index={i}
                />
              </li>
            ))
          )}
        </ul>

        <div className="input-area">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="タスクを入力..."
            className="task-input"
            maxLength={200}
            aria-label="新しいタスク"
          />
          <button
            className="add-btn"
            onClick={addTask}
            disabled={!input.trim()}
            aria-label="タスクを追加"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
