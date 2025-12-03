
export default class Oculos {
  #modelo;
  #cor;
  #preco;

  setModelo(modelo) {
    if (modelo) {
      this.#modelo = modelo;
      return true;
    }
    return false;
  }

  getModelo() {
    return this.#modelo;
  }

  setCor(cor) {
    if (cor) {
      this.#cor = cor;
      return true;
    }
    return false;
  }

  getCor() {
    return this.#cor;
  }

  setPreco(preco) {
    if (preco) {
      this.#preco = preco;
      preco.addPessoa?.(this);
      return true;
    }
    return false;
  }

  getPreco() {
    return this.#preco;
  }
}