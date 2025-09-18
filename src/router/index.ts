import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

import MatchList from "@/pages/matches/MatchList.vue";
import MatchDetail from "@/pages/matches/MatchDetail.vue";
import MatchPlay from "@/pages/matches/MatchPlay.vue";
import MatchStarter from "@/pages/matches/MatchStarter.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", component: MatchList },
  { path: "/:id/detail", component: MatchDetail },
  { path: "/:id/play", component: MatchPlay },
  { path: "/starter", component: MatchStarter },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
