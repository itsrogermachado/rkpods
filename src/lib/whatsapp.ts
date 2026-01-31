import { CartItem, Address, Coupon } from '@/types';

interface WhatsAppMessageOptions {
  items: CartItem[];
  address: Address;
  subtotal: number;
  coupon?: Coupon | null;
  couponDiscount?: number;
  finalTotal: number;
  zoneName?: string;
}

export function generateWhatsAppMessage(options: WhatsAppMessageOptions): string {
  const { items, address, subtotal, coupon, couponDiscount = 0, finalTotal, zoneName } = options;

  const productLines = items.map(item => 
    `• ${item.quantity}x ${item.product.name} - R$ ${(item.product.price * item.quantity).toFixed(2).replace('.', ',')}`
  ).join('\n');

  const addressLine = [
    `${address.street}, ${address.number}`,
    address.complement ? ` - ${address.complement}` : '',
    `\n${address.neighborhood}`,
    `\n${address.city}`,
    address.cep ? `\nCEP: ${address.cep}` : '',
    address.reference ? `\nRef: ${address.reference}` : ''
  ].join('');

  let totalSection = '';
  if (coupon && couponDiscount > 0) {
    totalSection = `*💵 Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}*
*🎟️ Cupom (${coupon.code}): -R$ ${couponDiscount.toFixed(2).replace('.', ',')}*
*💰 Total: R$ ${finalTotal.toFixed(2).replace('.', ',')}*`;
  } else {
    totalSection = `*💰 Total: R$ ${finalTotal.toFixed(2).replace('.', ',')}*`;
  }

  const message = `*🛒 NOVO PEDIDO - RKPODS*
${zoneName ? `\n*📍 Zona: ${zoneName}*` : ''}

*Produtos:*
${productLines}

*📍 Endereço de Entrega:*
${addressLine}

${totalSection}

---
Por favor, confirme a disponibilidade e o prazo de entrega.`;

  return message;
}

export function getWhatsAppLink(message: string, whatsappNumber: string): string {
  return `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
}
