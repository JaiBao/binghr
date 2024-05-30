<template>
  <div class="q-pa-md">
    <div class="row w-100 justify-center items-center">
      <q-select
        class="col-xs-12 col-md-6 col-lg-3 q-ma-md"
        outlined
        v-model="form.name"
        label="姓名"
        :options="optionsname"
      />
      <q-input
        class="col-xs-12 col-md-6 col-lg-3 q-ma-md"
        outlined
        v-model="form.number"
        readonly
        label="工號"
      />
      <q-input
        class="col-xs-12 col-md-6 col-lg-3 q-ma-md"
        outlined
        v-model="form.time"
        mask="##:##"
        label="時間"
      />
      <q-input
        class="col-xs-12 col-md-6 col-lg-3 q-ma-md"
        outlined
        v-model="form.year"
        label="年"
      />
      <q-input
        class="col-xs-12 col-md-6 col-lg-3 q-ma-md"
        outlined
        v-model="form.month"
        label="月"
      />
      <q-input
        class="col-xs-12 col-md-6 col-lg-3 q-ma-md"
        outlined
        v-model="form.day"
        label="日"
      />
      <q-select
        class="col-xs-12 col-md-6 col-lg-3 q-ma-md"
        outlined
        v-model="form.punchtype"
        label="上/下班"
        :options="punchoption"
      />

    </div>
  </div>
</template>

<script setup></script>
