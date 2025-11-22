import { useAppDispatch, useAppSelector } from '@/core/store/hooks'
import { increment, decrement, incrementByAmount } from '@/core/store/features/counter/counterSlice'
import './App.css'

function App() {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          React + Vite + Redux
        </h1>
        
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 mb-6">
          <p className="text-white text-center text-lg mb-2">Counter Value</p>
          <p className="text-white text-center text-6xl font-bold">{count}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => dispatch(increment())}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Increment
          </button>
          
          <button
            onClick={() => dispatch(decrement())}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Decrement
          </button>
          
          <button
            onClick={() => dispatch(incrementByAmount(5))}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Add 5
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            ✅ React + Vite + TypeScript<br />
            ✅ Tailwind CSS v4<br />
            ✅ Redux Toolkit<br />
            ✅ Axios Configured
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
