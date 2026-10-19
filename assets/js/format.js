const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const money = (value) => brl.format(value);

export const waLink = (number, text) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

// Produto provisório (sem nome) pergunta pela categoria em vez de um item inexistente.
export function productMessage(product, categoryName) {
  if (!product.name) return `Olá! Quero conhecer os produtos de ${categoryName} da Bella e Natural.`;
  const name = product.color ? `${product.name} (${product.color})` : product.name;
  if (product.available === false) return `Olá! O produto ${name} da Bella e Natural vai voltar ao estoque?`;
  return `Olá! Tenho interesse no produto ${name} da Bella e Natural.`;
}
