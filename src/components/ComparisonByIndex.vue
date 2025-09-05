<template>
  <table border="1">
    <caption>Сравнение строк по индексам и ключам</caption>
    <thead>
      <tr>
        <th>#</th>
        <th v-for="key in allKeys" :key="'k1-'+key">{{ key }} (Таблица 1)</th>
        <th v-for="key in allKeys" :key="'k2-'+key">{{ key }} (Таблица 2)</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(index) in rowsCount" :key="index">
        <td>{{ index }}</td>
        <td
          v-for="key in allKeys"
          :key="'v1-'+key+index"
          :class="getCellClass(index - 1, key, true)"
        >
          {{ getValue(data1, index - 1, key) }}
        </td>
        <td
          v-for="key in allKeys"
          :key="'v2-'+key+index"
          :class="getCellClass(index - 1, key, false)"
        >
          {{ getValue(data2, index - 1, key) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { watch, ref, onMounted } from "vue";
import { useJsonCompare } from "../composables/useJsonCompare";

const props = defineProps({
  data1: { type: Array, required: true },
  data2: { type: Array, required: true },
  allKeys: { type: Array, required: true },
});

const emits = defineEmits(["row-statuses"]);

const { valuesEqual } = useJsonCompare();

const rowsCount = Math.max(props.data1.length, props.data2.length);
const rowStatuses = ref([]);

function getValue(data, row, key) {
  if (!data[row]) return "";
  let val = data[row][key];
  if (val === null) return "null";
  if (val === undefined) return "";
  if (typeof val === "object") return JSON.stringify(val);
  return val.toString();
}

function getCellClass(row, key, isFirstTable) {
  const val1 = getValue(props.data1, row, key);
  const val2 = getValue(props.data2, row, key);
  if (valuesEqual(val1, val2)) {
    return "same-cell";
  }
  return "diff-cell";
}

function computeRowStatuses() {
  const statuses = [];
  for (let i = 0; i < rowsCount; i++) {
    const row1 = props.data1[i];
    const row2 = props.data2[i];
    let status = "";
    if (!row1 && row2) status = "added";
    else if (row1 && !row2) status = "deleted";
    else if (row1 && row2) {
      let changed = false;
      for (const key of props.allKeys) {
        const v1 = getValue(props.data1, i, key);
        const v2 = getValue(props.data2, i, key);
        if (!valuesEqual(v1, v2)) {
          changed = true;
          break;
        }
      }
      status = changed ? "modified" : "unchanged";
    } else {
      status = "unchanged";
    }
    statuses.push(status);
  }
  rowStatuses.value = statuses;
  emits("row-statuses", statuses);
}

onMounted(() => {
  computeRowStatuses();
});
watch([() => props.data1, () => props.data2], computeRowStatuses);
</script>

<style scoped>
.diff-cell {
  background-color: #ffc2c2;
}
.same-cell {
  background-color: #d2f8d2;
}
</style>
