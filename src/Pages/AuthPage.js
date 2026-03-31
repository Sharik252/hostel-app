import { useState } from "react";
import { ADMIN_CREDENTIALS } from "../Data/InitialData";
import { genId, today } from "../Utils/Helper";
import { loginUser, registerUser } from "../firebase/config";

const AuthPage = ({ onLogin, students = [], onRegister }) => {  // ✅ Default value []
  const [role, setRole] = useState("student");
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", course: "", year: "" });
  const [error, setError] = useState("");
  const [admins, setAdmins] = useState([{ email: ADMIN_CREDENTIALS.email, password: ADMIN_CREDENTIALS.password, name: "Administrator" }]);

  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setError("");

    if (role === "admin") {
      if (mode === "login") {
        const admin = admins.find(a => a.email === form.email && a.password === form.password);
        if (!admin) return setError("Invalid admin credentials.");
        return onLogin({ role: "admin", name: admin.name, email: admin.email });
      } else {
        if (!form.name || !form.email || !form.password) return setError("All fields are required.");
        if (admins.find(a => a.email === form.email)) return setError("Admin email already registered.");
        const newAdmin = { name: form.name, email: form.email, password: form.password };
        setAdmins(prev => [...prev, newAdmin]);
        return onLogin({ role: "admin", name: newAdmin.name, email: newAdmin.email });
      }
    }

    // ✅ STUDENT LOGIN with Firebase (safe)
    if (mode === "login") {
      const localStudent = students && students.find(s => s.email === form.email && s.password === form.password);
      
      if (localStudent) {
        return onLogin({ ...localStudent, role: "student" });
      }
      
      const result = await loginUser(form.email, form.password);
      if (result.success) {
        return onLogin({ 
          id: result.user.uid, 
          name: form.email.split('@')[0], 
          email: form.email, 
          role: "student",
          roomId: null
        });
      } else {
        return setError("Invalid email or password");
      }
    }

    // ✅ STUDENT REGISTER with Firebase (safe)
    if (!form.name || !form.email || !form.password || !form.phone || !form.course || !form.year)
      return setError("All fields are required.");
    if (students && students.find(s => s.email === form.email)) return setError("Email already registered.");
    
    const result = await registerUser(form.email, form.password, form.name);
    
    if (result.success) {
      const newStudent = { 
        id: result.user.uid, 
        name: form.name, 
        email: form.email, 
        phone: form.phone,
        course: form.course,
        year: form.year,
        password: form.password,
        role: "student", 
        registeredOn: today(), 
        roomId: null 
      };
      onRegister(newStudent);
      onLogin({ ...newStudent, role: "student" });
    } else {
      setError(result.error);
    }
  };

  const isAdmin = role === "admin";

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: isAdmin
        ? "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
        : "url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=2046&q=80')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      position: "relative",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, transition: "background 0.5s"
    }}>
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0, 0, 0, 0.65)",
        zIndex: 1
      }}></div>

      <div style={{
        width: "100%", maxWidth: 460,
        position: "relative",
        zIndex: 2
      }}>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 50, marginBottom: 8 }}>{isAdmin ? "🔐" : "🎓"}</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>HostelHub</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
            {isAdmin ? "Admin Management Portal" : "Student Allotment Portal"}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          {[
            { id: "student", label: "🎓 Student", desc: "Login or Register" },
            { id: "admin", label: "👤 Admin", desc: "Manage hostel" }
          ].map(r => (
            <button key={r.id} onClick={() => { setRole(r.id); setError(""); setMode("login"); setForm({ name: "", email: "", password: "", phone: "", course: "", year: "" }); }} style={{
              flex: 1, padding: "14px 10px", border: "2px solid",
              borderColor: role === r.id ? (r.id === "admin" ? "#f59e0b" : "#3b82f6") : "rgba(255,255,255,0.1)",
              borderRadius: 14, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
              background: role === r.id
                ? (r.id === "admin" ? "rgba(245,158,11,0.15)" : "rgba(59,130,246,0.15)")
                : "rgba(255,255,255,0.05)",
              color: role === r.id ? "#fff" : "#94a3b8",
            }}>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{r.label}</div>
              <div style={{ fontSize: 11, marginTop: 3, opacity: 0.7 }}>{r.desc}</div>
            </button>
          ))}
        </div>

        <div style={{
          background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)",
          borderRadius: 20, border: `1.5px solid ${isAdmin ? "rgba(245,158,11,0.2)" : "rgba(59,130,246,0.2)"}`,
          padding: 28, boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
        }}>

          <div style={{ display: "flex", background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: 4, marginBottom: 24 }}>
            {["login", "register"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
                flex: 1, padding: "8px 0", border: "none", borderRadius: 8,
                fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                background: mode === m
                  ? (isAdmin ? "rgba(245,158,11,0.8)" : "rgba(59,130,246,0.8)")
                  : "transparent",
                color: mode === m ? "#fff" : "#94a3b8",
              }}>{m === "login" ? "Sign In" : "Register"}</button>
            ))}
          </div>

          <h2 style={{ color: "#fff", margin: "0 0 20px", fontSize: 18, fontWeight: 800 }}>
            {isAdmin
              ? (mode === "login" ? "🔐 Admin Login" : "🔐 Admin Register")
              : (mode === "login" ? "👋 Welcome Back!" : "✨ Create Account")}
          </h2>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.2)", color: "#fca5a5", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16, border: "1px solid rgba(239,68,68,0.3)" }}>
              ⚠️ {error}
            </div>
          )}

          {isAdmin && mode === "register" && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>Full Name</label>
              <input placeholder="Admin Name" value={form.name} onChange={e => handle("name", e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", padding: "11px 14px", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 10, fontSize: 14, outline: "none", background: "rgba(255,255,255,0.08)", fontFamily: "inherit", color: "#fff" }} />
            </div>
          )}

          {["email", "password"].map(key => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>
                {key === "email" ? "Email" : "Password"}
              </label>
              <input
                type={key === "password" ? "password" : "email"}
                placeholder={key === "email" ? "Email address" : "Password"}
                value={form[key]} onChange={e => handle(key, e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", padding: "11px 14px", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 10, fontSize: 14, outline: "none", background: "rgba(255,255,255,0.08)", fontFamily: "inherit", color: "#fff" }}
              />
            </div>
          ))}

          {!isAdmin && mode === "register" && (
            <>
              {[
                { key: "name", type: "text", placeholder: "Full Name", label: "Full Name" },
                { key: "phone", type: "tel", placeholder: "+91 XXXXXXXXXX", label: "Phone" },
                { key: "course", type: "text", placeholder: "B.Tech CSE", label: "Course" },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                    onChange={e => handle(f.key, e.target.value)}
                    style={{ width: "100%", boxSizing: "border-box", padding: "11px 14px", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 10, fontSize: 14, outline: "none", background: "rgba(255,255,255,0.08)", fontFamily: "inherit", color: "#fff" }} />
                </div>
              ))}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>Year</label>
                <select value={form.year} onChange={e => handle("year", e.target.value)}
                  style={{ width: "100%", boxSizing: "border-box", padding: "11px 14px", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 10, fontSize: 14, outline: "none", background: "#1e293b", fontFamily: "inherit", color: "#fff" }}>
                  <option value="">Select Year</option>
                  {["1st Year", "2nd Year", "3rd Year", "4th Year"].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <button onClick={submit} style={{
            width: "100%", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit", padding: "13px 0", marginTop: 8,
            background: isAdmin
              ? "linear-gradient(135deg, #f59e0b, #d97706)"
              : "linear-gradient(135deg, #3b82f6, #6366f1)",
            color: "#fff",
            boxShadow: isAdmin ? "0 4px 15px rgba(245,158,11,0.3)" : "0 4px 15px rgba(59,130,246,0.3)"
          }}>
            {isAdmin
              ? (mode === "login" ? "🔐 Login as Admin" : "✅ Register as Admin")
              : (mode === "login" ? "Sign In →" : "Create Account ✨")}
          </button>

          {isAdmin && mode === "login" && (
            <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(245,158,11,0.1)", borderRadius: 10, fontSize: 12, color: "#fcd34d", border: "1px solid rgba(245,158,11,0.2)", textAlign: "center" }}>
              <strong>Demo:</strong> admin@hostel.edu / admin123
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;