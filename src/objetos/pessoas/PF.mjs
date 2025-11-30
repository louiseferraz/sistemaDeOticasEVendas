import Pessoa from './Pessoa.mjs';

export default class PF extends Pessoa {
  #cpf;
  #dataNascimento;
  #titulo;

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

  setdataNascimento(dataNascimento) {
    if (dataNascimento) {
      this.#dataNascimento = dataNascimento;
      return true;
    }
    return false;
  }

  getDataDeNascimento() {
    return this.#dataNascimento;
  }

  setTitulo(titulo) {
    if (titulo instanceof Titulo) {
      this.#titulo = titulo;
      titulo.setPF(this);
      return true;
    }
    return false;
  }

  getTitulo() {
    return this.#titulo;
  }
}
