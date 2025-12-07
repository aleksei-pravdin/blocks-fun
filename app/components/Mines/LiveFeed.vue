<template>
  <div class="relative w-full h-[28px] mt-4 overflow-hidden bg-[#0C100F]">
    <!-- Left shadow gradient -->
    <div class="absolute left-0 top-0 bottom-0 w-60 bg-gradient-to-r from-[#0C100F] via-[rgba(12,16,15,0.9)] via-[rgba(12,16,15,0.5)] to-transparent z-10 pointer-events-none"></div>
    <!-- Right shadow gradient -->
    <div class="absolute right-0 top-0 bottom-0 w-60 bg-gradient-to-l from-[#0C100F] via-[rgba(12,16,15,0.9)] via-[rgba(12,16,15,0.5)] to-transparent z-10 pointer-events-none"></div>
    <div class="flex items-center gap-[10px] h-full transition-transform duration-300 ease-out">
      <!-- Game cards -->
      <TransitionGroup
        name="game-item"
        tag="div"
        class="flex items-center gap-[10px] h-full"
      >
        <div
          v-for="game in games"
          :key="game.id"
          :class="[
            'flex items-center gap-[18px] px-[11px] py-[5px] rounded-[5px] flex-shrink-0',
            game.status === 'win' ? 'bg-[rgba(136,255,0,0.19)]' : 
            'bg-[rgba(255,75,1,0.19)]'
          ]"
        >
          <div class="flex items-center gap-[5px]">
            <div 
              :class="[
                'w-[10px] h-[10px] rounded-full',
                game.status === 'win' ? 'bg-[#88FF00]' : 'bg-[#FF4B01]'
              ]"
            ></div>
            <span 
              :class="[
                'font-chakra font-bold text-sm',
                game.status === 'win' ? 'text-[#88FF00]' : 'text-[#FF4B01]'
              ]"
            >{{ game.address }}</span>
          </div>
          <div class="flex items-center gap-[5px]">
            <span 
              :class="[
                'font-chakra font-bold text-sm',
                game.status === 'win' ? 'text-[#88FF00]' : 'text-[#FF4B01]'
              ]"
            >BET: {{ game.bet }}</span>
            <span 
              v-if="game.status === 'win'"
              class="font-chakra font-bold text-sm text-[#88FF00]"
            >WON {{ game.won }}</span>
            <span 
              v-else
              class="font-chakra font-bold text-sm text-[#FF4B01]"
            >LOST</span>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Game {
  id: string;
  address: string;
  bet: string;
  won?: string;
  status: 'win' | 'loss';
}

const games = ref<Game[]>([
  { id: '1', address: 'FtA...Qw11', bet: '2 SOL', won: '3 SOL', status: 'win' },
  { id: '2', address: 'B5c...8eFg', bet: '1.5 SOL', won: '2.2 SOL', status: 'win' },
  { id: '3', address: 'C7d...1fGh', bet: '3 SOL', status: 'loss' },
  { id: '4', address: 'E1f...3iJk', bet: '1.8 SOL', won: '2.5 SOL', status: 'win' },
  { id: '5', address: 'F2g...4jKl', bet: '2 SOL', status: 'loss' },
]);

// Generate random game
function generateRandomGame(): Game {
  const addresses = ['FtA', 'B5c', 'C7d', 'D9e', 'E1f', 'F2g', 'G3h', 'H4i', 'I5j', 'J6k'];
  const address = `${addresses[Math.floor(Math.random() * addresses.length)]}...${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const bet = `${(Math.random() * 5 + 0.5).toFixed(1)} SOL`;
  const isWin = Math.random() > 0.5;
  
  return {
    id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
    address,
    bet,
    won: isWin ? `${(parseFloat(bet) * (1.5 + Math.random() * 1.5)).toFixed(1)} SOL` : undefined,
    status: isWin ? 'win' : 'loss',
  };
}

// Add new game every 3-5 seconds
let addInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  const addNewGame = () => {
    const newGame = generateRandomGame();
    games.value.unshift(newGame);
    
    // Keep only last 20 games
    if (games.value.length > 20) {
      games.value = games.value.slice(0, 20);
    }
    
    // Remove oldest game after 30 seconds
    setTimeout(() => {
      const index = games.value.findIndex(g => g.id === newGame.id);
      if (index !== -1) {
        games.value.splice(index, 1);
      }
    }, 30000);
  };
  
  // Add first game after 2 seconds
  setTimeout(() => {
    addNewGame();
    // Then add new games every 3-5 seconds
    addInterval = setInterval(() => {
      addNewGame();
    }, 3000 + Math.random() * 2000);
  }, 2000);
});

onUnmounted(() => {
  if (addInterval) {
    clearInterval(addInterval);
  }
});
</script>

<style scoped>
.game-item-enter-active {
  transition: all 0.3s ease-out;
}

.game-item-leave-active {
  transition: all 0.3s ease-in;
}

.game-item-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.game-item-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.game-item-move {
  transition: transform 0.3s ease-out;
}
</style>

