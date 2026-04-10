import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IndexPage from "./pages/AdminDashboard";
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


function App() {
  return (
    <Router>
      {/* Các route */}
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/admin/students" element={<StudentPage />} />
        <Route path="/admin/students/add" element={<AddStudentPage />} />
        <Route path="/admin/rooms" element={<RoomPage />} />
        <Route path="/admin/accounts" element={<Account />} />
        <Route path="/admin/update-room" element={<UpdateRoomPage />} />
        <Route path="/admin/update-student" element={<UpdateStudent />} />
        <Route path="/admin/contracts" element={<ContractList />} />
        <Route path="/admin/contract-detail" element={<ContractDetail />} />
        <Route path="/admin/invoices" element={<InvoiceList />} />
      </Routes>
      <Popup />
    </Router>
  );
}

export default App;
