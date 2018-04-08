<template>
  <div class="transaction_page">
    <div class="information">
      <p><label>储蓄卡卡号：</label><span v-text="order.cashcardNO"></span></p>
      <p><label>持卡人：</label><span class="clro" v-text="order.cname"></span></p>
      <p><label>身份证号：</label><span class="clrt" v-text="order.idCardNo"></span></p>
    </div>
    <div class="content">
      <div><label>金额：</label><span >{{order.jpaymoney}}元</span></div>
      <div><label>信用卡：</label><i v-text="order.debitcardNO"></i></div>
      <div><label>CVV2码：</label><input type="text" value="" placeholder="请输入CVV2码 "  v-model="order.CVV2"/></div>
      <div><label>有效期：</label><input type="text" value="" placeholder="请选择有效期号 " v-model="order.period"/></div>
      <div><label>手机号：</label><i>{{order.username}}</i></div>
    </div>
    <div class="cos">
      <button @click="pay">确认提交</button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import qs from 'qs';
  import { Indicator ,Toast} from 'mint-ui';
  export default {
    name:'QuickPay',
    data(){
      return{
        order:'',
        orderid:'',
        deCardId:''
      }
    },
    methods:{
      getOrder(){
        var  that =this
        var token =localStorage.getItem('token')
        axios.post(BASE_URL +'/index.php?r=CardjPay/OrderView',qs.stringify({
          token:token,
          orderid:this.orderid,
          deCardId:this.deCardId
        })).then(function(res){
          var a =Base64.decode(res.data)
          a=JSON.parse(a)
          if(a.code==10000){
            if(a.data.err==10000){
              that.order=a.data.data
            }else{
              Toast(a.data.msg)
            }
          }else{
            Toast(a.info)
          }
        }).catch(function(err){

        });
      },
      pay(){
        var token =localStorage.getItem('token')
        axios.post(BASE_URL +'/index.php?r=ChannelJpay/SinglePay ',qs.stringify({
          token:token,
          orderid:this.orderid,
        })).then(function(res){
          var a =Base64.decode(res.data)
          a=JSON.parse(a)
          if(a.code==10000){
            if(a.data.err==10000){
                window.location.href =a.data.data.url
            }else{
              if(a.data.err==10002){
                window.location.href = "#/jpay/quick/pay/sccessful/"+this.orderid
              }
              Toast(a.data.msg)
            }
          }else{
            Toast(a.info)
          }
        }).catch(function(err){

        });

      }
    },
    mounted(){
      this.orderid=this.$route.params.orderid
      this.deCardId=this.$route.params.cardid
      this.getOrder()
    }
  }
</script>

<style scoped>
  div.transaction_page div.information{padding:0.75rem 0.75rem  0rem 0.75rem; margin-bottom: 0.75rem; background-color: #fff;}
  div.transaction_page div.information p{ padding-bottom: 0.75rem;}
  div.transaction_page div.information p label{font-size: 0.7rem; color: #666666;}
  div.transaction_page div.information p span{font-size: 0.7rem; color: #ff3737;}
  div.transaction_page div.information p span.clro{ color: #333333;}
  div.transaction_page div.information p span.clrt{ color: #666666;}
  div.transaction_page div.content{background-color: #fff; }
  div.transaction_page div.content div{padding: 0.75rem 0.75rem; border-bottom: 0.025rem solid #e3e5e9;}
  div.transaction_page div.content div label{font-size: 0.7rem; color: #666666;}
  div.transaction_page div.content div span{font-size: 0.7rem;  color: #ff3737;}
  div.transaction_page div.content div input{font-size: 0.7rem;  color: #333; border: none; }
  div.transaction_page div.content div i{font-size: 0.7rem;  color: #333333; }
  div.transaction_page div.cos{margin: 0.75rem 0.75rem 2.5rem 0.75rem;}
  div.transaction_page div.cos button{ width:100%; padding:0.75rem 0rem; background-color: #ff3737; color: #fff; text-align: center; font-size:0.7rem; border: none; border-radius: 0.1rem;}


</style>
