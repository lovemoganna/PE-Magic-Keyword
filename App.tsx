import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Sparkles, BookOpen, Zap, Moon, Sun, X } from 'lucide-react';
import { MagicKeyword, FilterState, Category, Depth } from './types';
import { CATEGORY_LABELS, DEPTH_LABELS } from './data';
import { KeywordService } from './services/keywordService';
import { Link } from 'react-router-dom';
import KeywordCard from './components/KeywordCard';
import InsightModal from './components/InsightModal';
import PromptGuide from './components/PromptGuide';

const App: React.FC = () => {
    // 状态管理
    const [keywords, setKeywords] = useState<MagicKeyword[]>([]);
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        category: 'all',
        depth: 'all'
    });
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [selectedKeyword, setSelectedKeyword] = useState<MagicKeyword | null>(null);
    const [selectedKeywords, setSelectedKeywords] = useState<MagicKeyword[]>([]);
    const [isFusionMode, setIsFusionMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        // 检查系统偏好或localStorage
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('darkMode');
            if (saved !== null) return saved === 'true';
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    // 加载关键词数据
    React.useEffect(() => {
        setKeywords(KeywordService.getAll());
    }, []);

    // 切换深色模式
    React.useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);

    // 加载收藏状态（优化：启用持久化）
    React.useEffect(() => {
        const saved = localStorage.getItem('favorites');
        if (saved) {
            try {
                setFavorites(new Set(JSON.parse(saved)));
            } catch (e) {
                console.error('Failed to load favorites:', e);
            }
        }
    }, []);

    // 保存收藏状态（优化：启用持久化）
    React.useEffect(() => {
        if (favorites.size > 0 || localStorage.getItem('favorites')) {
            localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
        }
    }, [favorites]);

    // 过滤关键词（修复：添加keywords依赖）
    const filteredKeywords = useMemo(() => {
        if (keywords.length === 0) return []; // 防止初始加载时显示空状态
        return keywords.filter(keyword => {
            // 搜索过滤
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matchesSearch = 
                    keyword.term.toLowerCase().includes(searchLower) ||
                    keyword.description.toLowerCase().includes(searchLower) ||
                    keyword.examples.some(ex => ex.toLowerCase().includes(searchLower)) ||
                    keyword.related.some(rel => rel.toLowerCase().includes(searchLower));
                if (!matchesSearch) return false;
            }

            // 分类过滤
            if (filters.category !== 'all') {
                if (filters.category === 'favorites') {
                    if (!favorites.has(keyword.term)) return false;
                } else {
                    if (keyword.category !== filters.category) return false;
                }
            }

            // 深度过滤
            if (filters.depth !== 'all') {
                if (keyword.depth !== filters.depth) return false;
            }

            return true;
        });
    }, [keywords, filters, favorites]);

    // 切换收藏
    const handleToggleFavorite = (keyword: MagicKeyword, e: React.MouseEvent) => {
        e.stopPropagation();
        setFavorites(prev => {
            const newSet = new Set(prev);
            if (newSet.has(keyword.term)) {
                newSet.delete(keyword.term);
            } else {
                newSet.add(keyword.term);
            }
            return newSet;
        });
    };

    // 点击关键词
    const handleKeywordClick = (keyword: MagicKeyword) => {
        if (isFusionMode) {
            // 融合模式：切换选择
            setSelectedKeywords(prev => {
                const index = prev.findIndex(k => k.term === keyword.term);
                if (index >= 0) {
                    return prev.filter(k => k.term !== keyword.term);
                } else {
                    return [...prev, keyword];
                }
            });
        } else {
            // 普通模式：打开详情
            setSelectedKeyword(keyword);
            setIsModalOpen(true);
        }
    };

    // 打开融合模态框
    const handleFusion = () => {
        if (selectedKeywords.length >= 2) {
            setSelectedKeyword(null);
            setIsModalOpen(true);
        }
    };

    // 关闭模态框
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedKeyword(null);
        if (isFusionMode) {
            setSelectedKeywords([]);
        }
    };

    // 获取模态框数据
    const modalData = isFusionMode && selectedKeywords.length >= 2
        ? selectedKeywords
        : selectedKeyword;

    // 检查API密钥（P0-3修复）
    const hasApiKey = typeof import.meta.env !== 'undefined' && 
                      import.meta.env.VITE_GEMINI_API_KEY;

    // 快捷键支持（优化：按 / 聚焦搜索框）
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // 按 / 聚焦搜索框（不在输入框中时）
            if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
                e.preventDefault();
                const searchInput = document.querySelector('input[type="text"][placeholder*="搜索"]') as HTMLInputElement;
                if (searchInput) {
                    searchInput.focus();
                }
            }
            // 按 Esc 清除搜索
            if (e.key === 'Escape' && filters.search) {
                setFilters(prev => ({ ...prev, search: '' }));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [filters.search]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
                                <Sparkles className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    魔法关键词看板 3.0
                                </h1>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                    认知催化系统
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                to="/admin"
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            >
                                <Sparkles size={16} />
                                管理后台
                            </Link>
                            <button
                                onClick={() => setIsGuideOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            >
                                <BookOpen size={16} />
                                提示工程指南
                            </button>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* 搜索和筛选栏 */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* 搜索框（优化：添加快捷键提示和更好的交互） */}
                        <div className="flex-1 relative group">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="搜索关键词、描述、示例... (按 / 快速聚焦)"
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                            />
                            {filters.search && (
                                <button
                                    onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        {/* 分类筛选 */}
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as Category | 'all' | 'favorites' }))}
                            className="px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                        >
                            <option value="all">所有分类</option>
                            <option value="favorites">⭐ 收藏</option>
                            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>

                        {/* 深度筛选 */}
                        <select
                            value={filters.depth}
                            onChange={(e) => setFilters(prev => ({ ...prev, depth: e.target.value as Depth | 'all' }))}
                            className="px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                        >
                            <option value="all">所有深度</option>
                            {Object.entries(DEPTH_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>

                        {/* 融合模式切换 */}
                        <button
                            onClick={() => {
                                setIsFusionMode(!isFusionMode);
                                setSelectedKeywords([]);
                            }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                                isFusionMode
                                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                            <Zap size={16} />
                            {isFusionMode ? '退出融合' : '概念融合'}
                        </button>
                    </div>

                    {/* 融合模式提示和操作 */}
                    {isFusionMode && (
                        <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300">
                                <Zap size={16} />
                                <span>已选择 {selectedKeywords.length} 个关键词，至少选择2个进行融合分析</span>
                            </div>
                            {selectedKeywords.length >= 2 && (
                                <button
                                    onClick={handleFusion}
                                    className="px-4 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                                >
                                    生成融合洞察
                                </button>
                            )}
                        </div>
                    )}

                    {/* API密钥提示（优化：更友好的提示） */}
                    {!hasApiKey && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center justify-between shadow-sm"
                        >
                            <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                                <span className="text-lg">⚠️</span>
                                <span>未检测到API密钥，AI洞察功能已禁用。请在.env.local中设置 <code className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 rounded text-xs font-mono">VITE_GEMINI_API_KEY</code></span>
                            </div>
                        </motion.div>
                    )}
                </div>
            </header>

            {/* 主内容区 */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 结果统计（优化：更友好的显示） */}
                {keywords.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                共找到 <span className="font-bold text-purple-600 dark:text-purple-400 text-base">{filteredKeywords.length}</span> 个关键词
                            </p>
                            {(filters.search || filters.category !== 'all' || filters.depth !== 'all') && (
                                <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
                                    已筛选
                                </span>
                            )}
                        </div>
                        {(filters.search || filters.category !== 'all' || filters.depth !== 'all') && (
                            <button
                                onClick={() => setFilters({ search: '', category: 'all', depth: 'all' })}
                                className="text-sm text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 flex items-center gap-1 transition-colors"
                            >
                                <X size={14} />
                                清除筛选
                            </button>
                        )}
                    </motion.div>
                )}

                {/* 加载状态 */}
                {keywords.length === 0 && (
                    <div className="text-center py-16">
                        <div className="inline-block w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 dark:text-gray-400">正在加载关键词...</p>
                    </div>
                )}

                {/* 空结果提示（优化：区分加载中和无结果） */}
                {keywords.length > 0 && filteredKeywords.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="inline-block p-4 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-full mb-4">
                            <Search className="text-purple-500 dark:text-purple-400" size={32} />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                            未找到匹配的关键词
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            {filters.search || filters.category !== 'all' || filters.depth !== 'all' 
                                ? '尝试调整搜索词或筛选条件'
                                : '当前没有关键词数据'}
                        </p>
                        {(filters.search || filters.category !== 'all' || filters.depth !== 'all') && (
                            <button
                                onClick={() => setFilters({ search: '', category: 'all', depth: 'all' })}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                重置所有筛选
                            </button>
                        )}
                    </motion.div>
                )}

                {/* 关键词网格（优化：更好的动画和空状态） */}
                {keywords.length > 0 && filteredKeywords.length > 0 && (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${filters.category}-${filters.depth}-${filters.search}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {filteredKeywords.map((keyword, index) => (
                                <motion.div
                                    key={keyword.term}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.03, duration: 0.2 }}
                                >
                                    <KeywordCard
                                        keyword={keyword}
                                        isFavorite={favorites.has(keyword.term)}
                                        onToggleFavorite={(e) => handleToggleFavorite(keyword, e)}
                                        onClick={() => handleKeywordClick(keyword)}
                                        isSelectedForFusion={isFusionMode && selectedKeywords.some(k => k.term === keyword.term)}
                                        isFusionMode={isFusionMode}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}
            </main>

            {/* 模态框 */}
            <InsightModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                data={modalData}
                isFusion={isFusionMode && selectedKeywords.length >= 2}
            />

            {/* 提示工程指南 */}
            <PromptGuide
                isOpen={isGuideOpen}
                onClose={() => setIsGuideOpen(false)}
            />
        </div>
    );
};

export default App;

