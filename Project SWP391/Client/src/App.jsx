import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0);

  const handleCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Counter: {count}</h2>
      <button onClick={handleCount} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Click Me
      </button>
    </div>
  );
}

export default App
