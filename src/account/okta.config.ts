const OKTA_DOMAIN = "dev-56503071.okta.com";
const CLIENT_ID = "0oa94rr2jSaBKbkA15d6";
const CALLBACK_PATH = "/account/login/callback";

const ISSUER = `https://${OKTA_DOMAIN}/oauth2/default`;
const HOST = window.location.host;
const REDIRECT_URI = `http://${HOST}${CALLBACK_PATH}`;
const SCOPES = "openid profile email";

export default {
  issuer: ISSUER,
  clientId: CLIENT_ID,
  redirectUri: REDIRECT_URI,
  scopes: SCOPES.split(/\s+/),
};
