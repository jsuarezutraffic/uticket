<template>
  <div>
    <q-table :rows="personasReactivas" :columns="columnas"></q-table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";

const personas = reactive([
  {
    nombre: "John",
    apellido: "Doe",
    tiempoRestante: "",
    fecha: "2023-05-24 07:37:42.32903+00",
  },
  {
    nombre: "Jane",
    apellido: "Smith",
    tiempoRestante: "",
    fecha: "2023-05-24 07:21:26.364804+00",
  },
  // ...más personas
]);

const tiempoObjetivo = new Date(); // Reemplaza con tu tiempo objetivo específico

const columnas = [
  {
    name: "fecha",
    required: true,
    label: "Fecha",
    align: "left",
    field: "fecha",
    sortable: true,
  },
  {
    name: "nombre",
    required: true,
    label: "Nombre",
    align: "left",
    field: "nombre",
    sortable: true,
  },
  {
    name: "apellido",
    required: true,
    label: "Apellido",
    align: "left",
    field: "apellido",
    sortable: true,
  },
  {
    name: "tiempoRestante",
    required: true,
    label: "Tiempo Restante",
    align: "left",
    field: "tiempoRestante",
    sortable: false,
  },
];

onMounted(() => {
  setInterval(() => {
    // Actualizar el tiempo restante para todas las personas en la tabla
    personas.forEach((persona) => {
      const fechaProcesada = persona.fecha.split(".")[0]; // Eliminar la parte de milisegundos
      const fecha = new Date(fechaProcesada);
      fecha.setHours(fecha.getHours() + 5);
      persona.tiempoRestante = calcularTiempoRestante(fecha);
    });
  }, 1000);
});

function calcularTiempoRestante(fecha) {
  const ahora = new Date();
  const diferencia = fecha - ahora;
  // const diferencia = tiempoObjetivo - ahora;

  const horas = Math.floor(diferencia / (60 * 60 * 1000));
  const minutos = Math.floor((diferencia % (60 * 60 * 1000)) / (60 * 1000));
  const segundos = Math.floor((diferencia % (60 * 1000)) / 1000);

  return `${horas}h ${minutos}m ${segundos}s`;
}
const personasReactivas = ref(personas);
</script>
