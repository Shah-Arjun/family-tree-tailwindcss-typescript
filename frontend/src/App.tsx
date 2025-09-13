import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages
import LandingPage from "./pages/LandingPage";
// import AuthPage from "./pages/AuthPage";
import FamilyTreeApp from "./pages/FamilyTreeApp";

// components
import MembersList from "./components/MembersList";
import AddMemberForm from "./components/AddMemberForm";

// clerk auth page
import AuthClerk from "./pages/AuthClerk";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/auth" element={<AuthPage />} /> */}
        <Route path="/auth" element={<AuthClerk />} />
        <Route path="/family-tree" element={<FamilyTreeApp />} />
        <Route path="/memberslist" element={<MembersList members={[]} />} />
        <Route path="/add-member" element={<AddMemberForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
