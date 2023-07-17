<template>
  <div class="q-mt-lg" style="max-width: 250px">
    <q-list bordered padding class="no-border text-dark">
      <q-item clickable v-ripple to="/" active-class="my-menu-link" exact>
        <q-item-section avatar>
          <q-icon name="inbox" />
        </q-item-section>

        <q-item-section>Inicio</q-item-section>
      </q-item>
      <q-item
        to="/clientes"
        clickable
        v-ripple
        exact
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="person_outline" />
        </q-item-section>

        <q-item-section>Clientes</q-item-section>
      </q-item>

      <!-- <q-separator spaced />

      <q-item clickable v-ripple exact active-class="my-menu-link">
        <q-item-section avatar>
          <q-icon name="settings" />
        </q-item-section>

        <q-item-section>Settings</q-item-section>
      </q-item>

      <q-item clickable v-ripple exact active-class="my-menu-link">
        <q-item-section avatar>
          <q-icon name="help" />
        </q-item-section>

        <q-item-section>Help</q-item-section>
      </q-item> -->
    </q-list>
  </div>
</template>

<script setup>
import { defineComponent } from "vue";

defineComponent({
  name: "MenuBar",
});
</script>

<style lang="scss">
.my-menu-link {
  font-weight: bold;
  color: rgb(255, 255, 255);
  background: $primary;
}
</style>
