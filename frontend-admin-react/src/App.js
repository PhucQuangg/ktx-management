import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentPage from "./pages/student/AdminListStudent"
import AddStudentPage from "./pages/student/AdminaddStudent"
import RoomPage from "./pages/room/AdminListRoom"
import UpdateRoomPage from "./pages/room/AdminUpdateRoom"
import UpdateStudent from "./pages/student/AdminUpdateStudent";  
import ContractList from "./pages/contract/AdminListContract.js";  
import ContractDetail from "./pages/contract/AdminContractDetail.js";
import InvoiceList from "./pages/invoice/AdminInvoice.js";  
import Popup from "./components/Popup";
import Account from "./pages/AdminAccountManagement";
import Dashboard from "./pages/AdminDashboard"; 
import AdminFacility from "./pages/AdminFacility.js";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin/students" element={<StudentPage />} />
        <Route path="/admin/students/add" element={<AddStudentPage />} />
        <Route path="/admin/rooms" element={<RoomPage />} />
        <Route path="/admin/accounts" element={<Account />} />
        <Route path="/admin/update-room" element={<UpdateRoomPage />} />
        <Route path="/admin/update-student" element={<UpdateStudent />} />
        <Route path="/admin/contracts" element={<ContractList />} />
        <Route path="/admin/contract-detail" element={<ContractDetail />} />
        <Route path="/admin/invoices" element={<InvoiceList />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/facilities" element={<AdminFacility />} />
      </Routes>
      <Popup />
    </Router>
  );
}

export default App;
