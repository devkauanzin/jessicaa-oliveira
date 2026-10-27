/* Dra. Jéssica Oliveira — interações da landing page */
(function () {
  'use strict';

  // Configuração central de contato
  var CONFIG = {
    whatsapp: '5537999489540',
    mensagemPadrao: 'Olá, Dra. Jéssica! Vim pelo site e gostaria de agendar uma consulta.'
  };

  function waUrl(text) {
    return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text);
  }

  // Links de WhatsApp
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = waUrl(CONFIG.mensagemPadrao);
  });

  // Ano do rodapé
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  // Menu móvel
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu-movel');
  function setMenu(open) {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () { setMenu(menu.hidden); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) setMenu(false); });
  }

  // Perguntas frequentes (uma aberta por vez)
  var faqBtns = document.querySelectorAll('.faq__btn');
  faqBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var abrir = btn.getAttribute('aria-expanded') !== 'true';
      faqBtns.forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
        document.getElementById(b.getAttribute('aria-controls')).hidden = true;
      });
      if (abrir) {
        btn.setAttribute('aria-expanded', 'true');
        document.getElementById(btn.getAttribute('aria-controls')).hidden = false;
      }
    });
  });

  // Formulário → WhatsApp
  var form = document.getElementById('form-agendamento');
  var sucesso = document.getElementById('form-sucesso');
  var sucessoLink = document.getElementById('form-sucesso-link');

  function setErro(campo, msg) {
    var el = document.getElementById(campo.id + '-erro');
    if (el) el.textContent = msg || '';
    campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  if (form) {
    var nome = form.elements.nome;
    var regiao = form.elements.regiao;
    var consent = form.elements.consent;

    nome.addEventListener('input', function () { setErro(nome, ''); });
    regiao.addEventListener('change', function () { setErro(regiao, ''); });
    consent.addEventListener('change', function () { setErro(consent, ''); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var primeiroErro = null;

      if (nome.value.trim().length < 2) {
        setErro(nome, 'Informe seu nome para que possamos te chamar.');
        primeiroErro = primeiroErro || nome;
      }
      if (!regiao.value) {
        setErro(regiao, 'Selecione a região do desconforto.');
        primeiroErro = primeiroErro || regiao;
      }
      if (!consent.checked) {
        setErro(consent, 'É preciso concordar para continuar pelo WhatsApp.');
        primeiroErro = primeiroErro || consent;
      }
      if (primeiroErro) { primeiroErro.focus(); return; }

      var linhas = [
        CONFIG.mensagemPadrao,
        '',
        'Nome: ' + nome.value.trim(),
        'Região do desconforto: ' + regiao.value,
        'Preferência: ' + form.elements.modalidade.value
      ];
      var msg = form.elements.mensagem.value.trim();
      if (msg) linhas.push('Sobre a dor: ' + msg);

      var url = waUrl(linhas.join('\n'));
      sucessoLink.href = url;
      window.open(url, '_blank', 'noopener');

      form.hidden = true;
      sucesso.hidden = false;
      sucesso.focus();
    });

    document.getElementById('form-reset').addEventListener('click', function () {
      form.reset();
      [nome, regiao, consent].forEach(function (c) { setErro(c, ''); });
      sucesso.hidden = true;
      form.hidden = false;
      nome.focus();
    });
  }

  // Entrada suave dos elementos ao rolar
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
