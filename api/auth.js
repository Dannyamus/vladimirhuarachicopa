const { randomUUID } = require('node:crypto');

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const ORIGIN = 'https://www.vladimirhuarachicopa.com';

module.exports = function handler(req, res) {
  const { provider = 'github', scope = 'repo' } = req.query;

  if (provider !== 'github') {
    res.status(400).send('Proveedor no soportado.');
    return;
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;

  if (!clientId) {
    res
      .status(500)
      .send('Falta configurar GITHUB_OAUTH_CLIENT_ID en las variables de entorno de Vercel.');
    return;
  }

  const state = randomUUID();
  const callbackUrl = `${ORIGIN}/api/auth/callback`;
  const githubUrl = new URL(GITHUB_AUTHORIZE_URL);

  githubUrl.searchParams.set('client_id', clientId);
  githubUrl.searchParams.set('redirect_uri', callbackUrl);
  githubUrl.searchParams.set('scope', scope);
  githubUrl.searchParams.set('state', state);

  res.setHeader('Set-Cookie', [
    `decap_oauth_state=${encodeURIComponent(state)}; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    `decap_oauth_origin=${encodeURIComponent(ORIGIN)}; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
  ]);
  res.writeHead(302, { Location: githubUrl.href });
  res.end();
};