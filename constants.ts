import { Leader, TransportRoute, StockData, CountryService, Parcel, UtilityContract, InsurancePolicy, Message, Document } from './types';

// --- CONFIGURACIÓN DE MARCA ---
// La imagen "logo.png" debe estar en la carpeta "public" del proyecto.
export const BRAND_LOGO = "/logo.png"; 
// -----------------------------

const INITIAL_TRANSACTIONS = [
  { id: 't1', title: 'Nómina Unión', subtitle: 'Salario', amount: 5000, date: 'Hoy', type: 'income' as const },
  { id: 't2', title: 'Café Lobus', subtitle: 'Desayuno', amount: -15, date: 'Ayer', type: 'expense' as const },
];

const MOCK_PARCELS: Parcel[] = [
    { id: 'p1', tracking: 'LB-ES-883920', status: 'En tránsito', description: 'Paquete Amazon Lobus', date: 'Entrega: Mañana' },
    { id: 'p2', tracking: 'LB-EX-112233', status: 'En proceso', description: 'Pasaporte Oficial', date: 'Recibido en central' }
];

const MOCK_UTILITIES: UtilityContract[] = [
    { id: 'u1', type: 'LUZ', provider: 'Lobus Energía', status: 'Activa', details: 'Casa Roma - POD IT001', monthlyCost: 45.20 },
    { id: 'u2', type: 'SIM', provider: 'LoboTel', status: 'Activa', details: '333 1234567 - 100GB', monthlyCost: 9.99 }
];

const MOCK_POLICIES: InsurancePolicy[] = [
    { id: 'i1', name: 'Lobus Protección Futuro', number: '100098765', type: 'VIDA', status: 'Activa', expiry: '12/2030' },
    { id: 'i2', name: 'Seguro Auto Premium', number: 'AUTO-221199', type: 'AUTO', status: 'Activa', expiry: '05/2026' }
];

const MOCK_MESSAGES: Message[] = [
  { id: 'm1', sender: 'Agencia Tributaria Lobus', subject: 'Pago de Impuestos 2025', preview: 'Su aviso de pago está disponible.', date: '09:15', read: false, isLegal: true },
  { id: 'm2', sender: 'Sistema de Salud', subject: 'Cita Confirmada', preview: 'Vacunación programada para el martes.', date: 'Ayer', read: true, isLegal: false },
];

const MOCK_DOCUMENTS: Document[] = [
  { id: 'd1', name: 'Identidad Digital', type: 'ID', number: 'LB-8829102', expiry: '12/2030', color: 'bg-gradient-to-br from-blue-500 to-blue-700' },
  { id: 'd2', name: 'Tarjeta Sanitaria', type: 'HEALTH', number: 'TS-991002', expiry: '05/2026', color: 'bg-gradient-to-br from-teal-400 to-teal-600' },
  { id: 'd3', name: 'Patente de Conducir', type: 'DRIVING', number: 'LIC-772819', expiry: '01/2032', color: 'bg-gradient-to-br from-pink-500 to-rose-600' },
];

export const LEADERS: Leader[] = [
  { 
      id: '1', handle: '@bibubib', name: 'Bibu Bib', country: 'País Lobito', password: 'admin', pin: '1234', rank: 'Omnipotente', balance: 999999999, avatarColor: 'bg-yellow-500', 
      bio: 'Presidente de la Unión Lobus.', transactions: [...INITIAL_TRANSACTIONS], parcels: MOCK_PARCELS, utilities: MOCK_UTILITIES, policies: MOCK_POLICIES, messages: MOCK_MESSAGES, documents: MOCK_DOCUMENTS
  },
  { 
      id: '2', handle: '@lobitopeludito', name: 'Lobito Peludito', country: 'País Lobito', password: 'lobo', pin: '0', rank: 'Máximo', balance: 50000000, avatarColor: 'bg-purple-500', 
      bio: 'Vicepresidente de la Unión Lobus.', transactions: [...INITIAL_TRANSACTIONS], parcels: [], utilities: [], policies: [], messages: [], documents: [] 
  },
  { id: '3', handle: '@osopepe', name: 'Oso Pepe', country: 'País Oso', password: 'oso', pin: '1111', rank: 'Industrial', balance: 25000000, avatarColor: 'bg-blue-600', bio: 'Presidente País Oso.', transactions: [...INITIAL_TRANSACTIONS], parcels: [], utilities: [], policies: [], messages: [], documents: [] },
  { id: '4', handle: '@higor', name: 'Higor Panzón', country: 'País Plingor', password: 'dragon', pin: '3333', rank: 'Élite', balance: 10000000, avatarColor: 'bg-red-500', bio: 'Presidente País Plingor.', transactions: [...INITIAL_TRANSACTIONS], parcels: [], utilities: [], policies: [], messages: [], documents: [] },
  { id: '5', handle: '@capy', name: 'Capy Capibara', country: 'País Capy', password: 'chill', pin: '2222', rank: 'Estable', balance: 5000000, avatarColor: 'bg-green-500', bio: 'Presidente País Capy.', transactions: [...INITIAL_TRANSACTIONS], parcels: [], utilities: [], policies: [], messages: [], documents: [] },
  { id: '6', handle: '@luigi', name: 'Luigi Mario', country: 'País Hongo', password: 'verde', pin: '4444', rank: 'Medio', balance: 1000000, avatarColor: 'bg-indigo-500', bio: 'Presidente País Hongo.', transactions: [...INITIAL_TRANSACTIONS], parcels: [], utilities: [], policies: [], messages: [], documents: [] },
  { id: '7', handle: '@perrito', name: 'Perrito', country: 'País Perrito', password: 'guau', pin: '5555', rank: 'Modesto', balance: 500000, avatarColor: 'bg-orange-400', bio: 'Ciudadano.', transactions: [...INITIAL_TRANSACTIONS], parcels: [], utilities: [], policies: [], messages: [], documents: [] },
  { id: '8', handle: '@pingui', name: 'Pingüino', country: 'País Pingüino', password: 'hielo', pin: '6666', rank: 'Tecnológico', balance: 75000000, avatarColor: 'bg-cyan-400', bio: 'Presidente País Pingüino.', transactions: [...INITIAL_TRANSACTIONS], parcels: [], utilities: [], policies: [], messages: [], documents: [] },
];

export const ROUTES: TransportRoute[] = [
  { id: 'r1', name: 'Ruta Dorada', origin: 'País Lobito', destination: 'País Oso', type: 'MicelioTren', status: 'Rápido', price: 50 },
  { id: 'r2', name: 'Expreso Polar', origin: 'Nación Hielo', destination: 'Capital Gaga', type: 'HieloTren', status: 'A Tiempo', price: 120 },
  { id: 'r3', name: 'Carga Pesada', origin: 'Zona Industrial', destination: 'Puerto', type: 'BurroRail', status: 'Retrasado', price: 15 },
  { id: 'r4', name: 'HyperLoop Gaga', origin: 'Capital Gaga', destination: 'País Lobito', type: 'GagaTren', status: 'Lleno', price: 200 },
  // Bus Routes
  { id: 'b1', name: 'LobusBus 101', origin: 'Centro', destination: 'Plaza Oso', type: 'Bus', status: 'A Tiempo', price: 2.50 },
  { id: 'b2', name: 'Nocturno N5', origin: 'Discoteca', destination: 'Residencial', type: 'Bus', status: 'Rápido', price: 5.00 },
  { id: 'b3', name: 'Interurbano L-P', origin: 'País Lobito', destination: 'País Perrito', type: 'Bus', status: 'Retrasado', price: 12.00 },
];

export const MOCK_STOCK_DATA_1D: StockData[] = [
  { time: '09:00', value: 4000, volume: 2400 },
  { time: '12:00', value: 2780, volume: 3908 },
  { time: '15:00', value: 3490, volume: 4300 },
];

export const MOCK_STOCK_DATA_1M: StockData[] = [
  { time: 'Sem 1', value: 3200, volume: 10000 },
  { time: 'Sem 2', value: 3500, volume: 12000 },
];

export const COMPANIES = [
  { symbol: 'LBX', name: 'Industrias Lobus', price: 3490, change: '+12.5%' },
  { symbol: 'GGA', name: 'Corp Gaga', price: 1250, change: '-2.1%' },
  { symbol: 'MCL', name: 'Tecnología Micelio', price: 890, change: '+5.4%' },
  { symbol: 'OSO', name: 'Minería Oso', price: 5400, change: '+1.2%' },
];

export const LOBUS_UNION_SERVICES: CountryService[] = [
    {
        id: 'LOBITO', name: 'País Lobito', emoji: '🐺', description: 'Capital Federal de la Unión', color: 'bg-indigo-50',
        services: [
            { title: 'Gobierno', type: 'PUBLIC', items: ['Agencia Tributaria', 'Registro Civil', 'Multas y Sanciones'] },
            { title: 'Banca', type: 'BANK', items: ['Banco Central Lobus', 'Caja de Ahorros'] },
            { title: 'Transporte', type: 'TRANSPORT', items: ['Lobus Pass', 'Peajes Autopista'] }
        ]
    },
    {
        id: 'OSO', name: 'País Oso', emoji: '🐻', description: 'Región Industrial y Mielera', color: 'bg-amber-50',
        services: [
            { title: 'Suministros', type: 'UTILITY', items: ['Energía Osa', 'Gas del Bosque'] },
            { title: 'Comercio', type: 'BANK', items: ['Banco de Miel', 'Inversiones Salmón'] },
            { title: 'Transporte', type: 'TRANSPORT', items: ['Tren Minero', 'Carga Pesada'] }
        ]
    },
    {
        id: 'PLINGOR', name: 'País Plingor', emoji: '🐲', description: 'Tierra de Dragones y Fuego', color: 'bg-red-50',
        services: [
            { title: 'Seguridad', type: 'PUBLIC', items: ['Control de Vuelo', 'Permisos de Fuego'] },
            { title: 'Energía', type: 'UTILITY', items: ['Geotermia Plingor', 'Volcán Power'] },
        ]
    },
    {
        id: 'CAPY', name: 'País Capy', emoji: '🥔', description: 'Zona de Relax y Aguas Termales', color: 'bg-green-50',
        services: [
            { title: 'Turismo', type: 'PUBLIC', items: ['Tasa Turística', 'Reserva de Spas'] },
            { title: 'Agua', type: 'UTILITY', items: ['Aguas Termales', 'Saneamiento Zen'] },
        ]
    },
    {
        id: 'HONGO', name: 'País Hongo', emoji: '🍄', description: 'Innovación Micelar y Tuberías', color: 'bg-emerald-50',
        services: [
            { title: 'Infraestructura', type: 'UTILITY', items: ['Mantenimiento Tuberías', 'Red Micelio'] },
            { title: 'Conectividad', type: 'PHONE', items: ['StarMushroom', 'ToadNet'] },
        ]
    },
    {
        id: 'PERRITO', name: 'País Perrito', emoji: '🐶', description: 'Lealtad y Parques Públicos', color: 'bg-orange-50',
        services: [
            { title: 'Ciudadanía', type: 'PUBLIC', items: ['Licencia de Hueso', 'Registro Canino'] },
            { title: 'Salud', type: 'PUBLIC', items: ['Veterinaria Pública', 'Seguro de Cola'] },
        ]
    },
    {
        id: 'PINGUI', name: 'País Pingüino', emoji: '🐧', description: 'Tecnología y Hielo', color: 'bg-cyan-50',
        services: [
            { title: 'Tech', type: 'PHONE', items: ['Linux Server Hosting', 'Fibra Óptica Glaciar'] },
            { title: 'Climatización', type: 'UTILITY', items: ['Refrigeración Central', 'Deshielo Urbano'] },
        ]
    },
];