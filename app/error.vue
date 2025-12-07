<template>
  <div class="min-h-screen bg-[#0C100F] flex flex-col items-center justify-center px-4 py-20">
    <!-- Icon and 404 Text Group -->
    <div class="flex flex-col items-center mb-16">
      <!-- 404 Icon -->
      <div class="relative mb-[-60px]">
        <img 
          src="/404_icon.png" 
          alt="404" 
          class="w-[189px] h-[241px] object-contain drop-shadow-[0px_7px_33.5px_rgba(0,0,0,1)]"
        />
      </div>

      <!-- 404 Text -->
      <h1 
        class="text-white font-tactic font-black text-[200px] leading-[0.79] tracking-[-5%] text-center"
        style="font-family: 'Tactic Sans', sans-serif;"
      >
        404
      </h1>
    </div>

    <!-- Page not found text -->
    <p 
      class="text-white font-chakra font-bold text-base leading-[1.3] text-center mb-12"
      style="font-family: 'Chakra Petch', sans-serif;"
    >
      Page not found!
    </p>

    <!-- GO BACK Button -->
    <button
      @click="goBack"
      class="group relative text-[#0F0F11] font-chakra font-bold text-lg leading-[1.3] uppercase cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
      style="font-family: 'Chakra Petch', sans-serif;"
    >
      <ClippedCornerSvg
        :width="310"
        :height="50"
        fill-color="#FFFFFF"
        :full-width="true"
        :full-height="true"
        :clip-size="26"
        class="absolute inset-0"
      />
      
      <div class="relative z-10 flex items-center justify-center gap-2.5 px-6 py-3 min-w-[310px] h-[50px]">
        <!-- Left Arrow Icon -->
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12.5 15L7.5 10L12.5 5" 
            stroke="#0F0F11" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          />
        </svg>
        <span>GO BACK</span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
  }
}>()

const router = useRouter()

function goBack() {
  if (process.client && window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

