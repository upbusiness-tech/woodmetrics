import { useEffect, useState } from "react";
import { Button, Card, Typography } from "antd";

const { Text } = Typography;

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 999,
      }}
    >
      <Card
        style={{
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }}
        bodyStyle={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <Text style={{ fontSize: 14 }}>
          Utilizamos cookies para melhorar sua experiência e autenticação no sistema.
        </Text>

        <Button
          type="primary"
          onClick={acceptCookies}
          style={{
            backgroundColor: "#2E5E1E",
            borderColor: "#2E5E1E",
            borderRadius: 10,
            height: 40,
            fontWeight: "bold",
          }}
        >
          Aceitar
        </Button>
      </Card>
    </div>
  );
}