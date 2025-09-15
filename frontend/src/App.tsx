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


  //hide navbar if auth page--- comditionally render when path is auth
  const authRoutes = ['/']
  const showNavbar = authRoutes.some((route) => location.pathname.startsWith(route));


  return (
    <div className="AppContent">

      {/* show navbar if it is not auth page */}
      {showNavbar && <Navbar />}

      <Routes>


        {/* public ---- visible when signedout*/}

        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/auth" element={<AuthPage />} /> */}
        <Route path="/auth" element={<AuthClerk />} />

        {/* fallback---is not mathced any url---if user enters any other invalid url */}
        <Route path="*" element={<Navigate to="/" />} />




        {/* protected--- visible when signedin */}
        <Route path="/family-tree" element={<SignedIn><FamilyTreeApp /></SignedIn>} />
        <Route path="/memberslist" element={<SignedIn><MembersList members={[]} /></SignedIn>} />
        <Route path="/add-member" element={<SignedIn><AddMemberForm /></SignedIn>} />


        {/* if user is not signed in and try to visit protected page then redirect user to auth page */}
        {/* <Route path="/family-tree" element={<SignedOut><Navigate to="/auth" /></SignedOut>} /> */}

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
