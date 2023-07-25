<template>
  <!-- <apexchart
    height="300"
    type="bar"
    :options="options"
    :series="series"
  ></apexchart> -->

  <apexchart
    height="350"
    type="bar"
    :width="width"
    :options="optionsCalc"
    :series="seriesCalc"
    :key="seriesCalc"
  ></apexchart>
</template>

<script setup>
/*eslint-disable */
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  toRefs,
  watchEffect,
} from "vue";
// import { useMainStore } from "stores/main";
import { useRouter, useRoute } from "vue-router";
import { useQuasar, date } from "quasar";
// import { mostrarMensajes } from "src/utils/global";

const props = defineProps(["Series", "title", "width"]);
let { Series, title, width } = toRefs(props);
const visible = ref(true);

watchEffect(() => {
  if (Series.value[0]) {
    visible.value = false;
  }
  if (!Series.value[0]) {
    visible.value = true;
  }
});

const titleDefault = computed(() => {
  if (title.value === null || title.value === undefined) {
    return "Ticket";
  }
  return title.value;
});

const optionsCalc = computed(() => {
  let options = {
    yaxis: {
      show: false, // Oculta el eje Y,
      labels: {
        formatter: function (value) {
          return `${value}`;
        },
      },
    },
    xaxis: {
      labels: {
        show: false, // Oculta las etiquetas del eje x
      },
    },
    title: {
      text: `${titleDefault.value}`,
      style: {
        color: "#4a148c",
        fontWeight: 600,
        fontSize: "14px",
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "45%",
        distributed: true,
      },
    },

    labels: [],
    chart: {
      height: 350,
      type: "bar",
      toolbar: {
        show: false, // Oculta la barra de herramientas del gráfico
      },
      events: {
        click: function (chart, w, e) {},
      },
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
      show: true,
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
// const store = useMainStore();
let $q = useQuasar();
const route = useRoute();
const router = useRouter();

const seriesCalc = computed(() => {
  let series = [{ name: "", data: [] }];

  Series.value.forEach((item) => {
    series[0].data.push(item.value);
  });

  return series;
});

const listado = ref([]);

const loadData = () => {};

setInterval(() => {
  ex.value = [];
  ey.value = [];
  loadData();
}, 600000);

onMounted(() => {
  $q = useQuasar();
  // loadData();
});

// }
//   }

// })
</script>
