// // import { useState } from 'react'
// // import reactLogo from './assets/react.svg'
// // import viteLogo from '/vite.svg'
// import './App.css'

// //import { Toaster } from "@/components/ui/sonner"


// // function App() {
// //   const [count, setCount] = useState(0)

// //   return (
// //     
// //       <div>
// //         <a href="https://vite.dev" target="_blank">
// //           <img src={viteLogo} className="logo" alt="Vite logo" />
// //         </a>
// //         <a href="https://react.dev" target="_blank">
// //           <img src={reactLogo} className="logo react" alt="React logo" />
// //         </a>
// //       </div>
// //       <h1>Vite + React</h1>
// //       <div className="card">
// //         <button onClick={() => setCount((count) => count + 1)}>
// //           count is {count}
// //         </button>
// //         <p>
// //           Edit <code>src/App.tsx</code> and save to test HMR
// //         </p>
// //       </div>
// //       <p className="read-the-docs">
// //         Click on the Vite and React logos to learn more
// //       </p>
// //     
// //   )
// // }

// // export default App


// import { Toaster } from "sonner"

// import { Button } from "@/components/ui/button"
// import DarkModeToggleButton from './components/ui/toggle';

// // function App() {
// //   return (
// //     <div className="flex min-h-svh flex-col items-center justify-center">
// //       <Button>Click me</Button>
// //     </div>
// //   )
// // }


// function App() {
//   return (
// <>

// <DarkModeToggleButton/>

//     <div className="bg-background text-foreground max-h-screen flex items-center justify-center">
//       <div className="card shadow-elegant p-6 rounded-lg">
//         <h1 className="text-3xl font-bold text-primary">Hello World</h1>
//         <p className="text-muted-foreground mt-2">This uses your design system colors!</p>
//           <Button bg-gray text-red>Click me</Button>
//     <Toaster position="top-right" richColors expand />

//       </div>

//     </div>
// </>


//   );
// }


// export default App



import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

// pages
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import FamilyTreeApp from "./pages/FamilyTreeApp";
import Demo from './pages/Demo.tsx'

// components
import MembersList from "./components/MembersList";
import { AddMemberForm } from "./components/AddMemberForm";
import type { FamilyMember } from "./types/family";
import { memberServices } from "./services/memberServices";

const AppRoutes = () => {

  const navigate = useNavigate()

  const handleAddMember = async (newMember: Omit<FamilyMember, "_id">) => {
    try {
      await memberServices.addMember(newMember);
      navigate("/memberslist")    //go back to member list after adding
    } catch (err) {
      console.error("Failed to add member:", err)
    }
  }


  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/family-tree" element={<FamilyTreeApp />} />
      <Route path="/memberslist" element={<MembersList />} />
      <Route path="/add-member" element={<AddMemberForm onAddMember={handleAddMember} onCancel={() => navigate(-1)} />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App;