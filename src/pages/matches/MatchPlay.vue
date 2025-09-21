<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const matchId = route.params.id;

// counters
const leftScore = ref(0);
const rightScore = ref(0);
const rally = ref(0);
const leftPlayers = ref("");
const rightPlayers = ref("");
const scores = ref([]);
const longestRally = ref(0);

onMounted(() => {
  const saved = localStorage.getItem(matchId);
  if (saved) {
    const data = JSON.parse(saved);
    leftPlayers.value = data.left;
    rightPlayers.value = data.right;
  }
});

function saveGame() {
  localStorage.setItem(
    matchId,
    JSON.stringify({
      left: leftPlayers.value,
      right: rightPlayers.value,
      leftScore: leftScore.value,
      rightScore: rightScore.value,
      scores: scores.value,
    })
  );
}

function incrementLeft() {
  const newLeft = leftScore.value + 1;
  const newRight = rightScore.value;
  const rallyLength = rally.value + 1;

  scores.value.push({
    pointFor: "left",
    scorer: leftPlayers.value,
    leftScore: newLeft,
    rightScore: newRight,
    rallyLength,
    difference: newLeft - newRight,
  });

  if (rally.value > longestRally.value) {
    longestRally.value = rally.value;
  }

  leftScore.value = newLeft;
  rally.value = 0;
}

function incrementRight() {
  const newLeft = leftScore.value;
  const newRight = rightScore.value + 1;
  const rallyLength = rally.value + 1;

  scores.value.push({
    pointFor: "right",
    scorer: rightPlayers.value,
    leftScore: newLeft,
    rightScore: newRight,
    rallyLength,
    difference: newLeft - newRight,
  });

  if (rally.value > longestRally.value) {
    longestRally.value = rally.value;
  }

  rightScore.value = newRight;
  rally.value = 0;
}

function incrementRally() {
  rally.value++;
}

function finishGame() {
  const finalData = {
    left: leftPlayers.value,
    right: rightPlayers.value,
    leftScore: leftScore.value,
    rightScore: rightScore.value,
    scores: scores.value,
    longestRally: longestRally.value,
    finishedAt: new Date().toISOString(),
  };

  localStorage.setItem(matchId, JSON.stringify(finalData));
  router.push({ name: "MatchDetail", params: { id: matchId } });
}
</script>

<template>
  <div class="flex flex-col items-center justify-between h-screen pb-30 px-5">
    <div class="flex w-full justify-between mb-6"></div>

    <div class="flex items-center justify-center space-x-10">
      <div
        class="card bg-base-100 shadow-sm w-30 h-60 flex flex-col items-center justify-center cursor-pointer"
        @click="incrementLeft"
      >
        <div class="text-5xl font-bold">{{ leftScore }}</div>
        <div class="text-sm mt-2">{{ leftPlayers }}</div>
      </div>
      <div class="text-xl">&lt;&gt;</div>
      <div
        class="card bg-base-100 shadow-sm w-30 h-60 flex flex-col items-center justify-center cursor-pointer"
        @click="incrementRight"
      >
        <div class="text-5xl font-bold">{{ rightScore }}</div>
        <div class="text-sm mt-2">{{ rightPlayers }}</div>
      </div>
    </div>

    <div class="flex space-x-6 mt-6">
      <button class="btn" @click="finishGame">Finish</button>
      <button class="btn btn-accent" @click="incrementRally">
        Rally ({{ rally }})
      </button>
    </div>
  </div>
</template>
