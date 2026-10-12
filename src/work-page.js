import { ArrowUpRight, FileText, Scale, Box, Network, Globe2, BriefcaseBusiness, ChevronDown } from 'lucide-static';
import { projects, repositoryUrl } from './work-content.js';

export const workCopy = {
  en: {
    heading: 'Work & projects.', lead: 'From research ideas to working tools. A collection of my GitHub projects and professional experience.',
    projects: 'GitHub projects', experience: 'Work experience', profile: 'My GitHub',
    projectsLead: 'AI agents, language models, and simulated worlds.',
    source: 'View repository', details: 'Project details', workflow: 'Workflow',
    more: 'More projects', original: 'Original repository', visit: 'Visit website',
    experienceLead: 'Roles, responsibilities, and the work behind them.',
    emptyTitle: 'Experience to come.', emptyText: 'I’ll share my roles and selected contributions here as I document them.'
  },
  zh: {
    heading: '作品与经历。', lead: '从研究想法到实际工具，在这里整理我的 GitHub 项目与工作经历。',
    projects: 'GitHub 项目', experience: '工作经历', profile: '我的 GitHub',
    projectsLead: 'AI 智能体、大语言模型，以及模拟世界中的探索。',
    source: '查看仓库', details: '项目内容', workflow: '项目流程',
    more: '更多项目', original: '原始仓库', visit: '访问网站',
    experienceLead: '记录不同阶段的职责、实践与成果。',
    emptyTitle: '工作经历，陆续整理。', emptyText: '未来会在这里分享我的工作岗位，以及值得记录的实践与贡献。'
  }
};

const icons = { paper: FileText, fairness: Scale, simulation: Box, graph: Network, web: Globe2 };
export function renderWork(lang, { esc, uiIcon, githubIcon }) {
  const c = workCopy[lang];
  const arrow = `<span aria-hidden="true">${uiIcon(ArrowUpRight)}</span>`;
  const external = (url, label, className = 'project-link') => `<a class="${className}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}${arrow}</a>`;
  const tags = p => `<ul class="project-tags" aria-label="${lang === 'zh' ? '技术' : 'Technologies'}">${p.tags.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
  const mark = p => `<span class="project-mark ${p.icon}" aria-hidden="true">${uiIcon(icons[p.icon])}</span>`;
  const featured = p => `<article class="github-feature" id="${p.id}" aria-labelledby="${p.id}-title">
    <div class="project-heading">${mark(p)}<span class="project-kind">${esc(p.kind[lang])}</span></div>
    <h3 id="${p.id}-title">${esc(p.title)}</h3><p class="project-description">${esc(p.description[lang])}</p>
    <div class="project-flow ${p.icon}"><span>${c.workflow}</span><ol>${p.flow[lang].map(step => `<li>${esc(step)}</li>`).join('')}</ol></div>
    ${tags(p)}
    <div class="project-actions">${external(repositoryUrl(p.repo), c.source)}<span class="repo-name" translate="no">${esc(p.repo)}</span></div>
    <details class="project-details"><summary>${c.details}${uiIcon(ChevronDown)}</summary><ul>${p.details[lang].map(x => `<li>${esc(x)}</li>`).join('')}</ul></details>
  </article>`;
  const compact = p => `<article class="github-row" id="${p.id}" aria-labelledby="${p.id}-title">${mark(p)}<div class="github-row-copy"><span class="project-kind">${esc(p.kind[lang])}</span><h3 id="${p.id}-title">${esc(p.title)}</h3><p class="project-description">${esc(p.description[lang])}</p>${p.credit ? `<p class="project-credit">${esc(p.credit[lang])} ${external(p.upstream, c.original, 'project-original')}</p>` : ''}${tags(p)}</div><div class="github-row-actions">${external(repositoryUrl(p.repo), c.source)}${p.demo ? external(p.demo, c.visit) : ''}</div></article>`;
  return `<div class="work-shell content-section">
    <section class="work-intro" aria-labelledby="work-title"><h1 id="work-title">${c.heading}</h1><p>${c.lead}</p><div class="work-intro-links"><nav class="work-section-nav" aria-label="${lang === 'zh' ? '工作页面模块' : 'Work sections'}"><a href="#github-projects"><span class="work-github-icon" aria-hidden="true">${githubIcon}</span>${c.projects}</a><a href="#work-experience">${uiIcon(BriefcaseBusiness)}${c.experience}</a></nav>${external('https://github.com/DuoChen-317', c.profile, 'work-profile-link')}</div></section>
    <section id="github-projects" class="work-module" aria-labelledby="github-title"><div class="work-module-heading"><h2 id="github-title">${c.projects}</h2><p>${c.projectsLead}</p></div><div class="github-feature-grid">${projects.filter(p => p.featured).map(featured).join('')}</div><h3 class="more-projects-title">${c.more}</h3><div class="github-project-list">${projects.filter(p => !p.featured).map(compact).join('')}</div></section>
    <section id="work-experience" class="work-module experience-module" aria-labelledby="experience-title"><div class="work-module-heading"><h2 id="experience-title">${c.experience}</h2><p>${c.experienceLead}</p></div><div class="experience-empty"><span aria-hidden="true">${uiIcon(BriefcaseBusiness)}</span><div><h3>${c.emptyTitle}</h3><p>${c.emptyText}</p></div></div></section>
  </div>`;
}
