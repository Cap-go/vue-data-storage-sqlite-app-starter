<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 2</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 2</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-button @click="() => router.push('/storedefault')">StoreDefault</ion-button>
      <ion-button @click="() => router.push('/filtervalues')">StoreFilterValues</ion-button>
      <ion-button @click="() => router.push('/importexportjson')">Import/Export Json</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
                                            IonButton } from '@ionic/vue';
  import { defineComponent } from 'vue';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    name: 'Tab2Page',
    components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage,
                  IonButton },
    setup() {
      const router = useRouter();
      return { router };
    }
  });
</script>