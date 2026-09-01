import { TransactionType } from '../types';

export interface ParsedTransaction {
  amount: number;
  category: string;
  type: TransactionType;
  description: string;
  confidence: number; // 0 to 1
  matchedKeyword?: string;
  matchedAmountText?: string;
}

interface CategoryRule {
  category: string;
  type: TransactionType;
  keywords: string[];
}

const CATEGORY_RULES: CategoryRule[] = [
  // --- EXPENSES ---
  {
    category: 'Food',
    type: 'expense',
    keywords: [
      'makan siang', 'makan malam', 'sarapan', 'makan', 'lunch', 'dinner', 'breakfast',
      'nasi padang', 'padang', 'nasi', 'ayam geprek', 'geprek', 'ayam', 'bakso', 'mie ayam', 'mie',
      'seblak', 'sate', 'martabak', 'soto', 'rawon', 'pecel', 'rendang', 'gudeg',
      'pizza', 'burger', 'mcd', 'kfc', 'hokben', 'sushi', 'dunkin', 'roti', 'kue',
      'snack', 'cemilan', 'gofood', 'grabfood', 'shopeefood', 'warteg', 'restoran', 'cafe',
      'makanan', 'jajan', 'kuliner', 'supermarket', 'buah', 'sayur'
    ],
  },
  {
    category: 'Transportation',
    type: 'expense',
    keywords: [
      'gojek', 'goride', 'gocar', 'grab', 'grabcar', 'grabfood', 'maxim', 'indriver',
      'ojol', 'bensin', 'pertalite', 'pertamax', 'solar', 'shell', 'spbu',
      'parkir', 'tol', 'e-toll', 'krl', 'mrt', 'lrt', 'kereta', 'commuter',
      'busway', 'transjakarta', 'tj', 'taksi', 'taxi', 'angkot', 'ojek',
      'service motor', 'servis', 'ganti oli', 'tambal ban', 'cuci motor', 'cuci mobil',
      'transportasi', 'transport', 'ongkir', 'travel', 'tiket'
    ],
  },
  {
    category: 'Drinks',
    type: 'expense',
    keywords: [
      'kopi', 'coffee', 'ngopi', 'es kopi', 'latte', 'cappuccino', 'americano',
      'starbucks', 'janji jiwa', 'kopi kenangan', 'fore', 'point coffee', 'tomoro',
      'boba', 'chatime', 'mixue', 'es teh', 'esteh', 'teh', 'jus', 'juice', 'smoothie',
      'minum', 'minuman', 'aqua', 'le minerale', 'air mineral', 'susu', 'boba'
    ],
  },
  {
    category: 'Quota',
    type: 'expense',
    keywords: [
      'pulsa', 'kuota', 'paket data', 'data', 'internet', 'telkomsel', 'by.u', 'byu',
      'indosat', 'im3', 'xl', 'axis', 'tri', 'smartfren', 'wifi', 'indihome',
      'biznet', 'first media', 'myrepublic', 'tagihan internet', 'topup pulsa'
    ],
  },
  {
    category: 'Personal',
    type: 'expense',
    keywords: [
      'baju', 'celana', 'kaos', 'kemeja', 'sepatu', 'sandal', 'tas', 'jaket',
      'skincare', 'makeup', 'parfum', 'facial', 'potong rambut', 'barbershop', 'salon',
      'nonton', 'bioskop', 'cinema', 'xxi', 'cgv', 'netflix', 'spotify', 'youtube premium',
      'game', 'steam', 'playstation', 'topup game', 'diamond', 'mlbb', 'pubg', 'genshin',
      'gym', 'fitness', 'olahraga', 'futsal', 'badminton', 'shopee', 'tokopedia', 'lazada',
      'tiktok shop', 'belanja', 'pakaian', 'fashion', 'hobi', 'buku', 'novel'
    ],
  },
  {
    category: 'Household',
    type: 'expense',
    keywords: [
      'listrik', 'pln', 'token listrik', 'token', 'pdam', 'tagihan air', 'air pdam',
      'gas lpg', 'gas', 'galon', 'isi ulang galon', 'sabun', 'shampoo', 'deterjen',
      'pewangi', 'pasta gigi', 'odol', 'tisu', 'bayar kos', 'kosan', 'kost',
      'kontrakan', 'sewa rumah', 'iuran', 'kebersihan', 'keamanan', 'ipl',
      'renovasi', 'perabot', 'belanja bulanan', 'indomaret', 'alfamart', 'alfamidi'
    ],
  },

  // --- INCOMES ---
  {
    category: 'Salary',
    type: 'income',
    keywords: [
      'gaji', 'salary', 'payroll', 'upah', 'honor', 'gajian', 'penghasilan bulanan',
      'tunjangan', 'thr', 'gaji pokok'
    ],
  },
  {
    category: 'Bonus',
    type: 'income',
    keywords: [
      'bonus', 'insentif', 'hadiah', 'angpao', 'kado', 'giveaway', 'reward',
      'cashback', 'dikasih', 'hibah', 'warisan', 'transferan'
    ],
  },
  {
    category: 'Freelance',
    type: 'income',
    keywords: [
      'freelance', 'side job', 'project', 'proyek', 'jasa', 'desain', 'coding',
      'website', 'klien', 'client', 'komisi', 'fee', 'side hustle', 'penjualan'
    ],
  },
];

/**
 * Parses numeric amount from text patterns:
 * e.g., '18k', '18.000', '18000', '18rb', '18 ribu', '2.5jt', '2,5jt', '2.5 juta', 'Rp 18.000', 'Rp18k'
 */
export function extractAmount(text: string): { amount: number; matchedText: string } | null {
  // Normalize string for regex matching
  const cleaned = text.trim();

  // Pattern 1: Millions ('jt', 'juta', 'm') -> e.g. 5jt, 2.5jt, 2,5 juta, 10 juta
  const millionMatch = cleaned.match(/(?:rp\.?\s*)?(\d+(?:[.,]\d+)?)\s*(?:jt|juta|million|m\b)/i);
  if (millionMatch) {
    const rawVal = parseFloat(millionMatch[1].replace(',', '.'));
    if (!isNaN(rawVal) && rawVal > 0) {
      return {
        amount: Math.round(rawVal * 1_000_000),
        matchedText: millionMatch[0],
      };
    }
  }

  // Pattern 2: Thousands ('k', 'rb', 'ribu') -> e.g. 18k, 18.5k, 18rb, 18 ribu, 9k
  const thousandMatch = cleaned.match(/(?:rp\.?\s*)?(\d+(?:[.,]\d+)?)\s*(?:k|rb|ribu|thousand)\b/i);
  if (thousandMatch) {
    const rawVal = parseFloat(thousandMatch[1].replace(',', '.'));
    if (!isNaN(rawVal) && rawVal > 0) {
      return {
        amount: Math.round(rawVal * 1_000),
        matchedText: thousandMatch[0],
      };
    }
  }

  // Pattern 3: Formatted IDR numbers with dots/commas -> e.g. Rp 18.000, 18.000, 150.000, 1.500.000
  const formattedIdrMatch = cleaned.match(/(?:rp\.?\s*)?(\d{1,3}(?:\.\d{3})+)(?:,\d+)?/i);
  if (formattedIdrMatch) {
    const rawVal = parseInt(formattedIdrMatch[1].replace(/\./g, ''), 10);
    if (!isNaN(rawVal) && rawVal > 0) {
      return {
        amount: rawVal,
        matchedText: formattedIdrMatch[0],
      };
    }
  }

  // Pattern 4: Plain integer numbers (at least 3 digits or preceded by Rp) -> e.g. '18000', 'Rp 9000', '9000'
  const plainMatch = cleaned.match(/(?:rp\.?\s*)?(\b\d{3,9}\b)/i);
  if (plainMatch) {
    const rawVal = parseInt(plainMatch[1], 10);
    if (!isNaN(rawVal) && rawVal > 0) {
      return {
        amount: rawVal,
        matchedText: plainMatch[0],
      };
    }
  }

  return null;
}

/**
 * Main smart parser that extracts:
 * - Amount (e.g. 18.000 from 18k)
 * - Category (e.g. Food from makan siang)
 * - Type (expense or income)
 * - Cleaned Description
 */
export function parseSmartTransaction(input: string): ParsedTransaction {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      amount: 0,
      category: 'Food',
      type: 'expense',
      description: '',
      confidence: 0,
    };
  }

  // 1. Extract Amount
  const amountResult = extractAmount(trimmed);
  const amount = amountResult ? amountResult.amount : 0;
  const matchedAmountText = amountResult ? amountResult.matchedText : undefined;

  // 2. Identify Category and Type
  const lowerInput = trimmed.toLowerCase();
  let matchedCategory = 'Food';
  let matchedType: TransactionType = 'expense';
  let matchedKeyword = '';
  let highestKeywordLength = 0;

  for (const rule of CATEGORY_RULES) {
    for (const kw of rule.keywords) {
      // Look for whole word or substring match
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
      if (regex.test(lowerInput) || lowerInput.includes(kw)) {
        // Prioritize longer/more specific keyword matches
        if (kw.length > highestKeywordLength) {
          highestKeywordLength = kw.length;
          matchedCategory = rule.category;
          matchedType = rule.type;
          matchedKeyword = kw;
        }
      }
    }
  }

  // 3. Clean up Description
  let cleanDesc = trimmed;
  if (matchedAmountText) {
    cleanDesc = cleanDesc.replace(matchedAmountText, '');
  }
  // Strip trailing punctuation, extra spaces, "rp", "untuk", "beli", etc.
  cleanDesc = cleanDesc
    .replace(/^[\s,.\-—:]+|[\s,.\-—:]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Capitalize first letter of description
  if (cleanDesc) {
    cleanDesc = cleanDesc.charAt(0).toUpperCase() + cleanDesc.slice(1);
  } else {
    // If user only typed "18k", fallback description to category name
    cleanDesc = matchedKeyword
      ? matchedKeyword.charAt(0).toUpperCase() + matchedKeyword.slice(1)
      : matchedCategory;
  }

  // Confidence score calculation
  let confidence = 0.2;
  if (amount > 0) confidence += 0.4;
  if (highestKeywordLength > 0) confidence += 0.4;

  return {
    amount,
    category: matchedCategory,
    type: matchedType,
    description: cleanDesc,
    confidence: Math.min(confidence, 1),
    matchedKeyword,
    matchedAmountText,
  };
}
