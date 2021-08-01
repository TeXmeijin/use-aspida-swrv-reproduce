<template>
  <div>
    <h2>
      ID:1のデータ読込後に読み込み(コンポーネント切り分け / 改変useAspidaSWRV)
    </h2>
    <template v-if="planetsError3">{{ planetsError3.message }}</template>
    <template v-else-if="!planetsData3">Loading...</template>
    <template v-else>{{ planetsData3.url }}</template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import api from "~/apis/$api";
import aspida from "@aspida/axios";
import axios from "axios";
import useMyAspidaSWRV from "~/lib/useMyAspidaSWRV";

const client = api(
  aspida(axios, {
    baseURL: "https://swapi.dev/api",
  })
);

export default defineComponent({
  props: {
    planetData: {
      type: Object,
    },
  },
  setup(props) {
    const { data: planetsData3, error: planetsError3 } = useMyAspidaSWRV(
      client.planets._id(2),
      {
        enabled: !!props.planetData,
      }
    );

    return {
      planetsData3,
      planetsError3,
    };
  },
});
</script>

<style lang="scss" scoped></style>
