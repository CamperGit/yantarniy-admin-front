import {keycloak} from "boot/keycloak";

class KeycloakService {
  async logout() {
    try {
      await keycloak.logout()
    } catch (e) {
      throw e;
    }
  }

  async login() {
    try {
      await keycloak.login()
    } catch (e) {
      throw e;
    }
  }
}

export default new KeycloakService();
