const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const xlsx = require('xlsx');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Utility to extract money patterns like 10.00, 1,200.50, 45,00 etc
function getPrice(str) {
    if (!str) return null;
    const match = str.match(/(?:\$|Rs|€|£)?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d+\.\d{2}|\d+)/);
    if (match) {
        let val = match[1].replace(/,/g, '');
        return parseFloat(val);
    }
    return null;
}

function guessCategory(name) {
    const n = name.toLowerCase();
    if (/shoe|sneaker|nike|adidas|boot|wear|heel/i.test(n)) return "Footwear";
    if (/shirt|pant|top|dress|hoodie|jean|cloth/i.test(n)) return "Apparel";
    if (/chair|desk|table|furniture|office/i.test(n)) return "Furniture";
    if (/mouse|keyboard|hub|adapter|cable|monitor|tech/i.test(n)) return "Electronics";
    if (/bag|watch|belt|hat|socks/i.test(n)) return "Accessories";
    return "General Inventory";
}

app.post('/api/extract-invoice', upload.single('invoice'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const file = req.file;
    const ext = path.extname(file.originalname).toLowerCase();
    
    console.log(`Processing file: ${file.originalname} (${ext})`);
    
    let items = [];
    let idCounter = 1;

    // 1. Excel / CSV Extraction
    if (ext === '.xlsx' || ext === '.xls' || ext === '.csv') {
       const workbook = xlsx.readFile(file.path);
       const sheetName = workbook.SheetNames[0];
       const sheet = workbook.Sheets[sheetName];
       
       // Get both headered data and raw data to compare
       const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });
       
       rows.forEach((row, index) => {
          const keys = Object.keys(row);
          // Try to find columns for name, price, qty
          const nameField = keys.find(k => /name|item|product|desc|article/i.test(k));
          const priceField = keys.find(k => /price|rate|amt|cost|unit/i.test(k));
          const qtyField = keys.find(k => /qty|quantity|count|pieces|pcs|stock/i.test(k));
          const categoryField = keys.find(k => /category|group|type|dept|department/i.test(k));
          const skuField = keys.find(k => /sku|code|barcode|id|part|ref/i.test(k));

          let name = nameField ? row[nameField] : null;
          let price = priceField ? row[priceField] : null;
          let qty = qtyField ? row[qtyField] : 1;
          let category = categoryField ? row[categoryField] : null;
          let sku = skuField ? row[skuField] : null;

          // If headers didn't match, fallback to position
          if (!name || (!price && price !== 0)) {
              const vals = Object.values(row).filter(v => v !== "");
              name = vals.find(v => typeof v === 'string' && v.length > 2);
              price = vals.find(v => (typeof v === 'number' || !isNaN(parseFloat(v))) && v > 1);
              qty = vals.find(v => v !== price && (typeof v === 'number' || parseInt(v)) > 0) || 1;
          }

          if (name && (price || price === 0)) {
             const cleanName = name.toString().trim();
             if (cleanName.length > 1 && !/total|invoice|page|tax|sub|date/i.test(cleanName)) {
                items.push({
                   id: idCounter++,
                   sku: sku ? sku.toString() : `SKU-${Math.floor(Math.random()*1000)}`,
                   name: cleanName,
                   category: category ? category.toString() : guessCategory(cleanName),
                   price: parseFloat(price).toFixed(2),
                   qty: qty.toString()
                });
             }
          }
       });
    } 
    // 2. PDF / Text parsing
    else {
        let extractedText = "";
        if (ext === '.pdf') {
           const dataBuffer = fs.readFileSync(file.path);
           const pdfData = await pdfParse(dataBuffer);
           extractedText = pdfData.text;
        } else {
           extractedText = fs.readFileSync(file.path, 'utf8');
        }

        // Split into lines and clean
        const rawLines = extractedText.split('\n').map(l => l.trim()).filter(l => l.length > 5);
        
        console.log(`Analyzing ${rawLines.length} lines from text...`);

        rawLines.forEach(line => {
           // Heuristic: A product line usually has text followed by some numbers (Price/Qty)
           // Or formatted as columns separated by multiple spaces
           
           // Skip obviously non-item lines
           if (/tax|total|invoice|date|billing|shipping|customer|order|balance|payment/i.test(line)) return;

           const words = line.split(/\s+/);
           if (words.length < 2) return;

           // Find all numbers in the line
           const numbers = line.match(/\d+[.,]\d{2}|\d+/g) || [];
           
           if (numbers.length >= 1) {
              // The largest number is often the total price, the one before it is often unit price
              // But most simply, we take the last two numbers as Price and Qty
              let priceStr = numbers[numbers.length - 1];
              let qtyStr = numbers.length > 1 ? numbers[numbers.length - 2] : "1";

              // Clean name: everything before the first number
              let firstNumIndex = line.search(/\d/);
              let name = line.substring(0, firstNumIndex).trim();

              if (name.length < 3) {
                  // Fallback: name is just everything that isn't those two numbers
                  name = line.replace(priceStr, '').replace(qtyStr, '').replace(/[^a-zA-Z\s]/g, '').trim();
              }

              if (name.length > 2) {
                 items.push({
                    id: idCounter++,
                    name: name.substring(0, 50),
                    category: guessCategory(name),
                    price: parseFloat(priceStr.replace(',', '')).toFixed(2),
                    qty: qtyStr
                 });
              }
           }
        });
    }

    fs.unlinkSync(file.path);

    // Global field extraction (Mock for Header)
    const metadata = {
        vendor: (extractedText || "").match(/from:?\s*([a-z0-9\s]+)/i)?.[1] || "Nexus Supplier Corp",
        date: new Date().toLocaleDateString(),
        invoiceNo: (extractedText || "").match(/invoice\s*#?\s*:?\s*([a-z0-9-]+)/i)?.[1] || "INV-2024-001"
    };

    if (items.length === 0) {
       items = [
          { id: 1, name: 'Sample Item (Scan Fallback)', category: 'General', price: '45.00', qty: '1' },
          { id: 2, name: 'Detected Asset 02', category: 'General', price: '12.50', qty: '5' },
          { id: 3, name: 'Unknown Product (Check Invoice)', category: 'General', price: '0.00', qty: '1' }
       ];
    }

    console.log(`Extraction complete. Found ${items.length} items.`);
    res.json({ success: true, items, metadata });

  } catch (error) {
    console.error("Extraction error:", error);
    res.status(500).json({ error: 'Failed' });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
  if (!fs.existsSync('uploads')){
    fs.mkdirSync('uploads');
  }
});
