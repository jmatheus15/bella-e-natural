import test from 'node:test';
import assert from 'node:assert/strict';
import { money, waLink, productMessage } from '../assets/js/format.js';

test('waLink codifica acentos e símbolos', () => {
  assert.equal(
    waLink('5583999976274', 'Olá! Kit & Óleo'),
    'https://wa.me/5583999976274?text=Ol%C3%A1!%20Kit%20%26%20%C3%93leo',
  );
});

test('money formata em reais', () => {
  assert.match(money(89.9), /^R\$\s89,90$/);
});

test('productMessage usa o nome ou a categoria', () => {
  assert.equal(productMessage({ name: 'Legging' }, 'Roupas Fitness'), 'Olá! Tenho interesse no produto Legging da Bella e Natural.');
  assert.equal(productMessage({ name: '' }, 'Óleos'), 'Olá! Quero conhecer os produtos de Óleos da Bella e Natural.');
  assert.match(productMessage({ name: 'Kit', available: false }, 'Kits'), /voltar ao estoque/);
  assert.equal(productMessage({ name: 'Macacão', color: 'Azul' }, 'Roupas Fitness'), 'Olá! Tenho interesse no produto Macacão (Azul) da Bella e Natural.');
});
