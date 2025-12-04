<template>
  <section class="w-full py-39 pr-29 border-t border-[#1E1E1E]">
    <div class="max-w-[1040px] w-full mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <!-- Left - Block illustration -->
        <div class="relative">
          <img
            :src="lmaIcon"
            alt="LMA icon"
            class="w-full h-88 object-contain"
            style="margin-top: -36px"
          />
        </div>

        <!-- Right - Content -->
        <div>
          <div class="flex items-center gap-1.5 mb-3">
            <Arrow class="w-5 h-3" :filled="true" />
            <span class="uppercase font-raj font-semibold text-lg text-[#E5E9EC] ">
              BUILT ON CHAIN, BUILT FOR TRUST
            </span>
          </div>
          <h2 class="font-black text-[40px] leading-[0.8] tracking-[-1px] text-white font-sans mb-5">
            Learn more about<br />
            <span class="text-[#991DFF]">Blocks</span><span class="text-[#4F4557]">.fun</span>
          </h2>
          <p class="text-white text-[13px] font-semibold leading-[1.7] mb-6 tracking-[-0.27px]">
            This platform is built directly on Solana, which means every action is transparent, verifiable, and stored on-chain. There are no hidden rules, no secret odds, and no off-chain handling of bets or liquidity.
            <br /><br />
            Everything you see in the interface matches what happens inside the smart contracts.
          </p>
          <button class="group relative text-white px-6 py-3 rounded-lg font-bold text-sm uppercase hover:opacity-90 transition-opacity overflow-hidden">
            <ClippedCornerSvg
              :width="200"
              :height="48"
              fill-color="#FF4B01"
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
            <span class="relative z-10 flex items-center gap-2.5">
              START PLAYING NOW!
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

const lmaIcon = computed(() => {
  if (typeof window !== "undefined") {
    return new URL("/leading/lma_icon.svg", window.location.origin).href;
  }
  return "/leading/lma_icon.svg";
});
</script>

