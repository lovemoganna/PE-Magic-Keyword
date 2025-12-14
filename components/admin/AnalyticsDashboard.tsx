import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Database, Layers, Target, Network } from 'lucide-react';
import { MagicKeyword, Category, Depth } from '../../types';
import { KeywordService } from '../../services/keywordService';
import { CATEGORY_LABELS, DEPTH_LABELS } from '../../data';

interface Props {
    keywords: MagicKeyword[];
}

const AnalyticsDashboard: React.FC<Props> = ({ keywords }) => {
    const stats = useMemo(() => KeywordService.getStatistics(), [keywords]);

    // 计算分类分布数据
    const categoryData = useMemo(() => {
        return Object.entries(stats.byCategory)
            .map(([category, count]) => ({
                category: category as Category,
                label: CATEGORY_LABELS[category as Category],
                count,
                percentage: (count / stats.total) * 100
            }))
            .sort((a, b) => b.count - a.count);
    }, [stats]);

    // 计算深度分布数据
    const depthData = useMemo(() => {
        return Object.entries(stats.byDepth)
            .map(([depth, count]) => ({
                depth: depth as Depth,
                label: DEPTH_LABELS[depth as Depth],
                count,
                percentage: (count / stats.total) * 100
            }))
            .sort((a, b) => b.count - a.count);
    }, [stats]);

    // 计算平均数据
    const avgData = [
        { label: '平均示例数', value: stats.avgExamples.toFixed(1), icon: Layers },
        { label: '平均相关词数', value: stats.avgRelated.toFixed(1), icon: Network },
        { label: '平均跨领域数', value: stats.avgCrossDomains.toFixed(1), icon: Target }
    ];

    return (
        <div className="space-y-6">
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">总关键词数</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                        </div>
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Database className="text-purple-600 dark:text-purple-400" size={24} />
                        </div>
                    </div>
                </motion.div>

                {avgData.map((item, index) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{item.label}</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{item.value}</p>
                            </div>
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                <item.icon className="text-indigo-600 dark:text-indigo-400" size={24} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* 分类分布 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <PieChart className="text-purple-600 dark:text-purple-400" size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">分类分布</h3>
                </div>
                <div className="space-y-4">
                    {categoryData.map((item, index) => (
                        <motion.div
                            key={item.category}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {item.label}
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.count} ({item.percentage.toFixed(1)}%)
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.percentage}%` }}
                                    transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* 深度分布 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <BarChart3 className="text-blue-600 dark:text-blue-400" size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">深度分布</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {depthData.map((item, index) => (
                        <motion.div
                            key={item.depth}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {item.label}
                                </span>
                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {item.count}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {item.percentage.toFixed(1)}% 占比
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* 数据质量指标 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">数据质量指标</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">完整度</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {((keywords.filter(k => 
                                k.description && k.examples.length > 0 && k.related.length > 0
                            ).length / stats.total) * 100).toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            包含完整信息的关键词占比
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">丰富度</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {(stats.avgExamples + stats.avgRelated + stats.avgCrossDomains).toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            平均关联信息数量
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">覆盖度</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {Object.keys(stats.byCategory).length}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            覆盖的分类数量
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;

