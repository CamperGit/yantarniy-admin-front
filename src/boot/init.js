import { boot } from 'quasar/wrappers'
import { useAuthStore } from "stores/auth-store";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ( { app, router } ) => {
  const authStore = useAuthStore();
  const {getUserInfoOrCreate, isLoggedIn, logout} = authStore;

  try {
    if (!isLoggedIn) {
      await getUserInfoOrCreate();
    }
  } catch (e) {
    console.log(e);
    await logout();
  }
})
