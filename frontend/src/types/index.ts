// Types para o projeto Chá de Fraldas

export interface AttendanceRecord {
  id: number;
  nome: string;
  presenca: 'sim' | 'nao';
  itens: string[];
  observacoes: string;
  data_registro: string;
}

export interface StockItem {
  id: number;
  item_name: string;
  quantity: number;
  initial_quantity: number;
  last_updated: string;
}

export interface StatsResponse {
  total_registros: number;
  confirmados: number;
  ausentes: number;
  itens_selecionados: Record<string, number>;
}

export interface FormData {
  nome: string;
  presenca: 'sim' | 'nao';
  itens: string[];
  observacoes: string;
}

export const ITEMS_FRALDAS = [
  { name: 'Fraldas P', category: 'fraldas' },
  { name: 'Fraldas M', category: 'fraldas' },
  { name: 'Fraldas G', category: 'fraldas' },
  { name: 'Fraldas GG', category: 'fraldas' },
  { name: 'Pacote de Pano', category: 'fraldas' },
];

export const ITEMS_BERCO = [
  { name: 'Berço Completo', category: 'berco' },
  { name: 'Colchão e Protetor', category: 'berco' },
  { name: 'Jogo de Cama', category: 'berco' },
  { name: 'Almofada de Amamentação', category: 'berco' },
];

export const ITEMS_ROUPAS = [
  { name: 'Macacão RN', category: 'roupas' },
  { name: 'Body RN', category: 'roupas' },
  { name: 'Calça Soft', category: 'roupas' },
  { name: 'Casaco Quentinho', category: 'roupas' },
  { name: 'Meias e Luvas', category: 'roupas' },
];

export const ITEMS_HIGIENE = [
  { name: 'Fralda de Pano', category: 'higiene' },
  { name: 'Lenço Umedecido', category: 'higiene' },
  { name: 'Sabonete Líquido', category: 'higiene' },
  { name: 'Creme para Assadura', category: 'higiene' },
];

export const ALL_ITEMS = [
  ...ITEMS_FRALDAS,
  ...ITEMS_BERCO,
  ...ITEMS_ROUPAS,
  ...ITEMS_HIGIENE,
];
