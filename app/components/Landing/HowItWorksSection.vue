<template>
  <section class="w-full py-4">
    <div class="max-w-[1177px] pl-23 w-full mx-auto px-4">
      <!-- Title -->
      <div class="mt-11 mb-11">
        <div class="flex items-center gap-1.5">
          <Arrow class="w-6 h-4" :filled="true" style="width: 24px; height: 16px !important;" />
          <span class="uppercase font-raj font-semibold text-xl text-[#E5E9EC] tracking-wider" style="letter-spacing:-0.5px; line-height: 1.5;">
            LEARN
          </span>
        </div>
        <h2 class="font-black uppercase text-[48px] leading-[0.79] tracking-[-5%] text-white font-sans" style="letter-spacing:-2px">
          HOW IT WORKS
        </h2>
      </div>

      <!-- Steps -->
      <div class="grid mt-12 pt-9 grid-cols-1 md:grid-cols-2 gap-16 gap-y-15">
        <!-- Step 1 -->
        <div class="relative">
          <div class="rounded-lg pb-13 pr-20 relative overflow-hidden group">
            <HiwLineBg class="hiw-line-bg absolute bottom-0 right-9 pointer-events-none transition-all duration-300" style="width: 254px; height: 102px; color: #1E1E1E; opacity: 0.5;" />
            <div class="flex items-end mb-1 relative z-10">
              <HiwTitleIcon class="text-[#FF4B01] fill-current" style="width: 80px;" />
              <span class="text-[#FF4B01] font-bold text-xl italic uppercase" style="line-height: normal;">001</span>
              <HiwIcon01 class="text-[#FF4B01] fill-current" style="width: 40px; height: 40px;" />
            </div>
            <h3 class="text-white font-medium text-xl uppercase mb-4 relative z-10" style="font-weight: 500; letter-spacing: -0.7px;">Connect Your Wallet</h3>
            <p class="text-[#535667] text-base leading-[1.17] uppercase relative z-10" style="font-size: 15px; font-weight: 500; letter-spacing: -0.8px;">
              No accounts or sign-ups. Just connect your Solana wallet and you are ready to explore every Mine on the platform.
            </p>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="relative">
          <div class="rounded-lg pb-13 pr-20 relative overflow-hidden group">
            <HiwLineBg class="hiw-line-bg absolute bottom-0 right-9 pointer-events-none transition-all duration-300" style="width: 254px; height: 102px; color: #1E1E1E; opacity: 0.5;" />
            <div class="flex items-end mb-1 relative z-10">
              <HiwTitleIcon class="text-[#FF4B01] fill-current" style="width: 80px;" />
              <span class="text-[#FF4B01] font-bold text-xl italic uppercase" style="line-height: normal;">002</span>
              <HiwIcon02 class="text-[#FF4B01] fill-current" style="width: 40px; height: 40px; margin-left: 15px;" />
            </div>
            <h3 class="text-white font-medium text-xl uppercase mb-4 relative z-10" style="font-weight: 500; letter-spacing: -0.7px;">Choose a Mine</h3>
            <p class="text-[#535667] text-base leading-[1.17] uppercase relative z-10" style="font-size: 15px; font-weight: 500; letter-spacing: -0.8px;">
              Each Mine has its own token, fee tier, and liquidity pool. Choose the one that matches your preferred risk and payout style.
            </p>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="relative">
          <div class="rounded-lg pb-13 pr-20 relative overflow-hidden group">
            <HiwLineBg class="hiw-line-bg absolute bottom-0 right-9 pointer-events-none transition-all duration-300" style="width: 254px; height: 102px; color: #1E1E1E; opacity: 0.5;" />
            <div class="flex items-end mb-1 relative z-10">
              <HiwTitleIcon class="text-[#FF4B01] fill-current" style="width: 80px;" />
              <span class="text-[#FF4B01] font-bold text-xl italic uppercase" style="line-height: normal;">003</span>
              <HiwIcon03 class="text-[#FF4B01] fill-current" style="width: 40px; height: 40px;" />
            </div>
            <h3 class="text-white font-medium text-xl uppercase mb-4 relative z-10" style="font-weight: 500; letter-spacing: -0.7px;">Set Your Bet</h3>
            <p class="text-[#535667] text-base leading-[1.17] uppercase relative z-10" style="font-size: 15px; font-weight: 500; letter-spacing: -0.8px;">
              Enter how much you want to wager and choose the payout you want to go for. The system shows your exact win chance before you play.
            </p>
          </div>
        </div>

        <!-- Step 4 -->
        <div class="relative">
          <div class="rounded-lg pb-13 pr-20 relative overflow-hidden group">
            <HiwLineBg class="hiw-line-bg absolute bottom-0 right-9 pointer-events-none transition-all duration-300" style="width: 254px; height: 102px; color: #1E1E1E; opacity: 0.5;" />
            <div class="flex items-end mb-1 relative z-10">
              <HiwTitleIcon class="text-[#FF4B01] fill-current" style="width: 80px; " />
              <span class="text-[#FF4B01] font-bold text-xl italic uppercase" style="line-height: normal;">004</span>
              <HiwIcon04 class="text-[#FF4B01] fill-current" style="width: 42px; height: 35px; margin-left: 23px;" />
            </div>
            <h3 class="text-white font-medium text-xl uppercase mb-4 relative z-10" style="font-weight: 500; letter-spacing: -0.7px;">Play and WIN</h3>
            <p class="text-[#535667] text-base leading-[1.17] uppercase relative z-10" style="font-size: 15px; font-weight: 500; letter-spacing: -0.8px;">
              Confirm your transaction and get your result right away. Win and receive the payout. Lose and your bet enters the Mine pool.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Arrow from "~/assets/svg/arrow.svg";
import HiwTitleIcon from "~/assets/svg/hiw_title_icon.svg";
import HiwIcon01 from "~/assets/svg/hiw_icon_01.svg";
import HiwIcon02 from "~/assets/svg/hiw_icon_02.svg";
import HiwIcon03 from "~/assets/svg/hiw_icon_03.svg";
import HiwIcon04 from "~/assets/svg/hiw_icon_04.svg";
import HiwLineBg from "~/assets/svg/hiw_line_bg.svg";
</script>

<style scoped>
.group:hover .hiw-line-bg {
  opacity: 0.7 !important;
  color:#FF4B01 !important;
}
</style>

