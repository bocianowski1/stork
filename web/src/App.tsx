import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, Dashboard } from "./pages";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
