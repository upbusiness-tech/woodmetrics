import { type SavedReport } from "../types/wood"; 

const STORAGE_KEY = "madereira-sj-reports";

export const loadReports = (): SavedReport[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveReports = (reports: SavedReport[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
};