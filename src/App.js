import { BrowserRouter as Router } from "react-router-dom";
import { Navigate, Route, Routes } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import { useAuth } from "context/UserContext";

import SignIn from "components/SignIn/SignIn";

import './App.css';


function SignInRoute() {
  const auth = useAuth();
  if (auth.authUser) {
    return <Navigate to="/campaign" replace />
  }
  return <SignIn />
}

function CampaignRoute() {
  let auth = useAuth();
  if (!auth.authUser) {
    return <Navigate to="/" replace />;
  }

  return <div>Campagnes</div>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignInRoute />} />
      <Route path="/campaign" element={<CampaignRoute />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <CssBaseline />
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
