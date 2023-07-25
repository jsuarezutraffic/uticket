<template>
  <q-btn :color="color" @click="filtroTiquetes()">
    <div
      class="row center-vertical"
      style="width: 200px"
      ref="elementToObserve3"
    >
      <div class="col-6">
        <span class="text-h6">{{ title }}</span>
        <p class="text-h3 text-weight-bold">{{ counterElementComputed }}</p>
      </div>
      <div class="col-6" style="height: 5vw">
        <apexchart
          height="100"
          type="line"
          :options="options"
          :series="series"
        ></apexchart>
      </div>
    </div>
  </q-btn>
</template>

<script setup>
import { LocalStorage } from "quasar";
import { computed, toRefs, ref, watchEffect, onMounted } from "vue";
const props = defineProps(["title", "valor", "color"]);
let { title, valor, color } = toRefs(props);
// Convertir props a variable

var dataLength = 9; // Longitud de los datos
var minValue = 30; // Valor mínimo de los datos
var maxValue = 150; // Valor máximo de los datos
var randomData = generateData(dataLength, minValue, maxValue);
const counterElement = ref(0);

const counterElementComputed = computed(() => {
  return counterElement.value;
});

var series = [
  {
    name: "series-1",
    data: randomData,
  },
];
var options = {
  series: [
    {
      name: "Ventas",
      data: randomData,
    },
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
      show: false,
    },
    axisBorder: {
      show: false, // Oculta las líneas del eje X
    },
    axisTicks: {
      show: false, // Oculta las marcas del eje X
    },
    categories: randomData,
  },
  yaxis: {
    show: false,
    title: {
      text: "Ventas",
    },
  },
  //etiqueta cuando el puntero pasa por encima
  tooltip: {
    enabled: false, // Desactiva las etiquetas emergentes (tooltips)
  },
  //cuadricula
  grid: {
    show: false, // Oculta las líneas horizontales y verticales
  },
};

function generateData(length, min, max) {
  var data = [];
  for (var i = 0; i < length; i++) {
    var random = Math.floor(Math.random() * (max - min + 1)) + min;
    data.push(random);
  }
  return data;
}

const animarNumber = () => {
  const duration = 3000; // Duración del contador en milisegundos
  const startValue = 0; // Valor inicial del contador
  const endValue = valor.value; // Valor final del contador
  const increment = Math.ceil((endValue - startValue) / (duration / 100)); // Cantidad de incremento por intervalo

  let currentValue = startValue;

  const interval = setInterval(() => {
    currentValue += increment;
    if (currentValue >= endValue) {
      clearInterval(interval);
      currentValue = endValue;
    }
    counterElement.value = currentValue;
  }, 100); // Intervalo de tiempo en milisegundos (puedes ajustarlo según tus necesidades)
};

const filtroTiquetes = () => {
  LocalStorage.set("filtro", title.value);
};

watchEffect(() => {
  valor.value;
  return animarNumber();
});
onMounted(() => {
  // animarNumber();
});
</script>
