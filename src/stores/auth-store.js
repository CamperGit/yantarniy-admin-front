import { defineStore } from 'pinia';
import { computed, ref } from "vue";
import UserService from "src/service/auth/userService";
import KeycloakService from "src/service/auth/keycloakService";

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null);
  const isLoggedIn = computed(() => {
    return !!currentUser.value;
  });

  const getUserInfoOrCreate = async () => {
    currentUser.value = await UserService.getUserInfo();
    if (!currentUser.value.id) {
      currentUser.value = await UserService.create(currentUser.value);
    }
  }

  const logout = async () => {
    currentUser.value = null;
    await KeycloakService.logout();
  }

  return { currentUser, isLoggedIn, getUserInfoOrCreate, logout};
});
