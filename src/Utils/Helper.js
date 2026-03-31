export const today = () => {
  const d = new Date();
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export const genId = () => "STU" + Math.random().toString(36).substr(2, 6).toUpperCase();