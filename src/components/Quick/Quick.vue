<template>
  <div class="amount_of_money">
    <div class="money_box">
      <p>请输入您本次交易金额（元）</p>
      <input type="number" v-model="money" placeholder="0.00"  />
    </div>
    <div class="channel">
      <div class="cbox" v-for="item in channel" >
        <p class="pcbox1">{{item.jpayname+' , '+item.jpaystatusType}} </p>
        <p class="pcbox2">费率：{{item.jpayrate}}%+{{item.jpayratemoney}}元   &nbsp;&nbsp;交易时间：{{item.opentime}}</p>
        <p class="pcbox3">额度：单笔最高{{item.jpaymaxmoney}}，单卡单日最高{{item.daymaxmoney}},</br>起刷{{item.jpayminmoney}}<span @click="islook">查看支持银行</span></p>
        <hr/>
        <p class="pcbox4"><label>实际到账金额：</label><span>{{getmoney(item.jpayrate,item.jpayratemoney)}}</span>
        <button :class="money - item.jpayminmoney>=0 && money-item.jpaymaxmoney<=0 && item.open==1 && item.flopen?'':'bc'" @click="gopay(item.jpayminmoney,item.jpaymaxmoney,item.id,getmoney(item.jpayrate,item.jpayratemoney),item.open,item.flopen)">立即支付</button></p>
      </div>
      <!--<div class="cbox cboxs">-->
        <!--<p class="pcbox1">快捷大额支付A，D0交易     D0</p>-->
        <!--<p class="pcbox2">费率：0.44%+2元      交易时间：8:00-20:00</p>-->
        <!--<p class="pcbox3">额度：单笔最高29999，单卡单日最高50000</br>5000起刷</p>-->
        <!--<hr/>-->
        <!--<p class="pcbox4"><label>实际到账金额：</label><span class="sc">4976.00</span><button class="bc">立即支付</button></p>-->
      <!--</div>-->
    </div>
    <div class='cardlist' v-if="showcard" @click="islook">

    </div>
     <div class='allcard' v-if="showcard" >
       <div>
         <p>该通道支持银行</p>
         <img src="../../assets/images/jpay/12.png" alt="">
         <button @click="islook">我知道了</button>
       </div>

      </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import qs from 'qs';
  import {MessageBox,Toast,Indicator} from 'mint-ui'
  export default{
    name: 'Quick',
    data() {
      return {
        channel:[],
        money:'',
        showcard:false
      }
    },
    computed:{


    },
    methods: {
      islook(){
        this.showcard=!this.showcard
      },
      getmoney( jpayrate,jpayratemoney){
        var len1 = this.money.substr(0,1);
        var len2 = this.money.substr(1,1);
        if(this.money.length > 1 && len1==0 && len2 != '.'){
          this.money= this.money.substr(1,1);
        }
        //第一位不能是.
        if(len1=='.'){
          this.money = '0'+this.money;
        }

          if(/[-@#\$%\^&\*]+/g.test(len1)){
            this.money= "0.00"
          }

        //只能输1个小数点
        if(this.money.indexOf(".")!=-1){
          var str_=this.money.substr(this.money.indexOf(".")+1);
          //限制只能输入一个小数点
          if(str_.indexOf(".")!=-1){
            this.money=this.money.substr(0,this.money.indexOf(".")+str_.indexOf(".")+1);
          }else{
            if(str_.length>2){
              this.money=this.money.substr(0,this.money.indexOf(".")+3)
            }
          }
        }
        if(this.money==0){
          get=0.00
          return get.toFixed(2)
        }
        var get = (this.money -Math.round(this.money *jpayrate +jpayratemoney *100)/100)
        if(get < 0){
          get = 0.00

        }
        if(isNaN(this.money)){
          return '0.00'
        }
        return get.toFixed(2)
      },

      gopay(jpayminmoney,jpaymaxmoney,channelId,actualPay,open,flopen){
        if(open!='1'){
          // Toast('该通道暂时不能使用')
          return
        }
        if(!flopen){
          // Toast('该通道暂时不能使用')
          return
        }
        if( this.money.indexOf('.')==-1){
          this.money =this.money+'.00'
        }
          var num1= this.money.split('.')[0]
          var num2= this.money.split('.')[1]
          if(/^\d{1,2}[0]{3}$/g.test(num1)&&(/^[0]{2}/.test(num2))){
              Toast('金额不能为整数')
              return
          }
          if(this.money - jpayminmoney>0 && this.money - jpaymaxmoney<0){
            Indicator.open()
            var token =localStorage.getItem('token')
            axios.post(BASE_URL+'/index.php?r=CardjPay/GoPay',qs.stringify({
              channelId:channelId,
              payMoney:this.money,
              token:token,
              actualPay:Math.round(actualPay*100),
            })).then(function(res){
              Indicator.close()
              var a =res.data
              a= JSON.parse(Base64.decode(a))
              if(a.code==10000){
                if(a.data.err==10000){
                  window.location.href='#/jpay/quick/select/'+a.data.data.orderid
                }else{
                  Toast(a.msg)
                }
              }else{
                Toast(a.info)
              }
            }).catch(function(err){

            })
          }
        }

    },
    mounted() {
      var token =localStorage.getItem('token')
      var that =this
      axios.post(BASE_URL+'/index.php?r=ChannelJpay/GetChannel',qs.stringify({
        token:token
      })).then(function(res){
        var a = Base64.decode(res.data)
        a=JSON.parse(a)
        if(a.code==10000){
          that.channel=a.data.data
        }else{
          Toase(a.info)
        }
      }).catch(function(err){

      })
      //验证商户信息
      axios.post(BASE_URL+'/index.php?r=CardjPay/CheckShop',qs.stringify({
        token:token
      })).then(function(res){
        var a = Base64.decode(res.data)
        a=JSON.parse(a)
        if(a.code==10000){

        }else{
          Toase(a.info)
        }
      }).catch(function(err){

      })

    },
    updated() {

    },
    activated() {

    },
    components: {}
  }
</script>

<style scoped lang="scss">
  .money_box{
      :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
          color: #fff; opacity:1;
      }

      ::-moz-placeholder { /* Mozilla Firefox 19+ */
          color: #fff;opacity:1;
      }

      input:-ms-input-placeholder{
          color: #fff;opacity:1;
      }

      input::-webkit-input-placeholder{
          color: #fff;opacity:1;
      }
      input[type=number]::-webkit-outer-spin-button {
              -webkit-appearance: none;
              appearance: none;
              margin: 0;
      }
  }
  div.amount_of_money div.money_box{ background-color: #fc3f3e; padding: 1.5rem 0.75rem 2.875rem 0.75rem; z-index: 1;}
  div.amount_of_money div.money_box p{ color: #fffefe; font-size: 0.65rem; margin-bottom:0.25rem;}
  div.amount_of_money div.money_box input{ border:none ; border-bottom: 0.025rem #ffb0b0 solid; padding: 0.5rem 0rem; color: #fffefe; font-size: 1.25rem; background-color: #fc3f3e;width:100%; font-weight: blod;}
  .channel{
    padding: 0 0.75rem;
    margin-top: -3rem; z-index: 1000;
  }
  div.channel  div.cbox{ height: 8.875rem; background-image:url(../../assets/images/j-pay-img/cbox.png); background-repeat: no-repeat; background-size: 100% 100%;    border-radius: 0.3rem; z-index: 1001;}
  div.channel div.cbox p{word-break:break-all; padding:0; width:14rem;padding-top:0.3rem;}
  div.channel div.cbox p.pcbox1{ margin: 1rem 0.85rem 0.1rem 0.85rem; font-size: 0.8rem; color: #333333; }
  div.channel div.cbox p.pcbox2{font-size:0.65rem;  color: #ff3737; margin: 0rem 0 0.325rem 0.85rem;}
  div.channel div.cbox p.pcbox3{font-size: 0.65rem; color: #999999; margin: 0rem 0.85rem 0.8rem 0.85rem; }
  div.channel div.cbox hr{ border: 0.025rem dashed #dddddd;  width:15.25rem;}
  div.channel div.cbox p.pcbox4{margin: 0.6rem 0.85rem 0.2rem 0.85rem; width:15.25rem; height: 1.75rem; line-height: 1.75rem;}
  div.channel div.cbox p.pcbox4:after{content: ""; display: block; height: 0; clear: both;}
  div.channel div.cbox p.pcbox4 label{ color: #666666; font-size: 0.65rem;}
  div.channel div.cbox p.pcbox4 span{ color: #3cb034; font-size: 0.65rem; font-weight: bold;}
  div.channel div.cbox p.pcbox4 span.sc{ color: #999999;}
  div.channel div.cbox p.pcbox4 button{ border: none; width:4.5rem; height: 1.75rem; line-height: 1.75rem; border-radius: 0.2rem; font-size: 0.65rem; border: 0.025rem solid #ff3737; text-align: center; background-color: #fff; color: #ff3737;  float: right;}
  div.channel div.cbox p.pcbox4 button.bc{border: 0.025rem solid #999999; color: #999999;}
  div.channel div.cboxs{top:15.5rem;}
  .pcbox3{
    position: relative;
    span{
      display:block;
      position:absolute;
      right:0;
      bottom: -0.5rem;
      font-size: 0.7rem;
      color: #6f7fff;
    }
  }
  .cardlist{
      width: 100%;
      height: 100%;
      background: #666666;
      opacity: 0.5;
      position: fixed;
      top: 0;
  }
  .allcard{
    width: 100%;
    margin: 0 auto;
    position: fixed;
    top: 4.5rem;
    padding: 1rem 0;
    div{
      display: block;
      width: 80%;
      margin: 0 auto;
      background: #fff;
      padding-bottom: 0.75rem;
      border-radius: 4px;
      img{
        width: 100%;
        margin: 0 auto;
      }
      p{
        font-size: 1rem;
        color: #333;
        border-bottom:1px solid #eee;
        /*font-weight: bold;*/
        text-align: center;
        line-height: 3rem;
      }
      button{
        background: #ff3737;
        color: #fff;
        font-size: .7rem;
        width: 90%;
        border: none;
        display: block;
        margin: 0 auto;
        margin-top: 1rem;
        line-height: 2rem;
        border-radius: 4px;
      }
    }

  }
</style>
