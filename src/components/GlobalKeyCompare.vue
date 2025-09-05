<template>
  <div>
    <table v-if="keyForJoin" border="1">
      <caption>
        Общая таблица сравнения по ключу "{{ keyForJoin }}" с результатом
      </caption>
      <thead>
        <tr>
          <th>Ключ</th>
          <th v-for="k in allKeys" :key="'g1-'+k">{{ k }} (Таблица 1)</th>
          <th v-for="k in allKeys" :key="'g2-'+k">{{ k }} (Таблица 2)</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="key in unionKeys" :key="key">
          <td><b>{{ key }}</b></td>
          <td v-for="k in allKeys" :key="'gv1-'+key+k" :class="getClass(key, k, true)">
            {{ getValue(map1.get(key), k) }}
          </td>
          <td v-for="k in allKeys" :key="'gv2-'+key+k" :class="getClass(key, k, false)">
            {{ getValue(map2.get(key), k) }}
          </td>
          <td :class="statusClass(getStatus(key))">{{ statusText(getStatus(key)) }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else style="color:red;">Нет ключа для объединения</div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useJsonCompare } from "../composables/useJsonCompare";

const props = defineProps({
  data1: Array,
  data2: Array,
  allKeys: Array,
});

const { valuesEqual, deepEqualObjects } = useJsonCompare();

const keyForJoin = computed(() => props.allKeys?.[0] || null);

const map1 = computed(() => {
  const m = new Map();
  props.data1.forEach((row) => {
    if (row && row[keyForJoin.value] != null)
      m.set(row[keyForJoin.value].toString(), row);
  });
  return m;
});
const map2 = computed(() => {
  const m = new Map();
  props.data2.forEach((row) => {
    if (row && row[keyForJoin.value] != null)
      m.set(row[keyForJoin.value].toString(), row);
  });
  return m;
});

const unionKeys = computed(() => {
  return Array.from(new Set([...map1.value.keys(), ...map2.value.keys()]));
});

function getValue(row, key) {
  if (!row) return "";
  const val = row[key];
  if (val === null) return "null";
  if (val === undefined) return "";
  if (typeof val === "object") return JSON.stringify(val);
  return val.toString();
}

function getStatus(key) {
  const row1 = map1.value.get(key);
  const row2 = map2.value.get(key);
  if (!row1 && row2) return "added";
  if (row1 && !row2) return "deleted";
  if (row1 && row2) {
    return deepEqualObjects(row1, row2, props.allKeys) ? "unchanged" : "modified";
  }
  return "";
}

function getClass(key, propKey, isTable1) {
  const row1 = map1.value.get(key);
  const row2 = map2.value.get(key);
  if (!row1 || !row2) return "diff-cell";

  const val1 = getValue(row1, propKey);
  const val2 = getValue(row2, propKey);

  return valuesEqual(val1, val2) ? "same-cell" : "diff-cell";
}

function statusText(status) {
  switch (status) {
    case "added":
      return "Добавлено";
    case "deleted":
      return "Удалено";
    case "modified":
      return "Изменено";
    case "unchanged":
      return "Не изменено";
    default:
      return "";
  }
}
function statusClass(status) {
  switch (status) {
    case "added":
      return "status-added";
    case "deleted":
      return "status-deleted";
    case "modified":
      return "status-modified";
    case "unchanged":
      return "status-unchanged";
    default:
      return "";
  }
}
</script>

<style scoped>
.diff-cell {
  background-color: #ffc2c2;
}
.same-cell {
  background-color: #d2f8d2;
}
.status-added {
  background-color: #d2f8d2;
}
.status-deleted {
  background-color: #ffc2c2;
}
.status-modified {
  background-color: #fff0b3;
}
.status-unchanged {
  background-color: #fff;
}
table {
  border-collapse: collapse;
  width: 100%;
  font-family: monospace;
  font-size: 14px;
}
th,
td {
  border: 1px solid #aaa;
  padding: 6px 8px;
  word-wrap: break-word;
  white-space: pre-wrap;
}
th {
  background: #ddd;
}
</style>
