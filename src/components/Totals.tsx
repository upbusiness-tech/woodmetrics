import { Card, Statistic } from "antd";

interface Props {
  totalM2: number;
  totalM3: number;
}

export default function Totals({ totalM2, totalM3 }: Props) {
  return (
    <div style={{ display: "flex", gap: 8, padding: "12px 16px" }}>
      <Card style={{ flex: 1 }}>
        <Statistic title="Total m²" value={totalM2} precision={2} />
      </Card>

      <Card style={{ flex: 1 }}>
        <Statistic title="Volume m³" value={totalM3} precision={2} />
      </Card>
    </div>
  );
}