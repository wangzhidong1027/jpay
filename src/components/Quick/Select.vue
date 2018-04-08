<template>
  <div class="credit">
    <div class="cardinfo" v-for="(item,index) in test">
      <div class="del" ><b class="iconfont icon-shanchu" @click="removeTodo(index,item.id)" ></b></div>
      <a :href="'#/jpay/quick/quickpay/'+oriderid+'/'+item.id">
        <div class="cardimg" >
          <!--<img v-if="item.image" :src="item.image" alt="" />
          <img v-else src='../../../assets/images/jpay/default.png' alt="">-->
          <img  src='../../assets/images/jpay/default.png' alt="">
          <div class="card_person">
            <p class="card_name"><b>{{item.bank}}</b></p>
            <p class="myname"><span>{{item.bankClass}} </span></p>
          </div>
        </div>
      <div class="cardNo"><span>{{item.debitcardNO}}</span> 
        <p class="xian">单笔限额:￥<b>{{item.Singlelimit}}</b>单日限额:￥<b>{{item.Dailylimit}}</b>月限额:￥<b>{{item.Monthlyquota}}</b></p>
      </div>
      </a>
    </div>
    <a href="#/jpay/main/addcredit" class="addcredit">
      <b>+</b>添加信用卡
    </a>
  </div>
</template>

<script>
  import axios from "axios";
  import qs from "qs";
  import { Toast } from "mint-ui";
  import { Indicator } from "mint-ui";
  var token = localStorage.getItem("token");
  export default{
    name: 'Select',
    data() {
      return {
        test : [],
        oriderid:''
      }
    },
    methods: {
      removeTodo(index,id){
        var that =this;
        var token = localStorage.getItem("token");
        axios.post(BASE_URL+'/index.php?r=CardjPay/debitDel',qs.stringify({
          id:id,
          token:token
        }))
          .then(function (res) {
            var edoc = Base64.decode(res.data)
            edoc = JSON.parse(edoc)
            if (edoc.code==10000) {
                that.test.splice(index, 1);
                Toast('解绑成功')
            }else{
              Toast(edoc.info)
            }
          })
          .catch(function (err) {
          });
      }
    },
    mounted() {
      var token = localStorage.getItem("token");
      this.oriderid=this.$route.params.oriderid
      var that =this;
      axios.post(BASE_URL+'/index.php?r=CardjPay/index',qs.stringify({
        type:"2",
        token:token
      }))
        .then(function (res) {
          var a = Base64.decode(res.data)
          var b = JSON.parse(a)
          if(b.code==10000){
            that.test=b.data.data
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
  .credit{
    background: #fff;
    padding:0.75rem;
    width: 100%;
    height: 100%;
    .cardinfo{
      background: #f00;
      padding: 1rem;
      -webkit-border-radius: 8px;
      -moz-border-radius: 8px;
      border-radius: 8px;
      margin-bottom: 0.75rem;
      position: relative;
      .del{
        position: absolute;
        right: 0.75rem;
        top: 0.75rem;
        color:#fff ;
      }
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
            color: #fff;
          }
          .myname{
            padding-top: 0.4rem;
            color:#eee;
            font-size: 0.55rem;
          }
        }

        .iconfont{
          color: #fbbdaa;
          font-size: 1rem;
        }

      }
      .cardNo{
        line-height: 3.25rem;
        font-size: .9rem;
        color: #fff;
        span{
          padding-right: 0.6rem;
          b{
            letter-spacing:2px;
            color:#eee;
          }
        }
        .xian{
          font-size: 0.55rem;
          line-height: 0.8rem;
          color: rgba(255,255,255,0.7);
          b{
            color: #fff;
            margin-right: 0.75rem;
          }
        }
      }
      .status{
        font-size: 0.55rem;
        color: #fff;
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
