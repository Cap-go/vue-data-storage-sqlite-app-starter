<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="() => router.push('/tabs/tab2')">back</ion-button>
        </ion-buttons>
        <ion-title>StoreFilterValues</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">StoreFilterValues</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-card>
        <ion-card-content>
          <FilterValuesTest />
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script lang="ts">
import { IonPage, IonButtons, IonHeader, IonToolbar, IonButton,
        IonTitle, IonContent, IonCard, IonCardContent } from '@ionic/vue';
import { defineComponent } from 'vue';
import FilterValuesTest from '@/components/FilterValuesTest.vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'StoreFilterValues',
  components: { IonPage, IonButtons, IonHeader, IonToolbar, IonButton,
        IonTitle, IonContent, IonCard, IonCardContent, FilterValuesTest },
  setup() {
    const router = useRouter();
    return { router };
  }
});
</script>
<style>
h1 {
    text-align: center;
}
</style>