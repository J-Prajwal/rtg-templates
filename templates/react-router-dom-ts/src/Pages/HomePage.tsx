import { useState } from 'react'

interface CounterProps {
  initialValue?: number
}

const Counter: React.FC<CounterProps> = ({ initialValue = 0 }) => {
  const [count, setCount] = useState(initialValue)

  const increment = () => setCount(prev => prev + 1)
  const decrement = () => setCount(prev => prev - 1)
  const reset = () => setCount(initialValue)

  return (
    <div className="counter">
      <h3>Interactive Counter</h3>
      <div className="counter-controls">
        <button onClick={decrement} className="btn btn-danger">
          -
        </button>
        <span className="counter-value">{count}</span>
        <button onClick={increment} className="btn btn-success">
          +
        </button>
      </div>
      <button onClick={reset} className="btn btn-primary">
        Reset
      </button>
    </div>
  )
}

const FeatureCard: React.FC<{
  icon: string
  title: string
  description: string
  bgColor?: string
}> = ({ icon, title, description, bgColor = '#f8f9fa' }) => (
  <div className="feature-card" style={{ backgroundColor: bgColor }}>
    <div className="feature-icon">{icon}</div>
    <h4 className="feature-title">{title}</h4>
    <p className="feature-description">{description}</p>
  </div>
)

const HomePage = () => {
  return (
    <>
      {/* Header */}
      <header className="header">
        <h1>Welcome to {{Project Name}}</h1>
        <p>A modern React application with React Router DOM and TypeScript</p>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <section className="section">
          <h2>Getting Started</h2>
          <p>
            This template includes React, Vite, React Router DOM, and TypeScript. Start building your amazing application!
          </p>
        </section>

        {/* Counter Example */}
        <section className="section">
          <Counter initialValue={0} />
        </section>

        {/* Features */}
        <section className="section">
          <h2>Features</h2>
          <div className="features-grid">
            <FeatureCard
              icon="⚡"
              title="Fast Development"
              description="Hot module replacement and fast refresh for rapid development"
              bgColor="#e3f2fd"
            />
            <FeatureCard
              icon="🛣️"
              title="React Router DOM"
              description="Declarative routing for React applications"
              bgColor="#f3e5f5"
            />
            <FeatureCard
              icon="🔷"
              title="TypeScript"
              description="Type-safe development with enhanced IDE support"
              bgColor="#e8f5e8"
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Built with ❤️ using React + React Router DOM + TypeScript</p>
      </footer>
    </>
  )
}

export default HomePage
