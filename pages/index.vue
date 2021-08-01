<template>
  <main>
    <h1>useAspidaSWRVテスト</h1>
    <div>
      <h2>初期ロード時に読み込み</h2>
      <template v-if="planetsError">{{ planetsError.message }}</template>
      <template v-else-if="!planetsData">Loading...</template>
      <template v-else>{{ planetsData.url }}</template>
    </div>
    <div>
      <h2>ID:1のデータ読込後に読み込み</h2>
      <template v-if="planetsError2">{{ planetsError2.message }}</template>
      <template v-else-if="!planetsData2">Loading...</template>
      <template v-else>{{ planetsData2.url }}</template>
    </div>
    <fetch-data3 :planetData="planetsData"></fetch-data3>
    <fetch-data4 :planetData="planetsData"></fetch-data4>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import useAspidaSWRV from "@aspida/swrv";
import api from "~/apis/$api";
import aspida from "@aspida/axios";
import axios from "axios";

const client = api(
  aspida(axios, {
    baseURL: "https://swapi.dev/api",
  })
);

export default defineComponent({
  setup() {
    const { data: planetsData, error: planetsError } = useAspidaSWRV(
      client.planets._id(1)
    );
    const { data: planetsData2, error: planetsError2 } = useAspidaSWRV(
      client.planets._id(2),
      {
        enabled: !!planetsData,
      }
    );

    return {
      planetsData,
      planetsError,
      planetsData2,
      planetsError2,
    };
  },
});
</script>

<style lang="scss" scoped></style>
