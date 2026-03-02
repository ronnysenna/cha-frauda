// Types para o projeto Chá de Fraldas

export interface AttendanceRecord {
  id: number;
  nome: string;
  presenca: "sim" | "nao";
  itens: string[];
  observacoes: string;
  data_registro: string;
}

export interface StockItem {
  id: number;
  item_name: string;
  category: string;
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
  presenca: "sim" | "nao";
  itens: string[];
  observacoes: string;
}

// Removendo as listas hardcoded pois agora virão do DB
// export const ITEMS_FRALDAS = [
//   { name: "Fraldas P", category: "fraldas" },
//   { name: "Fraldas M", category: "fraldas" },
//   { name: "Fraldas G", category: "fraldas" },
//   { name: "Fraldas GG", category: "fraldas" },
//   { name: "Pacote Fralda de Pano", category: "fraldas" },
// ];

// export const ITEMS_BERCO = [
//   { name: "Cobertor de Berço", category: "berco" },
//   { name: "Manta Micro Fibra", category: "berco" },
//   { name: "Jogo de Lençol de Berço", category: "berco" },
//   { name: "Móbile Safári", category: "berco" },
//   { name: "Travesseiro Respirável", category: "berco" },
//   { name: "Ninho Redutor", category: "berco" },
//   { name: "Kit Abajur", category: "berco" },
//   { name: "Manta de Passeio", category: "berco" },
// ];

// export const ITEMS_ROUPAS = [
//   { name: "Babador", category: "roupas" },
//   { name: "Bodies Manga Curta P", category: "roupas" },
//   { name: "Bodies Manga Longa P", category: "roupas" },
//   { name: "Bodies Manga Curta M", category: "roupas" },
//   { name: "Bodies Manga Longa M", category: "roupas" },
//   { name: "Cueiro", category: "roupas" },
//   { name: "Kit Mijões c/3 RN", category: "roupas" },
//   { name: "Kit Mijões c/3 P", category: "roupas" },
//   { name: "Macacões RN", category: "roupas" },
//   { name: "Macacões P", category: "roupas" },
//   { name: "Kit c/3 Pares de Luva", category: "roupas" },
//   { name: "Kit c/3 Pares de Meia", category: "roupas" },
//   { name: "Saída da Maternidade", category: "roupas" },
// ];

// export const ITEMS_HIGIENE = [
//   { name: "Toalha com Capuz", category: "higiene" },
//   { name: "Toalha de Fralda", category: "higiene" },
//   { name: "Aspirador Nasal", category: "higiene" },
//   { name: "Kit de Mamadeira", category: "higiene" },
//   { name: "Kit Plástico s/Banheira", category: "higiene" },
//   { name: "Kit Manicure p/Bebê", category: "higiene" },
//   { name: "Kit Escova e Pente", category: "higiene" },
//   { name: "Lenço Umedecido", category: "higiene" },
//   { name: "Sabonete Líquido", category: "higiene" },
//   { name: "Pomada Bepantol Baby", category: "higiene" },
//   { name: "Talco", category: "higiene" },
// ];

// export const ALL_ITEMS = [
//   ...ITEMS_FRALDAS,
//   ...ITEMS_BERCO,
//   ...ITEMS_ROUPAS,
//   ...ITEMS_HIGIENE,
// ];
