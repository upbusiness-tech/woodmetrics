import { useEffect, useState } from "react";
import "./App.css";

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
      console.log("Auth mudou:", user);

      setUser(user);

      if (user) {
        let data = await firebaseService.getCurrentUserData(user.uid);

        console.log("Dados do usuário:", data);

        if (!data) {
          console.log("Usuário não existe, criando...");
          data = await firebaseService.createUserIfNotExists(user);
          console.log("Usuário criado:", data);
        }

        setUserData(data);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <>
      <Inicio user={user} userData={userData} />
      <CookieConsent />
    </>
  );
}

export default App;