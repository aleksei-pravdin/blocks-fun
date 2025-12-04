<template>
  <section class="w-full py-20">
    <div class="max-w-[1040px] w-full mx-auto px-4">
      <div class="text-center mb-12">
        <div class="flex items-center justify-center gap-1.5 mb-4">
          <Arrow class="w-5 h-3" :filled="true" />
          <span class="uppercase font-raj font-semibold text-xl text-[#E5E9EC] tracking-wider">
            BUILD AND OWN
          </span>
        </div>
        <h2 class="font-black uppercase text-[46px] leading-[0.79] tracking-[-5%] text-white font-sans mb-6">
          Create Your Own Mine
        </h2>
        <p class="text-white text-base leading-[1.5] max-w-[634px] mx-auto">
          Launch a custom Mine and let players bet against your liquidity pool. You choose the token, set the fee tier, and define the rules. Once your Mine is live, anyone can play, provide liquidity, and generate activity that earns you fees over time.
        </p>
      </div>

      <!-- Create Mine Card -->
      <div class="bg-gradient-to-b from-[#202226] to-[#535667] rounded-lg p-8 relative overflow-hidden">
        <!-- Background elements -->
        <div class="absolute inset-0 opacity-20">
          <!-- Decorative elements would go here -->
        </div>

        <div class="relative z-10">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <!-- Left - Blocks illustration -->
            <div class="relative">
              <div class="w-full h-64 bg-white/5 rounded-lg flex items-center justify-center">
                <span class="text-white/50">BLOCKS.FUN illustration</span>
              </div>
            </div>

            <!-- Right - CTA -->
            <div class="text-center md:text-left">
              <button
                @click="openCreateMineModal"
                class="bg-white text-[#0F0F11] px-6 py-3 rounded-lg font-bold text-lg uppercase hover:opacity-90 transition-opacity mb-4"
              >
                CREATE MINE
              </button>
              <div class="flex items-center justify-center md:justify-start gap-1 text-sm text-[#4B5154]">
                <svg class="w-5 h-5 text-[#4B5154]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 5v5c0 4.418 3.582 8 7 8s7-3.582 7-8V5l-7-3zM10 12a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
                <span>All interactions are safe and protected!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Arrow from "~/assets/svg/arrow.svg";

const router = useRouter();
const route = useRoute();

function openCreateMineModal() {
  router.push({ query: { ...route.query, modal: "createMine" } });
}
</script>

