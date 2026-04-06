import { Typography, Button, Drawer, Avatar } from "antd";
import { HistoryOutlined, MenuOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useState } from "react";
import { firebaseService } from "../database/service";

const { Title, Text } = Typography;

interface Props {
  onOpenHistory: () => void;
  userData?: {
    name: string;
    role: string;
  } | null;
}

export default function Header({ onOpenHistory, userData }: Props) {
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await firebaseService.logout();
  };

  return (
    <>
      <div
        style={{
          background: "#2E5E1E",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          type="text"
          icon={<MenuOutlined style={{ color: "#fff", fontSize: 20 }} />}
          onClick={() => setOpen(true)}
        />

        <Title level={5} style={{ color: "#fff", margin: 0 }}>
          Madeireira São José
        </Title>

        <Button
          type="text"
          icon={<HistoryOutlined style={{ color: "#fff", fontSize: 20 }} />}
          onClick={onOpenHistory}
        />
      </div>

      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setOpen(false)}
        open={open}
        bodyStyle={{ display: "flex", flexDirection: "column", gap: 20 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar size={48} icon={<UserOutlined />} />

          <div>
            <Text strong>{userData?.name || "Usuário"}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {userData?.role || "Sem cargo"}
            </Text>
          </div>
        </div>

        <Button
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ borderRadius: 10, fontWeight: "bold" }}
        >
          Sair
        </Button>
      </Drawer>
    </>
  );
}