import { Button, Card, Row, Col, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { TextField } from "@mui/material";
import { useState } from "react";
import type { WoodPiece } from "../types/wood";
import { onChangeNumberInput } from "../utils/formatter";

interface Props {
  onAdd: (piece: WoodPiece) => void;
}

export default function AddPieceForm({ onAdd }: Props) {
  const [wood, setWood] = useState<WoodPiece>({
    id: "",
    type: "",
    length: 0,
    width: 0,
    totalM2: 0,
  });

  const handleAdd = () => {
    if (!wood.length && !wood.width) {
      message.warning("Preencha comprimento e largura");
      return;
    }

    if (!wood.length) {
      message.warning("Informe o comprimento");
      return;
    }

    if (!wood.width) {
      message.warning("Informe a largura");
      return;
    }

    const newPiece: WoodPiece = {
      ...wood,
      id: Date.now().toString(),
      totalM2: wood.length * wood.width,
    };

    onAdd(newPiece);

    message.success("Peça adicionada!");

    setWood({
      id: "",
      type: "",
      length: 0,
      width: 0,
      totalM2: 0,
    });
  };

  return (
    <Card className="rounded-2xl shadow-md">
      <Row gutter={16} wrap={false}>
        <Col flex={1}>
          <TextField
            sx={{ width: "100%" }}
            label="Comprimento (m)"
            size="small"
            inputMode="decimal"
            placeholder="Comprimento (m)"
            value={(wood.length).toFixed(3) || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setWood((prev) => ({
                ...prev,
                length: onChangeNumberInput(e),
              }))
            }
          />
        </Col>

        <Col flex="none">
          <span style={{ fontSize: 20, fontWeight: 500 }}>X</span>
        </Col>

        <Col flex={1}>
          <TextField
            sx={{ width: "100%" }}
            label="Largura (m)"
            size="small"
            placeholder="Largura (m)"
            variant="outlined"
            value={(wood.width).toFixed(3) || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setWood((prev) => ({
                ...prev,
                width: onChangeNumberInput(e),
              }))
            }
          />
        </Col>
      </Row>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        size="large"
        block
        onClick={handleAdd}
        style={{
          backgroundColor: "#2E5E1E",
          borderColor: "#2E5E1E",
          marginTop: 20,
        }}
      >
        Adicionar Peça
      </Button>
    </Card>
  );
}