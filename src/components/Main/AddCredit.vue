<template>
  <div class="addcredit">
    <div class="creditcard">
      <p><span>信用卡卡号：</span><input type="tel" placeholder="请输入信用卡卡号" v-model="bank" @blur="changeCount"></p>
      <p><span>预留手机号：</span><input type="tel" placeholder="请输入预留手机号" v-model="mobile"></p>
      <p><span>有效期：</span><i class="data" v-text="date" @click="selectDate" ></i></p>
      <p><span>CVV2码：</span><input type="tel" placeholder="CVV2码" v-model="cvv"><b @click="explain">说明</b></p>
    </div>
    <p class="info">提示：请输入正确的信用卡信息，错误的信息导致支付失败</p>
    <div class="btn">
      <p  @click="getmsgcode">提交</p>
      <!--<p >提交</p>-->
    </div>
    <div class="cvv" v-if="showcvv2">
      <div class="CVVpic">
        <img src="../../assets/images/jpay/cvvcode.png" alt="">
      </div>
      <p class="text">CVV2码为银行卡背面如图所示位置末位三位</p>
      <p class="butto" @click="explain">确定</p>
    </div>
    <div class="verifications" v-if="showver">
    	<p class="title">请输入验证码</p>
    	<div class="box clear" @click="gain">
        <span class="number" v-text="msgcode[0]"></span>
        <span class="number" v-text="msgcode[1]"></span>
        <span class="number" v-text="msgcode[2]"></span>
        <span class="number" v-text="msgcode[3]"></span>
        <span class="number" v-text="msgcode[4]"></span>
        <span class="number" v-text="msgcode[5]"></span>
    		<!--<input type="number" value="" >-->
    		<!--<input type="number" value="" >-->
    		<!--<input type="number" value="" >-->
    		<!--<input type="number" value="" >-->
    		<!--<input type="number" value="" >-->
    		<!--<input type="number" value="">-->
    	</div>
      <p class="text"><input type="tel" ref="msgcode" v-model="msgcode" @keyup="test"></p>
    	<p class="tips">提示:若无法获取验证码，请稍后再试！</p>
    	<p class="button" @click="sub">确定</p>
    </div>
    <div class="zhezhao" v-if="showcvv2"></div>
    <div class="vzhezhao" v-if="showver"></div>
    <mt-datetime-picker
      ref="picker"
      type="date"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      :startDate="new Date('1990-01-01')"
      :endDate="new Date('2070-12-31')"
      @confirm="handleConfirm">
    </mt-datetime-picker>
  </div>
</template>

<script>
  import {MessageBox} from 'mint-ui'
  import {Toast} from 'mint-ui'
  import { DatetimePicker } from 'mint-ui';
  import axios from "axios";
  import qs from "qs";
  import { Indicator } from "mint-ui";

  export default{
    name: 'AddCredit',
    data() {
      return {
        date:'请选择有效期号',
        showcvv2:false,
        showver:false,
        bank:'',//银行
        mobile:'',//手机号
        time:'',//有效期
        cvv:'',//cvv2
        format:'',//有效期对应
        verification:'',//获取银行卡信息
        msgcode:'',
        smsSeq:'',
        orderNo:''
        //verificationid:''
      }
    },
    methods: {
      selectDate(){
        this.$refs.picker.open();
      },
      handleConfirm(date){
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        this.date = y + '-' + m + '-' + d;
        this.format =this.date
      },
      explain(){
        this.showcvv2 = !this.showcvv2
      },
			vheck(){
				this.showver=!this.showver
			},
      changeCount(){
        var token = localStorage.getItem("token");
        var that=this
        axios.post(BASE_URL+'/index.php?r=CardjPay/CheckCard',qs.stringify({
          token:token,
          type:'2',
          cardNo:that.bank
        }))
          .then(function (res) {
            var edoc = Base64.decode(res.data)
            edoc = JSON.parse(edoc)
            if(edoc.code==10000){
              if(edoc.data.err==10000){
                that.verification=edoc.data.data.id
              }else{
                Toast(edoc.data.msg)
                that.verification=''
              }
            }else{
              MessageBox.alert(edoc.info, '提示');

              that.verification=''
            }

          })
          .catch(function (err) {
          });
      },
      getmsgcode(){
        if(this.bank==''){
          MessageBox.alert('请填写正确银行号码', '提示');
          this.bank = ""
          return
        }
        if((!(/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/.test(this.mobile)))&&(this.mobile=='')){
          MessageBox.alert('请填写正确手机号码', '提示');
          this.mobile = ""
          return
        }
        if(this.date!=this.format ) {
          MessageBox.alert('请选择有效期日期', '提示');
          this.date = ""
          return
        }
        if((!(/^\d{3}$/.test(this.cvv)))&&(this.cvv=='')){
          MessageBox.alert('请填写正确cvv2码', '提示');
          this.cvv = ""
          return
        }
        var that =this
        Indicator.open()
        var token = localStorage.getItem("token");
        axios.post(BASE_URL+'/index.php?r=CardjPay/Addcreditcard',qs.stringify({
          token:token,
          cardnum:that.bank,
          bank:that.verification,
          cvv2:that.cvv,
          period:that.date,
          phone:that.mobile,
        })) .then(function (res) {
          Indicator.close()
          var a=Base64.decode(res.data)
          a=JSON.parse(a)
          if(a.code==10000){
                window.history.back(-1);
                 Toast('信用卡添加成功')
                // that.showver=true
                // that.smsSeq=a.data.data.smsSeq
                // that.orderNo=a.data.data.orderNo
          }else{
            MessageBox.alert(a.info, '提示');
          }
        }).catch(function (err) {

        });

      },
      gain(){
        var input = this.$refs.msgcode
        input.focus()
      },
      test(){
        if(!(/^[0-9]\d{0,5}$/.test(this.msgcode)) ){
          this.msgcode= this.msgcode.substring(0,this.msgcode.length-1)
        }else{
          if(this.msgcode.length==6){
            this.$refs.msgcode.blur()
          }
        }
      },
      sub(){
        var token = localStorage.getItem("token");
        var that=this
        if(this.bank==''){
          Toast('请填写正确银行号码')
          this.showver=false
          this.bank = ""
          return
        } else if((!(/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/.test(this.mobile)))&&(this.mobile=='')){
          Toast('请填写正确手机号码')
          this.showver=false
          this.mobile = ""
          return
        }else if(this.date!=this.format ) {
          this.showver=false
          Toast('请选择有效期日期')
          this.date = ""
          return
        }else if((!(/^\d{3}$/.test(this.cvv)))&&(this.cvv=='')){
          this.showver=false
          Toast('请填写正确cvv2码')
          this.cvv = ""
          return
        }else if(!(/^[0-9]\d{5}$/.test(this.msgcode))){
          Toast('请填写正确验证码')
          return
        }else{
          Indicator.open()
        	this.showver=!this.showver
          axios.post(BASE_URL+'/index.php?r=CardjPay/ConfirmAddcreditcard',qs.stringify({
            token:token,
            phone:that.mobile,
            period:that.date,
            cvv2:that.cvv,
            cardnum:that.bank,
            bank:that.verification,
            smsSeq:that.smsSeq,
            orderNo:that.orderNo,
            authCode:that.msgcode
          }))
            .then(function (res) {
              Indicator.close()
              var edoc = Base64.decode(res.data)
              edoc = JSON.parse(edoc)
              if(edoc.code==10000){
                window.history.back(-1);
                Toast('信用卡添加成功')
              }else{
                Toast(edoc.info)
              }
            })
            .catch(function (err) {

            });
        }
      },

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
  .addcredit{
    width: 100%;
    height: 100%;
    .info{
      color: #ff3737;
      font-size: 0.7rem;
      padding: 0 0.75rem;
    }
    .creditcard{
      background: #fff;
      margin-bottom: 0.75rem;
      p{
        padding: 0 0.75rem;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #eee;
        input{
          flex: 1;
          border: none;
          font-size: 0.7rem;
          color: #666;
        }
        span{
          font-size: 0.7rem;
          line-height: 2.45rem;
        }
        b{
          font-size: 0.7rem;
          line-height: 2.45rem;
          font-weight: normal;
          color: #ff3737;
          padding-left: 1rem;
        }
        i{
          font-style: normal;
          font-weight: normal;
          line-height: 2.45rem;
          flex: 1;
          font-size: 0.7rem;
          color: #666;
        }
      }

    }
    .btn{
      padding: 0.75rem;
      p{
        background: #ff3737;
        color: #fff;
        text-align: center;
        line-height: 2.45rem;
        font-size: 0.8rem;
        border-radius: 4px;
      }
    }
    .zhezhao{
      width: 100%;
      height: 100%;
      background: #000;
      position: fixed;
      top: 0;
      left: 0;
      opacity:0.6;
    }
    .vzhezhao{
    	width: 100%;
      height: 100%;
      background: #000;
      position: fixed;
      top: 0;
      left: 0;
      opacity:0.6;
    }
    .cvv{
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      height:12.5rem;
      position: fixed;
      top: 50%;
      background: #fff;
      z-index: 111;
      margin:0 1rem;
      margin-top: -7rem;
      img{
        width: 100%;
        height: 100%;
      }
      .CVVpic{
        padding: 1.8rem 3.4rem;
        padding-bottom: 0;
      }
      .text{
        font-size: 0.7rem;
        text-align: center;
        color:#666;
        line-height: 2.5rem;
      }
      .butto{
        width: 100%;
        background: #ff3737;
        text-align: center;
        color: #fff;
        font-size: 0.9rem;
        line-height: 2.45rem;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
    .verifications{
    	-webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      position: fixed;
      top: 50%;
      left: 50%;
      width:15.75rem;
      margin-left:-7.875rem ;
      background: #fff;
      z-index: 111;
      margin-top: -7rem;
    	padding-top: 1.5rem;
    	.title{
    		font-size: 0.8rem;
    		color: #333;
    		text-align: center;
    		margin-bottom: 1.125rem;
    	}
    	.box{
    		margin: 0rem 1.75rem;
    		border-right: none;
    		.number{
    			width:2.038rem;
    			height: 1.94rem;
    			text-align: center;
    			color: #333;
          line-height: 2.0rem;
          font-size: 0.9rem;
    			float: left;
    			border:0.025rem solid #000000;
          border-left: none;
    		}

        :nth-child(1){
          border-left:0.025rem solid #000000;
        }
    		.clear{
    			clear: both;
    		}
    	}
      .text{
        height: 0;
        border: none;
        overflow: hidden;
      }
    	.tips{
    		margin-top: 0.625rem;
    		font-size: 0.55rem;
    		color: #999999;
    		text-align: center;
    	}
    	.button{
    		border-top: 0.025rem #eeeeee solid;
    		padding: 0.625rem 0rem 1.25rem 0rem;
    		border-radius:0 0 4px 4px;
    		font-size: 0.85rem;
    		text-align: center;
    		color: #ff3737;
    		margin-top: 1rem;
    	}
    }
  }



</style>
