"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User 
} from "firebase/auth";
import { app } from "./firebaseconfig"; // Import your existing firebase app

const auth = getAuth(app);

// 1. Create the Context
const AuthContext = createContext<any>(null);

// 2. Create the Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This listener fires whenever the user logs in or out
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logOut = () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook to use it easily
export const useAuth = () => {
  return useContext(AuthContext);
};
