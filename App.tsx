
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Shuffle, Zap, Heart, Download, BookOpen } from 'lucide-react';
import { MAGIC_KEYWORDS, CATEGORY_LABELS, DEPTH_LABELS } from './data';
import { MagicKeyword, FilterState, Category, Depth } from './types';
import KeywordCard from './components/KeywordCard';
import InsightModal from './components/InsightModal';
import PromptGuide from './components/PromptGuide';
import { motion } from 'framer-motion';

const App: React.FC = () => {
    // State
    const [filter, setFilter] = useState<FilterState>({
        search: '',
        category: 'all',
        depth: 'all'
    });
    const [favorites, setFavorites] = useState<string[]>([]);
    const [fusionMode, setFusionMode] = useState(false);
    const [fusionSelection, setFusionSelection] = useState<string[]>([]);
    const [modalData, setModalData] = useState<{ data: MagicKeyword | MagicKeyword[], isFusion: boolean } | null>(null);
    const [guideOpen, setGuideOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Initialize logic
    useEffect(() => {
        const savedFavs = localStorage.getItem('favorites');
        if (savedFavs) setFavorites(JSON.parse(savedFavs));

        // System preference for dark mode
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    // Dark mode toggle
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    // Filter Logic
    const filteredKeywords = useMemo(() => {
        return MAGIC_KEYWORDS.filter(kw => {
            const matchesSearch = kw.term.toLowerCase().includes(filter.search.toLowerCase()) || 
                                  kw.description.toLowerCase().includes(filter.search.toLowerCase());
            const matchesCategory = filter.category === 'all' 
                ? true 
                : filter.category === 'favorites' 
                    ? favorites.includes(kw.term) 
                    : kw.category === filter.category;
            const matchesDepth = filter.depth === 'all' || kw.depth === filter.depth;
            
            return matchesSearch && matchesCategory && matchesDepth;
        });
    }, [filter, favorites]);

    // Actions
    const handleToggleFavorite = (term: string) => {
        const newFavs = favorites.includes(term) 
            ? favorites.filter(f => f !== term)
            : [...favorites, term];
        setFavorites(newFavs);
        localStorage.setItem('favorites', JSON.stringify(newFavs));
    };

    const handleCardClick = (kw: MagicKeyword) => {
        if (fusionMode) {
            if (fusionSelection.includes(kw.term)) {
                setFusionSelection(prev => prev.filter(t => t !== kw.term));
            } else {
                if (fusionSelection.length < 3) {
                    setFusionSelection(prev => [...prev, kw.term]);
                } else {
                    alert("融合模式最多选择3个概念");
                }
            }
        } else {
            setModalData({ data: kw, isFusion: false });
        }
    };

    const handleRandom = () => {
        const pool = filteredKeywords.length > 0 ? filteredKeywords : MAGIC_KEYWORDS;
        const randomKw = pool[Math.floor(Math.random() * pool.length)];
        setModalData({ data: randomKw, isFusion: false });
    };

    const handleFusionGenerate = () => {
        const selectedKeywords = MAGIC_KEYWORDS.filter(kw => fusionSelection.includes(kw.term));
        setModalData({ data: selectedKeywords, isFusion: true });
    };

    const toggleFusionMode = () => {
        setFusionMode(!fusionMode);
        setFusionSelection([]);
    };

    const handleExport = () => {
        const data = {
            favorites: MAGIC_KEYWORDS.filter(kw => favorites.includes(kw.term)),
            exportedAt: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'magic-keywords-favorites.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent cursor-pointer" onClick={toggleDarkMode}>
                                魔法关键词看板 3.0
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium tracking-wide">
                                认知催化系统 · 参数空间探索器
                            </p>
                        </div>

                        <div className="flex-1 w-full md:w-auto md:max-w-xl relative group">
                            <input 
                                type="text" 
                                placeholder="搜索认知催化器..." 
                                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                                value={filter.search}
                                onChange={(e) => setFilter({...filter, search: e.target.value})}
                            />
                            <Search className="absolute left-3.5 top-3 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        </div>

                        <div className="flex gap-2">
                             <button 
                                onClick={() => setGuideOpen(true)}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all"
                            >
                                <BookOpen size={18} />
                                <span className="hidden sm:inline">提示工程指南</span>
                            </button>

                            <button 
                                onClick={toggleFusionMode}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                                    fusionMode 
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                                    : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 hover:border-orange-500 hover:text-orange-500'
                                }`}
                            >
                                <Zap size={18} fill={fusionMode ? "currentColor" : "none"} />
                                <span className="hidden sm:inline">{fusionMode ? '退出融合' : '融合模式'}</span>
                            </button>
                            
                             <button 
                                onClick={handleRandom}
                                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-gray-600 dark:text-gray-300"
                                title="随机催化"
                            >
                                <Shuffle size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Filters Toolbar */}
                    <div className="flex flex-wrap gap-3 mt-4 items-center">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Filter size={14} />
                            <span>筛选:</span>
                        </div>
                        
                        <select 
                            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-sm focus:border-indigo-500 outline-none"
                            value={filter.category}
                            onChange={(e) => setFilter({...filter, category: e.target.value as any})}
                        >
                            <option value="all">🌟 所有维度</option>
                            <option value="favorites">❤️ 我的收藏</option>
                            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>

                        <select 
                            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-sm focus:border-indigo-500 outline-none"
                            value={filter.depth}
                            onChange={(e) => setFilter({...filter, depth: e.target.value as any})}
                        >
                            <option value="all">📊 所有深度</option>
                            {Object.entries(DEPTH_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>

                        <div className="ml-auto">
                            <button 
                                onClick={handleExport}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors"
                            >
                                <Download size={14} />
                                导出收藏
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Grid */}
            <main className="container mx-auto px-4 py-8">
                {filteredKeywords.length === 0 ? (
                    <div className="text-center py-20 opacity-60">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-xl font-medium">未找到匹配的认知催化器</p>
                        <p className="text-sm mt-2">尝试调整搜索词或过滤器</p>
                    </div>
                ) : (
                    <motion.div 
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredKeywords.map((kw) => (
                            <KeywordCard 
                                key={kw.term}
                                keyword={kw}
                                isFavorite={favorites.includes(kw.term)}
                                onToggleFavorite={(e) => {
                                    e.stopPropagation();
                                    handleToggleFavorite(kw.term);
                                }}
                                onClick={() => handleCardClick(kw)}
                                isFusionMode={fusionMode}
                                isSelectedForFusion={fusionSelection.includes(kw.term)}
                            />
                        ))}
                    </motion.div>
                )}
            </main>

            {/* Floating Fusion Action Button */}
            {fusionMode && fusionSelection.length >= 2 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
                    <motion.button
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleFusionGenerate}
                        className="px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold shadow-xl shadow-orange-500/40 flex items-center gap-2"
                    >
                        <Zap fill="white" size={20} />
                        生成 {fusionSelection.length} 个概念的融合洞察
                    </motion.button>
                </div>
            )}

            {/* Modals */}
            <InsightModal 
                isOpen={!!modalData}
                onClose={() => setModalData(null)}
                data={modalData?.data || null}
                isFusion={modalData?.isFusion || false}
            />
            
            <PromptGuide 
                isOpen={guideOpen}
                onClose={() => setGuideOpen(false)}
            />
        </div>
    );
};

export default App;
