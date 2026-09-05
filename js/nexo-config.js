/* Public configuration only. Never place AI API keys or VAPID private keys here. */
window.NEXO_CONFIG = window.NEXO_CONFIG || {
  /* Paste ONLY the public VAPID key here after generating it. */
  vapidPublicKey: '',
  /* Optional: WhatsApp community URL shared by VIP/Distributor users. */
  communityUrl: '',
  supportWhatsApp: '922535293',
};
window.NEXO_VAPID_PUBLIC_KEY = String(window.NEXO_CONFIG.vapidPublicKey || '').trim();
