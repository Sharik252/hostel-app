import Icon from "./Icon";

const StatCard = ({ label, value, icon, color }) => (
  <div style={{
    background: "#fff", borderRadius: 16, padding: "20px 24px",
    boxShadow: "0 2px 16px rgba(30,41,59,0.07)",
    display: "flex", alignItems: "center", gap: 16
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: 12,
      background: color + "22", display: "flex",
      alignItems: "center", justifyContent: "center", color
    }}>
      <Icon name={icon} size={22} />
    </div>
    <div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#1e293b" }}>{value}</div>
      <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{label}</div>
    </div>
  </div>
);

export default StatCard;