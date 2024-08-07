import { boot } from 'quasar/wrappers'
import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "https://605945-cr81557.tmweb.ru/keycloak",
  realm: "yantarniy",
  clientId: "yantarniy",
  onLoad: "login-required"
});

export default boot(async ({app, store, urlPath, router}) => {
  const auth = await keycloak.init({
    onLoad: "login-required",
    checkLoginIframe: false,
    redirectUri: "http://localhost:9000" + urlPath
  });

  if (!auth) {
    window.location.reload();
  } else {
    setInterval(async () => {
      await keycloak.updateToken(70).then((refreshed) => {
        if (refreshed) {
          console.log("Access token refreshed!");
        }
      }).catch(() => {
        console.err("Failed to refresh auth token!");
      });
    }, 60000)
  }
})

export {keycloak}
