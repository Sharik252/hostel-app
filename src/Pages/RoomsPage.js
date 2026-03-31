import { useState } from "react";
import { Icon } from "../components/ui/Icon";
import { Btn } from "../components/ui/Btn";

const RoomsPage = ({ rooms, isAdmin, onAssign, onVacate, currentStudentId }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRooms = rooms?.filter(room =>
    room?.id?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  ) || [];

  return (
    <div>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px"
      }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
          {isAdmin ? "Room Management" : "Browse Available Rooms"}
        </h1>
        <input
          type="text"
          placeholder="Search room..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            width: "250px"
          }}
        />
      </div>

      {/* Rooms Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "20px"
      }}>
        {filteredRooms.map(room => {
          const occupants = room?.occupants || [];
          const vacancies = (room?.capacity || 0) - occupants.length;
          const isFull = vacancies === 0;
          const isOccupiedByMe = occupants.includes(currentStudentId);

          return (
            <div
              key={room?.id}
              style={{
                background: "white",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
                border: isOccupiedByMe ? "2px solid #10b981" : "none"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              }}
            >
              {/* Room Header */}
              <div style={{
                padding: "20px",
                background: isFull ? "#fef2f2" : "#f0fdf4",
                borderBottom: "1px solid #e2e8f0"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: "bold" }}>Room {room?.id}</div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                      {room?.type || "Standard Room"}
                    </div>
                  </div>
                  <div style={{
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "500",
                    background: isFull ? "#fee2e2" : "#dcfce7",
                    color: isFull ? "#991b1b" : "#166534"
                  }}>
                    {isFull ? "Full" : `${vacancies} spot${vacancies > 1 ? 's' : ''} left`}
                  </div>
                </div>
              </div>

              {/* Room Details */}
              <div style={{ padding: "20px" }}>
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#64748b", fontSize: "14px" }}>Capacity</span>
                    <span style={{ fontWeight: "500" }}>{room?.capacity || 0} persons</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#64748b", fontSize: "14px" }}>Current Occupants</span>
                    <span style={{ fontWeight: "500" }}>{occupants.length}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748b", fontSize: "14px" }}>Available Seats</span>
                    <span style={{ fontWeight: "500", color: vacancies > 0 ? "#10b981" : "#ef4444" }}>
                      {vacancies}
                    </span>
                  </div>
                </div>

                {/* Roommates Preview */}
                {occupants.length > 0 && (
                  <div style={{ marginBottom: "16px", padding: "12px", background: "#f8fafc", borderRadius: "8px" }}>
                    <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "8px" }}>
                      Current Residents:
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {occupants.slice(0, 3).map((occupantId, idx) => (
                        <span key={idx} style={{
                          padding: "2px 8px",
                          background: "#e2e8f0",
                          borderRadius: "12px",
                          fontSize: "11px"
                        }}>
                          Student {typeof occupantId === 'string' ? occupantId.slice(-3) : occupantId}
                        </span>
                      ))}
                      {occupants.length > 3 && (
                        <span style={{
                          padding: "2px 8px",
                          background: "#e2e8f0",
                          borderRadius: "12px",
                          fontSize: "11px"
                        }}>
                          +{occupants.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "12px" }}>
                  {isAdmin ? (
                    <>
                      {!isFull && (
                        <Btn
                          variant="primary"
                          onClick={() => onAssign(room?.id)}
                          style={{ flex: 1, justifyContent: "center" }}
                        >
                          <Icon name="add" size={14} /> Assign Student
                        </Btn>
                      )}
                      {occupants.length > 0 && (
                        <Btn
                          variant="ghost"
                          onClick={() => onVacate(room?.id)}
                          style={{ flex: 1, justifyContent: "center", color: "#ef4444" }}
                        >
                          <Icon name="delete" size={14} /> Vacate Room
                        </Btn>
                      )}
                    </>
                  ) : (
                    <>
                      {isOccupiedByMe ? (
                        <div style={{
                          width: "100%",
                          padding: "10px",
                          textAlign: "center",
                          background: "#dcfce7",
                          color: "#166534",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: "500"
                        }}>
                          ✅ You are assigned to this room
                        </div>
                      ) : isFull ? (
                        <div style={{
                          width: "100%",
                          padding: "10px",
                          textAlign: "center",
                          background: "#fee2e2",
                          color: "#991b1b",
                          borderRadius: "8px",
                          fontSize: "14px"
                        }}>
                          Room is full
                        </div>
                      ) : (
                        <Btn
                          variant="primary"
                          onClick={() => onAssign(room?.id)}
                          style={{ flex: 1, justifyContent: "center" }}
                        >
                          <Icon name="bed" size={14} /> Request Room
                        </Btn>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Rooms Found */}
      {filteredRooms.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "white",
          borderRadius: "12px"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏠</div>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>No Rooms Found</h3>
          <p style={{ color: "#64748b" }}>Try searching with a different room number</p>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;