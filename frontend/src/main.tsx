// // import { StrictMode } from 'react'
// // import { createRoot } from 'react-dom/client'
// // import './index.css'
// // import App from './App.tsx'

// // createRoot(document.getElementById('root')!).render(
// //   <StrictMode>
// //     <App />
// //   </StrictMode>,
// // )


// import React from 'react';

// // import React, {useState} from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// // import App from './App.tsx';
// import './index.css';

// // pages
// import LandingPage from './pages/LandingPage.tsx';
// import AuthPage from './pages/AuthPage.tsx';
// import FamilyTreeApp from './pages/FamilyTreeApp.tsx';

// //components
// import MembersList from "./components/MembersList";
// import AddMemberForm from "./components/AddMemberForm.tsx";

// // types
// // import type { FamilyMember } from "./types/family"; 


// const MainApp = () => {

// //  // ✅ keep members in state
// //   const [members, setMembers] = useState<FamilyMember[]>([]);

// //   // ✅ function to add new member
// //   const handleAddMember = (newMember: FamilyMember) => {
// //     setMembers((prev) => [...prev, newMember]);
// //   };


//     return (

//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         {/* <Route path="/landingpage" element={<LandingPage />} /> */}
//         <Route path="/auth" element={<AuthPage />} />
//         <Route path='/family-tree' element={<FamilyTreeApp />} />


//         {/* passing props */}
//         <Route path="/memberslist" element={<MembersList /> } />
//         {/* <Route path='/add-member' element={<AddMemberForm members={members} onAddMember={handleAddMember} />} /> */}
//         <Route path='/add-member' element={<AddMemberForm/>} />
//       </Routes>
//     </BrowserRouter>
//     );
// };


// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <MainApp />
//   </React.StrictMode>
// );




import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
