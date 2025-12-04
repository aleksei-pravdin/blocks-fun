<template>
  <div>
    <TransitionRoot as="template" :show="open">
      <Dialog class="relative z-50" @close="closeModal">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to=""
          leave="ease-in duration-200"
          leave-from=""
          leave-to="opacity-0"
        >
          <div
            class="fixed inset-0 bg-[rgba(12,16,15,0.83)] transition-opacity"
          ></div>
        </TransitionChild>

        <div class="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div
            class="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg text-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
              >
                <div class="bg-[#222328] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="flex flex-col items-center">
                    <!-- Error Icon -->
                    <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 mb-4">
                      <svg
                        class="h-6 w-6 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                      </svg>
                    </div>

                    <!-- Title -->
                    <h3 class="font-raj font-bold text-2xl mb-2 text-center">
                      {{ title }}
                    </h3>

                    <!-- Error Message -->
                    <p class="text-center text-sm font-raj font-medium text-[#E5E9EC] mb-6">
                      {{ message }}
                    </p>

                    <!-- Error Details (if provided) -->
                    <div
                      v-if="details"
                      class="w-full mb-6 bg-[rgba(111,112,119,0.25)] rounded-md px-3 py-2 text-xs font-mono text-[#B5B5B5] break-all"
                    >
                      {{ details }}
                    </div>

                    <!-- Close Button -->
                    <button
                      @click="closeModal"
                      class="w-full bg-[#FF4B01] text-white py-3 rounded-lg font-bold text-base uppercase hover:opacity-90 transition-opacity"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

const router = useRouter();
const route = useRoute();

const open = computed(() => route.query.modal === "error");

const title = computed(() => {
  const errorTitle = route.query.errorTitle;
  if (typeof errorTitle === "string") {
    return decodeURIComponent(errorTitle);
  }
  return "Error";
});

const message = computed(() => {
  const errorMessage = route.query.errorMessage;
  if (typeof errorMessage === "string") {
    return decodeURIComponent(errorMessage);
  }
  return "Something went wrong. Please try again.";
});

const details = computed(() => {
  const errorDetails = route.query.errorDetails;
  if (typeof errorDetails === "string") {
    return decodeURIComponent(errorDetails);
  }
  return null;
});

function closeModal() {
  const newQuery = { ...route.query };
  delete newQuery["modal"];
  delete newQuery["errorTitle"];
  delete newQuery["errorMessage"];
  delete newQuery["errorDetails"];
  router.push({ query: newQuery });
}
</script>

