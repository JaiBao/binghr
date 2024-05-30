<template>
  <div class="row w-100 q-pa-md-md">
    <OrderMealTable/>
    <OrderWorker />
  </div>
</template>

<script setup>
import OrderWorker from 'src/components/OrderWorker.vue'
import OrderMealTable from 'src/components/OrderMealTable.vue'
</script>
