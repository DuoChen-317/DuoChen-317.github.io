import fs from 'node:fs';
import path from 'node:path';

const out = path.resolve('dist');
const routes = ['', 'about', 'minecraft', 'games', 'work', 'updates', 'resume'];
const copy = {
  en: {
    lang: 'en', title: 'Tiyamo', description: 'Minecraft worlds, games, work, and notes from Tiyamo.',
    nav: { home: 'Home', worlds: 'Games', minecraft: 'Minecraft', games: 'Other games', work: 'Work', about: 'About', updates: 'Updates', resume: 'Résumé' },
    switch: '中文', skip: 'Skip to content', footer: 'Built as a home for what I make and explore.',
    home: {
      eyebrow: 'WELCOME TO MY CORNER OF THE INTERNET', heading: 'Hi, I’m Tiyamo.',
      lead: 'A home for my Minecraft worlds, game experiences, and the work I’m proud of.',
      explore: 'Explore my work', about: 'Get to know me', scroll: 'Scroll to explore',
      selected: 'Featured spaces', selectedSub: 'Three doors into the things I make and enjoy.',
      mc: 'Minecraft', mcText: 'Worlds, builds, and stories made block by block.',
      games: 'Games', gamesText: 'Projects, discoveries, and moments worth sharing.',
      work: 'Work', workText: 'A place for professional projects and what I contributed.',
      open: 'Enter space', latest: 'Latest updates', latestSub: 'A small log of what’s happening here.',
      updateTitle: 'A new home for Tiyamo', updateText: 'The first version of this site is taking shape. Projects and stories will be added here.',
      allUpdates: 'View all updates', label: 'SITE NOTE', next: 'More to come', nextText: 'New projects will appear as this space grows.'
    },
    about: { eyebrow: 'ABOUT', heading: 'The person behind the pixels.', lead: 'This is where I’ll share who I am, what I care about, and what I’m exploring next.',
      blocks: [['A short introduction', 'Add a few sentences about yourself: what you do, where your interests started, and what you like creating.'], ['Beyond the screen', 'Share the interests and experiences you want visitors to know about.'], ['Now & next', 'Describe what you are learning or working toward right now.']],
      prompt: 'About content is ready for your own words.' },
    minecraft: { eyebrow: 'MINECRAFT', heading: 'Worlds, one block at a time.', lead: 'A dedicated home for Minecraft builds, maps, servers, and the stories behind them.',
      tabs: ['Builds', 'Worlds', 'Community'], cards: [['01', 'Build showcase', 'Add screenshots and the story behind a favorite build.'], ['02', 'A world to explore', 'Share a map, a location, or a world you keep returning to.'], ['03', 'People & projects', 'Document a server, collaboration, or community project.']],
      note: 'Your own Minecraft screenshots will make this page yours.' },
    games: { eyebrow: 'GAMES', heading: 'Beyond the overworld.', lead: 'A place for other games, creative experiments, and memorable discoveries.',
      cards: [['Game project', 'Add a game you made, contributed to, or want to showcase.'], ['Play notes', 'Share a short story, review, or memorable moment from a game.']], note: 'This page is ready to grow with your game collection.' },
    work: { eyebrow: 'WORK', heading: 'What I work on.', lead: 'Projects, responsibilities, process, and outcomes can live here as your portfolio grows.',
      cards: [['Featured project', 'Project title', 'Explain the challenge, your role, and the result.'], ['Another project', 'Project title', 'Show what you made and why it matters.']],
      role: 'ROLE', challenge: 'CHALLENGE', outcome: 'OUTCOME', pending: 'Add details', note: 'Work examples are placeholders until you choose what to publish.' },
    updates: { eyebrow: 'UPDATES', heading: 'Notes from the journey.', lead: 'New projects, Minecraft progress, and other things worth remembering.',
      date: 'SITE UPDATE', title: 'A new home for Tiyamo', text: 'This is the first version of the site. More work, game stories, and personal details will be added over time.',
      next: 'Future updates will appear here.' },
    resume: { eyebrow: 'RÉSUMÉ', heading: 'Experience at a glance.', lead: 'A readable overview of experience, skills, and selected work will go here.',
      sections: [['Profile', 'Add a concise professional summary.'], ['Experience', 'Add roles, dates, and the contributions you want to highlight.'], ['Skills', 'Add the tools and strengths most relevant to your work.'], ['Education', 'Add education or training if you would like to share it.']],
      note: 'This résumé currently contains placeholder content.' }
  },
  zh: {
    lang: 'zh-CN', title: 'Tiyamo', description: 'Tiyamo 的个人网站：我的世界、游戏、工作与记录。',
    nav: { home: '首页', worlds: '游戏', minecraft: '我的世界', games: '其他游戏', work: '工作作品', about: '关于我', updates: '更新', resume: '简历' },
    switch: 'English', skip: '跳到主要内容', footer: '记录我的创作与探索。',
    home: {
      eyebrow: '欢迎来到我的个人空间', heading: '你好，我是 Tiyamo。',
      lead: '这里收藏我的 Minecraft 世界、游戏经历，以及值得展示的工作作品。',
      explore: '看看我的作品', about: '了解我', scroll: '向下探索',
      selected: '精选空间', selectedSub: '从三个入口，认识我创作和热爱的事物。',
      mc: '我的世界', mcText: '方块世界里的建筑、地图与故事。',
      games: '游戏', gamesText: '游戏项目、发现和值得分享的瞬间。',
      work: '工作', workText: '展示工作项目与我在其中的贡献。',
      open: '进入', latest: '最近更新', latestSub: '记录这里正在发生的事。',
      updateTitle: 'Tiyamo 的新空间', updateText: '网站第一版正在成形。作品和故事会陆续加入。',
      allUpdates: '查看所有更新', label: '网站记录', next: '更多内容即将到来', nextText: '这个空间会随着新作品继续成长。'
    },
    about: { eyebrow: '关于我', heading: '像素背后的我。', lead: '在这里介绍我是谁、我关心什么，以及接下来想探索的方向。',
      blocks: [['简单介绍', '补充几句话：你做什么、兴趣从哪里开始，以及喜欢创作什么。'], ['屏幕之外', '分享你希望访客了解的兴趣与经历。'], ['现在与未来', '写下目前正在学习或努力实现的事。']],
      prompt: '这里等待你写下自己的故事。' },
    minecraft: { eyebrow: '我的世界', heading: '一块一块，构建世界。', lead: '为 Minecraft 建筑、地图、服务器和背后的故事留一个专属空间。',
      tabs: ['建筑', '地图', '社区'], cards: [['01', '建筑展示', '加入你喜欢的建筑截图，以及创作故事。'], ['02', '值得探索的世界', '展示地图、地点，或你常常回去的世界。'], ['03', '伙伴与项目', '记录服务器、合作创作或社区项目。']],
      note: '加入你自己的 Minecraft 截图后，这里会更有个人特色。' },
    games: { eyebrow: '游戏', heading: '主世界之外。', lead: '收藏其他游戏、创意尝试和值得记住的发现。',
      cards: [['游戏项目', '加入你制作、参与或想展示的游戏。'], ['游玩记录', '分享一段故事、简评或难忘的游戏瞬间。']], note: '这个页面可以随着你的游戏收藏慢慢扩展。' },
    work: { eyebrow: '工作', heading: '我参与的工作。', lead: '这里会展示项目、职责、过程和成果。',
      cards: [['精选项目', '项目名称', '说明项目挑战、你的职责与最终成果。'], ['另一个项目', '项目名称', '展示你做了什么，以及它为什么重要。']],
      role: '职责', challenge: '挑战', outcome: '成果', pending: '待补充', note: '目前是占位内容，你可以之后决定公开哪些工作经历。' },
    updates: { eyebrow: '更新', heading: '旅途记录。', lead: '新作品、Minecraft 进展，以及其他想记下的事。',
      date: '网站更新', title: 'Tiyamo 的新空间', text: '这是网站的第一版。工作作品、游戏故事和个人介绍会逐步加入。',
      next: '以后的更新会出现在这里。' },
    resume: { eyebrow: '简历', heading: '经历一览。', lead: '这里将整理个人经历、技能与精选作品。',
      sections: [['个人简介', '补充一段简洁的职业介绍。'], ['工作经历', '补充职位、时间和你希望强调的贡献。'], ['技能', '补充与你的工作相关的工具和能力。'], ['教育经历', '如果愿意，可以加入教育或培训经历。']],
      note: '当前简历内容均为占位内容。' }
  }
};

const href = (lang, route='') => `${lang === 'zh' ? '/zh/' : '/'}${route ? `${route}/` : ''}`;
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const icon = (name) => ({ arrow: '↗', down: '↓', next: '→' }[name]);
const socialIcons = {
  email: '<span class="social-at" aria-hidden="true">@</span>',
  discord: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5.2 6.8C7 5.5 9 5 12 5s5 .5 6.8 1.8L20 17c-1.3 1.1-2.6 1.8-4.1 2.2l-.9-1.4c.5-.2 1-.5 1.5-.8-3 1.4-6 1.4-9 0 .5.3 1 .6 1.5.8l-.9 1.4C6.6 18.8 5.3 18.1 4 17L5.2 6.8Z"/><circle cx="9" cy="12" r="1.2" fill="#142521"/><circle cx="15" cy="12" r="1.2" fill="#142521"/></svg>',
  github: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 1a11 11 0 0 0-3.48 21.44c.55.1.75-.24.75-.53v-2.05c-3.06.67-3.71-1.3-3.71-1.3-.5-1.27-1.23-1.61-1.23-1.61-1-.69.08-.68.08-.68 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.57 1.19 3.19.91.1-.71.38-1.19.69-1.46-2.44-.28-5-1.22-5-5.43 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.91 0 0 .92-.29 3.03 1.12a10.5 10.5 0 0 1 5.52 0c2.11-1.41 3.03-1.12 3.03-1.12.6 1.51.22 2.63.11 2.91.7.77 1.13 1.75 1.13 2.95 0 4.22-2.57 5.15-5.02 5.42.39.34.74 1.01.74 2.04v3.03c0 .29.2.64.76.53A11 11 0 0 0 12 1Z"/></svg>',
  steam: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="16.8" cy="7.2" r="5.2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="16.8" cy="7.2" r="2.2"/><path d="m12.4 9.8-4.1 5.4a4.3 4.3 0 1 1-3.8 3.3l-2.6-1.1v-3.5l5.1 2 5.4-6.1Z"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18.9 2H21l-6.6 7.5L22 22h-5.9l-4.7-6.7L5.6 22H3.5l7-8L3 2h6.1l4.2 6.1L18.9 2Zm-1 18h1.2L8.4 3.9H7.2L17.9 20Z"/></svg>'
};
const socialLinks = [
  { name: 'Email', url: 'mailto:tiyamo317@gmail.com', icon: 'email' },
  { name: 'Discord', url: null, icon: 'discord' },
  { name: 'GitHub', url: 'https://github.com/DuoChen-317', icon: 'github' },
  { name: 'Steam', url: null, icon: 'steam' },
  { name: 'X', url: 'https://x.com/Tiyamo317', icon: 'x' }
];

function socialBar(lang) {
  return `<nav class="social-links" aria-label="${lang === 'en' ? 'Social links' : '社交链接'}">${socialLinks.map(({name,url,icon}) => url
    ? `<a href="${esc(url)}" aria-label="${name}" title="${name}" ${url.startsWith('mailto:') ? '' : 'target="_blank" rel="noopener noreferrer"'}>${socialIcons[icon]}</a>`
    : `<span class="social-pending" role="img" aria-label="${name}: ${lang === 'en' ? 'link coming soon' : '链接待补充'}" title="${name}: ${lang === 'en' ? 'link coming soon' : '链接待补充'}">${socialIcons[icon]}</span>`).join('')}</nav>`;
}

function header(lang, route, t) {
  const nav = t.nav;
  const link = (r,label) => `<a href="${href(lang,r)}" ${route===r?'aria-current="page"':''}>${label}</a>`;
  return `<a class="skip" href="#content">${t.skip}</a>
  <header class="site-header"><div class="nav-wrap">
    <a class="brand" href="${href(lang)}" aria-label="Tiyamo home"><span class="brand-mark">T</span><span>TIYAMO<span class="brand-dot">.</span></span></a>
    <nav class="main-nav" aria-label="Main navigation">
      ${link('',nav.home)}
      <details class="nav-dropdown" ${['minecraft','games'].includes(route)?'data-active="true"':''}><summary>${nav.worlds}<span aria-hidden="true">⌄</span></summary><div class="dropdown-panel">${link('minecraft',nav.minecraft)}${link('games',nav.games)}</div></details>
      ${link('work',nav.work)}${link('about',nav.about)}${link('updates',nav.updates)}
    </nav>
    <div class="nav-actions"><a class="language" href="${href(lang==='en'?'zh':'en',route)}" lang="${lang==='en'?'zh-CN':'en'}">${t.switch}</a><a class="resume-link" href="${href(lang,'resume')}">${nav.resume}<span aria-hidden="true">↗</span></a></div>
    <button class="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span><span></span></button>
  </div><nav id="mobile-menu" class="mobile-menu" aria-label="Mobile navigation" hidden>${[['',nav.home],['minecraft',nav.minecraft],['games',nav.games],['work',nav.work],['about',nav.about],['updates',nav.updates],['resume',nav.resume]].map(([r,l])=>link(r,l)).join('')}<a class="language" href="${href(lang==='en'?'zh':'en',route)}">${t.switch}</a></nav></header>`;
}

function footer(t) { return `<footer class="site-footer"><div class="footer-inner"><div><span class="footer-brand">TIYAMO<span>.</span></span><p>${t.footer}</p></div><span class="footer-copy">© ${new Date().getFullYear()} Tiyamo</span></div></footer>`; }

function heroArt() { return `<div class="hero-art" aria-hidden="true"><div class="hero-sky-grid"></div><div class="sun"></div><div class="cloud cloud-a"></div><div class="cloud cloud-b"></div><div class="mountain mountain-a"></div><div class="mountain mountain-b"></div><div class="terrain terrain-back"></div><div class="terrain terrain-front"></div><div class="hero-grain"></div></div>`; }

function card(hrefTo, type, num, title, desc, c) { return `<a class="feature-card ${type}" href="${hrefTo}"><div class="card-visual"><span class="card-coord">${num} / 03</span><div class="card-symbol" aria-hidden="true">${type==='minecraft'?'▦':type==='games'?'✦':'◈'}</div><span class="card-label">${type.toUpperCase()}</span></div><div class="card-body"><div><h3>${title}</h3><p>${desc}</p></div><span class="card-arrow" aria-label="${c.open}">${icon('arrow')}</span></div></a>`; }

function home(lang,t) { const c=t.home; return `${heroArt()}<section class="hero" aria-labelledby="hero-title"><div class="hero-content"><span class="eyebrow hero-eyebrow"><span class="status-dot"></span>${c.eyebrow}</span><div class="avatar"><img src="/assets/avatar.jpg" alt="Tiyamo's avatar" width="853" height="1280"></div><h1 id="hero-title">${c.heading}</h1><p class="hero-lead">${c.lead}</p>${socialBar(lang)}<div class="hero-buttons"><a class="button button-primary" href="#featured">${c.explore}<span>${icon('arrow')}</span></a><a class="button button-ghost" href="${href(lang,'about')}">${c.about}<span>${icon('next')}</span></a></div></div><a class="scroll-hint" href="#featured"><span class="scroll-line"></span>${c.scroll} ${icon('down')}</a></section>
  <section id="featured" class="content-section featured"><div class="section-head"><div><span class="eyebrow">01 / EXPLORE</span><h2>${c.selected}</h2><p>${c.selectedSub}</p></div><span class="section-deco" aria-hidden="true">✦</span></div><div class="feature-grid">${card(href(lang,'minecraft'),'minecraft','01',c.mc,c.mcText,c)}${card(href(lang,'games'),'games','02',c.games,c.gamesText,c)}${card(href(lang,'work'),'work','03',c.work,c.workText,c)}</div></section>
  <section class="content-section updates-preview"><div class="section-head"><div><span class="eyebrow">02 / JOURNAL</span><h2>${c.latest}</h2><p>${c.latestSub}</p></div><a class="text-link" href="${href(lang,'updates')}">${c.allUpdates} <span>${icon('arrow')}</span></a></div><div class="updates-grid"><a class="update-feature" href="${href(lang,'updates')}"><div class="update-icon" aria-hidden="true">✳</div><div><span class="eyebrow">${c.label}</span><h3>${c.updateTitle}</h3><p>${c.updateText}</p></div><span class="update-arrow">${icon('arrow')}</span></a><div class="update-soon"><span class="soon-stars" aria-hidden="true">✦ ✧</span><h3>${c.next}</h3><p>${c.nextText}</p></div></div></section>`; }

function pageIntro(c) { return `<section class="page-intro"><div class="page-intro-art" aria-hidden="true"><span>✦</span><span>▦</span><span>✧</span></div><div class="page-intro-inner"><span class="eyebrow"><span class="status-dot"></span>${c.eyebrow}</span><h1>${c.heading}</h1><p>${c.lead}</p></div></section>`; }
function note(text) { return `<div class="page-note"><span aria-hidden="true">✳</span><p>${text}</p></div>`; }
function about(t) { const c=t.about; return `${pageIntro(c)}<section class="content-section inner-content"><div class="about-grid">${c.blocks.map(([h,p],i)=>`<article class="info-card"><span class="card-index">0${i+1}</span><h2>${h}</h2><p>${p}</p></article>`).join('')}</div>${note(c.prompt)}</section>`; }
function minecraft(t) { const c=t.minecraft; return `${pageIntro(c)}<section class="content-section inner-content"><div class="chip-row">${c.tabs.map(x=>`<span class="chip">${x}</span>`).join('')}</div><div class="portfolio-grid">${c.cards.map(([n,h,p],i)=>`<article class="portfolio-card"><div class="portfolio-image minecraft-image minecraft-image-${i+1}"><span class="placeholder-mark">▦</span><span class="image-number">${n}</span></div><div class="portfolio-copy"><span class="eyebrow">MINECRAFT / ${n}</span><h2>${h}</h2><p>${p}</p></div></article>`).join('')}</div>${note(c.note)}</section>`; }
function games(t) { const c=t.games; return `${pageIntro(c)}<section class="content-section inner-content"><div class="portfolio-grid two">${c.cards.map(([h,p],i)=>`<article class="portfolio-card"><div class="portfolio-image game-image game-image-${i+1}"><span class="placeholder-mark">${i?'✧':'✦'}</span><span class="image-number">0${i+1}</span></div><div class="portfolio-copy"><span class="eyebrow">GAMES / 0${i+1}</span><h2>${h}</h2><p>${p}</p></div></article>`).join('')}</div>${note(c.note)}</section>`; }
function work(t) { const c=t.work; return `${pageIntro(c)}<section class="content-section inner-content"><div class="work-list">${c.cards.map(([tag,title,desc],i)=>`<article class="work-card"><div class="work-number">0${i+1}</div><div class="work-main"><span class="eyebrow">${tag}</span><h2>${title}</h2><p>${desc}</p><div class="work-meta"><span>${c.role}: ${c.pending}</span><span>${c.challenge}: ${c.pending}</span><span>${c.outcome}: ${c.pending}</span></div></div><div class="work-art" aria-hidden="true">◈</div></article>`).join('')}</div>${note(c.note)}</section>`; }
function updates(t) { const c=t.updates; return `${pageIntro(c)}<section class="content-section inner-content"><div class="timeline"><article class="timeline-entry"><span class="timeline-marker" aria-hidden="true"></span><span class="eyebrow">${c.date}</span><h2>${c.title}</h2><p>${c.text}</p></article><div class="timeline-next"><span class="timeline-marker empty" aria-hidden="true"></span><p>${c.next}</p></div></div></section>`; }
function resume(t) { const c=t.resume; return `${pageIntro(c)}<section class="content-section inner-content"><div class="resume-list">${c.sections.map(([h,p],i)=>`<article class="resume-section"><span class="card-index">0${i+1}</span><div><h2>${h}</h2><p>${p}</p></div></article>`).join('')}</div>${note(c.note)}</section>`; }
const bodies = { '': home, about: (_lang,t)=>about(t), minecraft: (_lang,t)=>minecraft(t), games: (_lang,t)=>games(t), work: (_lang,t)=>work(t), updates: (_lang,t)=>updates(t), resume: (_lang,t)=>resume(t) };

function render(lang, route) {
  const t=copy[lang];
  const pageTitle = route ? `${t[route]?.heading ?? t.title} | Tiyamo` : `Tiyamo — ${t.nav.home}`;
  return `<!doctype html><html lang="${t.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#111b21"><title>${esc(pageTitle)}</title><meta name="description" content="${esc(t.description)}"><link rel="alternate" hreflang="en" href="${href('en',route)}"><link rel="alternate" hreflang="zh-CN" href="${href('zh',route)}"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="/assets/styles.css"><script src="/assets/app.js" defer></script></head><body class="route-${route||'home'}">${header(lang,route,t)}<main id="content">${bodies[route](lang,t)}</main>${footer(t)}</body></html>`;
}

for (const lang of ['en','zh']) for (const route of routes) {
  const dir=path.join(out, ...(lang==='zh'?['zh']:[]), ...(route?[route]:[]));
  fs.mkdirSync(dir,{recursive:true}); fs.writeFileSync(path.join(dir,'index.html'),render(lang,route));
}
console.log('Built 14 localized pages in dist/');
