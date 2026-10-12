// Curated from public repositories on 2026-10-12. Keep personal contributions
// separate from repository capabilities; employer experience is not supplied yet.
export const projects = [
  {
    id: 'paper-agent', repo: 'paper_agent', title: 'Paper Agent', icon: 'paper', featured: true,
    tags: ['Python', 'LangGraph', 'LangChain', 'Chroma'],
    kind: { en: 'AI agents', zh: 'AI 智能体' },
    description: {
      en: 'A research-paper assistant that connects retrieval, reading, summaries, and citations in one structured workflow.',
      zh: '把论文检索、阅读、总结与引用串成一个完整流程的学术助手。'
    },
    flow: { en: ['Retrieve', 'Read & summarize', 'Verify & cite'], zh: ['检索论文', '阅读与总结', '核对与引用'] },
    details: {
      en: ['LangGraph coordinates routing and paper-related tasks.', 'Short-term context supports follow-up requests; Chroma stores longer-term paper memory.', 'The repository includes citation, PDF-download, and paper-search components.'],
      zh: ['使用 LangGraph 编排路由与论文处理任务。', '短期上下文支持连续追问，Chroma 保存长期论文记忆。', '仓库包含引用生成、PDF 下载和论文检索组件。']
    }
  },
  {
    id: 'etfall', repo: 'etfall', title: 'ETFALL', icon: 'fairness', featured: true,
    tags: ['Python', 'vLLM', 'Detoxify', 'LoRA'],
    kind: { en: 'LLM research', zh: '大模型研究' },
    description: {
      en: 'An experimental toolkit for studying emotional tone and toxicity across languages, and exploring bias mitigation in LLMs.',
      zh: '比较大模型在不同语言中的情绪语气与毒性表现，并探索偏差缓解方法的实验项目。'
    },
    flow: { en: ['Generate', 'Evaluate', 'Mitigate'], zh: ['生成回答', '评估差异', '缓解偏差'] },
    details: {
      en: ['Evaluation scripts cover Qwen and Llama models with multilingual datasets.', 'Detoxify scores toxicity; the repository includes language-comparison plots.', 'Mitigation experiments include prompts, LoRA training, and vector steering. Toxicity is one measurement, rather than a complete measure of emotional fairness.'],
      zh: ['评估脚本覆盖 Qwen、Llama 模型与多语言数据集。', '使用 Detoxify 评估毒性，并提供跨语言对比图表。', '探索提示词、LoRA 训练和向量引导等缓解方法；毒性评分只是测量的一部分，不等同于完整的情绪公平性。']
    }
  },
  {
    id: 'axground3d', repo: 'axground3D', title: 'axground3D', icon: 'simulation',
    tags: ['Python', 'Habitat-Sim', 'UniK3D'],
    kind: { en: 'Collaborative research', zh: '合作研究' },
    description: {
      en: 'A framework for generating auxiliary future states with diffusion models, connecting simulated scenes, 3D reconstruction, and evaluation.',
      zh: '结合模拟场景、三维重建与评估，探索用扩散模型生成辅助未来状态。'
    },
    credit: { en: 'Yicheng Duan & Duo Chen', zh: 'Yicheng Duan 与 Duo Chen' },
    upstream: 'https://github.com/YichengDuan/axground3D'
  },
  {
    id: 'topog', repo: 'topog', title: 'TopoG', icon: 'graph',
    tags: ['Python', 'PyTorch Geometric', 'Habitat-Sim'],
    kind: { en: 'Collaborative research', zh: '合作研究' },
    description: {
      en: 'A topological-graph framework for scene understanding in robotic navigation, with graph construction, GNN training, and ablation experiments.',
      zh: '面向机器人导航场景理解的拓扑图框架，包含图构建、图神经网络训练与消融实验。'
    },
    credit: { en: 'Yicheng Duan & Duo Chen', zh: 'Yicheng Duan 与 Duo Chen' },
    upstream: 'https://github.com/YichengDuan/topog'
  },
  {
    id: 'svrllm', repo: 'svrllm', owner: 'YichengDuan', title: 'SVRLLM', icon: 'video',
    tags: ['Python', 'VLM', 'RAG', 'VectorDB'],
    kind: { en: 'Multimodal retrieval', zh: '多模态检索' },
    description: {
      en: 'A video-retrieval project that combines vision-language models and retrieval-augmented generation to find subsequent or related videos from an input clip and text prompt.',
      zh: '从视频片段与文字提示出发，结合视觉语言模型和检索增强生成，寻找后续或相关的视频内容。'
    }
  },
  {
    id: 'tiyamo-site', repo: 'DuoChen-317.github.io', title: 'Tiyamo', icon: 'web',
    tags: ['JavaScript', 'CSS', 'GitHub Pages'],
    kind: { en: 'Personal website', zh: '个人网站' },
    description: {
      en: 'This bilingual home for my work, games, and life, with seasonal landscapes and interactive paper-cut illustrations.',
      zh: '你正在浏览的中英双语个人网站，收藏工作、游戏与生活，配有四季风景与剪纸插画交互。'
    },
    demo: 'https://tiyamo.top/'
  }
];

export const repositoryUrl = (repo, owner = 'DuoChen-317') => `https://github.com/${owner}/${repo}`;
