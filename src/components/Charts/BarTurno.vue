<template>
  <div class="wrap">
    <!-- <div id="chart-year" class="chart-box"></div> -->
    <!-- <apexchart
      height="350"
      type="bar"
      :width="width"
      :options="optionsCalc"
      :series="seriesCalc"
      :key="seriesCalc"
    ></apexchart> -->

    <div id="chart-year" class="chart-box">
      <apexchart
        type="bar"
        height="350"
        ref="chart"
        :key="seriesCalc"
        :options="optionsYear"
        :series="optionsYear.series"
        @click="selectTurno"
      ></apexchart>
    </div>
    <div id="chart-quarter" class="chart-box">
      <apexchart
        type="bar"
        height="350"
        ref="chartQuarter"
        :options="optionsQuarters"
        :series="optionsQuarters.series"
      ></apexchart>
    </div>
  </div>
</template>

<script setup>
/*eslint-disable */
import {
  onUpdated,
  defineComponent,
  reactive,
  onMounted,
  ref,
  onBeforeMount,
  onUnmounted,
  computed,
  toRefs,
  watchEffect,
} from "vue";
// import { getCssVar, LocalStorage } from "quasar";
import { api } from "boot/axios";
import { useRouter, useRoute } from "vue-router";
import { useMainStore } from "stores/main";
import { useQuasar, date } from "quasar";
// import { mostrarMensajes, getSelectedString } from "boot/global";

const props = defineProps(["Series", "title", "width", "Detalles"]);
let { Series, title, width, Detalles } = toRefs(props);
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
        click: function (chart, w, e) {
          // console.log(chart, w, e)
        },
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

const seriesCalc = computed(() => {
  let series = [{ name: "Cantidad", data: [] }];

  Series.value.forEach((item) => {
    series[0].data.push(item.value);
  });
  loadData();
  return series;
});

const store = useMainStore();
const router = useRouter();
let $q = useQuasar();

//variables declaracin
let Parametros = ref([]);
const listadoInfo = ref([]);
const fila = ref({});
const listadoTiqAuditables = ref([]);
const listadoEvasores = ref([]);
const listadoTiqRecaudador = ref([]);

const BeforeLoadData = async () => {
  listadoInfo.value = (
    await api.get(
      "/sesionrecaudopistaturno/busqueda?estado=Iniciado&estado=Cerrado"
    )
  ).data;
};

//funciones interactivas con las graficas
const selectTurno = (e, chart, opts) => {
  var quarterChartEl = document.querySelector("#chart-quarter");
  var yearChartEl = document.querySelector("#chart-year");

  if (opts.globals.selectedDataPoints[0].length === 1) {
    if (quarterChartEl.classList.contains("active")) {
      updateQuarterChart(chart, "barQuarter");
    } else {
      yearChartEl.classList.add("chart-quarter-activated");
      quarterChartEl.classList.add("active");
      updateQuarterChart(chart, "barQuarter");
    }
  } else {
    updateQuarterChart(chart, "barQuarter");
  }

  if (opts.globals.selectedDataPoints[0].length === 0) {
    yearChartEl.classList.remove("chart-quarter-activated");
    quarterChartEl.classList.remove("active");
  }
};

const dataF = (event, chartContext, config) => {
  fila.value = listadoInfo.value.filter(
    (x) =>
      x.identificadorsesion ==
      parseInt(config.globals.seriesNames[config.seriesIndex].slice(-10))
  )[0];

  if (
    config.globals.labels[config.dataPointIndex] == "Auditables" ||
    config.globals.labels[config.dataPointIndex] == "Pendientes"
  ) {
    loadDataTiqAuditables();
  } else if (config.globals.labels[config.dataPointIndex] == "Evasores") {
    loadDataEvasor();
  } else if (
    config.globals.labels[config.dataPointIndex] == "Tiquetes Manuales" ||
    config.globals.labels[config.dataPointIndex] == "Tiquetes Electronicos"
  ) {
    loadDataTiqRecaudador();
  } else {
    $q.notify({
      message: "Metodo no disponible",
      color: "info",
    });
  }
};

//sELECCIONANDO

const loadDataTiqAuditables = () => {
  // loadingListado.value = true;
  Parametros.value = `identificacion=${fila.value.identificacion}&identificadorsesion=${fila.value.identificadorsesion}&idplaza=${fila.value.idplaza}&idpista=${fila.value.idpista}&idtipoturno=${fila.value.idtipoturno}&turno=${fila.value.turno}&estado=Generada&estado=Detectada&estadoauditoria=Pendiente&estadoauditoria=Reversada`;

  api
    .get("/transacciontabulacion/busqueda?" + Parametros.value)
    .then((response) => {
      if (response.data.codigomensaje == "201") {
        //  mostrarMensajes(response.data);
        return;
      }
      if (response.status == 200) {
        listadoTiqAuditables.value = response.data;

        // loadingListado.value = false;
        store.infoTiqAuditablesfila(fila.value);
        store.infoTiqAuditables(listadoTiqAuditables.value);
        //  (listado.value);
        // if (listado.value.length > 0) {
        //   createData.value = false;
        // }
        setTimeout(() => {
          toPath();
        }, 100);
      } else {
        loadingListado.value = false;
        //  mostrarMensajes(response.data);
      }
    })
    .catch((error) => {
      // if (error.response.status == 401) {
      //   router.push("/");
      //   store.borrar();
      // }
      mostrarMensajes(error.response.data);
      // loadingListado.value = false;
    });
};

const loadDataEvasor = () => {
  // loadingListado.value = true;
  Parametros.value = `identificacion=${fila.value.identificacion}&identificadorsesion=${fila.value.identificadorsesion}&idplaza=${fila.value.idplaza}&idpista=${fila.value.idpista}&idtipoturno=${fila.value.idtipoturno}&turno=${fila.value.turno}&estado=Registrado&estado=Detectada&estadoauditoria=Pendiente&estadoauditoria=Reversada`;

  api
    .get("/transaccionevasor/busqueda?" + Parametros.value)
    .then((response) => {
      if (response.status == 200) {
        listadoEvasores.value = response.data;
        // loadingListado.value = false;
        store.infoEvasores(listadoEvasores.value);
        store.infoEvasores1(fila.value);
        //  (listadoEvasores.value);
        // if (listado.value.length > 0) {
        //   createData.value = false;
        // }
        setTimeout(() => {
          toPathEvasores();
        }, 100);
      } else {
        // loadingListado.value = false;
        mostrarMensajes(response.data);
      }
    })
    .catch((error) => {
      // if (error.response.status == 401) {
      //   router.push("/Login");
      //   store.borrar();
      // }
      mostrarMensajes(error.response.data);
      // loadingListado.value = false;
    });
};

const loadDataTiqRecaudador = () => {
  // loadingListado.value = true;
  Parametros.value = `identificacion=${fila.value.identificacion}
  &identificadorsesion=${fila.value.identificadorsesion}
  &idplaza=${fila.value.idplaza}
  &idpista=${fila.value.idpista}
  &idtipoturno=${fila.value.idtipoturno}
  &turno=${fila.value.turno}
  &estado=Generada&estado=Detectada&subtipotransaccion=Manual&subtipotransaccion=Dinamica&subtipotransaccion=Boleteria&subtipotransaccion=Contigencia`;

  api
    .get("transacciontabulacion/busqueda?" + Parametros.value)
    .then((response) => {
      if (response.status == 200) {
        listadoTiqRecaudador.value = response.data;
        // loadingListado.value = false;
        store.infoTiqRecaudador(listadoTiqRecaudador.value);
        store.infoTiqRecaudadorfila(fila.value);
        // if (listado.value.length > 0) {
        //   createData.value = false;
        // }
        setTimeout(() => {
          toPathTiqRecaudador();
        }, 100);
      } else {
        // loadingListado.value = false;
        mostrarMensajes(response.data);
      }
    })
    .catch((error) => {
      // loadingListado.value = false;
    });
};

//Funciones
const loadData = () => {
  var dataSet = shuffleArray();
  optionsYear.series[0].data = [];
  // api
  //   .get("/sesionrecaudopistaturno/busqueda?estado=Iniciado&estado=Cerrado")
  //   .then((response) => {
  let arrayTemporal = [];
  let arrayTemporalnombre = [];
  // var fechaActual = new Date();
  let jsE = {
    x: "2011",
    y: "dataSet[0].y",
    color: "colors[0]",
    quarters: "dataSet[0].quarters",
  };

  for (let index = 0; index < Series.value.length; index++) {
    // const hoursDiff = dateDiffInHours(
    //   fechaActual,
    //   new Date(changeDateFormat(response.data[index].fechahorainicialstr))
    // );
    arrayTemporal.push(Series.value[index].value);
    arrayTemporalnombre.push(Series.value[index].label);
    jsE = {
      x: arrayTemporalnombre[index],
      y: arrayTemporal[index],
      color: colors[index],
      quarters: dataSet[index].quarters,
    };

    optionsYear.series[0].data.push(jsE);
  }
  // });
};

function dateDiffInHours(date1, date2) {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / 1000 / 60 / 60;
}

function changeDateFormat(dateString) {
  // Dividir la cadena en una matriz de día, mes, año y tiempo
  const dateParts = dateString.split(" ");
  const date = dateParts[0].split("/");
  const time = dateParts[1];

  // Crear una nueva fecha con el orden de mes y día invertido
  const newDate = new Date(`${date[1]}/${date[0]}/${date[2]} ${time}`);

  // Formatear la fecha y el tiempo en el nuevo orden
  const newDateString = `${newDate.getMonth() + 1 < 10 ? "0" : ""}${
    newDate.getMonth() + 1
  }/${
    newDate.getDate() < 10 ? "0" : ""
  }${newDate.getDate()}/${newDate.getFullYear()} ${time}`;

  return newDateString;
}

function generateHexColorsArray(numColors) {
  var colorsArray = [];

  for (var i = 0; i < numColors; i++) {
    var hexColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    colorsArray.push(hexColor);
  }

  return colorsArray;
}
// var colors = generateHexColorsArray(10);
// console.log(colors);
//apexcharts

Apex = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    shared: false,
  },
};
var colors = [
  "#008FFB",
  "#00E396",
  "#FEB019",
  "#FF4560",
  "#775DD0",
  "#00D9E9",
  "#FF66C3",
  "#5ca9ad",
  "#bca3d1",
  "#8f7f63",
  "#f2bbc3",
  "#b5fc00",
  "#d6dbc8",
  "#00ff9d",
  "#2f4980",
  "#ff00e1",
];

// var colors = generateHexColorsArray(listadoInfo.value.length);

//vARIABLES graficas

const optionsYear = reactive({
  chart: {
    id: "barYear",
    height: 400,
    width: "100%",
    type: "bar",

    events: {
      dataPointSelection: function (e, chart, opts) {
        var quarterChartEl = document.querySelector("#chart-quarter");
        var yearChartEl = document.querySelector("#chart-year");

        if (opts.selectedDataPoints[0].length === 1) {
          if (quarterChartEl.classList.contains("active")) {
            updateQuarterChart(chart, "barQuarter");
          } else {
            yearChartEl.classList.add("chart-quarter-activated");
            quarterChartEl.classList.add("active");
            updateQuarterChart(chart, "barQuarter");
          }
        } else {
          updateQuarterChart(chart, "barQuarter");
        }

        if (opts.selectedDataPoints[0].length === 0) {
          yearChartEl.classList.remove("chart-quarter-activated");
          quarterChartEl.classList.remove("active");
        }
      },
      updated: function (chart) {
        updateQuarterChart(chart, "barQuarter");
      },
    },
  },
  plotOptions: {
    bar: {
      distributed: true,
      horizontal: true,
      endingShape: "arrow",
      barHeight: "80%",
      dataLabels: {
        position: "bottom",
      },
    },
  },
  dataLabels: {
    enabled: true,
    textAnchor: "left",
    // position: "top",
    style: {
      colors: ["#fff"],
    },
    formatter: function (val, opt) {
      return val + " tickets";
    },
    offsetX: 0,
    dropShadow: {
      enabled: false,
    },
  },
  colors: colors,
  series: [
    {
      data: [],
    },
  ],

  states: {
    normal: {
      filter: {
        type: "desaturate",
      },
    },
    active: {
      allowMultipleDataPointsSelection: true,
      filter: {
        type: "darken",
        value: 1,
      },
    },
  },
  tooltip: {
    x: {
      show: true,
    },
    y: {
      title: {
        formatter: function (val, opts) {
          return opts.w.globals.labels[opts.dataPointIndex];
        },
      },
    },
  },
  title: {
    text: "Tickets Por Operador",
    offsetX: 15,
  },
  subtitle: {
    text: "(Click en la barra para mas detalles)",
    offsetX: 15,
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  xaxis: {
    // categorires: [0, 2, 4, 6, 8],
    legend: false,
  },
  legend: {
    show: true,
  },
});
//funciones graficas

function shuffleArray() {
  // console.log("arraydetalle", arraydetalle);
  var array1 = Detalles.value;
  // let array2 = [];
  // var array = [
  //   {
  //     y: 400,
  //     quarters: [
  //       {
  //         x: "Q1",
  //         y: 120,
  //       },
  //       {
  //         x: "Q2",
  //         y: 90,
  //       },
  //       {
  //         x: "Q3",
  //         y: 100,
  //       },
  //       {
  //         x: "Q4",
  //         y: 90,
  //       },
  //     ],
  //   },
  //   {
  //     y: 430,
  //     quarters: [
  //       {
  //         x: "Q1",
  //         y: 120,
  //       },
  //       {
  //         x: "Q2",
  //         y: 110,
  //       },
  //       {
  //         x: "Q3",
  //         y: 90,
  //       },
  //       {
  //         x: "Q4",
  //         y: 110,
  //       },
  //     ],
  //   },
  //   {
  //     y: 448,
  //     quarters: [
  //       {
  //         x: "Q1",
  //         y: 70,
  //       },
  //       {
  //         x: "Q2",
  //         y: 100,
  //       },
  //       {
  //         x: "Q3",
  //         y: 140,
  //       },
  //       {
  //         x: "Q4",
  //         y: 138,
  //       },
  //     ],
  //   },
  //   {
  //     y: 470,
  //     quarters: [
  //       {
  //         x: "Q1",
  //         y: 150,
  //       },
  //       {
  //         x: "Q2",
  //         y: 60,
  //       },
  //       {
  //         x: "Q3",
  //         y: 190,
  //       },
  //       {
  //         x: "Q4",
  //         y: 70,
  //       },
  //     ],
  //   },
  //   {
  //     y: 540,
  //     quarters: [
  //       {
  //         x: "Q1",
  //         y: 120,
  //       },
  //       {
  //         x: "Q2",
  //         y: 120,
  //       },
  //       {
  //         x: "Q3",
  //         y: 130,
  //       },
  //       {
  //         x: "Q4",
  //         y: 170,
  //       },
  //     ],
  //   },
  //   {
  //     y: 580,
  //     quarters: [
  //       {
  //         x: "Q1",
  //         y: 170,
  //       },
  //       {
  //         x: "Q2",
  //         y: 130,
  //       },
  //       {
  //         x: "Q3",
  //         y: 120,
  //       },
  //       {
  //         x: "Q4",
  //         y: 160,
  //       },
  //     ],
  //   },
  // ];
  // var quarters = [{ x: null, y: null }];

  // let array4 = [];
  // for (var i = array.length - 1; i > 0; i--) {
  //   var j = Math.floor(Math.random() * (i + 1));
  //   var temp = array[i];
  //   array[i] = array[j];
  //   array[j] = temp;
  // }

  return array1;
  // return array2;
}

//quarter
function updateQuarterChart(sourceChart, destChartIDToUpdate) {
  var series = [];
  var seriesIndex = 0;
  var colors = [];
  if (sourceChart.w.globals.selectedDataPoints[0]) {
    var selectedPoints = sourceChart.w.globals.selectedDataPoints;
    for (var i = 0; i < selectedPoints[seriesIndex].length; i++) {
      var selectedIndex = selectedPoints[seriesIndex][i];
      var yearSeries = sourceChart.w.config.series[seriesIndex];
      series.push({
        name: yearSeries.data[selectedIndex].x,
        data: yearSeries.data[selectedIndex].quarters,
      });
      colors.push(yearSeries.data[selectedIndex].color);
    }
    if (series.length === 0)
      series = [
        {
          data: [],
        },
      ];
    return ApexCharts.exec(destChartIDToUpdate, "updateOptions", {
      series: series,
      colors: colors,
      fill: {
        colors: colors,
      },
    });
  }
}

const optionsQuarters = reactive({
  chart: {
    id: "barQuarter",
    height: 400,
    width: "100%",
    type: "bar",
    stacked: true,
  },
  plotOptions: {
    bar: {
      columnWidth: "50%",
      horizontal: false,
    },
  },
  series: [
    {
      data: [],
    },
  ],
  legend: {
    show: false,
  },
  grid: {
    yaxis: {
      lines: {
        show: false,
      },
    },
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  title: {
    text: "Tipo solictud de los Tickets",
    offsetX: 10,
  },
  tooltip: {
    x: {
      formatter: function (val, opts) {
        return opts.w.globals.seriesNames[opts.seriesIndex];
      },
    },
    y: {
      title: {
        formatter: function (val, opts) {
          return opts.w.globals.labels[opts.dataPointIndex];
        },
      },
    },
  },
});

//rederigiendo rutas
function toPath() {
  var toPath = "/010101-TYR/lstSesionesRecaudoAbierta" + "/Auditable";
  return router.push(toPath);
}

function toPathEvasores() {
  var toPath = "/010101-TYR/lstSesionesRecaudoAbierta" + "/Evasores";
  return router.push(toPath);
}

function toPathTiqRecaudador() {
  var toPath = "/010101-TYR/lstSesionesRecaudoAbierta" + "/Tiquetes";
  return router.push(toPath);
}

onMounted(async () => {
  // await BeforeLoadData();
  // loadData();
});
</script>

<style>
.wrap {
  /* margin: 4rem auto;*/
  /* max-width: 1000px; */
  position: relative;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* bloqueo de scroll */
}

.chart-box {
  /* padding-left: 0; */
  background: #fff;
  border: 2px solid rgb(231, 231, 231);
}

#chart-year,
#chart-quarter {
  width: 96%;
  max-width: 48%;
  box-shadow: none;
}

#chart-year {
  float: left;
  position: relative;
  transition: 1s ease transform;
  z-index: 3;
}

#chart-year.chart-quarter-activated {
  transform: translateX(0);
  transition: 1s ease transform;
}

#chart-quarter {
  float: left;
  position: relative;
  z-index: -2;
  transition: 1s ease transform;
}

#chart-quarter.active {
  transition: 1.1s ease-in-out transform;
  transform: translateX(0);
  z-index: 1;
}

@media screen and (min-width: 700px) {
  #chart-year {
    transform: translateX(50%);
  }

  #chart-quarter {
    transform: translateX(-50%);
  }
}

select#model {
  display: none;
  position: absolute;
  top: -40px;
  left: 0;
  z-index: 2;
  cursor: pointer;
  transform: scale(0.8);
}
</style>
