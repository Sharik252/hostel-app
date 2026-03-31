import { useState } from "react";

const AssignModal = ({ student, rooms, onConfirm, onClose }) => {
  const [selectedRoomId, setSelectedRoomId] = useState("");

  // ✅ SAFETY CHECK - Ye line error ko rokegi
  if (!student) {
    return (
      <div style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ background: "white", padding: 20, borderRadius: 8 }}>
          <h3>Error: No student selected</h3>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const handleConfirm = () => {
    // ✅ SAFETY CHECK - student?.id use karo
    if (student?.id && selectedRoomId) {
      onConfirm(student.id, selectedRoomId);
    } else {
      alert("Please select a room");
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{ background: "white", padding: 20, borderRadius: 8, width: 300 }}>
        <h3>Assign Room to {student.name}</h3>
        <select
          value={selectedRoomId}
          onChange={(e) => setSelectedRoomId(e.target.value)}
          style={{ width: "100%", padding: 8, margin: "10px 0" }}
        >
          <option value="">Select Room</option>
          {rooms.map(room => (
            <option key={room.id} value={room.id}>
              Room {room.id} ({room.occupants?.length || 0}/{room.capacity})
            </option>
          ))}
        </select>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default AssignModal;