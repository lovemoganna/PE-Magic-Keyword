import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Network } from 'lucide-react';
import { MagicKeyword } from '../../types';
import { CATEGORY_LABELS, DEPTH_LABELS } from '../../data';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    keyword: MagicKeyword | null;
}

const KeywordPreviewModal: React.FC<Props> = ({ isOpen, onClose, keyword }) => {
    if (!isOpen || !keyword) return null;

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
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-white/10"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            关键词预览
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-6">
                            {/* 标题区域 */}
                            <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 p-6 rounded-xl">
                                <h3 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                                    {keyword.term}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                                        {CATEGORY_LABELS[keyword.category]}
                                    </span>
                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                                        {DEPTH_LABELS[keyword.depth]}
                                    </span>
                                </div>
                            </div>

                            {/* 描述 */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    描述
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {keyword.description}
                                </p>
                            </div>

                            {/* 认知影响 */}
                            {keyword.cognitiveImpact && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <Sparkles size={16} />
                                        认知影响
                                    </h4>
                                    <p className="text-purple-600 dark:text-purple-400 font-medium">
                                        {keyword.cognitiveImpact}
                                    </p>
                                </div>
                            )}

                            {/* 示例 */}
                            {keyword.examples.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                        示例
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {keyword.examples.map((example, index) => (
                                            <div
                                                key={index}
                                                className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700"
                                            >
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    {example}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 相关词 */}
                            {keyword.related.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                        相关词
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {keyword.related.map((related, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                                            >
                                                {related}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 跨领域应用 */}
                            {keyword.crossDomains.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Network size={16} />
                                        跨领域应用
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {keyword.crossDomains.map((domain, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-sm"
                                            >
                                                {domain}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 dark:border-gray-700">
                        <button
                            onClick={onClose}
                            className="w-full px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            关闭
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default KeywordPreviewModal;

