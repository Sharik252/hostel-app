import { useState } from "react";
import { Icon } from "../components/ui/Icon";
import { Btn } from "../components/ui/Btn";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";

const RoomsPage = ({ rooms, isAdmin, onAssign, onVacate, currentStudentId, currentStudentName, onRoomAdded, onPaymentRedirect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState("all");
  const [newRoom, setNewRoom] = useState({
    id: "",
    capacity: 4,
    type: "Standard",
    floor: 1,
    occupants: []
  });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  // Get unique floors from rooms
  const floors = ["all", ...new Set(rooms?.map(room => room?.floor).filter(Boolean))].sort((a,b) => {
    if (a === "all") return -1;
    if (b === "all") return 1;
    return a - b;
  });

  // Filter rooms by selected floor
  const filteredByFloor = selectedFloor === "all" 
    ? rooms 
    : rooms?.filter(room => room?.floor === selectedFloor);

  // Filter by search term
  const filteredRooms = filteredByFloor?.filter(room =>
    room?.id?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  ) || [];

  const handleAddRoom = async () => {
    if (!newRoom.id) {
      setError("Room number is required");
      return;
    }

    if (rooms?.some(r => r.id === newRoom.id)) {
      setError("Room already exists!");
      return;
    }

    setAdding(true);
    setError("");

    try {
      const roomData = {
        id: newRoom.id,
        capacity: Number(newRoom.capacity),
        type: newRoom.type,
        floor: Number(newRoom.floor),
        occupants: []
      };
      
      await addDoc(collection(db, "rooms"), roomData);
      
      if (onRoomAdded) {
        onRoomAdded();
      }
      
      setShowAddModal(false);
      setNewRoom({ id: "", capacity: 4, type: "Standard", floor: 1, occupants: [] });
      alert(`Room ${newRoom.id} added successfully!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  // Handle room booking - redirect to payment page
  const handleBookRoom = (room) => {
    const roomPrices = {
      "Single": 8000,
      "Standard": 5000,
      "Deluxe": 7000,
      "Premium": 10000,
      "Dorm": 3000
    };
    const price = roomPrices[room.type] || 5000;
    
    if (onPaymentRedirect) {
      onPaymentRedirect({
        roomId: room.id,
        roomType: room.type,
        amount: price
      });
    }
  };

  // Floor name mapping
  const getFloorName = (floor) => {
    if (floor === "all") return "🏠 All Rooms";
    const floorNames = {
      0: "📦 Ground Floor",
      1: "🪜 1st Floor",
      2: "🪜 2nd Floor",
      3: "🪜 3rd Floor",
      4: "🪜 4th Floor"
    };
    return floorNames[floor] || `Floor ${floor}`;
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
          {isAdmin ? "Room Management" : "Browse Available Rooms"}
        </h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <input
            type="text"
            placeholder="Search room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              width: "200px"
            }}
          />
          {isAdmin && (
            <Btn 
              variant="primary" 
              onClick={() => setShowAddModal(true)}
            >
              + Add Room
            </Btn>
          )}
        </div>
      </div>

      {/* Floor Tabs */}
      <div style={{
        display: "flex",
        gap: "8px",
        marginBottom: "24px",
        flexWrap: "wrap",
        borderBottom: "1px solid #e2e8f0",
        paddingBottom: "8px"
      }}>
        {floors.map(floor => (
          <button
            key={floor}
            onClick={() => setSelectedFloor(floor)}
            style={{
              padding: "8px 20px",
              background: selectedFloor === floor ? (isAdmin ? "#f59e0b" : "#3b82f6") : "transparent",
              color: selectedFloor === floor ? "white" : "#64748b",
              border: `1px solid ${selectedFloor === floor ? (isAdmin ? "#f59e0b" : "#3b82f6") : "#e2e8f0"}`,
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: "500",
              transition: "all 0.2s"
            }}
          >
            {getFloorName(floor)}
          </button>
        ))}
      </div>

      {/* Rooms Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "20px"
      }}>
        {filteredRooms.length === 0 ? (
          <div style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            padding: "60px",
            background: "white",
            borderRadius: "12px"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏠</div>
            <h3>No Rooms Found</h3>
            <p>No rooms on this floor</p>
          </div>
        ) : (
          filteredRooms.map(room => {
            const occupants = room?.occupants || [];
            const vacancies = (room?.capacity || 0) - occupants.length;
            const isFull = vacancies === 0;
            const isOccupiedByMe = occupants.includes(currentStudentId);
            const roomPrices = {
              "Single": 8000,
              "Standard": 5000,
              "Deluxe": 7000,
              "Premium": 10000,
              "Dorm": 3000
            };
            const price = roomPrices[room.type] || 5000;

            // Student View
            if (!isAdmin) {
              return (
                <div
                  key={room?.id}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "pointer",
                    border: isOccupiedByMe ? "2px solid #10b981" : "none"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                  }}
                >
                  <div style={{
                    padding: "20px",
                    background: isFull ? "#fef2f2" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white"
                  }}>
                    <div style={{ fontSize: "24px", fontWeight: "bold" }}>Room {room.id}</div>
                    <div style={{ fontSize: "14px", opacity: 0.9 }}>{room.type} Room</div>
                    <div style={{ fontSize: "12px", marginTop: "4px" }}>Floor {room.floor}</div>
                  </div>

                  <div style={{ padding: "20px" }}>
                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                        <span style={{ color: "#64748b" }}>Capacity</span>
                        <span style={{ fontWeight: "500" }}>{room.capacity} persons</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                        <span style={{ color: "#64748b" }}>Available</span>
                        <span style={{ fontWeight: "500", color: vacancies > 0 ? "#10b981" : "#ef4444" }}>
                          {vacancies} spots
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}>
                        <span style={{ fontSize: "18px", fontWeight: "bold" }}>Booking Fee</span>
                        <span style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981" }}>₹{price.toLocaleString()}</span>
                      </div>
                    </div>

                    {isOccupiedByMe ? (
                      <div style={{
                        width: "100%",
                        padding: "12px",
                        textAlign: "center",
                        background: "#dcfce7",
                        color: "#166534",
                        borderRadius: "10px",
                        fontWeight: "500"
                      }}>
                        ✅ You are in this room
                      </div>
                    ) : isFull ? (
                      <div style={{
                        width: "100%",
                        padding: "12px",
                        textAlign: "center",
                        background: "#fee2e2",
                        color: "#991b1b",
                        borderRadius: "10px"
                      }}>
                        Room is full
                      </div>
                    ) : (
                      <button
                        onClick={() => handleBookRoom(room)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          background: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "16px"
                        }}
                      >
                        💰 Book Now - ₹{price}
                      </button>
                    )}
                  </div>
                </div>
              );
            }

            // Admin View
            return (
              <div
                key={room?.id}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  border: isOccupiedByMe ? "2px solid #10b981" : "none"
                }}
              >
                <div style={{
                  padding: "20px",
                  background: isFull ? "#fef2f2" : "#f0fdf4",
                  borderBottom: "1px solid #e2e8f0"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "20px", fontWeight: "bold" }}>Room {room?.id}</div>
                      <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                        {room?.type || "Standard Room"} | Floor {room?.floor}
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

                  <div style={{ display: "flex", gap: "12px" }}>
                    {!isFull && (
                      <Btn
                        variant="primary"
                        onClick={() => onAssign(room?.id)}
                        style={{ flex: 1, justifyContent: "center" }}
                      >
                        Assign Student
                      </Btn>
                    )}
                    {occupants.length > 0 && (
                      <Btn
                        variant="ghost"
                        onClick={() => onVacate(room?.id)}
                        style={{ flex: 1, justifyContent: "center", color: "#ef4444" }}
                      >
                        Vacate Room
                      </Btn>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Room Modal */}
      {showAddModal && isAdmin && (
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
              🏠 Add New Room
            </h2>

            {error && (
              <div style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "13px"
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                Room Number *
              </label>
              <input
                type="text"
                value={newRoom.id}
                onChange={(e) => setNewRoom({...newRoom, id: e.target.value.toUpperCase()})}
                placeholder="e.g., A101, B202, C303"
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
                Floor
              </label>
              <select
                value={newRoom.floor}
                onChange={(e) => setNewRoom({...newRoom, floor: Number(e.target.value)})}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              >
                <option value={0}>Ground Floor</option>
                <option value={1}>1st Floor</option>
                <option value={2}>2nd Floor</option>
                <option value={3}>3rd Floor</option>
                <option value={4}>4th Floor</option>
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                Capacity
              </label>
              <select
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({...newRoom, capacity: Number(e.target.value)})}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              >
                <option value={1}>1 (Single)</option>
                <option value={2}>2 (Double)</option>
                <option value={3}>3 (Triple)</option>
                <option value={4}>4 (Quad)</option>
                <option value={6}>6 (Dorm)</option>
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                Room Type
              </label>
              <select
                value={newRoom.type}
                onChange={(e) => setNewRoom({...newRoom, type: e.target.value})}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              >
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Premium">Premium</option>
                <option value="Single">Single</option>
                <option value="Dorm">Dorm</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </Btn>
              <Btn variant="primary" onClick={handleAddRoom} disabled={adding}>
                {adding ? "Adding..." : "Add Room"}
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;