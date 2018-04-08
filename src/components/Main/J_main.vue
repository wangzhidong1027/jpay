<template>
  <div class="j_main">
     <div class='use_bg'>
        <div class="user_img"><a href='#/jpay/main/approver'><img src='../../assets/images/jpay/touxiang.png' /></a></div>
        <p><a href="#/jpay/main/approver">{{username}}</a></p>
     </div>
      <div class="mian_nav">
         <div class='navlist'> <a href="#/jpay/main/mycard"> <p><i></i>我的储蓄卡</p><i class="iconfont icon-jiantou-copy"></i></a></div>
          <div class='navlist'><a href="#/jpay/main/credit"> <p><i></i>我的信用卡</p><i class="iconfont icon-jiantou-copy"></i></a></div>
          <div class='navlist'><a href="#/jpay/main/record"> <p><i></i>交易记录</p><i class="iconfont icon-jiantou-copy"></i></a></div>
          <div class="loginout" @click="loginout">退出登录</div>
      </div>
      <jpay-tab :selectedpage=" '我的' "></jpay-tab>
  </div>
</template>

<script>
 import JpayTab from '../JpayTab'
  export default{
    name: 'J_main',
    data() {
      return {
        username:''
      }
    },
    methods: {
      loginout(){
         localStorage.removeItem("token");
         localStorage.removeItem("user");
        window.location.href='#/jpay/login'
      }
    },
    mounted() {
      var token =localStorage.getItem('token')
      if(token){
        this.username= JSON.parse(localStorage.getItem("user")).username;
      }
      
    },
    updated() {

    },
    activated() {

    },
    components: {
      "jpay-tab":JpayTab
    }
  }
</script>

<style scoped lang="scss">
.j_main{
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  .use_bg{
    height: 7.5rem;
    width: 100%;
    background: url("../../assets/images/jpay/main.png");
    background-size: 100% 100%;
    padding-top: 1.85rem;
    margin-bottom: 0.75rem;
    .user_img{
      width: 2.45rem;
      height: 2.45rem;
      border-radius: 50%;
      // border: 4px solid rgba($color: #fff, $alpha:0.6);
      margin: 0 auto;
      img{
        width: 100%;
        height: 100%;
      }
    }
    p{
      width: 100%;
      text-align: center;
      line-height: 1.6rem;
      font-size: 0.6rem;
      color: #fdd5d2;
      a{
        font-size: 0.6rem;
        color: #fdd5d2;
      }
    }
  }
  .mian_nav{
    flex: 1;
    position: relative;
    .loginout{
      position: absolute;
      bottom: 3rem;
      left: 0;
      width: 100%;
      text-align: center;
      font-size: 0.75rem;
      color: #333;
      height: 2.45rem;
      background: #fff;
      line-height: 2.45rem;
    }
   .navlist{
      padding-left: 0.75rem;
       border-bottom: 1px solid #dddddd;
       background: #fff;
      a{
        height: 2.45rem;
        padding-right: 0.75rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    p{
      font-size: 0.75rem;
      color: #333;
      i{
        width: 0.9rem;
        margin-right:0.5rem;
        display: inline-block;
        height: 0.85rem;
      }
    }
    .iconfont{
      color: #dddddd;
     }
    }
    .navlist:last-of-type{
      border: none;
    }
    div:nth-child(1) p i{
      color: #f00;
      background: url('../../assets/images/jpay/deposit.png');
      background-size :100%;
    }
     div:nth-child(2) p i{
      color: #f00;
      background: url('../../assets/images/jpay/card.png');
      background-size :100%;
    }
     div:nth-child(3) p i{
      color: #f00;
      background: url('../../assets/images/jpay/deallist.png');
      background-size :100%;
    }
  }
}

</style>
