import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IndexPage from "./pages/AdminDashboard";
import UserPage from "./pages/AdminListStudent"
import RoomPage from "./pages/room/AdminListRoom"
import UpdateRoomPage from "./pages/room/AdminUpdateRoom"

import Popup from "./components/Popup";
import Dorm from "./pages/AdminListDorm";


function App() {
  return (
    <Router>
      {/* Các route */}
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/admin/students" element={<UserPage />} />
        <Route path="/admin/rooms" element={<RoomPage />} />
        <Route path="/admin/dorms" element={<Dorm />} />
        <Route path="/admin/update-room" element={<UpdateRoomPage />} />
      </Routes>
      <Popup />
    </Router>
  );
}

export default App;
