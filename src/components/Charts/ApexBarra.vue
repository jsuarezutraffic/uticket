<template>
  <div class="chart-wrap row" v-if="tiquetes.length > 0">
    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 q-pa-lg">
      <apexchart
        type="bar"
        width="100%"
        :options="optionsCalcUser"
        :series="seriesCalcUser"
        :key="seriesCalcUser"
        @click="selectTurno"
      ></apexchart>
    </div>
    <div
      class="col-xs-12 col-sm-12 col-md-6 col-lg-6 q-pa-lg"
      id="chart"
      v-if="active"
    >
      <apexchart
        width="100%"
        type="bar"
        :options="optionsCalcTipo"
        :series="seriesCalcTipo"
      ></apexchart>
    </div>

    <q-inner-loading
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
/*eslint-disable */
import { computed, toRefs, ref, watchEffect, onMounted } from "vue";
import { api } from "boot/axios";

// Convertir props a variable
const props = defineProps(["Series", "tiquetes", "usuarios"]);
let { Series, tiquetes, usuarios } = toRefs(props);
const visible = ref(true);
const active = ref(false);

const serieUser = ref([]);
const dataUser = ref([]);
const categoriesUser = ref([]);
const cardsValue = ref({
  incidentes: 0,
  requerimientos: 0,
  pqr: 0,
});

const procesarDataTiquetes = async () => {
  dataUser.value = [];
  serieUser.value = [];
  categoriesUser.value = [];
  for (const iterator of usuarios.value) {
    dataUser.value.push({
      id: iterator.id,
      nombre: iterator.nombre,
      numtiquetes:
        tiquetes.value.filter((x) => x.asignado == iterator.id) == []
          ? 0
          : tiquetes.value.filter((x) => x.asignado == iterator.id).length,
    });
    serieUser.value.push(
      tiquetes.value.filter((x) => x.asignado == iterator.id) == []
        ? 0
        : tiquetes.value.filter((x) => x.asignado == iterator.id).length
    );
    categoriesUser.value.push(iterator.nombre);
  }
  visible.value = false;
};
const selectTurno = (e, chart, opts) => {
  active.value = opts.globals.selectedDataPoints[0].length == 0 ? false : true;
  var userSelected = categoriesUser.value[opts.dataPointIndex];
  var userSelectedJson = dataUser.value.filter(
    (x) => x.nombre == userSelected
  )[0];
  var tiquetesUser = tiquetes.value.filter(
    (p) => p.asignado == userSelectedJson.id
  );
  conteoPorParametro(tiquetesUser);
  // generarNewGraphic(userSelectedJson);
};

const conteoPorParametro = (tiquetesUser) => {
  cardsValue.value.incidentes = tiquetesUser.filter(
    (p) => p.solicitud == 1
  ).length;
  cardsValue.value.requerimientos = tiquetesUser.filter(
    (p) => p.solicitud == 2
  ).length;
  cardsValue.value.pqr = tiquetesUser.filter((p) => p.solicitud == 3).length;
};
const seriesCalcTipo = computed(() => {
  let series = [
    {
      name: "Numero de solicitudes",
      data: [
        cardsValue.value.incidentes,
        cardsValue.value.pqr,
        cardsValue.value.requerimientos,
      ],
    },
  ];

  return series;
});
const optionsCalcTipo = computed(() => {
  var options = {
    noData: {
      text: "No data",
    },
    chart: {
      type: "bar",
      height: 250,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    dataLabels: {
      position: "top", // top, center, bottom
      enabled: true,

      style: {
        fontSize: "15px",
        colors: ["#304758"],
      },
    },
    xaxis: {
      title: {
        text: "Tipo de solicitud",
      },
      categories: ["incidentes", "pqr", "requerimientos"],
    },
    yaxis: {
      title: {
        text: "Numero de tiquetes",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return parseInt(val, 10);
        },
      },
    },
    title: {
      text: "Solicitudes por Usuarios",
      align: "left",
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
        fontFamily: undefined,
        color: "#263238",
      },
    },
    colors: ["#86e6a9"],
  };

  return options;
});

watchEffect(() => {
  procesarDataTiquetes();
  if (Series.value[0]) {
    visible.value = false;
  }
});

const seriesCalcUser = computed(() => {
  let series = [
    {
      name: "Numero de tiquetes",
      data: serieUser.value,
    },
  ];

  return series;
});
const optionsCalcUser = computed(() => {
  let options = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      title: {
        text: "Numero de tiquetes",
      },
      categories: categoriesUser.value,
    },
    yaxis: {
      title: {
        text: "Usuarios",
      },
    },
    title: {
      text: "Tiquetes por Usuarios",
      align: "left",
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
        fontFamily: undefined,
        color: "#263238",
      },
    },
    colors: ["#47ad9e"],
  };
  return options;
});

onMounted(() => {
  dataUser.value = [];
  serieUser.value = [];
  categoriesUser.value = [];
  active.value = false;
});
</script>
