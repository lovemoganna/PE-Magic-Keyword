import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    Plus, Search, Download, Upload, Trash2, Edit, Eye, 
    Table, Grid, List, BarChart3, Settings, ArrowLeft,
    FileJson, FileSpreadsheet, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';
import { MagicKeyword, Category, Depth } from '../types';
import { KeywordService } from '../services/keywordService';
import { CATEGORY_LABELS, DEPTH_LABELS } from '../data';
import KeywordEditModal from '../components/admin/KeywordEditModal';
import KeywordPreviewModal from '../components/admin/KeywordPreviewModal';
import ImportExportModal from '../components/admin/ImportExportModal';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';

type ViewMode = 'table' | 'grid' | 'list';
type TabType = 'keywords' | 'analytics';

const AdminDashboard: React.FC = () => {
    const [keywords, setKeywords] = useState<MagicKeyword[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
    const [selectedDepth, setSelectedDepth] = useState<Depth | 'all'>('all');
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
    const [activeTab, setActiveTab] = useState<TabType>('keywords');
    
    // 模态框状态
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);
    const [editingKeyword, setEditingKeyword] = useState<MagicKeyword | null>(null);
    const [previewKeyword, setPreviewKeyword] = useState<MagicKeyword | null>(null);

    // 加载数据
    const loadKeywords = () => {
        setKeywords(KeywordService.getAll());
    };

    useEffect(() => {
        loadKeywords();
    }, []);

    // 过滤关键词
    const filteredKeywords = useMemo(() => {
        return keywords.filter(k => {
            const matchesSearch = !searchTerm || 
                k.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                k.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = selectedCategory === 'all' || k.category === selectedCategory;
            const matchesDepth = selectedDepth === 'all' || k.depth === selectedDepth;

            return matchesSearch && matchesCategory && matchesDepth;
        });
    }, [keywords, searchTerm, selectedCategory, selectedDepth]);

    // 处理创建
    const handleCreate = () => {
        setEditingKeyword(null);
        setIsEditModalOpen(true);
    };

    // 处理编辑
    const handleEdit = (keyword: MagicKeyword) => {
        setEditingKeyword(keyword);
        setIsEditModalOpen(true);
    };

    // 处理删除
    const handleDelete = (term: string) => {
        if (confirm(`确定要删除关键词 "${term}" 吗？`)) {
            KeywordService.delete(term);
            loadKeywords();
            setSelectedKeywords(prev => {
                const next = new Set(prev);
                next.delete(term);
                return next;
            });
        }
    };

    // 处理批量删除
    const handleBatchDelete = () => {
        if (selectedKeywords.size === 0) return;
        
        if (confirm(`确定要删除选中的 ${selectedKeywords.size} 个关键词吗？`)) {
            const deleted = KeywordService.deleteBatch(Array.from(selectedKeywords));
            loadKeywords();
            setSelectedKeywords(new Set());
            alert(`已删除 ${deleted} 个关键词`);
        }
    };

    // 处理预览
    const handlePreview = (keyword: MagicKeyword) => {
        setPreviewKeyword(keyword);
        setIsPreviewModalOpen(true);
    };

    // 处理保存
    const handleSave = (keyword: MagicKeyword) => {
        try {
            if (editingKeyword) {
                KeywordService.update(editingKeyword.term, keyword);
            } else {
                KeywordService.create(keyword);
            }
            loadKeywords();
            setIsEditModalOpen(false);
            setEditingKeyword(null);
        } catch (e: any) {
            alert(`保存失败：${e.message}`);
        }
    };

    // 切换选择
    const toggleSelection = (term: string) => {
        setSelectedKeywords(prev => {
            const next = new Set(prev);
            if (next.has(term)) {
                next.delete(term);
            } else {
                next.add(term);
            }
            return next;
        });
    };

    // 全选/取消全选
    const toggleSelectAll = () => {
        if (selectedKeywords.size === filteredKeywords.length) {
            setSelectedKeywords(new Set());
        } else {
            setSelectedKeywords(new Set(filteredKeywords.map(k => k.term)));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            {/* Header */}
            <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Link 
                                to="/"
                                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <ArrowLeft size={20} />
                                <span>返回前台</span>
                            </Link>
                            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                关键词管理后台
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsImportExportModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <Upload size={16} />
                                导入/导出
                            </button>
                            <button
                                onClick={handleCreate}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                <Plus size={16} />
                                新建关键词
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setActiveTab('keywords')}
                            className={`px-4 py-2 font-medium transition-colors ${
                                activeTab === 'keywords'
                                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            关键词管理
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`px-4 py-2 font-medium transition-colors ${
                                activeTab === 'analytics'
                                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <BarChart3 size={16} className="inline mr-2" />
                            数据分析
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'keywords' ? (
                    <>
                        {/* 工具栏 */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                {/* 搜索 */}
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="搜索关键词..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                {/* 筛选 */}
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value as Category | 'all')}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                >
                                    <option value="all">所有分类</option>
                                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>

                                <select
                                    value={selectedDepth}
                                    onChange={(e) => setSelectedDepth(e.target.value as Depth | 'all')}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                >
                                    <option value="all">所有深度</option>
                                    {Object.entries(DEPTH_LABELS).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>

                                {/* 视图模式 */}
                                <div className="flex gap-1 border border-gray-300 dark:border-gray-600 rounded-lg p-1 bg-gray-50 dark:bg-slate-700">
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`p-2 rounded transition-colors ${
                                            viewMode === 'table'
                                                ? 'bg-white dark:bg-slate-600 text-purple-600 dark:text-purple-400'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                    >
                                        <Table size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded transition-colors ${
                                            viewMode === 'grid'
                                                ? 'bg-white dark:bg-slate-600 text-purple-600 dark:text-purple-400'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                    >
                                        <Grid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded transition-colors ${
                                            viewMode === 'list'
                                                ? 'bg-white dark:bg-slate-600 text-purple-600 dark:text-purple-400'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                    >
                                        <List size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* 批量操作 */}
                            {selectedKeywords.size > 0 && (
                                <div className="mt-4 flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                    <span className="text-sm text-purple-700 dark:text-purple-300">
                                        已选择 {selectedKeywords.size} 个关键词
                                    </span>
                                    <button
                                        onClick={handleBatchDelete}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                    >
                                        <Trash2 size={16} />
                                        批量删除
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 统计信息 */}
                        <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                            共找到 <span className="font-bold text-purple-600 dark:text-purple-400">{filteredKeywords.length}</span> 个关键词
                        </div>

                        {/* 关键词列表 */}
                        {viewMode === 'table' && (
                            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-slate-700">
                                        <tr>
                                            <th className="px-4 py-3 text-left">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedKeywords.size === filteredKeywords.length && filteredKeywords.length > 0}
                                                    onChange={toggleSelectAll}
                                                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                />
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">关键词</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">分类</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">深度</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">描述</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {filteredKeywords.map((keyword) => (
                                            <tr key={keyword.term} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedKeywords.has(keyword.term)}
                                                        onChange={() => toggleSelection(keyword.term)}
                                                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                                    {keyword.term}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                    {CATEGORY_LABELS[keyword.category]}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                    {DEPTH_LABELS[keyword.depth]}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-md truncate">
                                                    {keyword.description}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handlePreview(keyword)}
                                                            className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                            title="预览"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(keyword)}
                                                            className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors"
                                                            title="编辑"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(keyword.term)}
                                                            className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                            title="删除"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {viewMode === 'grid' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredKeywords.map((keyword) => (
                                    <motion.div
                                        key={keyword.term}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-bold text-gray-900 dark:text-white">{keyword.term}</h3>
                                            <input
                                                type="checkbox"
                                                checked={selectedKeywords.has(keyword.term)}
                                                onChange={() => toggleSelection(keyword.term)}
                                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                            {keyword.description}
                                        </p>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded">
                                                {CATEGORY_LABELS[keyword.category]}
                                            </span>
                                            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                                                {DEPTH_LABELS[keyword.depth]}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handlePreview(keyword)}
                                                className="flex-1 px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                            >
                                                预览
                                            </button>
                                            <button
                                                onClick={() => handleEdit(keyword)}
                                                className="flex-1 px-3 py-1.5 text-sm bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                                            >
                                                编辑
                                            </button>
                                            <button
                                                onClick={() => handleDelete(keyword.term)}
                                                className="px-3 py-1.5 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {viewMode === 'list' && (
                            <div className="space-y-2">
                                {filteredKeywords.map((keyword) => (
                                    <motion.div
                                        key={keyword.term}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedKeywords.has(keyword.term)}
                                                onChange={() => toggleSelection(keyword.term)}
                                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-bold text-gray-900 dark:text-white">{keyword.term}</h3>
                                                    <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded">
                                                        {CATEGORY_LABELS[keyword.category]}
                                                    </span>
                                                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                                                        {DEPTH_LABELS[keyword.depth]}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{keyword.description}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handlePreview(keyword)}
                                                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(keyword)}
                                                    className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(keyword.term)}
                                                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <AnalyticsDashboard keywords={keywords} />
                )}
            </main>

            {/* 模态框 */}
            <KeywordEditModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingKeyword(null);
                }}
                keyword={editingKeyword}
                onSave={handleSave}
            />

            <KeywordPreviewModal
                isOpen={isPreviewModalOpen}
                onClose={() => {
                    setIsPreviewModalOpen(false);
                    setPreviewKeyword(null);
                }}
                keyword={previewKeyword}
            />

            <ImportExportModal
                isOpen={isImportExportModalOpen}
                onClose={() => setIsImportExportModalOpen(false)}
                onImportSuccess={loadKeywords}
            />
        </div>
    );
};

export default AdminDashboard;

