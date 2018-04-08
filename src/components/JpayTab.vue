<template>
<div id="jpayTab" >
    <footer class="navtab">
      <router-link to="/jpay" :class="selectedpage=='首页'? 'isactive' :''"><span class="iconfont icon-zhuye"></span><b>首页</b></router-link>
      <router-link to="/jpay/service" :class="selectedpage=='客服'? 'isactive' :''"><span class="iconfont icon-ziyuan"></span><b>客服</b></router-link>
      <router-link to="/jpay/main" :class="selectedpage=='我的'? 'isactive' :''"><span class="iconfont icon-wode"></span><b>我的</b></router-link>
    </footer>
</div>
</template>

<script>
  import { Tabbar, TabItem } from 'mint-ui';
  export default{
    name: 'JpayTab',
    props:['selectedpage'],
    data() {
      return {
        selected:'首页'
      }
    },
    methods: {},
    mounted() {


    },
    updated() {

    },
    activated() {

    },
    components: {}
  }
</script>

<style scoped lang="scss">
  .navtab{
    width: 100%;
    height: 2.5rem;
    position: absolute;
    bottom: 0rem;
    display: flex;
    background: #fff;
  }
  a{
    flex-grow: 1;
    flex-shrink: 1;
    display: flex;
    flex-flow: column;
    justify-content: space-around;
    align-items: center;
    text-decoration: none;
    color: #999;
  }
  b{
    font-weight: normal;
    font-size: 0.5rem;
    margin-top:-0.5rem;
  }
  span{
    font-size: 0.20rem;
    font-weight: normal;
    color: #999;
    font-size: 1.25rem;
  }
  .isactive{
    span{
      color: #ff3737;
    }
    b{
      color: #ff3737;
    }
  }

</style>
