
import React, { useState, useEffect } from 'react';
import { MagicKeyword } from '../types';
import { CATEGORY_LABELS, DEPTH_LABELS } from '../data';
import { Save, X, Plus } from 'lucide-react';

interface KeywordFormProps {
    initialData?: MagicKeyword | null;
    onSubmit: (data: MagicKeyword) => void;
    onCancel: () => void;
}

const KeywordForm: React.FC<KeywordFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<MagicKeyword>({
        term: '',
        category: 'core-catalysts',
        depth: 'foundational',
        description: '',
        examples: [''],
        related: [''],
        cognitiveImpact: '',
        crossDomains: ['']
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (field: keyof MagicKeyword, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (field: 'examples' | 'related' | 'crossDomains', index: number, value: string) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field: 'examples' | 'related' | 'crossDomains') => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const removeArrayItem = (field: 'examples' | 'related' | 'crossDomains', index: number) => {
        setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Helper for input classes
    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-slate-700/50 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none";
    const labelClass = "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2";

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <label className={labelClass}>关键词名称 (Term)</label>
                        <input
                            type="text"
                            required
                            placeholder="例如：第一性原理"
                            className={inputClass}
                            value={formData.term}
                            onChange={e => handleChange('term', e.target.value)}
                            disabled={!!initialData}
                        />
                        {initialData && <p className="text-xs text-gray-400 mt-1 ml-1">ID (Term) 不可修改</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>维度 (Category)</label>
                            <div className="relative">
                                <select
                                    className={`${inputClass} appearance-none cursor-pointer`}
                                    value={formData.category}
                                    onChange={e => handleChange('category', e.target.value)}
                                >
                                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">▼</div>
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>深度 (Depth)</label>
                            <div className="relative">
                                <select
                                    className={`${inputClass} appearance-none cursor-pointer`}
                                    value={formData.depth}
                                    onChange={e => handleChange('depth', e.target.value)}
                                >
                                    {Object.entries(DEPTH_LABELS).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">▼</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>认知影响 (Impact)</label>
                        <input
                            type="text"
                            required
                            placeholder="例如：提升深度思考能力..."
                            className={inputClass}
                            value={formData.cognitiveImpact}
                            onChange={e => handleChange('cognitiveImpact', e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className={labelClass}>核心定义 (Description)</label>
                    <textarea
                        required
                        rows={6}
                        placeholder="该概念的本质定义..."
                        className={`${inputClass} resize-none leading-relaxed h-[calc(100%-2rem)]`}
                        value={formData.description}
                        onChange={e => handleChange('description', e.target.value)}
                    />
                </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">扩展信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Array Fields */}
                    {[
                        { key: 'examples', label: '典型案例', placeholder: '输入案例...' },
                        { key: 'related', label: '关联概念', placeholder: '输入关联词...' },
                        { key: 'crossDomains', label: '跨学科应用', placeholder: '输入领域...' }
                    ].map(({ key, label, placeholder }) => (
                        <div key={key} className="bg-gray-50/50 dark:bg-slate-700/20 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                {label}
                            </label>
                            <div className="space-y-2">
                                {(formData[key as keyof MagicKeyword] as string[]).map((item, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder={placeholder}
                                            className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none"
                                            value={item}
                                            onChange={e => handleArrayChange(key as any, index, e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem(key as any, index)}
                                            className="text-gray-400 hover:text-red-500 transition-colors px-1"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem(key as any)}
                                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 mt-2 px-1"
                                >
                                    <Plus size={12} />
                                    添加条目
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                    取消
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105 transition-all transform active:scale-95"
                >
                    <Save size={18} />
                    {initialData ? '保存修改' : '立即创建'}
                </button>
            </div>
        </form>
    );
};

export default KeywordForm;
