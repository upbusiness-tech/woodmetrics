import { Modal, InputNumber, Select, Input, Row, Col } from "antd";

const { Option } = Select;

interface Props {
  open: boolean;
  height: number;
  category: string;
  clientName: string;
  onClose: () => void;
  onSave: (data: {
    height: number;
    category: string;
    clientName: string;
  }) => void;
  onChangeHeight: (value: number) => void;
  onChangeCategory: (value: string) => void;
  onChangeClient: (value: string) => void;
}

export default function SettingsModal({
  open,
  height,
  category,
  clientName,
  onClose,
  onSave,
  onChangeHeight,
  onChangeCategory,
  onChangeClient,
}: Props) {
  return (
    <Modal
      open={open}
      title="⚙️ Configurações"
      onCancel={onClose}
      onOk={() =>
        onSave({ height, category, clientName })
      }
      okText="Salvar"
      cancelText="Cancelar"
    >
      <Row gutter={12}>
        {/* Altura */}
        <Col span={24}>
          <InputNumber
            style={{ width: "100%" }}
            value={height}
            onChange={(v) => onChangeHeight(v || 0)}
            step={0.01}
            precision={3}
            addonAfter="m"
            placeholder="Espessura (m)"
          />
        </Col>

        {/* Categoria */}
        <Col span={24} style={{ marginTop: 12 }}>
          <Select
            style={{ width: "100%" }}
            placeholder="Categoria"
            value={category || undefined}
            onChange={onChangeCategory}
          >
            <Option value="porta">Porta</Option>
            <Option value="janela">Janela</Option>
            <Option value="tábua">Tábua</Option>
            <Option value="viga">Viga</Option>
          </Select>
        </Col>

        {/* Cliente */}
        <Col span={24} style={{ marginTop: 12 }}>
          <Input
            placeholder="Nome do cliente (opcional)"
            value={clientName}
            onChange={(e) => onChangeClient(e.target.value)}
          />
        </Col>
      </Row>
    </Modal>
  );
}