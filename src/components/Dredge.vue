<template>
  <div class="open_j_pay">
    <div class="Input_content">
      <div class="box">
        <div class="dimg shop"></div>
        <input type="text" v-model="name" placeholder="输入您的店铺名称（选填） " />
      </div>
      <div class="box">
        <div class="dimg mobile_phone"></div>
        <input type="tel" v-model="model"  placeholder="请输入推荐人手机号（必填）" />
      </div>
    </div>
    <div class="agreement">
      <input type="checkbox" checked="true" ref="checkbox"><a href="#/jpay/protocol" >同意J-Pay增值业务协议</a>
    </div>
    <div class="cos">
      <button @click="goDredge">立即开通</button>
    </div>
  </div>
</template>

<script>
  import { Indicator,Toast } from 'mint-ui';
  import axios from 'axios';
  import qs from 'qs';
  export default{
    name: 'Dredge',
    data() {
      return {
        model:"",
        name:''
      }
    },
    methods: {
      goDredge(){
        var token = localStorage.getItem("token");
        if(!this.$refs.checkbox.checked){
          Toast('请同意J-Pay增值业务协议')
          return
        }
        if(!(/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/.test(this.model))){
          Toast('请填写正确手机号码')
          return
        }
        Indicator.open()
        axios.post(BASE_URL+'/index.php?r=Apitransaction/Registerjp',qs.stringify({
          token:token,
          isaggree:1,
          refferphone:this.model,
          shopname:this.name
        })).then(function(res){
          Indicator.close()
          var a=Base64.decode(res.data)
          a=JSON.parse(a)
          Toast(a.info)
          if(a.code==10000){
            window.location.href='#/jpay/pay'
          }
        }).catch(function(err){
          Indicator.close()
        });
      }
    },
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
  div.open_j_pay{}
  div.open_j_pay div.Input_content div{ padding: 0.75rem 0.75rem ; zoom: 1; background-color: #fff;}
  div.open_j_pay div.Input_content div.box{ border-bottom:0.025rem solid #e3e5e9;}
  div.open_j_pay div.Input_content div:after{content: ""; display: block; height: 0; clear: both;}
  div.open_j_pay div.Input_content div div.dimg{ width:0.925rem; height: 1.025rem; float: left;background-repeat:no-repeat ; background-size: 100% 100%; }
  div.open_j_pay div.Input_content div input{ border: none;}
  div.open_j_pay div.Input_content div div.shop{  background: url(../assets/images/j-pay-img/shop.png) no-repeat  center;
    -webkit-background-size: 1rem 1.1rem;
    background-size: 1rem 1.1rem;}
  div.open_j_pay div.Input_content div div.mobile_phone{  background: url( ../assets/images/j-pay-img/mobile_phone.png) no-repeat  center;-webkit-background-size: 1rem 1.1rem;
    background-size: 1rem 1.1rem;}
  div.open_j_pay div.Input_content div input{ font-size: 0.7rem; margin-left: 1rem;width: 13rem;line-height: 1.5rem}
  div.open_j_pay div.agreement{ width: 17rem; margin: 0.75rem auto; }
  div.open_j_pay div.agreement input{ width:1.125rem; height: 1.125rem; margin-right: 0.75rem;}
  div.open_j_pay div.agreement a{color: #666666; font-size: 0.7rem;}
  div.open_j_pay div.cos{margin: 0.75rem 0.75rem 2.5rem 0.75rem;}
  div.open_j_pay div.cos button{ width:100%; padding:0.75rem 0rem; background-color: #ff3737; color: #fff; text-align: center; font-size:0.7rem; border: none; border-radius: 0.1rem;}

</style>
