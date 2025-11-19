import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Popup from "./components/Popup";
import IndexPage from "./pages/IndexPage";
import Login from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import StudentProfile from "./pages/StudentProfilePage";
import RegisterForm from "./pages/RegisterFormPage"
import RoomPage from "./pages/RoomPage"
import RoomDetailPage from "./pages/RoomDetailPage"


function App() {
  return (
    <Router>
      {/* Các route */}
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/register-dorm" element={<RegisterForm />} />
        <Route path="/rooms" element={<RoomPage />} />
        <Route path="/room-detail" element={<RoomDetailPage />} />

      </Routes>

      <Popup />
    </Router>
  );
}

export default App;
