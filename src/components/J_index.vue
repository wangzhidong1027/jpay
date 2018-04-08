<template>
  <div class="J_index">
    <div class="jpay">
        <div @click="quickPay">
          <i><img src="../assets/images/jpay/kuaijie.png" alt=""></i>
          <p>快捷付</p>
        </div>
        <div @click="scanCode">
          <i><img src="../assets/images/jpay/saoma.png" alt=""></i>
          <p>扫码付</p>
        </div>
    </div>
    <div class="go_re">
      <a @click="goresister">
        <img src="../assets/images/jbanner.jpg" alt="">
      </a>
    </div>
    <jpay-tab :selectedpage=" '首页' " v-if="isregister"></jpay-tab>
  </div>
</template>

<script>
  import JpayTab from './JpayTab'
  import {MessageBox,Toast,Indicator} from 'mint-ui'
  import Aimg from '../assets/images/jpay/exploiting.png'
  import axios from 'axios';
  import qs from 'qs';

  export default{
    name: 'J_index',
    data() {
      return {
        aimg:'',
        isregister:false,
        nocard:2
      }
    },
    methods: {
      quickPay(){
       if(this.isregister==false){
        window.location.href='#/jpay/dredge'
         return
       }
       if(this.nocard!=1){
          if(this.nocard==0){
            Toast('您的提交正在审核中，请耐心等待')
            return
          }else{
            if(this.nocard == -1) {
              Toast('您的提交审核失败，请再次提交')
            }
            MessageBox.confirm(
              "<p style='font-size: 0.7rem;line-height: 1rem;'>为了保障您可以完整的使用”J-Pay“所有功能请先进行储蓄卡绑定（位置：我的-我的储蓄卡）如您未绑定银行卡会导致部分功能受限,谢谢</p>",
              "开始使用",{
                cancelButtonText:'在看看',
                confirmButtonText:'去绑定',
                confirmButtonClass:'gocard'
              }).then(action => {
              this.$router.push("/jpay/main/realname")
            }).catch(err => {

            });
            return
          }
        }else{
          this.$router.push("/jpay/quick")
        }
      },
      scanCode(){
        var that =this
        if(this.isregister==false){
          window.location.href='#/jpay/dredge'
          return
        }
        MessageBox({
          title:"" ,
          message:'<img style="width: 4rem" src='+that.aimg +'><p style="color: #333;line-height: 3rem;">服务暂未开通</p> '
        })
      },
      goresister(){
        if(this.isregister==false){
          window.location.href='#/jpay/dredge'
          return
        }else{
          Toast('您已开通服务')
        }
      }
    },
    mounted() {
      Indicator.open()
      this.aimg = Aimg
      var that =this
      var token =localStorage.getItem('token')
      axios.post(BASE_URL+'/index.php?r=CardjPay/CheckShop',qs.stringify({
        token:token
      })).then(function(res){
        Indicator.close()
        var a = Base64.decode(res.data)
        a=JSON.parse(a)
        if(a.code==10000){
          that.isregister=true
          if(a.data.err==10000){
            that.nocard=a.data.data.jpaystatus
          }
        }else{
          if(a.code!=10009){
            that.isregister=true
          }
        }
      }).catch(function(err){
        Indicator.close()
      })
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

<style  lang="scss">
  .J_index{
    width: 100%;
    height: 100%;
    .jpay{
      width: 100%;
      display:flex;
      justify-content: space-around;
      height: 5rem;
      margin-bottom: 0.75rem;
      div{
        width: 50%;
        display: flex;
        flex-direction: column;
        text-align: center;
        background: #fff;
        border-bottom: 1px solid #ddd;

        img{
          width: 1.8rem;
          margin: 1.1rem 0 0.5rem 0;
        }
        p{
          font-size: 0.65rem;
          color: #333333;
        }
      }
      div:nth-of-type(1){
        border-right:1px solid #ddd;
      }
    }
    .go_re{
      img{
        width: 100%;
      }
    }
    .mint-msgbox-message{
      font-size: 0.9rem;
    }
  }

</style>
