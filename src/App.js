import { BrowserRouter as Router } from "react-router-dom";
import { Navigate, Route, Routes } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import { useAuth } from "context/UserContext";

import HelpersList from "components/HelpersList/HelpersList";
import Helper from "components/Helper/Helper";
import SignIn from "components/SignIn/SignIn";

import './App.css';


function SignInRoute() {
  const auth = useAuth();
  if (auth.authUser) {
    return <Navigate to="/list" replace />
  }
  return <SignIn />
}

function HelpersRoute() {
  let auth = useAuth();
  if (!auth.authUser) {
    return <Navigate to="/" replace />;
  }

  return <HelpersList />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignInRoute />} />
      <Route path="/list" element={<HelpersRoute />} />
      <Route path="/:id/:token" element={<Helper />} />
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
