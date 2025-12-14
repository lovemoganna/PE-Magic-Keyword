
import React from 'react';
import { MagicKeyword } from '../types';
import { DEPTH_LABELS, CATEGORY_LABELS } from '../data';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Network } from 'lucide-react';

interface Props {
    keyword: MagicKeyword;
    isFavorite: boolean;
    onToggleFavorite: (e: React.MouseEvent) => void;
    onClick: () => void;
    isSelectedForFusion?: boolean;
    isFusionMode?: boolean;
}

const categoryColors: Record<string, string> = {
    'core-catalysts': 'from-purple-500/20 to-cyan-500/20 text-purple-600 dark:text-purple-300',
    'technical-mastery': 'from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-300',
    'creative-fusion': 'from-pink-500/20 to-orange-500/20 text-pink-600 dark:text-pink-300',
    'system-orchestration': 'from-green-500/20 to-teal-500/20 text-green-600 dark:text-green-300',
    'cognitive-evolution': 'from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-300',
    'meta-thinking': 'from-indigo-500/20 to-purple-500/20 text-indigo-600 dark:text-indigo-300',
    'breakthrough-innovation': 'from-red-500/20 to-orange-500/20 text-red-600 dark:text-red-300',
    'philosophical-methodology': 'from-violet-500/20 to-fuchsia-500/20 text-violet-600 dark:text-violet-300',
    
    // Prompt Engineering Specific Colors
    'prompt-foundations': 'from-slate-500/20 to-gray-500/20 text-slate-600 dark:text-slate-300',
    'prompt-structuring': 'from-cyan-500/20 to-blue-500/20 text-cyan-600 dark:text-cyan-300',
    'prompt-optimization': 'from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-300',
    'prompt-operations': 'from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-300',
    'prompt-augmentation': 'from-fuchsia-500/20 to-rose-500/20 text-fuchsia-600 dark:text-fuchsia-300',
    'prompt-governance': 'from-rose-500/20 to-red-500/20 text-rose-600 dark:text-rose-300',
    
    'default': 'from-slate-500/20 to-gray-500/20 text-slate-600 dark:text-slate-300'
};

const KeywordCard: React.FC<Props> = ({ keyword, isFavorite, onToggleFavorite, onClick, isSelectedForFusion, isFusionMode }) => {
    const colorClass = categoryColors[keyword.category] || categoryColors['default'];
    
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={onClick}
            className={`
                relative p-6 rounded-2xl cursor-pointer transition-all duration-300
                border border-gray-200 dark:border-gray-700
                bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm
                shadow-sm hover:shadow-xl
                ${isSelectedForFusion ? 'ring-4 ring-orange-500 ring-opacity-50' : ''}
                ${isFusionMode && !isSelectedForFusion ? 'opacity-60 hover:opacity-90' : ''}
            `}
        >
            <div className="flex justify-between items-start mb-3">
                <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300`}>
                    {DEPTH_LABELS[keyword.depth]}
                </span>
                <div className="flex gap-2">
                    {isFusionMode && (
                        <div className={`w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center transition-colors ${isSelectedForFusion ? 'bg-orange-500' : 'bg-transparent'}`}>
                             {isSelectedForFusion && <span className="text-white text-xs">✓</span>}
                        </div>
                    )}
                    <button 
                        onClick={onToggleFavorite}
                        className={`transition-colors duration-200 ${isFavorite ? 'text-red-500 scale-110' : 'text-gray-400 hover:text-red-400'}`}
                    >
                        <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>

            <div className={`bg-gradient-to-br ${colorClass} p-3 rounded-xl mb-3`}>
                <h3 className="text-lg font-bold mb-2">{keyword.term}</h3>
                <span className="text-[10px] px-2 py-0.5 bg-white/50 dark:bg-black/20 rounded-full">
                    {CATEGORY_LABELS[keyword.category]}
                </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-xs mb-3 line-clamp-3 leading-relaxed">
                {keyword.description}
            </p>

            <div className="mb-3">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 mb-1.5">
                    <Sparkles size={10} />
                    <span>认知影响</span>
                </div>
                <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
                    {keyword.cognitiveImpact}
                </p>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-auto">
                 {keyword.crossDomains.slice(0, 3).map(domain => (
                    <span key={domain} className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full">
                        <Network size={9} />
                        {domain}
                    </span>
                 ))}
                 {keyword.crossDomains.length > 3 && <span className="text-[10px] text-gray-400 self-center">...</span>}
            </div>
        </motion.div>
    );
};

export default KeywordCard;
