// const Btn = ({ children, onClick, variant = "primary", style = {}, disabled = false }) => {
//   const variants = {
//     primary: { background: "#3b82f6", color: "#fff", border: "none" },
//     danger: { background: "#ef4444", color: "#fff", border: "none" },
//     ghost: { background: "transparent", color: "#3b82f6", border: "1.5px solid #3b82f6" },
//     success: { background: "#10b981", color: "#fff", border: "none" },
//   };
//   return (
//     <button onClick={onClick} disabled={disabled} style={{
//       ...variants[variant], padding: "10px 22px", borderRadius: 10, fontSize: 14,
//       fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
//       opacity: disabled ? 0.6 : 1, display: "inline-flex", alignItems: "center",
//       gap: 8, fontFamily: "inherit", ...style
//     }}>
//       {children}
//     </button>
//   );
// };

// Btn.js - Correct way
export const Btn = ({ children, variant = "primary", onClick, style }) => {
  const baseStyle = {
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px"
  };
  
  const variants = {
    primary: { background: "#3b82f6", color: "white" },
    secondary: { background: "#64748b", color: "white" },
    ghost: { background: "transparent", color: "#94a3b8", border: "1px solid #334155" }
  };
  
  return (
    <button 
      onClick={onClick} 
      style={{ ...baseStyle, ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
};

export default Btn;