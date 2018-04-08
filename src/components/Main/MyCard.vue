<template>
  <div id="my_card">
    <div v-if="test" class="cardinfo" v-for="item in test">
      <div class="cardimg" >
        <!--<img v-if="item.image" :src="item.image" alt="" />
        <img v-else src='../../../assets/images/jpay/default.png' alt="">-->
        <img  src='../../assets/images/jpay/default.png' alt="">
        <div class="card_person">
          <p class="card_name"><b>{{item.bank}}</b></p>
          <p class="myname">持卡人: <span>{{savecard.cname}}</span></p>
        </div>
      </div>
      <div class="cardNo"><span>{{item.cashcardNO}}</span> </div>
      <p class="status">{{change(item.status)}}</p>
    </div>
    <div v-if="!test.length">
    <a href="#/jpay/main/realname" class="addcredit">
          <b>+</b>添加储蓄卡
        </a>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import qs from "qs";
  import { Toast } from "mint-ui";
  import { Indicator } from "mint-ui";
  var token = localStorage.getItem("token");
  export default{
    name: 'MyCard',
    data() {
      return {
        test : [],
        savecard:'',
        status:'',
      }
    },
    methods: {
      change(status){
        if(status==0){
          return '处理中'
        }else if(status==1){
          return '已绑定'
        }else if(status==-1){
          return '绑定失败'
        }
      }
    },
    mounted() {
      var that =this;
      var token = localStorage.getItem("token");
      axios.post(BASE_URL+'/index.php?r=CardjPay/index',qs.stringify({
        type:"1",
        token:token
      }))
        .then(function (res) {
          var a = Base64.decode(res.data)
          var b = JSON.parse(a)
          if(b.code==10000){
            that.test=b.data.data
            that.savecard=b.data.shopInfo
          }else{
            Toast(b.info)
          }
        })
        .catch(function (err) {

        });
    },
    updated() {

    },
    activated() {

    },
    components: {}
  }
</script>

<style scoped lang="scss">
  #my_card{
    padding:0.75rem;
    .cardinfo{
      background: #fff;
      padding: 1rem;
      -webkit-border-radius: 8px;
      -moz-border-radius: 8px;
      border-radius: 8px;
      margin-bottom:10px;
      .cardimg{
        display:flex;
        justify-content: space-between;
        width: 100%;
        align-items: center;
        img{
          width: 1.6rem;
          height: 1.6rem;
        }
        .card_person{
          flex: 1;
          font-size: 0.7rem;
          padding-left: 0.75rem;
          .card_name{
            letter-spacing:2px;
          }
          .myname{
            padding-top: 0.4rem;
            color:#666;
            font-size: 0.55rem;
          }
        }
      }
      .cardNo{
        line-height: 4.25rem;
        font-size: .9rem;
        color: #838383;
        span{
          padding-right: 0.6rem;
          b{
            letter-spacing:2px;
          }
        }
      }
      .status{
        font-size: 0.55rem;
        color: #999999;
      }
    }
    .addcredit{
      display: flex;
      border: 1px dashed #ccc;
      height: 3.5rem;
      text-align: center;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      font-weight: bold;
      color: #999;
      background: #fffcfc;
      b{
        border-radius: 50%;
        background: #cccccc;
        display: inline-block;
        width: 1.5rem;
        height: 1.5rem;
        line-height: 1.4rem;
        text-align: center;
        color: #fff;
        font-size: 1rem;
        margin-right: 0.5rem;
      }
    }
  }

</style>
