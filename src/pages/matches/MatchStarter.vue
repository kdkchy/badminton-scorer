<script setup>
import { ref } from "vue";

// players state
const left = ref(["", ""]);
const right = ref(["", ""]);

function addPlayer(side, index) {
  const name = prompt("Enter player name:");
  if (name) {
    if (side === "left") {
      left.value[index] = name;
    } else {
      right.value[index] = name;
    }
  }
}

function startMatch() {
  console.log({
    left: left.value,
    right: right.value,
  });
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screenp-4">
    <!-- New button on top -->
    <button class="btn btn-primary mb-6">New</button>

    <!-- Players grid -->
    <div class="grid grid-cols-2 gap-6 mb-6">
      <!-- Left side -->
      <div class="flex flex-col space-y-4">
        <button
          v-for="(player, i) in left"
          :key="'left-' + i"
          class="btn w-32"
          @click="addPlayer('left', i)"
        >
          {{ player || "+" }}
        </button>
      </div>

      <!-- Right side -->
      <div class="flex flex-col space-y-4">
        <button
          v-for="(player, i) in right"
          :key="'right-' + i"
          class="btn w-32"
          @click="addPlayer('right', i)"
        >
          {{ player || "+" }}
        </button>
      </div>
    </div>

    <!-- Start button -->
    <button class="btn btn-success w-40" @click="startMatch">Start</button>
  </div>
</template>
