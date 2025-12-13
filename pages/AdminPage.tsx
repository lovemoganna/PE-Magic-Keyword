import React, { useState } from 'react';
import { useKeywords } from '../contexts/KeywordContext';
import { MagicKeyword } from '../types';
import KeywordForm from '../components/KeywordForm';
import GithubSettingsModal from '../components/GithubSettingsModal';
import { syncToGithub } from '../services/github';
import { CATEGORY_LABELS, DEPTH_LABELS } from '../data';
import { Plus, Edit, Trash2, ArrowLeft, Download, RotateCcw, Search, Database, Layers, Brain, Github, CloudUpload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPage: React.FC = () => {
    const { keywords, addKeyword, updateKeyword, deleteKeyword, resetData } = useKeywords();
    const [isEditing, setIsEditing] = useState(false);
    const [currentKeyword, setCurrentKeyword] = useState<MagicKeyword | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // GitHub State
    const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleCreate = () => {
        setCurrentKeyword(null);
        setIsEditing(true);
    };

    const handleEdit = (kw: MagicKeyword) => {
        setCurrentKeyword(kw);
        setIsEditing(true);
    };

    const handleDelete = (term: string) => {
        if (window.confirm(`确认删除 "${term}" 吗?`)) {
            deleteKeyword(term);
        }
    };

    const handleSubmit = (data: MagicKeyword) => {
        if (currentKeyword) {
            updateKeyword(currentKeyword.term, data);
        } else {
            if (keywords.some(k => k.term === data.term)) {
                alert('该关键词已存在！');
                return;
            }
            addKeyword(data);
        }
        setIsEditing(false);
        setCurrentKeyword(null);
    };

    const generateFileContent = () => {
        return `import { MagicKeyword, Category, Depth } from './types';

export const MAGIC_KEYWORDS: MagicKeyword[] = ${JSON.stringify(keywords, null, 4)};

export const CATEGORY_LABELS = ${JSON.stringify(CATEGORY_LABELS, null, 4)};

export const DEPTH_LABELS = ${JSON.stringify(DEPTH_LABELS, null, 4)};
`;
    };

    const handleExport = () => {
        const exportContent = generateFileContent();
        const blob = new Blob([exportContent], { type: 'text/typescript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.ts';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleCloudSync = async () => {
        if (!confirm("确定要将当前关键词数据同步到 GitHub 仓库吗？\n这将覆盖远程仓库中的 data.ts 文件。")) return;

        setIsSyncing(true);
        try {
            const content = generateFileContent();
            await syncToGithub(content);
            alert("同步成功！Github 仓库已更新。\nGit Pages 构建部署可能需要几分钟。");
        } catch (error) {
            console.error(error);
            // Check if it's likely a config error
            if (error instanceof Error && (error.message.includes('configuration') || error.message.includes('401'))) {
                const openSettings = confirm(`同步失败: ${error.message}\n需要检查 GitHub 设置吗？`);
                if (openSettings) setIsGithubModalOpen(true);
            } else {
                alert(`同步失败: ${error instanceof Error ? error.message : '未知错误'}`);
            }
        } finally {
            setIsSyncing(false);
        }
    };

    const filteredKeywords = keywords.filter(k =>
        k.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Stats
    const stats = {
        total: keywords.length,
        categories: new Set(keywords.map(k => k.category)).size,
        avgExamples: (keywords.reduce((acc, k) => acc + k.examples.length, 0) / keywords.length).toFixed(1)
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header Area with Glassmorphism */}
                <header className="mb-8 sticky top-4 z-30">
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-2xl shadow-lg p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <Link to="/" className="p-3 hover:bg-gray-100 dark:hover:bg-slate-700/50 rounded-xl transition-all group">
                                <ArrowLeft size={24} className="text-gray-600 dark:text-gray-400 group-hover:-translate-x-1 transition-transform" />
                            </Link>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    知识库管理后台
                                </h1>
                                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                                    Knowledge Base Management System
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto justify-end items-center">
                            {/* GitHub Controls */}
                            <div className="flex items-center gap-2 mr-2 md:mr-4 border-r border-gray-200 dark:border-gray-700 pr-2 md:pr-4">
                                <button
                                    onClick={() => setIsGithubModalOpen(true)}
                                    className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                    title="Github 配置"
                                >
                                    <Github size={20} />
                                </button>
                                <button
                                    onClick={handleCloudSync}
                                    disabled={isSyncing}
                                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl transition-all border
                                        ${isSyncing
                                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-wait'
                                            : 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-slate-600 hover:border-indigo-200'
                                        }`}
                                    title="同步至 GitHub 仓库"
                                >
                                    <CloudUpload size={18} className={isSyncing ? "animate-bounce" : ""} />
                                    <span className="hidden md:inline">{isSyncing ? '同步中...' : '同步云端'}</span>
                                </button>
                            </div>

                            <button
                                onClick={resetData}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                title="重置为默认数据 (清除本地缓存)"
                            >
                                <RotateCcw size={16} />
                                <span className="hidden lg:inline">重置</span>
                            </button>
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600 rounded-xl transition-all shadow-sm"
                            >
                                <Download size={16} />
                                <span className="hidden lg:inline">导出</span>
                            </button>
                            <button
                                onClick={handleCreate}
                                className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:scale-105 transition-all active:scale-95"
                            >
                                <Plus size={18} />
                                新增
                            </button>
                        </div>
                    </div>
                </header>

                <GithubSettingsModal
                    isOpen={isGithubModalOpen}
                    onClose={() => setIsGithubModalOpen(false)}
                />

                {/* Dashboard Stats Grid */}
                {!isEditing && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                                <Database size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">关键词总数</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                                <Layers size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">覆盖维度</p>
                                <p className="text-2xl font-bold">{stats.categories}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                                <Brain size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">平均案例数</p>
                                <p className="text-2xl font-bold">{stats.avgExamples}</p>
                            </div>
                        </div>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {isEditing ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white dark:bg-slate-800 p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 relative z-10">
                                <span className="w-1.5 h-8 bg-indigo-500 rounded-full inline-block"></span>
                                {currentKeyword ? '编辑关键词' : '创建新关键词'}
                            </h2>
                            <KeywordForm
                                initialData={currentKeyword}
                                onSubmit={handleSubmit}
                                onCancel={() => setIsEditing(false)}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col min-h-[600px]"
                        >
                            {/* Toolbar */}
                            <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-slate-800/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                                <div className="relative w-full md:max-w-md group">
                                    <input
                                        type="text"
                                        placeholder="搜索关键词、描述..."
                                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                    <Search className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                </div>
                                <div className="text-sm text-gray-400 font-medium">
                                    显示 {filteredKeywords.length} 条结果
                                </div>
                            </div>

                            {/* List Content */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50/80 dark:bg-slate-900/40 text-xs font-bold text-gray-500 uppercase tracking-wider sticky top-0 backdrop-blur-sm z-10 border-b border-gray-200 dark:border-gray-700">
                                    <div className="col-span-3 pl-2">关键词</div>
                                    <div className="col-span-2">维度</div>
                                    <div className="col-span-5">核心定义</div>
                                    <div className="col-span-2 text-right pr-2">操作</div>
                                </div>

                                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                    <AnimatePresence>
                                        {filteredKeywords.map(kw => (
                                            <motion.div
                                                key={kw.term}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                whileHover={{ backgroundColor: "rgba(99, 102, 241, 0.03)" }}
                                                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:px-6 md:py-4 transition-colors items-center group"
                                            >
                                                <div className="col-span-12 md:col-span-3 flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg shrink-0">
                                                        {kw.term.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 dark:text-gray-100">{kw.term}</div>
                                                        <div className="text-xs text-gray-400 md:hidden">{kw.category}</div>
                                                    </div>
                                                </div>

                                                <div className="col-span-12 md:col-span-2 hidden md:block">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-300">
                                                        {kw.category}
                                                    </span>
                                                </div>

                                                <div className="col-span-12 md:col-span-5 text-sm text-gray-600 dark:text-gray-400 line-clamp-2 md:line-clamp-1 leading-relaxed">
                                                    {kw.description}
                                                </div>

                                                <div className="col-span-12 md:col-span-2 flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEdit(kw)}
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-lg transition-colors bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-sm"
                                                        title="编辑"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(kw.term)}
                                                        className="p-2 text-rose-500 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30 rounded-lg transition-colors bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-sm"
                                                        title="删除"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    {filteredKeywords.length === 0 && (
                                        <div className="p-12 text-center text-gray-400">
                                            <Search size={48} className="mx-auto mb-4 opacity-20" />
                                            <p>未找到匹配的关键词</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminPage;
