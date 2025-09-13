import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// pages
import LandingPage from "./pages/LandingPage";
// import AuthPage from "./pages/AuthPage";
import FamilyTreeApp from "./pages/FamilyTreeApp";
import AuthClerk from "./pages/AuthClerk";          // clerk auth page


// components
import MembersList from "./components/MembersList";
import AddMemberForm from "./components/AddMemberForm";

import { SignedIn, SignedOut } from "@clerk/clerk-react";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* public */}
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/auth" element={<AuthPage />} /> */}
        <Route path="/auth" element={<SignedOut><AuthClerk /></SignedOut>} />

        {/* protected */}
        <Route path="/family-tree" element={<SignedIn><FamilyTreeApp /></SignedIn>} />
        <Route path="/memberslist" element={<SignedIn><MembersList members={[]} /></SignedIn>} />
        <Route path="/add-member" element={<SignedIn><AddMemberForm /></SignedIn>} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
