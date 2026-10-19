// Dados da loja. Para atualizar produtos, categorias e ofertas, edite apenas este arquivo.
//
// Fotos: coloque o arquivo na pasta indicada e informe o caminho.
//   Categorias -> images/categories/ ou images/products/ (proporção 3:4)
//   Produtos   -> images/products/ (proporção 4:5; a 2ª foto aparece ao passar o mouse)
// Sem foto, o site mostra um espaço reservado identificado.
// O banner principal e o banner do conjunto ficam no index.html (procure por "images/").

export const store = {
  whatsapp: '5583999976274', // usado nos botões de produto (mensagem com o nome do produto)
};

// `short` aparece em destaque no espaço reservado da foto.
export const categories = [
  { id: 'fitness', name: 'Roupas Fitness', short: 'Fitness', image: 'images/products/conjunto-cropped-short-rosa.jpg' },
  { id: 'acessorios', name: 'Bolsas e Acessórios', short: 'Bolsas', image: 'images/products/bolsa-compacta.jpg' },
  { id: 'capilares', name: 'Kits Capilares', short: 'Capilares', image: null },
  { id: 'oleos', name: 'Óleos', short: 'Óleos', image: null },
  { id: 'naturais', name: 'Produtos Naturais e Nutracêuticos', short: 'Naturais', image: null },
  { id: 'kits', name: 'Kits Especiais e Promocionais', short: 'Kits', image: null },
];

// Campos de cada produto:
//   name        nome do produto ('' = espaço reservado, aparece só no filtro da categoria)
//   color       cor ou variação mostrada abaixo do nome
//   category    id de uma categoria acima
//   images      lista de fotos (a primeira é a principal)
//   price       preço em reais (ex.: 89.9) ou null para "Preço sob consulta"
//   promoPrice  preço promocional ou null
//   description texto curto ou ''
//   available   false mostra "Esgotado"
//   buyUrl      link de compra próprio; null usa o WhatsApp com o nome do produto
// Os nomes abaixo descrevem as peças das fotos; troque pelos nomes usados na loja.
const p = (name, color, category, images, description = '') => ({
  name, color, category, images, price: null, promoPrice: null, description, available: true, buyUrl: null,
});
const img = (file) => `images/products/${file}`;

export const products = [
  p('Conjunto regata e short com bolsos', 'Preto', 'fitness',
    [img('conjunto-bolsos-preto.jpg'), img('conjunto-bolsos-preto-costas.jpg')], 'Bolsos laterais para celular e fone.'),
  p('Macacão longo costas cruzadas', 'Azul', 'fitness',
    [img('macacao-azul.jpg'), img('macacao-azul-costas.jpg')]),
  p('Conjunto regata e short com bolsos', 'Marrom', 'fitness',
    [img('conjunto-bolsos-marrom.jpg'), img('conjunto-bolsos-marrom-detalhe.jpg')], 'Bolsos laterais para celular e fone.'),
  p('Conjunto cropped e short', 'Rosa', 'fitness', [img('conjunto-cropped-short-rosa.jpg')]),
  p('Conjunto blusa de tule e legging', 'Preto', 'fitness', [img('conjunto-tule-preto.jpg')]),
  p('Macacão flare', 'Cinza', 'fitness', [img('macacao-flare-cinza.jpg')]),
  p('Conjunto manga longa e legging', 'Nude', 'fitness', [img('conjunto-manga-longa-nude.jpg')]),
  p('Conjunto blusa de tule e legging', 'Branco e lilás', 'fitness', [img('conjunto-tule-branco-lilas.jpg')]),
  p('Conjunto top e legging', 'Marrom', 'fitness', [img('conjunto-top-legging-marrom.jpg')]),
  p('Jaqueta leve', 'Branca', 'fitness', [img('jaqueta-branca.jpg')]),
  p('Blusa transpassada', 'Preta', 'fitness', [img('blusa-transpassada-preta.jpg')]),
  p('Conjunto regata e short com bolsos', 'Azul-marinho', 'fitness',
    [img('conjunto-bolsos-marinho.jpg')], 'Bolsos laterais para celular e fone.'),
  p('Conjunto cropped e short', 'Várias cores', 'fitness', [img('conjunto-cropped-short-pastel.jpg')]),
  p('Bolsa compacta', 'Várias cores', 'acessorios', [img('bolsa-compacta.jpg')]),

  // Espaços reservados até chegarem as fotos destas categorias.
  p('', '', 'capilares', []),
  p('', '', 'oleos', []),
  p('', '', 'naturais', []),
  p('', '', 'kits', []),
];

// Campanha de kits e ofertas. Com `title` vazio, a seção mostra o convite genérico.
export const promo = {
  title: '',
  description: '',
  price: null,
  period: '', // ex.: 'Válida até 30/11'
  image: null, // ex.: 'images/banners/kits-ofertas.jpg' (proporção 4:5)
};
