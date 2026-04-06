import { Card, Button, Dropdown } from "antd";
import { DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import { type WoodPiece } from "../types/wood";

interface Props {
  pieces: WoodPiece[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function PiecesList({ pieces, onRemove, onClear }: Props) {
  return (
    <Card
      title={`Peças (${pieces.length})`}
      extra={
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "clear",
                label: "Limpar tudo",
                danger: true,
                icon: <DeleteOutlined />,
                onClick: onClear,
              },
            ],
          }}
        >
          <Button icon={<MoreOutlined />} type="text" />
        </Dropdown>
      }
    >
      {pieces.map((p) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "4px 0",
          }}
        >
          <span>
            {(p.length).toFixed(2)}m x {(p.width).toFixed(2)}m = {p.totalM2.toFixed(3)} m²
          </span>

          <Button
            icon={<DeleteOutlined />}
            danger
            type="text"
            onClick={() => onRemove(p.id)}
          />
        </div>
      ))}
    </Card>
  );
}