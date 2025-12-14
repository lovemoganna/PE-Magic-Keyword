<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 魔法关键词看板 3.0 - 认知催化系统

一个现代化的知识管理和认知工具平台，帮助用户探索、管理和应用魔法关键词（认知概念），提升思维能力和创新洞察。

## ✨ 核心特性

### 🎯 关键词管理
- **380+ 魔法关键词**：涵盖14个分类，4个深度层级
- **智能搜索**：支持关键词、描述、示例、相关词全文搜索
- **多维筛选**：按分类、深度、收藏状态筛选
- **收藏功能**：标记重要关键词，支持持久化存储

### 🧠 AI 洞察生成
- **智能解构**：使用 Gemini API 生成关键词的深度分析
- **概念融合**：多关键词融合分析，发现概念间的关联
- **知识表格**：自动生成结构化的知识解构表格

### 📊 管理后台
- **CRUD 操作**：创建、编辑、删除关键词
- **批量管理**：支持批量删除和操作
- **数据分析**：统计图表和数据分析看板
- **多视图模式**：表格、网格、列表三种展示方式

### 📥 导入导出
- **多格式支持**：
  - JSON 格式（完整数据结构）
  - CSV 格式（表格格式，支持 Excel）
  - Markdown 格式（文档格式）
- **灵活导入**：支持文件上传或文本粘贴
- **导入选项**：合并模式 / 覆盖模式

### 🎨 用户体验
- **现代设计**：玻璃态设计（Glassmorphism），渐变色彩
- **流畅动画**：Framer Motion 驱动的交互动画
- **深色模式**：支持浅色/深色主题切换
- **响应式布局**：完美适配移动端、平板、桌面
- **快捷键支持**：`/` 聚焦搜索，`Esc` 清除搜索

### 📚 提示工程指南
- 内置提示工程实战指南
- 最佳实践和技巧分享

## 🚀 快速开始

### 环境要求

- **Node.js** >= 16.0.0
- **npm** 或 **yarn**

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd PE-Magic-Keyword
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   
   创建 `.env.local` 文件（可选，用于启用 AI 功能）：
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   > 💡 **提示**：未配置 API 密钥时，应用仍可正常使用，但 AI 洞察功能将被禁用。

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   
   打开浏览器访问：`http://localhost:5173`

## 📖 使用指南

### 基础功能

#### 搜索关键词
- 在搜索框输入关键词、描述或示例内容
- 支持模糊匹配和全文搜索
- 快捷键：按 `/` 快速聚焦搜索框

#### 筛选关键词
- **分类筛选**：选择14个分类之一，或查看收藏的关键词
- **深度筛选**：按4个深度层级筛选（基础构建、高级进阶、专家级、远见级）
- 可组合使用多个筛选条件

#### 查看详情
- 点击关键词卡片查看详细信息
- 包含描述、示例、相关词、跨领域应用等

#### 收藏关键词
- 点击关键词卡片上的 ❤️ 图标收藏/取消收藏
- 收藏状态会自动保存到本地存储

### 概念融合模式

1. 点击"概念融合"按钮进入融合模式
2. 选择至少 2 个关键词
3. 点击"生成融合洞察"查看 AI 分析结果

### 管理后台

#### 访问方式
- 方式一：前台页面右上角点击"管理后台"按钮
- 方式二：直接访问 `/admin` 路径

#### 主要功能

**关键词管理**
- 创建新关键词：点击"新建关键词"按钮
- 编辑关键词：点击编辑按钮修改信息
- 删除关键词：支持单个删除和批量删除

**导入导出**
- 导出数据：支持 JSON、CSV、Markdown 格式
- 导入数据：支持文件上传或文本粘贴
- 导入选项：选择合并模式（保留现有数据）或覆盖模式（替换已存在的关键词）

**数据分析**
- 查看统计图表
- 分析关键词分布
- 了解数据趋势

### 测试数据

项目在 `data/` 目录下提供了测试数据文件，方便测试导入功能：

- `data/prompt.json` - JSON 格式测试数据
- `data/prompt.csv` - CSV 格式测试数据
- `data/prompt.md` - Markdown 格式测试数据

可以直接使用这些文件测试导入功能。

## 🏗️ 项目结构

```
PE-Magic-Keyword/
├── components/          # React 组件
│   ├── admin/          # 管理后台组件
│   ├── KeywordCard.tsx # 关键词卡片
│   ├── InsightModal.tsx # AI 洞察模态框
│   └── PromptGuide.tsx # 提示工程指南
├── pages/              # 页面组件
│   └── AdminDashboard.tsx # 管理后台
├── services/           # 服务层
│   └── keywordService.ts # 关键词数据服务
├── data/               # 数据文件
│   ├── prompt.json     # JSON 测试数据
│   ├── prompt.csv      # CSV 测试数据
│   ├── prompt.md       # Markdown 测试数据
│   └── doc/            # 文档
├── types.ts            # TypeScript 类型定义
├── data.ts             # 关键词数据源
├── App.tsx             # 主应用组件
├── AppRouter.tsx       # 路由配置
├── index.tsx           # 入口文件
└── index.html          # HTML 模板
```

## 🛠️ 技术栈

- **前端框架**：React 19 + TypeScript
- **构建工具**：Vite 6
- **UI 框架**：Tailwind CSS
- **动画库**：Framer Motion
- **路由**：React Router v7
- **图标**：Lucide React
- **AI 集成**：Google Gemini API
- **数据存储**：LocalStorage

## 📦 构建部署

### 开发构建
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### 预览构建
```bash
npm run preview
```

## 🔧 配置说明

### 环境变量

| 变量名 | 说明 | 是否必需 |
|--------|------|----------|
| `VITE_GEMINI_API_KEY` | Gemini API 密钥，用于 AI 洞察功能 | 否 |

### 获取 Gemini API 密钥

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 创建新的 API 密钥
3. 将密钥添加到 `.env.local` 文件

## 📝 数据格式

### JSON 格式

```json
[
  {
    "term": "关键词名称",
    "category": "core-catalysts",
    "depth": "foundational",
    "description": "详细描述",
    "examples": ["示例1", "示例2"],
    "related": ["相关词1", "相关词2"],
    "cognitiveImpact": "认知影响描述",
    "crossDomains": ["领域1", "领域2"]
  }
]
```

### CSV 格式

```csv
term,category,depth,description,examples,related,cognitiveImpact,crossDomains
关键词名称,core-catalysts,foundational,详细描述,"示例1;示例2","相关词1;相关词2",认知影响描述,"领域1;领域2"
```

### Markdown 格式

```markdown
## 1. 关键词名称

- **分类**: 🧠 核心催化器
- **深度**: 🏗️ 基础构建
- **描述**: 详细描述
- **认知影响**: 认知影响描述
- **示例**:
  - 示例1
  - 示例2
- **相关词**: 相关词1, 相关词2
- **跨领域应用**: 领域1, 领域2
```

## 🎯 分类体系

### 分类（14个）

- 🧠 核心催化器 (core-catalysts)
- ⚡ 技术精通 (technical-mastery)
- 🎨 创意融合 (creative-fusion)
- 🏗️ 系统编排 (system-orchestration)
- 🔄 认知演化 (cognitive-evolution)
- 🤔 元思维 (meta-thinking)
- 🌀 哲学方法论 (philosophical-methodology)
- 💡 突破创新 (breakthrough-innovation)
- 🧱 提示基础 (prompt-foundations)
- 🧩 提示结构 (prompt-structuring)
- 📈 提示优化 (prompt-optimization)
- 🕸️ 提示运营 (prompt-operations)
- 🧠 提示增强 (prompt-augmentation)
- 🛡️ 提示治理 (prompt-governance)

### 深度层级（4个）

- 🏗️ 基础构建 (foundational)
- 🚀 高级进阶 (advanced)
- 🎯 专家级 (expert)
- 🌌 远见级 (visionary)

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目采用 MIT 许可证。

## 🔗 相关链接

- [AI Studio 应用](https://ai.studio/apps/drive/1jaoj6u8PhfXM6OHZUQYS2TW9IEw5fjBF)
- [Google AI Studio](https://makersuite.google.com/)

## 💡 使用建议

1. **探索阶段**：使用搜索和筛选功能发现感兴趣的关键词
2. **深入学习**：收藏重要关键词，查看 AI 生成的深度洞察
3. **概念融合**：尝试将多个相关关键词融合，发现新的关联
4. **数据管理**：使用管理后台导入自己的关键词数据
5. **持续学习**：定期查看提示工程指南，提升提示词编写能力

---

**魔法关键词看板 3.0** - 让思维更清晰，让创新更简单 ✨
