import { Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface InventoryItemType {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  price: number;
  status: InventoryStatus;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}

export const CATEGORIES = [
  { id: 'all',         label: 'Semua' },
  { id: 'Electronics', label: 'Elektronik' },
  { id: 'Furniture',   label: 'Furniture' },
  { id: 'Accessories', label: 'Aksesoris' },
  { id: 'Clothing',    label: 'Pakaian' },
  { id: 'Food',        label: 'Makanan' },
];

export const INVENTORY: InventoryItemType[] = [
  { 
    id: '1', 
    name: 'MacBook Pro 16"', 
    sku: 'MBP-16-001',
    category: 'Electronics', 
    stock: 15, 
    minStock: 5,
    unit: 'unit',
    price: 32999000,
    status: 'in_stock',
    icon: 'laptop'
  },
  { 
    id: '2', 
    name: 'Ergo Office Chair', 
    sku: 'FUR-CHR-002',
    category: 'Furniture', 
    stock: 2, 
    minStock: 5,
    unit: 'pcs',
    price: 2450000,
    status: 'low_stock',
    icon: 'bed'
  },
  { 
    id: '3', 
    name: 'Wireless Mouse', 
    sku: 'ELC-MOU-003',
    category: 'Electronics', 
    stock: 0, 
    minStock: 10,
    unit: 'unit',
    price: 850000,
    status: 'out_of_stock',
    icon: 'desktop-outline'
  },
  { 
    id: '4', 
    name: 'HDMI Cable 2m', 
    sku: 'ACC-CBL-004',
    category: 'Accessories', 
    stock: 4, 
    minStock: 10,
    unit: 'pcs',
    price: 125000,
    status: 'low_stock',
    icon: 'flash'
  },
  { 
    id: '5', 
    name: 'Coffee Beans 1kg', 
    sku: 'FOD-BEA-005',
    category: 'Food', 
    stock: 25, 
    minStock: 10,
    unit: 'pack',
    price: 185000,
    status: 'in_stock',
    icon: 'cafe'
  },
];

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

export const getStatusMeta = (status: InventoryStatus) => {
  switch (status) {
    case 'in_stock':
      return { label: 'Tersedia', color: Colors.inStock, bg: Colors.inStockBg };
    case 'low_stock':
      return { label: 'Hampir Habis', color: Colors.lowStock, bg: Colors.lowStockBg };
    case 'out_of_stock':
      return { label: 'Habis', color: Colors.outOfStock, bg: Colors.outOfStockBg };
    default:
      return { label: 'Unknown', color: Colors.textTertiary, bg: Colors.background };
  }
};

export const getCategoryMeta = (category: string) => {
  switch (category) {
    case 'Electronics':
      return { label: 'Elektronik', color: Colors.catElectronics, bg: Colors.catElectronicsBg };
    case 'Furniture':
      return { label: 'Furniture', color: Colors.catFurniture, bg: Colors.catFurnitureBg };
    case 'Accessories':
      return { label: 'Aksesoris', color: Colors.catOther, bg: Colors.catOtherBg };
    case 'Clothing':
      return { label: 'Pakaian', color: Colors.catClothing, bg: Colors.catClothingBg };
    case 'Food':
      return { label: 'Makanan', color: Colors.catFood, bg: Colors.catFoodBg };
    default:
      return { label: category, color: Colors.catOther, bg: Colors.catOtherBg };
  }
};
