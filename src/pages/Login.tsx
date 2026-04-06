import { useState } from "react";
import { Input, Button, Card, Typography, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { firebaseService } from "../database/service";


const { Title } = Typography;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      message.warning("Preencha email e senha");
      return;
    }

    if (!email.includes("@")) {
      message.error("Email inválido");
      return;
    }

    try {
      setLoading(true);

      await firebaseService.login(email, password);

      message.success("Login realizado com sucesso");
    } catch (error: any) {
      if (error.message.includes("auth/invalid-credential")) {
        message.error("Email ou senha inválidos");
      } else if (error.message.includes("auth/user-not-found")) {
        message.error("Usuário não encontrado");
      } else {
        message.error("Erro ao fazer login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        padding: 16,
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 20,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        }}
        bodyStyle={{ padding: 24 }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3} style={{ color: "#2E5E1E", margin: 0 }}>
            Login
          </Title>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input
            size="large"
            placeholder="Email"
            prefix={<MailOutlined />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ borderRadius: 10 }}
          />

          <Input.Password
            size="large"
            placeholder="Senha"
            prefix={<LockOutlined />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ borderRadius: 10 }}
          />

          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={handleLogin}
            style={{
              backgroundColor: "#2E5E1E",
              borderColor: "#2E5E1E",
              borderRadius: 12,
              height: 48,
              fontWeight: "bold",
            }}
          >
            Entrar
          </Button>
        </div>
      </Card>
    </div>
  );
}