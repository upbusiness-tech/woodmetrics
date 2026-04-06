import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Inicio from "./pages/Inicio";
import LoginPage from "./pages/Login";
import CookieConsent from "./components/CookieConsent";

import { firebaseService } from "./database/service";

function App() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseService.onAuthStateChanged(async (user) => {
      setUser(user);

      if (user) {
        let data = await firebaseService.getCurrentUserData(user.uid);

        if (!data) {
          data = await firebaseService.createUserIfNotExists(user);
        }

        setUserData(data);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div >
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <>
                <Inicio user={user} userData={userData} />
                <CookieConsent />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/login"
          element={
            !user ? <LoginPage /> : <Navigate to="/" />
          }
        />
      </Routes>
    </div>
  );
}

export default App;