import React, { createContext, useContext } from "react";

interface FirebaseContextType {
  user: null;
  loading: boolean;
  isAdmin: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: false,
  isAdmin: false,
});

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <FirebaseContext.Provider value={{ user: null, loading: false, isAdmin: false }}>
      {children}
    </FirebaseContext.Provider>
  );
};
