<template>
  <div class="chart-wrap row">
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
const props = defineProps(["Series", "title", "width"]);
let { Series, title, width } = toRefs(props);
const visible = ref(true);
const tiquetes = ref([]);
const usuarios = ref([]);
const Solicitudes = ref([]);

var serieUser = [];
var categoriesUser = [];
var dataUser = [];

const procesarDataTiquetes = async () => {
  await api.get(`tiquete?select=*`).then((response) => {
    tiquetes.value = response.data;
    visible.value = false;
  });
  await api.get(`usuarios?select=*`).then((response) => {
    usuarios.value = response.data;
    visible.value = false;
  });
  await api.get("solicitud?select=*").then((response) => {
    Solicitudes.value = response.data;
  });
  for (const iterator of usuarios.value) {
    dataUser.push({
      id: iterator.id,
      nombre: iterator.nombre,
      numtiquetes:
        tiquetes.value.filter((x) => x.asignado == iterator.id) == []
          ? 0
          : tiquetes.value.filter((x) => x.asignado == iterator.id).length,
    });
    serieUser.push(
      tiquetes.value.filter((x) => x.asignado == iterator.id) == []
        ? 0
        : tiquetes.value.filter((x) => x.asignado == iterator.id).length
    );
    categoriesUser.push(iterator.nombre);
  }
};
const active = ref(false);
const selectTurno = (e, chart, opts) => {
  active.value = opts.globals.selectedDataPoints[0].length == 0 ? false : true;
  var userSelected = categoriesUser[opts.dataPointIndex];
  var userSelectedJson = dataUser.filter((x) => x.nombre == userSelected)[0];
  var tiquetesUser = tiquetes.value.filter(
    (p) => p.asignado == userSelectedJson.id
  );
  conteoPorParametro(tiquetesUser);
  // generarNewGraphic(userSelectedJson);
};

const cardsValue = ref({
  incidentes: 0,
  requerimientos: 0,
  pqr: 0,
});

const conteoPorParametro = (tiquetesUser) => {
  cardsValue.value.incidentes = tiquetesUser.filter(
    (p) =>
      p.solicitud ==
      Solicitudes.value.filter((v) => v.nombre == "Incidentes")[0].id
  ).length;
  cardsValue.value.requerimientos = tiquetesUser.filter(
    (p) =>
      p.solicitud ==
      Solicitudes.value.filter((v) => v.nombre == "Requerimiento")[0].id
  ).length;
  cardsValue.value.pqr = tiquetesUser.filter(
    (p) =>
      p.solicitud == Solicitudes.value.filter((v) => v.nombre == "PQR")[0].id
  ).length;
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
  if (Series.value[0]) {
    visible.value = false;
  }
  if (!Series.value[0]) {
    visible.value = true;
  }
});

const seriesCalcUser = computed(() => {
  let series = [
    {
      name: "Numero de tiquetes",
      data: serieUser,
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
      categories: categoriesUser,
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

  let labels = [];
  Series.value.forEach((item) => {
    labels.push(`${item.label}`);
  });
  options.labels = labels;

  // console.log("labels: ", options.labels);
  return options;
});

onMounted(() => {
  active.value = true;
  procesarDataTiquetes();
});
</script>
