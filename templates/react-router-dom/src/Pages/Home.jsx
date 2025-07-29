import React, { useState } from 'react'
import '../App.css'

const HomePage = () => {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>Welcome to {{Project Name}}</h1>
        <p>A modern React application with React Router DOM</p>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <section className="section">
          <h2>Getting Started</h2>
          <p>
            This template includes React, Vite, and React Router DOM. Start building your amazing application!
          </p>
        </section>

        {/* Counter Example */}
        <section className="section">
          <div className="counter">
            <h3>Interactive Counter</h3>
            <div className="counter-controls">
              <button onClick={() => setCount(count - 1)} className="btn btn-danger">-</button>
              <span className="counter-value">{count}</span>
              <button onClick={() => setCount(count + 1)} className="btn btn-success">+</button>
            </div>
            <button onClick={() => setCount(0)} className="btn btn-primary">Reset</button>
          </div>
        </section>

        {/* Features */}
        <section className="section">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card" style={{ backgroundColor: '#e3f2fd' }}>
              <div className="feature-icon">⚡</div>
              <h4 className="feature-title">Fast Development</h4>
              <p className="feature-description">
                Hot module replacement and fast refresh for rapid development
              </p>
            </div>
            <div className="feature-card" style={{ backgroundColor: '#f3e5f5' }}>
              <div className="feature-icon">🛣️</div>
              <h4 className="feature-title">React Router DOM</h4>
              <p className="feature-description">
                Declarative routing for React applications
              </p>
            </div>
            <div className="feature-card" style={{ backgroundColor: '#e8f5e8' }}>
              <div className="feature-icon">🔧</div>
              <h4 className="feature-title">Modern Tooling</h4>
              <p className="feature-description">
                ESLint, Prettier, and Husky for code quality
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Built with ❤️ using React + React Router DOM</p>
      </footer>
    </div>
  )
}

export default HomePage
