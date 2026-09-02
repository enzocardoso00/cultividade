
/* =========================================================
   CULTIVIDADE — SCRIPT.JS
   Módulos: Slider, Menu responsivo, Acessibilidade,
   Scroll suave, Fade-in, Voltar ao topo
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initMobileMenu();
  initAccessibility();
  initFadeInOnScroll();
  initBackToTop();
  initFooterYear();
  initAuth();
});

/* ---------------------------------------------------------
   MÓDULO: HERO SLIDER (automático + manual)
   --------------------------------------------------------- */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dotsWrap = document.getElementById('heroDots');
  const nextBtn = document.getElementById('heroNext');

  if (!slides.length) return;

  let current = 0;
  const total = slides.length;
  const AUTO_DELAY = 5000;
  let autoTimer = null;

  // Cria os indicadores (dots) dinamicamente
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll('.dot');

  function goToSlide(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + total) % total;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    resetAutoplay();
  }

  function nextSlide() { goToSlide(current + 1); }

  function resetAutoplay() {
    clearInterval(autoTimer);
    autoTimer = setInterval(nextSlide, AUTO_DELAY);
  }

  nextBtn.addEventListener('click', nextSlide);
  resetAutoplay();
}

/* ---------------------------------------------------------
   MÓDULO: MENU RESPONSIVO
   --------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    nav.classList.toggle('open');
  });

  // Fecha o menu ao clicar em um link (mobile)
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      nav.classList.remove('open');
    });
  });
}

/* ---------------------------------------------------------
   MÓDULO: ACESSIBILIDADE (fonte + tema claro/escuro)
   --------------------------------------------------------- */
function initAccessibility() {
  const root = document.documentElement;
  const increaseBtn = document.getElementById('fontIncrease');
  const decreaseBtn = document.getElementById('fontDecrease');
  const themeToggle = document.getElementById('themeToggle');

  const MIN_SCALE = 0.85;
  const MAX_SCALE = 1.3;
  const STEP = 0.1;
  let scale = 1;

  // ALTERADO: aplica o tema salvo ao carregar a página, para a logo/modo escuro persistirem
  const TEMA_KEY = 'cultividade_tema';
  const temaSalvo = localStorage.getItem(TEMA_KEY);
  if (temaSalvo === 'escuro') {
    document.body.classList.add('dark-mode');
    themeToggle.classList.add('active');
  }

  increaseBtn.addEventListener('click', () => {
    scale = Math.min(MAX_SCALE, scale + STEP);
    root.style.setProperty('--escala-fonte', scale.toFixed(2));
  });

  decreaseBtn.addEventListener('click', () => {
    scale = Math.max(MIN_SCALE, scale - STEP);
    root.style.setProperty('--escala-fonte', scale.toFixed(2));
  });

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.classList.toggle('active');
    // ALTERADO: salva a preferência escolhida
    localStorage.setItem(TEMA_KEY, document.body.classList.contains('dark-mode') ? 'escuro' : 'claro');
  });
}

/* ---------------------------------------------------------
   MÓDULO: FADE-IN AO ROLAR (IntersectionObserver)
   --------------------------------------------------------- */
function initFadeInOnScroll() {
  const items = document.querySelectorAll('.fade-in');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => observer.observe(item));
}

/* ---------------------------------------------------------
   MÓDULO: BOTÃO VOLTAR AO TOPO
   --------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------------------------------------------------------
   MÓDULO: ANO ATUAL NO RODAPÉ
   --------------------------------------------------------- */
function initFooterYear() {
  const yearEl = document.getElementById('anoAtual');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ---------------------------------------------------------
   MÓDULO: AUTENTICAÇÃO (cadastro, login, sessão, perfil)
   --------------------------------------------------------- */
function initAuth() {
  const LS_USUARIOS = 'cultividade_usuarios';
  const LS_SESSAO = 'cultividade_sessao';

  const authGate = document.getElementById('authGate');
  const modalCadastro = document.getElementById('modalCadastro');
  const modalLogin = document.getElementById('modalLogin');
  const modalPerfil = document.getElementById('modalPerfil');

  const btnEntrar = document.getElementById('btnEntrar');
  const btnCadastro = document.getElementById('btnCadastro');
  const btnUserIcon = document.getElementById('btnUserIcon');

  const formCadastro = document.getElementById('formCadastro');
  const formLogin = document.getElementById('formLogin');
  const formEditarPerfil = document.getElementById('formEditarPerfil');

  const erroCadastro = document.getElementById('erroCadastro');
  const erroLogin = document.getElementById('erroLogin');
  const erroEditarPerfil = document.getElementById('erroEditarPerfil');

  const perfilView = document.getElementById('perfilView');
  const btnEditarPerfil = document.getElementById('btnEditarPerfil');
  const cancelarEdicao = document.getElementById('cancelarEdicao');
  const btnSair = document.getElementById('btnSair');
  const fecharPerfil = document.getElementById('fecharPerfil');

  let usuarioAtual = null;

  /* ---------- Persistência local (localStorage) ---------- */
  function carregarUsuarios() {
    try {
      return JSON.parse(localStorage.getItem(LS_USUARIOS)) || [];
    } catch (e) {
      return [];
    }
  }
  function salvarUsuarios(lista) {
    localStorage.setItem(LS_USUARIOS, JSON.stringify(lista));
  }
  function buscarPorEmail(email) {
    return carregarUsuarios().find(u => u.email.toLowerCase() === email.toLowerCase());
  }
  function iniciarSessao(email) {
    localStorage.setItem(LS_SESSAO, email);
  }
  function encerrarSessao() {
    localStorage.removeItem(LS_SESSAO);
  }

  /* ---------- Helpers de exibição ---------- */
  function abrirModal(modal) {
    [modalCadastro, modalLogin, modalPerfil].forEach(m => m.classList.remove('visible'));
    modal.classList.add('visible');
  }
  function fecharModais() {
    [modalCadastro, modalLogin, modalPerfil].forEach(m => m.classList.remove('visible'));
  }
  function mostrarGate() {
    authGate.classList.add('visible');
    limparErros();
    abrirModal(modalCadastro);
  }
  function esconderGate() {
    authGate.classList.remove('visible');
    fecharModais();
  }
  function limparErros() {
    erroCadastro.textContent = '';
    erroLogin.textContent = '';
    erroEditarPerfil.textContent = '';
  }
  function abrirAuthModal(modal) {
    limparErros();
    abrirModal(modal);
    if (!usuarioAtual) {
      authGate.classList.add('visible');
    }
  }

  /* ---------- Verifica sessão ao carregar a página ---------- */
  function verificarSessao() {
    const emailSessao = localStorage.getItem(LS_SESSAO);
    const usuario = emailSessao ? buscarPorEmail(emailSessao) : null;
    if (usuario) {
      usuarioAtual = usuario;
      esconderGate();
    } else {
      encerrarSessao();
      mostrarGate();
    }
  }

  /* ---------- Abrir modais a partir dos elementos existentes ---------- */
  if (btnEntrar) {
    btnEntrar.addEventListener('click', () => abrirAuthModal(modalLogin));
  }
  if (btnCadastro) {
    btnCadastro.addEventListener('click', () => abrirAuthModal(modalCadastro));
  }
  if (btnUserIcon) {
    btnUserIcon.addEventListener('click', () => {
      if (usuarioAtual) {
        preencherPerfil();
        abrirModal(modalPerfil);
      } else {
        abrirAuthModal(modalLogin);
      }
    });
  }

  document.getElementById('irParaLogin').addEventListener('click', () => { limparErros(); abrirModal(modalLogin); });
  document.getElementById('irParaCadastro').addEventListener('click', () => { limparErros(); abrirModal(modalCadastro); });
  fecharPerfil.addEventListener('click', () => { fecharModais(); });

  /* ---------- Fechar modais: clique fora da caixa e tecla ESC ---------- */
  [modalCadastro, modalLogin, modalPerfil].forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        fecharModais();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (
        modalCadastro.classList.contains('visible') ||
        modalLogin.classList.contains('visible') ||
        modalPerfil.classList.contains('visible')
      ) {
        fecharModais();
      }
    }
  });

  /* ---------- Cadastro ---------- */
  formCadastro.addEventListener('submit', (e) => {
    e.preventDefault();
    erroCadastro.textContent = '';

    const nome = document.getElementById('cadNome').value.trim();
    const email = document.getElementById('cadEmail').value.trim();
    const senha = document.getElementById('cadSenha').value;
    const confirmarSenha = document.getElementById('cadConfirmarSenha').value;

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!nome || !email || !senha || !confirmarSenha) {
      erroCadastro.textContent = 'Preencha todos os campos.';
      return;
    }
    if (!emailValido) {
      erroCadastro.textContent = 'Informe um e-mail válido.';
      return;
    }
    if (senha.length < 8) {
      erroCadastro.textContent = 'A senha deve ter no mínimo 8 caracteres.';
      return;
    }
    if (senha !== confirmarSenha) {
      erroCadastro.textContent = 'As senhas não coincidem.';
      return;
    }
    if (buscarPorEmail(email)) {
      erroCadastro.textContent = 'Este e-mail já está cadastrado.';
      return;
    }

    const usuarios = carregarUsuarios();
    const novoUsuario = { nome, email, senha, criadoEm: new Date().toISOString() };
    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);

    usuarioAtual = novoUsuario;
    iniciarSessao(novoUsuario.email);
    formCadastro.reset();
    esconderGate();
  });

  /* ---------- Login ---------- */
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    erroLogin.textContent = '';

    const email = document.getElementById('logEmail').value.trim();
    const senha = document.getElementById('logSenha').value;

    if (!email || !senha) {
      erroLogin.textContent = 'Preencha e-mail e senha.';
      return;
    }

    const usuario = buscarPorEmail(email);
    if (!usuario || usuario.senha !== senha) {
      erroLogin.textContent = 'E-mail ou senha incorretos.';
      return;
    }

    usuarioAtual = usuario;
    iniciarSessao(usuario.email);
    formLogin.reset();
    esconderGate();
  });

  /* ---------- Perfil ---------- */
  function preencherPerfil() {
    document.getElementById('perfilNome').textContent = usuarioAtual.nome;
    document.getElementById('perfilEmail').textContent = usuarioAtual.email;
    document.getElementById('perfilData').textContent = new Date(usuarioAtual.criadoEm).toLocaleDateString('pt-BR');
    perfilView.hidden = false;
    formEditarPerfil.hidden = true;
  }

  btnEditarPerfil.addEventListener('click', () => {
    document.getElementById('editNome').value = usuarioAtual.nome;
    document.getElementById('editEmail').value = usuarioAtual.email;
    erroEditarPerfil.textContent = '';
    perfilView.hidden = true;
    formEditarPerfil.hidden = false;
  });

  cancelarEdicao.addEventListener('click', () => {
    perfilView.hidden = false;
    formEditarPerfil.hidden = true;
  });

  formEditarPerfil.addEventListener('submit', (e) => {
    e.preventDefault();
    erroEditarPerfil.textContent = '';

    const nome = document.getElementById('editNome').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!nome || !email) {
      erroEditarPerfil.textContent = 'Preencha todos os campos.';
      return;
    }
    if (!emailValido) {
      erroEditarPerfil.textContent = 'Informe um e-mail válido.';
      return;
    }

    const usuarios = carregarUsuarios();
    const emailEmUso = usuarios.some(u =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.email.toLowerCase() !== usuarioAtual.email.toLowerCase()
    );
    if (emailEmUso) {
      erroEditarPerfil.textContent = 'Este e-mail já está em uso por outra conta.';
      return;
    }

    const idx = usuarios.findIndex(u => u.email.toLowerCase() === usuarioAtual.email.toLowerCase());
    if (idx === -1) {
      erroEditarPerfil.textContent = 'Não foi possível salvar as alterações.';
      return;
    }

    usuarios[idx].nome = nome;
    usuarios[idx].email = email;
    salvarUsuarios(usuarios);

    usuarioAtual = usuarios[idx];
    iniciarSessao(usuarioAtual.email);
    preencherPerfil();
  });

  btnSair.addEventListener('click', () => {
    encerrarSessao();
    usuarioAtual = null;
    fecharModais();
    limparErros();
    mostrarGate();
  });

  verificarSessao();
}