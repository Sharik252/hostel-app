// const icons = {
//   home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
//   users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
//   bed: "M2 4v16 M2 8h18a2 2 0 0 1 2 2v10 M2 17h20 M6 8v9",
//   check: "M20 6L9 17l-5-5",
//   x: "M18 6L6 18 M6 6l12 12",
//   logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
//   info: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8h.01 M12 12v4",
//   mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
//   search: "M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5z M16 16l4.5 4.5",
//   plus: "M12 5v14 M5 12h14",
//   trash: "M3 6h18 M19 6l-1 14H6L5 6 M9 6V4h6v2",
//   shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
//   building: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
//   phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3-8.63 2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 5.997 5.997l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
//   grid: "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
//   award: "M12 15l-2 5 2-1 2 1-2-5z M12 3a6 6 0 0 1 0 12A6 6 0 0 1 12 3z",
//   user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
// };

// const Icon = ({ name, size = 18 }) => {
//   const d = icons[name];
//   if (!d) return null;
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       {d.split(" M").map((path, i) => (
//         <path key={i} d={i === 0 ? path : "M" + path} />
//       ))}
//     </svg>
//   );
// };
// Icon.js - Correct way
export const Icon = ({ name, size = 20 }) => {
  // Simple icons using emoji for demo
  const icons = {
    home: "🏠",
    users: "👥",
    bed: "🛏️",
    info: "ℹ️",
    mail: "✉️",
    logout: "🚪",
    dashboard: "📊"
  };
  
  return (
    <span style={{ fontSize: size, display: "inline-block" }}>
      {icons[name] || "📌"}
    </span>
  );
};

export default Icon;