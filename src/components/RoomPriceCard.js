import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";

const RoomPriceCard = ({ room, studentId, studentName, onBookingComplete }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [step, setStep] = useState(1); // 1 = details, 2 = payment proof

  const roomPrices = {
    "Single": 8000,
    "Standard": 5000,
    "Deluxe": 7000,
    "Premium": 10000,
    "Dorm": 3000
  };

  const price = roomPrices[room.type] || 5000;

  // Bank Details
  const bankDetails = {
    accountName: "Hostel Management",
    accountNumber: "123456789012",
    bankName: "State Bank of India",
    ifscCode: "SBIN0001234",
    upiId: "hostel@okhdfcbank"
  };

  const handleBooking = async () => {
    if (!transactionId.trim()) {
      alert("Please enter transaction ID after payment");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "bookings"), {
        studentId: studentId,
        studentName: studentName,
        roomId: room.id,
        roomType: room.type,
        amount: price,
        status: "pending",
        paymentProof: transactionId,
        createdAt: new Date().toISOString()
      });

      await addDoc(collection(db, "notifications"), {
        type: "booking_request",
        message: `New booking request from ${studentName} for Room ${room.id} (₹${price})`,
        read: false,
        bookingId: "temp",
        createdAt: new Date().toISOString()
      });

      alert("✅ Booking request submitted! Admin will verify payment.");
      setShowModal(false);
      setTransactionId("");
      setStep(1);
      onBookingComplete();
    } catch (error) {
      alert("Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Room Card */}
      <div style={{
        background: "white",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
      }}>
        <div style={{
          padding: "20px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white"
        }}>
          <div style={{ fontSize: "24px", fontWeight: "bold" }}>Room {room.id}</div>
          <div style={{ fontSize: "14px", opacity: 0.9 }}>{room.type} Room</div>
        </div>

        <div style={{ padding: "20px" }}>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ color: "#64748b" }}>Capacity</span>
              <span style={{ fontWeight: "500" }}>{room.capacity} persons</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ color: "#64748b" }}>Floor</span>
              <span style={{ fontWeight: "500" }}>{room.floor}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}>
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>Yearly Fee</span>
              <span style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981" }}>₹{price.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            style={{
              width: "100%",
              padding: "12px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "16px",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#2563eb"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#3b82f6"}
          >
            💰 Book Now
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(4px)"
        }}>
          <div style={{
            background: "white",
            borderRadius: "20px",
            width: "500px",
            maxWidth: "90%",
            maxHeight: "90%",
            overflow: "auto",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "20px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h2 style={{ margin: 0 }}>Book Room {room.id}</h2>
                <p style={{ margin: "4px 0 0", opacity: 0.9, fontSize: "14px" }}>{room.type} Room</p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setStep(1);
                  setTransactionId("");
                }}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  color: "white",
                  fontSize: "20px",
                  cursor: "pointer",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%"
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Step 1: Payment Details */}
              {step === 1 && (
                <>
                  <div style={{
                    background: "#fef3c7",
                    padding: "16px",
                    borderRadius: "12px",
                    marginBottom: "20px",
                    borderLeft: "4px solid #f59e0b"
                  }}>
                    <div style={{ fontWeight: "bold", marginBottom: "8px" }}>📌 Booking Amount: ₹{price.toLocaleString()}</div>
                    <div style={{ fontSize: "13px", color: "#64748b" }}>Please pay to the below account and submit transaction ID</div>
                  </div>

                  <div style={{
                    background: "#f8fafc",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "20px"
                  }}>
                    <h3 style={{ margin: "0 0 16px", fontSize: "16px" }}>🏦 Bank Details</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div><strong>Account Name:</strong> {bankDetails.accountName}</div>
                      <div><strong>Account Number:</strong> <span style={{ fontSize: "18px", fontWeight: "bold" }}>{bankDetails.accountNumber}</span></div>
                      <div><strong>Bank Name:</strong> {bankDetails.bankName}</div>
                      <div><strong>IFSC Code:</strong> {bankDetails.ifscCode}</div>
                      <div><strong>UPI ID:</strong> <span style={{ color: "#10b981", fontWeight: "bold" }}>{bankDetails.upiId}</span></div>
                      <div><strong>Amount:</strong> <span style={{ fontSize: "18px", fontWeight: "bold", color: "#10b981" }}>₹{price.toLocaleString()}</span></div>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    style={{
                      width: "100%",
                      padding: "14px",
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "16px"
                    }}
                  >
                    I Have Made Payment →
                  </button>
                </>
              )}

              {/* Step 2: Submit Payment Proof */}
              {step === 2 && (
                <>
                  <div style={{
                    background: "#dcfce7",
                    padding: "16px",
                    borderRadius: "12px",
                    marginBottom: "20px",
                    borderLeft: "4px solid #10b981"
                  }}>
                    <div style={{ fontWeight: "bold", marginBottom: "8px" }}>✅ Payment Done?</div>
                    <div style={{ fontSize: "13px", color: "#64748b" }}>Enter the Transaction ID / UTR Number from your bank app</div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Transaction ID / UTR Number</label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g., SBIN1234567890"
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #cbd5e1",
                        borderRadius: "10px",
                        fontSize: "14px"
                      }}
                    />
                    <p style={{ fontSize: "12px", color: "#64748b", marginTop: "8px" }}>
                      You can find transaction ID in your bank statement or UPI app
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => setStep(1)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        background: "#f1f5f9",
                        color: "#64748b",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer"
                      }}
                    >
                      Back
                    </button>
                    <button
                      onClick={handleBooking}
                      disabled={loading || !transactionId.trim()}
                      style={{
                        flex: 2,
                        padding: "12px",
                        background: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        opacity: (loading || !transactionId.trim()) ? 0.6 : 1
                      }}
                    >
                      {loading ? "Submitting..." : "Submit Booking Request"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomPriceCard;