<template>
  <div class="bg-[#0C100F] min-h-screen flex flex-col">
    <UApp>
      <NuxtRouteAnnouncer />

      <AppHeader />

      <UMain class="flex-1 flex flex-col">
        <NuxtLayout class="flex-1 flex flex-col">
          <NuxtPage class="flex-1 pb-[200px]" />
        </NuxtLayout>

        <AppFooter class="mt-auto" />
      </UMain>
    </UApp>
  </div>
  <ModalsBet
    v-if="
      route.query.modal === 'bet' && route.query.signature && route.query.vrf
    "
  />
  <ModalsAddLiquidity
    v-if="route.query.modal === 'add-liquidity' && route.query.mineAddress"
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
