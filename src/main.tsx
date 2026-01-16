import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // Импортируем главный компонент
import './index.css'    // <--- ВОТ ОН! Самый важный импорт стилей Tailwind

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)