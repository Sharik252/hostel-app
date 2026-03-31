import { useState, useEffect } from "react";
import { getStudents, getRooms } from "./firebase/config";
import AuthPage from "./Pages/AuthPage";
import AdminDashboard from "./Pages/AdminDashboardPage";
import StudentsPage from "./Pages/StudentsPage";
import RoomsPage from "./Pages/RoomsPage";
import MyRoom from "./Pages/MyRoom";
import AboutPage from "./Pages/AboutPage";
import ContactPage from "./Pages/ContactPage";
import AssignModal from "./Modals/AssignModal";
import Icon from "./components/ui/Icon";
import Btn from "./components/ui/Btn";

function App() {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("myroom");
  const [showAssignModal, setShowAssignModal] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      const studentsResult = await getStudents();
      if (studentsResult.success) {
        setStudents(studentsResult.data);
      }
      
      const roomsResult = await getRooms();
      if (roomsResult.success) {
        setRooms(roomsResult.data);
      }
      
      setLoading(false);
    };
    
    loadData();
  }, []);

  const isAdmin = user?.role === "admin";

  const handleAssign = (student, roomId = null) => setShowAssignModal({ student, roomId });

  const confirmAssign = (studentId, roomId) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, roomId, assignedOn: new Date().toISOString() } : s));
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, occupants: [...(r.occupants || []), studentId] } : r));
    if (user?.id === studentId) setUser(u => ({ ...u, roomId, assignedOn: new Date().toISOString() }));
    setShowAssignModal(null);
  };

  const handleVacate = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    room?.occupants?.forEach(studentId => {
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, roomId: null, assignedOn: null } : s));
    });
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, occupants: [] } : r));
  };

  const handleRemoveStudent = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (student?.roomId) {
      setRooms(prev => prev.map(r =>
        r.id === student.roomId ? { ...r, occupants: (r.occupants || []).filter(id => id !== studentId) } : r
      ));
    }
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, roomId: null, assignedOn: null } : s));
  };

  const handleAddStudent = (newStudent) => {
    setStudents(prev => [...prev, newStudent]);
  };

  const adminNav = [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "students", label: "Students", icon: "users" },
    { id: "rooms", label: "Rooms", icon: "bed" },
    { id: "about", label: "About", icon: "info" },
    { id: "contact", label: "Contact", icon: "mail" },
  ];

  const studentNav = [
    { id: "myroom", label: "My Room", icon: "home" },
    { id: "rooms", label: "Browse Rooms", icon: "bed" },
    { id: "about", label: "About", icon: "info" },
    { id: "contact", label: "Contact", icon: "mail" },
  ];

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontSize: "18px" }}>
        Loading...
      </div>
    );
  }

  // ✅ FIXED: AuthPage with all required props
  if (!user) {
    return (
      <AuthPage
        onLogin={(loggedUser) => {
          setUser(loggedUser);
          setCurrentPage(loggedUser.role === "admin" ? "dashboard" : "myroom");
        }}
        students={students}
        onRegister={(s) => setStudents(prev => [...prev, s])}
      />
    );
  }

  const currentStudent = !isAdmin ? { ...user, ...(students.find(s => s.id === user.id) || {}) } : null;
  const navItems = isAdmin ? adminNav : studentNav;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9" }}>
      <div style={{ width: 260, background: "#0f172a", color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: 24, borderBottom: "1px solid #1e293b" }}>
          <div style={{ fontSize: 22, fontWeight: 900 }}>🏨 My Hostel</div>
          <div style={{ fontSize: 12, color: isAdmin ? "#f59e0b" : "#60a5fa", marginTop: 4, fontWeight: 600 }}>
            {isAdmin ? "👤 Admin Panel" : "🎓 Student Portal"}
          </div>
        </div>
        <nav style={{ padding: "16px 0", flex: 1 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setCurrentPage(item.id)} style={{
              display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px 24px",
              background: currentPage === item.id ? "#1e293b" : "transparent", border: "none",
              color: currentPage === item.id ? (isAdmin ? "#f59e0b" : "#60a5fa") : "#94a3b8",
              cursor: "pointer", fontSize: 14, fontWeight: 500, textAlign: "left"
            }}>
              <Icon name={item.icon} size={18} /> {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "20px 24px", borderTop: "1px solid #1e293b" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{user.name}</div>
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 12 }}>{user.email}</div>
          <Btn variant="ghost" onClick={() => { setUser(null); setCurrentPage("dashboard"); }}
            style={{ padding: "7px 16px", fontSize: 12, width: "100%", justifyContent: "center" }}>
            <Icon name="logout" size={14} /> Logout
          </Btn>
        </div>
      </div>

      <div style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        {currentPage === "dashboard" && isAdmin && <AdminDashboard rooms={rooms} students={students} />}
        
        {currentPage === "students" && isAdmin && (
          <StudentsPage 
            students={students} 
            onAssign={handleAssign} 
            onRemove={handleRemoveStudent}
            onAddStudent={handleAddStudent}
          />
        )}
        
        {currentPage === "rooms" && (
          <RoomsPage
            rooms={rooms}
            isAdmin={isAdmin}
            onAssign={(roomId) => {
              if (isAdmin) {
                setShowAssignModal({ student: null, roomId });
                setCurrentPage("students");
              } else {
                handleAssign(currentStudent, roomId);
              }
            }}
            onVacate={handleVacate}
            currentStudentId={user?.id}
          />
        )}
        
        {currentPage === "myroom" && !isAdmin && (
          <MyRoom student={currentStudent} rooms={rooms} students={students} />
        )}
        
        {currentPage === "about" && <AboutPage />}
        {currentPage === "contact" && <ContactPage />}
      </div>

      {showAssignModal && (
        <AssignModal
          student={showAssignModal.student}
          rooms={rooms}
          onConfirm={confirmAssign}
          onClose={() => setShowAssignModal(null)}
        />
      )}
    </div>
  );
}

export default App;