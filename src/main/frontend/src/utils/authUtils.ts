/** Usuario semilla para desarrollo */
export const MOCK_USERS = [
  {
    email: 'admin@bankify.com',
    password: 'admin123',
    role: 'admin',
    fullName: 'Administrador del Sistema'
  },
  {
    email: 'carlosmendoza@bankify.com',
    password: 'carlitos123%&',
    role: 'client',
    fullName: 'Carlos Mendoza'
  }
];

// Para activar el reto de Estadística, cambia este valor a true. Eso vuelve a
// bloquear el acceso de clientes hasta que el módulo de correlación se complete.
const STATISTICS_TRACK_ENABLED = false;

/**
 * Inicializa el almacenamiento local con datos semilla si es la primera vez.
 * - Crea `bankify_users` con los usuarios por defecto.
 * - Mantiene el acceso de clientes habilitado, salvo cuando se activa el reto
 *   de Estadística.
 *
 * Debe llamarse una única vez al arrancar la aplicación (main.jsx).
 */
export const initAuthStorage = () => {
  if (!localStorage.getItem('bankify_users')) {
    localStorage.setItem('bankify_users', JSON.stringify(MOCK_USERS));
  }
  if (!STATISTICS_TRACK_ENABLED) {
    localStorage.setItem('bug_correlacion_fixed', 'true');
  } else if (!localStorage.getItem('bug_correlacion_fixed')) {
    localStorage.setItem('bug_correlacion_fixed', 'false');
  }
  if (!localStorage.getItem('bug_captcha_fixed')) {
    localStorage.setItem('bug_captcha_fixed', 'false');
  }
};

/**
 * Recupera el usuario actualmente autenticado desde localStorage.
 *
 * @returns {object|null} El objeto del usuario (con `email`, `role`, `fullName`, etc.)
 *                        o `null` si no hay sesión activa.
 */
export const getCurrentUser = () => {
  const raw = localStorage.getItem('bankify_current_user');
  return raw ? JSON.parse(raw) : null;
};

/**
 * Indica si el archivo de correlación (módulo de estadística) ya fue cargado
 * por el administrador.
 *
 * @returns {boolean} `true` si el bug está corregido, `false` en caso contrario.
 */
export const isBugFixed = () => {
  return localStorage.getItem('bug_correlacion_fixed') === 'true';
};

export const isCaptchaFixed = () => {
  return localStorage.getItem('bug_captcha_fixed') === 'true';
};
