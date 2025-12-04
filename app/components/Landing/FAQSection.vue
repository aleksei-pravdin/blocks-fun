<template>
  <section class="w-full py-20">
    <div class="max-w-[690px] w-full mx-auto px-4">
      <!-- Title -->
      <div class="mb-12">
        <div class="flex items-center gap-1.5 mb-4">
          <Arrow class="w-5 h-3" :filled="true" />
          <span class="uppercase font-raj font-semibold text-xl text-[#E5E9EC] tracking-wider">
            MORE QUESTIONS? SEND AN EMAIL TO HEY@BLOCKS.FUN
          </span>
        </div>
        <h2 class="font-black uppercase text-[46px] leading-[0.79] tracking-[-5%] text-white font-sans">
          FAQ
        </h2>
      </div>

      <!-- FAQ Items -->
      <div class="space-y-4">
        <!-- Expanded FAQ Item -->
        <div class="bg-white/5 rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-white font-semibold text-xl uppercase">What is a Mine?</h3>
            <svg class="w-4 h-4 text-[#D9D9D9]" fill="none" stroke="currentColor" viewBox="0 0 18 18">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5l8 8-8 8" />
            </svg>
          </div>
          <p class="text-white text-sm leading-[1.42] uppercase tracking-[4%]">
            A Mine is a betting pool backed by real liquidity on Solana. Players bet against the pool and get instant results.
          </p>
        </div>

        <!-- Collapsed FAQ Items -->
        <div 
          v-for="(item, index) in faqItems" 
          :key="index"
          class="flex items-center justify-between p-4 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors"
        >
          <h3 class="text-[#535667] font-semibold text-xl uppercase">{{ item.question }}</h3>
          <svg class="w-3 h-3 text-[#535667]" fill="none" stroke="currentColor" viewBox="0 0 13 13">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1l6 6-6 6" />
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Arrow from "~/assets/svg/arrow.svg";

const faqItems = [
  { question: 'How do I win a bet?' },
  { question: 'What happens if I lose?' },
  { question: 'Is this platform safe?' },
  { question: 'Can anyone provide liquidity or create a Mine?' }
]
</script>

