<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-item class="logo-item q-pa-none " clickable :to="'/book'">
          <q-img src="~src/assets/logo.png"/>
        </q-item>
        <!--        <q-btn class="text-accent" size="lg" no-caps flat :to="'/'">Главная</q-btn>-->
        <q-btn class="text-accent" size="lg" no-caps flat :to="'/'">Текст1</q-btn>
        <q-space/>
        <q-btn v-if="isLoggedIn" class="text-accent" size="lg" no-caps flat :to="'/profile'">{{currentUser.username || ""}}</q-btn>
        <q-btn class="text-accent" flat round dense size="lg" icon="logout" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { onMounted, ref, defineComponent } from "vue";
import { useAuthStore } from "stores/auth-store";
import { storeToRefs } from "pinia";
import KeycloakService from "src/services/auth/keycloakService"

export default defineComponent({
  name: 'MainLayout',
  setup () {
    const authStore = useAuthStore();
    const logout = async () => {
      await KeycloakService.logout();
    }
    const login = async () => {
      await KeycloakService.login();
    }

    const {currentUser, isLoggedIn} = storeToRefs(authStore)

    onMounted(async () => {
    })

    return {
      logout,
      login,
      currentUser,
      isLoggedIn
    }
  }
})

</script>
