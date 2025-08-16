// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App



import { Button } from "@/components/ui/button"
 
// function App() {
//   return (
//     <div className="flex min-h-svh flex-col items-center justify-center">
//       <Button>Click me</Button>
//     </div>
//   )
// }

import Layout from './components/Layout';

function App() {
  return (
<>
<Layout>

    <div className="bg-background text-foreground min-h-screen flex items-center justify-center">
      <div className="card shadow-elegant p-6 rounded-lg">
        <h1 className="text-3xl font-bold text-primary">Hello World</h1>
        <p className="text-muted-foreground mt-2">This uses your design system colors!</p>
          <Button bg-gray text-red>Click me</Button>

      </div>
    </div>
</Layout>
</>


  );
}

 
export default App