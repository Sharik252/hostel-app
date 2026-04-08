const AdminDashboard = ({ rooms = [], students = [] }) => {
  // Calculate stats with safe fallbacks
  const totalStudents = students?.length || 0;
  const totalRooms = rooms?.length || 0;
  const occupiedRooms = rooms?.filter(room => (room?.occupants?.length || 0) > 0).length || 0;
  
  const availableSeats = rooms?.reduce((total, room) => {
    return total + ((room?.capacity || 0) - (room?.occupants?.length || 0));
  }, 0) || 0;

  // Recently added students (last 5)
  const recentStudents = [...(students || [])]
    .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
    .slice(0, 5);

  return (
    <div>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>
        Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "32px"
      }}>
        {/* Total Students */}
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "48px",
              height: "48px",
              background: "#3b82f6",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px"
            }}>
              👥
            </div>
            <div>
              <div style={{ fontSize: "28px", fontWeight: "bold" }}>{totalStudents}</div>
              <div style={{ color: "#64748b", fontSize: "14px" }}>Total Students</div>
            </div>
          </div>
        </div>

        {/* Total Rooms */}
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "48px",
              height: "48px",
              background: "#10b981",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px"
            }}>
              🏠
            </div>
            <div>
              <div style={{ fontSize: "28px", fontWeight: "bold" }}>{totalRooms}</div>
              <div style={{ color: "#64748b", fontSize: "14px" }}>Total Rooms</div>
            </div>
          </div>
        </div>

        {/* Occupied Rooms */}
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "48px",
              height: "48px",
              background: "#f59e0b",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px"
            }}>
              🛏️
            </div>
            <div>
              <div style={{ fontSize: "28px", fontWeight: "bold" }}>{occupiedRooms}</div>
              <div style={{ color: "#64748b", fontSize: "14px" }}>Occupied Rooms</div>
            </div>
          </div>
        </div>

        {/* Available Seats */}
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "48px",
              height: "48px",
              background: "#8b5cf6",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px"
            }}>
              🪑
            </div>
            <div>
              <div style={{ fontSize: "28px", fontWeight: "bold" }}>{availableSeats}</div>
              <div style={{ color: "#64748b", fontSize: "14px" }}>Available Seats</div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px"
      }}>
        {/* Recent Students */}
        <div style={{
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>
            📋 Recently Joined Students
          </h2>
          {recentStudents.length === 0 ? (
            <p style={{ color: "#64748b", textAlign: "center", padding: "20px" }}>
              No students registered yet
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentStudents.map((student, index) => (
                <div key={student?.id || index} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "8px",
                  borderBottom: "1px solid #e2e8f0"
                }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    background: "#3b82f6",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold"
                  }}>
                    {student?.name?.charAt(0) || "S"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "500" }}>{student?.name || "Unknown"}</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>{student?.email || "No email"}</div>
                  </div>
                  <div style={{
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    background: student?.roomId ? "#dcfce7" : "#fee2e2",
                    color: student?.roomId ? "#166534" : "#991b1b"
                  }}>
                    {student?.roomId ? "Assigned" : "Pending"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Room Occupancy Status */}
        <div style={{
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>
            🏠 Room Occupancy Status
          </h2>
          {rooms?.length === 0 ? (
            <p style={{ color: "#64748b", textAlign: "center", padding: "20px" }}>
              No rooms available
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {rooms?.map((room) => {
                const occupants = room?.occupants?.length || 0;
                const capacity = room?.capacity || 0;
                const percentage = capacity > 0 ? (occupants / capacity) * 100 : 0;
                
                return (
                  <div key={room?.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontWeight: "500" }}>Room {room?.id}</span>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        {occupants}/{capacity} occupied
                      </span>
                    </div>
                    <div style={{
                      width: "100%",
                      height: "8px",
                      background: "#e2e8f0",
                      borderRadius: "4px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: "100%",
                        background: percentage === 100 ? "#ef4444" : "#10b981",
                        borderRadius: "4px",
                        transition: "width 0.3s"
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        marginTop: "24px",
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>
          ⚡ Quick Actions
        </h2>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <a 
            href="#students"
            onClick={(e) => { e.preventDefault(); window.location.hash = "students"; }}
            style={{
              padding: "10px 20px",
              background: "#3b82f6",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "14px"
            }}
          >
            + Add New Student
          </a>
          <a 
            href="#rooms"
            onClick={(e) => { e.preventDefault(); window.location.hash = "rooms"; }}
            style={{
              padding: "10px 20px",
              background: "#10b981",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "14px"
            }}
          >
            🏠 Manage Rooms
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;