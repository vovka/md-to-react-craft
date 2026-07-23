const GOOGLE_COOKIE = /^(_ga|_gid|_gat)(_|$)/;

const cookieDomains = () => {
  const host = window.location.hostname;
  const parent = host.endsWith(".shcherbyna.me") ? "shcherbyna.me" : host;
  return [...new Set(["", host, `.${host}`, parent, `.${parent}`])];
};

const expireCookie = (name: string, domain: string) => {
  const domainAttribute = domain ? `; Domain=${domain}` : "";
  document.cookie = `${name}=; Max-Age=0; Path=/${domainAttribute}; SameSite=Lax`;
};

export const clearGoogleAnalyticsCookies = () => {
  const names = document.cookie.split(";").map((cookie) => cookie.trim().split("=")[0]);
  names.filter((name) => GOOGLE_COOKIE.test(name)).forEach((name) => {
    cookieDomains().forEach((domain) => expireCookie(name, domain));
  });
};
