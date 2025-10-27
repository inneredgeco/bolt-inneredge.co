import { useEffect } from 'react';

declare global {
  interface Window {
    FlodeskObject?: string;
    fd?: (...args: any[]) => void;
  }
}

export default function FlodeskPopup() {
  useEffect(() => {
    const existingScript = document.querySelector('script[src*="flodesk"]');
    if (!existingScript) {
      (function (w: any, d: Document, t: string, h: string, s: string, n: string) {
        w.FlodeskObject = n;
        const fn = function () {
          (w[n].q = w[n].q || []).push(arguments);
        };
        w[n] = w[n] || fn;

        const f = d.getElementsByTagName(t)[0];
        const v = '?v=' + Math.floor(new Date().getTime() / (120 * 1000)) * 60;

        const sm = d.createElement(t) as HTMLScriptElement;
        sm.async = true;
        sm.type = 'module';
        sm.src = h + s + '.mjs' + v;
        f.parentNode?.insertBefore(sm, f);

        const sn = d.createElement(t) as HTMLScriptElement;
        sn.async = true;
        sn.noModule = true;
        sn.src = h + s + '.js' + v;
        f.parentNode?.insertBefore(sn, f);
      })(window, document, 'script', 'https://assets.flodesk.com', '/universal', 'fd');
    }

    window.fd?.('form', {
      formId: '68e552cc1dc25799378e8219',
    });
  }, []);

  return null;
}
