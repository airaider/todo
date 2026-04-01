import { useState, useEffect } from 'react'
import './App.css'

interface Todo {
  id: string
  text: string
  completed: boolean
}

type Filter = 'all' | 'active' | 'completed'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '진행 중' },
  { value: 'completed', label: '완료' },
]

function loadTodos(): Todo[] {
  try {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  function addTodo() {
    const text = input.trim()
    if (!text) return
    setTodos(prev => [...prev, { id: crypto.randomUUID(), text, completed: false }])
    setInput('')
  }

  function toggleTodo(id: string) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  function deleteTodo(id: string) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed))
  }

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const activeCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length

  return (
    <div className="app">
      <h1>Todo</h1>

      <form
        className="input-row"
        onSubmit={e => { e.preventDefault(); addTodo() }}
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="할 일을 입력하세요"
          className="todo-input"
          autoFocus
        />
        <button type="submit" className="add-btn">추가</button>
      </form>

      {todos.length > 0 && (
        <>
          <div className="filters">
            {FILTERS.map(({ value, label }) => (
              <button
                key={value}
                className={`filter-btn${filter === value ? ' active' : ''}`}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <ul className="todo-list">
            {filtered.length === 0 ? (
              <li className="empty">항목이 없습니다</li>
            ) : (
              filtered.map(todo => (
                <li key={todo.id} className={`todo-item${todo.completed ? ' completed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="todo-checkbox"
                    id={todo.id}
                  />
                  <label htmlFor={todo.id} className="todo-text">{todo.text}</label>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-btn"
                    aria-label="삭제"
                  >
                    ×
                  </button>
                </li>
              ))
            )}
          </ul>

          <div className="footer">
            <span className="count">{activeCount}개 남음</span>
            {completedCount > 0 && (
              <button onClick={clearCompleted} className="clear-btn">
                완료 항목 삭제
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
