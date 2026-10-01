import React from 'react';
import type {
  BoxLeadBlock,
  BoxDefinitionBlock,
  BoxCautionBlock,
  BoxLifeExampleBlock,
  BoxCaseStudyBlock,
  BoxExamTipBlock,
  BoxFormulaBlock,
  BoxWorkedBlock,
  BoxActivityBlock,
  BoxSummaryBlock,
  BoxInstructionsBlock,
  HallmarkClosingBlock,
} from '../../types/document';
import { Plus, Trash2, Lightbulb, AlertTriangle, Target, BookOpen, Zap, Sparkles, FileText, CheckCircle2, FlaskConical, Binary, Edit3 } from 'lucide-react';
import { MathBlock, MathInline } from '../MathRenderer';

// 1. Box Lead
export const BoxLeadView: React.FC<{ block: BoxLeadBlock; onChange: (b: BoxLeadBlock) => void }> = ({ block, onChange }) => (
  <div className="box lead border-l-[3.5px] border-[#1a5c9c] bg-[#f4f8fd] rounded-r-lg p-3.5 my-2 text-[12.5px] text-slate-800 leading-relaxed shadow-2xs">
    {block.badge && (
      <div 
        contentEditable suppressContentEditableWarning
        onBlur={(e) => onChange({ ...block, badge: e.currentTarget.textContent || '' })}
        className="font-bold text-[#0f3457] text-[11px] uppercase tracking-wide mb-1 outline-none cursor-text flex items-center gap-1.5"
      >
        <BookOpen size={13} className="text-[#1a5c9c]" />
        <span>{block.badge}</span>
      </div>
    )}
    <div 
      contentEditable suppressContentEditableWarning
      onBlur={(e) => onChange({ ...block, text: e.currentTarget.innerHTML || '' })}
      dangerouslySetInnerHTML={{ __html: block.text }}
      className="outline-none cursor-text"
    />
  </div>
);

// 2. Box Definition (.exam-def-card / .defbox)
export const BoxDefinitionView: React.FC<{ block: BoxDefinitionBlock; onChange: (b: BoxDefinitionBlock) => void }> = ({ block, onChange }) => {
  const handleAddPoint = () => {
    const newPts = [...(block.points || []), 'नया मुख्य बिंदु / Key characteristic'];
    onChange({ ...block, points: newPts });
  };

  const handleDeletePoint = (idx: number) => {
    const newPts = block.points.filter((_, i) => i !== idx);
    onChange({ ...block, points: newPts });
  };

  return (
    <div className="defbox exam-def-card border border-[#cfe0f2] bg-[#f8fbfe] rounded-lg p-4 my-3 shadow-2xs">
      <div className="flex items-center justify-between mb-1.5 border-b border-[#e2eaf4] pb-1.5">
        <span className="text-[10.5px] font-bold text-[#1a5c9c] uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen size={13} />
          🎯 बोर्ड 3-अंक मानक परिभाषा / Atomic Exam Definition
        </span>
      </div>

      <div 
        contentEditable suppressContentEditableWarning
        onBlur={(e) => onChange({ ...block, term: e.currentTarget.textContent || '' })}
        className="text-[14.5px] font-bold text-[#0f3457] font-heading mb-1.5 outline-none cursor-text"
      >
        {block.term}
      </div>

      <div 
        contentEditable suppressContentEditableWarning
        onBlur={(e) => onChange({ ...block, definition: e.currentTarget.innerHTML || '' })}
        dangerouslySetInnerHTML={{ __html: block.definition }}
        className="text-[12.5px] font-medium text-slate-800 leading-relaxed mb-3 outline-none cursor-text bg-white/70 p-2 rounded border border-[#e1eaf5]"
      />

      {block.points && block.points.length > 0 && (
        <div className="space-y-1.5 my-2">
          {block.points.map((pt, i) => (
            <div key={i} className="group/item flex items-start justify-between gap-2 text-[12px] text-slate-700 bg-white/50 px-2 py-1 rounded">
              <div 
                contentEditable suppressContentEditableWarning
                onBlur={(e) => {
                  const newPts = [...block.points];
                  newPts[i] = e.currentTarget.textContent || '';
                  onChange({ ...block, points: newPts });
                }}
                className="outline-none cursor-text flex-1"
              >
                {pt}
              </div>
              <button
                onClick={() => handleDeletePoint(i)}
                className="no-print text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity text-xs cursor-pointer"
                title="Delete point"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {block.memoryHook !== undefined && (
        <div 
          contentEditable suppressContentEditableWarning
          onBlur={(e) => onChange({ ...block, memoryHook: e.currentTarget.textContent || '' })}
          className="mt-2.5 pt-2 border-t border-[#cfe0f2]/60 text-[11.5px] font-semibold text-[#127048] bg-[#ecf8f1] px-2.5 py-1.5 rounded outline-none cursor-text flex items-center gap-1.5"
        >
          <span>🧠</span>
          <span>{block.memoryHook || 'याद रखने की ट्रिक (Memory Hook) यहाँ लिखें...'}</span>
        </div>
      )}

      <div className="no-print mt-2.5 flex items-center gap-2">
        <button
          onClick={handleAddPoint}
          className="text-[11px] text-[#1a5c9c] hover:bg-blue-50 px-2 py-0.5 rounded border border-blue-200 cursor-pointer flex items-center gap-1"
        >
          <Plus size={12} /> Add Atomic Point
        </button>
      </div>
    </div>
  );
};

// 3. Box Caution / Anti-Trap Checkpoint (.checkpoint-card / .caution)
export const BoxCautionView: React.FC<{ block: BoxCautionBlock; onChange: (b: BoxCautionBlock) => void }> = ({ block, onChange }) => {
  const handleAddBullet = () => {
    const bps = [...(block.bulletPoints || []), 'सावधानी का नया बिंदु / Additional caution point'];
    onChange({ ...block, bulletPoints: bps });
  };

  const handleDeleteBullet = (idx: number) => {
    const bps = (block.bulletPoints || []).filter((_, i) => i !== idx);
    onChange({ ...block, bulletPoints: bps });
  };

  return (
    <div className="caution checkpoint-card border-l-[4px] border-[#e0a90c] border border-amber-200/90 bg-[#fffdf4] rounded-r-lg p-4 my-3 shadow-2xs">
      <div 
        contentEditable suppressContentEditableWarning
        onBlur={(e) => onChange({ ...block, title: e.currentTarget.textContent || '' })}
        className="text-[12.5px] font-bold text-[#9a6a05] uppercase tracking-wide mb-1.5 flex items-center gap-1.5 outline-none cursor-text font-heading"
      >
        <AlertTriangle size={14} className="text-amber-600" />
        <span>{block.title}</span>
      </div>

      <div 
        contentEditable suppressContentEditableWarning
        onBlur={(e) => onChange({ ...block, content: e.currentTarget.innerHTML || '' })}
        dangerouslySetInnerHTML={{ __html: block.content }}
        className="text-[12px] text-slate-800 leading-relaxed outline-none cursor-text mb-2"
      />

      {/* Structured Misconception vs Reality */}
      {(block.misconception || block.reality) && (
        <div className="my-2 p-2.5 bg-amber-100/60 rounded border border-amber-200 text-[11.5px] space-y-1.5">
          {block.misconception && (
            <div 
              contentEditable suppressContentEditableWarning
              onBlur={(e) => onChange({ ...block, misconception: e.currentTarget.textContent || '' })}
              className="text-rose-900 font-medium outline-none cursor-text"
            >
              ❌ {block.misconception}
            </div>
          )}
          {block.reality && (
            <div 
              contentEditable suppressContentEditableWarning
              onBlur={(e) => onChange({ ...block, reality: e.currentTarget.textContent || '' })}
              className="text-emerald-900 font-semibold outline-none cursor-text"
            >
              ✅ {block.reality}
            </div>
          )}
        </div>
      )}

      {block.bulletPoints && block.bulletPoints.length > 0 && (
        <div className="space-y-1 text-[11.5px] text-slate-700 mt-2">
          {block.bulletPoints.map((bp, i) => (
            <div key={i} className="group/item flex items-start justify-between gap-2 bg-amber-50/80 px-2 py-0.5 rounded">
              <div 
                contentEditable suppressContentEditableWarning
                onBlur={(e) => {
                  const newBps = [...block.bulletPoints!];
                  newBps[i] = e.currentTarget.textContent || '';
                  onChange({ ...block, bulletPoints: newBps });
                }}
                className="outline-none cursor-text flex-1"
              >
                • {bp}
              </div>
              <button
                onClick={() => handleDeleteBullet(i)}
                className="no-print text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity text-xs cursor-pointer"
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="no-print mt-2 flex items-center gap-2">
        <button
          onClick={handleAddBullet}
          className="text-[10.5px] text-amber-800 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-300 cursor-pointer flex items-center gap-1"
        >
          <Plus size={11} /> Add Caution Rule
        </button>
      </div>
    </div>
  );
};

// 4. Box Real-Life Analogy (.analogy-card)
export const BoxLifeExampleView: React.FC<{ block: BoxLifeExampleBlock; onChange: (b: BoxLifeExampleBlock) => void }> = ({ block, onChange }) => (
  <div className="life analogy-card border-l-[4px] border-[#10b981] border border-emerald-200/90 bg-[#f0fdf4] rounded-r-lg p-4 my-3 shadow-2xs">
    <div 
      contentEditable suppressContentEditableWarning
      onBlur={(e) => onChange({ ...block, title: e.currentTarget.textContent || '' })}
      className="text-[12.5px] font-bold text-[#065f46] uppercase tracking-wide mb-1.5 flex items-center gap-1.5 outline-none cursor-text font-heading"
    >
      <Lightbulb size={14} className="text-emerald-600" />
      <span>{block.title}</span>
    </div>
    <div 
      contentEditable suppressContentEditableWarning
      onBlur={(e) => onChange({ ...block, content: e.currentTarget.innerHTML || '' })}
      dangerouslySetInnerHTML={{ __html: block.content }}
      className="text-[12.5px] text-slate-800 leading-relaxed outline-none cursor-text"
    />
    {block.takeaway && (
      <div 
        contentEditable suppressContentEditableWarning
        onBlur={(e) => onChange({ ...block, takeaway: e.currentTarget.textContent || '' })}
        className="mt-2.5 pt-2 border-t border-emerald-200 text-[11.5px] font-semibold text-[#047857] outline-none cursor-text flex items-center gap-1"
      >
        <span>🎯</span>
        <span>{block.takeaway}</span>
      </div>
    )}
  </div>
);

// 5. Box Case Study & Historical Context (.case-study-card)
export const BoxCaseStudyView: React.FC<{ block: BoxCaseStudyBlock; onChange: (b: BoxCaseStudyBlock) => void }> = ({ block, onChange }) => {
  const handleAddPoint = () => {
    const pts = [...(block.points || []), 'नया ऐतिहासिक साक्ष्य / Evidence point'];
    onChange({ ...block, points: pts });
  };

  const handleDeletePoint = (idx: number) => {
    const pts = (block.points || []).filter((_, i) => i !== idx);
    onChange({ ...block, points: pts });
  };

  return (
    <div className="casebox case-study-card border-t-[3.5px] border-[#7c3aed] border border-purple-200 bg-[#faf5ff] rounded-b-lg p-4 my-3 shadow-2xs">
      <div className="flex items-center justify-between mb-1">
        <div 
          contentEditable suppressContentEditableWarning
          onBlur={(e) => onChange({ ...block, title: e.currentTarget.textContent || '' })}
          className="text-[13px] font-bold text-[#5b21b6] font-heading outline-none cursor-text flex items-center gap-1.5"
        >
          <FileText size={14} className="text-purple-600" />
          <span>{block.title}</span>
        </div>
        {block.source && (
          <span 
            contentEditable suppressContentEditableWarning
            onBlur={(e) => onChange({ ...block, source: e.currentTarget.textContent || '' })}
            className="text-[10px] text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-mono outline-none cursor-text"
          >
            {block.source}
          </span>
        )}
      </div>

      <div 
        contentEditable suppressContentEditableWarning
        onBlur={(e) => onChange({ ...block, content: e.currentTarget.innerHTML || '' })}
        dangerouslySetInnerHTML={{ __html: block.content }}
        className="text-[12px] text-slate-800 leading-relaxed outline-none cursor-text my-1.5"
      />

      {block.points && block.points.length > 0 && (
        <div className="space-y-1 text-[11.5px] text-purple-950 mt-2 pl-2 border-l-2 border-purple-300">
          {block.points.map((pt, i) => (
            <div key={i} className="group/item flex items-start justify-between gap-2">
              <div 
                contentEditable suppressContentEditableWarning
                onBlur={(e) => {
                  const newPts = [...block.points!];
                  newPts[i] = e.currentTarget.textContent || '';
                  onChange({ ...block, points: newPts });
                }}
                className="outline-none cursor-text flex-1"
              >
                • {pt}
              </div>
              <button
                onClick={() => handleDeletePoint(i)}
                className="no-print text-purple-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity text-xs cursor-pointer"
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="no-print mt-2 flex items-center gap-2">
        <button
          onClick={handleAddPoint}
          className="text-[10.5px] text-purple-800 hover:bg-purple-100 px-2 py-0.5 rounded border border-purple-300 cursor-pointer flex items-center gap-1"
        >
          <Plus size={11} /> Add Evidence
        </button>
      </div>
    </div>
  );
};

// 6. Box Teacher's Exam Tip (.exam-tip)
export const BoxExamTipView: React.FC<{ block: BoxExamTipBlock; onChange: (b: BoxExamTipBlock) => void }> = ({ block, onChange }) => (
  <div className="exam-tip border border-indigo-200 bg-[#eef2ff] rounded-lg p-3.5 my-3 shadow-2xs">
    <div className="flex items-center justify-between mb-1.5">
      <div 
        contentEditable suppressContentEditableWarning
        onBlur={(e) => onChange({ ...block, title: e.currentTarget.textContent || '' })}
        className="text-[12px] font-extrabold text-[#3730a3] uppercase tracking-wide flex items-center gap-1.5 outline-none cursor-text font-heading"
      >
        <Target size={14} className="text-indigo-600" />
        <span>{block.title}</span>
      </div>
      {block.marksTag && (
        <span 
          contentEditable suppressContentEditableWarning
          onBlur={(e) => onChange({ ...block, marksTag: e.currentTarget.textContent || '' })}
          className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-300 font-mono outline-none cursor-text"
        >
          {block.marksTag}
        </span>
      )}
    </div>
    <div 
      contentEditable suppressContentEditableWarning
      onBlur={(e) => onChange({ ...block, tip: e.currentTarget.innerHTML || '' })}
      dangerouslySetInnerHTML={{ __html: block.tip }}
      className="text-[12px] text-slate-800 leading-relaxed outline-none cursor-text"
    />
    {block.scoringRule && (
      <div 
        contentEditable suppressContentEditableWarning
        onBlur={(e) => onChange({ ...block, scoringRule: e.currentTarget.textContent || '' })}
        className="mt-2 text-[11px] font-semibold text-indigo-900 bg-white/80 px-2.5 py-1 rounded border border-indigo-200 outline-none cursor-text"
      >
        📝 {block.scoringRule}
      </div>
    )}
  </div>
);

// 7. Box Formula & Scientific Law (.formula) with Live KaTeX Rendering
export const BoxFormulaView: React.FC<{ block: BoxFormulaBlock; onChange: (b: BoxFormulaBlock) => void }> = ({ block, onChange }) => {
  const [isRawEdit, setIsRawEdit] = React.useState(false);

  const handleAddVar = () => {
    const vars = [...block.variables, { symbol: 'X', meaning: 'नई राशि / New Variable', unit: 'Unit' }];
    onChange({ ...block, variables: vars });
  };

  const handleDeleteVar = (idx: number) => {
    const vars = block.variables.filter((_, i) => i !== idx);
    onChange({ ...block, variables: vars });
  };

  const handleInsertSymbol = (sym: string) => {
    const current = block.formulaExpr || '';
    onChange({ ...block, formulaExpr: `${current} ${sym}`.trim() });
  };

  return (
    <div className="formula-box border border-cyan-200 bg-[#ecfeff] rounded-lg p-4 my-3 shadow-2xs">
      <div className="flex items-center justify-between mb-2">
        <div 
          contentEditable suppressContentEditableWarning
          onBlur={(e) => onChange({ ...block, formulaName: e.currentTarget.textContent || '' })}
          className="text-[12px] font-bold text-[#155e75] uppercase tracking-wider flex items-center gap-1.5 outline-none cursor-text font-heading"
        >
          <Zap size={14} className="text-cyan-600" />
          <span>{block.formulaName}</span>
        </div>

        {/* LaTeX Math Mode Toggle (Screen only) */}
        <div className="no-print flex items-center gap-1">
          <button
            onClick={() => setIsRawEdit((prev) => !prev)}
            className="text-[10.5px] font-semibold text-cyan-800 bg-white hover:bg-cyan-50 px-2 py-0.5 rounded border border-cyan-300 shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
            title="Toggle between rendered KaTeX math and raw LaTeX editor"
          >
            {isRawEdit ? <Binary size={12} /> : <Edit3 size={12} />}
            <span>{isRawEdit ? 'Preview Math' : 'Edit LaTeX'}</span>
          </button>
        </div>
      </div>

      {/* Main KaTeX Rendered Formula */}
      <div className="bg-white py-2 px-4 rounded-md border border-cyan-200 shadow-2xs my-2">
        {isRawEdit ? (
          <div>
            <div className="text-[10px] text-cyan-700 font-semibold mb-1 flex items-center justify-between">
              <span>Edit LaTeX Expression:</span>
              <span className="font-mono text-[9.5px] text-slate-500">e.g. K = \frac&#123;1&#125;&#123;1 - MPC&#125;</span>
            </div>
            <input
              type="text"
              value={block.formulaExpr}
              onChange={(e) => onChange({ ...block, formulaExpr: e.target.value })}
              className="w-full font-mono text-sm font-bold text-cyan-950 bg-cyan-50/50 p-2 rounded border border-cyan-300 outline-none focus:border-cyan-500"
              placeholder="e.g. K = \frac{1}{1 - MPC} or v = u + at"
            />
            {/* Quick Math Symbols Palette */}
            <div className="no-print mt-2 pt-1.5 border-t border-cyan-100 flex flex-wrap items-center gap-1 text-[10px]">
              <span className="text-slate-500 font-semibold mr-1">Quick Symbols:</span>
              {[
                { label: 'Fraction', code: '\\frac{a}{b}' },
                { label: 'Square Root', code: '\\sqrt{x}' },
                { label: 'Power', code: 'x^{2}' },
                { label: 'Delta Δ', code: '\\Delta' },
                { label: 'Sum Σ', code: '\\sum' },
                { label: 'Multiplier (K)', code: 'K = \\frac{1}{1 - MPC}' },
                { label: 'GDP Equation', code: 'Y = C + I + G + (X - M)' },
                { label: 'Velocity', code: 'v = u + at' },
                { label: 'Energy', code: 'E = mc^{2}' },
              ].map((sym) => (
                <button
                  key={sym.label}
                  type="button"
                  onClick={() => handleInsertSymbol(sym.code)}
                  className="px-1.5 py-0.5 bg-white hover:bg-cyan-100 text-cyan-900 border border-cyan-200 rounded text-[9.5px] cursor-pointer transition-colors"
                >
                  {sym.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="cursor-pointer" onClick={() => setIsRawEdit(true)} title="Click to edit LaTeX expression">
            <MathBlock math={block.formulaExpr || 'K = \\frac{1}{1 - MPC}'} className="text-lg font-bold text-[#083344]" />
          </div>
        )}
      </div>

      <div 
        contentEditable suppressContentEditableWarning
        onBlur={(e) => onChange({ ...block, description: e.currentTarget.innerHTML || '' })}
        dangerouslySetInnerHTML={{ __html: block.description }}
        className="text-[12px] text-slate-800 leading-relaxed mb-3 outline-none cursor-text"
      />

      <div className="bg-white/80 rounded border border-cyan-200/80 p-2.5">
        <div className="text-[10.5px] font-bold text-cyan-900 uppercase tracking-wide mb-1.5">Where / जहाँ:</div>
        <div className="space-y-1">
          {block.variables.map((v, i) => (
            <div key={i} className="group/item flex items-center justify-between text-[11.5px] text-slate-700">
              <div className="flex items-center gap-2 flex-1">
                <span 
                  contentEditable suppressContentEditableWarning
                  onBlur={(e) => {
                    const newVars = [...block.variables];
                    newVars[i] = { ...newVars[i], symbol: e.currentTarget.textContent || '' };
                    onChange({ ...block, variables: newVars });
                  }}
                  className="font-mono font-bold text-cyan-800 bg-cyan-100/70 px-1.5 py-0.5 rounded outline-none cursor-text"
                >
                  <MathInline math={v.symbol} />
                </span>
                <span className="text-slate-400">=</span>
                <span 
                  contentEditable suppressContentEditableWarning
                  onBlur={(e) => {
                    const newVars = [...block.variables];
                    newVars[i] = { ...newVars[i], meaning: e.currentTarget.textContent || '' };
                    onChange({ ...block, variables: newVars });
                  }}
                  className="outline-none cursor-text flex-1"
                >
                  {v.meaning}
                </span>
                {v.unit && (
                  <span 
                    contentEditable suppressContentEditableWarning
                    onBlur={(e) => {
                      const newVars = [...block.variables];
                      newVars[i] = { ...newVars[i], unit: e.currentTarget.textContent || '' };
                      onChange({ ...block, variables: newVars });
                    }}
                    className="text-[10px] text-slate-500 font-mono italic outline-none cursor-text"
                  >
                    ({v.unit})
                  </span>
                )}
              </div>
              <button
                onClick={() => handleDeleteVar(i)}
                className="no-print text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity text-xs cursor-pointer ml-2"
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="no-print mt-2 flex items-center gap-2">
        <button
          onClick={handleAddVar}
          className="text-[10.5px] text-cyan-800 hover:bg-cyan-100 px-2 py-0.5 rounded border border-cyan-300 cursor-pointer flex items-center gap-1"
        >
          <Plus size={11} /> Add Variable
        </button>
      </div>
    </div>
  );
};

// 8. Box Worked Numerical Steps (.worked) with Student Mode Masking
export const BoxWorkedView: React.FC<{ 
  block: BoxWorkedBlock; 
  onChange: (b: BoxWorkedBlock) => void;
  teachingMode?: 'teacher' | 'student';
}> = ({ block, onChange, teachingMode = 'teacher' }) => {
  const isStudentMode = teachingMode === 'student';

  const handleAddStep = () => {
    const steps = [...block.steps, `Step ${block.steps.length + 1}: नया हल चरण / Numerical step`];
    onChange({ ...block, steps });
  };

  const handleDeleteStep = (idx: number) => {
    const steps = block.steps.filter((_, i) => i !== idx);
    onChange({ ...block, steps });
  };

  return (
    <div className="worked-box border border-sky-200 bg-[#f0f9ff] rounded-lg p-4 my-3 shadow-2xs">
      <div className="flex items-center justify-between mb-2">
        <div 
          contentEditable suppressContentEditableWarning
          onBlur={(e) => onChange({ ...block, title: e.currentTarget.textContent || '' })}
          className="text-[12px] font-bold text-[#0369a1] uppercase tracking-wide flex items-center gap-1.5 outline-none cursor-text font-heading"
        >
          <Sparkles size={14} className="text-sky-600" />
          <span>{block.title}</span>
        </div>
        {isStudentMode && (
          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
            Student Worksheet Edition
          </span>
        )}
      </div>

      <div 
        contentEditable suppressContentEditableWarning
        onBlur={(e) => onChange({ ...block, problem: e.currentTarget.innerHTML || '' })}
        dangerouslySetInnerHTML={{ __html: block.problem }}
        className="text-[12.5px] font-medium text-slate-900 bg-white p-2.5 rounded border border-sky-200 mb-3 outline-none cursor-text shadow-2xs"
      />

      {/* If Student Mode is active: mask the steps and show student practice workspace */}
      {isStudentMode ? (
        <div className="border-2 border-dashed border-sky-300 bg-sky-50/70 rounded-lg p-3 my-2 text-sky-950">
          <div className="font-bold text-[11px] text-sky-800 mb-2 flex items-center justify-between">
            <span>✏️ हल करने हेतु कार्य स्थान (Student Solution Workspace):</span>
            <span className="font-mono text-[9.5px] bg-white text-slate-600 px-2 py-0.5 rounded border border-sky-200">
              5 Marks Problem
            </span>
          </div>
          <div className="space-y-4 py-2 font-mono text-[11px]">
            <div className="border-b border-dashed border-sky-300/80 h-4"></div>
            <div className="border-b border-dashed border-sky-300/80 h-4"></div>
            <div className="border-b border-dashed border-sky-300/80 h-4"></div>
            <div className="border-b border-dashed border-sky-300/80 h-4"></div>
          </div>
          <div className="mt-2 text-right text-[10px] text-sky-700 font-mono">
            अंतिम उत्तर (Final Answer): [ ____________________ ]
          </div>
        </div>
      ) : (
        /* Teacher Mode: Full Steps and Answer */
        <>
          <div className="space-y-1.5 mb-3">
            {block.steps.map((st, i) => (
              <div key={i} className="group/item flex items-start justify-between gap-2 text-[12px] text-slate-700 bg-white/70 px-2.5 py-1.5 rounded border border-sky-100">
                <div 
                  contentEditable suppressContentEditableWarning
                  onBlur={(e) => {
                    const newSteps = [...block.steps];
                    newSteps[i] = e.currentTarget.textContent || '';
                    onChange({ ...block, steps: newSteps });
                  }}
                  className="outline-none cursor-text flex-1 font-mono text-[11.5px]"
                >
                  {st}
                </div>
                <button
                  onClick={() => handleDeleteStep(i)}
                  className="no-print text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity text-xs cursor-pointer"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div 
              contentEditable suppressContentEditableWarning
              onBlur={(e) => onChange({ ...block, finalAnswer: e.currentTarget.textContent || '' })}
              className="inline-block bg-[#0369a1] text-white text-[12px] font-bold px-3 py-1 rounded shadow-xs font-mono outline-none cursor-text"
            >
              {block.finalAnswer}
            </div>
            <button
              onClick={handleAddStep}
              className="no-print text-[10.5px] text-sky-800 hover:bg-sky-100 px-2 py-0.5 rounded border border-sky-300 cursor-pointer flex items-center gap-1"
            >
              <Plus size={11} /> Add Step
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// 9. Box NCERT Activity / Experiment (.activity)
export const BoxActivityView: React.FC<{ block: BoxActivityBlock; onChange: (b: BoxActivityBlock) => void }> = ({ block, onChange }) => {
  const handleAddProc = () => {
    const proc = [...block.procedure, `${block.procedure.length + 1}. नई प्रायोगिक विधि / Procedure step`];
    onChange({ ...block, procedure: proc });
  };

  const handleDeleteProc = (idx: number) => {
    const proc = block.procedure.filter((_, i) => i !== idx);
    onChange({ ...block, procedure: proc });
  };

  return (
    <div className="activity-box border border-teal-300 bg-[#f0fdfa] rounded-lg p-4 my-3 shadow-2xs">
      <div className="flex items-center justify-between mb-2 border-b border-teal-200 pb-1.5">
        <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#0f766e] uppercase tracking-wide font-heading">
          <FlaskConical size={14} className="text-teal-600" />
          <span 
            contentEditable suppressContentEditableWarning
            onBlur={(e) => onChange({ ...block, activityNum: e.currentTarget.textContent || '' })}
            className="outline-none cursor-text bg-teal-100 px-1.5 py-0.5 rounded"
          >
            {block.activityNum}
          </span>
          <span 
            contentEditable suppressContentEditableWarning
            onBlur={(e) => onChange({ ...block, title: e.currentTarget.textContent || '' })}
            className="outline-none cursor-text ml-1"
          >
            {block.title}
          </span>
        </div>
      </div>

      <div className="text-[12px] text-slate-800 mb-2">
        <span className="font-bold text-teal-900">उद्देश्य (Objective): </span>
        <span 
          contentEditable suppressContentEditableWarning
          onBlur={(e) => onChange({ ...block, objective: e.currentTarget.textContent || '' })}
          className="outline-none cursor-text"
        >
          {block.objective}
        </span>
      </div>

      <div className="text-[11.5px] text-slate-700 bg-white/80 p-2 rounded border border-teal-200 mb-2.5">
        <span className="font-bold text-teal-900">आवश्यक सामग्री (Materials): </span>
        <span 
          contentEditable suppressContentEditableWarning
          onBlur={(e) => onChange({ ...block, materials: e.currentTarget.textContent || '' })}
          className="outline-none cursor-text"
        >
          {block.materials}
        </span>
      </div>

      <div className="space-y-1 mb-2.5">
        <div className="text-[11px] font-bold text-teal-900 uppercase">कार्यविधि (Procedure):</div>
        {block.procedure.map((pr, i) => (
          <div key={i} className="group/item flex items-start justify-between gap-2 text-[11.5px] text-slate-800 bg-white/50 px-2 py-0.5 rounded">
            <div 
              contentEditable suppressContentEditableWarning
              onBlur={(e) => {
                const newProc = [...block.procedure];
                newProc[i] = e.currentTarget.textContent || '';
                onChange({ ...block, procedure: newProc });
              }}
              className="outline-none cursor-text flex-1"
            >
              {pr}
            </div>
            <button
              onClick={() => handleDeleteProc(i)}
              className="no-print text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity text-xs cursor-pointer"
            >
              <Trash2 size={11} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-teal-100/70 p-2.5 rounded border border-teal-300 text-[11.5px]">
        <span className="font-bold text-teal-950">अवलोकन व निष्कर्ष (Observation &amp; Conclusion): </span>
        <span 
          contentEditable suppressContentEditableWarning
          onBlur={(e) => onChange({ ...block, observation: e.currentTarget.textContent || '' })}
          className="text-slate-800 outline-none cursor-text"
        >
          {block.observation}
        </span>
      </div>

      <div className="no-print mt-2 flex items-center gap-2">
        <button
          onClick={handleAddProc}
          className="text-[10.5px] text-teal-800 hover:bg-teal-100 px-2 py-0.5 rounded border border-teal-300 cursor-pointer flex items-center gap-1"
        >
          <Plus size={11} /> Add Procedure Step
        </button>
      </div>
    </div>
  );
};

// 10. Box Summary Recap (.summary)
export const BoxSummaryView: React.FC<{ block: BoxSummaryBlock; onChange: (b: BoxSummaryBlock) => void }> = ({ block, onChange }) => {
  const handleAddPoint = () => {
    const points = [...block.points, 'नया सार संक्षेप बिंदु / Summary takeaway point'];
    onChange({ ...block, points });
  };

  const handleDeletePoint = (idx: number) => {
    const points = block.points.filter((_, i) => i !== idx);
    onChange({ ...block, points });
  };

  return (
    <div className="summary-box border border-teal-200 bg-[#f0fdfa] rounded-lg p-4 my-3 shadow-2xs">
      <div 
        contentEditable suppressContentEditableWarning
        onBlur={(e) => onChange({ ...block, title: e.currentTarget.textContent || '' })}
        className="text-[12.5px] font-bold text-[#0f766e] uppercase tracking-wide mb-2 flex items-center gap-1.5 outline-none cursor-text font-heading"
      >
        <CheckCircle2 size={14} className="text-teal-600" />
        <span>{block.title}</span>
      </div>

      <div className="space-y-1.5">
        {block.points.map((pt, i) => (
          <div key={i} className="group/item flex items-start justify-between gap-2 text-[12px] text-slate-800">
            <div className="flex items-start gap-2 flex-1">
              <span className="text-teal-600 font-bold mt-0.5">✓</span>
              <div 
                contentEditable suppressContentEditableWarning
                onBlur={(e) => {
                  const newPts = [...block.points];
                  newPts[i] = e.currentTarget.textContent || '';
                  onChange({ ...block, points: newPts });
                }}
                className="outline-none cursor-text flex-1 leading-relaxed"
              >
                {pt}
              </div>
            </div>
            <button
              onClick={() => handleDeletePoint(i)}
              className="no-print text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity text-xs cursor-pointer"
            >
              <Trash2 size={11} />
            </button>
          </div>
        ))}
      </div>

      <div className="no-print mt-2 flex items-center gap-2">
        <button
          onClick={handleAddPoint}
          className="text-[10.5px] text-teal-800 hover:bg-teal-100 px-2 py-0.5 rounded border border-teal-300 cursor-pointer flex items-center gap-1"
        >
          <Plus size={11} /> Add Recap Point
        </button>
      </div>
    </div>
  );
};

// 11. Box Instructions (.instructions)
export const BoxInstructionsView: React.FC<{ block: BoxInstructionsBlock; onChange: (b: BoxInstructionsBlock) => void }> = ({ block, onChange }) => {
  const handleAddRule = () => {
    const instructions = [...block.instructions, `${block.instructions.length + 1}. नया परीक्षा निर्देश / New examination rule`];
    onChange({ ...block, instructions });
  };

  const handleDeleteRule = (idx: number) => {
    const instructions = block.instructions.filter((_, i) => i !== idx);
    onChange({ ...block, instructions });
  };

  return (
    <div className="instructions-box border border-slate-300 bg-slate-50/90 rounded-lg p-3.5 my-3 shadow-2xs">
      <div 
        contentEditable suppressContentEditableWarning
        onBlur={(e) => onChange({ ...block, title: e.currentTarget.textContent || '' })}
        className="text-[12px] font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5 outline-none cursor-text font-heading"
      >
        <FileText size={14} className="text-slate-600" />
        <span>{block.title}</span>
      </div>

      <div className="space-y-1 text-[11.5px] text-slate-700">
        {block.instructions.map((inst, i) => (
          <div key={i} className="group/item flex items-start justify-between gap-2">
            <div 
              contentEditable suppressContentEditableWarning
              onBlur={(e) => {
                const newInsts = [...block.instructions];
                newInsts[i] = e.currentTarget.textContent || '';
                onChange({ ...block, instructions: newInsts });
              }}
              className="outline-none cursor-text flex-1"
            >
              {inst}
            </div>
            <button
              onClick={() => handleDeleteRule(i)}
              className="no-print text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity text-xs cursor-pointer"
            >
              <Trash2 size={11} />
            </button>
          </div>
        ))}
      </div>

      <div className="no-print mt-2 flex items-center gap-2">
        <button
          onClick={handleAddRule}
          className="text-[10.5px] text-slate-700 hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-300 cursor-pointer flex items-center gap-1"
        >
          <Plus size={11} /> Add Instruction Rule
        </button>
      </div>
    </div>
  );
};

// 12. Hallmark Closing Card (.print-closing-card)
export const HallmarkClosingView: React.FC<{ block: HallmarkClosingBlock; onChange: (b: HallmarkClosingBlock) => void }> = ({ block, onChange }) => (
  <div className="hallmark-closing-block my-6 p-4 rounded-xl border border-[#cfe0f2] bg-gradient-to-br from-[#f8fbfe] via-[#f1f6fd] to-[#e8f1fc] text-center shadow-xs select-none">
    <div className="flex items-center justify-center gap-2 mb-1.5">
      <img src="/rk-assets/rk-logo.png" alt="RK Logo" className="w-8 h-8 object-contain inline-block" />
      <div 
        contentEditable suppressContentEditableWarning
        onBlur={(e) => onChange({ ...block, instituteName: e.currentTarget.textContent || '' })}
        className="font-heading font-extrabold text-[#0f3457] text-base tracking-wider outline-none cursor-text"
      >
        {block.instituteName}
      </div>
    </div>
    <div 
      contentEditable suppressContentEditableWarning
      onBlur={(e) => onChange({ ...block, tagline: e.currentTarget.textContent || '' })}
      className="text-xs font-semibold text-[#1a5c9c] mb-1 outline-none cursor-text"
    >
      {block.tagline}
    </div>
    <div className="text-[11px] text-slate-600 flex items-center justify-center gap-3 font-medium">
      <span 
        contentEditable suppressContentEditableWarning
        onBlur={(e) => onChange({ ...block, address: e.currentTarget.textContent || '' })}
        className="outline-none cursor-text"
      >
        📍 {block.address}
      </span>
      <span>•</span>
      <span 
        contentEditable suppressContentEditableWarning
        onBlur={(e) => onChange({ ...block, helpline: e.currentTarget.textContent || '' })}
        className="font-mono font-bold text-slate-800 outline-none cursor-text"
      >
        {block.helpline}
      </span>
    </div>
    <div 
      contentEditable suppressContentEditableWarning
      onBlur={(e) => onChange({ ...block, session: e.currentTarget.textContent || '' })}
      className="text-[10px] text-slate-400 mt-2 pt-1.5 border-t border-[#cfe0f2]/60 uppercase tracking-widest outline-none cursor-text"
    >
      {block.session}
    </div>
  </div>
);
