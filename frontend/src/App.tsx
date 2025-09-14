import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

//to check logggined or not from browser's localstorage
const isLoggedIn = window.localStorage.getItem("loggedIn")


const App = () => {
  return (
    <BrowserRouter>
      <div className="App">

        <Navbar isLoggedIn={isLoggedIn} />

        <Routes>
          {/* public */}
          {!isLoggedIn && (
            <>
              <Route path="/" element={<LandingPage />} />
              {/* <Route path="/auth" element={<AuthPage />} /> */}
              <Route path="/auth" element={<SignedOut><AuthClerk /></SignedOut>} />


              {/* fallback---is not mathced any url---if user enters any other invalid url */}
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}



          {/* protected */}
          {isLoggedIn && (
            <>
              <Route path="/family-tree" element={<SignedIn><FamilyTreeApp /></SignedIn>} />
              <Route path="/memberslist" element={<SignedIn><MembersList members={[]} /></SignedIn>} />
              <Route path="/add-member" element={<SignedIn><AddMemberForm /></SignedIn>} />
            </>
          )}


        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
