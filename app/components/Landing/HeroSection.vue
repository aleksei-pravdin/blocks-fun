<template>
  <section class="relative w-full min-h-[544px] flex items-center justify-center  overflow-hidden">
    <LandingBackgroundVectors />
    <LandingCubes />

    <div class="relative z-10 max-w-[1176px] w-full mx-auto px-4">
      <div class="text-center space-y-6">
        <!-- Title badge -->
        <div class="flex items-center justify-center gap-1.5 mb-2 relative">
          <Arrow class="w-6 h-4" :filled="true" style="width: 24px; height: 16px !important;" />
          <span class="uppercase font-raj font-semibold text-xl text-[#E5E9EC] tracking-wider" style="letter-spacing:0px">
            PLAY AND EARN
          </span>
          <!-- Pricticals -->
          <div class="pricticals absolute" style="width: 47px; height: 38px; left: calc(50% - 108px); top: -20px;">
            <div class="absolute bg-[#FF4B01]" style="width: 2px; height: 2px; left: 14px; top: 15px; border-radius: 0.68px;"></div>
            <div class="absolute bg-[#FF4B01]" style="width: 4px; height: 4px; left: 6px; top: 25px; border-radius: 0.68px;"></div>
            <div class="absolute bg-[#FF4B01]" style="width: 2px; height: 2px; left: 13px; top: -7px; border-radius: 0.68px;"></div>
            <div class="absolute bg-[#FF4B01]" style="width: 2px; height: 2px; left: 54px; top: -9px; border-radius: 0.68px;"></div>
          </div>
        </div>
        <!-- Main heading -->
        <h1 class="font-black uppercase text-[96px] leading-[0.79] text-white font-sans" style="letter-spacing: -5px;">
          GRIND YOUR <br/> BLOCKS
        </h1>

        <!-- Description -->
        <p class="font-bold text-sm leading-[1.5] text-white max-w-[590px] mx-auto mt-9">
          Mine blocks, earn rewards, and compete with players worldwide in <br/> this innovative blockchain-based mining game.
        </p>

        <!-- CTA Buttons -->
        <div class="flex items-center justify-center gap-4 mt-12">
          <button class="group relative text-white px-6 py-2.5 font-bold text-sm uppercase hover:opacity-90 transition-opacity overflow-hidden">
            <ClippedCornerSvg
              :width="200"
              :height="48"
              fill-color="#991DFF"
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
            <span class="relative z-10 flex items-center gap-2.5" style="letter-spacing: -0.5px;">
              START PLAYING THE GAME
              <ArrowOpen class="w-3 h-3" />
            </span>
          </button>

          <button class="group relative text-[#0F0F11] px-6 py-2.5 font-bold text-sm uppercase hover:opacity-90 transition-opacity overflow-hidden">
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
            <span class="relative z-10 flex items-center gap-2.5" style="letter-spacing: -0.5px;">
              VIEW LEADERBOARD
              <ArrowOpen class="w-3 h-3" />
            </span>
          </button>
        </div>

        <!-- Safety info -->
        <div class="flex items-center justify-center gap-1 mt-7">
          <KnightShield class="w-5 h-5 text-[#4B5154] fill-current" />
          <span class="text-xs font-semibold text-[#4B5154]">
            All interactions are safe and protected!
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Arrow from "~/assets/svg/arrow.svg";
import ArrowOpen from "~/assets/svg/arrow-open.svg";
import KnightShield from "~/assets/svg/knight-shield.svg";
</script>


