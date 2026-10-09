import fs from 'node:fs';
import path from 'node:path';
import { buildSync } from 'esbuild';
import { ArrowUpRight, BriefcaseBusiness, Gamepad2, NotebookPen, Pause, Play, Leaf } from 'lucide-static';

const out = path.resolve('dist');
const routes = ['', 'about', 'minecraft', 'games', 'work', 'life', 'updates', 'resume'];
const copy = {
  en: {
    lang: 'en', title: 'Tiyamo', description: 'Minecraft worlds, games, work, and notes from Tiyamo.',
    nav: { home: 'Home', worlds: 'Games', minecraft: 'Minecraft', games: 'All games', work: 'Work', about: 'About', updates: 'Updates', resume: 'Résumé' },
    switch: '中文', skip: 'Skip to content', footer: 'Built as a home for what I make and explore.',
    home: {
      eyebrow: 'WELCOME TO MY CORNER OF THE INTERNET', heading: 'Hi, I’m Tiyamo.',
      lead: 'A home for my mind world, game experiences, and the work I’m proud of.',
      explore: 'Explore my work', about: 'Get to know me', scroll: 'Scroll to explore',
      selected: 'Explore my world', selectedSub: 'Work, games, and life—collected in one place.',
      mc: 'Minecraft', mcText: 'Worlds, builds, and stories made block by block.',
      games: 'Game', gamesText: 'Minecraft, other games, and moments worth sharing.',
      work: 'Work', workText: 'A place for professional projects and what I contributed.',
      life: 'Life', lifeText: 'Everyday moments, interests, and notes beyond the screen.',
      open: 'Enter space', latest: 'Latest updates', latestSub: 'A small log of what’s happening here.',
      updateTitle: 'A clearer view of my world', updateText: 'A brighter space for work, games, and life, with a living landscape you can pause.',
      allUpdates: 'View all updates', label: 'SITE NOTE', next: 'More to come', nextText: 'New projects will appear as this space grows.',
      pauseMotion: 'Pause animation', playMotion: 'Play animation'
    },
    about: { eyebrow: 'ABOUT', heading: 'The person behind the pixels.', lead: 'This is where I’ll share who I am, what I care about, and what I’m exploring next.',
      blocks: [['A short introduction', 'Add a few sentences about yourself: what you do, where your interests started, and what you like creating.'], ['Beyond the screen', 'Share the interests and experiences you want visitors to know about.'], ['Now & next', 'Describe what you are learning or working toward right now.']],
      prompt: 'About content is ready for your own words.' },
    minecraft: { eyebrow: 'MINECRAFT', heading: 'Worlds, one block at a time.', lead: 'A dedicated home for Minecraft builds, maps, servers, and the stories behind them.',
      tabs: ['Builds', 'Worlds', 'Community'], cards: [['01', 'Build showcase', 'Add screenshots and the story behind a favorite build.'], ['02', 'A world to explore', 'Share a map, a location, or a world you keep returning to.'], ['03', 'People & projects', 'Document a server, collaboration, or community project.']],
      note: 'Your own Minecraft screenshots will make this page yours.' },
    games: { eyebrow: 'GAME', heading: 'Games & worlds.', lead: 'Minecraft and other games I play, make, and remember.',
      minecraftTitle: 'Minecraft', minecraftText: 'Explore builds, worlds, and stories made block by block.', minecraftOpen: 'Explore Minecraft',
      cards: [['Game project', 'Add a game you made, contributed to, or want to showcase.'], ['Play notes', 'Share a short story, review, or memorable moment from a game.']], note: 'This page is ready to grow with your game collection.' },
    life: { eyebrow: 'LIFE', heading: 'Life beyond the screen.', lead: 'A place for interests, everyday moments, and stories outside my projects.',
      blocks: [['Everyday moments', 'A space for photos and small moments I want to remember.'], ['Places & interests', 'The places I explore and things I enjoy away from work and games.'], ['Notes to keep', 'Thoughts and stories I may want to share along the way.']],
      note: 'Personal stories and photos will be added here later.' },
    work: { eyebrow: 'WORK', heading: 'What I work on.', lead: 'Projects, responsibilities, process, and outcomes can live here as your portfolio grows.',
      cards: [['Featured project', 'Project title', 'Explain the challenge, your role, and the result.'], ['Another project', 'Project title', 'Show what you made and why it matters.']],
      role: 'ROLE', challenge: 'CHALLENGE', outcome: 'OUTCOME', pending: 'Add details', note: 'Work examples are placeholders until you choose what to publish.' },
    updates: { eyebrow: 'UPDATES', heading: 'Notes from the journey.', lead: 'New projects, Minecraft progress, and other things worth remembering.',
      currentDate: 'OCTOBER 2026', currentTitle: 'A clearer view of my world', currentText: 'The homepage now gives work, games, and life their own places. The landscape animation has a pause control.',
      date: 'SITE UPDATE', title: 'A new home for Tiyamo', text: 'This is the first version of the site. More work, game stories, and personal details will be added over time.',
      next: 'Future updates will appear here.' },
    resume: { eyebrow: 'RÉSUMÉ', heading: 'Experience at a glance.', lead: 'A readable overview of experience, skills, and selected work will go here.',
      sections: [['Profile', 'Add a concise professional summary.'], ['Experience', 'Add roles, dates, and the contributions you want to highlight.'], ['Skills', 'Add the tools and strengths most relevant to your work.'], ['Education', 'Add education or training if you would like to share it.']],
      note: 'This résumé currently contains placeholder content.' }
  },
  zh: {
    lang: 'zh-CN', title: 'Tiyamo', description: 'Tiyamo 的个人网站：我的世界、游戏、工作与记录。',
    nav: { home: '首页', worlds: '游戏', minecraft: '我的世界', games: '全部游戏', work: '工作作品', about: '关于我', updates: '更新', resume: '简历' },
    switch: 'English', skip: '跳到主要内容', footer: '记录我的创作与探索。',
    home: {
      eyebrow: '欢迎来到我的个人空间', heading: '你好，我是 Tiyamo。',
      lead: '这里收藏我的内心世界、游戏经历，以及令我骄傲的工作作品。',
      explore: '看看我的作品', about: '了解我', scroll: '向下探索',
      selected: '探索我的世界', selectedSub: '工作、游戏与生活，都在这里。',
      mc: '我的世界', mcText: '方块世界里的建筑、地图与故事。',
      games: '游戏', gamesText: '游戏项目、发现和值得分享的瞬间。',
      work: '工作', workText: '展示工作项目与我在其中的贡献。',
      life: '生活', lifeText: '记录日常、兴趣，以及屏幕之外的故事。',
      open: '进入', latest: '最近更新', latestSub: '记录这里正在发生的事。',
      updateTitle: '更清晰地展示我的世界', updateText: '工作、游戏与生活有了更明亮的展示空间，动态山水也可以随时暂停。',
      allUpdates: '查看所有更新', label: '网站记录', next: '更多内容即将到来', nextText: '这个空间会随着新作品继续成长。',
      pauseMotion: '暂停动画', playMotion: '播放动画'
    },
    about: { eyebrow: '关于我', heading: '像素背后的我。', lead: '在这里介绍我是谁、我关心什么，以及接下来想探索的方向。',
      blocks: [['简单介绍', '补充几句话：你做什么、兴趣从哪里开始，以及喜欢创作什么。'], ['屏幕之外', '分享你希望访客了解的兴趣与经历。'], ['现在与未来', '写下目前正在学习或努力实现的事。']],
      prompt: '这里等待你写下自己的故事。' },
    minecraft: { eyebrow: '我的世界', heading: '一块一块，构建世界。', lead: '为 Minecraft 建筑、地图、服务器和背后的故事留一个专属空间。',
      tabs: ['建筑', '地图', '社区'], cards: [['01', '建筑展示', '加入你喜欢的建筑截图，以及创作故事。'], ['02', '值得探索的世界', '展示地图、地点，或你常常回去的世界。'], ['03', '伙伴与项目', '记录服务器、合作创作或社区项目。']],
      note: '加入你自己的 Minecraft 截图后，这里会更有个人特色。' },
    games: { eyebrow: '游戏', heading: '游戏与世界。', lead: '记录 Minecraft 和其他玩过、制作过、想要分享的游戏。',
      minecraftTitle: '我的世界', minecraftText: '探索方块世界里的建筑、地图与故事。', minecraftOpen: '探索我的世界',
      cards: [['游戏项目', '加入你制作、参与或想展示的游戏。'], ['游玩记录', '分享一段故事、简评或难忘的游戏瞬间。']], note: '这个页面可以随着你的游戏收藏慢慢扩展。' },
    life: { eyebrow: '生活', heading: '屏幕之外的生活。', lead: '给兴趣、日常片段和项目之外的故事留一个空间。',
      blocks: [['日常片段', '这里可以放想要记住的照片和小事。'], ['去过的地方与兴趣', '分享工作和游戏之外喜欢的地方与事物。'], ['随手记录', '以后可以在这里写下想分享的想法与故事。']],
      note: '个人故事和照片会在之后陆续加入。' },
    work: { eyebrow: '工作', heading: '我参与的工作。', lead: '这里会展示项目、职责、过程和成果。',
      cards: [['精选项目', '项目名称', '说明项目挑战、你的职责与最终成果。'], ['另一个项目', '项目名称', '展示你做了什么，以及它为什么重要。']],
      role: '职责', challenge: '挑战', outcome: '成果', pending: '待补充', note: '目前是占位内容，你可以之后决定公开哪些工作经历。' },
    updates: { eyebrow: '更新', heading: '旅途记录。', lead: '新作品、Minecraft 进展，以及其他想记下的事。',
      currentDate: '2026 年 10 月', currentTitle: '更清晰地展示我的世界', currentText: '首页现在分别展示工作、游戏和生活。动态山水也加入了暂停控制。',
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
const uiIcon = svg => svg.replace('<svg', '<svg aria-hidden="true" focusable="false"');
const socialIcons = Object.fromEntries(
  ['email', 'discord', 'github', 'steam', 'x'].map(name => [
    name,
    fs.readFileSync(path.resolve('icons', `${name}.svg`), 'utf8')
      .replace('<svg ', '<svg aria-hidden="true" focusable="false" ')
  ])
);
const socialLinks = [
  { name: 'Email', url: 'mailto:tiyamo317@gmail.com', icon: 'email' },
  { name: 'Discord', url: null, icon: 'discord' },
  { name: 'GitHub', url: 'https://github.com/DuoChen-317', icon: 'github' },
  { name: 'Steam', url: 'https://steamcommunity.com/id/tiyamo/', icon: 'steam' },
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
  const languageIcon = '<svg class="language-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.75 5.5 3.75 9s-1.25 6.5-3.75 9M12 3c-2.5 2.5-3.75 5.5-3.75 9s1.25 6.5 3.75 9"/></svg>';
  const languageSwitch = `<a class="language" href="${href(lang==='en'?'zh':'en',route)}" lang="${lang==='en'?'zh-CN':'en'}" aria-label="${lang==='en'?'Switch to Chinese':'切换到英文'}">${languageIcon}<span>${t.switch}</span></a>`;
  return `<a class="skip" href="#content">${t.skip}</a>
  <header class="site-header"><div class="nav-wrap">
    <a class="brand" href="${href(lang)}" aria-label="${lang === 'en' ? 'Tiyamo home' : 'Tiyamo 首页'}" translate="no">TIYAMO</a>
    <nav class="main-nav" aria-label="${lang === 'en' ? 'Main navigation' : '主导航'}">
      ${link('',nav.home)}
      <details class="nav-dropdown" ${['minecraft','games'].includes(route)?'data-active="true"':''}><summary>${nav.worlds}<span aria-hidden="true">⌄</span></summary><div class="dropdown-panel">${link('minecraft',nav.minecraft)}${link('games',nav.games)}</div></details>
      ${link('work',nav.work)}${link('about',nav.about)}${link('updates',nav.updates)}
    </nav>
    <div class="nav-actions">${languageSwitch}<a class="resume-link" href="${href(lang,'resume')}">${nav.resume}<span aria-hidden="true">↗</span></a></div>
    <button class="menu-toggle" aria-label="${lang === 'en' ? 'Open menu' : '打开菜单'}" data-open-label="${lang === 'en' ? 'Open menu' : '打开菜单'}" data-close-label="${lang === 'en' ? 'Close menu' : '关闭菜单'}" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span><span></span></button>
  </div><nav id="mobile-menu" class="mobile-menu" aria-label="${lang === 'en' ? 'Mobile navigation' : '手机导航'}" hidden>${[['',nav.home],['minecraft',nav.minecraft],['games',nav.games],['work',nav.work],['about',nav.about],['updates',nav.updates],['resume',nav.resume]].map(([r,l])=>link(r,l)).join('')}${languageSwitch}</nav></header>`;
}

function footer(t) { return `<footer class="site-footer"><div class="footer-inner"><div><span class="footer-brand">TIYAMO<span>.</span></span><p>${t.footer}</p></div><span class="footer-copy">© ${new Date().getFullYear()} Tiyamo</span></div></footer>`; }

function heroArt() { return `<div class="hero-art" aria-hidden="true"><div class="hero-scene"></div><canvas class="hero-wallpaper"></canvas><canvas class="hero-leaves"></canvas></div>`; }

const cardIcons = { work: BriefcaseBusiness, games: Gamepad2, life: Leaf };
function card(hrefTo, type, title, desc) {
  return `<a class="feature-card ${type}" href="${hrefTo}"><div class="card-visual" aria-hidden="true"><span class="card-orbit"></span><span class="card-symbol">${uiIcon(cardIcons[type])}</span><span class="card-landscape"></span></div><div class="card-body"><div><h3>${title}</h3><p>${desc}</p></div><span class="card-arrow" aria-hidden="true">${uiIcon(ArrowUpRight)}</span></div></a>`;
}

function home(lang,t) { const c=t.home; return `${heroArt()}<section class="hero" aria-labelledby="hero-title"><button class="motion-toggle" type="button" aria-label="${c.pauseMotion}" aria-pressed="false" data-pause-label="${c.pauseMotion}" data-play-label="${c.playMotion}" hidden><span class="motion-pause-icon">${uiIcon(Pause)}</span><span class="motion-play-icon">${uiIcon(Play)}</span><span class="motion-label">${c.pauseMotion}</span></button><div class="hero-content"><span class="eyebrow hero-eyebrow"><span class="status-dot"></span>${c.eyebrow}</span><div class="avatar"><img src="/assets/avatar.jpg" alt="Tiyamo's avatar" width="853" height="1280"></div><h1 id="hero-title">${c.heading}</h1><p class="hero-lead">${c.lead}</p>${socialBar(lang)}<div class="hero-buttons"><a class="button button-primary" href="#featured">${c.explore}<span>${icon('arrow')}</span></a><a class="button button-ghost" href="${href(lang,'about')}">${c.about}<span>${icon('next')}</span></a></div></div><a class="scroll-hint" href="#featured"><span class="scroll-line"></span>${c.scroll} ${icon('down')}</a></section>
  <section id="featured" class="content-section featured"><div class="section-head"><div><h2>${c.selected}</h2><p>${c.selectedSub}</p></div></div><div class="feature-grid">${card(href(lang,'work'),'work',c.work,c.workText)}${card(href(lang,'games'),'games',c.games,c.gamesText)}${card(href(lang,'life'),'life',c.life,c.lifeText)}</div></section>
  <section class="content-section updates-preview"><div class="section-head"><div><h2>${c.latest}</h2><p>${c.latestSub}</p></div><a class="text-link" href="${href(lang,'updates')}">${c.allUpdates} <span>${uiIcon(ArrowUpRight)}</span></a></div><div class="updates-grid"><a class="update-feature" href="${href(lang,'updates')}"><div class="update-icon" aria-hidden="true">${uiIcon(NotebookPen)}</div><div><span class="eyebrow">${c.label}</span><h3>${c.updateTitle}</h3><p>${c.updateText}</p></div><span class="update-arrow" aria-hidden="true">${uiIcon(ArrowUpRight)}</span></a><div class="update-soon"><h3>${c.next}</h3><p>${c.nextText}</p></div></div></section>`; }

function pageIntro(c) { return `<section class="page-intro"><div class="page-intro-art" aria-hidden="true"><span>✦</span><span>▦</span><span>✧</span></div><div class="page-intro-inner"><span class="eyebrow"><span class="status-dot"></span>${c.eyebrow}</span><h1>${c.heading}</h1><p>${c.lead}</p></div></section>`; }
function note(text) { return `<div class="page-note"><span aria-hidden="true">✳</span><p>${text}</p></div>`; }
function about(t) { const c=t.about; return `${pageIntro(c)}<section class="content-section inner-content"><div class="about-grid">${c.blocks.map(([h,p],i)=>`<article class="info-card"><span class="card-index">0${i+1}</span><h2>${h}</h2><p>${p}</p></article>`).join('')}</div>${note(c.prompt)}</section>`; }
function minecraft(t) { const c=t.minecraft; return `${pageIntro(c)}<section class="content-section inner-content"><div class="chip-row">${c.tabs.map(x=>`<span class="chip">${x}</span>`).join('')}</div><div class="portfolio-grid">${c.cards.map(([n,h,p],i)=>`<article class="portfolio-card"><div class="portfolio-image minecraft-image minecraft-image-${i+1}"><span class="placeholder-mark">▦</span><span class="image-number">${n}</span></div><div class="portfolio-copy"><span class="eyebrow">MINECRAFT / ${n}</span><h2>${h}</h2><p>${p}</p></div></article>`).join('')}</div>${note(c.note)}</section>`; }
function games(lang,t) { const c=t.games; return `${pageIntro(c)}<section class="content-section inner-content"><div class="portfolio-grid"><a class="portfolio-card game-link" href="${href(lang,'minecraft')}" aria-label="${c.minecraftOpen}"><div class="portfolio-image minecraft-image minecraft-image-1"><span class="placeholder-mark">▦</span><span class="image-number">01</span></div><div class="portfolio-copy"><span class="eyebrow">GAME / 01 ↗</span><h2>${c.minecraftTitle}</h2><p>${c.minecraftText}</p></div></a>${c.cards.map(([h,p],i)=>`<article class="portfolio-card"><div class="portfolio-image game-image game-image-${i+1}"><span class="placeholder-mark">${i?'✧':'✦'}</span><span class="image-number">0${i+2}</span></div><div class="portfolio-copy"><span class="eyebrow">GAME / 0${i+2}</span><h2>${h}</h2><p>${p}</p></div></article>`).join('')}</div>${note(c.note)}</section>`; }
function life(t) { const c=t.life; return `${pageIntro(c)}<section class="content-section inner-content"><div class="about-grid">${c.blocks.map(([h,p],i)=>`<article class="info-card"><span class="card-index">0${i+1}</span><h2>${h}</h2><p>${p}</p></article>`).join('')}</div>${note(c.note)}</section>`; }
function work(t) { const c=t.work; return `${pageIntro(c)}<section class="content-section inner-content"><div class="work-list">${c.cards.map(([tag,title,desc],i)=>`<article class="work-card"><div class="work-number">0${i+1}</div><div class="work-main"><span class="eyebrow">${tag}</span><h2>${title}</h2><p>${desc}</p><div class="work-meta"><span>${c.role}: ${c.pending}</span><span>${c.challenge}: ${c.pending}</span><span>${c.outcome}: ${c.pending}</span></div></div><div class="work-art" aria-hidden="true">◈</div></article>`).join('')}</div>${note(c.note)}</section>`; }
function updates(t) { const c=t.updates; return `${pageIntro(c)}<section class="content-section inner-content"><div class="timeline">${[[c.currentDate,c.currentTitle,c.currentText],[c.date,c.title,c.text]].map(([date,title,body])=>`<article class="timeline-entry"><span class="timeline-marker" aria-hidden="true"></span><span class="eyebrow">${date}</span><h2>${title}</h2><p>${body}</p></article>`).join('')}<div class="timeline-next"><span class="timeline-marker empty" aria-hidden="true"></span><p>${c.next}</p></div></div></section>`; }
function resume(t) { const c=t.resume; return `${pageIntro(c)}<section class="content-section inner-content"><div class="resume-list">${c.sections.map(([h,p],i)=>`<article class="resume-section"><span class="card-index">0${i+1}</span><div><h2>${h}</h2><p>${p}</p></div></article>`).join('')}</div>${note(c.note)}</section>`; }
const bodies = { '': home, about: (_lang,t)=>about(t), minecraft: (_lang,t)=>minecraft(t), games, work: (_lang,t)=>work(t), life: (_lang,t)=>life(t), updates: (_lang,t)=>updates(t), resume: (_lang,t)=>resume(t) };

function render(lang, route) {
  const t=copy[lang];
  const pageTitle = route ? `${t[route]?.heading ?? t.title} | Tiyamo` : `Tiyamo — ${t.nav.home}`;
  return `<!doctype html><html lang="${t.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#111b21"><title>${esc(pageTitle)}</title><meta name="description" content="${esc(t.description)}"><link rel="alternate" hreflang="en" href="${href('en',route)}"><link rel="alternate" hreflang="zh-CN" href="${href('zh',route)}"><link rel="icon" href="/assets/favicon.svg?v=2" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="/assets/styles.css"><link rel="stylesheet" href="/assets/design.css"><script src="/assets/app.js" defer></script>${route===''?'<script src="/assets/hero-wallpaper.js" defer></script><script src="/assets/card-interactions.js" defer></script>':''}</head><body class="route-${route||'home'}">${header(lang,route,t)}<main id="content">${bodies[route](lang,t)}</main>${footer(t)}</body></html>`;
}

for (const lang of ['en','zh']) for (const route of routes) {
  const dir=path.join(out, ...(lang==='zh'?['zh']:[]), ...(route?[route]:[]));
  fs.mkdirSync(dir,{recursive:true}); fs.writeFileSync(path.join(dir,'index.html'),render(lang,route));
}
buildSync({ entryPoints: ['src/card-interactions.js'], outfile: 'dist/assets/card-interactions.js', bundle: true, minify: true, format: 'iife', target: 'es2020' });
console.log(`Built ${routes.length * 2} localized pages in dist/`);
