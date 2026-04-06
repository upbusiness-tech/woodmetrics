import { Button } from "antd";
import { SaveOutlined, FilePdfOutlined } from "@ant-design/icons";

interface Props {
  onSave: () => void;
  onPdf: () => void;
}

export default function BottomActions({ onSave, onPdf }: Props) {
  return (
    <div style={{ display: "flex", gap: 8, padding: 16 }}>
      <Button icon={<SaveOutlined />} block onClick={onSave}>
        Salvar
      </Button>

      <Button icon={<FilePdfOutlined />} block onClick={onPdf}>
        PDF
      </Button>
    </div>
  );
}
