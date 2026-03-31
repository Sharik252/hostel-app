// AboutPage.js
const AboutPage = () => {
  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>
        About HostelHub
      </h1>
      <div style={{ 
        background: "white", 
        padding: "24px", 
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <p style={{ marginBottom: "12px", lineHeight: "1.6" }}>
          HostelHub is a modern hostel management system designed to simplify 
          room allocation, student management, and daily operations.
        </p>
        <p style={{ marginBottom: "12px", lineHeight: "1.6" }}>
          <strong>Features:</strong>
        </p>
        <ul style={{ marginLeft: "24px", marginBottom: "16px" }}>
          <li>Room assignment and management</li>
          <li>Student registration</li>
          <li>Vacancy tracking</li>
          <li>Admin and student portals</li>
        </ul>
        <p style={{ color: "#64748b", fontSize: "14px" }}>
          Version 1.0.0
        </p>
      </div>
    </div>
  );
};

export default AboutPage;  // 🔴 IMPORTANT: Default export