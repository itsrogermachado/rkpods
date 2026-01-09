import { CartItem, Address } from '@/types';

const WHATSAPP_NUMBER = '5521979265042';

export function generateWhatsAppMessage(items: CartItem[], address: Address, total: number): string {
  const productLines = items.map(item => 
    `• ${item.quantity}x ${item.product.name} - R$ ${(item.product.price * item.quantity).toFixed(2).replace('.', ',')}`
  ).join('\n');

  const addressLine = [
    `${address.street}, ${address.number}`,
    address.complement ? ` - ${address.complement}` : '',
    `\n${address.neighborhood}`,
    `\n${address.city} - ${address.state}`,
    `\nCEP: ${address.cep}`,
    address.reference ? `\nRef: ${address.reference}` : ''
  ].join('');

  const message = `*🛒 NOVO PEDIDO - RKPODS*

*Produtos:*
${productLines}

*📍 Endereço de Entrega:*
${addressLine}

*💰 Total: R$ ${total.toFixed(2).replace('.', ',')}*

---
Por favor, confirme a disponibilidade e o prazo de entrega.`;

  return message;
}

export function getWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
