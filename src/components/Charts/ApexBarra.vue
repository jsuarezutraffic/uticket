<template>
  <div class="chart-wrap row" v-if="tiquetes.length > 0">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 q-pa-lg">
      <apexchart
        height="350"
        type="bar"
        width="100%"
        :options="optionsCalcUser"
        :series="seriesCalcUser"
        :key="seriesCalcUser"
        @click="selectTurno"
      ></apexchart>
    </div>
    <div
      class="col-xs-12 col-sm-12 col-md-12 col-lg-12 q-pa-lg"
      id="chart"
      v-if="active"
    >
      <apexchart
        height="300"
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
import * as services from "../../services/services";
import { useMainStore } from "src/stores/main"; // Asegúrate de que la ruta sea correcta según la ubicación de tu almacén
import { LocalStorage } from "quasar";

// Convertir props a variable
const props = defineProps(["Series", "tiquetes"]);
let { Series, tiquetes } = toRefs(props);
const store = useMainStore();
const admi = LocalStorage.getItem("admi");
const IdUsuario = LocalStorage.getItem("IdUsuario");

//variables
const visible = ref(true);
const clientes = ref([]);
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
  await services
    .getCliente(
      `&estado=eq.TRUE&concesion=eq.${store.generalData.concesion[0].id}&`
    )
    .then((response) => {
      clientes.value = response.data;
    });
  clientes.value =
    admi == true
      ? clientes.value
      : clientes.value.filter((x) => x.usuario == IdUsuario);
  for (const iterator of clientes.value) {
    dataUser.value.push({
      id: iterator.id,
      nombre: iterator.nombres,
      numtiquetes:
        tiquetes.value.filter((x) => x.cliente == iterator.id) == []
          ? 0
          : tiquetes.value.filter((x) => x.cliente == iterator.id).length,
    });
    serieUser.value.push(
      tiquetes.value.filter((x) => x.cliente == iterator.id) == []
        ? 0
        : tiquetes.value.filter((x) => x.cliente == iterator.id).length
    );
    categoriesUser.value.push(iterator.nombres);
  }
};
const selectTurno = (e, chart, opts) => {
  active.value = opts.globals.selectedDataPoints[0].length == 0 ? false : true;
  var userSelected = categoriesUser.value[opts.dataPointIndex];
  var userSelectedJson = dataUser.value.filter(
    (x) => x.nombre == userSelected
  )[0];
  var tiquetesUser = tiquetes.value.filter(
    (p) => p.cliente == userSelectedJson.id
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
      text: "Solicitudes por Cliente",
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
      text: "Tiquetes por Cliente",
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
    // colors: ["#002c3e"],
  };

  return options;
});

onMounted(() => {
  active.value = false;
  // procesarDataTiquetes();
});
</script>
