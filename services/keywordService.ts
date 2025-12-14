import { MagicKeyword, Category, Depth } from '../types';
import { MAGIC_KEYWORDS, CATEGORY_LABELS, DEPTH_LABELS } from '../data';

// 数据存储键
const STORAGE_KEY = 'magic_keywords_data';

/**
 * 关键词数据管理服务
 * 提供CRUD操作、导入导出功能
 */
export class KeywordService {
    /**
     * 获取所有关键词
     */
    static getAll(): MagicKeyword[] {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Failed to parse stored keywords:', e);
                return MAGIC_KEYWORDS;
            }
        }
        return MAGIC_KEYWORDS;
    }

    /**
     * 根据ID（term）获取关键词
     */
    static getById(term: string): MagicKeyword | undefined {
        const keywords = this.getAll();
        return keywords.find(k => k.term === term);
    }

    /**
     * 创建新关键词
     */
    static create(keyword: MagicKeyword): MagicKeyword {
        const keywords = this.getAll();
        
        // 检查是否已存在
        if (keywords.find(k => k.term === keyword.term)) {
            throw new Error(`关键词 "${keyword.term}" 已存在`);
        }

        keywords.push(keyword);
        this.save(keywords);
        return keyword;
    }

    /**
     * 更新关键词
     */
    static update(term: string, updates: Partial<MagicKeyword>): MagicKeyword {
        const keywords = this.getAll();
        const index = keywords.findIndex(k => k.term === term);
        
        if (index === -1) {
            throw new Error(`关键词 "${term}" 不存在`);
        }

        // 如果更新了term，需要检查新term是否已存在
        if (updates.term && updates.term !== term) {
            if (keywords.find(k => k.term === updates.term && k.term !== term)) {
                throw new Error(`关键词 "${updates.term}" 已存在`);
            }
        }

        keywords[index] = { ...keywords[index], ...updates };
        this.save(keywords);
        return keywords[index];
    }

    /**
     * 删除关键词
     */
    static delete(term: string): boolean {
        const keywords = this.getAll();
        const filtered = keywords.filter(k => k.term !== term);
        
        if (filtered.length === keywords.length) {
            return false; // 未找到
        }

        this.save(filtered);
        return true;
    }

    /**
     * 批量删除
     */
    static deleteBatch(terms: string[]): number {
        const keywords = this.getAll();
        const filtered = keywords.filter(k => !terms.includes(k.term));
        const deletedCount = keywords.length - filtered.length;
        
        if (deletedCount > 0) {
            this.save(filtered);
        }
        
        return deletedCount;
    }

    /**
     * 保存到localStorage
     */
    private static save(keywords: MagicKeyword[]): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(keywords, null, 2));
        } catch (e) {
            console.error('Failed to save keywords:', e);
            throw new Error('保存失败：存储空间可能不足');
        }
    }

    /**
     * 导出为JSON
     */
    static exportJSON(): string {
        const keywords = this.getAll();
        return JSON.stringify(keywords, null, 2);
    }

    /**
     * 导出为CSV（修复中文乱码，使用UTF-8 BOM）
     */
    static exportCSV(): string {
        const keywords = this.getAll();
        const headers = ['term', 'category', 'depth', 'description', 'examples', 'related', 'cognitiveImpact', 'crossDomains'];
        
        const rows = keywords.map(k => [
            k.term,
            k.category,
            k.depth,
            k.description.replace(/"/g, '""'), // 转义引号
            k.examples.join('; '),
            k.related.join('; '),
            k.cognitiveImpact,
            k.crossDomains.join('; ')
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        // 添加UTF-8 BOM以解决中文乱码问题
        return '\uFEFF' + csvContent;
    }

    /**
     * 导出为Markdown
     */
    static exportMarkdown(): string {
        const keywords = this.getAll();
        
        let md = '# 魔法关键词列表\n\n';
        md += `共 ${keywords.length} 个关键词\n\n`;
        md += '---\n\n';

        keywords.forEach((keyword, index) => {
            md += `## ${index + 1}. ${keyword.term}\n\n`;
            md += `- **分类**: ${CATEGORY_LABELS[keyword.category] || keyword.category}\n`;
            md += `- **深度**: ${DEPTH_LABELS[keyword.depth] || keyword.depth}\n`;
            md += `- **描述**: ${keyword.description}\n`;
            
            if (keyword.cognitiveImpact) {
                md += `- **认知影响**: ${keyword.cognitiveImpact}\n`;
            }
            
            if (keyword.examples.length > 0) {
                md += `- **示例**:\n`;
                keyword.examples.forEach(ex => {
                    md += `  - ${ex}\n`;
                });
            }
            
            if (keyword.related.length > 0) {
                md += `- **相关词**: ${keyword.related.join(', ')}\n`;
            }
            
            if (keyword.crossDomains.length > 0) {
                md += `- **跨领域应用**: ${keyword.crossDomains.join(', ')}\n`;
            }
            
            md += '\n---\n\n';
        });

        return md;
    }

    /**
     * 导出为Excel（使用CSV格式，但文件扩展名为.xlsx，实际为UTF-8 CSV）
     * 注意：这是简化实现，真正的Excel需要xlsx库
     */
    static exportExcel(): string {
        // 返回CSV格式，但会在下载时使用.xlsx扩展名
        // 实际Excel格式需要使用xlsx库，这里提供CSV格式作为替代
        return this.exportCSV();
    }

    /**
     * 导入JSON数据
     */
    static importJSON(jsonString: string, options: { merge?: boolean; overwrite?: boolean } = {}): {
        success: number;
        failed: number;
        errors: string[];
    } {
        let keywords = options.merge ? this.getAll() : [];
        const errors: string[] = [];
        let success = 0;
        let failed = 0;

        try {
            const imported = JSON.parse(jsonString);
            
            if (!Array.isArray(imported)) {
                throw new Error('导入的数据必须是数组格式');
            }

            imported.forEach((item, index) => {
                try {
                    // 验证数据格式
                    if (!this.validateKeyword(item)) {
                        throw new Error('数据格式不正确');
                    }

                    const existingIndex = keywords.findIndex(k => k.term === item.term);
                    
                    if (existingIndex >= 0) {
                        if (options.overwrite) {
                            keywords[existingIndex] = item;
                            success++;
                        } else {
                            // 跳过已存在的
                            errors.push(`第${index + 1}行：关键词 "${item.term}" 已存在，已跳过`);
                        }
                    } else {
                        keywords.push(item);
                        success++;
                    }
                } catch (e: any) {
                    failed++;
                    errors.push(`第${index + 1}行：${e.message || '未知错误'}`);
                }
            });

            this.save(keywords);
        } catch (e: any) {
            throw new Error(`导入失败：${e.message}`);
        }

        return { success, failed, errors };
    }

    /**
     * 导入CSV数据（支持UTF-8 BOM）
     */
    static importCSV(csvString: string, options: { merge?: boolean; overwrite?: boolean } = {}): {
        success: number;
        failed: number;
        errors: string[];
    } {
        // 移除UTF-8 BOM（如果存在）
        let content = csvString;
        if (content.charCodeAt(0) === 0xFEFF) {
            content = content.slice(1);
        }

        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
            throw new Error('CSV文件至少需要包含标题行和一行数据');
        }

        const headers = this.parseCSVLine(lines[0]);
        const errors: string[] = [];
        let success = 0;
        let failed = 0;
        let keywords = options.merge ? this.getAll() : [];

        for (let i = 1; i < lines.length; i++) {
            try {
                const values = this.parseCSVLine(lines[i]);
                const keyword: any = {};

                headers.forEach((header, index) => {
                    const value = values[index] || '';
                    if (header === 'examples' || header === 'related' || header === 'crossDomains') {
                        keyword[header] = value ? value.split(';').map((s: string) => s.trim()).filter(Boolean) : [];
                    } else {
                        keyword[header] = value;
                    }
                });

                if (!this.validateKeyword(keyword)) {
                    throw new Error('数据格式不正确');
                }

                const existingIndex = keywords.findIndex(k => k.term === keyword.term);
                
                if (existingIndex >= 0) {
                    if (options.overwrite) {
                        keywords[existingIndex] = keyword;
                        success++;
                    } else {
                        errors.push(`第${i + 1}行：关键词 "${keyword.term}" 已存在，已跳过`);
                    }
                } else {
                    keywords.push(keyword);
                    success++;
                }
            } catch (e: any) {
                failed++;
                errors.push(`第${i + 1}行：${e.message || '未知错误'}`);
            }
        }

        this.save(keywords);
        return { success, failed, errors };
    }

    /**
     * 导入Markdown数据
     */
    static importMarkdown(mdString: string, options: { merge?: boolean; overwrite?: boolean } = {}): {
        success: number;
        failed: number;
        errors: string[];
    } {
        const errors: string[] = [];
        let success = 0;
        let failed = 0;
        let keywords = options.merge ? this.getAll() : [];

        // 按 ## 分割关键词块
        const sections = mdString.split(/^##\s+/m).filter(s => s.trim());
        
        sections.forEach((section, sectionIndex) => {
            try {
                const lines = section.split('\n').map(l => l.trim()).filter(l => l);
                if (lines.length === 0) return;

                // 提取关键词名称（第一行，可能包含序号）
                const firstLine = lines[0];
                const termMatch = firstLine.match(/^\d+\.\s*(.+)$/) || firstLine.match(/^(.+)$/);
                if (!termMatch) {
                    throw new Error('无法解析关键词名称');
                }
                const term = termMatch[1].trim();

                const keyword: any = {
                    term,
                    category: 'core-catalysts',
                    depth: 'foundational',
                    description: '',
                    examples: [],
                    related: [],
                    cognitiveImpact: '',
                    crossDomains: []
                };

                // 解析其他字段
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i];
                    
                    // 跳过分隔线
                    if (line.startsWith('---')) continue;

                    // 解析分类
                    const categoryMatch = line.match(/^\*\*分类\*\*:\s*(.+)$/);
                    if (categoryMatch) {
                        // 需要将中文分类名转换为英文key
                        const categoryLabel = categoryMatch[1].trim();
                        const categoryKey = Object.entries(CATEGORY_LABELS).find(
                            ([_, label]) => label === categoryLabel
                        )?.[0];
                        if (categoryKey) {
                            keyword.category = categoryKey as Category;
                        }
                        continue;
                    }

                    // 解析深度
                    const depthMatch = line.match(/^\*\*深度\*\*:\s*(.+)$/);
                    if (depthMatch) {
                        const depthLabel = depthMatch[1].trim();
                        const depthKey = Object.entries(DEPTH_LABELS).find(
                            ([_, label]) => label === depthLabel
                        )?.[0];
                        if (depthKey) {
                            keyword.depth = depthKey as Depth;
                        }
                        continue;
                    }

                    // 解析描述
                    const descMatch = line.match(/^\*\*描述\*\*:\s*(.+)$/);
                    if (descMatch) {
                        keyword.description = descMatch[1].trim();
                        continue;
                    }

                    // 解析认知影响
                    const impactMatch = line.match(/^\*\*认知影响\*\*:\s*(.+)$/);
                    if (impactMatch) {
                        keyword.cognitiveImpact = impactMatch[1].trim();
                        continue;
                    }

                    // 解析示例（列表格式）
                    if (line.startsWith('- **示例**:')) {
                        i++;
                        while (i < lines.length && lines[i].startsWith('  - ')) {
                            keyword.examples.push(lines[i].replace(/^  - /, '').trim());
                            i++;
                        }
                        i--; // 回退一步，因为外层循环会+1
                        continue;
                    }

                    // 解析相关词
                    const relatedMatch = line.match(/^\*\*相关词\*\*:\s*(.+)$/);
                    if (relatedMatch) {
                        keyword.related = relatedMatch[1].split(',').map(s => s.trim()).filter(Boolean);
                        continue;
                    }

                    // 解析跨领域应用
                    const domainMatch = line.match(/^\*\*跨领域应用\*\*:\s*(.+)$/);
                    if (domainMatch) {
                        keyword.crossDomains = domainMatch[1].split(',').map(s => s.trim()).filter(Boolean);
                        continue;
                    }
                }

                // 验证必填字段
                if (!keyword.term || !keyword.description) {
                    throw new Error('缺少必填字段（关键词名称或描述）');
                }

                if (!this.validateKeyword(keyword)) {
                    throw new Error('数据格式不正确');
                }

                const existingIndex = keywords.findIndex(k => k.term === keyword.term);
                
                if (existingIndex >= 0) {
                    if (options.overwrite) {
                        keywords[existingIndex] = keyword;
                        success++;
                    } else {
                        errors.push(`第${sectionIndex + 1}个关键词：关键词 "${keyword.term}" 已存在，已跳过`);
                    }
                } else {
                    keywords.push(keyword);
                    success++;
                }
            } catch (e: any) {
                failed++;
                errors.push(`第${sectionIndex + 1}个关键词：${e.message || '未知错误'}`);
            }
        });

        this.save(keywords);
        return { success, failed, errors };
    }

    /**
     * 验证关键词数据格式
     */
    private static validateKeyword(keyword: any): keyword is MagicKeyword {
        return (
            typeof keyword.term === 'string' &&
            typeof keyword.category === 'string' &&
            typeof keyword.depth === 'string' &&
            typeof keyword.description === 'string' &&
            typeof keyword.cognitiveImpact === 'string' &&
            Array.isArray(keyword.examples) &&
            Array.isArray(keyword.related) &&
            Array.isArray(keyword.crossDomains)
        );
    }

    /**
     * 解析CSV行（处理引号内的逗号）
     */
    private static parseCSVLine(line: string): string[] {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // 转义的引号
                    current += '"';
                    i++; // 跳过下一个引号
                } else {
                    // 切换引号状态
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                // 字段分隔符
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim()); // 最后一个字段
        return result;
    }

    /**
     * 重置为默认数据
     */
    static resetToDefault(): void {
        localStorage.removeItem(STORAGE_KEY);
    }

    /**
     * 获取统计数据
     */
    static getStatistics(): {
        total: number;
        byCategory: Record<Category, number>;
        byDepth: Record<Depth, number>;
        avgExamples: number;
        avgRelated: number;
        avgCrossDomains: number;
    } {
        const keywords = this.getAll();
        const byCategory: Record<string, number> = {};
        const byDepth: Record<string, number> = {};
        let totalExamples = 0;
        let totalRelated = 0;
        let totalCrossDomains = 0;

        keywords.forEach(k => {
            byCategory[k.category] = (byCategory[k.category] || 0) + 1;
            byDepth[k.depth] = (byDepth[k.depth] || 0) + 1;
            totalExamples += k.examples.length;
            totalRelated += k.related.length;
            totalCrossDomains += k.crossDomains.length;
        });

        return {
            total: keywords.length,
            byCategory: byCategory as Record<Category, number>,
            byDepth: byDepth as Record<Depth, number>,
            avgExamples: keywords.length > 0 ? totalExamples / keywords.length : 0,
            avgRelated: keywords.length > 0 ? totalRelated / keywords.length : 0,
            avgCrossDomains: keywords.length > 0 ? totalCrossDomains / keywords.length : 0
        };
    }
}

