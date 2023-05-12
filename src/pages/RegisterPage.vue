<template>
  <q-layout view="hHh lpr fFf" class="background">
        <q-card class="card-container">
          <q-img src="../assets/C505EF1B-28CA-4FD4-A240-D5AFBBC9989A-removebg.png" class="u-traffic" />
          <div class="card-header">
            <div class="title-class text-h5 text-weight-bold text-uppercase">Welcome to</div>
            <div class="title-class text-h5 text-weight-bold text-uppercase">U-Ticket</div>
          </div>
        <q-carousel
          v-model="slide"
          transition-prev="slide-right"
          transition-next="slide-left"
          swipeable
          animated
          control-color="black"
          :padding="padding"
          arrows
          height="450px"
          class="text-white rounded-borders carousel-style"
        >
          <q-carousel-slide name="style" class="column no-wrap flex-center">
            <div class="title-class text-h6 font-weight-medium text-uppercase">Join us Today!</div>
            <q-input outlined v-model="name" label="Name" :rules="rules" type="text" class="username-box" required />
            <q-input outlined v-model="lastName" label="Last Name" type="text" class="username-box" :rules="rules" required/>
            <q-input
              v-model="phoneNumber"
              label="Phone"
              mask="(###) ### - ####"
              unmasked-value
              :rules="rules"
              hint="Mask: (###) ### - ####"
              class="username-box"
              required
              outlined
            />
            <q-select outlined v-model="model" :options="options" label="Concesion" class="username-box" :rules="rules"/>
          </q-carousel-slide>

          <q-carousel-slide name="tv" class="column no-wrap flex-center q-pa-none">
            <div class="title-class text-h6 font-weight-medium text-uppercase">One more step...</div>
            <q-input outlined v-model="email" label="Email" type="email" class="username-box" required :rules="rules"/>
            <q-input outlined v-model="confirmEmail" label="Confirm Email" type="email" class="username-box" required :rules="rules"/>
            <q-input outlined v-model="password" label="Password" type="password" class="username-box" required :rules="rules"/>
            <q-input outlined v-model="confirmPassword" label="Confirm Password" type="password" class="username-box" required :rules="rules"/>
          </q-carousel-slide>

          <q-carousel-slide name="layers" class="column no-wrap flex-center q-pa-none">
            <p class="text-h6 text-weight-bold register-text text-uppercase">You are ready to go!</p>
            <q-btn class="button-class r bg-dark no-padding" flat>Create account</q-btn>
          </q-carousel-slide>
        </q-carousel>
        </q-card>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { defineComponent, ref } from 'vue'

defineComponent({
  name: 'RegisterPage'
})

const email = ref('')
const confirmEmail = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')
const lastName = ref('')
const phoneNumber = ref('')
const model = ref('')
const options = [1, 2, 3, 4, 5, 6]
const rules = ref([val => !!val || 'Field is required'])

const slide = ref('style')
const padding = ref(false)

// eslint-disable-next-line no-unused-vars
const validate = () => {
  if (email.value !== confirmEmail.value) {
    alert("Emails don't match")
    return false
  }
  if (password.value !== confirmPassword.value) {
    alert("Passwords don't match")
    return false
  }
  return true
}

</script>
