const MyRoom = ({ student, rooms, students = [] }) => {
  // Student ka room find karo
  const myRoom = rooms?.find(room => room.id === student?.roomId);
  
  // Available rooms count
  const availableRooms = rooms?.filter(room => room.capacity > (room.occupants?.length || 0)).length || 0;

  if (!student) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <h2>Student data not found</h2>
        <p>Please contact admin</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "8px" }}>
          Welcome, {student.name}! 👋
        </h1>
        <p style={{ color: "#64748b" }}>
          Here's your hostel information and profile details
        </p>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        
        {/* Left Column - Profile Details */}
        <div>
          {/* Profile Card */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "24px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
              <div style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "36px",
                color: "white"
              }}>
                {student.name?.charAt(0).toUpperCase() || "S"}
              </div>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>{student.name}</h2>
                <p style={{ color: "#64748b", fontSize: "14px" }}>{student.email}</p>
                <span style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  background: "#dcfce7",
                  color: "#166534",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "500"
                }}>
                  🎓 Student
                </span>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
              <h3 style={{ fontWeight: "600", marginBottom: "16px" }}>📋 Personal Information</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b" }}>Full Name:</span>
                  <span style={{ fontWeight: "500" }}>{student.name || "-"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b" }}>Email Address:</span>
                  <span style={{ fontWeight: "500" }}>{student.email || "-"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b" }}>Phone Number:</span>
                  <span style={{ fontWeight: "500" }}>{student.phone || "Not provided"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b" }}>Course:</span>
                  <span style={{ fontWeight: "500" }}>{student.course || "Not provided"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b" }}>Year:</span>
                  <span style={{ fontWeight: "500" }}>{student.year || "Not provided"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                  <span style={{ color: "#64748b" }}>Registration Date:</span>
                  <span style={{ fontWeight: "500" }}>{student.registeredOn || new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ fontWeight: "600", marginBottom: "16px" }}>📊 Quick Stats</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ textAlign: "center", padding: "12px", background: "#f8fafc", borderRadius: "12px" }}>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#3b82f6" }}>
                  {student.roomId ? "✅" : "❌"}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Room Status</div>
                <div style={{ fontSize: "14px", fontWeight: "500", marginTop: "4px" }}>
                  {student.roomId ? "Assigned" : "Not Assigned"}
                </div>
              </div>
              <div style={{ textAlign: "center", padding: "12px", background: "#f8fafc", borderRadius: "12px" }}>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#10b981" }}>
                  {availableRooms}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Available Rooms</div>
                <div style={{ fontSize: "14px", fontWeight: "500", marginTop: "4px" }}>Open for booking</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Room Details */}
        <div>
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ fontWeight: "600", marginBottom: "16px" }}>🛏️ My Room Details</h3>
            
            {myRoom ? (
              <div>
                <div style={{
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                  borderRadius: "12px",
                  padding: "20px",
                  color: "white",
                  marginBottom: "20px"
                }}>
                  <div style={{ fontSize: "36px", marginBottom: "8px" }}>🏠</div>
                  <div style={{ fontSize: "24px", fontWeight: "bold" }}>Room {myRoom.id}</div>
                  <div style={{ fontSize: "14px", opacity: 0.9, marginTop: "4px" }}>{myRoom.type || "Standard Room"}</div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #e2e8f0" }}>
                    <span style={{ color: "#64748b" }}>Room Number:</span>
                    <span style={{ fontWeight: "600" }}>{myRoom.id}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #e2e8f0" }}>
                    <span style={{ color: "#64748b" }}>Capacity:</span>
                    <span style={{ fontWeight: "600" }}>{myRoom.capacity} persons</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #e2e8f0" }}>
                    <span style={{ color: "#64748b" }}>Current Occupants:</span>
                    <span style={{ fontWeight: "600" }}>{myRoom.occupants?.length || 0}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #e2e8f0" }}>
                    <span style={{ color: "#64748b" }}>Vacancies:</span>
                    <span style={{ fontWeight: "600", color: (myRoom.capacity - (myRoom.occupants?.length || 0)) > 0 ? "#10b981" : "#ef4444" }}>
                      {myRoom.capacity - (myRoom.occupants?.length || 0)} spots left
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                    <span style={{ color: "#64748b" }}>Assigned On:</span>
                    <span style={{ fontWeight: "600" }}>{student.assignedOn || "Not assigned"}</span>
                  </div>
                </div>

                {myRoom.occupants?.length > 0 && students?.length > 0 && (
                  <div style={{ marginTop: "20px", padding: "16px", background: "#f8fafc", borderRadius: "12px" }}>
                    <h4 style={{ fontWeight: "600", marginBottom: "12px" }}>👥 Roommates</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {myRoom.occupants.map(occupantId => {
                        const occupant = students?.find(s => s.id === occupantId);
                        if (!occupant || occupant.id === student.id) return null;
                        return (
                          <div key={occupantId} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px", background: "white", borderRadius: "8px" }}>
                            <div style={{
                              width: "32px",
                              height: "32px",
                              background: "#e2e8f0",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "bold"
                            }}>
                              {occupant.name?.charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontWeight: "500" }}>{occupant.name}</div>
                              <div style={{ fontSize: "12px", color: "#64748b" }}>{occupant.course || "Student"}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏠</div>
                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>No Room Assigned Yet</h3>
                <p style={{ color: "#64748b", marginBottom: "20px" }}>
                  You haven't been assigned a room yet. Please contact the admin or browse available rooms.
                </p>
                <button
                  onClick={() => {
                    window.location.hash = "rooms";
                  }}
                  style={{
                    display: "inline-block",
                    padding: "10px 20px",
                    background: "#3b82f6",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Browse Rooms →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRoom;