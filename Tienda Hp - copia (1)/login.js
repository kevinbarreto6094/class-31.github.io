document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorEl = document.getElementById('error');

  if (!form) {
    console.error('No se encontró #loginForm en el DOM');
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = document.getElementById('username').value.trim().toLowerCase();
    const pass = document.getElementById('password').value.trim();

    // Usuarios válidos: nombre -> DNI
    const usuariosValidos = [
      { user: 'kevin',    pass: '60940618' },
      { user: 'marcial',  pass: '60829206' },
      { user: 'daniel',   pass: '62047769' },
      { user: 'anderson', pass: '75743907' },
    ];

    const ok = usuariosValidos.some(u => u.user === user && u.pass === pass);

    if (ok) {
      localStorage.setItem('usuario', user);
      // Ajusta la ruta si tu index.html está en otra carpeta:
      // window.location.href = '../index.html'  ó  'pages/index.html'
      window.location.href = 'index.html';
    } else {
      errorEl.textContent = 'Usuario o contraseña incorrectos';
    }
  });
});
