// Serviço para comunicação com a API do backend

import { AttendanceRecord, StockItem, StatsResponse, FormData } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const api = {
  // ===== REGISTROS =====
  async getRecords(): Promise<AttendanceRecord[]> {
    const response = await fetch(`${API_BASE}/records`);
    if (!response.ok) throw new Error("Erro ao buscar registros");
    const json = await response.json();
    return json.data;
  },

  async createRecord(data: FormData): Promise<AttendanceRecord> {
    const response = await fetch(`${API_BASE}/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao criar registro");
    const json = await response.json();
    return json.data;
  },

  async deleteRecord(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/records/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar registro");
  },

  // ===== ESTOQUE =====
  async getStock(): Promise<StockItem[]> {
    const response = await fetch(`${API_BASE}/stock`);
    if (!response.ok) throw new Error("Erro ao buscar estoque");
    const json = await response.json();
    return json.data;
  },

  async initializeStock(): Promise<void> {
    const response = await fetch(`${API_BASE}/stock/initialize`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Erro ao inicializar estoque");
  },

  async reduceStock(itemName: string, quantity: number = 1): Promise<void> {
    const response = await fetch(`${API_BASE}/stock/reduce`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_name: itemName, quantity }),
    });
    if (!response.ok) throw new Error(`Erro ao reduzir ${itemName}`);
  },

  async increaseStock(itemName: string, quantity: number = 1): Promise<void> {
    const response = await fetch(`${API_BASE}/stock/increase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_name: itemName, quantity }),
    });
    if (!response.ok) throw new Error(`Erro ao aumentar ${itemName}`);
  },

  // ===== ESTATÍSTICAS =====
  async getStats(): Promise<StatsResponse> {
    const response = await fetch(`${API_BASE}/stats`);
    if (!response.ok) throw new Error("Erro ao buscar estatísticas");
    const json = await response.json();
    return json.data;
  },
};
