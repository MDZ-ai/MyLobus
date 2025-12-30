
export interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  type: 'expense' | 'income';
  icon?: string;
}

export interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  isLegal: boolean; // Notificación con valor legal
}

export interface Document {
  id: string;
  name: string;
  type: 'ID' | 'HEALTH' | 'DRIVING' | 'DISABILITY';
  number: string;
  expiry: string;
  color: string;
}

export interface Parcel {
  id: string;
  tracking: string;
  status: 'En tránsito' | 'Entregado' | 'En proceso';
  description: string;
  date: string;
}

export interface UtilityContract {
  id: string;
  type: 'LUZ' | 'GAS' | 'FIBRA' | 'SIM';
  provider: string;
  status: 'Activa' | 'Vencida';
  monthlyCost?: number;
  details: string;
}

export interface InsurancePolicy {
  id: string;
  name: string;
  number: string;
  type: 'VIDA' | 'AUTO' | 'HOGAR';
  status: 'Activa';
  expiry: string;
  monthlyCost?: number;
}

export interface SimData {
  phoneNumber: string;
  provider: 'LoboTel' | 'StarMushroom' | 'OsoCel' | 'GagaNet';
  planName: string;
  dataTotalGB: number;
  dataUsedGB: number;
  minutesUsed: number;
  smsUsed: number;
  balance: number; // Saldo de la SIM
  nextRenewal: string;
  roaming: boolean;
}

export interface NewsItem {
  id: string;
  category: string;
  title: string;
  time: string;
  image: string;
  color: string;
}

export interface CryptoAsset {
    symbol: string;
    name: string;
    amount: number;
    valueUSD: number;
    change24h: number;
    color: string;
}

export interface Leader {
  id: string;
  handle: string;
  name: string;
  country: string;
  password?: string;
  pin?: string;
  rank: 'Omnipotente' | 'Máximo' | 'Industrial' | 'Élite' | 'Estable' | 'Medio' | 'Modesto' | 'Tecnológico';
  balance: number;
  avatarColor: string;
  bio: string;
  transactions: Transaction[];
  parcels: Parcel[];
  utilities: UtilityContract[];
  policies: InsurancePolicy[];
  messages: Message[];
  documents: Document[];
  sim: SimData;
  crypto: CryptoAsset[];
}

export interface StockData {
  time: string;
  value: number;
  volume: number;
}

export interface TransportRoute {
  id: string;
  name: string;
  origin: string;
  destination: string;
  status: 'A Tiempo' | 'Retrasado' | 'Rápido' | 'Lleno';
  type: 'GagaTren' | 'HieloTren' | 'BurroRail' | 'MicelioTren' | 'Bus';
  price: number;
}

export interface ServiceCategory {
  title: string;
  items: string[];
  type: 'BANK' | 'TRANSPORT' | 'PHONE' | 'UTILITY' | 'PUBLIC';
}

export interface CountryService {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  services: ServiceCategory[];
}

export type ViewState = 'LOGIN' | 'DASHBOARD' | 'FINANCE' | 'WALLET' | 'SOCIAL' | 'PAY' | 'SERVICES' | 'SERVICE_PAYMENT' | 'TRANSPORT' | 'MESSAGES' | 'DISCOVER' | 'AI' | 'SIM' | 'REWARDS';

export interface AppViewProps {
  user: Leader;
  updateBalance: (amount: number, description: string, subtitle?: string) => void;
  setView: (view: ViewState) => void;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
  onLogout?: () => void;
}