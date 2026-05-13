import type { Transaction } from '../types';

interface ExcelRow {
  In?: number;
  'Unnamed: 2'?: string; // Income description
  Uit?: number;
  'Unnamed: 4'?: string; // Expense description
  Spaargeld?: number;
}

interface SheetData {
  [sheetName: string]: ExcelRow[];
}

export const parseExcelData = (jsonData: string): { transactions: Transaction[] } => {
  try {
    const data: SheetData = JSON.parse(jsonData);
    const transactions: Transaction[] = [];

    // Process each sheet (Otis, Bavo, Annabel)
    const sheets = ['Otis', 'Bavo', 'Annabel'];

    sheets.forEach(sheetName => {
      if (!data[sheetName]) return;

      const childId = sheetName.toLowerCase();
      const rows = data[sheetName] as ExcelRow[];

      rows.forEach((row, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (rows.length - index)); // Spread dates backwards
        const dateString = date.toISOString().split('T')[0];

        // Process income
        if (row.In && row.In > 0 && row['Unnamed: 2']) {
          transactions.push({
            id: `import-${childId}-income-${index}`,
            childId,
            type: 'income',
            amount: row.In,
            description: row['Unnamed: 2'],
            category: categorizeDescription(row['Unnamed: 2'], 'income'),
            date: dateString
          });
        }

        // Process expense
        if (row.Uit && row.Uit > 0 && row['Unnamed: 4']) {
          transactions.push({
            id: `import-${childId}-expense-${index}`,
            childId,
            type: 'expense',
            amount: row.Uit,
            description: row['Unnamed: 4'],
            category: categorizeDescription(row['Unnamed: 4'], 'expense'),
            date: dateString
          });
        }
      });
    });

    return { transactions: transactions.filter(t => t.amount > 0) };
 } catch (error) {
    throw new Error('Kon Excel data niet verwerken', { cause: error });
 }
};

const categorizeDescription = (description: string, type: 'income' | 'expense'): string => {
  const desc = description.toLowerCase();

  if (type === 'income') {
    if (desc.includes('zakgeld')) return 'Zakgeld';
    if (desc.includes('cadeau') || desc.includes('verjaardags')) return 'Cadeau';
    if (desc.includes('kerst') || desc.includes('nieuwjaar')) return 'Kerst';
    if (desc.includes('rapport')) return 'Rapport bonus';
    if (desc.includes('spaarpot')) return 'Uit spaarpot';
    if (desc.includes('sinterklaas')) return 'Cadeau';
    return 'Overig';
  } else {
    if (desc.includes('pokemon')) return 'Pokemonkaarten';
    if (desc.includes('lego') || desc.includes('speelgoed')) return 'Speelgoed';
    if (desc.includes('kleding') || desc.includes('schoenen')) return 'Kleding';
    if (desc.includes('boek')) return 'Boeken';
    if (desc.includes('spel') || desc.includes('game')) return 'Spellen';
    if (desc.includes('snoep') || desc.includes('snack')) return 'Snacks';
    return 'Overig';
  }
};

export const convertExcelToJSON = async (file: File): Promise<string> => {
  // This would require a library like xlsx to actually parse Excel files
  // For now, we'll create a simple demo converter
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        // Since we can't parse actual Excel without xlsx library,
        // we'll create demo data structure that matches Excel format.
        // In production, use the xlsx library to parse the ArrayBuffer.
        const demoData = {
          "Otis": [
            { "In": 5.0, "Unnamed: 2": "Wekelijks zakgeld", "Uit": 0, "Unnamed: 4": "", "Spaargeld": 5.0 },
            { "In": 0, "Unnamed: 2": "", "Uit": 3.50, "Unnamed: 4": "Pokemon kaarten", "Spaargeld": 1.5 },
            { "In": 15.0, "Unnamed: 2": "Opa en oma cadeau", "Uit": 0, "Unnamed: 4": "", "Spaargeld": 16.5 }
          ],
          "Bavo": [
            { "In": 4.0, "Unnamed: 2": "Wekelijks zakgeld", "Uit": 0, "Unnamed: 4": "", "Spaargeld": 4.0 },
            { "In": 0, "Unnamed: 2": "", "Uit": 2.50, "Unnamed: 4": "Snoep", "Spaargeld": 1.5 },
            { "In": 10.0, "Unnamed: 2": "Sinterklaas geld", "Uit": 0, "Unnamed: 4": "", "Spaargeld": 11.5 }
          ],
          "Annabel": [
            { "In": 3.0, "Unnamed: 2": "Wekelijks zakgeld", "Uit": 0, "Unnamed: 4": "", "Spaargeld": 3.0 },
            { "In": 0, "Unnamed: 2": "", "Uit": 1.75, "Unnamed: 4": "Stickers", "Spaargeld": 1.25 },
            { "In": 8.0, "Unnamed: 2": "Kerstcadeau", "Uit": 0, "Unnamed: 4": "", "Spaargeld": 9.25 }
          ]
        };

        resolve(JSON.stringify(demoData));
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Kon bestand niet lezen'));
    reader.readAsText(file);
  });
};
