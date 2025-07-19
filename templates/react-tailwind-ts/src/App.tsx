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
    <div className="bg-gray-50 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        Interactive Counter
      </h3>
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={decrement}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          -
        </button>
        <span className="text-2xl font-bold text-gray-800 min-w-[3rem]">
          {count}
        </span>
        <button
          onClick={increment}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          +
        </button>
      </div>
      <div className="text-center mt-4">
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  bgColor?: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  bgColor = 'bg-blue-50' 
}) => (
  <div className={`${bgColor} p-6 rounded-lg`}>
    <div className="text-blue-600 text-2xl mb-2">{icon}</div>
    <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
)

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to {{Project Name}}
            </h1>
            <p className="text-xl text-gray-600">
              A modern React application with Tailwind CSS and TypeScript
            </p>
          </header>

          {/* Main Content */}
          <main className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Getting Started
                </h2>
                <p className="text-gray-600 mb-6">
                  This template includes React, Vite, Tailwind CSS, and TypeScript. Start building your amazing application!
                </p>
              </div>

              {/* Counter Example */}
              <Counter initialValue={0} />

              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <FeatureCard
                  icon="⚡"
                  title="Fast Development"
                  description="Hot module replacement and fast refresh for rapid development"
                  bgColor="bg-blue-50"
                />
                <FeatureCard
                  icon="🎨"
                  title="Tailwind CSS"
                  description="Utility-first CSS framework for rapid UI development"
                  bgColor="bg-green-50"
                />
                <FeatureCard
                  icon="🔷"
                  title="TypeScript"
                  description="Type-safe development with enhanced IDE support"
                  bgColor="bg-purple-50"
                />
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="text-center mt-12 text-gray-500">
            <p>Built with ❤️ using React + Tailwind CSS + TypeScript</p>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default App 