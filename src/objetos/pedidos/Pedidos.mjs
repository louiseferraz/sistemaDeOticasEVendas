
export default class Pedidos {
    #grau;
    #modelo;
    #cpf;
  
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
  
    setCPF(cpf) {
      if (cpf) {
        this.#cpf = cpf;
        return true;
      }
      return false;
    }
  
    getCPF() {
      return this.#cpf;
    }
  }