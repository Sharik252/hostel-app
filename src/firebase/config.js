import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";

// 🔥 APNA FIREBASE CONFIG YAHAN DALO 🔥
const firebaseConfig = {
  apiKey: "AIzaSyDFOrXi1Py5v0AcPmpvS13VwFbDVsUv_jg",
  authDomain: "hostel-management-f6010.firebaseapp.com",
  projectId: "hostel-management-f6010",
  storageBucket: "hostel-management-f6010.firebasestorage.app",
  messagingSenderId: "966269423656",
  appId: "1:966269423656:web:d3a1ad5b4a45d2883ce51d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Login Function
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Register Function
export const registerUser = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "students", userCredential.user.uid), {
      name: name,
      email: email,
      roomId: null,
      assignedOn: null,
      createdAt: new Date().toISOString()
    });
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get All Students
export const getStudents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "students"));
    const students = [];
    querySnapshot.forEach((doc) => {
      students.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: students };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get All Rooms
export const getRooms = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "rooms"));
    const rooms = [];
    querySnapshot.forEach((doc) => {
      rooms.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: rooms };
  } catch (error) {
    return { success: false, error: error.message };
  }
};