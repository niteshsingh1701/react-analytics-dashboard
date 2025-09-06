import { auth, db, storage } from "./config";
import { onAuthStateChanged } from "firebase/auth";

// Test Firebase initialization
console.log("🔥 Firebase Auth initialized:", !!auth);
console.log("🔥 Firebase Firestore initialized:", !!db);
console.log("🔥 Firebase Storage initialized:", !!storage);

// Test auth state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ User signed in:", user.email);
  } else {
    console.log("❌ User signed out");
  }
});

export { auth, db, storage };
