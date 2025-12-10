
export default class Pedidos {
    #grau;
    #data;
    #valor;
  
    setGrau(grau) {
      if (grau) {
        this.#grau = grau;
        return true;
      }
      return false;
    }
  
    getGrau() {
      return this.#grau;
    }
  
    setData(data) {
      if (data) {
        this.#data = data;
        return true;
      }
      return false;
    }
  
    getData() {
      return this.#data;
    }
  
    setValor(valor) {
      if (valor) {
        this.#valor = valor;
        return true;
      }
      return false;
    }
  
    getValor() {
      return this.#valor;
    }
  }