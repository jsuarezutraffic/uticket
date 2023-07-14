<template>
  <div class="chart-wrap relative-position" :style="heightDonut">
    <div>
      <apexchart
        type="donut"
        :width="width"
        :options="optionsCalc"
        :series="seriesCalc"
        :key="seriesCalc"
      ></apexchart>
    </div>
    <q-inner-loading
      v-if="seriesCalc.length != 0"
      :showing="visible"
      label="Please wait..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    >
      <q-spinner color="primary" size="3em"></q-spinner>
    </q-inner-loading>
  </div>
</template>
<script setup>
import { computed, toRefs, ref, watchEffect, onMounted } from "vue";

// Convertir props a variable
const props = defineProps(["Series", "title", "width", "heightDonut"]);
let { Series, title, width, heightDonut } = toRefs(props);
const visible = ref(true);

watchEffect(() => {
  if (Series.value[0]) {
    visible.value = false;
  }
  if (!Series.value[0]) {
    visible.value = true;
  }
});

const seriesCalc = computed(() => {
  let series = [];
  if (Series.value.length > 0) {
    Series.value.forEach((item) => {
      series.push(item.value);
    });
  }

  return series;
});
const titleDefault = computed(() => {
  if (title.value === null || title.value === undefined) {
    return "Proporción créditos";
  }
  return title.value;
});

const optionsCalc = computed(() => {
  let options = {
    noData: {
      text: "No data",
    },
    colors: [
      "#002c3e",
      "#008080",
      "#86e6a9",
      "#97ad47",
      "#ad7747",
      "#ad4947",
      "#9047ad",
    ],
    yaxis: {
      labels: {
        formatter: function (value) {
          return `${value}`;
        },
      },
    },
    fill: {
      type: "gradient",
    },
    title: {
      text: `${titleDefault.value}`,
      align: "center",
      style: {
        color: "#4a148c",
        fontWeight: 600,
        fontSize: "14px",
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            value: {
              show: true,
              fontSize: "12px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              color: undefined,
              offsetY: 0,
              formatter: function (val) {
                return val;
              },
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "15px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => {
                  return a + b;
                }, 0);
              },
            },
          },
        },
      },
    },

    labels: [],
    chart: {
      width: 450,
      type: "donut",
    },
    dataLabels: {
      enabled: true,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
    legend: {
      position: "bottom",
      offsetY: 0,
      // height: 230,
    },
  };

  let labels = [];
  Series.value.forEach((item) => {
    labels.push(`${item.label}`);
  });
  options.labels = labels;

  return options;
});
</script>
