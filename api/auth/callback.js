const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';

function parseCookies(cookieHeader = '') {
  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map(cookie => cookie.trim())
      .filter(Boolean)
      .map(cookie => {
        const separator = cookie.indexOf('=');
        const key = separator >= 0 ? cookie.slice(0, separator) : cookie;
        const value = separator >= 0 ? cookie.slice(separator + 1) : '';
        return [key, decodeURIComponent(value)];
      }),
  );
}

function messageHtml(origin, provider, status, payload) {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Autenticacion GitHub</title>
  </head>
  <body>
    <p>Finalizando conexion con GitHub...</p>
    <script>
      const message = 'authorization:${provider}:${status}:' + ${JSON.stringify(JSON.stringify(payload))};
      if (window.opener) {
        window.opener.postMessage(message, ${JSON.stringify(origin)});
      }
      window.close();
    </script>
  </body>
</html>`;
}

function clearCookies() {
  return [
    'decap_oauth_state=; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    'decap_oauth_origin=; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
  ];
}

module.exports = async function handler(req, res) {
  const provider = 'github';
  const cookies = parseCookies(req.headers.cookie);
  const origin = cookies.decap_oauth_origin || `https://${req.headers.host}`;
  const expectedState = cookies.decap_oauth_state;
  const { code, state, error, error_description: errorDescription } = req.query;

  res.setHeader('Set-Cookie', clearCookies());
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  if (error) {
    res
      .status(200)
      .send(messageHtml(origin, provider, 'error', { message: errorDescription || error }));
    return;
  }

  if (!code || !state || state !== expectedState) {
    res
      .status(200)
      .send(messageHtml(origin, provider, 'error', { message: 'Estado OAuth invalido.' }));
    return;
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    res.status(200).send(
      messageHtml(origin, provider, 'error', {
        message: 'Faltan GITHUB_OAUTH_CLIENT_ID o GITHUB_OAUTH_CLIENT_SECRET en Vercel.',
      }),
    );
    return;
  }

  const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok || tokenData.error || !tokenData.access_token) {
    res.status(200).send(
      messageHtml(origin, provider, 'error', {
        message: tokenData.error_description || tokenData.error || 'No se pudo obtener el token.',
      }),
    );
    return;
  }

  res.status(200).send(
    messageHtml(origin, provider, 'success', {
      token: tokenData.access_token,
      provider,
    }),
  );
};
