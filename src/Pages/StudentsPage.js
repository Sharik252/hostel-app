import { useState } from "react";
import { Icon } from "../components/ui/Icon";
import { Btn } from "../components/ui/Btn";

const StudentsPage = ({ students, onAssign, onRemove, onAddStudent }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    course: ""
  });

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email) {
      alert("Please fill name and email");
      return;
    }

    const studentData = {
      id: Date.now(), // Unique ID
      name: newStudent.name,
      email: newStudent.email,
      phone: newStudent.phone || "",
      course: newStudent.course || "",
      roomId: null,
      assignedOn: null,
      role: "student"
    };

    onAddStudent(studentData);
    setNewStudent({ name: "", email: "", phone: "", course: "" });
    setShowAddModal(false);
    alert("Student added successfully!");
  };

  return (
    <div>
      {/* Header with Add Button */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "24px" 
      }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
          Students Management
        </h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              width: "250px"
            }}
          />
          <Btn 
            variant="primary" 
            onClick={() => setShowAddModal(true)}
          >
            <Icon name="add" size={16} /> Add New Student
          </Btn>
        </div>
      </div>

      {/* Students Table */}
      <div style={{ 
        background: "white", 
        borderRadius: "8px", 
        overflow: "auto",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
          <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
            <tr>
              <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Phone</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Course</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Room</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: "40px", textAlign: "center" }}>
                  No students found. Click "Add New Student" to add.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{
                        width: "32px",
                        height: "32px",
                        background: "#3b82f6",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold"
                      }}>
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      {student.name}
                    </div>
                  </td>
                  <td style={{ padding: "12px" }}>{student.email}</td>
                  <td style={{ padding: "12px" }}>{student.phone || "-"}</td>
                  <td style={{ padding: "12px" }}>{student.course || "-"}</td>
                  <td style={{ padding: "12px" }}>
                    {student.roomId ? `Room ${student.roomId}` : "Not assigned"}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      background: student.roomId ? "#dcfce7" : "#fee2e2",
                      color: student.roomId ? "#166534" : "#991b1b"
                    }}>
                      {student.roomId ? "Assigned" : "Unassigned"}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {!student.roomId && (
                        <Btn 
                          variant="primary" 
                          onClick={() => onAssign(student)}
                          style={{ padding: "4px 12px", fontSize: "12px" }}
                        >
                          Assign
                        </Btn>
                      )}
                      <Btn 
                        variant="ghost" 
                        onClick={() => {
                          if (window.confirm(`Remove ${student.name}?`)) {
                            onRemove(student.id);
                          }
                        }}
                        style={{ padding: "4px 12px", fontSize: "12px", color: "#ef4444" }}
                      >
                        Remove
                      </Btn>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            padding: "28px",
            borderRadius: "12px",
            width: "450px",
            maxWidth: "90%"
          }}>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>
              Add New Student
            </h2>
            
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                Full Name *
              </label>
              <input
                type="text"
                value={newStudent.name}
                onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                placeholder="Enter student name"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                Email Address *
              </label>
              <input
                type="email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                placeholder="student@example.com"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={newStudent.phone}
                onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                placeholder="+91 98765 43210"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                Course
              </label>
              <input
                type="text"
                value={newStudent.course}
                onChange={(e) => setNewStudent({...newStudent, course: e.target.value})}
                placeholder="B.Tech, MCA, etc."
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </Btn>
              <Btn variant="primary" onClick={handleAddStudent}>
                Add Student
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;