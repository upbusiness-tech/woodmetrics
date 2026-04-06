import { useState } from "react";
import { Input, Button, Card, Typography, message, Divider } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { firebaseService } from "../database/service";


const { Title, Text } = Typography;

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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#4E7D2A",
        height: '100vh',
        paddingInline: 20        
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 360,
          borderRadius: 15,
          boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
        }}
        bodyStyle={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Title level={4} style={{ margin: 0 }}>
            Madereira São José
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Acesso ao sistema
          </Text>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
              height: 46,
              fontWeight: "bold",
              marginTop: 6,
            }}
          >
            Entrar
          </Button>
        </div>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Divider style={{ margin: "12px 0" }} />
          <Text type="secondary" style={{ fontSize: 11 }}>
            Desenvolvido por
          </Text>
          <br />
          <Text strong style={{ fontSize: 12 }}>
            UpBusiness Tecnologia
          </Text>
        </div>
      </Card>
    </div>
  );
}