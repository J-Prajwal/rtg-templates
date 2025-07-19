import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

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
              A modern React application with Tailwind CSS
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
                  This template includes React, Vite, and Tailwind CSS. Start building your amazing application!
                </p>
              </div>

              {/* Counter Example */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Interactive Counter
                </h3>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setCount(count - 1)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-gray-800 min-w-[3rem]">
                    {count}
                  </span>
                  <button
                    onClick={() => setCount(count + 1)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="text-blue-600 text-2xl mb-2">⚡</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Fast Development</h4>
                  <p className="text-sm text-gray-600">
                    Hot module replacement and fast refresh for rapid development
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="text-green-600 text-2xl mb-2">🎨</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Tailwind CSS</h4>
                  <p className="text-sm text-gray-600">
                    Utility-first CSS framework for rapid UI development
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="text-purple-600 text-2xl mb-2">🔧</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Modern Tooling</h4>
                  <p className="text-sm text-gray-600">
                    ESLint, Prettier, and Husky for code quality
                  </p>
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="text-center mt-12 text-gray-500">
            <p>Built with ❤️ using React + Tailwind CSS</p>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default App 