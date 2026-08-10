import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentPage from "./pages/student/AdminListStudent";
import AddStudentPage from "./pages/student/AdminaddStudent";
import RoomPage from "./pages/room/AdminListRoom";
import UpdateRoomPage from "./pages/room/AdminUpdateRoom";
import UpdateStudent from "./pages/student/AdminUpdateStudent";
import ContractList from "./pages/contract/AdminListContract.js";
import ContractDetail from "./pages/contract/AdminContractDetail.js";
import InvoiceList from "./pages/invoice/AdminInvoice.js";
import Popup from "./components/Popup";
import Account from "./pages/AdminAccountManagement";
import Dashboard from "./pages/AdminDashboard";
import AdminFacility from "./pages/AdminFacility.js";
import NotificationList from "./pages/notification/NotificationList.js";
import IndexPage from "./pages/IndexPage.js";
import AdminProfile from "./pages/profile.js";
import Script from "./components/Script";
import AddRoom from "./pages/room/AdminAddRoom.js";
function App() {
  return (
    <Router>
      <Script />
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/admin/students" element={<StudentPage />} />
        <Route path="/admin/students/add" element={<AddStudentPage />} />
        <Route path="/admin/rooms" element={<RoomPage />} />
        <Route path="/admin/accounts" element={<Account />} />
        <Route path="/admin/update-room" element={<UpdateRoomPage />} />
        <Route path="/admin/add-room" element={<AddRoom />} />
        <Route path="/admin/update-student" element={<UpdateStudent />} />
        <Route path="/admin/contracts" element={<ContractList />} />
        <Route path="/admin/contract-detail" element={<ContractDetail />} />
        <Route path="/admin/invoices" element={<InvoiceList />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/facilities" element={<AdminFacility />} />
        <Route path="/admin/notifications" element={<NotificationList />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
      </Routes>
      <Popup />
    </Router>
  );
}

export default App;
