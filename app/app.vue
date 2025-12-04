<template>
  <div class="bg-[#0C100F] min-h-screen flex flex-col">
    <UApp>
      <NuxtRouteAnnouncer />

      <AppHeader />
      <!-- <AppLiveGames /> -->

      <UMain class="flex-1 flex flex-col">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>

        <AppFooter />
      </UMain>
    </UApp>
  </div>
  <ModalsBet
    v-if="
      route.query.modal === 'bet' && route.query.signature && route.query.vrf
    "
  />
  <ModalsAddLiquidity
    v-if="route.query.modal === 'addLiquidity' && route.query.mineAddress"
  />
  <ModalsCreateMine
    v-if="route.query.modal === 'createMine'"
  />
  <ModalsErrorModal
    v-if="route.query.modal === 'error'"
  />
</template>

<script lang="ts" setup>
const route = useRoute();
</script>
