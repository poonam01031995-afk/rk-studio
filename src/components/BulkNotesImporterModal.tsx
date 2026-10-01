import React, { useState, useMemo } from 'react';
import { X, Sparkles, FileText, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { parseRawNotesToBlocks } from '../utils/rawNotesParser';
import type { ContentBlock } from '../types/document';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImportBlocks: (blocks: ContentBlock[], replaceAll: boolean) => void;
}

const SAMPLE_MACRO_NOTES = `# Chapter 2: Indian Economy 1950–1990
आजादी के बाद भारत के नेताओं के सामने सबसे प्रमुख चुनौती थी कि देश की आर्थिक व्यवस्था किस मॉडल पर चलाई जाए।

## 1. Central Problems of an Economy
- What to produce and in what quantities?
- How to produce (Labour intensive or Capital intensive)?
- For whom to produce (Distribution according to purchasing power or need)?

> Note: India adopted a Mixed Economic framework where public and private sectors coexist, driven by Five Year Plans.

> Definition: Mixed Economy — An economic system where the market provides consumer goods and services while the government provides essential infrastructure, public health, and social welfare.

Formula: K = \\frac{1}{1 - MPC} = \\frac{\\Delta Y}{\\Delta I}

> Caution: Do not confuse Gross Domestic Product (GDP) with Net National Product (NNP). Depreciation must be deducted to arrive at Net value!

Q1. Which Five Year Plan emphasized rapid industrialization and heavy industries?
(a) First Five Year Plan
(b) Second Five Year Plan (Mahalanobis Model)
(c) Third Five Year Plan
(d) Sixth Five Year Plan
Ans: (b) Second Five Year Plan (Mahalanobis Model)
Explanation: The Second Plan drafted under P.C. Mahalanobis aimed at establishing the basic heavy goods industry.

Q2. State three major goals of India's Five Year Plans.
Ans: Growth, Modernisation, Self-reliance and Equity.`;

const SAMPLE_TEST_PAPER = `# Weekly Unit Assessment • Macroeconomics & Indian Economy
निर्देश: सभी प्रश्न अनिवार्य हैं। प्रत्येक प्रश्न के सम्मुख अंक निर्धारित हैं।

Q1. What is the value of Marginal Propensity to Consume (MPC) when the multiplier is 4?
(a) 0.50
(b) 0.75
(c) 0.80
(d) 1.00
Ans: (b) 0.75
Explanation: Multiplier K = 1 / (1 - MPC). 4 = 1 / (1 - MPC) => 1 - MPC = 0.25 => MPC = 0.75.

Q2. Deficit financing directly causes which of the following phenomena in a developing economy?
(a) Deflation
(b) Increase in money supply and demand-pull inflation
(c) Reduction in national debt
(d) Appreciating domestic currency
Ans: (b) Increase in money supply and demand-pull inflation

Q3. Distinguish between autonomous consumption and induced consumption with suitable examples.
Ans: Autonomous consumption is independent of income level, whereas induced consumption varies directly with level of national income.`;

export const BulkNotesImporterModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onImportBlocks,
}) => {
  const [rawText, setRawText] = useState('');
  const [replaceAll, setReplaceAll] = useState(false);

  const parsedBlocks = useMemo(() => {
    return parseRawNotesToBlocks(rawText);
  }, [rawText]);

  if (!isOpen) return null;

  const blockTypeCounts = parsedBlocks.reduce((acc, b) => {
    acc[b.type] = (acc[b.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleImport = () => {
    if (parsedBlocks.length === 0) return;
    onImportBlocks(parsedBlocks, replaceAll);
    onClose();
    setRawText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-3xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-heading">
                Smart Notes &amp; Markdown Importer (कच्चे नोट्स कनवर्टर)
              </h2>
              <p className="text-[11px] text-slate-500">
                Paste raw notes, D:\ drive outlines, or syllabus text. The parser converts them into NCERT blocks &amp; PYQ cards.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Quick-Fill Sample Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <FileText size={12} />
              <span>Or try an example template:</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRawText(SAMPLE_MACRO_NOTES)}
                className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
              >
                Sample Economics Notes
              </button>
              <button
                type="button"
                onClick={() => setRawText(SAMPLE_TEST_PAPER)}
                className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
              >
                Sample Test Paper (with MCQs)
              </button>
            </div>
          </div>

          {/* Text Area */}
          <div className="relative">
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={`Paste your notes here. Examples:\n# Chapter Title\n## Section 1\n- Point 1\n- Point 2\n> Note: Important definition...\nFormula: K = 1 / (1 - MPC)\nQ1. Question text here?\n(a) Option 1\n(b) Option 2\nAns: (a)`}
              rows={12}
              className="w-full font-mono text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400 leading-relaxed resize-none"
            />
            {rawText && (
              <button
                onClick={() => setRawText('')}
                className="absolute right-3 top-3 text-[10px] text-slate-400 hover:text-slate-700 bg-white/90 border border-stone-200 px-2 py-0.5 rounded cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Real-Time Parser Stats */}
          {parsedBlocks.length > 0 && (
            <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-blue-600" />
                  <span>Detected {parsedBlocks.length} Pedagogical Blocks Ready to Insert:</span>
                </span>
                <span className="text-[10px] font-mono text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full font-bold">
                  {parsedBlocks.length} Blocks
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {Object.entries(blockTypeCounts).map(([type, count]) => (
                  <span
                    key={type}
                    className="text-[10px] font-semibold text-slate-700 bg-white border border-stone-200 px-2 py-0.5 rounded-md shadow-2xs"
                  >
                    {type}: <strong className="text-blue-700">{count}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}

          {rawText.trim() && parsedBlocks.length === 0 && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0 text-amber-600" />
              <span>Could not detect distinct blocks yet. Type `# Heading` or `- Bullet` or paste more text.</span>
            </div>
          )}

          {/* Import Destination Options */}
          <div className="pt-2 flex items-center justify-between border-t border-stone-200 text-xs">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                <input
                  type="radio"
                  name="importMode"
                  checked={!replaceAll}
                  onChange={() => setReplaceAll(false)}
                  className="accent-blue-600 cursor-pointer"
                />
                <span>Append to Bottom of Current Note</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                <input
                  type="radio"
                  name="importMode"
                  checked={replaceAll}
                  onChange={() => setReplaceAll(true)}
                  className="accent-blue-600 cursor-pointer"
                />
                <span className="text-amber-800 font-semibold">Start Fresh (Replace Canvas)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-stone-200 bg-stone-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={parsedBlocks.length === 0}
            className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 disabled:pointer-events-none rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Generate &amp; Insert {parsedBlocks.length} Blocks</span>
          </button>
        </div>
      </div>
    </div>
  );
};
