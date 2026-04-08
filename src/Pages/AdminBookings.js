import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const AdminBookings = ({ rooms, onRoomAssigned }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const querySnapshot = await getDocs(collection(db, "bookings"));
    const bookingList = [];
    querySnapshot.forEach((doc) => {
      bookingList.push({ id: doc.id, ...doc.data() });
    });
    bookingList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setBookings(bookingList);
    setLoading(false);
  };

  const approveBooking = async (booking) => {
    const room = rooms.find(r => r.id === booking.roomId);
    if (!room) {
      alert("Room not found!");
      return;
    }

    const vacancies = room.capacity - (room.occupants?.length || 0);
    if (vacancies <= 0) {
      alert("Room is full!");
      return;
    }

    await updateDoc(doc(db, "bookings", booking.id), { status: "approved" });
    alert(`✅ Booking approved! Room ${booking.roomId} assigned to ${booking.studentName}`);
    loadBookings();
    if (onRoomAssigned) onRoomAssigned();
  };

  const rejectBooking = async (booking) => {
    await updateDoc(doc(db, "bookings", booking.id), { status: "rejected" });
    alert("Booking rejected");
    loadBookings();
  };

  const pendingBookings = bookings.filter(b => b.status === "pending");

  return (
    <div>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>
        📋 Booking Requests
      </h1>

      {pendingBookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "12px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
          <h3>No pending requests</h3>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {pendingBookings.map(booking => (
            <div key={booking.id} style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                    {booking.studentName} → Room {booking.roomId}
                  </div>
                  <div style={{ color: "#64748b", fontSize: "14px" }}>
                    {booking.roomType} | Amount: ₹{booking.amount}
                  </div>
                  <div style={{ color: "#64748b", fontSize: "12px" }}>
                    Transaction ID: {booking.paymentProof}
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: "11px" }}>
                    {new Date(booking.createdAt).toLocaleString()}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => approveBooking(booking)}
                    style={{
                      padding: "8px 16px",
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => rejectBooking(booking)}
                    style={{
                      padding: "8px 16px",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;