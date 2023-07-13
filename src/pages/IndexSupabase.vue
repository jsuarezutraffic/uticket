<template>
  <q-table
    :rows="filteredRows"
    :columns="columns"
    row-key="id"
    :filter-method="customFilter"
  >
    <template v-slot:header="props">
      <q-tr :props="props" class="head-styles">
        <q-th
          class="th-text head-styles"
          auto-width
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
        >
          {{ col.label }}

          <q-select
            v-model="filters[col.field]"
            :options="getDistinctValues(col.field)"
            option-value="value"
            option-label="label"
            label="Filter"
            dense
            outlined
            emit-value
            map-options
            use-input
            ><template v-slot:append>
              <q-icon
                v-if="filters[col.field] !== ''"
                name="close"
                @click.stop.prevent="filters[col.field] = ''"
                class="cursor-pointer"
              /> </template
          ></q-select>
        </q-th>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup>
import { ref, computed } from "vue";

const rows = ref([
  { id: 1, name: "John", age: null, country: "USA" },
  { id: 2, name: "John", age: 30, country: "USA" },
  { id: 3, name: "Mark", age: null, country: "USA" },
  { id: 4, name: "Mark", age: 20, country: "Canada" },
  { id: 5, name: "jaja", age: 11, country: "Canada" },
  { id: 6, name: "Mardadak", age: 11, country: "Canada" },
  { id: 7, name: "Mardadk", age: 35, country: "USA" },
  // ...
]);

const columns = [
  { name: "Name", required: true, label: "Name", field: "name" },
  { name: "Age", label: "Age", field: "age" },
  { name: "Country", label: "Country", field: "country" },
  // ...
];

const filters = ref(
  rows.value.reduce((acc, row) => {
    Object.entries(row).forEach(([key, value]) => {
      if (!acc.hasOwnProperty(key)) {
        acc[key] = "";
      }
    });
    return acc;
  }, {})
);

const filteredRows = computed(() => {
  return rows.value.filter((row) => {
    return Object.keys(filters.value).every((field) => {
      const filterValue = filters.value[field];
      const rowValue = row[field]?.toString()?.toLowerCase() || "";
      return rowValue.includes(filterValue.toLowerCase());
    });
  });
});

const customFilter = (value, row, column) => {
  const filterValue = filters.value[column.field];
  if (!filterValue) {
    return true;
  }
  return (value?.toString() || "").includes(filterValue);
};

const getDistinctValues = (field) => {
  const distinctValues = new Set();
  rows.value.forEach((row) => {
    distinctValues.add(row[field]);
  });
  return Array.from(distinctValues).map((value) => ({
    value: value ? value.toString() : "",
    label: value ? value.toString() : "",
  }));
};
</script>

<!-- <template>
  <div class="q-pa-md flex">
    <q-table
      :rows="filteredRows"
      :columns="columns"
      row-key="id"
      :filter-method="customFilter"
    >
      <template v-slot:header="props">
        <q-tr :props="props" class="head-styles">
          <q-th
            class="th-text head-styles"
            auto-width
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}

            <q-select
              v-model="filters[col.field]"
              :options="getDistinctValues(col.field)"
              option-value="value"
              option-label="label"
              label="Filter"
              dense
              outlined
              emit-value
              map-options
              use-input
              ><template v-slot:append>
                <q-icon
                  v-if="filters[col.field] !== ''"
                  name="close"
                  @click.stop.prevent="filters[col.field] = ''"
                  class="cursor-pointer"
                /> </template
            ></q-select>
          </q-th>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const rows = ref([
  { id: 1, name: "John", age: 25, country: "USA" },
  { id: 2, name: "Jane", age: 30, country: "USA" },
  { id: 3, name: "Mark", age: 35, country: "USA" },
  { id: 4, name: "Mark", age: 20, country: "Canada" },
  { id: 5, name: "jaja", age: 11, country: "Canada" },
  { id: 6, name: "Mardadak", age: 11, country: "Canada" },
  { id: 7, name: "Mardadk", age: 35, country: "USA" },
  // ...
]);

const columns = [
  { name: "Name", required: true, label: "Name", field: "name" },
  { name: "Age", label: "Age", field: "age" },
  { name: "Country", label: "Country", field: "country" },
  // ...
];

const filters = ref({
  name: "",
  age: "",
  country: "",
  // ...
});

const filteredRows = computed(() => {
  const { name, age, country } = filters.value;
  return rows.value.filter(
    (row) =>
      row.name.toLowerCase().includes(name.toLowerCase()) &&
      String(row.age).includes(age) &&
      row.country.toLowerCase().includes(country.toLowerCase())
  );
});

const customFilter = (value, row, column) => {
  const filterValue = filters.value[column.field];
  if (!filterValue) {
    return true;
  }
  return String(value).includes(filterValue);
};

const getDistinctValues = (field) => {
  const distinctValues = new Set();
  rows.value.forEach((row) => {
    distinctValues.add(row[field]);
  });
  return Array.from(distinctValues).map((value) => ({
    value,
    label: value,
  }));
};
</script> -->
