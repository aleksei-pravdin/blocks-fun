<template>
  <div>
    <div :class="['flex justify-between gap-4', itemsAlign === 'start' ? 'items-start' : 'items-end']">
      <div :class="['flex', image ? 'gap-7' : '', itemsAlign === 'start' ? 'items-start' : 'items-end']">
        <!-- Image slot -->
        <slot name="image">
          <img
            v-if="image"
            :src="image"
            :alt="imageAlt"
            :class="imageClass"
          />
        </slot>

        <div :class="['flex flex-col', badgeGap === 'large' ? 'gap-0' : 'gap-0']">
          <div v-if="badge || $slots.badgeIcon" :class="['flex items-center gap-1.5', badgeGap === 'large' ? 'mb-[31px]' : '']">
            <slot name="badgeIcon">
              <component
                v-if="showBadgeIcon"
                :is="badgeIcon"
                class="w-6 h-4"
                :filled="badgeIconFilled"
                :style="badgeIconStyle"
              />
            </slot>
            <span
              v-if="badge"
              class="uppercase font-raj font-semibold text-xl text-[#E5E9EC] tracking-wider"
              :style="{ letterSpacing: '-0.5px', lineHeight: '1.5' }"
            >
              {{ badge }}
            </span>
          </div>

          <h1
            :class="[
              'font-black uppercase text-white font-sans',
              image?'pb-2':'',
              titleSize === 'large' ? 'text-[48px] leading-[0.9] tracking-[-5%]' : 'text-5xl',
            ]"
            :style="{ letterSpacing: titleSize === 'large' ? '-2px' : undefined }"
          >
            {{ title }}
          </h1>
        </div>
      </div>

      <div :class="['h-full flex flex-col items-end justify-end', image ? 'mb-3' : '']">
        <slot name="actions" />
      </div>
    </div>

    <!-- Divider -->
    <div
      v-if="showDivider"
      :class="[
        'w-full',
        dividerHeight,
        image ? 'mt-[19px]' : dividerMarginTop || 'mt-8',
        dividerMarginBottom,
      ]"
      :style="{ backgroundColor: dividerColor }"
    />
  </div>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { computed, useSlots } from "vue";
import Arrow from "~/assets/svg/arrow.svg";

interface Props {
  title: string;
  badge?: string;
  badgeIcon?: Component | string;
  badgeIconFilled?: boolean;
  badgeIconStyle?: string | Record<string, any>;
  itemsAlign?: "start" | "end";
  badgeGap?: "normal" | "large";
  image?: string;
  imageAlt?: string;
  imageClass?: string;
  titleSize?: "large" | "medium";
  showDivider?: boolean;
  dividerColor?: string;
  dividerHeight?: string;
  dividerMarginTop?: string;
  dividerMarginBottom?: string;
}

const props = withDefaults(defineProps<Props>(), {
  badge: undefined,
  badgeIcon: Arrow,
  badgeIconFilled: true,
  badgeIconStyle: () => ({ width: "24px", height: "16px !important" }),
  itemsAlign: "end",
  badgeGap: "normal",
  image: undefined,
  imageAlt: "",
  imageClass: "size-24 rounded-full",
  titleSize: "large",
  showDivider: true,
  dividerColor: "#262B33",
  dividerHeight: "h-px",
  dividerMarginTop: "mt-8",
  dividerMarginBottom: "",
});

const slots = useSlots();

// Show badge icon only if badge is provided and no custom badgeIcon slot
const showBadgeIcon = computed(() => props.badge && !slots.badgeIcon);
</script>

