/*
 * Repoint Calculator — easy site-wide theme & branding controls.
 * Installation: add <script src="./site-theme.js"></script> before </body> in index.html.
 * To change the default for ALL visitors, edit SITE_OPTIONS below and commit this file.
 * A visitor's selector preference is saved only in THAT visitor's browser.
 */
(() => {
  'use strict';

  // ==============================================================
  // تنظیمات اصلی سایت — فقط این قسمت را ویرایش کن
  // ==============================================================
  const SITE_OPTIONS = {
    // orange | ocean | violet | green | dark | custom | custom-dark
    defaultTheme: 'dark',

    // رنگ‌های دلخواه فقط برای custom و custom-dark
    primaryColor: '#f97316',
    secondaryColor: '#f59e0b',
    backgroundColor: '#f8fafc',
    cardColor: '#ffffff',
    textColor: '#1e293b',
    darkBackgroundColor: '#0b1220',
    darkCardColor: '#182235',

    // رنگ دکمه تلگرام و تنظیمات کانال
    telegramColor: '#229ED9',
    telegramUrl: 'https://t.me/RepointFalcon',
    telegramButtonText: 'کانال تلگرام ریپوینت پلاس',

    // عنوان تب مرورگر — برای حفظ عنوان فعلی می‌توانی همین را بگذاری
    browserTitle: 'ماشین‌حساب سود مرکب ریپوینت | Repoint Calculator',

    // نمایش فهرست انتخاب تم به بازدیدکنندگان (تغییر فقط در مرورگرشان ذخیره می‌شود)
    showThemeSelector: true,

    // تنظیم رنگ جدول‌های سالانه در تم custom (سایر تم‌ها رنگ‌های اصلی را نگه می‌دارند)
    customYearColors: {
      blue: '#3b82f6',
      emerald: '#10b981',
      purple: '#a855f7',
      indigo: '#6366f1',
      pink: '#ec4899',
      teal: '#14b8a6'
    }
  };
  // ====================== پایان تنظیمات ===========================

  const PRESETS = {
    orange: { label: '🟠 نارنجی اصلی', primary: '#f97316', secondary: '#f59e0b' },
    ocean: { label: '🔵 آبی اقیانوسی', primary: '#2563eb', secondary: '#06b6d4' },
    violet: { label: '🟣 بنفش', primary: '#7c3aed', secondary: '#a855f7' },
    green: { label: '🟢 سبز', primary: '#059669', secondary: '#84cc16' },
    dark: { label: '🌙 تیره و طلایی', primary: '#fbbf24', secondary: '#fb923c', dark: true },
    custom: { label: '🎨 رنگ دلخواه', custom: true },
    'custom-dark': { label: '🎨 رنگ دلخواه تیره', custom: true, dark: true }
  };

  // رنگ‌های اصلی Tailwind که در سورس فعلی سایت استفاده می‌شوند.
  // در تم نارنجی هیچ رنگی بازنویسی نمی‌شود: ظاهر دقیقاً مانند کد اصلی می‌ماند.
  const STANDARD = {
    slate: {
      50: '#f8fafc', 100: '#f1f5f9', 150: '#e9eef5', 200: '#e2e8f0',
      300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569',
      700: '#334155', 800: '#1e293b', 900: '#0f172a'
    },
    orange: { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12' },
    amber: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f' },
    blue: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a' },
    emerald: { 50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b' },
    purple: { 50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce', 800: '#6b21a8', 900: '#581c87' },
    indigo: { 50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81' },
    pink: { 50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4', 400: '#f472b6', 500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d', 900: '#831843' },
    teal: { 50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a' }
  };

  const STEPS = [50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 900];
  const THEME_STORAGE_KEY = 'repoint-calculator-theme-preview-v1';
  const style = document.createElement('style');
  style.id = 'personalized-site-theme';
  document.head.appendChild(style);

  function rgb(hex) {
    const normalized = String(hex).trim();
    const short = /^#([0-9a-f]{3})$/i.exec(normalized);
    const full = /^#([0-9a-f]{6})$/i.exec(normalized);
    const val = short ? short[1].split('').map(x => x + x).join('') : full ? full[1] : null;
    if (!val) return null;
    return [0, 2, 4].map(i => parseInt(val.slice(i, i + 2), 16));
  }
  function goodHex(color, fallback) { return rgb(color) ? color : fallback; }
  function mix(colorA, colorB, amount) {
    const a = rgb(colorA), b = rgb(colorB);
    const t = Math.max(0, Math.min(1, amount));
    return '#' + a.map((v, i) => Math.round(v * (1 - t) + b[i] * t).toString(16).padStart(2, '0')).join('');
  }
  function scale(base) {
    return {
      50: mix('#ffffff', base, .07), 100: mix('#ffffff', base, .15),
      150: mix('#ffffff', base, .24), 200: mix('#ffffff', base, .30),
      300: mix('#ffffff', base, .47), 400: mix('#ffffff', base, .73),
      500: base, 600: mix(base, '#111827', .14),
      700: mix(base, '#111827', .30), 800: mix(base, '#111827', .48),
      900: mix(base, '#111827', .62)
    };
  }
  function darkScale(base, background) {
    return {
      50: mix(background, base, .10), 100: mix(background, base, .19),
      150: mix(background, base, .23), 200: mix(background, base, .32),
      300: mix(background, base, .43), 400: mix(background, base, .70),
      500: base, 600: mix(base, '#ffffff', .16),
      700: mix(base, '#ffffff', .30), 800: mix(base, '#ffffff', .42),
      900: mix(base, '#ffffff', .53)
    };
  }
  function darkSlate(background, card) {
    return {
      50: background, 100: mix(card, '#ffffff', .04),
      150: mix(card, '#ffffff', .08), 200: mix(card, '#ffffff', .17),
      300: '#64748b', 400: '#94a3b8', 500: '#aebdd0',
      600: '#cbd5e1', 700: '#e2e8f0', 800: '#f1f5f9', 900: '#f8fafc'
    };
  }
  function customSlate(background, text) {
    return {
      ...STANDARD.slate,
      50: background,
      700: mix(text, '#ffffff', .22), 800: text,
      900: mix(text, '#000000', .13)
    };
  }
  function cssEscape(value) {
    if (typeof CSS !== 'undefined' && CSS.escape) return CSS.escape(value);
    return value.replace(/[^\w-]/g, ch => '\\' + ch);
  }
  function colorCss(hex, opacity) {
    const c = rgb(hex);
    return `rgb(${c[0]} ${c[1]} ${c[2]} / ${opacity == null ? 1 : opacity})`;
  }

  // همه کلاس‌های رنگ داخل HTML و قالب‌های جاوااسکریپت شناسایی می‌شوند.
  // بنابراین جدول‌هایی که بعداً ساخته شوند هم همین تم را دریافت می‌کنند.
  const tokenPattern = /(?:hover:|focus:)?(?:bg|text|border|from|to)-(?:slate|orange|amber|blue|emerald|purple|indigo|pink|teal)-\d{2,3}(?:\/\d{1,3})?/g;
  const source = document.documentElement.outerHTML;
  const tokens = [...new Set(source.match(tokenPattern) || [])];

  function buildRules(colors) {
    let css = '';
    for (const token of tokens) {
      const match = /^(?:(hover|focus):)?(bg|text|border|from|to)-([a-z]+)-(\d{2,3})(?:\/(\d{1,3}))?$/.exec(token);
      if (!match) continue;
      const [, state, kind, family, shade, alpha] = match;
      const hex = colors[family] && colors[family][Number(shade)];
      if (!hex) continue;
      const selector = `.${cssEscape(token)}${state ? ':' + state : ''}`;
      const value = colorCss(hex, alpha == null ? null : Math.min(100, +alpha) / 100);
      let declaration;
      if (kind === 'bg') declaration = `background-color:${value}!important;`;
      if (kind === 'text') declaration = `color:${value}!important;`;
      if (kind === 'border') declaration = `border-color:${value}!important;`;
      if (kind === 'from') declaration = `--tw-gradient-from:${value} var(--tw-gradient-from-position)!important;--tw-gradient-to:${colorCss(hex, 0)} var(--tw-gradient-to-position)!important;`;
      if (kind === 'to') declaration = `--tw-gradient-to:${value} var(--tw-gradient-to-position)!important;`;
      if (declaration) css += `${selector}{${declaration}}\n`;
    }
    return css;
  }

  let themeSelector;
  function applyTheme(themeName) {
    const name = Object.prototype.hasOwnProperty.call(PRESETS, themeName) ? themeName : 'orange';
    const preset = PRESETS[name];
    const custom = !!preset.custom;
    const isDark = !!preset.dark;
    const primary = goodHex(custom ? SITE_OPTIONS.primaryColor : preset.primary, '#f97316');
    const secondary = goodHex(custom ? SITE_OPTIONS.secondaryColor : preset.secondary, '#f59e0b');
    const background = isDark
      ? goodHex(SITE_OPTIONS.darkBackgroundColor, '#0b1220')
      : custom ? goodHex(SITE_OPTIONS.backgroundColor, '#f8fafc') : '#f8fafc';
    const card = isDark
      ? goodHex(SITE_OPTIONS.darkCardColor, '#182235')
      : custom ? goodHex(SITE_OPTIONS.cardColor, '#ffffff') : '#ffffff';
    const text = isDark ? '#f1f5f9' : goodHex(SITE_OPTIONS.textColor, '#1e293b');

    let colors = {};
    let extra = '';
    if (name !== 'orange') {
      colors.orange = isDark ? darkScale(primary, background) : scale(primary);
      colors.amber = isDark ? darkScale(secondary, background) : scale(secondary);
      if (isDark) {
        colors.slate = darkSlate(background, card);
        for (const family of ['blue', 'emerald', 'purple', 'indigo', 'pink', 'teal']) {
          const chosen = custom ? goodHex(SITE_OPTIONS.customYearColors[family], STANDARD[family][500]) : STANDARD[family][500];
          colors[family] = darkScale(chosen, background);
        }
      } else if (custom) {
        colors.slate = customSlate(background, text);
        for (const family of ['blue', 'emerald', 'purple', 'indigo', 'pink', 'teal']) {
          const chosen = goodHex(SITE_OPTIONS.customYearColors[family], STANDARD[family][500]);
          colors[family] = scale(chosen);
        }
      }
      if (isDark || custom) {
        extra = `body{background-color:${background}!important;color:${text}!important;}\n` +
          `.bg-white{background-color:${card}!important;}\n`;
        if (custom && !isDark) extra += `.bg-slate-50{background-color:${background}!important;}\n`;
      }
    }
    const styles = `
      .site-theme-selector{font:600 12px Vazirmatn,sans-serif;max-width:175px;padding:8px 12px;border-radius:12px;border:1px solid ${isDark ? '#475569' : '#e2e8f0'};outline:none;background:${isDark ? card : '#fff'};color:${isDark ? '#f1f5f9' : '#334155'};cursor:pointer;}
      .site-theme-selector:focus{outline:2px solid ${primary};outline-offset:2px;}
      #site-theme-telegram-button{background-color:${goodHex(SITE_OPTIONS.telegramColor, '#229ED9')}!important;}
      #site-theme-telegram-button:hover{filter:brightness(.90)}
      ${extra}${buildRules(colors)}`;
    style.textContent = styles;
    if (themeSelector) themeSelector.value = name;
    document.documentElement.dataset.siteTheme = name;
    return name;
  }

  const telegramButton = [...document.querySelectorAll('a[href]')]
    .find(a => /^https?:\/\/(?:www\.)?t\.me\//i.test(a.getAttribute('href')));
  if (telegramButton) {
    telegramButton.id = 'site-theme-telegram-button';
    if (/^https:\/\/t\.me\/[a-zA-Z0-9_+/-]+$/.test(SITE_OPTIONS.telegramUrl)) {
      telegramButton.href = SITE_OPTIONS.telegramUrl;
    }
    if (SITE_OPTIONS.telegramButtonText) {
      const textNode = telegramButton.querySelector('span');
      if (textNode) textNode.textContent = SITE_OPTIONS.telegramButtonText;
    }
  }
  if (SITE_OPTIONS.browserTitle) document.title = SITE_OPTIONS.browserTitle;

  let currentTheme = SITE_OPTIONS.defaultTheme;
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && PRESETS[saved]) currentTheme = saved;
  } catch (_) { /* Storage disabled; default theme still works. */ }

  if (SITE_OPTIONS.showThemeSelector) {
    const header = document.querySelector('header > div');
    if (header) {
      themeSelector = document.createElement('select');
      themeSelector.id = 'site-theme-selector';
      themeSelector.className = 'site-theme-selector';
      themeSelector.title = 'تغییر تم فقط در مرورگر شما ذخیره می‌شود؛ تم پیش‌فرض سایت در فایل site-theme.js تنظیم می‌شود.';
      themeSelector.setAttribute('aria-label', 'انتخاب رنگ و تم سایت');
      for (const [name, config] of Object.entries(PRESETS)) {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = config.label;
        themeSelector.appendChild(option);
      }
      const controls = document.createElement('div');
      controls.className = 'flex flex-wrap justify-center items-center gap-2';
      controls.appendChild(themeSelector);
      if (telegramButton && telegramButton.parentElement === header) controls.appendChild(telegramButton);
      header.appendChild(controls);
      themeSelector.addEventListener('change', () => {
        applyTheme(themeSelector.value);
        try { localStorage.setItem(THEME_STORAGE_KEY, themeSelector.value); } catch (_) {}
      });
    }
  }
  applyTheme(currentTheme);
})();
