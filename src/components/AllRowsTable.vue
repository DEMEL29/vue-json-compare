<template>
  <div>
    <table v-if="keyForJoin" border="1">
      <caption>Общая таблица со всеми строками и статусом по таблицам</caption>
      <thead>
        <tr>
          <th>Таблица</th>
          <th v-for="k in allKeys" :key="k">{{ k }}</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="[row, status] in rowsWithStatus"
          :key="generateKey(row)"
          :class="statusClass(status)"
        >
          <td>{{ row.table }}</td>

          <td v-for="k in allKeys" :key="k" :class="cellClass(row, k)">
            {{ cellValue(row, k) }}
          </td>

          <td>{{ statusText(status) }}</td>
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

const { valuesEqual, deepEqualObjects, getAllKeys } = useJsonCompare();

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

const rowsWithStatus = computed(() => {
  const result = [];
  // Добавляем из первой таблицы
  map1.value.forEach((row1, key) => {
    const row2 = map2.value.get(key);
    let status = "";
    if (!row2) {
      status = "deleted";
    } else {
      status = deepEqualObjects(row1, row2, props.allKeys)
        ? "unchanged"
        : "modified";
    }
    result.push({
      ...row1,
      table: 1,
      _key: key,
      _status: status,
    });
  });

  // Добавляем из второй таблицы, отсутствующие в первой (added)
  map2.value.forEach((row2, key) => {
    if (!map1.value.has(key)) {
      result.push({
        ...row2,
        table: 2,
        _key: key,
        _status: "added",
      });
    }
  });

  return result.map((r) => [r, r._status]);
});

function cellValue(row, key) {
  const v = row[key];
  if (v === null) return "null";
  if (v === undefined) return "";
  if (typeof v === "object") return JSON.stringify(v);
  return v.toString();
}

function cellClass(row, key) {
  const keyVal = row[keyForJoin.value]?.toString();
  if (!keyVal) return "";
  const row1 = map1.value.get(keyVal);
  const row2 = map2.value.get(keyVal);

  if (!row1 || !row2) return "diff-cell";

  const val1 = cellValue(row1, key);
  const val2 = cellValue(row2, key);

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

function generateKey(row) {
  return row.table + "-" + (row._key || Math.random().toString(36).slice(2));
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
  white-space: pre-wrap;
  word-wrap: break-word;
}
th {
  background: #ddd;
}
</style>
