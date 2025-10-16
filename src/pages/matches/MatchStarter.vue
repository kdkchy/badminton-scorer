<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { addMatch } from "@/api/addMatch";

const router = useRouter();
// players state
const left = ref(["", ""]);
const right = ref(["", ""]);

// temporary state for modal
const currentSide = ref(null);
const currentIndex = ref(null);
const newPlayer = ref("");

function addPlayerModal(side, index) {
  currentSide.value = side;
  currentIndex.value = index;
  newPlayer.value = "";

  document.getElementById("add_player").showModal();
}

function addPlayer() {
  if (currentSide.value === "left") {
    left.value[currentIndex.value] = newPlayer.value;
  } else if (currentSide.value === "right") {
    right.value[currentIndex.value] = newPlayer.value;
  }
  document.getElementById("add_player").close();
}

async function startMatch() {
  const leftPlayer =
    left.value[1] == "" ? left.value[0] : left.value.join(" / ");
  const rightPlayer =
    right.value[1] == "" ? right.value[0] : right.value.join(" / ");

  const docRef = await addMatch({
    left: leftPlayer,
    right: rightPlayer,
  });

  router.push({ name: "MatchPlay", params: { id: docRef } });
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <p class="mb-5 text-xl">New Match</p>

    <div class="grid grid-cols-2 gap-6 mb-6">
      <div class="flex flex-col space-y-4">
        <button
          v-for="(player, i) in left"
          :key="'left-' + i"
          class="btn w-32"
          @click="addPlayerModal('left', i)"
        >
          {{ player || "+" }}
        </button>
      </div>

      <div class="flex flex-col space-y-4">
        <button
          v-for="(player, i) in right"
          :key="'right-' + i"
          class="btn w-32"
          @click="addPlayerModal('right', i)"
        >
          {{ player || "+" }}
        </button>
      </div>
    </div>
    <button class="btn btn-success w-40" @click="startMatch">Start</button>
  </div>

  <dialog id="add_player" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Add Player</h3>
      <input
        v-model="newPlayer"
        type="text"
        placeholder="Enter player name"
        class="input input-bordered w-full my-4"
      />
      <div class="modal-action">
        <form method="dialog" class="space-x-4">
          <button class="btn">Cancel</button>
          <button type="button" class="btn btn-primary" @click="addPlayer">
            Add
          </button>
        </form>
      </div>
    </div>
  </dialog>
</template>
