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
import MyContractPage from "./pages/MyContractPage";
import ContractDetailPage from "./pages/ContractDetail";
import InvoicePage from "./pages/invoices/MyInvoicePage";

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
        <Route path="/my-contracts" element={<MyContractPage />} />
        <Route path="/contract-detail" element={<ContractDetailPage />} />
        <Route path="/invoices" element={<InvoicePage />} />
      </Routes>

      <Popup />
    </Router>
  );
}

export default App;
