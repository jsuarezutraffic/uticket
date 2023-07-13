<template>
  <div class="q-pa-lg" ref="elementToObserve3">
    <apexchart
      type="line"
      height="350"
      :options="optionsCalc2"
      :series="seriesCalc2"
      :key="seriesCalc2"
    ></apexchart>
  </div>
</template>

<style>
/* .chart-wrap {
  height: 260px;
} */
</style>

<script setup>
import { computed, toRefs, ref, watchEffect } from "vue";

const props = defineProps(["dataSolicitudesTiempo"]);
let { dataSolicitudesTiempo } = toRefs(props);

const seriesCalc2 = computed(() => {
  let series = [
    {
      name: "Solicitudes",
      data: dataSolicitudesTiempo.value,
    },
  ];
  return series;
});
const optionsCalc2 = computed(() => {
  var options = {
    colors: [
      "#008080",
      "#002c3e",
      "#86e6a9",
      "#97ad47",
      "#ad7747",
      "#ad4947",
      "#9047ad",
    ],
    stroke: {
      curve: "smooth",
    },
    chart: {
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      labels: {
        show: true,
      },
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nob",
        "Dec",
      ],
    },
    yaxis: {
      show: true,
      title: {
        text: "Solicitudes",
      },
    },
  };
  return options;
});
//Series, title
// Convertir props a variable
</script>
