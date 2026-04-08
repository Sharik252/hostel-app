import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";

const Payments = ({ student }) => {
  const [payments, setPayments] = useState([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  // Fee structure
  const feeStructure = {
    hostelRent: 50000,
    messFee: 25000,
    electricity: 2000,
    total: 77000
  };

  // ✅ FIXED: loadPayments defined inside useEffect or as useCallback
  useEffect(() => {
    const loadPayments = async () => {
      if (!student?.id) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const q = query(collection(db, "payments"), where("studentId", "==", student.id));
        const querySnapshot = await getDocs(q);
        const paymentList = [];
        querySnapshot.forEach((doc) => {
          paymentList.push({ id: doc.id, ...doc.data() });
        });
        setPayments(paymentList);
      } catch (error) {
        console.error("Error loading payments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [student?.id]);  // ✅ Fixed dependency

  const totalPaid = payments.reduce((sum, p) => sum + (p.status === "completed" ? p.amount : 0), 0);
  const remainingAmount = feeStructure.total - totalPaid;

  const initiatePayment = async () => {
    if (!amount || amount <= 0) {
      alert("Please enter valid amount");
      return;
    }

    if (!student?.id) {
      alert("Student information not found");
      return;
    }

    try {
      await addDoc(collection(db, "payments"), {
        studentId: student.id,
        studentName: student.name,
        amount: Number(amount),
        status: "pending",
        date: new Date().toISOString()
      });

      alert("Payment request submitted! Admin will verify.");
      
      // Reload payments
      const q = query(collection(db, "payments"), where("studentId", "==", student.id));
      const querySnapshot = await getDocs(q);
      const paymentList = [];
      querySnapshot.forEach((doc) => {
        paymentList.push({ id: doc.id, ...doc.data() });
      });
      setPayments(paymentList);
      setAmount("");
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("Failed to submit payment request");
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>
        💰 Fee & Payment
      </h1>

      {/* Fee Structure */}
      <div style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>
          Fee Structure (Yearly)
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Hostel Rent</span>
            <span>₹{feeStructure.hostelRent.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Mess Fee</span>
            <span>₹{feeStructure.messFee.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Electricity (Yearly)</span>
            <span>₹{feeStructure.electricity.toLocaleString()}</span>
          </div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #e2e8f0",
            paddingTop: "12px",
            fontWeight: "bold"
          }}>
            <span>Total Fee</span>
            <span>₹{feeStructure.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        marginBottom: "24px"
      }}>
        <div style={{
          background: "#f0fdf4",
          borderRadius: "12px",
          padding: "20px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#10b981" }}>
            ₹{totalPaid.toLocaleString()}
          </div>
          <div style={{ color: "#64748b" }}>Total Paid</div>
        </div>
        <div style={{
          background: remainingAmount > 0 ? "#fef2f2" : "#f0fdf4",
          borderRadius: "12px",
          padding: "20px",
          textAlign: "center"
        }}>
          <div style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: remainingAmount > 0 ? "#ef4444" : "#10b981"
          }}>
            ₹{remainingAmount.toLocaleString()}
          </div>
          <div style={{ color: "#64748b" }}>Remaining Amount</div>
        </div>
      </div>

      {/* Payment History */}
      <div style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>
          Payment History
        </h2>
        {loading ? (
          <p>Loading...</p>
        ) : payments.length === 0 ? (
          <p style={{ color: "#64748b" }}>No payment records yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {payments.map((payment) => (
              <div
                key={payment.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px",
                  background: "#f8fafc",
                  borderRadius: "8px"
                }}
              >
                <div>
                  <div style={{ fontWeight: "500" }}>₹{payment.amount.toLocaleString()}</div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    {new Date(payment.date).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    background: payment.status === "completed" ? "#dcfce7" : "#fee2e2",
                    color: payment.status === "completed" ? "#166534" : "#991b1b"
                  }}>
                    {payment.status === "completed" ? "✅ Completed" : "⏳ Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Make Payment */}
      <div style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>
          Make Payment
        </h2>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px"
            }}
          />
          <button
            onClick={initiatePayment}
            style={{
              padding: "10px 24px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Pay Now
          </button>
        </div>
        <p style={{ fontSize: "12px", color: "#64748b", marginTop: "12px" }}>
          Note: Payment request will be verified by admin.
        </p>
      </div>
    </div>
  );
};

export default Payments;