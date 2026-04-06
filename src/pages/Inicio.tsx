import { Button, Card, message, Modal, Spin, Tag } from "antd";
import { useState, useMemo, useEffect } from "react";
import Totals from "../components/Totals";
import AddPieceForm from "../components/AddPieceForm";
import PiecesList from "../components/PieceList";
import BottomActions from "../components/ButtonActions";
import { type WoodPiece } from "../types/wood";
import { generatePDF } from "../utils/pdf";
import { Collapse } from "antd";
import { onChangeNumberInput } from "../utils/formatter";
import { OutlinedInput, TextField } from "@mui/material";
import Header from "../components/Header";
import { firebaseService } from "../database/service";
import { FilePdfOutlined } from "@ant-design/icons";
import type { User } from "firebase/auth";

interface InicioProps {
  user: User;
  userData: {
    name: string;
    role: string;
  } | null;
}

export default function Inicio({ user, userData }: InicioProps) {

  const [pieces, setPieces] = useState<WoodPiece[]>([]);
  const [height, setHeight] = useState(0.35);
  const [category, setCategory] = useState("");
  const [clientName, setClientName] = useState("");

  const [historyOpen, setHistoryOpen] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);


  const totalM2 = useMemo(
    () => pieces.reduce((acc, curr) => acc + curr.totalM2, 0),
    [pieces]
  );

  const totalM3 = useMemo(
    () =>
      pieces.reduce(
        (acc, curr) => acc + curr.length * curr.width * height,
        0
      ),
    [pieces, height]
  );

  const addPiece = (piece: WoodPiece) => {
    setPieces((prev) => [...prev, piece]);
  };

  const removePiece = (id: string) => {
    setPieces((prev) => prev.filter((p) => p.id !== id));
  };

  const loadReports = async () => {
    setLoadingReports(true);

    try {
      const data = await firebaseService.getReports();
      setReports(data);
    } catch (error) {
      message.error("Erro ao carregar histórico");
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    if (historyOpen) {
      loadReports();
    }
  }, [historyOpen]);

  return (
    <>
      <Header
        onOpenHistory={() => setHistoryOpen(true)}
        userData={userData}
      />
      <Collapse
        size="small"
        style={{ marginBottom: 12, borderRadius: 10 }}
        items={[
          {
            key: "1",
            label: (
              <span style={{ fontSize: 16 }}>
                Espessura <strong>{height.toFixed(3)}m</strong>
                {category && ` • ${category}`}
                {clientName && ` • ${clientName}`}
              </span>
            ),
            children: (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <TextField
                  style={{ width: "100%", borderRadius: 5 }}
                  label="Espessura (m)"
                  value={(height).toFixed(3)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setHeight(onChangeNumberInput(e))
                  }
                  size="small"
                />

                <OutlinedInput
                  placeholder="Tipo de Madeira"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  size="small"
                />

                <OutlinedInput
                  placeholder="Cliente"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  size="small"
                />
              </div>
            ),
          },
        ]}
      />

      <Totals totalM2={totalM2} totalM3={totalM3} />



      <AddPieceForm onAdd={addPiece} />

      <PiecesList
        pieces={pieces}
        onRemove={removePiece}
        onClear={() => setPieces([])}
      />

      {pieces.length > 0 && (
        <BottomActions
          onSave={async () => {
            console.log('chegou aqui')
            if (!pieces.length) {
              message.warning("Adicione pelo menos uma peça");
              return;
            }


            try {
              await firebaseService.saveReport(
                {
                  pieces,
                  totalM2,
                  totalM3,
                  standardHeight: height,
                  category,
                  clientName,
                },
                user,
                userData
              );

              message.success("Relatório salvo com sucesso!");

              setPieces([]);

            } catch (error) {
              message.error("Erro ao salvar relatório");
              console.error(error);
            }
          }}
          onPdf={() =>
            generatePDF(pieces, totalM2, totalM3, height, clientName, userData?.name || "N/I", category)
          }
        />
      )}

      <Modal
        title="Histórico de Relatórios"
        open={historyOpen}
        onCancel={() => setHistoryOpen(false)}
        footer={null}
      >
        {loadingReports ? (
          <Spin />
        ) : (
          <div
            style={{
              maxHeight: "70vh",
              overflowY: "auto",
              paddingRight: 4,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {reports.map((report) => (
                <Card
                  key={report.id}
                  size="small"
                  hoverable
                  style={{
                    borderRadius: 12,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <strong style={{ fontSize: 15 }}>
                          {report.clientName || "Sem cliente"}
                        </strong>

                        <span style={{ fontSize: 11, color: "#999" }}>
                          {report.date
                            ? new Date(
                              report.date.seconds
                                ? report.date.seconds * 1000
                                : report.date
                            ).toLocaleDateString("pt-BR")
                            : ""}
                        </span>
                      </div>

                      <Tag color="green">
                        {report.category || "Sem categoria"}
                      </Tag>

                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        gap: 10,
                        fontSize: 13,
                      }}
                    >
                      <div style={{ whiteSpace: "nowrap" }}>
                        Espessura: <strong>{report.standardHeight}m</strong>
                      </div>

                      <div style={{ whiteSpace: "nowrap" }}>
                        Peças: <strong>{report.pieces?.length}</strong>
                      </div>

                      <div style={{ whiteSpace: "nowrap" }}>
                        Total m²: <strong>{report.totalM2?.toFixed(3)}</strong>
                      </div>

                      <div style={{ whiteSpace: "nowrap" }}>
                        Total m³: <strong>{report.totalM3?.toFixed(3)}</strong>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 8,
                        marginTop: 4,
                      }}
                    >
                      <Button
                        size="small"
                        onClick={() => {
                          setPieces(report.pieces);
                          setHeight(report.standardHeight);
                          setCategory(report.category);
                          setClientName(report.clientName);
                          setHistoryOpen(false);
                        }}
                      >
                        Abrir Relatório
                      </Button>

                      <Button
                        type="primary"
                        icon={<FilePdfOutlined />}
                        size="small"
                        onClick={() =>
                          generatePDF(
                            report.pieces,
                            report.totalM2,
                            report.totalM3,
                            report.standardHeight,
                            report.clientName,
                            report.userName || "Usuário",
                            report.category
                          )
                        }
                      >
                        PDF
                      </Button>
                    </div>

                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}