import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Upload, FileJson, FileSpreadsheet, FileText, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { KeywordService } from '../../services/keywordService';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onImportSuccess: () => void;
}

type TabType = 'export' | 'import';

const ImportExportModal: React.FC<Props> = ({ isOpen, onClose, onImportSuccess }) => {
    const [activeTab, setActiveTab] = useState<TabType>('export');
    const [importText, setImportText] = useState('');
    const [importFile, setImportFile] = useState<File | null>(null);
    const [importOptions, setImportOptions] = useState({
        merge: true,
        overwrite: false
    });
    const [importResult, setImportResult] = useState<{
        success: number;
        failed: number;
        errors: string[];
    } | null>(null);
    const [isImporting, setIsImporting] = useState(false);

    if (!isOpen) return null;

    const handleExportJSON = () => {
        const json = KeywordService.exportJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `magic-keywords-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportCSV = () => {
        const csv = KeywordService.exportCSV();
        // exportCSV已经包含BOM，直接使用
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `magic-keywords-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportExcel = () => {
        // 生成真正的Excel XML格式（Excel 2003+兼容）
        const keywords = KeywordService.getAll();
        
        // XML转义函数
        const escapeXml = (str: string): string => {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');
        };
        
        // Excel XML格式头部
        let excelContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
        excelContent += '<?mso-application progid="Excel.Sheet"?>\n';
        excelContent += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n';
        excelContent += ' xmlns:o="urn:schemas-microsoft-com:office:office"\n';
        excelContent += ' xmlns:x="urn:schemas-microsoft-com:office:excel"\n';
        excelContent += ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"\n';
        excelContent += ' xmlns:html="http://www.w3.org/TR/REC-html40">\n';
        excelContent += '<Worksheet ss:Name="关键词列表">\n';
        excelContent += '<Table>\n';
        
        // 表头
        excelContent += '<Row>\n';
        const headers = ['关键词', '分类', '深度', '描述', '示例', '相关词', '认知影响', '跨领域应用'];
        headers.forEach(header => {
            excelContent += `<Cell><Data ss:Type="String">${escapeXml(header)}</Data></Cell>\n`;
        });
        excelContent += '</Row>\n';
        
        // 数据行
        keywords.forEach(keyword => {
            excelContent += '<Row>\n';
            excelContent += `<Cell><Data ss:Type="String">${escapeXml(keyword.term)}</Data></Cell>\n`;
            excelContent += `<Cell><Data ss:Type="String">${escapeXml(keyword.category)}</Data></Cell>\n`;
            excelContent += `<Cell><Data ss:Type="String">${escapeXml(keyword.depth)}</Data></Cell>\n`;
            excelContent += `<Cell><Data ss:Type="String">${escapeXml(keyword.description)}</Data></Cell>\n`;
            excelContent += `<Cell><Data ss:Type="String">${escapeXml(keyword.examples.join('; '))}</Data></Cell>\n`;
            excelContent += `<Cell><Data ss:Type="String">${escapeXml(keyword.related.join('; '))}</Data></Cell>\n`;
            excelContent += `<Cell><Data ss:Type="String">${escapeXml(keyword.cognitiveImpact)}</Data></Cell>\n`;
            excelContent += `<Cell><Data ss:Type="String">${escapeXml(keyword.crossDomains.join('; '))}</Data></Cell>\n`;
            excelContent += '</Row>\n';
        });
        
        excelContent += '</Table>\n';
        excelContent += '</Worksheet>\n';
        excelContent += '</Workbook>';
        
        // 使用UTF-8 BOM确保中文正确显示
        const blob = new Blob(['\uFEFF' + excelContent], { 
            type: 'application/vnd.ms-excel' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `magic-keywords-${new Date().toISOString().split('T')[0]}.xls`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportMarkdown = () => {
        const md = KeywordService.exportMarkdown();
        const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `magic-keywords-${new Date().toISOString().split('T')[0]}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImportFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                setImportText(text);
            };
            reader.readAsText(file);
        }
    };

    const handleImport = async () => {
        if (!importText.trim()) {
            alert('请选择文件或输入数据');
            return;
        }

        setIsImporting(true);
        setImportResult(null);

        try {
            let result;
            const fileName = importFile?.name.toLowerCase() || '';
            const textStart = importText.trim();
            
            // 判断文件格式
            if (fileName.endsWith('.csv') || fileName.endsWith('.xlsx') || textStart.startsWith('term,')) {
                result = KeywordService.importCSV(importText, importOptions);
            } else if (fileName.endsWith('.md') || textStart.startsWith('#') || textStart.startsWith('##')) {
                result = KeywordService.importMarkdown(importText, importOptions);
            } else {
                // 默认尝试JSON
                result = KeywordService.importJSON(importText, importOptions);
            }

            setImportResult(result);
            
            if (result.success > 0) {
                onImportSuccess();
            }
        } catch (e: any) {
            setImportResult({
                success: 0,
                failed: 0,
                errors: [e.message || '导入失败']
            });
        } finally {
            setIsImporting(false);
        }
    };

    const resetImport = () => {
        setImportText('');
        setImportFile(null);
        setImportResult(null);
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
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-white/10"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            导入/导出数据
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-100 dark:border-gray-700">
                        <button
                            onClick={() => {
                                setActiveTab('export');
                                resetImport();
                            }}
                            className={`flex-1 px-6 py-3 font-medium transition-colors ${
                                activeTab === 'export'
                                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <Download size={18} className="inline mr-2" />
                            导出
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('import');
                                resetImport();
                            }}
                            className={`flex-1 px-6 py-3 font-medium transition-colors ${
                                activeTab === 'import'
                                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <Upload size={18} className="inline mr-2" />
                            导入
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {activeTab === 'export' ? (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        导出格式
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button
                                            onClick={handleExportJSON}
                                            className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 transition-colors text-left group"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                                                    <FileJson size={24} className="text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">JSON格式</h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">完整数据结构</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                导出为JSON格式，包含所有字段信息，适合程序处理和备份。
                                            </p>
                                        </button>

                                        <button
                                            onClick={handleExportCSV}
                                            className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors text-left group"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
                                                    <FileSpreadsheet size={24} className="text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">CSV格式</h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">表格数据（UTF-8）</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                导出为CSV格式，已修复中文乱码问题，适合在Excel等表格软件中查看和编辑。
                                            </p>
                                        </button>

                                        <button
                                            onClick={handleExportExcel}
                                            className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 dark:hover:border-green-500 transition-colors text-left group"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                                                    <FileSpreadsheet size={24} className="text-green-600 dark:text-green-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">Excel格式</h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">.xls文件（Excel 2003+）</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                导出为Excel XML格式（.xls），可在Excel 2003及以上版本中打开，完美支持中文显示。
                                            </p>
                                        </button>

                                        <button
                                            onClick={handleExportMarkdown}
                                            className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-left group"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                                                    <FileText size={24} className="text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">Markdown格式</h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">.md文件</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                导出为Markdown格式，适合文档阅读和版本控制。
                                            </p>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
                                        <div className="text-sm text-blue-700 dark:text-blue-300">
                                            <p className="font-medium mb-1">提示</p>
                                            <p>导出的数据包含所有关键词信息。建议定期备份数据。</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        导入选项
                                    </h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={importOptions.merge}
                                                onChange={(e) => setImportOptions(prev => ({ ...prev, merge: e.target.checked }))}
                                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">合并模式</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    将导入的数据与现有数据合并，保留现有数据
                                                </p>
                                            </div>
                                        </label>

                                        <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={importOptions.overwrite}
                                                onChange={(e) => setImportOptions(prev => ({ ...prev, overwrite: e.target.checked }))}
                                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">覆盖已存在</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    如果关键词已存在，用导入的数据覆盖
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        选择文件或粘贴数据
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                选择文件
                                            </label>
                                            <input
                                                type="file"
                                                accept=".json,.csv,.md,.xlsx"
                                                onChange={handleFileSelect}
                                                className="block w-full text-sm text-gray-500 dark:text-gray-400
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-lg file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-purple-50 file:text-purple-700
                                                    hover:file:bg-purple-100
                                                    dark:file:bg-purple-900/30 dark:file:text-purple-300
                                                    dark:hover:file:bg-purple-900/50"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                或直接粘贴数据
                                            </label>
                                            <textarea
                                                value={importText}
                                                onChange={(e) => setImportText(e.target.value)}
                                                rows={10}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-mono text-sm"
                                                placeholder="粘贴JSON、CSV或Markdown数据..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {importResult && (
                                    <div className={`p-4 rounded-lg border ${
                                        importResult.success > 0
                                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                    }`}>
                                        <div className="flex items-start gap-3">
                                            {importResult.success > 0 ? (
                                                <CheckCircle2 size={20} className="text-green-600 dark:text-green-400 mt-0.5" />
                                            ) : (
                                                <XCircle size={20} className="text-red-600 dark:text-red-400 mt-0.5" />
                                            )}
                                            <div className="flex-1">
                                                <p className={`font-medium mb-2 ${
                                                    importResult.success > 0
                                                        ? 'text-green-700 dark:text-green-300'
                                                        : 'text-red-700 dark:text-red-300'
                                                }`}>
                                                    {importResult.success > 0 ? '导入成功' : '导入失败'}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    成功: {importResult.success} | 失败: {importResult.failed}
                                                </p>
                                                {importResult.errors.length > 0 && (
                                                    <div className="mt-2 max-h-32 overflow-y-auto">
                                                        {importResult.errors.map((error, index) => (
                                                            <p key={index} className="text-xs text-red-600 dark:text-red-400 mb-1">
                                                                {error}
                                                            </p>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {activeTab === 'import' && (
                        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                            <button
                                onClick={resetImport}
                                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                重置
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={!importText.trim() || isImporting}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isImporting ? '导入中...' : '导入'}
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ImportExportModal;

