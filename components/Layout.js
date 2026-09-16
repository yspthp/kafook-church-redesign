/**
 * 迦福堂 統一版面元件 (Unified Layout Component)
 * 解決 Layout / SiteLayout 預設與具名匯出混用之相容性問題
 */

import { createNavbar } from './Navbar.js';
import { createFooter } from './Footer.js';

export function Layout({ activePage = '', children = '', title = '五旬節聖潔會迦福堂' } = {}) {
  return `
    <div class="site-wrapper">
      ${createNavbar(activePage)}
      <main class="site-main" id="mainContent">
        ${children}
      </main>
      ${createFooter()}
    </div>
  `;
}

// 支援具名匯出 SiteLayout
export const SiteLayout = Layout;

// 支援預設匯出
export default Layout;
