import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ResumeUploader from "./components/ResumeUploader";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        {/* Navigation */}
        <nav className="navbar">
          <h2>Resume Analyzer</h2>
          <ul>
            <li>
              <Link to="/">Upload Resume</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<ResumeUploader />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
