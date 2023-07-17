<template>
  <div class="wrap">
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
import { reactive, onMounted, ref, computed, toRefs, watchEffect } from "vue";
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
const seriesCalc = computed(() => {
  let series = [{ name: "Cantidad", data: [] }];

  Series.value.forEach((item) => {
    series[0].data.push(item.value);
  });
  loadData();
  return series;
});

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
//Funciones
const loadData = () => {
  var dataSet = shuffleArray();
  optionsYear.series[0].data = [];
  let arrayTemporal = [];
  let arrayTemporalnombre = [];
  let jsE = {
    x: "2011",
    y: "dataSet[0].y",
    color: "colors[0]",
    quarters: "dataSet[0].quarters",
  };

  for (let index = 0; index < Series.value.length; index++) {
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
  var array1 = Detalles.value;
  return array1;
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
