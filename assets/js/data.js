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
  { id: 'beleza', name: 'Beleza e Cosméticos', short: 'Beleza', image: 'images/products/linha-rosa-mosqueta.jpg' },
  { id: 'capilares', name: 'Kits Capilares', short: 'Capilares', image: 'images/products/kit-banho-de-verniz.jpg' },
  { id: 'naturais', name: 'Produtos Naturais e Nutracêuticos', short: 'Naturais', image: 'images/products/power-day-creatina.jpg' },
  { id: 'kits', name: 'Kits Especiais e Promocionais', short: 'Kits', image: 'images/products/kit-rosa-mosqueta.jpg' },
  { id: 'acessorios', name: 'Bolsas e Acessórios', short: 'Bolsas', image: 'images/products/bolsa-compacta.jpg' },
  { id: 'oleos', name: 'Óleos', short: 'Óleos', image: 'images/products/oleo-essencial-lavanda.jpg' },
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
// Roupas e bolsa: os nomes descrevem as peças das fotos; troque pelos nomes usados na loja.
// Cosméticos, capilares, óleos e suplementos: nomes e descrições tirados das embalagens e artes da Flora Pura.
const p = (name, color, category, images, description = '') => ({
  name, color, category, images, price: null, promoPrice: null, description, available: true, buyUrl: null,
});
const img = (file) => `images/products/${file}`;

export const products = [
  p('Linha Flora Care Rosa Mosqueta', 'Flora Pura', 'beleza', [img('linha-rosa-mosqueta.jpg')],
    'Mousse micelar, sérum facial, sabonete em gel facial, água de beleza e creme facial.'),
  p('Kit Banho de Verniz', 'Flora Pura', 'capilares', [img('kit-banho-de-verniz.jpg')],
    'Brilho intenso e ação anti-ressecamento.'),
  p('Power Day Creatina Monohidratada', 'Flora Pura', 'naturais', [img('power-day-creatina.jpg')],
    'Creatina + morning shot, sabor abacaxi, 144 g.'),
  p('Óleo Essencial Tea Tree (Melaleuca)', '10 ml', 'oleos', [img('oleo-essencial-tea-tree.jpg')],
    'Para o couro cabeludo: ajuda contra caspa, coceira e oleosidade.'),
  p('Conjunto regata e short com bolsos', 'Preto', 'fitness',
    [img('conjunto-bolsos-preto.jpg'), img('conjunto-bolsos-preto-costas.jpg')], 'Bolsos laterais para celular e fone.'),
  p('Macacão longo costas cruzadas', 'Azul', 'fitness',
    [img('macacao-azul.jpg'), img('macacao-azul-costas.jpg')]),
  p('Kit Flora Care Rosa Mosqueta', 'Flora Pura', 'kits', [img('kit-rosa-mosqueta.jpg')],
    'Gel esfoliante facial, água de beleza e sérum facial.'),
  p('Linha Organic Rícino', 'Flora Pura', 'capilares', [img('linha-organic-ricino.jpg')],
    'Shampoo, condicionador, leave-in e máscara com óleo de rícino.'),
  p('Conjunto regata e short com bolsos', 'Marrom', 'fitness',
    [img('conjunto-bolsos-marrom.jpg'), img('conjunto-bolsos-marrom-detalhe.jpg')], 'Bolsos laterais para celular e fone.'),
  p('Conjunto cropped e short', 'Rosa', 'fitness', [img('conjunto-cropped-short-rosa.jpg')]),
  p('Óleo Essencial de Lavanda', '10 ml', 'oleos', [img('oleo-essencial-lavanda.jpg')],
    'Aromaterapia e pele irritada, como no pós-depilatório.'),
  p('Colágeno Hidrolisado', 'Flora Pura', 'naturais', [img('colageno-hidrolisado.jpg')],
    'Suplemento alimentar, 60 cápsulas de 500 mg.'),
  p('Sérum Facial Rosa Mosqueta', 'Flora Care', 'beleza', [img('serum-facial-rosa-mosqueta.jpg')],
    'Ilumina e uniformiza a aparência e o toque da pele.'),
  p('Conjunto blusa de tule e legging', 'Preto', 'fitness', [img('conjunto-tule-preto.jpg')]),
  p('Macacão flare', 'Cinza', 'fitness', [img('macacao-flare-cinza.jpg')]),
  p('Óleo Vegetal de Semente de Uva', '30 ml', 'oleos', [img('oleo-semente-de-uva.jpg')],
    'Hidrata a pele e ajuda a acalmar irritações, como depois da depilação.'),
  p('Gel Esfoliante Facial Rosa Mosqueta', 'Flora Care', 'beleza', [img('gel-esfoliante-rosa-mosqueta.jpg')],
    'Esfoliação sem agredir a pele.'),
  p('Linha Flora Care Malaquita', 'Flora Pura', 'beleza', [img('linha-malaquita.jpg')],
    'Mousse micelar, sérum facial, gel esfoliante, sabonete em gel facial e água de beleza.'),
  p('Conjunto manga longa e legging', 'Nude', 'fitness', [img('conjunto-manga-longa-nude.jpg')]),
  p('Conjunto blusa de tule e legging', 'Branco e lilás', 'fitness', [img('conjunto-tule-branco-lilas.jpg')]),
  p('Conjunto top e legging', 'Marrom', 'fitness', [img('conjunto-top-legging-marrom.jpg')]),
  p('Água de Beleza Rosa Mosqueta', 'Flora Care', 'beleza', [img('agua-de-beleza-rosa-mosqueta.jpg')],
    'Hidrata, uniformiza o tom da pele e serve como fixador de maquiagem.'),
  p('Flora Care Argila Branca', 'Sabonete artesanal e máscara facial', 'beleza',
    [img('argila-branca.jpg'), img('mascara-argila-branca.jpg')], 'Para pele sensível e desidratada.'),
  p('Óleo Essencial de Hortelã', '20 ml', 'oleos', [img('oleo-essencial-hortela.jpg')],
    'Aroma refrescante; no cabelo, estimula o crescimento.'),
  p('Jaqueta leve', 'Branca', 'fitness', [img('jaqueta-branca.jpg')]),
  p('Blusa transpassada', 'Preta', 'fitness', [img('blusa-transpassada-preta.jpg')]),
  p('Flora Care Argila Verde e Aroeira', 'Sabonete, creme e máscara facial', 'beleza', [img('argila-verde-aroeira.jpg')],
    'Combate impurezas e acne para pele oleosa.'),
  p('Óleo de Cedro Virginia', '10 ml', 'oleos', [img('oleo-cedro-virginia.jpg')],
    'Com óleo vegetal. Aroma calmante e prolongado, útil na meditação.'),
  p('Creme Facial Flora Care Clarin', 'Flora Pura', 'beleza', [img('creme-facial-clarin.jpg')],
    'Hidratação intensa e uniformiza o tom da pele.'),
  p('Conjunto regata e short com bolsos', 'Azul-marinho', 'fitness',
    [img('conjunto-bolsos-marinho.jpg')], 'Bolsos laterais para celular e fone.'),
  p('Conjunto cropped e short', 'Várias cores', 'fitness', [img('conjunto-cropped-short-pastel.jpg')]),
  p('Bolsa compacta', 'Várias cores', 'acessorios', [img('bolsa-compacta.jpg')]),
];

// Campanha de kits e ofertas. Com `title` vazio, a seção mostra o convite genérico.
export const promo = {
  title: '',
  description: '',
  price: null,
  period: '', // ex.: 'Válida até 30/11'
  image: null, // ex.: 'images/banners/kits-ofertas.jpg' (proporção 4:5)
};
