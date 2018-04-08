<template>
  <div class="dtitle">
    <div class="dtitles">
      <span>请绑定持卡人本人的银行卡</span>
    </div>
    <div class="list">
      <ul >
        <li><label><i>*</i>银行卡号：</label><input v-model="cardNo" type=" tel" placeholder="请输入银行卡号 " @blur="verifycard"></li>
        <li><label><i>*</i>银行名称：</label><b v-text="cardname"></b></li>
        <li><label><i>*</i>银行预留手机号：</label><input v-model="phone" type=" tel" placeholder="请输入银行预留手机号 "></li>
        <li><label><i>*</i>开户行所在省：</label><input v-model="province" type=" text" placeholder="请输入您的开户行省份 "></li>
        <li><label><i>*</i>开户行所在市：</label><input v-model="city" type=" text" placeholder="请输入您的开户行城市 "></li>
        <li><label><i>*</i>开户行所在区：</label><input v-model="county" type=" text" placeholder="请输入您的开户行区县 "></li>
        <li><label><i>*</i>开户行名称：</label><input v-model="bankstreet" type=" text" placeholder="请输入您的开户行名称 "></li>
      </ul>
    </div>
    <div class="prompt">
      <span>特别提示：联系银行客服，请填写正确的开户行名称。</span>
    </div>
    <div class="list">
      <ul >
        <li><label><i>*</i>店铺名称：</label><input v-model="storename" type=" text" placeholder="显示开通服务时填写的名称 "></li>
      </ul>

       <ul v-if="ai">
        <p class='card'>请您手动输入身份证信息</p>
        <li><label><i>*</i>姓名：</label><input v-model="cardInfo.cname" type="text" placeholder="请输入姓名" ></li>
        <li><label><i>*</i>身份证号码：</label><input v-model="cardInfo.idCardNo" type="tel" placeholder="请输入身份证号码" ></li>
        <li><label><i>*</i>证件有效期开始日期：</label><input v-model="cardInfo.startdate" type="tel" placeholder="201800101 "></li>
        <li><label><i>*</i>证件有效期结束日期：</label><input v-model="cardInfo.enddate" type="tel" placeholder="20181231 "></li>
      </ul>
    </div>
    <div class="upload">
      <div class="upload">
        <form id="amig" enctype="multipart/form-data">
          <div class="dimg just" @click="uppimg('persenImg1')">
          <a v-if='!idcardsrc'> </a>
            <img v-if='idcardsrc' :src="idcardsrc"  alt="">
            <input  type="file" id="persenImg1" ref="persenImg" accept="image/*"
                   @change="inputup($event,'persenImg')" name="persenImg">
            <!--<input type="file" accept="image/*" capture="camera">-->
          <!--<input type="file" accept="video/*" capture="camcorder">-->
          <!--<input type="file" accept="audio/*" capture="microphone">-->
        </div>
        <div class="dimg back"  @click="uppimg('persenImgback')" >
          <a v-if='!backimg'></a>
          <img v-if='backimg' :src="backimg" alt="">
          <input type="file" id="persenImgback" ref="persenImgback" accept="image/*" @change="inputup($event,'persenImgback')">
        </div>
        <div class="dimg hic"  @click="uppimg('persentake')" >
          <a v-if='!persentake'></a>
          <img v-if='persentake' :src="persentake" alt="">
          <input type="file" id="persentake" ref="persentake" accept="image/*" @change="ImgBase64($event,'persentake')">
        </div>
        <div class="dimg business_license"  @click="uppimg('trading')">
          <a v-if='!trading'></a>
          <img v-if='trading' :src="trading" alt="">
          <input type="file" id="trading" ref="trading" accept="image/*" @change="ImgBase64($event,'trading')">
        </div>
        </form>
      </div>
    </div>
    <div class="cos">
      <button @click="gosubmit">确认提交</button>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import qs from "qs";
  import {Indicator, Toast} from "mint-ui";
  import {MessageBox} from 'mint-ui'
  export default{
    name: 'Realname',
    data() {
      return {
        idcardsrc: '',//身份证正面
        cardInfo: {idCardNo:'',cname:'',startdate:'',enddate:''},//身份证信息
        backimg:'',//身份证反面
        persentake:'',//手持身份证
        trading:'',//营业执照
        cardNo:'',
        cardname:'',
        cashcardtype:'',
        phone:'',
        province:'',
        city:'',
        county:'',
        bankstreet:'',
        storename:'',
        towrenzhneg:false,
        ai:false
      }
    },
    methods: {
      gosubmit(){
        if(!this.cashcardtype){
          Toast('请填写银行卡号信息')
          return
        }
        if(!(/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/.test(this.phone))){
          Toast('请填写正确手机号码')
          return
        }
        if(!this.province|| !this.city|| !this.county || !this.bankstreet){
          Toast('请填写完整开户行信息')
          return
        }
        if(!this.persentake ){
          Toast('请填上传认证图片')
          return
        }
        Indicator.open()
        if(this.towrenzhneg){
            this.twice()
        }else{
          var token=localStorage.getItem("token");
          axios.post(BASE_URL + '/index.php?r=CardjPay/bindCashCard', qs.stringify({
            token: token,
            cashcardNO:this.cardNo,
            cashcardtype:this.cashcardtype,
            mobile:this.phone,
            province:this.province,
            city:this.city,
            county:this.county,
            bankName:this.bankstreet,
            idCardNo:this.cardInfo.idCardNo,
            cname:this.cardInfo.cname,
            startdate:this.cardInfo.startdate,
            enddate:this.cardInfo.enddate,
            Cardposimage:this.idcardsrc,
            Cardrevimage:this.backimg,
            idCardimage:this.persentake,
            busilicensimage:this.trading,
            busilicensname: this.storename
          })).then(function (res) {
            Indicator.close()
            var a=Base64.decode(res.data)
            a=JSON.parse(a)
            if (a.code==10000) {
                MessageBox.alert( '我们将在1-2个工作日内进行审核请耐心等待',"提交资料成功").then(action => {
                  window.location.href = "#/jpay/jpay"
                })
            }else{
              Toast(a.info)
            }
          }).catch(function (err) {
          });
        }
      },
      verifycard(){
        var token = localStorage.getItem("token");
        var _this =this
        axios.post(BASE_URL + '/index.php?r=CardjPay/CheckCard', qs.stringify({
          type: '1',
          cardNo: this.cardNo,
          token:token
        })).then(function (res) {
          var a=Base64.decode(res.data)
          a=JSON.parse(a)
          if(a.code==10000){
            if(a.data.err==10000){
              _this.cardname=a.data.data.bankName
              _this.cashcardtype=a.data.data.id
            }else{
              Toast('卡号识别失败，请再次输入银行卡号')
            }
          }
          var a = Base64.decode(res.data)
        }).catch(function (err) {
        });
      },
      uppimg(Dom){
        var img=document.getElementById(Dom)
        img.click()
      },
      ImgBase64(e, type) {
        let tag = e.target;
        let fileList = tag.files;
        let imgNum = fileList.length;
        let _this = this;
        var _type = type
        if(!fileList.length){
            return
        }
        Indicator.open('身份上传认证中')
        var Orientation = null
        EXIF.getData(fileList[0], function () {
          Orientation = EXIF.getTag(fileList[0], 'Orientation');
        });
        let reader = new FileReader();
        reader.readAsDataURL(fileList[0]);
        reader.onload = function (e) {
          var image = new Image();
          image.src = e.target.result;
          image.onload = function () {
            var expectWidth = image.naturalWidth;
            var expectHeight = image.naturalHeight;
            // if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 800) {
            //   expectWidth = 800;
            //   expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
            // } else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 1200) {
            //   expectHeight = 1200;
            //   expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
            // }
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            canvas.width = expectWidth;
            canvas.height = expectHeight;
            ctx.drawImage(this, 0, 0, expectWidth, expectHeight);
            var base64 = null;
            if(canvas.width<=canvas.height){
                _this.rotateImg(this, 'right', canvas);
            }
            // 修复ios上传图片的时候 被旋转的问题
            // if (Orientation != "" && Orientation != 1) {
            //   switch (Orientation) {
            //     case 6://需要顺时针（向左）90度旋转
            //       _this.rotateImg(this, 'left', canvas);
            //       break;
            //     case 8://需要逆时针（向右）90度旋转
            //       _this.rotateImg(this, 'right', canvas);
            //       break;
            //     case 3://需要180度旋转
            //       _this.rotateImg(this, 'right', canvas);//转两次
            //       _this.rotateImg(this, 'right', canvas);
            //       break;
            //   }
            // }
            base64 = canvas.toDataURL("image/jpeg", 1);
            // _this.idcardsrc=base64
            _this.upimg(base64,_type,_this)
          }
        }
      },
      inputup(e,dom){
          Indicator.open()
          var _this = this
          var data  = new FormData();
          var file = ''
          if(dom=='persenImg'){
            file = this.$refs.persenImg.files[0]
          }else{
            file = this.$refs.persenImgback.files[0]
          }
          var reader = new FileReader();
          reader.onload = function () {
            var result = this.result;    //data:base64
            var base64=result
            var token = localStorage.getItem("token");
            // axios.post(BASE_URL + '/index.php?r=CardjPay/checkIdCard', qs.stringify({
            //   token: token,
            //   type: 'face',
            //   cardImg: base64
            // })).then(function (res) {
            //   Indicator.close()
            //   console.log(res)
            //   var a = Base64.decode(res.data)
            //   a = JSON.parse(a)
            //   if (a.code==10000&&a.data.err == "10000") {
            //     _this.cardInfo.idCardNo = a.data.data.idCardNo
            //     _this.cardInfo.cname = a.data.data.cname
            //     _this.idcardsrc = a.data.data.cardImg
            //   } else {
            //     Toast(a.info)
            //   }
            // }).catch(function (err) {
            //   Indicator.close()
            // });
            _this.upimg(base64,dom)
          }
          reader.readAsDataURL(file);
      },
      rotateImg(img, direction,canvas) {//图片旋转
        var min_step = 0;
        var max_step = 3;
        if (img == null)return;
        var height = img.height;
        var width = img.width;
        var step = 2;
        if (step == null) {
          step = min_step;
        }
        if (direction == 'right') {
          step++;
          step > max_step && (step = min_step);
        } else {
          step--;
          step < min_step && (step = max_step);
        }
        var degree = step * 90 * Math.PI / 180;
        var ctx = canvas.getContext('2d');
        switch (step) {
          case 0:
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0);
            break;
          case 1:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, 0, -height);
            break;
          case 2:
            canvas.width = width;
            canvas.height = height;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, -height);
            break;
          case 3:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, 0);
            break;
        }
      },
      upimg(imgsrc, category) {
         var  _this=this
        var token = localStorage.getItem("token");
        if (category == 'persenImg') {
          axios.post(BASE_URL + '/index.php?r=CardjPay/checkIdCard', qs.stringify({
            token: token,
            type: 'face',
            cardImg: imgsrc
          })).then(function (res) {
            Indicator.close()
            var a = Base64.decode(res.data)
            a = JSON.parse(a)
            if (a.code==10000&&a.data.err == "10000") {
              _this.cardInfo.idCardNo = a.data.data.idCardNo
              _this.cardInfo.cname = a.data.data.cname
              _this.idcardsrc = a.data.data.cardImg
            } else {
              _this.ai=true
              Toast(a.info)
            }
          }).catch(function (err) {
            Indicator.close()
          });
        }
        if(category == 'persenImgback'){
          axios.post(BASE_URL + '/index.php?r=CardjPay/checkIdCard', qs.stringify({
            token: token,
            type: 'back',
            cardImg: imgsrc
          })).then(function (res) {
            Indicator.close()
            var a = Base64.decode(res.data)
            a = JSON.parse(a)
              if (a.code==10000&&a.data.err == "10000") {
                _this.cardInfo.enddate = a.data.data.enddate
                _this.cardInfo.startdate = a.data.data.startdate
                _this.backimg=a.data.data.cardImg
              } else {
                _this.ai=true
                Toast(a.info)
              }
          }).catch(function (err) {
            Indicator.close()
          });
        }
        if(category == 'persentake'){
          axios.post(BASE_URL + '/index.php?r=Common/UploadImg', qs.stringify({
            fileImg: imgsrc,
            token:token
          })).then(function (res) {
            Indicator.close()
            var a = Base64.decode(res.data)
            a = JSON.parse(a)
            if (a.code==10000&&a.data.err == "10000") {
              _this.persentake=a.data.data.imgUrl
            } else {
              Toast(a.info)
            }
          }).catch(function (err) {
            Indicator.close()
          });
        }
        if(category == 'trading'){
          axios.post(BASE_URL + '/index.php?r=Common/UploadImg', qs.stringify({
            fileImg: imgsrc,
            token:token
          })).then(function (res) {
            Indicator.close()
            var a = Base64.decode(res.data)
            a = JSON.parse(a)
            Toast(a.info)
            if (a.code==10000&&a.data.err == "10000") {
              _this.trading=a.data.data.imgUrl
            }
          }).catch(function (err) {
             Indicator.close()
          });
        }
      },
      //二次认证
      twice(){
        var token=localStorage.getItem("token");
        axios.post(BASE_URL + '/index.php?=CardjPay/SecondCheck', qs.stringify({
          token: token,
          cashcardNO:this.cardNo,
          cashcardtype:this.cashcardtype,
          mobile:this.phone,
          province:this.province,
          city:this.city,
          county:this.county,
          bankName:this.bankstreet,
          idCardNo:this.cardInfo.idCardNo,
          cname:this.cardInfo.cname,
          startdate:this.cardInfo.startdate,
          enddate:this.cardInfo.enddate,
          Cardposimage:this.idcardsrc,
          Cardrevimage:this.backimg,
          idCardimage:this.persentake,
          busilicensimage:this.trading,
          busilicensname: this.storename
        })).then(function (res) {
          Indicator.close()
          var a=Base64.decode(res.data)
          a=JSON.parse(a)
          if (a.code==10000) {
              MessageBox.alert( '我们将在1-2个工作日内进行审核请耐心等待',"提交资料成功").then(action => {
                window.location.href = "#/jpay/jpay"
              })
          }else{
            Toast(a.info)
          }
        }).catch(function (err) {
        });
      }

    },
    mounted() {
      var that =this
      var token = localStorage.getItem('token')
      axios.post(BASE_URL+'/index.php?r=CardjPay/UserCardId',qs.stringify({
        token:token
      })).then(function(res){
        var a =Base64.decode(res.data)
        a=JSON.parse(a)
        if(a.code==10000){
          if(a.data.err==10000){
            var b= a.data.data
            if(a.data.data.cashstatus==1){
                that.cardNo=b.cashcardNO
                that.cardname=b.bank
                that.cashcardtype=b.cashcardtype
                that.phone=b.mobile
                that.province=b.province
                that.city=b.city
                that.county=b.county
                that.bankstreet=b.bankName
                that.cardInfo.idCardNo=b.idCardNo
                that.cardInfo.cname=b.cname
                that.cardInfo.startdate=b.startdate
                that.cardInfo.enddate=b.enddate
                that.idcardsrc=b.Cardposimage
                that.backimg=b.Cardrevimage
                that.persentake=b.idCardimage
                that.trading=b.busilicensimage
                that.storename=b.busilicensname;
                that.towrenzhneg=true
            }
          }
        }
      }).catch(function(err){

      })

    },
    updated() {

    },
    activated() {

    },
    components: {

    }
  }
</script>

<style scoped lang="scss">
  .dtitles{padding:0.75rem 0.75rem; font-size: 0.8rem; font-weight: bold;
    span{
      font-size: 0.8rem;
      color: #333333;
    }
  }

  #persenImg1, #trading, #persentake, #persenImgback {
    display: none;
  }
  .dimg {
    img {
      width: 100%;
      height: 100%;
    }
  }
li{
  b{
    font-size: 0.7rem;
    font-weight: normal;
    color: #666;
  }
}
  div.list ul li{ padding: 0 0.75rem; background-color: #fff; border-bottom: 1px solid #e3e5e9; zoom: 1; line-height: 2.4rem;}
  div.list ul li:after{content: ""; display: block; height: 0; clear: both;}
  div.list ul li label{font-size: 0.7rem; color: #666666; font-weight: bold; }
  div.list ul li label i{ color: #ff3b3b;}
  div.list ul li input{ border: none; width:9.125rem;  margin-left:0.5rem; font-size: 0.7rem; line-height: 2.4rem;}
  div.list ul li a{float: right; font-size: 0.35rem;}
  div.prompt{ padding: 0.625rem  0.75rem 1.75rem 0.75rem;}
  div.prompt span{ font-size: 0.7rem; color: #ff3b3b; font-weight: bold;}
  div.cos{margin: 0rem 0.75rem 2.5rem 0.75rem;}
  div.cos button{ width:100%; padding:0.75rem 0rem; background-color: #ff3737; color: #fff; text-align: center; font-size:0.7rem; border: none; border-radius: 0.1rem;}
  div.upload{ background-color: #fff; margin-top:0.75rem;  padding-top: 0.75rem;}
  div.dimg{width:17.25rem; height:8.75rem; border-radius: 0.1rem; margin: 0rem 0.75rem 0rem 0.75rem; background-repeat: no-repeat; background-size:100% 100%; position: relative;}
  div.dimg a{ width:2.5rem; height: 2.5rem; background-image:url(../../assets/images/j-pay-img/camera.png); background-repeat: no-repeat;  background-size:100% 100%;  display: block; position: absolute; top:2.75rem; left: 50%; margin-left: -1.25rem;}
  div.just{ background-image:url(../../assets/images/j-pay-img/Identity_card.png); margin-bottom: 0.75rem; }
  div.back{ background-image:url(../../assets/images/j-pay-img/Identity_card_counter.png); margin-bottom: 0.75rem; }
  div.hic{ background-image:url(../../assets/images/j-pay-img/hic.png); margin-bottom: 0.75rem; }
  div.bank_card{ background-image:url(../../assets/images/j-pay-img/bank_card.png); margin-bottom: 0.75rem; }
  div.business_license{ background-image:url(../../assets/images/j-pay-img/business_license.png); margin-bottom: 0.75rem; }

  .list ul .card{
      font-size: 0.8rem;
      color: #333333;
      line-height: 2rem;
      font-weight: bold;
      padding-left: 0.75rem;
  }

  </style>
