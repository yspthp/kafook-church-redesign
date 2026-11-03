/* Ka Fook dynamic content, auth, member area and staff CMS (with DOMPurify XSS protection). */
(function () {
  'use strict';
  const config = window.KF_SUPABASE_CONFIG;
  const page = location.pathname.split('/').pop() || 'index.html';
  const state = { client: null, user: null, role: 'guest' };
  const esc = (value) => String(value ?? '');
  const fmt = (value) => value ? new Intl.DateTimeFormat('zh-HK', { dateStyle: 'medium' }).format(new Date(value)) : '';
  const html = (tag, attrs = {}, text = '') => {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    if (text) el.textContent = text;
    return el;
  };
  const setStatus = (el, text, kind = '') => {
    if (!el) return;
    el.textContent = text;
    el.className = `cms-status ${kind}`.trim();
  };
  const addScript = (src) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });

  // Sanitize rich HTML from Quill.js via DOMPurify before injecting into innerHTML
  function sanitizeRichHtml(dirtyHtml) {
    if (!dirtyHtml) return '';
    if (window.DOMPurify) {
      return window.DOMPurify.sanitize(String(dirtyHtml), {
        USE_PROFILES: { html: true },
        ADD_ATTR: ['target', 'rel', 'loading']
      });
    }
    const fallbackEl = document.createElement('div');
    fallbackEl.textContent = String(dirtyHtml);
    return fallbackEl.innerHTML;
  }

  function makeRichContentNode(htmlStr, plainText) {
    const wrapper = html('div', { class: 'cms-rich-content' });
    const trimmedHtml = String(htmlStr ?? '').trim();
    if (trimmedHtml && trimmedHtml !== '<p><br></p>') {
      wrapper.innerHTML = sanitizeRichHtml(trimmedHtml);
      wrapper.querySelectorAll('a').forEach((a) => {
        if (a.getAttribute('target') === '_blank') {
          a.setAttribute('rel', 'noopener noreferrer');
        }
      });
      wrapper.querySelectorAll('img').forEach((img) => {
        img.setAttribute('loading', 'lazy');
      });
    } else if (plainText) {
      wrapper.append(html('p', {}, String(plainText)));
    }
    return wrapper;
  }

  async function boot() {
    if (page === 'admin.html' && window.KF_ADMIN_DASHBOARD) return;
    if (!config?.url || !config?.anonKey) return fallback('未設定 CMS 連線，保留原有內容。');
    try {
      if (!window.supabase) {
        await addScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
      }
      if (!window.DOMPurify) {
        await addScript('https://cdn.jsdelivr.net/npm/dompurify@3.1.7/dist/purify.min.js');
      }
      state.client = window.supabase.createClient(config.url, config.anonKey);
      const { data } = await state.client.auth.getSession();
      await syncUser(data.session?.user || null);
      state.client.auth.onAuthStateChange((_event, session) => syncUser(session?.user || null));
      injectNav();
      if (page === 'index.html' || page === '') await renderHome();
      if (page === 'news.html') await renderNotices(ensureTarget('dynamicNotices', '最新動態通告', 'LIVE NOTICES'));
      if (page === 'events.html') await renderEvents(ensureTarget('dynamicEvents', '特別聚會與焦點活動', 'FEATURED EVENTS'));
      if (page === 'prayer.html') await renderPrayers(ensureTarget('dynamicPrayers', '最新代禱事項', 'PRAYER WALL'));
      if (page === 'members.html') await initMembers();
      if (page === 'admin.html' && !window.KF_ADMIN_DASHBOARD) await initAdmin();
    } catch (error) {
      console.warn('[KF CMS]', error);
      fallback('目前暫時無法連線，仍可瀏覽頁面上的固定內容。');
    }
  }

  async function syncUser(user) {
    state.user = user;
    state.role = 'guest';
    if (user && state.client) {
      const { data } = await state.client.from('profiles').select('role,display_name').eq('id', user.id).maybeSingle();
      state.role = data?.role || user.user_metadata?.role || 'member';
      state.displayName = data?.display_name || user.email;
    }
  }

  function fallback(message) {
    document.querySelectorAll('[data-cms-status]').forEach((el) => setStatus(el, message, 'muted'));
  }

  function injectNav() {
    const nav = document.querySelector('#navMenu');
    if (!nav || nav.querySelector('[data-auth-link]')) return;
    const item = html('li', { class: 'nav-item', 'data-auth-link': '' });
    const link = html(
      'a',
      {
        class: 'nav-link',
        href: state.user ? (['admin', 'staff'].includes(state.role) ? 'admin.html' : 'members.html') : 'members.html'
      },
      state.user ? (['admin', 'staff'].includes(state.role) ? 'CMS 後台' : '會友專區') : '會友登入'
    );
    item.append(link);
    nav.append(item);
  }

  function ensureTarget(id, title, eyebrow) {
    let target = document.getElementById(id);
    if (target) return target;
    const main = document.querySelector('main');
    if (!main) return null;
    const section = html('section', { class: 'cms-section section' });
    const container = html('div', { class: 'container' });
    const heading = html('div', { class: 'section-header' });
    heading.append(
      html('span', { class: 'section-subtitle' }, eyebrow),
      html('h2', { class: 'section-title' }, title)
    );
    target = html('div', { id, class: 'cms-list', 'data-cms-status': '' });
    section.append(container);
    container.append(heading, target);
    main.append(section);
    return target;
  }

  async function renderNotices(target, member = false) {
    if (!target || !state.client) return;
    target.replaceChildren();
    const query = member
      ? state.client.from('notices').select('*').in('visibility', ['members', 'public']).order('published_at', { ascending: false })
      : state.client.from('notices').select('*').eq('visibility', 'public').order('published_at', { ascending: false });
    const { data, error } = await query;
    if (error) return setStatus(target, '暫時無法載入動態通告，請稍後再試。', 'error');
    if (!data?.length) return setStatus(target, member ? '目前沒有會友專屬通告。' : '目前沒有新的動態通告。', 'muted');
    target.className = 'cms-list';
    data.forEach((item) => target.append(makeNotice(item)));
  }

  function makeNotice(item) {
    const article = html('article', { class: 'cms-item' });
    article.append(
      html('div', { class: 'cms-item-meta' }, `${esc(item.category || '堂會消息')} · ${fmt(item.published_at)}`),
      html('h3', {}, item.title),
      makeRichContentNode(item.content_html, item.content)
    );
    if (item.attachment_path && state.user) {
      const link = html('button', { class: 'cms-download', type: 'button' }, '下載附件 ↗');
      link.addEventListener('click', async () => {
        const { data, error } = await state.client.storage.from('member-documents').createSignedUrl(item.attachment_path, 120);
        if (error) return setStatus(article, '附件暫時無法下載。', 'error');
        window.open(data.signedUrl, '_blank', 'noopener');
      });
      article.append(link);
    }
    return article;
  }

  async function renderEvents(target) {
    if (!target || !state.client) return;
    target.replaceChildren();
    const { data, error } = await state.client
      .from('events')
      .select('*')
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(6);
    if (error) return setStatus(target, '暫時無法載入活動資料。', 'error');
    if (!data?.length) return setStatus(target, '目前沒有額外的特別聚會。', 'muted');
    target.className = 'cms-list';
    data.forEach((item) => {
      const card = html('article', { class: 'cms-item' });
      const meta = `${esc(item.category || '特別聚會')} · ${fmt(item.starts_at)}${item.location ? ` · ${esc(item.location)}` : ''}`;
      card.append(
        html('div', { class: 'cms-item-meta' }, meta),
        html('h3', {}, item.title),
        makeRichContentNode(item.content_html, item.description)
      );
      target.append(card);
    });
  }

  async function renderPrayers(target) {
    if (!target || !state.client) return;
    target.replaceChildren();
    const { data, error } = await state.client
      .from('prayer_requests')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(20);
    if (error) return setStatus(target, '暫時無法載入代禱資料。', 'error');
    if (!data?.length) return setStatus(target, '目前沒有新的代禱事項。', 'muted');
    target.className = 'cms-list';
    data.forEach((item) => {
      const card = html('article', { class: 'cms-item prayer-cms-item' });
      card.append(
        html('div', { class: 'cms-item-meta' }, `${esc(item.category || '堂會代禱')} · ${fmt(item.published_at)}`),
        html('h3', {}, item.title),
        makeRichContentNode(item.content_html, item.content)
      );
      target.append(card);
    });
  }

  async function renderHome() {
    await renderNotices(ensureTarget('dynamicHomeNotices', '最新動態通告', 'LATEST NOTICES'));
    await renderEvents(ensureTarget('dynamicHomeEvents', '近期特別聚會', 'UPCOMING EVENTS'));
  }

  async function initMembers() {
    const login = document.querySelector('#memberLogin'),
      panel = document.querySelector('#memberPanel'),
      status = document.querySelector('[data-member-status]');
    const refresh = () => {
      if (state.user) {
        login?.classList.add('is-hidden');
        panel?.classList.remove('is-hidden');
        setStatus(status, `已登入：${state.displayName || state.user.email}`, 'success');
        renderNotices(document.querySelector('#memberNotices'), true);
      } else {
        login?.classList.remove('is-hidden');
        panel?.classList.add('is-hidden');
        setStatus(status, '請登入以查看會友專區。', 'muted');
      }
    };
    refresh();
    document.querySelector('#memberLoginForm')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      setStatus(status, '登入中…');
      const { error } = await state.client.auth.signInWithPassword({
        email: form.email.value.trim(),
        password: form.password.value
      });
      if (error) return setStatus(status, '登入失敗，請檢查電郵及密碼。', 'error');
      await syncUser((await state.client.auth.getUser()).data.user);
      injectNav();
      refresh();
    });
    document.querySelector('#memberLogout')?.addEventListener('click', async () => {
      await state.client.auth.signOut();
      state.user = null;
      state.role = 'guest';
      injectNav();
      refresh();
    });
  }

  async function initAdmin() {
    const gate = document.querySelector('#adminGate'),
      app = document.querySelector('#adminApp'),
      status = document.querySelector('[data-admin-status]');
    if (!state.user || !['admin', 'staff'].includes(state.role)) {
      gate?.classList.remove('is-hidden');
      app?.classList.add('is-hidden');
      return;
    }
    gate?.classList.add('is-hidden');
    app?.classList.remove('is-hidden');
  }

  boot();
})();
