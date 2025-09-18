<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <div class="flex justify-center bg-black/40 min-h-screen relative">
    <div class="w-full max-w-md bg-white shadow-lg min-h-screen">
      <RouterView />
      <div class="fixed bottom-0 left-0 right-0 flex justify-center z-10">
        <div
          class="card w-full max-w-md bg-white py-4 text-center border-1 border-t border-purple-100 rounded-none"
        >
          <div class="flex justify-end space-x-5 items-center mr-5">
            <div class="flex justify-end">
              <router-link to="/">
                <button class="btn">List</button>
              </router-link>
            </div>

            <div class="flex justify-center">
              <router-link to="/starter">
                <button class="btn btn-xl btn-primary">+</button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
