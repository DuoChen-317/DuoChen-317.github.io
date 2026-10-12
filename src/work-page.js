import { ArrowUpRight, FileText, Scale, Box, Network, Globe2, Film, BriefcaseBusiness, GraduationCap, ChevronDown } from 'lucide-static';
import { projects, repositoryUrl } from './work-content.js';
import { experience } from './work-experience.js';
import { education } from './work-education.js';

export const workCopy = {
  en: {
    heading: 'Work & projects.', lead: 'From research ideas to working tools. My GitHub projects, professional experience, and education.',
    projects: 'GitHub projects', experience: 'Work experience', profile: 'My GitHub',
    projectsLead: 'AI agents, language models, video retrieval, and simulated worlds.',
    source: 'View repository', details: 'Project details', workflow: 'Workflow',
    more: 'More projects', original: 'Original repository', visit: 'Visit website',
    experienceLead: 'From software development to embodied intelligence: work, research, and internships.',
    education: 'Education', educationLead: 'Academic foundations in software engineering and computer science.',
    educationHistoryLabel: 'Education, newest first', courses: 'Coursework',
    historyLabel: 'Professional history, newest first', areas: 'Focus areas', showExperience: 'View details', hideExperience: 'Hide details'
  },
  zh: {
    heading: '作品与经历。', lead: '从研究想法到实际工具，在这里整理我的 GitHub 项目、工作经历与教育经历。',
    projects: 'GitHub 项目', experience: '工作经历', profile: '我的 GitHub',
    projectsLead: 'AI 智能体、大语言模型、视频检索与模拟世界中的探索。',
    source: '查看仓库', details: '项目内容', workflow: '项目流程',
    more: '更多项目', original: '原始仓库', visit: '访问网站',
    experienceLead: '从软件开发到具身智能，记录工作、科研与实习中的实践。',
    education: '教育经历', educationLead: '从软件工程到计算机科学，记录学习与积累。',
    educationHistoryLabel: '按时间从近到远排列的教育经历', courses: '修读课程',
    historyLabel: '按时间从近到远排列的经历', areas: '工作方向', showExperience: '查看详情', hideExperience: '收起详情'
  }
};

const icons = { paper: FileText, fairness: Scale, simulation: Box, graph: Network, video: Film, web: Globe2 };
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
    <div class="project-actions">${external(repositoryUrl(p.repo, p.owner), c.source)}<span class="repo-name" translate="no">${esc(p.repo)}</span></div>
    <details class="project-details"><summary>${c.details}${uiIcon(ChevronDown)}</summary><ul>${p.details[lang].map(x => `<li>${esc(x)}</li>`).join('')}</ul></details>
  </article>`;
  const compact = p => `<article class="github-row" id="${p.id}" aria-labelledby="${p.id}-title">${mark(p)}<div class="github-row-copy"><span class="project-kind">${esc(p.kind[lang])}</span><h3 id="${p.id}-title">${esc(p.title)}</h3><p class="project-description">${esc(p.description[lang])}</p>${p.credit ? `<p class="project-credit">${esc(p.credit[lang])} ${external(p.upstream, c.original, 'project-original')}</p>` : ''}${tags(p)}</div><div class="github-row-actions">${external(repositoryUrl(p.repo, p.owner), c.source)}${p.demo ? external(p.demo, c.visit) : ''}</div></article>`;
  const career = e => `<li class="career-entry ${e.type}" data-career-entry>
    <div class="career-date"><p><time datetime="${e.start}">${esc(e.date[lang].split(' — ')[0])}</time><span aria-hidden="true"> — </span>${e.end ? `<time datetime="${e.end}">${esc(e.date[lang].split(' — ')[1])}</time>` : esc(e.date[lang].split(' — ')[1])}</p><span class="career-type">${esc(e.label[lang])}</span></div>
    <span class="career-marker" aria-hidden="true"></span>
    <details class="career-content" aria-labelledby="${e.id}-role">
      <summary class="career-overview"><div class="career-overview-copy">${e.organization ? `<div class="career-employer">${esc(e.organization[lang])}</div>` : ''}<h3 id="${e.id}-role">${esc(e.role[lang])}</h3>${e.team ? `<p class="career-team">${esc(e.team[lang])}</p>` : ''}</div><span class="career-toggle"><span class="career-show">${c.showExperience}</span><span class="career-hide">${c.hideExperience}</span>${uiIcon(ChevronDown)}</span></summary>
      <div class="career-details-body">${e.summary ? `<p class="career-summary">${esc(e.summary[lang])}</p>` : ''}${e.bullets ? `<ul class="career-contributions">${e.bullets[lang].map(b=>`<li>${esc(b)}</li>`).join('')}</ul>` : ''}${e.tags ? `<ul class="project-tags" aria-label="${c.areas}">${e.tags[lang].map(tag=>`<li>${esc(tag)}</li>`).join('')}</ul>` : ''}${e.courses ? `<p class="career-course-label">${c.courses}</p><ul class="project-tags" aria-label="${c.courses}">${e.courses[lang].map(course=>`<li>${esc(course)}</li>`).join('')}</ul>` : ''}</div>
    </details>
  </li>`;
  const timeline = (entries, label) => `<div class="career-timeline" data-experience-timeline><span class="career-rail" aria-hidden="true"><span></span></span><ol class="career-list" aria-label="${label}">${entries.map(career).join('')}</ol></div>`;
  return `<div class="work-shell content-section">
    <section class="work-intro" aria-labelledby="work-title"><h1 id="work-title">${c.heading}</h1><p>${c.lead}</p><div class="work-intro-links"><nav class="work-section-nav" aria-label="${lang === 'zh' ? '工作页面模块' : 'Work sections'}"><a href="#github-projects"><span class="work-github-icon" aria-hidden="true">${githubIcon}</span>${c.projects}</a><a href="#work-experience">${uiIcon(BriefcaseBusiness)}${c.experience}</a><a href="#education">${uiIcon(GraduationCap)}${c.education}</a></nav>${external('https://github.com/DuoChen-317', c.profile, 'work-profile-link')}</div></section>
    <section id="github-projects" class="work-module" aria-labelledby="github-title"><div class="work-module-heading"><h2 id="github-title">${c.projects}</h2><p>${c.projectsLead}</p></div><div class="github-feature-grid">${projects.filter(p => p.featured).map(featured).join('')}</div><h3 class="more-projects-title">${c.more}</h3><div class="github-project-list">${projects.filter(p => !p.featured).map(compact).join('')}</div></section>
    <section id="work-experience" class="work-module experience-module" aria-labelledby="experience-title"><div class="work-module-heading"><h2 id="experience-title">${c.experience}</h2><p>${c.experienceLead}</p></div>${timeline(experience, c.historyLabel)}</section>
    <section id="education" class="work-module experience-module" aria-labelledby="education-title"><div class="work-module-heading"><h2 id="education-title">${c.education}</h2><p>${c.educationLead}</p></div>${timeline(education, c.educationHistoryLabel)}</section>
  </div>`;
}
