import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import AdminNoticeForm from '../components/ui/AdminNoticeForm';

const NoticeBoard = ({ isAdmin }) => {
  const [notices, setNotices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load notices from Firebase
  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "notices"));
      const noticeList = [];
      querySnapshot.forEach((doc) => {
        noticeList.push({ id: doc.id, ...doc.data() });
      });
      noticeList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotices(noticeList);
    } catch (error) {
      console.error("Error loading notices:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotice = async (id) => {
    if (window.confirm("Delete this notice?")) {
      try {
        await deleteDoc(doc(db, "notices", id));
        loadNotices();
      } catch (error) {
        console.error("Error deleting notice:", error);
        alert("Failed to delete notice");
      }
    }
  };

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>📢 Notice Board</h1>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: "10px 20px",
              background: showForm ? "#ef4444" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            {showForm ? "✖ Cancel" : "+ Add Notice"}
          </button>
        )}
      </div>

      {/* Add Notice Form - Admin only */}
      {isAdmin && showForm && (
        <AdminNoticeForm onNoticeAdded={loadNotices} onCancel={() => setShowForm(false)} />
      )}

      {/* Notices List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <p>Loading notices...</p>
        </div>
      ) : notices.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px",
          background: "white",
          borderRadius: "12px"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>No Notices Yet</h3>
          <p style={{ color: "#64748b" }}>
            {isAdmin ? "Click 'Add Notice' to create your first notice" : "Check back later for updates"}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {notices.map((notice, index) => (
            <div
              key={notice.id}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                borderLeft: `4px solid ${index === 0 ? "#f59e0b" : "#3b82f6"}`
              }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                flexWrap: "wrap",
                gap: "12px"
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>
                    📌 {notice.title}
                  </h3>
                  <p style={{ color: "#475569", marginBottom: "8px" }}>{notice.content}</p>
                  <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                    🕒 {new Date(notice.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => deleteNotice(notice.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                      fontSize: "20px",
                      padding: "8px",
                      borderRadius: "8px"
                    }}
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;