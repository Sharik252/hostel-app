import { useState } from "react";
import { db } from "../../firebase/config";
import { collection, addDoc } from "firebase/firestore";

const AdminNoticeForm = ({ onNoticeAdded, onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await addDoc(collection(db, "notices"), {
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
        createdBy: "admin"
      });

      setTitle("");
      setContent("");
      
      if (onNoticeAdded) {
        onNoticeAdded();
      }
      
      if (onCancel) {
        onCancel();
      }
      
      alert("Notice published successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "white",
      padding: "24px",
      borderRadius: "12px",
      marginBottom: "24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
    }}>
      <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>
        📝 Add New Notice
      </h3>

      {error && (
        <div style={{
          background: "#fee2e2",
          color: "#991b1b",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "16px",
          fontSize: "13px"
        }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
            Notice Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter notice title"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              fontSize: "14px"
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
            Notice Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter notice details..."
            rows="4"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              fontSize: "14px",
              resize: "vertical"
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: "10px 20px",
                background: "#f1f5f9",
                color: "#64748b",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setTitle("");
              setContent("");
              setError("");
            }}
            style={{
              padding: "10px 20px",
              background: "#f1f5f9",
              color: "#64748b",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 24px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Publishing..." : "📢 Publish Notice"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminNoticeForm;