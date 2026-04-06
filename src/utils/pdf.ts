import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { type WoodPiece } from "../types/wood";
import logo from "../assets/logo.jpg";

export const generatePDF = (
  pieces: WoodPiece[],
  totalM2: number,
  totalM3: number,
  height: number,
  clientName: string,
  responsavel: string,
  category: string
) => {
  const doc = new jsPDF();

  const date = new Date().toLocaleDateString();

  // 🔹 Logo
  doc.addImage(logo, "JPEG", 14, 10, 15, 15);

  // 🔹 Empresa esquerda
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("MADEREIRA SÃO JOSÉ", 36, 16);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("CNPJ: 09.302.644/0001-09", 36, 21);
  doc.text("Rua Epitacio Pessoa, Centro", 36, 25);
  doc.text("Quixadá-CE | 88996621104", 36, 29);

  // 🔹 Empresa direita
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("UpBusiness Tecnologia", 196, 16, { align: "right" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("CNPJ: 65.028.550/0001-64", 196, 21, { align: "right" });
  doc.text("upbusinessenterprise@gmail.com", 196, 25, { align: "right" });
  doc.text("88996882815", 196, 29, { align: "right" });

  // 🔹 Linha divisória
  doc.setDrawColor(180);
  doc.line(14, 34, 196, 34);

  // 🔹 Título
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("RELATÓRIO DE MEDIDAS", 105, 48, { align: "center" });

  // 🔹 Infos principais (layout horizontal)
  let y = 55;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  // Linha 1
  doc.text(`Responsável: ${responsavel || "-"}`, 14, y);

  doc.text(
    `Cliente: ${clientName || "-"}`,
    105,
    y,
    { align: "center" }
  );

  doc.text(
    `Data: ${date}`,
    196,
    y,
    { align: "right" }
  );

  y += 6;

  // Linha 2
  doc.text(`Categoria: ${category || "-"}`, 14, y);

  doc.text(
    `Espessura: ${height.toFixed(3)} m`,
    196,
    y,
    { align: "right" }
  );

  // 🔹 Totais
  const totalLength = pieces.reduce((acc, p) => acc + p.length, 0);
  const totalWidth = pieces.reduce((acc, p) => acc + p.width, 0);

  y += 10;

  doc.setFont("helvetica", "bold");

  doc.text(`Volume Total: ${totalM3.toFixed(2)} m³`, 14, y);
  doc.text(`Área Total: ${totalM2.toFixed(2)} m²`, 196, y, { align: "right" });

  y += 6;

  doc.text(`Comprimento Total: ${totalLength.toFixed(2)} m`, 14, y);
  doc.text(`Largura Total: ${totalWidth.toFixed(2)} m`, 196, y, { align: "right" });

  doc.setFont("helvetica", "normal");

  // 🔹 Tabela
  autoTable(doc, {
    startY: y + 10,
    head: [["#", "Comprimento (m)", "Largura (m)", "Área (m²)", "Volume (m³)"]],
    body: pieces.map((p, index) => [
      index + 1,
      p.length.toFixed(2),
      p.width.toFixed(2),
      p.totalM2.toFixed(3),
      (p.length * p.width * height).toFixed(3),
    ]),
    foot: [
      [
        "TOTAL",
        `${totalLength.toFixed(2)} m`,
        `${totalWidth.toFixed(2)} m`,
        `${totalM2.toFixed(3)} m²`,
        `${totalM3.toFixed(3)} m³`,
      ],
    ],
    styles: {
      halign: "center",
      fontSize: 9,
    },
    headStyles: {
      fillColor: [46, 94, 30],
    },
    footStyles: {
      fontStyle: "bold",
    },
  });

  // 🔹 Download
  doc.save("relatorio.pdf");
};