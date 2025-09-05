<template>
  <table>
    <thead>
      <tr>
        <th v-for="key in keys" :key="key">{{ key }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row,index) in data" :key="index">
        <td v-for="key in keys" :key="key">
          {{ stringify(row[key]) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
const props = defineProps({
  data: { type: Array, required: true },
  keys: { type: Array, required: true },
});

function stringify(value) {
  if (value === null) return "null";
  if (value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return value.toString();
}
</script>

<style scoped>
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
  max-width: 150px;
  word-wrap: break-word;
}
th {
  background: #ddd;
}
</style>
