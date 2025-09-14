import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// pages
import LandingPage from "./pages/LandingPage";
// import AuthPage from "./pages/AuthPage";
import FamilyTreeApp from "./pages/FamilyTreeApp";
import AuthClerk from "./pages/AuthClerk";


// components
import MembersList from "./components/MembersList";
import AddMemberForm from "./components/AddMemberForm";
import Navbar from "./components/Navbar";

//from clerk
import { SignedIn, SignedOut } from "@clerk/clerk-react";






const AppContent = () => {

  const location = useLocation();      //gives current url location object and store in location variable


  //to check logggined or not from browser's localstorage
  const [isLoggedIn, setIsLoggedIn] = useState<string | null>(window.localStorage.getItem("loggedIn"))


  //keep state in sync with localStorage----listens to localStorage changes and updates React state automatically.--to change ui without refresh
  useEffect(() => {
    const handStorageChange = () => {
      setIsLoggedIn(window.localStorage.getItem('loggedIn'))
    };

    //listen for storage change (even fro across tabs)
    window.addEventListener("storage", handStorageChange)

    return () => {
      window.removeEventListener("storage", handStorageChange)
    }
  }, []);


  //hide navbar if auth page--- comditionally render when path is auth
  const authRoutes = ['/auth', '/sign-in', 'sign-out']
  const hideNavbar = authRoutes.some((route) => location.pathname.startsWith(route))


  
  return (
    <div className="AppContent">

      {/* show navbar if it is not auth page */}
      {!hideNavbar && <Navbar isLoggedIn={isLoggedIn} />}

      <Routes>
        {/* public */}
        {!isLoggedIn && (
          <>
            <Route path="/" element={<LandingPage />} />
            {/* <Route path="/auth" element={<AuthPage />} /> */}
            <Route path="/auth" element={<SignedOut><AuthClerk /></SignedOut>} />
            <Route path="/auth" element={<SignedIn><AuthClerk /></SignedIn>} />


            {/* fallback---is not mathced any url---if user enters any other invalid url */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}



        {/* protected */}
        {isLoggedIn && (
          <>
            <Route path="/family-tree" element={<SignedOut><FamilyTreeApp /></SignedOut>} />
            <Route path="/memberslist" element={<SignedOut><MembersList members={[]} /></SignedOut>} />
            <Route path="/add-member" element={<SignedOut><AddMemberForm /></SignedOut>} />
          </>
        )}


      </Routes>
    </div>
  )
};





const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
