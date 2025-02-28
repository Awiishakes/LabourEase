import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ContextHolder from './context/ContextHolder.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <ContextHolder>
      <App />
    </ContextHolder>
)
