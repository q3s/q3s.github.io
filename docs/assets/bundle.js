---
---
{% capture build_number %}{{ site.github.build_revision }}{{ site.time | date: '%Y%m%d%H%M%S' }}{% endcapture %}
import { oom, pako, QRCode, ZXing, Dexie } from './external.js?v={{ build_number }}';

const { navigator } = window;
if ('serviceWorker' in navigator) {
  (async () => {
    const { serviceWorker } = navigator;
    const regSW = await serviceWorker.getRegistration();
    if (regSW && regSW.active && !regSW.active.scriptURL.endsWith('{{ build_number }}')) {
      await regSW.unregister('/');
    }
    await serviceWorker.register('/offline.js?v={{ build_number }}', { scope: '/' });
    console.log('serviceWorker succeeded: v={{ build_number }}');
  })().catch(console.error);
}

console.log('oom:', oom);
console.log('pako:', pako);
console.log('QRCode:', QRCode);
console.log('ZXing:', ZXing);
console.log('Dexie:', Dexie);
