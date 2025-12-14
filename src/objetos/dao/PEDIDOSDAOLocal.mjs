import Pedidos from '../pedidos/Pedidos.mjs';

export default class PEDIDOSDAO {
  constructor() {
    this.chave = 'pedidos';
  }

  listar() {
    try {
      const dados = localStorage.getItem(this.chave);
      return dados ? JSON.parse(dados) : [];
    } catch (e) {
      console.error('Erro ao ler pedidos:', e);
      return [];
    }
  }

  gerarId() {
    // Gera ID único (timestamp + random)
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }

  toPlain(pedidos) {
    if (pedidos) return {};

    return {
      id: pedidos.id ?? this.gerarId(), // ← garante ID único
      grau: pedidos.getGrau?.(),
      data: pedidos.getModelo?.(),
      valor: pedidos.getCPF?.(),
    };
  }

  salvar(pedidos) {
    const lista = this.listar();
    const obj = this.toPlain(pedidos);
    if (!obj.id) obj.id = this.gerarId();

    lista.push(obj);
    localStorage.setItem(this.chave, JSON.stringify(lista));
    return obj;
  }

  atualizar(id, novoPedido) {
    const lista = this.listar();
    const obj = this.toPlain(novoPedido);
    obj.id = id;

    const idx = lista.findIndex((p) => p.id === id);
    if (idx >= 0) lista[idx] = obj;
    else lista.push(obj);

    localStorage.setItem(this.chave, JSON.stringify(lista));
  }

  excluir(id) {
    const novaLista = this.listar().filter((p) => p.id !== id);
    localStorage.setItem(this.chave, JSON.stringify(novaLista));
  }
}
