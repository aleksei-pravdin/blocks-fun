<template>
  <section class="w-full py-16">
    <div class="max-w-[1040px] w-full mx-auto px-4">
      <div class="group relative rounded-lg px-12 pt-8 pb-9 overflow-hidden">
        <ClippedCornerSvg
          :width="1040"
          :height="320"
          fill-color="#991DFF"
          :full-width="true"
          :full-height="true"
          border-radius="12px"
          :clip-percent="11"
          class="absolute inset-0"
        />

        <!-- Coins image anchored to card container -->
        <img
          :src="bannerCoins"
          alt="GSN banner coins"
          class="pointer-events-none absolute right-[-2px] top-[0] h-[250px] object-contain z-0"
        />

        <!-- Single text container -->
        <div class="relative z-10 max-w-[520px]">
          <div class="flex items-center gap-1.5">
            <Arrow class="w-6 h-4" :filled="true" style="width: 24px; height: 16px !important;" />
            <span class="uppercase font-raj font-medium text-[22px] text-[#E5E9EC] tracking-wider" style="letter-spacing: -1px;">
              PLAY AND EARN
            </span>
          </div>
          <h2 class="font-black uppercase text-[44px] leading-[0.9] tracking-[-4%] text-white font-sans mb-2">
            GET STARTED NOW!
          </h2>
          <p class="text-white text-[12px] leading-[1.3] mb-3">
            Mine blocks, earn rewards, and compete with players worldwide in this innovative blockchain-based mining game.
          </p>
          <button class="group relative text-[#0F0F11] px-10 py-3 font-bold text-lg uppercase hover:opacity-90 transition-opacity overflow-hidden">
            <ClippedCornerSvg
              :width="200"
              :height="48"
              fill-color="#FFFFFF"
              :full-width="true"
              :full-height="true"
              border-radius="8px"
              class="absolute inset-0"
            />
            <NoiseBackground 
              border-radius="8px 25px 8px 8px" 
              blend-mode="multiply" 
              background-size="175px 56px"
              background-position="115% center"
            />
            <span class="relative z-10 flex items-center gap-2.5" style="letter-spacing: -1.8px;">
              CONNECT YOUR WALLET
              <ArrowOpen class="w-2.5 h-2.5" />
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Arrow from "~/assets/svg/arrow.svg";
import ArrowOpen from "~/assets/svg/arrow-open.svg";

const bannerCoins = computed(() => {
  if (typeof window !== "undefined") {
    return new URL("/leading/gsn_banner_coins.png", window.location.origin).href;
  }
  return "/leading/gsn_banner_coins.png";
});
</script>

