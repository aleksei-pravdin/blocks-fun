<template>
  <div class="relative min-h-screen w-full bg-[#0C100F]">
    <div class="relative z-10 mx-auto max-w-[1728px] w-full px-[60px] pt-18 pb-20">
      <!-- Header -->
      <div class="mb-[21px]">
        <PageHeader
          title="LEADERBOARD"
          badge="GAME"
        >


          <template #actions>
            <div class="flex gap-2">
              <!-- ALL TIME button -->
              <button
                class="flex items-center justify-between gap-2.5 px-3.5 h-[42px] rounded-[10px] bg-[rgba(83,86,103,0.48)] text-[#9497A4] font-chakra font-bold text-base hover:opacity-90 transition-opacity"
              >
                <span>ALL TIME</span>
                <svg
                  width="7"
                  height="12"
                  viewBox="0 0 7 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="flex-shrink-0"
                >
                  <path
                    d="M1 1L6 6L1 11"
                    stroke="#9497A4"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>

              <!-- BONK dropdown -->
              <div class="relative ml-0">
                <Listbox v-model="selectedToken" as="div" class="relative" v-slot="{ open }">
                  <ListboxButton
                    class="flex items-center justify-between gap-2.5 px-3.5 h-[42px] rounded-[10px] bg-[rgba(83,86,103,0.48)] text-[#9497A4] font-chakra font-bold text-base cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <span>{{ selectedToken }}</span>
                    <svg
                      width="12"
                      height="7"
                      viewBox="0 0 12 7"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="flex-shrink-0 transition-transform"
                      :class="{ 'rotate-180': open }"
                    >
                      <path
                        d="M1 1L6 6L11 1"
                        stroke="#FFFFFF"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </ListboxButton>
                  <Transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                  >
                    <ListboxOptions
                      class="absolute z-10 mt-0 w-[140px] overflow-hidden rounded-b-[10px] border-2 border-t-0 border-[rgba(83,86,103,0.57)] bg-[#2E3239] shadow-lg"
                    >
                      <ListboxOption
                        v-for="token in tokenOptions"
                        :key="token"
                        :value="token"
                        v-slot="{ active, selected }"
                        as="template"
                      >
                        <li
                          :class="[
                            active ? 'bg-[rgba(83,86,103,0.4)]' : '',
                            'relative cursor-pointer select-none py-3.5 px-3.5 text-[#9497A4] font-chakra font-bold text-base leading-[1.5]',
                          ]"
                        >
                          {{ token }}
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </Transition>
                </Listbox>
              </div>
            </div>
          </template>
        </PageHeader>
      </div>

      <!-- Table Header -->
      <div class="mb-[21px]">
        <p class="font-raj font-bold text-base text-[#585E69]">
          Rank/Player
        </p>
      </div>

      <!-- Leaderboard Table -->
      <div class="space-y-0">
        <div
          v-for="(entry, index) in leaderboardData"
          :key="index"
          class="flex items-center justify-between gap-2.5 pr-3.5 h-[56px]  border-b-2 border-[rgba(83,86,103,0.29)]"
        >
          <!-- Left: Rank and Player -->
          <div class="flex items-center gap-2.5">
            <span class="font-raj font-bold text-base text-[#E5E9EC]">
              {{ entry.rank }}.
            </span>
            <div
              class="flex items-center justify-between gap-[18px] px-[11px] py-[5px] rounded-[5px] bg-[rgba(111,112,119,0.26)]"
              style="width: 251px;"
            >
              <span class="font-chakra font-bold text-sm text-[#9497A4]">
                {{ entry.address }}
              </span>
              <UserIcon class="w-5 h-5 flex-shrink-0" />
            </div>
          </div>

          <!-- Right: Stats -->
          <div class="flex items-center justify-between gap-[37px]" style="width: 494px;">
            <span class="font-raj font-bold text-base text-[#E5E9EC] text-right">
              {{ entry.totalBalance }}
            </span>
            <span
              class="font-raj font-bold text-base text-[#E5E9EC] text-right"
              :class="entry.change.startsWith('+') ? 'text-[#E5E9EC]' : 'text-[#E5E9EC]'"
            >
              {{ entry.change }}
            </span>
            <span class="font-raj font-bold text-base text-[#E5E9EC] text-right">
              {{ entry.bets }}
            </span>
            <span class="font-raj font-bold text-base text-[#E5E9EC] text-right">
              {{ entry.lastActive }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";
import UserIcon from "~/assets/svg/user.svg";
import PageHeader from "~/components/PageHeader.vue";

const selectedToken = ref("BONK");
const tokenOptions = ["SOL", "USDC", "JUP"];

// Mock leaderboard data
const leaderboardData = ref([
  {
    rank: 1,
    address: "Hk8h...SGAy",
    totalBalance: "134,567 BONK",
    change: "+4,321 BONK",
    bets: "742",
    lastActive: "3d ago",
  },
  {
    rank: 2,
    address: "Hk8h...SGAy",
    totalBalance: "128,900 BONK",
    change: "-2,150 BONK",
    bets: "715",
    lastActive: "1d ago",
  },
  {
    rank: 3,
    address: "Hk8h...SGAy",
    totalBalance: "130,450 BONK",
    change: "+2,800 BONK",
    bets: "690",
    lastActive: "4d ago",
  },
  {
    rank: 4,
    address: "Hk8h...SGAy",
    totalBalance: "126,700 BONK",
    change: "+5,000 BONK",
    bets: "675",
    lastActive: "5d ago",
  },
  {
    rank: 5,
    address: "Hk8h...SGAy",
    totalBalance: "123,400 BONK",
    change: "+3,900 BONK",
    bets: "688",
    lastActive: "6d ago",
  },
  {
    rank: 6,
    address: "Hk8h...SGAy",
    totalBalance: "129,800 BONK",
    change: "+4,500 BONK",
    bets: "670",
    lastActive: "7d ago",
  },
  {
    rank: 7,
    address: "Hk8h...SGAy",
    totalBalance: "132,600 BONK",
    change: "+2,600 BONK",
    bets: "695",
    lastActive: "8d ago",
  },
  {
    rank: 8,
    address: "Hk8h...SGAy",
    totalBalance: "127,900 BONK",
    change: "+3,300 BONK",
    bets: "680",
    lastActive: "9d ago",
  },
]);
</script>
