import React, { useState, useEffect, useRef } from 'react';
import { useSaaS } from '../context/SaaSContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import {
  Upload, Link, FileText, Sparkles,
  CheckCircle2, Save, Edit3, RefreshCw,
  AlertCircle, ArrowRight, Trash2, Plus,
  FileSpreadsheet, FileImage, File, Camera, Image as ImageIcon
} from 'lucide-react';
import CameraCapture from './CameraCapture';

// ─── Mock data for text/URL input ──────────────────────────────────────────
const mockProductData = {
  name: 'Nike Air Max 270',
  category: 'Footwear > Sneakers',
  price: '150.00',
  description: 'The Nike Air Max 270 delivers visible air under every step. Updated for modern comfort.',
  image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
  attributes: { brand: 'Nike', size: '10 US', color: 'Red/Black', material: 'Mesh/Synthetic' },
};

const SUGGESTIONS = [
  { type: 'attribute', key: 'Gender', value: "Men's" },
  { type: 'attribute', key: 'Style', value: 'Running' },
  { type: 'price', label: 'Market Avg', value: '$145 - $160' },
  { type: 'match', name: 'Nike Air Max 270 React' },
];

// ─── Helpers matching server.cjs logic, now in-browser ─────────────────────
function guessCategory(name) {
  if (!name) return 'General Inventory';
  if (/shoe|sneaker|nike|adidas|boot|wear|heel/i.test(name)) return 'Footwear';
  if (/shirt|pant|top|dress|hoodie|jean|cloth/i.test(name)) return 'Apparel';
  if (/chair|desk|table|furniture|office/i.test(name)) return 'Furniture';
  if (/mouse|keyboard|hub|adapter|cable|monitor|tech/i.test(name)) return 'Electronics';
  if (/bag|watch|belt|hat|socks/i.test(name)) return 'Accessories';
  return 'General Inventory';
}

function getPrice(str) {
  if (!str && str !== 0) return null;
  const match = String(str).match(/[\d,]+\.?\d*/);
  if (match) return parseFloat(match[0].replace(/,/g, ''));
  return null;
}

// ─── In-browser Excel / CSV parser ─────────────────────────────────────────
function parseExcelInBrowser(arrayBuffer, fileName) {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  let idCounter = 1;
  const items = [];

  rows.forEach((row) => {
    const keys = Object.keys(row);
    const nameField = keys.find(k => /name|item|product|desc|article/i.test(k));
    const priceField = keys.find(k => /price|rate|amt|cost|unit/i.test(k));
    const qtyField = keys.find(k => /qty|quantity|count|pieces|pcs|stock/i.test(k));
    const categoryField = keys.find(k => /category|group|type|dept/i.test(k));
    const skuField = keys.find(k => /sku|code|barcode|id|part|ref/i.test(k));

    let name = nameField ? row[nameField] : null;
    let price = priceField ? row[priceField] : null;
    let qty = qtyField ? row[qtyField] : 1;
    let category = categoryField ? row[categoryField] : null;
    let sku = skuField ? row[skuField] : null;

    // Positional fallback
    if (!name || (price == null)) {
      const vals = Object.values(row).filter(v => v !== '');
      name = name || vals.find(v => typeof v === 'string' && v.length > 2);
      price = price ?? vals.find(v => (typeof v === 'number' || !isNaN(parseFloat(v))) && Number(v) > 0);
      qty = qty || 1;
    }

    const cleanName = name ? name.toString().trim() : '';
    const priceNum = getPrice(price);

    if (cleanName.length > 1 && priceNum != null &&
      !/total|invoice|page|tax|sub|date/i.test(cleanName)) {
      items.push({
        id: idCounter++,
        sku: sku ? sku.toString() : `SKU-${Math.floor(Math.random() * 9000) + 1000}`,
        name: cleanName,
        category: category ? category.toString() : guessCategory(cleanName),
        price: priceNum.toFixed(2),
        qty: qty ? qty.toString() : '1',
      });
    }
  });

  const metadata = {
    vendor: `Extracted from ${fileName}`,
    date: new Date().toLocaleDateString(),
    invoiceNo: `INV-${Date.now() % 100000}`,
  };

  return { items, metadata };
}

// ─── In-browser plain text / PDF-text parser ────────────────────────────────
function parseTextInBrowser(text, fileName) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 5);
  let idCounter = 1;
  const items = [];

  lines.forEach(line => {
    if (/tax|total|invoice|date|billing|shipping|customer|order|balance|payment/i.test(line)) return;
    const words = line.split(/\s+/);
    if (words.length < 2) return;

    const numbers = line.match(/\d+[.,]\d{2}|\d+/g) || [];
    if (numbers.length >= 1) {
      const priceStr = numbers[numbers.length - 1];
      const qtyStr = numbers.length > 1 ? numbers[numbers.length - 2] : '1';
      let firstNumIdx = line.search(/\d/);
      let name = line.substring(0, firstNumIdx).trim();
      if (name.length < 3) {
        name = line.replace(priceStr, '').replace(qtyStr, '').replace(/[^a-zA-Z\s]/g, '').trim();
      }
      if (name.length > 2) {
        items.push({
          id: idCounter++,
          sku: `SKU-${Math.floor(Math.random() * 9000) + 1000}`,
          name: name.substring(0, 50),
          category: guessCategory(name),
          price: parseFloat(priceStr.replace(',', '')).toFixed(2),
          qty: qtyStr,
        });
      }
    }
  });

  return {
    items,
    metadata: {
      vendor: `Extracted from ${fileName}`,
      date: new Date().toLocaleDateString(),
      invoiceNo: `INV-${Date.now() % 100000}`,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
export default function AIOnboarding({ onComplete }) {
  const { user } = useAuth();
  const { addProduct } = useSaaS();

  const [appState, setAppState] = useState('input');
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [activeAnalysisStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(mockProductData);
  const [editedFields, setEditedFields] = useState(new Set());
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [invoiceMetadata, setInvoiceMetadata] = useState({});
  const [uploadError, setUploadError] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [showCamera, setShowCamera] = useState(false);

  const analysisSteps = [
    'Reading file structure...',
    'Identifying product columns...',
    'Extracting names, prices & quantities...',
    'Building catalog entries...',
  ];

  // ── File upload → fully in-browser parsing ────────────────────────────
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setUploadedFileName(file.name);
    const ext = file.name.split('.').pop().toLowerCase();

    // ─── If image, handle single product logic ───
    if (['png', 'jpg', 'jpeg', 'webp'].includes(ext) || file.type.startsWith('image/')) {
      setIsBulkMode(false);
      setIsManualMode(false);
      setAppState('analyzing');
      setActiveStep(0);

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...mockProductData,
          name: file.name.replace(`.${ext}`, '').replace(/[-_]/g, ' ') || 'AI Vision Extracted',
          image: event.target.result
        });
        setEditedFields(new Set());

        let step = 0;
        const stepTimer = setInterval(() => {
          step++;
          if (step < analysisSteps.length) {
            setActiveStep(step);
          } else {
            clearInterval(stepTimer);
            setAppState('result');
          }
        }, 800);
      };
      reader.readAsDataURL(file);
      if (e.target) e.target.value = '';
      return;
    }

    setIsBulkMode(true);
    setIsManualMode(false);
    setAppState('analyzing');
    setActiveStep(0);

    // Animate steps while reading
    let step = 0;
    const stepTimer = setInterval(() => {
      step++;
      if (step < analysisSteps.length) setActiveStep(step);
    }, 600);

    try {
      let result;

      if (['xlsx', 'xls', 'csv'].includes(ext)) {
        // Read as ArrayBuffer for xlsx
        const buf = await file.arrayBuffer();
        result = parseExcelInBrowser(buf, file.name);
      } else if (ext === 'txt') {
        // Plain text
        const text = await file.text();
        result = parseTextInBrowser(text, file.name);
      } else if (ext === 'pdf') {
        // Try backend; if unavailable, show friendly error
        clearInterval(stepTimer);

        const formPayload = new FormData();
        formPayload.append('invoice', file);

        try {
          const resp = await fetch('http://localhost:3000/api/extract-invoice', {
            method: 'POST',
            body: formPayload,
          });
          if (!resp.ok) throw new Error(`Server ${resp.status}`);
          const data = await resp.json();
          if (data.success && data.items?.length > 0) {
            result = { items: data.items, metadata: data.metadata };
          } else {
            throw new Error('No items extracted');
          }
        } catch {
          setUploadError('PDF extraction requires the backend server. Run: npm run server  — then try again. Or upload an Excel/CSV instead.');
          setAppState('input');
          setIsBulkMode(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }
      } else {
        throw new Error(`Unsupported file type: .${ext}. Use Excel, CSV, or TXT.`);
      }

      clearInterval(stepTimer);
      setActiveStep(analysisSteps.length - 1);

      if (!result.items || result.items.length === 0) {
        setUploadError('No products found in this file. Check that it has name and price columns.');
        setInvoiceItems([]);
      } else {
        setInvoiceItems(result.items);
        setInvoiceMetadata(result.metadata);
      }

      await new Promise(r => setTimeout(r, 500));
      setAppState('result');

    } catch (err) {
      clearInterval(stepTimer);
      console.error('Extraction error:', err);
      setUploadError(err.message || 'Failed to read file.');
      setAppState('input');
      setIsBulkMode(false);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCameraCapture = (imageSrc) => {
    setShowCamera(false);
    setIsBulkMode(false);
    setIsManualMode(false);
    setAppState('analyzing');
    setActiveStep(0);
    setUploadedFileName('camera_capture.jpg');

    setFormData({
      ...mockProductData,
      name: 'AI Vision Extracted',
      image: imageSrc
    });
    setEditedFields(new Set());

    let step = 0;
    const stepTimer = setInterval(() => {
      step++;
      if (step < analysisSteps.length) {
        setActiveStep(step);
      } else {
        clearInterval(stepTimer);
        setAppState('result');
      }
    }, 800);
  };

  // ── Text/URL input (single product, uses mock) ────────────────────────
  const handleTextGenerate = (overrideText) => {
    const textToUse = typeof overrideText === 'string' ? overrideText : inputText;
    if (!textToUse.trim()) return;
    const priceMatch = textToUse.match(/(\d+)/);
    setFormData({
      ...mockProductData,
      name: textToUse.split(' ').slice(0, 5).join(' ') || mockProductData.name,
      price: priceMatch ? priceMatch[0] + '.00' : '49.00',
    });
    setEditedFields(new Set());
    setIsBulkMode(false);
    setIsManualMode(false);
    setActiveStep(0);
    setAppState('analyzing');
  };

  const handleManualEntry = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      description: '',
      image: '',
    });
    setUploadedFileName('');
    setEditedFields(new Set());
    setIsBulkMode(false);
    setIsManualMode(true);
    setAppState('result');
  };

  // ── Animation for text/URL mode ───────────────────────────────────────
  useEffect(() => {
    if (appState === 'analyzing' && !isBulkMode) {
      let cur = 0;
      const iv = setInterval(() => {
        cur++;
        if (cur < analysisSteps.length) {
          setActiveStep(cur);
        } else {
          clearInterval(iv);
          setTimeout(() => setAppState('result'), 800);
        }
      }, 1200);
      return () => clearInterval(iv);
    }
  }, [appState, isBulkMode]);

  // ── Save ──────────────────────────────────────────────────────────────
  const handleSaveAll = () => {
    if (isBulkMode) {
      invoiceItems.forEach(item => {
        addProduct({
          tenantId: user?.tenantId || 't1',
          name: item.name,
          sku: item.sku,
          category: item.category,
          price: parseFloat(item.price) || 0,
          stock: { [user?.outletId || 'o1']: parseInt(item.qty) || 1 },
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        });
      });
    } else {
      addProduct({
        tenantId: user?.tenantId || 't1',
        name: formData.name,
        sku: formData.sku || `SKU-${Math.floor(Math.random() * 9000) + 1000}`,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: { [user?.outletId || 'o1']: 10 },
        image: formData.image,
      });
    }
    if (onComplete) onComplete();
  };

  const handleFieldEdit = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setEditedFields(prev => new Set(prev).add(field));
  };

  const handleBulkEdit = (id, field, value) =>
    setInvoiceItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  const handleBulkDelete = (id) =>
    setInvoiceItems(prev => prev.filter(i => i.id !== id));
  const handleBulkAdd = () =>
    setInvoiceItems(prev => [...prev, {
      id: Date.now(), sku: `SKU-${Date.now() % 10000}`,
      name: '', category: 'General', price: '0.00', qty: '1',
    }]);

  const totalValue = invoiceItems.reduce((a, i) => a + (parseFloat(i.price) || 0) * (parseInt(i.qty) || 0), 0);
  const totalQty = invoiceItems.reduce((a, i) => a + (parseInt(i.qty) || 0), 0);

  const getFileIcon = (name = '') => {
    const ext = name.split('.').pop().toLowerCase();
    if (['xlsx', 'xls', 'csv'].includes(ext)) return FileSpreadsheet;
    if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) return FileImage;
    return FileText;
  };
  const FileIcon = getFileIcon(uploadedFileName);

  // ── Input card ────────────────────────────────────────────────────────
  const InputCard = ({ icon: Icon, title, description, badge, onClick }) => (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={onClick}
      className="relative p-5 md:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer group overflow-hidden flex flex-col justify-between"
    >
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
        <ArrowRight className="w-5 h-5 text-indigo-500" />
      </div>
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-indigo-500 transition-colors">
        <Icon className="w-5 h-5 md:w-6 md:h-6 text-indigo-500 group-hover:text-white transition-colors" />
      </div>
      <div>
        <h3 className="text-base md:text-lg font-bold text-slate-800 mb-1 leading-tight">{title}</h3>
        <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-[90%]">{description}</p>
      </div>
      {badge && (
        <span className="absolute bottom-4 right-4 md:bottom-6 md:right-6 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-black uppercase bg-purple-100 text-purple-800 tracking-wider shadow-sm">
          {badge}
        </span>
      )}
    </motion.div>
  );

  // ══════════════════════════════════════════════════════════════════════
  return (
    <div className="max-w-7xl mx-auto">
      <AnimatePresence mode="wait">

        {/* ───────── INPUT ───────── */}
        {appState === 'input' && (
          <motion.div key="input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-indigo-100">
                <Sparkles className="w-4 h-4" /> Nexus AI Agent
              </div>
              <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
                Add <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Anything</span>.<br />We'll Build the Product.
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                Upload an Excel, CSV, or text invoice — products are extracted instantly, right in your browser. No server needed.
              </p>
            </div>

            {uploadError && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-2xl text-sm font-medium">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {/* Hidden inputs */}
              <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx,.xls,.csv,.txt,.pdf,image/*" onChange={handleFileUpload} />

              <InputCard
                icon={FileSpreadsheet}
                title="Upload File"
                description="Excel, CSV, PDF, or Image"
                badge="Smart Extract"
                onClick={() => fileInputRef.current?.click()}
              />
              <InputCard
                icon={Camera}
                title="Take Photo"
                description="Use your camera"
                onClick={() => setShowCamera(true)}
              />
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="relative p-5 md:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                  <ArrowRight className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-indigo-500 transition-colors">
                  <Link className="w-5 h-5 md:w-6 md:h-6 text-indigo-500 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-slate-800 mb-2 leading-tight">Web Link</h3>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Paste URL & Enter..."
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleTextGenerate()}
                      className="w-full bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs md:text-sm rounded-xl px-3 py-2 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700"
                    />
                  </div>
                </div>
              </motion.div>
              <InputCard
                icon={Edit3}
                title="Manual Entry"
                description="Type product details"
                onClick={handleManualEntry}
              />
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-white rounded-[2rem] shadow-2xl flex flex-col md:flex-row p-3 items-center border border-slate-100">
                <input
                  id="ai-input-text"
                  type="text"
                  placeholder="e.g. Paste a product URL, or describe 'Nike shoes'"
                  className="flex-1 bg-transparent border-0 px-6 py-4 text-slate-800 placeholder-slate-400 focus:ring-0 text-lg outline-none font-medium"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleTextGenerate()}
                />
                <button
                  onClick={handleTextGenerate}
                  className="w-full md:w-auto bg-slate-900 hover:bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl"
                >
                  <Sparkles className="w-6 h-6" /> AI Build
                </button>
              </div>
            </div>

            {/* Supported formats hint */}
            <p className="text-center text-xs text-slate-400 font-medium mt-6">
              Supported: <span className="font-bold">.xlsx  ·  .xls  ·  .csv  ·  .txt</span> &nbsp;|&nbsp; PDF requires backend server
            </p>
          </motion.div>
        )}

        {/* ───────── ANALYZING ───────── */}
        {appState === 'analyzing' && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20">
            <div className="relative w-24 h-24 mb-10">
              <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>
            {uploadedFileName && isBulkMode && (
              <div className="flex items-center gap-3 mb-6 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-200">
                <FileIcon className="w-5 h-5 text-indigo-500" />
                <span className="font-bold text-slate-700 text-sm">{uploadedFileName}</span>
              </div>
            )}
            <h2 className="text-3xl font-black text-slate-900 mb-12">
              {isBulkMode ? 'Extracting Invoice Data...' : 'Building Product Profile...'}
            </h2>
            <div className="w-full max-w-md space-y-4">
              {analysisSteps.map((step, i) => (
                <div key={i} className={`p-5 rounded-2xl border transition-all flex items-center gap-4 ${i <= activeAnalysisStep ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'bg-slate-50 border-transparent text-slate-400'}`}>
                  {i < activeAnalysisStep
                    ? <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    : i === activeAnalysisStep
                      ? <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin" />
                      : <div className="w-6 h-6 rounded-full border-2 border-slate-200" />}
                  <span className="font-bold">{step}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ───────── RESULT ───────── */}
        {appState === 'result' && (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {isBulkMode ? (
              /* ── BULK INVOICE RESULT ── */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                      <Sparkles className="w-7 h-7 text-indigo-500" /> Extracted Products
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">
                      <span className="font-bold text-indigo-600">{invoiceItems.length} items</span> found from {uploadedFileName}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { setAppState('input'); setUploadError(''); }} className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all">
                      <RefreshCw className="w-5 h-5" />
                    </button>
                    <button onClick={handleSaveAll} disabled={invoiceItems.length === 0} className="bg-indigo-600 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
                      <Save className="w-5 h-5" /> Save All to Catalog
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Source', value: invoiceMetadata.vendor },
                    { label: 'Invoice No', value: invoiceMetadata.invoiceNo },
                    { label: 'Date', value: invoiceMetadata.date },
                  ].map(m => (
                    <div key={m.label} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">{m.label}</p>
                      <p className="font-bold text-slate-800 truncate">{m.value || '—'}</p>
                    </div>
                  ))}
                </div>

                {uploadError && (
                  <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 text-amber-700 px-6 py-4 rounded-2xl font-medium text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {uploadError}
                  </div>
                )}

                {/* Editable Table */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/80">
                          {['#', 'SKU', 'Product Name', 'Category', 'Price', 'Qty', 'Line Total', ''].map(h => (
                            <th key={h} className="py-4 px-5 text-[10px] font-black uppercase text-slate-400 tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {invoiceItems.map((item, idx) => {
                          const lineTotal = (parseFloat(item.price) || 0) * (parseInt(item.qty) || 0);
                          return (
                            <motion.tr key={item.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }} className="group hover:bg-indigo-50/30 transition-colors">
                              <td className="py-3 px-5 text-xs font-bold text-slate-400">{idx + 1}</td>
                              <td className="py-2 px-5">
                                <input value={item.sku || ''} onChange={e => handleBulkEdit(item.id, 'sku', e.target.value)} className="w-24 bg-transparent border border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-lg px-2 py-1 font-mono text-xs text-slate-600 outline-none transition-all" />
                              </td>
                              <td className="py-2 px-5">
                                <input value={item.name} onChange={e => handleBulkEdit(item.id, 'name', e.target.value)} className="w-full min-w-[160px] bg-transparent border border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-lg px-2 py-1 font-bold text-sm text-slate-800 outline-none transition-all" />
                              </td>
                              <td className="py-2 px-5">
                                <input value={item.category} onChange={e => handleBulkEdit(item.id, 'category', e.target.value)} className="w-32 bg-transparent border border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-lg px-2 py-1 text-xs font-medium text-indigo-600 outline-none transition-all" />
                              </td>
                              <td className="py-2 px-5">
                                <div className="flex items-center gap-1 bg-transparent border border-transparent focus-within:border-indigo-500 hover:border-slate-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 rounded-lg px-2 py-1 transition-all">
                                  <span className="text-slate-400 text-xs">$</span>
                                  <input value={item.price} onChange={e => handleBulkEdit(item.id, 'price', e.target.value)} className="w-16 bg-transparent border-none p-0 font-bold text-sm text-slate-800 outline-none" />
                                </div>
                              </td>
                              <td className="py-2 px-5">
                                <input value={item.qty} onChange={e => handleBulkEdit(item.id, 'qty', e.target.value)} className="w-14 bg-transparent border border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-lg px-2 py-1 font-bold text-sm text-slate-800 outline-none text-center transition-all" />
                              </td>
                              <td className="py-3 px-5 font-black text-sm text-slate-900">${lineTotal.toFixed(2)}</td>
                              <td className="py-3 px-3">
                                <button onClick={() => handleBulkDelete(item.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-50/80 border-t border-slate-200">
                          <td colSpan={4} className="py-4 px-5">
                            <button onClick={handleBulkAdd} className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 px-3 py-2 rounded-xl hover:bg-indigo-50 transition-colors">
                              <Plus className="w-4 h-4" /> Add Row
                            </button>
                          </td>
                          <td className="py-4 px-5 text-[10px] font-black uppercase text-slate-400">Totals</td>
                          <td className="py-4 px-5 font-black text-sm text-slate-800 text-center">{totalQty}</td>
                          <td className="py-4 px-5 font-black text-slate-900">${totalValue.toFixed(2)}</td>
                          <td />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
                  <Edit3 className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-indigo-800">All fields are editable</p>
                    <p className="text-xs text-indigo-600 mt-0.5">Click any cell to correct the AI's extraction before saving.</p>
                  </div>
                </div>
              </div>
            ) : (
              /* ── SINGLE PRODUCT RESULT ── */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">{isManualMode ? 'Add Product' : 'AI Audit'}</h2>
                    <div className="flex gap-3">
                      <button onClick={() => setAppState('input')} className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all"><RefreshCw className="w-5 h-5" /></button>
                      <button onClick={handleSaveAll} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all">{isManualMode ? 'Save Product' : 'Save & Onboard'}</button>
                    </div>
                  </div>
                  <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                    <div className="flex gap-8 mb-8">
                      <div
                        className="w-32 h-32 rounded-3xl overflow-hidden border border-slate-100 flex-shrink-0 relative group cursor-pointer bg-slate-50 flex flex-col items-center justify-center"
                        onClick={() => document.getElementById('manual-image-upload')?.click()}
                      >
                        {formData.image ? (
                          <>
                            <img src={formData.image} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" alt={formData.name || 'Product'} />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                              <ImageIcon className="w-8 h-8 text-white drop-shadow-md" />
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-slate-300 group-hover:text-indigo-500 transition-colors">
                            <ImageIcon className="w-8 h-8" />
                            <span className="text-[9px] font-black uppercase tracking-wider">Add Image</span>
                          </div>
                        )}
                        <input
                          id="manual-image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => handleFieldEdit('image', ev.target.result);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1 space-y-4">
                        <input value={formData.name} placeholder="Product Name" onChange={e => handleFieldEdit('name', e.target.value)} className="w-full text-3xl font-black text-slate-900 bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-4 py-2 -ml-4 outline-none transition-all placeholder:text-slate-300" />
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 hover:bg-slate-100 p-4 rounded-2xl border border-transparent hover:border-slate-200 transition-all focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 cursor-text" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                            <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Category</p>
                            <input value={formData.category} placeholder="e.g. Footwear" onChange={e => handleFieldEdit('category', e.target.value)} className="w-full bg-transparent border-none p-0 font-bold text-slate-800 outline-none placeholder:text-slate-300" />
                          </div>
                          <div className="bg-slate-50 hover:bg-slate-100 p-4 rounded-2xl border border-transparent hover:border-slate-200 transition-all focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 cursor-text" onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
                            <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Price ($)</p>
                            <input value={formData.price} placeholder="0.00" onChange={e => handleFieldEdit('price', e.target.value)} className="w-full bg-transparent border-none p-0 font-bold text-slate-800 outline-none placeholder:text-slate-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase text-slate-400">Description</p>
                      <textarea value={formData.description} placeholder="Write a short product description..." onChange={e => handleFieldEdit('description', e.target.value)} rows={4} className="w-full bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl p-6 text-sm font-medium text-slate-600 outline-none transition-all resize-y placeholder:text-slate-300" />
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    <h3 className="text-xl font-black mb-6 flex items-center gap-3"><Sparkles className="w-6 h-6 text-indigo-400" /> AI Insights</h3>
                    <div className="space-y-4">
                      {SUGGESTIONS.map((s, i) => (
                        <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                          <p className="text-[10px] font-black uppercase text-indigo-300 mb-1">{s.label || s.type}</p>
                          <p className="font-bold text-sm">{s.value || s.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
        {/* ───────── CAMERA CAPTURE ───────── */}
        {showCamera && (
          <CameraCapture
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
