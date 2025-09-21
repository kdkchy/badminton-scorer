<script setup lang="ts">
import { ref, onMounted } from "vue";
const games = ref<any[]>([]);
onMounted(() => {
  const keys = Object.keys(localStorage).filter((key) =>
    key.startsWith("match_")
  );

  // @ts-ignore
  games.value = keys.map((key) => {
    const data = JSON.parse(localStorage.getItem(key) || "{}");
    return {
      id: key.replace("match_", ""),
      ...data,
    };
  }) as any[];
});
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="w-full h-[100vh] shadow-md overflow-y-auto relative">
      <header
        class="sticky top-0 z-20 backdrop-blur-sm border-b border-purple-200 p-4 shadow-lg"
      >
        <div class="flex justify-center mb-3">
          <button class="px-4 py-2 rounded text-xl">Match List</button>
        </div>
      </header>

      <main class="p-4 space-y-4 pb-30">
        <div
          v-for="(game, i) in games"
          :key="i"
          class="card border-1 border-purple-200"
        >
          <div class="card-body grid grid-cols-3 items-center gap-3">
            <div class="text-center">
              <div class="badge badge-accent block mx-auto mb-1">
                {{ game.left }}
              </div>
            </div>
            <div class="text-center font-bold text-xl">
              {{ game.leftScore }} -
              {{ game.rightScore }}
            </div>
            <div class="text-center">
              <div class="badge badge-accent block mx-auto mb-1">
                {{ game.right }}
              </div>
            </div>
          </div>
          <span class="text-center pb-2 text-xs text-primary">{{
            game.id
          }}</span>
        </div>
      </main>
    </div>
  </div>
</template>
