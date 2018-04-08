<template>
  <div class="j_pay">
    <router-view></router-view>
  </div>
</template>

<script>
  export default{
    name: 'Jpay',
    data() {
      return {}
    },
    methods: {},
    mounted() {
      var token =localStorage.getItem('token')
      if(!token){
        window.location.href='#/login'
      }
    },
    updated() {

    },
    activated() {

    },
    components: {}
  }
</script>

<style scoped lang="scss">
  .j_pay{
    width: 100%;
    height: 100%;
  }

</style>
