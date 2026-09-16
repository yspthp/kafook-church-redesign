/**
 * 迦福堂 導航列元件 (Navbar Component)
 */

export function createNavbar(activePage = '') {
  const navItems = [
    { id: 'home', label: '首頁', href: 'index.html' },
    { id: 'about', label: '關於我們', href: 'about.html' },
    { id: 'events', label: '活動聚會', href: 'events.html' },
    { id: 'news', label: '最新消息', href: 'news.html' },
    { id: 'prayer', label: '代禱事項', href: 'prayer.html' },
    { id: 'giving', label: '奉獻支持', href: 'giving.html' },
    { id: 'contact', label: '聯絡我們', href: 'contact.html' },
  ];

  const navLinksHtml = navItems.map(item => `
    <li class="nav-item">
      <a href="${item.href}" class="nav-link ${activePage === item.id ? 'active' : ''}">${item.label}</a>
    </li>
  `).join('');

  return `
    <header class="site-header" id="siteHeader">
      <div class="nav-container">
        <a href="index.html" class="logo-link">
          <div class="logo-emblem">迦</div>
          <div class="logo-text-group">
            <span class="logo-church-name">五旬節聖潔會迦福堂</span>
            <span class="logo-subtext">Ka Fook Pentecostal Holiness Church</span>
          </div>
        </a>

        <ul class="nav-menu" id="navMenu">
          ${navLinksHtml}
        </ul>

        <div class="nav-actions">
          <a href="giving.html" class="nav-btn">網上奉獻</a>
          <button class="mobile-menu-toggle" id="menuToggle" aria-label="切換選單">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  `;
}

export default createNavbar;
