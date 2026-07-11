const { randomUUID } = require('node:crypto');

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';

function getOrigin(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}`;
}

function html(body) {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Conectando con GitHub</title>
  </head>
  <body>
    ${body}
  </body>
</html>`;
}

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

  const origin = getOrigin();
  const state = randomUUID();
  const callbackUrl = `${origin}/api/auth/callback`;
  const githubUrl = new URL(GITHUB_AUTHORIZE_URL);

  githubUrl.searchParams.set('client_id', clientId);
  githubUrl.searchParams.set('redirect_uri', callbackUrl);
  githubUrl.searchParams.set('scope', scope);
  githubUrl.searchParams.set('state', state);

  res.setHeader('Set-Cookie', [
    `decap_oauth_state=${encodeURIComponent(state)}; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    `decap_oauth_origin=${encodeURIComponent(origin)}; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
  ]);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(
    html(`<p>Conectando con GitHub...</p>
<script>
  const provider = 'github';
  const authorizeUrl = ${JSON.stringify(githubUrl.href)};

  function continueToGitHub() {
    window.location.href = authorizeUrl;
  }

  window.addEventListener('message', function(event) {
    if (event.origin === window.location.origin && event.data === 'authorizing:' + provider) {
      continueToGitHub();
    }
  });

  if (window.opener) {
    window.opener.postMessage('authorizing:' + provider, window.location.origin);
  } else {
    continueToGitHub();
  }
</script>`),
  );
};
