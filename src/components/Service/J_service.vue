<template>
  <div class="customer_service">
    <ul>
      <li>
        <a href="#/jpay/service/natice">
          <div class="dimg notice">
          </div>
          <div class="dcontent">
            <div class="contentd">
              <p class="main">最新公告</p>
              <p class="second">紧急通知</p>
            </div>
            <i class="iconfont icon-jiantou-copy"></i>
          </div>
          <b v-if="show"></b>
        </a>
      </li>
      <li>
        <a href="javacript:void(null);">
          <div class="dimg lam">
          </div>
          <div class="dcontent" @click="talk">
            <div class="contentd">
              <p class="main">在线留言</p>
              <p class="second">您可以给我们留言，我们将再一个工作日内回复您</p>
            </div>
            <i class="iconfont icon-jiantou-copy"></i>
          </div>
        </a>
      </li>
      <li>
        <a href="tel:59477624">
          <div class="dimg cservice">
          </div>
          <div class="dcontent dcontentn">
            <div class="contentd">
              <p class="main">在线客服</p>
              <p class="second">工作日9：00-18：00在线</p>
            </div>
            <i class="iconfont icon-jiantou-copy"></i>
          </div>
        </a>
      </li>
    </ul>
    <jpay-tab :selectedpage=" '客服' ">></jpay-tab>
  </div>
</template>
<script>
  import JpayTab from '../JpayTab'
  import axios from 'axios';
  import qs from 'qs';
  export default{
    name: 'J_service',
    data() {
      return {
        native:'',
        show:false
      }
    },
    methods: {
      talk() {
        a.onclick();
      },
      isnoread(){

       var  isread= JSON.parse(localStorage.getItem('natice'))

       if(!isread){
            this.show=true
            return
       }

       var now = new Date()
        for(var i = 0;i<this.native.length;i++){
          var time = new Date(this.native[i].addtime)
          if((now-time)<= 30 *24 *60*60*1000){
            if(isread.indexOf(this.native[i].id)==-1){
              this.show = true
              return
            }
          }
        }
      }
    },
    mounted() {
         var  that =this
         var token=localStorage.getItem('token')
         axios.post(BASE_URL +'/index.php?r=Apitransaction/noticelist',qs.stringify({
          token:token,
          page:1,
        })).then(function(res){
          var a=Base64.decode(res.data)
          a=JSON.parse(a)
          if(a.code==10000){
            that.native=a.data.data.res
            that.isnoread()
          }else{
             Toast(a.info)
          }
        }).catch(function(err){

        });

    },
    updated() {

    },
    activated() {

    },
    components: {
      'jpay-tab':JpayTab
    }
  }
</script>

<style scoped lang="scss">
  div.customer_service{  background-color: #fff; width: 100%;}
  div.customer_service ul li a{ padding:0.75rem 0rem 0rem 0.75rem; display: inline-block; width:100%; position: relative;}
  div.customer_service ul li a:after{content: ""; display: block; height: 0; clear: both;}
  div.customer_service ul li a div.dimg{ float: left; width:2.125rem; height: 2.125rem; background-repeat: no-repeat; background-size:100% 100%; margin-right: 0.75rem;}
  div.customer_service ul li a div.notice{ background-image:url(../../assets/images/j-pay-img/notice.png);}
  div.customer_service ul li a div.lam{background-image: url(../../assets/images/j-pay-img/lam.png);}
  div.customer_service ul li a div.cservice{background-image: url(../../assets/images/j-pay-img/cservice.png);}
  div.customer_service ul li a div.dcontent{ float: left; width:84%; padding-bottom: 0.75rem; border-bottom: 0.025rem solid #eeeeee; position: relative;}
  div.customer_service ul li a div.dcontentn{ border: none;}
  div.customer_service ul li a div.dcontent:after{content: ""; display: block; height: 0; clear: both;}
  div.customer_service ul li a div.dcontent div.contentd{ float: left;  width:90%;}
  div.customer_service ul li a div.dcontent div.contentd p.main{ color: #333333; font-size: 0.75rem; width:100%;word-wrap:break-word; }
  div.customer_service ul li a div.dcontent div.contentd p.second{ color: #999; font-size:0.6rem;  width:100%;word-wrap:break-word; }
  div.customer_service ul li a div.dcontent i{/* float: left; margin-right: 0.55rem; */margin-top:-0.109125rem; color: #999; font-size:0.35rem;  position: absolute; top: 30%; right:5%; display: block;}
  div.customer_service ul li a b{ background-color: #ff3b3b; width:0.5rem; height: 0.5rem; border-radius: 0.875rem; position: absolute; top:0.875rem; left:2.4rem;}
</style>

