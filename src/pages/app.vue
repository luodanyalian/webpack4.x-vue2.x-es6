<template>
  <div id="app">
    {{text}}
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      text: 'webpack4.x+vue2.x+es6'
    }
  },
  mounted(){   
  	// [1,2,3].map(function(r){alert(r+1)})
  }
}
</script>

<style module>
  #app {
    color: red;
  }
</style>