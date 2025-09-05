<template>
  <div>
    <div class="input-area">
      <textarea
        v-model="json1Text"
        placeholder="Вставьте JSON таблицы 1 (массив объектов)"
      ></textarea>

      <textarea
        v-model="json2Text"
        placeholder="Вставьте JSON таблицы 2 (массив объектов)"
      ></textarea>
    </div>

    <button @click="compare">Показать таблицы и сравнить</button>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!error">
      <div class="tables-container">
        <div>
          <h3>Таблица 1</h3>
          <json-table :data="data1" :keys="allKeys" />
        </div>
        <div>
          <h3>Таблица 2</h3>
          <json-table :data="data2" :keys="allKeys" />
        </div>
      </div>

      <comparison-by-index
        :data1="data1"
        :data2="data2"
        :allKeys="allKeys"
        @row-statuses="onRowStatuses"
      />

      <status-table
        :data1="data1"
        :data2="data2"
        :allKeys="allKeys"
        :rowStatuses="rowStatuses"
      />

      <global-key-compare
        :data1="data1"
        :data2="data2"
        :allKeys="allKeys"
      />

      <all-rows-table :data1="data1" :data2="data2" :allKeys="allKeys" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  useJsonCompare,
} from "../composables/useJsonCompare.js";
import JsonTable from "./JsonTable.vue";
import ComparisonByIndex from "./ComparisonByIndex.vue";
import StatusTable from "./StatusTable.vue";
import GlobalKeyCompare from "./GlobalKeyCompare.vue";
import AllRowsTable from "./AllRowsTable.vue";

const json1Text = ref(`[
  {"id":1, "name":"Иван", "age":30},
  {"id":2, "name":"Петр", "age":25}
]`);
const json2Text = ref(`[
  {"id":1, "name":"Иван", "age":31},
  {"id":2, "name":"Пётр", "age":25},
  {"id":3, "name":"Сергей", "age":20}
]`);

const error = ref(null);
const data1 = ref([]);
const data2 = ref([]);
const allKeys = ref([]);
const rowStatuses = ref([]);

const {
  parseJSON,
  getAllKeys,
  deepEqualObjects,
} = useJsonCompare();

function compare() {
  error.value = null;

  const p1 = parseJSON(json1Text.value);
  if (p1.error) {
    error.value = "Ошибка в таблице 1: " + p1.error;
    return;
  }
  const p2 = parseJSON(json2Text.value);
  if (p2.error) {
    error.value = "Ошибка в таблице 2: " + p2.error;
    return;
  }

  data1.value = p1.data;
  data2.value = p2.data;

  const keys1 = getAllKeys(data1.value);
  const keys2 = getAllKeys(data2.value);

  // Объединённый набор ключей
  allKeys.value = Array.from(new Set([...keys1, ...keys2]));
}

function onRowStatuses(statuses) {
  rowStatuses.value = statuses;
}
</script>

<style scoped>
.input-area {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}
textarea {
  width: 48%;
  height: 150px;
  font-family: monospace;
}
.tables-container {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}
.error {
  color: red;
  margin: 12px 0;
  font-weight: bold;
}
</style>
