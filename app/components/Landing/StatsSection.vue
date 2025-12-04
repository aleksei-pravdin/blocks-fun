<template>
  <section class="w-full py-16">
    <div class="max-w-[1110px] w-full mx-auto px-4" style="padding-left: 65px;">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-[30px]">
        <!-- Active Players -->
        <div class="rounded-lg p-6 relative overflow-hidden" style="width: 330px; height: 200px;">
          <ClippedCornerSvg
            :width="330"
            :height="200"
            :clipPercent="20"
            fill-color="#FF4B01"
            :full-width="true"
            :full-height="true"
            border-radius="8px"
            class="absolute inset-0"
          />
          <NoiseBackground 
            mode="full"
            border-radius="8px" 
            blend-mode="multiply" 
            background-size="150% 150%"
            background-position="center"
          />
          <!-- Icon top right -->
          <img
            src="/leading/players_icon.svg"
            alt="Players Icon"
            class="absolute top-2 right-0"
            style="width: 135px; height: 125px;"
          />
          <div class="relative z-10 flex flex-col h-full justify-end">
            <div class="flex items-center gap-1.5">
              <span class="uppercase font-raj font-semibold text-xl text-[#E5E9EC]">
                ACTIVE PLAYERS
              </span>
            </div>
            <div class="text-[68px] font-bold leading-none text-[#FCF5F0] font-sans tracking-[-7%]" style="letter-spacing: -4px;">
              8900
            </div>
          </div>
        </div>

        <!-- Blocks Mined -->
        <div class="rounded-lg p-6 relative overflow-hidden" style="width: 330px; height: 200px;">
          <ClippedCornerSvg
            :width="330"
            :height="200"
            :clipPercent="20"
            fill-color="#FF4B01"
            :full-width="true"
            :full-height="true"
            border-radius="8px"
            class="absolute inset-0"
          />
          <NoiseBackground 
            mode="full"
            border-radius="8px" 
            blend-mode="multiply" 
            background-size="150% 150%"
            background-position="center"
          />
          <!-- Icon top right -->
          <img
            src="/leading/blocks_icon.svg"
            alt="Blocks Icon"
            class="absolute top-5 right-3"
            style="width: 110px; height: 90px;"
          />
          <div class="relative z-10 flex flex-col h-full justify-end">
            <div class="flex items-center gap-1.5">
              <span class="uppercase font-raj font-semibold text-xl text-[#E5E9EC]">
                BLOCKS MINED
              </span>
            </div>
            <div class="text-[68px] font-bold leading-none text-[#FCF5F0] font-sans tracking-[-7%]" style="letter-spacing: -4px;">
              89200
            </div>
          </div>
        </div>

        <!-- Rewards Paid -->
        <div class="rounded-lg p-6 relative overflow-hidden" style="width: 330px; height: 200px;">
          <ClippedCornerSvg
            :width="330"
            :height="200"
            :clipPercent="20"
            fill-color="#FF4B01"
            :full-width="true"
            :full-height="true"
            border-radius="8px"
            class="absolute inset-0"
          />
          <NoiseBackground 
            mode="full"
            border-radius="8px" 
            blend-mode="multiply" 
            background-size="150% 150%"
            background-position="center"
          />
          <!-- Icon top right -->
          <img
            src="/leading/reward_icon.svg"
            alt="Reward Icon"
            class="absolute top-5 right-5"
            style="width: 75px; height: 95px;"
          />
          <div class="relative z-10 flex flex-col h-full justify-end">
            <div class="flex items-center gap-1.5">
              <span class="uppercase font-raj font-semibold text-xl text-[#E5E9EC]">
                REWARDS PAID
              </span>
            </div>
            <div class="text-[68px] font-bold leading-none text-[#FCF5F0] font-sans tracking-[-7%]" style="letter-spacing: -4px;">
              $360K
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

