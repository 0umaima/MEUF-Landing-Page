// Public configuration. Never put access tokens or private keys here.
export const config = Object.freeze({
  productId: 'bardot-oversize', name: 'Top Bardot Oversize',
  price: 129, oldPrice: 200, promotion: true,
  colors: [{id:'noir',name:'Noir',ar:'أسود',hex:'#141414'},{id:'kaki',name:'Kaki',ar:'كاكي',hex:'#55553c'},{id:'marron',name:'Marron',ar:'بني',hex:'#663b2c'}],
  sizes: ['S','M','L','XL'], maxQuantity: 10,
  // Set the actual delivery fee (MAD), including 0 only if genuinely free.
  shippingFee: null,
  // Set false only AFTER configuring the backend and actual delivery fee.
  demoMode: true,
  metaPixelId: '', // Your public Meta dataset/pixel ID
  turnstileSiteKey: '' // Public Cloudflare Turnstile site key
});
