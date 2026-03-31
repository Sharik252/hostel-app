// ContactPage.js
const ContactPage = () => {
  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>
        Contact Us
      </h1>
      <div style={{ 
        background: "white", 
        padding: "24px", 
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontWeight: "600", marginBottom: "8px" }}>📍 Address</h3>
          <p>123 University Road,<br/>New Delhi - 110001</p>
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontWeight: "600", marginBottom: "8px" }}>📧 Email</h3>
          <p>support@hostelhub.com</p>
          <p>admin@hostelhub.com</p>
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontWeight: "600", marginBottom: "8px" }}>📞 Phone</h3>
          <p>+91 98765 43210</p>
          <p>+91 12345 67890</p>
        </div>
        
        <div>
          <h3 style={{ fontWeight: "600", marginBottom: "8px" }}>🕐 Office Hours</h3>
          <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
          <p>Saturday: 10:00 AM - 2:00 PM</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;  // 🔴 IMPORTANT: Default export