// src/lib/smartsupp.ts
let loading: Promise<void> | null = null;

declare global {
  interface Window {
    smartsupp?: ((...args: any[]) => void) & { _: any[] };
    _smartsupp?: { key: string };
  }
}

export function loadSmartsupp(siteKey: string) {
  if (window.smartsupp) return Promise.resolve();
  if (loading) return loading;

  loading = new Promise<void>((resolve) => {
    window._smartsupp = window._smartsupp || { key: siteKey };

    const s = document.getElementsByTagName('script')[0];
    const c = document.createElement('script');
    // queue calls until the loader is ready

    c.type = 'text/javascript';
    c.charset = 'utf-8';
    c.async = true;
    c.src = 'https://www.smartsuppchat.com/loader.js?';
    c.onload = () => resolve();
    s.parentNode!.insertBefore(c, s);
  });

  return loading;
}


export async function identifySmartsuppUser(siteKey: string, email: string, name?: string) {
  await loadSmartsupp(siteKey);    
  if (window.smartsupp) {
    if (name) window.smartsupp('name', name);
    if (email) window.smartsupp('email', email);
    console.log("Smartsupp user identified:", { name, email });
    window.smartsupp('session:reload');
  }
}

export async function resetSmartsuppUser(siteKey: string) {
    await loadSmartsupp(siteKey);
    window.smartsupp && window.smartsupp('reset');
}

export async function openSmartsupp(siteKey: string) {
  await loadSmartsupp(siteKey);
  window.smartsupp && window.smartsupp('chat:open');   // ⬅️ open the widget
}