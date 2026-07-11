const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const DEFAULT_ORIGIN = 'https://www.vladimirhuarachicopa.com';

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

function clearCookies() {
  return [
    'decap_oauth_state=; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    'decap_oauth_origin=; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
  ];
}

function redirectToCms(res, origin, status, payload) {
  const hash = new URLSearchParams({
    origin,
    provider: 'github',
    status,
    payload: JSON.stringify(payload),
  }).toString();

  res.writeHead(302, { Location: `${origin}/admin/oauth-callback.html#${hash}` });
  res.end();
}

module.exports = async function handler(req, res) {
  const cookies = parseCookies(req.headers.cookie);
  const origin = cookies.decap_oauth_origin || DEFAULT_ORIGIN;
  const expectedState = cookies.decap_oauth_state;
  const { code, state, error, error_description: errorDescription } = req.query;

  res.setHeader('Set-Cookie', clearCookies());

  if (error) {
    redirectToCms(res, origin, 'error', { message: errorDescription || error });
    return;
  }

  if (!code || !state || state !== expectedState) {
    redirectToCms(res, origin, 'error', { message: 'Estado OAuth invalido.' });
    return;
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    redirectToCms(res, origin, 'error', {
      message: 'Faltan GITHUB_OAUTH_CLIENT_ID o GITHUB_OAUTH_CLIENT_SECRET en Vercel.',
    });
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
    redirectToCms(res, origin, 'error', {
      message: tokenData.error_description || tokenData.error || 'No se pudo obtener el token.',
    });
    return;
  }

  redirectToCms(res, origin, 'success', {
    token: tokenData.access_token,
    provider: 'github',
  });
};