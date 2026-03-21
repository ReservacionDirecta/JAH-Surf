import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { auth, db, handleFirestoreError, OperationType, onAuthStateChanged } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: true,
  isAdmin: false,
});

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Check if user exists in Firestore and has admin role
        const userDocRef = doc(db, "users", user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setIsAdmin(userDoc.data().role === "admin");
          } else {
            // If it's the default admin email, bootstrap it
            if (user.email === "YERCTECH@gmail.com") {
              await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                role: "admin"
              });
              setIsAdmin(true);
            } else {
              // Create default user profile
              await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                role: "user"
              });
              setIsAdmin(false);
            }
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <FirebaseContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </FirebaseContext.Provider>
  );
};
