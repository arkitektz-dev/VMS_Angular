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


// const adfsConfig = {
//   instance: "https://dc01.servicenowtrainer.com/",
//   tenant: "adfs",
//   clientId: "d418e598-14e5-49cd-ba2b-aa0225da4075",
//   redirectUri: window.location.origin + "/account/login/adfs-callback",
// };
