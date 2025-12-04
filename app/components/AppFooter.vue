<template>
  <footer
    class="w-full bg-[#131817] mt-20 pt-9 pb-10 border-t border-[#151820]"
  >
    <!-- Floating happy coin -->
    
    <div class="max-w-[1728px] w-full mx-auto px-6 relative">
      <img
        src="/happy_icon.png"
        alt="Happy coin"
        class="pointer-events-none absolute right-[360px] top-[-48px] -translate-y-1/2 w-[107px] h-[128px] hidden lg:block"
      />
      <!-- Top content -->
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-10"
      >
        <!-- Logo and description -->
        <div class="flex items-start gap-3 max-w-[540px]">
          <Logo class="flex-shrink-0 " :filled="true"  style="width: 44px; height: 44px;" />
          <div class="flex flex-col">
            <span
              class="uppercase font-bold text-[35px] leading-[1.25] font-raj text-[#E5E9EC] mb-2"
            >
              BLOCKS.FUN
            </span>
            <p class="text-[#D1D5DB] text-sm leading-[1.3]">
              Mine blocks, earn rewards, and compete with players worldwide in this
              innovative blockchain-based mining game.
            </p>
          </div>
        </div>

        <!-- Social links -->
        <div class="flex w-full md:w-auto justify-start md:justify-end">
          <div class="flex items-center gap-8 mt-8 mr-17">
            <a
              href="#"
              class="group inline-flex items-center justify-center"
              aria-label="Twitter"
            >
              <TwitterIcon
                class="text-[#9CA3AF] group-hover:text-white transition-colors"
                style="width: 24px; height: 24px;"
              />
            </a>
            <a
              href="#"
              class="group inline-flex items-center justify-center"
              aria-label="Discord"
            >
              <DiscordIcon
                class="text-[#9CA3AF] group-hover:text-white transition-colors"
                style="width: 24px; height: 24px;"
              />
            </a>
            <a
              href="#"
              class="group inline-flex items-center justify-center"
              aria-label="Telegram"
            >
              <TelegramIcon
                class="text-[#9CA3AF] group-hover:text-white transition-colors"
                style="width: 24px; height: 24px;"
              />
            </a>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="h-px w-full bg-[#111827]/80 mb-8"></div>

      <!-- Bottom -->
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 pr-14"
      >
        <p class="text-[#4B5563] text-[11px] leading-[1.4] max-w-[780px]">
          BLOCKS.FUN is operated by BLOCKS COMPANY – San Pedro, Barrio Dent, Del Centro
          Cultural Costarricense Norteamericano, 200 metros al norte y 50 al este,
          Edificio Ofident, Oficina Número Tres, San José – Montes de Oca, Costa Rica
        </p>
        <div class="flex items-center justify-end gap-5 px-3 py-1">

          <p class="text-[#9CA3AF] text-[11px] leading-[1.4] font-semibold text-right">
            © 2025 blocks.fun | All Rights Reserved
          </p>
          <button
          type="button"
          @click="scrollToTop"
          class="group  flex h-8 w-8 items-center justify-center bg-[#FF4B01]  hover:bg-[#FF6B26] transition-colors"
          aria-label="Back to top"
          >
          <ArrowOpenIcon
          class="h-[18px] w-[18px] -rotate-90 group-hover:translate-y-[-1px] transition-transform text-transparent"
          style="stroke:#000"
          />
        </button>
      </div>
      </div>
    </div>

    <!-- Back to top button -->
  </footer>
</template>

<script setup lang="ts">
import Logo from "~/assets/svg/logo.svg";
import DiscordIcon from "~/assets/svg/discord.svg";
import TelegramIcon from "~/assets/svg/telegram.svg";
import TwitterIcon from "~/assets/svg/new-twitter.svg";
import ArrowOpenIcon from "~/assets/svg/arrow_open_icon.svg";

const scrollToTop = () => {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>
