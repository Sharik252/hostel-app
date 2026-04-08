import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc, query, where, updateDoc, doc } from "firebase/firestore";

const Payments = ({ student, isAdmin = false }) => {
  const [payments, setPayments] = useState([]);
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("room_booking");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");

  // ✅ Auto load selected room from Browse Rooms page
  useEffect(() => {
    const selectedRoomData = sessionStorage.getItem("selectedRoom");
    if (selectedRoomData) {
      const room = JSON.parse(selectedRoomData);
      setPaymentType("room_booking");
      setSelectedRoom(room.roomId);
      setAmount(room.amount.toString());
      setShowPaymentModal(true);
      sessionStorage.removeItem("selectedRoom");
    }
  }, []);

  // Fee structure
  const feeTypes = {
    room_booking: { name: "Room Booking", minAmount: 5000, maxAmount: 10000 },
    mess_fee: { name: "Mess Fee", amount: 25000 },
    electricity: { name: "Electricity Bill", amount: 2000 },
    hostel_rent: { name: "Hostel Rent", amount: 50000 },
    other: { name: "Other", minAmount: 100, maxAmount: 50000 }
  };

  // Bank Details
  const bankDetails = {
    accountName: "Hostel Management",
    accountNumber: "123456789012",
    bankName: "State Bank of India",
    ifscCode: "SBIN0001234",
    upiId: "hostel@okhdfcbank"
  };

  useEffect(() => {
    loadPayments();
    loadRooms();
  }, [student?.id]);

  const loadPayments = async () => {
    if (!student?.id && !isAdmin) return;
    
    setLoading(true);
    try {
      let q;
      if (isAdmin) {
        q = collection(db, "payments");
      } else {
        q = query(collection(db, "payments"), where("studentId", "==", student.id));
      }
      const querySnapshot = await getDocs(q);
      const paymentList = [];
      querySnapshot.forEach((doc) => {
        paymentList.push({ id: doc.id, ...doc.data() });
      });
      paymentList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPayments(paymentList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadRooms = async () => {
    const querySnapshot = await getDocs(collection(db, "rooms"));
    const roomList = [];
    querySnapshot.forEach((doc) => {
      roomList.push({ id: doc.id, ...doc.data() });
    });
    setRooms(roomList);
  };

  const handlePayment = async () => {
    if (!transactionId.trim()) {
      setError("Please enter transaction ID");
      return;
    }

    let finalAmount = amount;
    if (paymentType === "room_booking") {
      if (!selectedRoom) {
        setError("Please select a room");
        return;
      }
      const room = rooms.find(r => r.id === selectedRoom);
      if (room) {
        const roomPrices = { "Single": 8000, "Standard": 5000, "Deluxe": 7000, "Premium": 10000, "Dorm": 3000 };
        finalAmount = roomPrices[room.type] || 5000;
      }
    } else if (feeTypes[paymentType]?.amount) {
      finalAmount = feeTypes[paymentType].amount;
    } else if (!amount || amount <= 0) {
      setError("Please enter valid amount");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const paymentData = {
        studentId: student.id,
        studentName: student.name,
        paymentType: paymentType,
        amount: Number(finalAmount),
        status: "pending",
        transactionId: transactionId,
        roomId: paymentType === "room_booking" ? selectedRoom : null,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, "payments"), paymentData);

      if (paymentType === "room_booking") {
        await addDoc(collection(db, "bookings"), {
          studentId: student.id,
          studentName: student.name,
          roomId: selectedRoom,
          roomType: rooms.find(r => r.id === selectedRoom)?.type,
          amount: Number(finalAmount),
          status: "pending",
          paymentProof: transactionId,
          createdAt: new Date().toISOString()
        });

        await addDoc(collection(db, "notifications"), {
          type: "booking_request",
          message: `New booking request from ${student.name} for Room ${selectedRoom} (₹${finalAmount})`,
          read: false,
          createdAt: new Date().toISOString()
        });
      }

      alert("✅ Payment request submitted! Admin will verify.");
      setShowPaymentModal(false);
      setAmount("");
      setTransactionId("");
      setSelectedRoom("");
      loadPayments();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const updatePaymentStatus = async (paymentId, newStatus) => {
    await updateDoc(doc(db, "payments", paymentId), { status: newStatus });
    loadPayments();
    alert(`Payment ${newStatus}`);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { background: "#fef3c7", color: "#d97706", text: "⏳ Pending" },
      success: { background: "#dcfce7", color: "#166534", text: "✅ Success" },
      failed: { background: "#fee2e2", color: "#991b1b", text: "❌ Failed" }
    };
    const s = styles[status] || styles.pending;
    return <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", background: s.background, color: s.color }}>{s.text}</span>;
  };

  // Calculate totals
  const totalPaid = payments.filter(p => p.status === "success").reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>💰 Payment Center</h1>
        {!isAdmin && (
          <button onClick={() => setShowPaymentModal(true)} style={{ padding: "10px 24px", background: "#3b82f6", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "500" }}>
            + New Payment
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "#dcfce7", padding: "16px", borderRadius: "12px" }}>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#166534" }}>₹{totalPaid.toLocaleString()}</div>
          <div style={{ color: "#166534" }}>Total Paid</div>
        </div>
        <div style={{ background: "#fef3c7", padding: "16px", borderRadius: "12px" }}>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#d97706" }}>₹{totalPending.toLocaleString()}</div>
          <div style={{ color: "#d97706" }}>Pending</div>
        </div>
        <div style={{ background: "#e0e7ff", padding: "16px", borderRadius: "12px" }}>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#4f46e5" }}>{payments.length}</div>
          <div style={{ color: "#4f46e5" }}>Total Transactions</div>
        </div>
      </div>

      {/* Payment History */}
      <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <h2 style={{ padding: "20px", margin: 0, borderBottom: "1px solid #e2e8f0", fontSize: "18px" }}>📋 Payment History</h2>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>
        ) : payments.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>No payment records yet</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f8fafc" }}>
                <tr>
                  <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Type</th>
                  <th style={{ padding: "12px", textAlign: "right" }}>Amount</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Transaction ID</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>Status</th>
                  {isAdmin && <th style={{ padding: "12px", textAlign: "center" }}>Action</th>}
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{new Date(payment.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: "12px" }}>{feeTypes[payment.paymentType]?.name || payment.paymentType}</td>
                    <td style={{ padding: "12px", textAlign: "right", fontWeight: "500" }}>₹{payment.amount.toLocaleString()}</td>
                    <td style={{ padding: "12px", fontSize: "13px", color: "#64748b" }}>{payment.transactionId}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>{getStatusBadge(payment.status)}</td>
                    {isAdmin && payment.status === "pending" && (
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <button onClick={() => updatePaymentStatus(payment.id, "success")} style={{ background: "#10b981", color: "white", border: "none", padding: "4px 12px", borderRadius: "6px", cursor: "pointer", marginRight: "8px" }}>Approve</button>
                        <button onClick={() => updatePaymentStatus(payment.id, "failed")} style={{ background: "#ef4444", color: "white", border: "none", padding: "4px 12px", borderRadius: "6px", cursor: "pointer" }}>Reject</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "20px", width: "500px", maxWidth: "90%", maxHeight: "90%", overflow: "auto" }}>
            <div style={{ padding: "20px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", display: "flex", justifyContent: "space-between" }}>
              <h2 style={{ margin: 0 }}>Make Payment</h2>
              <button onClick={() => setShowPaymentModal(false)} style={{ background: "none", border: "none", color: "white", fontSize: "20px", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ padding: "24px" }}>
              {error && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "12px", borderRadius: "10px", marginBottom: "16px" }}>❌ {error}</div>}

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Payment Type</label>
                <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)} style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px" }}>
                  <option value="room_booking">🏠 Room Booking</option>
                  <option value="hostel_rent">🏢 Hostel Rent</option>
                  <option value="mess_fee">🍽️ Mess Fee</option>
                  <option value="electricity">💡 Electricity Bill</option>
                  <option value="other">📝 Other</option>
                </select>
              </div>

              {paymentType === "room_booking" && (
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Select Room</label>
                  <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px" }}>
                    <option value="">Select a room</option>
                    {rooms.map(room => {
                      const prices = { "Single": 8000, "Standard": 5000, "Deluxe": 7000, "Premium": 10000, "Dorm": 3000 };
                      return <option key={room.id} value={room.id}>Room {room.id} - {room.type} (₹{prices[room.type] || 5000})</option>;
                    })}
                  </select>
                </div>
              )}

              {paymentType !== "room_booking" && !feeTypes[paymentType]?.amount && (
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Amount (₹)</label>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px" }} />
                </div>
              )}

              {paymentType !== "room_booking" && feeTypes[paymentType]?.amount && (
                <div style={{ background: "#f0fdf4", padding: "12px", borderRadius: "8px", marginBottom: "16px" }}>
                  <strong>Amount:</strong> ₹{feeTypes[paymentType].amount.toLocaleString()}
                </div>
              )}

              <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", marginBottom: "16px" }}>
                <h4 style={{ margin: "0 0 12px" }}>🏦 Bank Details</h4>
                <div style={{ fontSize: "13px" }}>
                  <p><strong>Account Name:</strong> {bankDetails.accountName}</p>
                  <p><strong>Account Number:</strong> {bankDetails.accountNumber}</p>
                  <p><strong>Bank:</strong> {bankDetails.bankName}</p>
                  <p><strong>IFSC:</strong> {bankDetails.ifscCode}</p>
                  <p><strong>UPI ID:</strong> {bankDetails.upiId}</p>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Transaction ID / UTR Number</label>
                <input type="text" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Enter transaction ID" style={{ width: "100%", padding: "12px", border: "1px solid #cbd5e1", borderRadius: "10px" }} />
              </div>

              <button onClick={handlePayment} disabled={processing} style={{ width: "100%", padding: "14px", background: processing ? "#94a3b8" : "#3b82f6", color: "white", border: "none", borderRadius: "10px", cursor: processing ? "not-allowed" : "pointer", fontWeight: "600" }}>
                {processing ? "Processing..." : "Submit Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;