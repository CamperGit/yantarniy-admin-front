import { keycloak } from "boot/keycloak";

export async function authHeader() {
  const k = await keycloak;
  return { Authorization: 'Bearer ' + k.token};
}
