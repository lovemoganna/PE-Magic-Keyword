
import React, { useState, useEffect } from 'react';
import { MagicKeyword } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Copy, Lightbulb, Zap, Table as TableIcon } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    data: MagicKeyword | MagicKeyword[] | null; // Single for detail, array for fusion
    isFusion: boolean;
}

// --- 轻量级 Markdown 渲染器组件 ---
// 专门针对知识解构表的格式进行优化
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    // 简单的解析逻辑：按行分割，识别表格块和其他块
    const lines = content.split('\n');
    const blocks: React.ReactNode[] = [];
    
    let inTable = false;
    let tableHeader: string[] = [];
    let tableRows: string[][] = [];
    let listItems: string[] = [];

    const flushList = (keyPrefix: string) => {
        if (listItems.length > 0) {
            blocks.push(
                <ul key={`${keyPrefix}-list`} className="list-disc list-outside ml-5 mb-4 space-y-1 text-gray-700 dark:text-gray-300">
                    {listItems.map((item, i) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
                    ))}
                </ul>
            );
            listItems = [];
        }
    };

    const flushTable = (keyPrefix: string) => {
        if (tableHeader.length > 0) {
            blocks.push(
                <div key={`${keyPrefix}-table-wrapper`} className="w-full overflow-x-auto mb-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <table className="w-full text-sm text-left border-collapse min-w-[800px]">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-slate-700/50 dark:text-gray-300">
                            <tr>
                                {tableHeader.map((th, i) => (
                                    <th key={i} className="px-4 py-3 font-bold border-b dark:border-gray-600 whitespace-nowrap">
                                        {th}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800">
                            {tableRows.map((row, i) => (
                                <tr key={i} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors last:border-b-0">
                                    {row.map((cell, j) => {
                                        // 处理 ^^ 合并标记 (简单的视觉处理，不做真实的 rowspan 以免复杂化)
                                        const isMerge = cell.trim() === '^^';
                                        return (
                                            <td key={j} className={`px-4 py-3 align-top ${isMerge ? 'text-gray-300 dark:text-gray-600 text-center select-none' : 'text-gray-700 dark:text-gray-300'}`}>
                                                {isMerge ? '〃' : <span dangerouslySetInnerHTML={{ __html: parseInline(cell) }} />}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
            tableHeader = [];
            tableRows = [];
        }
    };

    const parseInline = (text: string) => {
        // 简单的内联解析：加粗、代码
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-indigo-600 dark:text-indigo-400">$1</strong>')
            .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-slate-700 px-1 py-0.5 rounded text-xs font-mono text-pink-600 dark:text-pink-400">$1</code>')
            .replace(/<br>/g, '<br/>');
    };

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        const key = `line-${index}`;

        // 处理表格
        if (trimmed.startsWith('|')) {
            flushList(key); // 表格开始前清空列表
            inTable = true;
            const cells = trimmed.split('|').filter((_, i, arr) => i !== 0 && i !== arr.length - 1).map(c => c.trim());
            
            // 忽略分隔行 |---|---|
            if (trimmed.includes('---')) return;

            if (tableHeader.length === 0) {
                tableHeader = cells;
            } else {
                tableRows.push(cells);
            }
            return;
        } else if (inTable) {
            flushTable(key);
            inTable = false;
        }

        // 处理标题
        if (trimmed.startsWith('## ')) {
            flushList(key);
            blocks.push(<h2 key={key} className="text-xl font-bold mt-8 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent border-b border-gray-100 dark:border-gray-700 pb-2">{trimmed.replace('## ', '')}</h2>);
            return;
        }
        if (trimmed.startsWith('### ')) {
            flushList(key);
            blocks.push(<h3 key={key} className="text-lg font-bold mt-6 mb-3 text-gray-800 dark:text-gray-100 flex items-center gap-2"><span className="w-1.5 h-6 bg-indigo-500 rounded-full inline-block"></span>{trimmed.replace('### ', '')}</h3>);
            return;
        }

        // 处理列表
        if (trimmed.startsWith('- ') || trimmed.match(/^\d+\. /)) {
            listItems.push(trimmed.replace(/^-\s|^\d+\.\s/, ''));
            return;
        } else {
            flushList(key);
        }

        // 处理代码块 (简单处理)
        if (trimmed.startsWith('```')) {
             flushList(key);
             // 我们这里做一个非常简化的处理，实际应该收集多行
             return; 
        }

        // 处理普通文本
        if (trimmed.length > 0) {
            blocks.push(<p key={key} className="mb-2 leading-relaxed text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: parseInline(trimmed) }} />);
        }
    });

    // 处理剩余内容
    flushList('final');
    flushTable('final');

    return <div className="markdown-body space-y-1">{blocks}</div>;
};

const InsightModal: React.FC<Props> = ({ isOpen, onClose, data, isFusion }) => {
    const [insight, setInsight] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setInsight(null);
            setIsLoading(false);
        }
    }, [isOpen]);

    if (!isOpen || !data) return null;

    const keywords = Array.isArray(data) ? data : [data];
    const mainKeyword = keywords[0];

    // 通用知识解构智能体·终极版 Prompt
    const AGENT_PROMPT_TEMPLATE = `
# 通用知识解构智能体·终极版

## 【设计原理】
知识本质 = 概念边界 + 层级结构 + 正反案例
学习本质 = 通过对比建立认知边界

## 【任务指令】
你是世界顶级的认知科学家和知识工程师。请遵循第一性原理，对用户输入的【${isFusion ? '融合概念' : '概念'}】进行深度解构。

## 【标准输出格式】
请严格按照以下Markdown格式输出，不要包含其他开场白。

## 知识解构：<概念名称>

### 全局说明
- **核心目标**：<一句话本质，自动推测用户想达成什么>
- **前置依赖**：<需要先了解的概念>
- **知识边界**：<包含什么，不包含什么>

### 知识结构表

| 一级要素 | 二级要素 | 三级要素 | 大白话解释 | 具体定义 | 典型正例 | 边界限定 | 典型反例 |
|---|---|---|---|---|---|---|---|
| <维度1> | <功能1> | <操作1> | <5岁小孩能懂的类比> | <专业准确定义> | ① 场景A<br>② 场景B | <仅当...时> | ✗ 错误A<br>✗ 混淆B |
| ^^ | ^^ | <操作2> | ... | ... | ... | ... | ... |
| <维度2> | <功能2> | <操作3> | ... | ... | ... | ... | ... |

注：请确保表格内容MECE（完全穷尽，相互独立），并覆盖至少3个一级要素。表格中使用 <br> 换行。

### 快速上手路径
1. **新手先看**：<最小学习集>
2. **常用组合**：<80%场景的操作组合>
3. **进阶扩展**：<可选的深入方向>

### ⚡ 典型提示词示例 (Prompt Example)
> 请根据该概念的核心原理，撰写一个"即插即用"的高质量Prompt示例。
> 格式要求：使用Markdown代码块，包含[角色]、[任务]、[约束]。
> 风格要求：短小精悍，直击本质，立即展示该概念的威力。

---
请解构的概念是：${isFusion ? keywords.map(k => k.term).join(' + ') : mainKeyword.term}
${isFusion ? '这是一个融合概念，请重点分析它们结合后的涌现特性和创新应用。' : ''}
`;

    const generateAIInsight = async () => {
        setIsLoading(true);
        setInsight(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // 使用 Flash 模型以获得快速响应，它足够处理这种结构化任务
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: AGENT_PROMPT_TEMPLATE,
                config: {
                    temperature: 0.3, // 降低随机性以保证表格结构稳定
                }
            });

            setInsight(response.text);
        } catch (error: any) {
            console.error("AI Generation failed", error);
            setInsight(`### 🚫 生成失败\n\n抱歉，知识解构过程中遇到了问题。\n\n错误信息: ${error.message || '未知错误'}\n\n请检查您的 API Key 配置或稍后重试。`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        const text = isFusion 
            ? `融合概念: ${keywords.map(k => k.term).join(', ')}\n\n${insight || ''}`
            : `${mainKeyword.term}\n${mainKeyword.description}\n\n${insight || ''}`;
        
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

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
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto flex flex-col border border-white/10"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-10">
                        <div>
                            {isFusion ? (
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
                                    <Zap className="text-orange-500" />
                                    概念融合实验室
                                </h2>
                            ) : (
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    {mainKeyword.term}
                                    <span className="text-sm font-normal px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                                        {mainKeyword.depth}
                                    </span>
                                </h2>
                            )}
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-8">
                        {/* Keyword Details Area - Simplified for better focus on Insight */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {keywords.map((kw, idx) => (
                                <div key={idx} className={`space-y-4 ${isFusion ? 'p-6 rounded-xl bg-gray-50 dark:bg-slate-700/50' : ''}`}>
                                    {isFusion && <h3 className="font-bold text-lg text-primary">{kw.term}</h3>}
                                    
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <Lightbulb size={14} /> 核心定义
                                        </h4>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                                            {kw.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                         {kw.crossDomains.map(d => (
                                            <span key={d} className="px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded text-xs text-gray-500 dark:text-gray-400">
                                                {d}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* AI Insight Section */}
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                    <Sparkles size={24} />
                                    通用知识解构智能体·终极版
                                </h3>
                                {insight && (
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={handleCopy}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                        >
                                            {copied ? <span className="text-green-500">已复制</span> : <><Copy size={14}/> 复制Markdown</>}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {!insight && !isLoading && (
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-700/50 p-10 rounded-2xl border border-indigo-100 dark:border-slate-600 text-center relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-20 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
                                    <div className="relative z-10">
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                            启动深度认知解构
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                                            按照MECE（完全穷尽，相互独立）原则，将此概念拆解为标准化的知识结构表。
                                            包含：核心目标、前置依赖、边界限定、正反例对比及三级要素拆解，并生成即插即用的Prompt。
                                        </p>
                                        <button 
                                            onClick={generateAIInsight}
                                            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-xl shadow-indigo-200 dark:shadow-none"
                                        >
                                            <TableIcon size={18} />
                                            生成标准化知识表格
                                        </button>
                                    </div>
                                </div>
                            )}

                            {isLoading && (
                                <div className="p-16 text-center bg-gray-50 dark:bg-slate-800/50 rounded-2xl">
                                    <div className="inline-block w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <div className="space-y-3">
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">智能体正在解构知识...</p>
                                        <div className="flex flex-col gap-1 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="animate-pulse delay-75">正在提取核心概念边界...</span>
                                            <span className="animate-pulse delay-150">正在进行MECE结构拆解...</span>
                                            <span className="animate-pulse delay-300">正在生成典型提示词示例...</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {insight && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden p-6"
                                >
                                    <MarkdownRenderer content={insight} />
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default InsightModal;
