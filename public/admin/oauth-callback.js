(function () {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const origin = params.get('origin') || window.location.origin;
  const provider = params.get('provider') || 'github';
  const status = params.get('status') || 'error';
  const payload = params.get('payload') || '{"message":"Respuesta OAuth inválida."}';

  function post(message) {
    if (window.opener) {
      window.opener.postMessage(message, origin);
    }
  }

  post('authorizing:' + provider);

  window.setTimeout(function () {
    post('authorization:' + provider + ':' + status + ':' + payload);
    window.close();
  }, 300);
})();