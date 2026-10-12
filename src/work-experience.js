// Professional history supplied by the owner: résumé v5 plus the current-role
// update and explicit confirmation of the 2026-03-23 start date.
// The research entry is labelled separately; no employer is inferred for it.
export const experience = [
  {
    id: 'huayan', start: '2026-03-23', end: null, type: 'current',
    date: { zh: '2026.03.23 — 至今', en: 'Mar 23, 2026 — Present' },
    organization: { zh: '广东华沿机器人股份有限公司', en: '广东华沿机器人股份有限公司' },
    role: { zh: 'AI 应用工程师', en: 'AI Application Engineer' },
    team: { zh: '具身智能 AI 部', en: 'Embodied Intelligence AI Department' },
    label: { zh: '在职', en: 'Current role' },
    summary: { zh: '围绕具身智能开展算法研究与仿真实践。', en: 'Algorithm research and simulation for embodied intelligence.' },
    bullets: {
      zh: ['负责具身智能方向的 VLA、WAM 算法研究。', '负责具身智能相关仿真工作。'],
      en: ['Research VLA and WAM algorithms for embodied intelligence.', 'Work on simulation for embodied intelligence.']
    },
    tags: { zh: ['具身智能', 'VLA', 'WAM', '仿真'], en: ['Embodied AI', 'VLA', 'WAM', 'Simulation'] }
  },
  {
    id: 'llm-research', start: '2025-06', end: '2025-09', type: 'research',
    date: { zh: '2025.06 — 2025.09', en: 'Jun — Sep 2025' },
    organization: null,
    role: { zh: '大模型推理与评测', en: 'LLM Inference & Evaluation' },
    team: { zh: '科研经历 · 强化学习', en: 'Research experience · Reinforcement learning' },
    label: { zh: '科研', en: 'Research' },
    summary: { zh: '搭建模型推理环境，以统一评测和推理过程分析支持研究。', en: 'Model-serving environments, consistent benchmarks, and inference analysis for research.' },
    bullets: {
      zh: ['负责 Qwen 等大语言模型的本地部署与推理环境搭建，使用 vLLM 提供推理服务。', '构建 Math500 数学推理 benchmark 评测流程，在一致配置下比较多模型 baseline。', '实现 token 级 entropy 统计与推理过程分析工具，用于稳定性评估与调参。'],
      en: ['Set up local deployment and inference environments for Qwen and other LLMs, using vLLM for serving.', 'Build a Math500 reasoning benchmark to compare model baselines under consistent configurations.', 'Implement token-level entropy statistics and inference-analysis tools for stability evaluation and tuning.']
    },
    tags: { zh: ['vLLM', 'Qwen', 'Math500', '推理分析'], en: ['vLLM', 'Qwen', 'Math500', 'Inference analysis'] }
  },
  {
    id: 'haoyun', start: '2023-11', end: '2024-04', type: 'internship',
    date: { zh: '2023.11 — 2024.04', en: 'Nov 2023 — Apr 2024' },
    organization: { zh: '浩云科技股份有限公司', en: '浩云科技股份有限公司' },
    role: { zh: '数字化工程师', en: 'Digitalization Engineer' },
    team: { zh: '实习经历', en: 'Internship' },
    label: { zh: '实习', en: 'Internship' },
    summary: { zh: '参与软件产品开发、需求分析与交付测试。', en: 'Software product development, requirements analysis, and delivery testing.' },
    bullets: {
      zh: ['负责软件产品的数字化开发，以及功能与性能测试，保障交付质量与稳定性。', '参与需求分析与多项目开发，推动技术方案匹配客户需求和业务目标。'],
      en: ['Develop software products and perform functional and performance testing to support reliable delivery.', 'Contribute to requirements analysis and multiple projects, aligning technical solutions with customer needs and business goals.']
    },
    tags: { zh: ['软件开发', '需求分析', '功能与性能测试'], en: ['Software development', 'Requirements analysis', 'Product testing'] }
  }
];
