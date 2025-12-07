<template>
  <div class="flex flex-col mt-5">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-[#E5E9EC] font-raj font-bold text-[22px] uppercase">RECENT GAMES</h2>
    </div>
    <div class="h-[3px] w-full bg-[#1E1E1E] "></div>
    <div class="overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="">
            <th class="text-left py-1 pr-1 w-[150px]">
              <span class="text-[#9497A4] font-chakra font-bold text-sm uppercase">Address</span>
            </th>
            <th class="text-left py-1 px-1 w-[45%]">
              <span class="text-[#9497A4] font-chakra font-bold text-sm uppercase">Tx</span>
            </th>
            <th class="text-left py-1 px-1">
              <span class="text-[#9497A4] font-chakra font-bold text-sm uppercase">Result</span>
            </th>
            <th class="text-left py-1 px-1">
              <span class="text-[#9497A4] font-chakra font-bold text-sm uppercase">Bet</span>
            </th>
            <th class="text-left py-1 px-1">
              <span class="text-[#9497A4] font-chakra font-bold text-sm uppercase">Payout</span>
            </th>
            <th class="text-right py-1">
              <span class="text-[#9497A4] font-chakra font-bold text-sm uppercase">Time</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(game, i) in games"
            :key="`game-${i}`"
            class="border-b border-[rgba(62,63,71,0.58)] last:border-0 hover:bg-[rgba(255,255,255,0.02)] transition-colors"
          >
            <td class="py-3 pr-1">
              <span class="text-[#9497A4] font-chakra font-bold text-sm bg-[rgba(148,151,164,0.22)] px-2 py-1 rounded flex items-center gap-2 inline-flex">
                {{ game.address }}
                <External class="w-4 h-4 text-[#9497A4] cursor-pointer hover:text-white transition-colors" />
              </span>
            </td>
            <td class="py-3 px-1">
              <span class="text-[#9497A4] font-chakra font-bold text-sm bg-[rgba(148,151,164,0.22)] px-2 py-1 rounded flex items-center gap-2 inline-flex">
                {{ game.tx }}
                <External class="w-4 h-4 text-[#9497A4] cursor-pointer hover:text-white transition-colors" />
              </span>
            </td>
            <td class="py-3 px-1">
              <span
                :class="[
                  'px-6 py-1 rounded font-chakra font-bold text-sm',
                  game.result === 'WIN' ? 'bg-[rgba(136,255,0,0.22)] text-[#88FF00]' : 'bg-[rgba(255,75,1,0.22)] text-[#FF4B01]'
                ]"
              >
                {{ game.result }}
              </span>
            </td>
            <td class="py-3 px-1">
              <span class="text-white font-chakra font-bold text-sm">{{ game.bet }}</span>
            </td>
            <td class="py-3 px-1">
              <span class="text-white font-chakra font-bold text-sm">{{ game.payout }}</span>
            </td>
            <td class="py-3 pl-1 text-right">
              <span class="text-white font-chakra font-bold text-sm">{{ game.time }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import External from "~/assets/svg/external.svg";

interface Game {
  address: string;
  tx: string;
  result: 'WIN' | 'LOSS';
  bet: string;
  payout: string;
  time: string;
}

const games: Game[] = [
  {
    address: 'A1bC...3dEf',
    tx: '4Ghl...Jk22',
    result: 'WIN',
    bet: '72.5 BONK',
    payout: '84.3 BONK',
    time: '27 MIN AGO'
  },
  {
    address: 'B5cD...8eFg',
    tx: '6HiJ...K133',
    result: 'WIN',
    bet: '65.8 BONK',
    payout: '91.7 BONK',
    time: '30 MIN AGO'
  },
  {
    address: 'C7dE...1fGh',
    tx: '8JkL...Mn44',
    result: 'LOSS',
    bet: '78.9 BONK',
    payout: '53.2 BONK',
    time: '31 MIN AGO'
  },
  {
    address: 'D9eF...2gHi',
    tx: 'OLmN...Op55',
    result: 'WIN',
    bet: '88.1 BONK',
    payout: '66.4 BONK',
    time: '28 MIN AGO'
  }
];
</script>


