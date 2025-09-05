<template>
  <table border="1">
    <caption>Итоговый анализ строк и их статус по индексам</caption>
    <thead>
      <tr>
        <th>#</th>
        <th>Строка в Таблице 1</th>
        <th>Строка в Таблице 2</th>
        <th>Статус</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(status, index) in rowStatuses" :key="index" :class="statusClass(status)">
        <td>{{ index + 1 }}</td>
        <td>{{ stringifyRow(data1[index]) }}</td>
        <td>{{ stringifyRow(data2[index]) }}</td>
        <td>{{ statusText(status) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
const props = defineProps({
  data1: Array,
  data2: Array,
  allKeys: Array,
  rowStatuses: Array,
});

function stringifyRow(row) {
  if (!row) return "—";
  return Object.entries(row)
    .map(([k, v]) => `${k}: ${v === null ? "null" : v}`)
    .join(", ");
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
      return "—";
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
