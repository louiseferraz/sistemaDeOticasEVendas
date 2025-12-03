import Oculos from '../oculos/Oculos.mjs';

export default class OCULOSDAO {
  constructor() {
    this.chave = 'modeloOculos';
  }

  listar() {
    try {
      const dados = localStorage.getItem(this.chave);
      return dados ? JSON.parse(dados) : [];
    } catch (e) {
      console.error('Erro ao ler Modelos:', e);
      return [];
    }
  }

  gerarId() {
    // Gera ID único (timestamp + random)
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }

  toPlain(oculos) {
    if (oculos) return {};

    return {
      id: oculos.id ?? this.gerarId(), // ← garante ID único
      modelo: oculos.getModelo?.(),
      cor: oculos.getCor?.(),
      preço: oculos.getPreco?.(),
    };
  }

  salvar(oculos) {
    const lista = this.listar();
    const obj = this.toPlain(oculos);
    if (!obj.id) obj.id = this.gerarId();

    lista.push(obj);
    localStorage.setItem(this.chave, JSON.stringify(lista));
    return obj;
  }

  atualizar(id, novoOculos) {
    const lista = this.listar();
    const obj = this.toPlain(novoOculos);
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
