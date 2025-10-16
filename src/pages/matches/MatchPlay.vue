<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getMatchById } from "@/api/getMatchDetail";
import { addMatchResult } from "@/api/addMatchResult";

const router = useRouter();
const route = useRoute();
const matchId = route.params.id;

const matchData = ref(null);

// counters
const leftScore = ref(0);
const rightScore = ref(0);
const rally = ref(0);
const leftPlayers = ref("");
const rightPlayers = ref("");
const scores = ref([]);
const longestRally = ref(0);

onMounted(async () => {
  matchData.value = await getMatchById(matchId);
  leftPlayers.value = matchData.value.left;
  rightPlayers.value = matchData.value.right;
});

// onMounted(() => {
//   const saved = localStorage.getItem(matchId);
//   if (saved) {
//     const data = JSON.parse(saved);
//     leftPlayers.value = data.left;
//     rightPlayers.value = data.right;
//   }
// });

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

function decrementRally() {
  rally.value--;
}

async function finishGame() {
  const finalData = {
    left: leftPlayers.value,
    right: rightPlayers.value,
    leftScore: leftScore.value,
    rightScore: rightScore.value,
    scores: scores.value,
    longestRally: longestRally.value,
    finishedAt: new Date().toISOString(),
  };

  await addMatchResult(matchId, finalData);
  router.push({ name: "MatchDetail", params: { id: matchId } });
}
</script>

<template>
  <div class="flex flex-col items-center justify-between h-screen pb-30 px-5">
    <div class="flex flex-col items-center justify-between mt-10">
      <button class="btn" @click="finishGame">Finish</button>
    </div>
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
    <div class="w-full flex justify-center space-x-3">
      <button class="btn h-15" @click="decrementRally">Rally (-)</button>
      <button class="btn btn-accent btn-wide h-50" @click="incrementRally">
        <span class="text-2xl">Rally ({{ rally }})</span>
      </button>
    </div>
  </div>
</template>
