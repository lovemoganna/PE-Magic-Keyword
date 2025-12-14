import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus, X as XIcon } from 'lucide-react';
import { MagicKeyword, Category, Depth } from '../../types';
import { CATEGORY_LABELS, DEPTH_LABELS } from '../../data';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    keyword: MagicKeyword | null;
    onSave: (keyword: MagicKeyword) => void;
}

const KeywordEditModal: React.FC<Props> = ({ isOpen, onClose, keyword, onSave }) => {
    const [formData, setFormData] = useState<MagicKeyword>({
        term: '',
        category: 'core-catalysts',
        depth: 'foundational',
        description: '',
        examples: [],
        related: [],
        cognitiveImpact: '',
        crossDomains: []
    });

    const [exampleInput, setExampleInput] = useState('');
    const [relatedInput, setRelatedInput] = useState('');
    const [crossDomainInput, setCrossDomainInput] = useState('');

    useEffect(() => {
        if (keyword) {
            setFormData(keyword);
            setExampleInput(keyword.examples.join(', '));
            setRelatedInput(keyword.related.join(', '));
            setCrossDomainInput(keyword.crossDomains.join(', '));
        } else {
            // 重置表单
            setFormData({
                term: '',
                category: 'core-catalysts',
                depth: 'foundational',
                description: '',
                examples: [],
                related: [],
                cognitiveImpact: '',
                crossDomains: []
            });
            setExampleInput('');
            setRelatedInput('');
            setCrossDomainInput('');
        }
    }, [keyword, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // 验证必填字段
        if (!formData.term.trim()) {
            alert('请输入关键词名称');
            return;
        }
        if (!formData.description.trim()) {
            alert('请输入描述');
            return;
        }

        onSave(formData);
    };

    const handleAddExample = () => {
        if (exampleInput.trim()) {
            const items = exampleInput.split(',').map(s => s.trim()).filter(Boolean);
            setFormData(prev => ({
                ...prev,
                examples: [...prev.examples, ...items]
            }));
            setExampleInput('');
        }
    };

    const handleRemoveExample = (index: number) => {
        setFormData(prev => ({
            ...prev,
            examples: prev.examples.filter((_, i) => i !== index)
        }));
    };

    const handleAddRelated = () => {
        if (relatedInput.trim()) {
            const items = relatedInput.split(',').map(s => s.trim()).filter(Boolean);
            setFormData(prev => ({
                ...prev,
                related: [...prev.related, ...items]
            }));
            setRelatedInput('');
        }
    };

    const handleRemoveRelated = (index: number) => {
        setFormData(prev => ({
            ...prev,
            related: prev.related.filter((_, i) => i !== index)
        }));
    };

    const handleAddCrossDomain = () => {
        if (crossDomainInput.trim()) {
            const items = crossDomainInput.split(',').map(s => s.trim()).filter(Boolean);
            setFormData(prev => ({
                ...prev,
                crossDomains: [...prev.crossDomains, ...items]
            }));
            setCrossDomainInput('');
        }
    };

    const handleRemoveCrossDomain = (index: number) => {
        setFormData(prev => ({
            ...prev,
            crossDomains: prev.crossDomains.filter((_, i) => i !== index)
        }));
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-white/10"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {keyword ? '编辑关键词' : '新建关键词'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-6">
                            {/* 基本信息 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        关键词名称 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.term}
                                        onChange={(e) => setFormData(prev => ({ ...prev, term: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                        placeholder="例如：第一性原理"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        分类 <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Category }))}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                        required
                                    >
                                        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        深度 <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.depth}
                                        onChange={(e) => setFormData(prev => ({ ...prev, depth: e.target.value as Depth }))}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                        required
                                    >
                                        {Object.entries(DEPTH_LABELS).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* 描述 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    描述 <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                    placeholder="详细描述该关键词的含义和作用..."
                                    required
                                />
                            </div>

                            {/* 认知影响 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    认知影响
                                </label>
                                <input
                                    type="text"
                                    value={formData.cognitiveImpact}
                                    onChange={(e) => setFormData(prev => ({ ...prev, cognitiveImpact: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                    placeholder="例如：激活深度推理和创新思维模式"
                                />
                            </div>

                            {/* 示例 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    示例
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={exampleInput}
                                        onChange={(e) => setExampleInput(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddExample();
                                            }
                                        }}
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                        placeholder="输入示例，用逗号分隔"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddExample}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.examples.map((example, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                                        >
                                            {example}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveExample(index)}
                                                className="hover:text-red-600 dark:hover:text-red-400"
                                            >
                                                <XIcon size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* 相关词 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    相关词
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={relatedInput}
                                        onChange={(e) => setRelatedInput(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddRelated();
                                            }
                                        }}
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                        placeholder="输入相关词，用逗号分隔"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddRelated}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.related.map((related, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                                        >
                                            {related}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveRelated(index)}
                                                className="hover:text-red-600 dark:hover:text-red-400"
                                            >
                                                <XIcon size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* 跨领域 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    跨领域应用
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={crossDomainInput}
                                        onChange={(e) => setCrossDomainInput(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddCrossDomain();
                                            }
                                        }}
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                        placeholder="输入应用领域，用逗号分隔"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddCrossDomain}
                                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.crossDomains.map((domain, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-sm"
                                        >
                                            {domain}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveCrossDomain(index)}
                                                className="hover:text-red-600 dark:hover:text-red-400"
                                            >
                                                <XIcon size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            取消
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                        >
                            <Save size={16} />
                            保存
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default KeywordEditModal;

