<template>
  <div id="approver" v-if="show">
    <div class="header" >
      <div class="userinfo">
        <p><span>姓名：</span><b>{{information.cname}}</b></p>
        <p><span>电话：</span><b>{{information.mobile}}</b></p>
        <p><span>身份证：</span><b>{{information.idCardNo}}</b></p>
        <p><span>储蓄卡号：</span><b>{{information.cashcardNO}}</b></p>
        <p><span>开卡网点：</span><b>{{information.bankName}}</b></p>
      </div>
      <div class="inform">您的实名认证已审核通过，为了保护您的隐私，我们已 经将您的照片做了加密处理。</div>
    </div>
    <div class="mypic">
      <h5>身份证照片</h5>
      <div class="pic">
        <div class="one"><p>加密</p><h6>身份证正面</h6></div>
        <div class="one"><p>加密</p><h6>身份证正面</h6></div>
      </div>
    </div>
    <div class="mypic">
      <h5>营业执照</h5>
      <div class="pic">
        <div class="one permission"><p>加密</p><h6>营业执照正面</h6></div>
      </div>
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
    name: 'Approver',
    data() {
      return {
        information:' ',
        show:false
      }
    },
    methods: {},
    mounted() {
      var that =this;
      var token=localStorage.getItem('token')
      axios.post(BASE_URL+'/index.php?r=CardjPay/UserCardId',qs.stringify({
        token:token
      }))
        .then(function (res) {
          var edoc = Base64.decode(res.data)
          edoc = JSON.parse(edoc)
          if(edoc.code==10000){
            that.information=edoc.data.data
            that.show=true
          }else{
            if (edoc.code==10008) {
              Toast('您还未绑定储蓄卡')
              window.location='#/jpay/main'
            }else{
              Toast(edoc.info)
            }
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
  #approver{
    width: 100%;
    .header{
      padding: 0.75rem;
      .userinfo{
        background: #fff;
        border-radius: 4px;
        padding: 0.75rem;
        font-size: 0.7rem;
        line-height: 1.3rem;
        /*box-shadow: 0px 0px 10px rgba(#999,0.6);*/
        p{
          span{
            color: #999999;
          }
          b{
            color: #333333;
            font-weight: normal;
          }
        }
      }
      .inform{
        font-size:0.7rem;
        color: #ff3c37;
        padding: 0.75rem 0;
      }
    }
    .mypic{
      padding:0.75rem;
      background: #fff;
      border-bottom: 1px solid #eee;
      h5{
        font-size: 0.6rem;
        line-height: 1.75rem;
        border-bottom: 1px solid #eee;
      }
      .pic{
        display: flex;
        justify-content: center;
        padding-top: 0.75rem;
        .one{
          margin: 0 0.6rem;
        }
        p{
          width: 6.25rem;
          height: 6.25rem;
          background: #b2b2b2;
          text-align: center;
          line-height: 6.25rem;
          font-size: 0.8rem;
          color: #fff;
          font-weight: bold;
          opacity: 0.6;
        }
        .permission{
          margin-left: -6.25rem;
        }
        h6{
          text-align: center;
          font-weight: normal;
          line-height: 1.75rem;
          color: #999;
        }
      }
    }
  }
</style>
