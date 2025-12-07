<template>
  <div class="relative w-full h-[28px] mt-4 overflow-hidden bg-[#0C100F]">
    <!-- Left shadow gradient -->
    <div class="absolute left-0 top-0 bottom-0 w-60 bg-gradient-to-r from-[#0C100F] via-[rgba(12,16,15,0.9)] via-[rgba(12,16,15,0.5)] to-transparent z-10 pointer-events-none"></div>
    <!-- Right shadow gradient -->
    <div class="absolute right-0 top-0 bottom-0 w-60 bg-gradient-to-l from-[#0C100F] via-[rgba(12,16,15,0.9)] via-[rgba(12,16,15,0.5)] to-transparent z-10 pointer-events-none"></div>
    <div class="flex items-center gap-[10px] h-full animate-scroll">
      <!-- Mock game cards -->
      <div
        v-for="(game, i) in games"
        :key="`game-${i}`"
        :class="[
          'flex items-center gap-[18px] px-[11px] py-[5px] rounded-[5px] flex-shrink-0',
          game.status === 'win' ? 'bg-[rgba(136,255,0,0.19)]' : 
          game.status === 'loss' ? 'bg-[rgba(255,75,1,0.19)]' : 
          'bg-[rgba(148,151,164,0.19)]'
        ]"
      >
        <div class="flex items-center gap-[5px]">
          <div 
            :class="[
              'w-[10px] h-[10px] rounded-full',
              game.status === 'win' ? 'bg-[#88FF00]' : 
              game.status === 'loss' ? 'bg-[#FF4B01]' : 
              'bg-[rgba(148,151,164,0.27)]'
            ]"
          ></div>
          <span 
            :class="[
              'font-chakra font-bold text-sm',
              game.status === 'win' ? 'text-[#88FF00]' : 
              game.status === 'loss' ? 'text-[#FF4B01]' : 
              'text-[#9497A4]'
            ]"
          >{{ game.address }}</span>
        </div>
        <div class="flex items-center gap-[5px]">
          <span 
            :class="[
              'font-chakra font-bold text-sm',
              game.status === 'win' ? 'text-[#88FF00]' : 
              game.status === 'loss' ? 'text-[#FF4B01]' : 
              'text-[#9497A4]'
            ]"
          >BET: {{ game.bet }}</span>
          <span 
            v-if="game.status === 'win'"
            :class="[
              'font-chakra font-bold text-sm',
              'text-[#88FF00]'
            ]"
          >WON {{ game.won }}</span>
          <span 
            v-else-if="game.status === 'loss'"
            :class="[
              'font-chakra font-bold text-sm',
              'text-[#FF4B01]'
            ]"
          >LOST</span>
          <span 
            v-else
            :class="[
              'font-chakra font-bold text-sm',
              'text-[#9497A4]'
            ]"
          >PENDING</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Game {
  address: string;
  bet: string;
  won?: string;
  status: 'win' | 'loss' | 'pending';
}

const games: Game[] = [
  { address: 'FtA...Qw11', bet: '2 SOL', won: '3 SOL', status: 'win' },
  { address: 'B5c...8eFg', bet: '1.5 SOL', won: '2.2 SOL', status: 'win' },
  { address: 'C7d...1fGh', bet: '3 SOL', status: 'loss' },
  { address: 'D9e...2gHi', bet: '2.5 SOL', status: 'pending' },
  { address: 'E1f...3iJk', bet: '1.8 SOL', won: '2.5 SOL', status: 'win' },
  { address: 'F2g...4jKl', bet: '2 SOL', status: 'loss' },
  { address: 'G3h...5kLm', bet: '1.2 SOL', status: 'pending' },
];
</script>

<script setup lang="ts">
</script>

<style scoped>
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-scroll {
  animation: scroll 30s linear infinite;
}
</style>

