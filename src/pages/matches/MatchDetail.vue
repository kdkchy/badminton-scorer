<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { getMatchById } from "@/api/getMatchDetail";

const route = useRoute();
const matchId = route.params.id;

const matchData = ref(null);
onMounted(async () => {
  matchData.value = await getMatchById(matchId);
});

// chart config
const leftScores = computed(() =>
  matchData.value.scores.map((s) => s.leftScore)
);
const rightScores = computed(() =>
  matchData.value.scores.map((s) => s.rightScore)
);

const baseVisibleWidth = 600; // minimum visible SVG width
const height = 200;
const pointSpacing = 80;
const paddingX = 20; // left/right padding inside svg
const paddingY = 20; // top/bottom padding inside svg

// number of points (use max of both series)
const pointsCount = computed(() =>
  Math.max(leftScores.value.length, rightScores.value.length, 1)
);

// computed graph width (at least baseVisibleWidth)
const graphWidth = computed(() =>
  Math.max(
    baseVisibleWidth,
    (pointsCount.value - 1) * pointSpacing + paddingX * 2
  )
);

// avoid zero division
const maxScore = computed(() => {
  const m = Math.max(...leftScores.value, ...rightScores.value);
  return m === 0 ? 1 : m;
});

// produce polyline points using fixed spacing
function getPoints(data) {
  return data
    .map((val, i) => {
      // x = index * spacing + left padding
      const x = i * pointSpacing + paddingX;
      // scale y into svg height with vertical padding
      const innerHeight = height - paddingY * 2;
      const y = height - paddingY - (val / maxScore.value) * innerHeight;
      return `${x},${y}`;
    })
    .join(" ");
}
</script>

<template>
  <div class="p-6 pb-30">
    <h2 class="text-2xl font-bold mb-4">Game Result</h2>
    <div v-if="matchData">
      <div class="flex items-center justify-center space-x-10 mb-10">
        <div
          class="text-white card bg-blue-500 shadow-sm w-30 h-40 flex flex-col items-center justify-center cursor-pointer"
        >
          <div class="text-5xl font-bold">{{ matchData.leftScore }}</div>
          <div class="text-sm mt-2">{{ matchData.left }}</div>
        </div>
        <div class="text-xl">&lt;&gt;</div>
        <div
          class="text-white card bg-red-500 shadow-sm w-30 h-40 flex flex-col items-center justify-center cursor-pointer"
        >
          <div class="text-5xl font-bold">{{ matchData.rightScore }}</div>
          <div class="text-sm mt-2">{{ matchData.right }}</div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <div class="flex gap-2">
          <div class="flex flex-col items-center">
            <div
              class="border-blue-500 w-20 h-8 border-1 rounded mb-2 flex items-center justify-center text-xs"
            >
              {{ matchData.left }}
            </div>
            <div
              class="border-red-500 w-20 h-8 border-1 rounded mb-2 flex items-center justify-center text-xs"
            >
              {{ matchData.right }}
            </div>
          </div>
          <div
            v-for="(score, index) in matchData.scores"
            :key="index"
            class="flex flex-col items-center"
          >
            <div
              class="w-8 h-8 rounded mb-2 flex items-center justify-center text-xs"
              :class="
                score.pointFor === 'left'
                  ? 'bg-primary shadow-sm'
                  : 'border border-primary'
              "
            >
              {{ score.pointFor === "left" ? score.leftScore : "" }}
            </div>

            <div
              class="w-8 h-8 rounded mb-2 flex items-center justify-center text-xs"
              :class="
                score.pointFor === 'right'
                  ? 'bg-primary shadow-sm'
                  : 'border border-primary'
              "
            >
              {{ score.pointFor === "right" ? score.rightScore : "" }}
            </div>
          </div>
        </div>
      </div>
      <div class="card bg-base-100 text-center shadow-sm mb-5 mt-5">
        <div class="card-body">
          <span>Longest rally</span
          ><span class="text-2xl">{{ matchData.longestRally }}</span>
        </div>
      </div>
      <div class="mt-5 card bg-base-100 shadow-sm">
        <div class="card-body">
          <span class="text-lg mb-2">Rally Length</span>
          <div class="flex items-center space-x-2">
            <div
              class="bg-blue-500 text-white w-8 h-8 border-b-1 border-primary mb-2 flex items-center justify-center text-xs"
            ></div>
            <div
              class="bg-red-500 text-white w-8 h-8 border-b-1 border-primary mb-2 flex items-center justify-center text-xs"
            ></div>
            <div
              class="w-8 h-8 border-b-1 border-primary mb-2 flex items-center justify-center text-xs"
            >
              Rally
            </div>
          </div>
          <div
            v-for="(score, index) in matchData.scores"
            :key="index"
            class="flex flex-col"
          >
            <div class="flex">
              <div class="flex space-x-2">
                <div
                  class="w-8 h-8 rounded mb-2 flex items-center justify-center text-xs"
                  :class="
                    score.pointFor === 'left'
                      ? 'bg-primary shadow-sm'
                      : 'border border-primary'
                  "
                >
                  {{ score.pointFor === "left" ? score.leftScore : "" }}
                </div>

                <div
                  class="w-8 h-8 rounded mb-2 flex items-center justify-center text-xs"
                  :class="
                    score.pointFor === 'right'
                      ? 'bg-primary shadow-sm'
                      : 'border border-primary'
                  "
                >
                  {{ score.pointFor === "right" ? score.rightScore : "" }}
                </div>

                <div class="flex items-center mb-2">
                  <!-- Bar -->
                  <div
                    class="h-8 bg-secondary border-none"
                    :style="{ width: score.rallyLength * 5 + 'px' }"
                  ></div>

                  <!-- Label -->
                  <span class="text-xs ml-2">{{ score.rallyLength }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-5 card bg-base-100 shadow-sm">
        <div class="card-body">
          <span class="text-lg mb-2">Point Rush</span>
          <div class="flex justify-center">
            <div class="badge bg-blue-500 text-white">{{ matchData.left }}</div>
            <div class="badge bg-red-500 text-white">{{ matchData.right }}</div>
          </div>
          <!-- scrollable wrapper -->
          <div class="py-2 overflow-x-auto w-full">
            <svg
              :width="graphWidth"
              :height="height"
              :style="{ minWidth: graphWidth + 'px', display: 'block' }"
              class="border border-gray-300 bg-white rounded-xl"
            >
              <!-- gridlines (optional) -->
              <g stroke="#eee" stroke-width="1">
                <line
                  v-for="(y, i) in 4"
                  :key="i"
                  :x1="0"
                  :x2="graphWidth"
                  :y1="paddingY + (i * (height - paddingY * 2)) / 3"
                  :y2="paddingY + (i * (height - paddingY * 2)) / 3"
                />
              </g>

              <!-- left line (blue) -->
              <polyline
                :points="getPoints(leftScores)"
                fill="none"
                stroke="blue"
                stroke-width="2"
              />

              <!-- right line (red) -->
              <polyline
                :points="getPoints(rightScores)"
                fill="none"
                stroke="red"
                stroke-width="2"
              />

              <!-- dots for left -->
              <g fill="blue">
                <circle
                  v-for="(val, i) in leftScores"
                  :key="'l' + i"
                  :cx="i * pointSpacing + paddingX"
                  :cy="
                    height -
                    paddingY -
                    (val / maxScore) * (height - paddingY * 2)
                  "
                  r="3"
                />
              </g>

              <!-- dots for right -->
              <g fill="red">
                <circle
                  v-for="(val, i) in rightScores"
                  :key="'r' + i"
                  :cx="i * pointSpacing + paddingX"
                  :cy="
                    height -
                    paddingY -
                    (val / maxScore) * (height - paddingY * 2)
                  "
                  r="3"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <p>No match data found for this ID.</p>
    </div>
  </div>
</template>
