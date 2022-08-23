<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>

export default {
  name: 'APP'
}
</script>
<style>
*,
*:before,
*:after {
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

ul, li {
  padding: 0;
  margin: 0;
  list-style: none
}

p {
  margin: 0;
}
</style>
