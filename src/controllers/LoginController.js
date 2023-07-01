const Usuario = require('../models/Usuario');
const Pessoa = require('../models/Pessoa');
const ContaCorrente = require('../models/ContaCorrente');


const loginController = {
  exibirFormularioLogin: (req, res) => {

    if (req.session.user) {

      try {
        res.render('index');
      } catch {
        res.render('login');
      }
    } else {

      res.render('login');
    }
  },
  realizarLogin: async (req, res) => {
    const { email, password } = req.body;
    try {
      const usuario = await Usuario.findOne({ where: { email } });

      if (usuario && usuario.password === password) {

        req.session.user = { email };

        const pessoa = await Pessoa.findByPk(usuario.pessoa_id);
        const contaCorrente = await ContaCorrente.findAll({ where: { usuario_id: usuario.id } });
        res.render('index', { pessoa, contaCorrente });

      } else {

        res.redirect('/login');
      }
    } catch (error) {
      console.error(error);
      res.redirect('/pessoa/cadastrar');
    }
  },
  realizarLogout: (req, res) => {
    req.session.user = null;
    res.redirect('/login');
  }
};

module.exports = loginController;
