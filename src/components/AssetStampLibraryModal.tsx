import React, { useState } from 'react';
import { X, Award, Flame, Star, AlertTriangle, CheckCircle2, Target, Image as ImageIcon, Plus, Check } from 'lucide-react';
import { RK_STAMPS_AND_ASSETS, type StampItem } from '../data/stampsAndAssets';
import type { ContentBlock } from '../types/document';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onInsertStamp: (block: ContentBlock) => void;
}

function generateStampId(): string {
  return `stamp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export const AssetStampLibraryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onInsertStamp,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'exam-badge' | 'official-seal' | 'evaluation' | 'image-asset'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredItems = RK_STAMPS_AND_ASSETS.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const getIcon = (name: string, size = 18) => {
    switch (name) {
      case 'Flame': return <Flame size={size} className="text-red-600" />;
      case 'Star': return <Star size={size} className="text-amber-500 fill-amber-400" />;
      case 'AlertTriangle': return <AlertTriangle size={size} className="text-orange-500" />;
      case 'Award': return <Award size={size} className="text-blue-600" />;
      case 'CheckCircle2': return <CheckCircle2 size={size} className="text-slate-600" />;
      case 'Target': return <Target size={size} className="text-emerald-600" />;
      default: return <ImageIcon size={size} className="text-blue-500" />;
    }
  };

  const handleInsert = (item: StampItem) => {
    const id = generateStampId();

    if (item.imageUrl) {
      // Insert as ImageBlock
      const block: ContentBlock = {
        id,
        type: 'image-block',
        url: item.imageUrl,
        caption: item.badgeText,
        alt: item.name,
        widthPercent: 95,
      };
      onInsertStamp(block);
    } else {
      // Insert as styled Lead Box or Callout Box with the official badge
      const block: ContentBlock = {
        id,
        type: 'box-lead',
        badge: item.badgeText,
        text: `<b>${item.subtitle}</b><br/>${item.hindiText || ''}`,
      };
      onInsertStamp(block);
    }

    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-3xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-xs">
              <Award size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-heading">
                RK Institute Official Asset &amp; Stamp Vault (संस्थान मोहर व ग्राफिक्स)
              </h2>
              <p className="text-[11px] text-slate-500">
                1-click insert official CBSE PYQ stamps, evaluation boxes, teacher seals &amp; pre-cropped header banners.
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

        {/* Filter Pills */}
        <div className="px-4 py-2 border-b border-stone-200 bg-stone-50/50 flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: 'All Assets (10)' },
            { id: 'exam-badge', label: 'Exam PYQ & Topper Stamps' },
            { id: 'official-seal', label: 'RK Sir Official Seals' },
            { id: 'evaluation', label: 'Teacher Signature & Marks' },
            { id: 'image-asset', label: 'Pre-Cropped Headers & Banners' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white hover:bg-stone-100 text-slate-600 border border-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Assets Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border border-stone-200 bg-gradient-to-br ${item.bgGradient} flex flex-col justify-between hover:shadow-md transition-all duration-200 relative group`}
            >
              <div>
                {/* Visual Preview */}
                {item.imageUrl ? (
                  <div className="mb-2.5 bg-white p-1 rounded-lg border border-stone-200 overflow-hidden shadow-2xs">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="max-h-20 w-full object-contain rounded"
                    />
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5 mb-2">
                    <div className="p-2 rounded-lg bg-white shadow-xs border border-stone-200 shrink-0">
                      {getIcon(item.iconName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11.5px] font-bold text-slate-900 leading-snug">
                        {item.badgeText}
                      </div>
                      <div className="text-[10.5px] text-slate-600 mt-0.5">
                        {item.subtitle}
                      </div>
                      {item.hindiText && (
                        <div className="text-[10px] text-slate-500 italic mt-0.5">
                          {item.hindiText}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="mt-2 pt-2 border-t border-stone-200/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide font-semibold">
                  {item.category.replace('-', ' ')}
                </span>
                <button
                  onClick={() => handleInsert(item)}
                  className="px-3 py-1 bg-white hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-300 hover:border-blue-600 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer group-hover:scale-102"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check size={12} className="text-emerald-500" />
                      <span>Inserted!</span>
                    </>
                  ) : (
                    <>
                      <Plus size={12} />
                      <span>Insert on Page</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-slate-500">
          <span>Stamps automatically format with official RK Institute branding &amp; Devanagari headings.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
