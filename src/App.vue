<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent, getCurrentInstance, onMounted } from 'vue';
import { useStorageSQLite } from 'vue-data-storage-sqlite-hook/dist';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  },
  setup() {
    const app = getCurrentInstance();
    onMounted(async () => {
      if( app != null) {  
        app.appContext.config.globalProperties.$storageSqlite = useStorageSQLite();
      }
    });
  }
});
</script>