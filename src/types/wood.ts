export interface WoodPiece {
  id: string;
  type: string;
  length: number;
  width: number;
  totalM2: number;
}

export interface SavedReport {
  id: string;
  date: string;
  pieces: WoodPiece[];
  standardHeight: number;
  totalM2: number;
  totalM3: number;
}