
import { MagicKeyword, Category, Depth } from './types';

export const MAGIC_KEYWORDS: MagicKeyword[] = [
    // === 核心催化器 (Core Catalysts) ===
    {
        term: "第一性原理",
        category: "core-catalysts",
        depth: "foundational",
        description: "回归事物本质，从基本假设重新构建理解，跳出既有框架限制，产生根本性创新洞察。",
        examples: ["马斯克思维", "物理学推演", "商业模式创新", "问题重定义"],
        related: ["本质还原", "假设验证", "逻辑重构", "创新突破"],
        cognitiveImpact: "激活深度推理和创新思维模式",
        crossDomains: ["科学", "商业", "哲学", "工程"]
    },
    {
        term: "元认知",
        category: "meta-thinking", 
        depth: "expert",
        description: "对思维过程的思维，监控和调节认知活动，实现思维的自我优化和策略调整。",
        examples: ["学习如何学习", "思维模式识别", "认知偏见纠正", "策略元分析"],
        related: ["自我反思", "认知监控", "策略选择", "思维优化"],
        cognitiveImpact: "开启高阶认知控制和自我调节能力",
        crossDomains: ["教育", "心理学", "管理", "人工智能"]
    },
    {
        term: "涌现",
        category: "breakthrough-innovation",
        depth: "visionary", 
        description: "系统整体展现出组成部分所不具备的新性质，复杂性科学的核心概念，解释创新和突破的本质机制。",
        examples: ["群体智慧", "创新生态", "技术奇点", "意识产生"],
        related: ["复杂系统", "非线性", "自组织", "临界点"],
        cognitiveImpact: "触发系统性思维和创新预见能力",
        crossDomains: ["复杂系统", "生物学", "社会学", "技术创新"]
    },

    // === 技术精通 (Technical Mastery) ===
    {
        term: "领域驱动设计",
        category: "technical-mastery",
        depth: "expert",
        description: "以业务领域为核心的软件设计方法，通过深入理解领域建立精确模型，实现技术与业务的深度融合。",
        examples: ["限界上下文", "通用语言", "聚合设计", "领域事件"],
        related: ["业务建模", "架构设计", "团队协作", "知识管理"],
        cognitiveImpact: "建立领域专家思维和系统性设计能力",
        crossDomains: ["软件工程", "业务分析", "组织设计", "知识工程"]
    },
    {
        term: "TRIZ",
        category: "breakthrough-innovation",
        depth: "expert",
        description: "发明问题解决理论，通过识别和解决技术矛盾实现创新突破，将创新过程系统化和可复制化。",
        examples: ["40个发明原理", "矛盾矩阵", "进化趋势", "功能分析"],
        related: ["创新方法", "矛盾解决", "技术预测", "专利分析"],
        cognitiveImpact: "激活系统性创新思维和矛盾解决能力",
        crossDomains: ["工程创新", "产品开发", "科学研究", "商业策略"]
    },
    {
        term: "反应式编程",
        category: "technical-mastery",
        depth: "advanced",
        description: "以数据流和变化传播为核心的编程范式，优雅处理异步和并发，构建高响应性系统。",
        examples: ["观察者模式", "函数式响应", "事件流", "背压控制"],
        related: ["异步处理", "函数式编程", "事件驱动", "声明式编程"],
        cognitiveImpact: "培养异步思维和事件驱动设计能力",
        crossDomains: ["编程范式", "系统架构", "用户体验", "实时系统"]
    },

    // === 创意融合 (Creative Fusion) ===
    {
        term: "设计思维",
        category: "creative-fusion",
        depth: "foundational",
        description: "以人为中心的创新方法，通过共情、定义、构思、原型和测试的迭代过程解决复杂问题。",
        examples: ["用户研究", "头脑风暴", "快速原型", "迭代测试"],
        related: ["人本设计", "创新流程", "用户体验", "产品开发"],
        cognitiveImpact: "建立以人为本的创新思维和迭代改进能力",
        crossDomains: ["产品设计", "服务创新", "教育", "组织变革"]
    },
    {
        term: "侘寂美学",
        category: "creative-fusion",
        depth: "advanced",
        description: "日本美学概念，欣赏不完美、无常和不完整之美，在缺憾中发现深层美感和智慧。",
        examples: ["枯山水", "茶道精神", "极简设计", "自然老化"],
        related: ["不完美之美", "东方哲学", "禅意设计", "情感设计"],
        cognitiveImpact: "培养包容缺憾的审美观和深层洞察力",
        crossDomains: ["美学哲学", "产品设计", "建筑", "生活方式"]
    },

    // === 系统编排 (System Orchestration) ===
    {
        term: "Conway定律",
        category: "system-orchestration",
        depth: "expert",
        description: "组织架构决定技术架构，系统设计会不可避免地复制组织的沟通结构，技术与组织的深层耦合规律。",
        examples: ["微服务对应小团队", "API设计反映组织边界", "技术债务与组织问题", "架构演进"],
        related: ["组织设计", "系统架构", "团队协作", "技术管理"],
        cognitiveImpact: "理解技术与组织的系统性关联",
        crossDomains: ["软件架构", "组织管理", "系统思维", "技术战略"]
    },
    {
        term: "CAP定理",
        category: "system-orchestration", 
        depth: "expert",
        description: "分布式系统的基本定律，一致性、可用性和分区容错性不可兼得，体现系统设计的根本权衡。",
        examples: ["最终一致性", "分布式架构", "微服务权衡", "数据库选择"],
        related: ["分布式系统", "系统权衡", "架构决策", "性能优化"],
        cognitiveImpact: "建立系统权衡思维和分布式设计能力",
        crossDomains: ["分布式系统", "数据库", "系统架构", "性能工程"]
    },
    {
        term: "混沌工程",
        category: "system-orchestration",
        depth: "expert", 
        description: "主动在生产环境中引入故障，测试系统的弹性和恢复能力，从失败中学习和改进。",
        examples: ["Netflix Chaos Monkey", "故障注入", "弹性测试", "系统韧性"],
        related: ["系统弹性", "故障恢复", "可靠性工程", "持续改进"],
        cognitiveImpact: "培养面向失败的设计思维和系统韧性思考",
        crossDomains: ["可靠性工程", "系统运维", "风险管理", "组织韧性"]
    },

    // === 认知演化 (Cognitive Evolution) ===
    {
        term: "双环学习",
        category: "cognitive-evolution",
        depth: "advanced",
        description: "不仅学习如何解决问题，更要质疑问题本身和解决问题的假设，实现深层次的认知重构。",
        examples: ["假设质疑", "范式转换", "深层反思", "价值观挑战"],
        related: ["组织学习", "心智模式", "范式转移", "变革管理"],
        cognitiveImpact: "开启深层学习和认知重构能力",
        crossDomains: ["组织学习", "个人发展", "变革管理", "教育创新"]
    },
    {
        term: "刻意练习",
        category: "cognitive-evolution",
        depth: "foundational",
        description: "有目的、有反馈、持续挑战舒适区的练习方法，通过精确努力实现专业技能的快速提升。",
        examples: ["专业技能训练", "反馈循环", "难度递增", "专注练习"],
        related: ["技能习得", "专业发展", "学习方法", "持续改进"],
        cognitiveImpact: "建立高效学习和技能提升机制",
        crossDomains: ["技能发展", "教育培训", "体育训练", "艺术训练"]
    },
    {
        term: "心流",
        category: "cognitive-evolution",
        depth: "advanced",
        description: "完全沉浸在活动中的最佳体验状态，挑战与技能完美匹配，实现最高效的认知表现。",
        examples: ["专注工作", "创意状态", "运动表现", "学习沉浸"],
        related: ["最佳体验", "专注力", "内在激励", "技能发挥"],
        cognitiveImpact: "激活最佳认知表现和深度专注能力",
        crossDomains: ["积极心理学", "绩效优化", "创意工作", "学习效率"]
    },

    // === 元思维 (Meta Thinking) ===
    {
        term: "MECE原则",
        category: "meta-thinking",
        depth: "foundational",
        description: "相互独立、完全穷尽的分析框架，确保思考的系统性和完整性，避免遗漏和重复。",
        examples: ["问题分析", "战略咨询", "决策框架", "分类体系"],
        related: ["结构化思维", "逻辑分析", "系统性思考", "决策支持"],
        cognitiveImpact: "建立系统性分析和结构化思维能力",
        crossDomains: ["战略咨询", "问题解决", "决策科学", "系统分析"]
    },
    {
        term: "奥卡姆剃刀",
        category: "meta-thinking",
        depth: "foundational",
        description: "如无必要勿增实体，在多种解释中选择假设最少的，体现简洁性和优雅性的认知原则。",
        examples: ["科学假设", "设计简化", "问题诊断", "决策原则"],
        related: ["简洁性原则", "逻辑推理", "科学方法", "设计哲学"],
        cognitiveImpact: "培养简洁思维和本质洞察能力",
        crossDomains: ["科学研究", "设计思维", "哲学", "决策理论"]
    },
    {
        term: "黑天鹅",
        category: "meta-thinking",
        depth: "advanced",
        description: "极端影响、高度不可预测、事后可解释的罕见事件，挑战线性思维和传统预测方法。",
        examples: ["技术突破", "金融危机", "疫情冲击", "颠覆性创新"],
        related: ["不确定性", "复杂系统", "风险管理", "反脆弱性"],
        cognitiveImpact: "建立非线性思维和不确定性应对能力",
        crossDomains: ["风险管理", "战略规划", "复杂系统", "创新管理"]
    },

    // === 提示基础 (Prompt Foundations) ===
    {
        term: "提示模板",
        category: "prompt-foundations",
        depth: "foundational",
        description: "预定义的结构化提示框架，通过标准化格式和可重用模式，提高提示设计的一致性和效率。",
        examples: ["角色+任务+格式模板", "问答模板", "分析模板", "创作模板"],
        related: ["结构化设计", "模式复用", "标准化", "效率提升"],
        cognitiveImpact: "建立结构化思维和模板化设计能力",
        crossDomains: ["软件工程", "用户体验", "内容创作", "知识管理"]
    },
    {
        term: "少样本学习 (Few-Shot)",
        category: "prompt-foundations",
        depth: "advanced",
        description: "在提示中提供少量示例（Input-Output对），帮助模型快速理解任务模式和输出格式，无需微调。",
        examples: ["上下文示例", "模式匹配", "类比学习", "快速适应"],
        related: ["上下文学习", "模式识别", "归纳推理", "效率优化"],
        cognitiveImpact: "利用类比推理快速建立任务上下文",
        crossDomains: ["机器学习", "教育学", "模式识别", "认知心理学"]
    },
    {
        term: "角色沉浸 (Role Prompting)",
        category: "prompt-foundations",
        depth: "foundational",
        description: "为AI设定特定身份或专家角色，激活相关的知识图谱和语言风格，显著提升特定领域任务的专业度。",
        examples: ["你是一位资深架构师", "扮演苏格拉底", "作为Python专家", "模拟招聘经理"],
        related: ["上下文启动", "风格对齐", "领域适应", "身份模拟"],
        cognitiveImpact: "激活特定领域的潜隐知识与思维模式",
        crossDomains: ["角色扮演", "专家系统", "社会心理学", "职业模拟"]
    },
    {
        term: "分隔符 (Delimiters)",
        category: "prompt-foundations",
        depth: "foundational",
        description: "使用特殊符号明确区分指令、上下文和输入数据，防止提示注入并帮助模型更准确地解析复杂结构。",
        examples: ["'''三重引号'''", "<tag>XML标签</tag>", "---分割线---", "Markdown区块"],
        related: ["结构化输入", "指令隔离", "解析增强", "安全防护"],
        cognitiveImpact: "建立清晰的信息边界与层级结构",
        crossDomains: ["语法解析", "信息架构", "符号学", "数据清洗"]
    },

    // === 提示结构 (Prompt Structuring) ===
    {
        term: "思维链 (CoT)",
        category: "prompt-structuring",
        depth: "advanced",
        description: "引导模型展示中间推理步骤，显著提升复杂逻辑、数学和常识推理任务的准确性。",
        examples: ["逐步推导", "Let's think step by step", "逻辑展开", "中间过程"],
        related: ["推理增强", "可解释性", "逻辑验证", "深度思考"],
        cognitiveImpact: "激活模型的逐步推理和逻辑自洽能力",
        crossDomains: ["人工智能", "逻辑学", "教育心理学", "认知科学"]
    },
    {
        term: "思维树 (ToT)",
        category: "prompt-structuring",
        depth: "expert",
        description: "Tree of Thoughts。允许模型在推理过程中探索多种可能路径，通过自我评估和回溯寻找最优解。",
        examples: ["多路径探索", "方案评估打分", "路径剪枝", "广度优先搜索"],
        related: ["决策树", "探索性搜索", "规划算法", "复杂推理"],
        cognitiveImpact: "开启非线性探索与多维决策能力",
        crossDomains: ["搜索算法", "决策科学", "博弈论", "规划与导航"]
    },
    {
        term: "ReAct框架",
        category: "prompt-structuring",
        depth: "expert",
        description: "Reasoning + Acting。结合推理思考与行动执行，使模型能够动态制定计划、调用工具并根据反馈调整策略。",
        examples: ["思考-行动-观察循环", "工具调用", "动态规划", "外部交互"],
        related: ["代理智能", "工具增强", "闭环控制", "动态适应"],
        cognitiveImpact: "建立思考与行动的动态交互闭环",
        crossDomains: ["自主Agent", "控制理论", "机器人学", "交互设计"]
    },
    {
        term: "自反思 (Reflexion)",
        category: "prompt-structuring",
        depth: "advanced",
        description: "引导模型评估自己的输出，识别错误或不足，并生成改进后的版本，模拟人类的自我纠错和迭代优化过程。",
        examples: ["自我批判", "错误修正", "多轮迭代", "输出优化"],
        related: ["元认知监控", "迭代优化", "质量控制", "自我修正"],
        cognitiveImpact: "激活自我监控与持续优化的元认知回路",
        crossDomains: ["教育心理学", "质量管理", "控制论", "写作修订"]
    },

    // === 提示增强 (Prompt Augmentation) ===
    {
        term: "RAG (检索增强生成)",
        category: "prompt-augmentation",
        depth: "expert",
        description: "Retrieval-Augmented Generation。在生成回答前先从外部知识库检索相关信息，解决模型知识过时和幻觉问题。",
        examples: ["知识库问答", "文档分析", "事实核查", "上下文注入"],
        related: ["知识检索", "语义搜索", "事实增强", "外挂大脑"],
        cognitiveImpact: "扩展工作记忆与实时知识获取能力",
        crossDomains: ["信息检索", "数据库技术", "知识管理", "图书馆学"]
    },
    {
        term: "函数调用 (Function Calling)",
        category: "prompt-augmentation",
        depth: "advanced",
        description: "将自然语言转化为可执行的API调用或结构化数据，连接大模型与外部数字世界，实现真正的'行动力'。",
        examples: ["API集成", "数据提取", "自动化操作", "结构化输出"],
        related: ["工具使用", "API网关", "意图识别", "互操作性"],
        cognitiveImpact: "赋予认知系统操作外部世界的肢体",
        crossDomains: ["软件工程", "接口设计", "自动化", "人机交互"]
    },

    // === 提示运营 (Prompt Operations) ===
    {
        term: "提示链 (Prompt Chaining)",
        category: "prompt-operations",
        depth: "advanced",
        description: "将复杂任务分解为一系列相互依赖的子提示，前一个输出作为后一个输入，构建流水线式的认知处理工厂。",
        examples: ["任务分解流水线", "Map-Reduce模式", "多阶段处理", "模块化设计"],
        related: ["工作流编排", "模块化", "流水线工程", "分治算法"],
        cognitiveImpact: "建立模块化与流程化的系统工程思维",
        crossDomains: ["系统架构", "工业工程", "流程管理", "算法设计"]
    },
    {
        term: "LLM裁判 (LLM-as-a-Judge)",
        category: "prompt-operations",
        depth: "expert",
        description: "使用强模型作为裁判，评估弱模型或不同提示版本的输出质量，实现自动化、可扩展的评估体系。",
        examples: ["自动化评估", "A/B测试打分", "质量监控", "合成数据过滤"],
        related: ["自动评估", "质量保证", "反馈循环", "模型蒸馏"],
        cognitiveImpact: "建立自动化的价值判断与质量反馈机制",
        crossDomains: ["测试工程", "评价体系", "同行评审", "司法裁决"]
    },

    // === 提示优化 (Prompt Optimization) ===
    {
        term: "约束生成 (Constrained Generation)",
        category: "prompt-optimization",
        depth: "advanced",
        description: "强制模型按照特定的语法（如JSON Schema、正则表达式）输出，确保结果可被机器稳定解析和使用。",
        examples: ["JSON模式", "格式强制", "类型约束", "结构化输出"],
        related: ["结构化数据", "类型系统", "输出控制", "协议对齐"],
        cognitiveImpact: "规范表达形式以适配确定性系统",
        crossDomains: ["编程语言理论", "数据交换", "协议设计", "形式逻辑"]
    },
    {
        term: "提示压缩 (Prompt Compression)",
        category: "prompt-optimization",
        depth: "expert",
        description: "在保留核心语义的前提下减少token数量，降低成本并扩大有效上下文窗口，提升长文档处理效率。",
        examples: ["软提示(Soft Prompts)", "关键信息提取", "语义编码", "Token优化"],
        related: ["信息压缩", "效率优化", "成本控制", "注意力机制"],
        cognitiveImpact: "提炼核心信息熵，优化认知带宽",
        crossDomains: ["信息论", "数据压缩", "通信工程", "摘要算法"]
    },

    // === 提示治理 (Prompt Governance) ===
    {
        term: "提示注入防御",
        category: "prompt-governance",
        depth: "expert",
        description: "识别和防御恶意用户试图通过操纵输入来改变模型预设行为或窃取系统提示的攻击。",
        examples: ["指令忽略防御", "输入清洗", "红队测试", "安全沙箱"],
        related: ["AI安全", "对抗性攻击", "边界防御", "系统完整性"],
        cognitiveImpact: "建立对抗性思维与系统防御意识",
        crossDomains: ["网络安全", "社会工程学", "攻防演练", "风险管理"]
    },
    {
        term: "幻觉检测",
        category: "prompt-governance",
        depth: "advanced",
        description: "识别模型生成的听起来合理但实际上错误或无根据的信息，通过交叉验证或置信度评估进行管控。",
        examples: ["事实核查", "源引用验证", "不确定性量化", "一致性检查"],
        related: ["事实对齐", "可靠性工程", "置信度评估", "错误分析"],
        cognitiveImpact: "培养批判性思维与真理验证能力",
        crossDomains: ["新闻学", "司法取证", "认识论", "审计学"]
    },

    // === 其他重要概念 ===
    {
        term: "反向推理工程",
        category: "meta-thinking",
        depth: "expert",
        description: "从目标结果逆向分析必要条件和实现路径，揭示隐含的逻辑结构和因果关系。",
        examples: ["逆向分析", "条件推断", "路径重构", "因果溯源"],
        related: ["逆向工程", "因果推理", "逻辑分析", "问题解决"],
        cognitiveImpact: "建立逆向分析和因果推理能力",
        crossDomains: ["逻辑学", "系统工程", "诊断学", "策略规划"]
    },
    {
        term: "认知负载优化",
        category: "cognitive-evolution",
        depth: "expert",
        description: "合理分配和管理认知资源，优化信息处理效率，避免认知过载和资源浪费。",
        examples: ["资源分配", "负载平衡", "效率优化", "容量管理"],
        related: ["认知负载理论", "注意力管理", "信息处理", "认知效率"],
        cognitiveImpact: "提升认知效率和信息处理能力",
        crossDomains: ["认知心理学", "人机交互", "学习设计", "效率科学"]
    }
];

export const CATEGORY_LABELS: Record<Category, string> = {
    'core-catalysts': '🧠 核心催化器',
    'technical-mastery': '⚡ 技术精通',
    'creative-fusion': '🎨 创意融合',
    'system-orchestration': '🏗️ 系统编排',
    'cognitive-evolution': '🔄 认知演化',
    'meta-thinking': '🤔 元思维',
    'philosophical-methodology': '🌀 哲学方法论',
    'breakthrough-innovation': '💡 突破创新',
    'prompt-foundations': '🧱 提示基础',
    'prompt-structuring': '🧩 提示结构',
    'prompt-optimization': '📈 提示优化',
    'prompt-operations': '🕸️ 提示运营',
    'prompt-augmentation': '🧠 提示增强',
    'prompt-governance': '🛡️ 提示治理'
};

export const DEPTH_LABELS: Record<Depth, string> = {
    'foundational': '🏗️ 基础构建',
    'advanced': '🚀 高级进阶',
    'expert': '🎯 专家级',
    'visionary': '🌌 远见级'
};
