<template>
  <div class="successful_trade">
    <div class="money">
      <p>{{order.jpaymoney}}</p>
      <span>总交易(元)</span>
      <div class="graphical"></div>
      <div class="transaction_content">
        <div>
          <label>交易订单号</label>
          <span>{{orderid}}</span>
        </div>
        <div>
          <label>商品名称</label>
          <span>{{order.jpayname}}</span>
        </div>
        <div>
          <label>交易金额</label>
          <span>{{order.actualmoney}}</span>
        </div>
        <div>
          <label class="clr">交易已受理</label>
          <span class="clr">交易时间: {{order.opentime}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import qs from "qs";
  import {Toast} from "mint-ui";

  export default {
    name: 'Sccessful',
    data() {
      return {
        order: '',
        orderid: ""
      }
    },
    mounted() {
      var that = this
      this.orderid = this.$route.params.orderid
      var token = localStorage.getItem('token')
      axios.post(BASE_URL + '/index.php?r=CardjPay/OrdersViewYb', qs.stringify({
        token: token,
        orderid: this.orderid,
      })).then(function (res) {
        var a = Base64.decode(res.data)
        a = JSON.parse(a)
        if (a.code == 10000) {
          if (a.data.err == 10000) {
            that.order = a.data.data
          } else {
            Toast(a.data.msg)
          }
        } else {
          Toast(a.info)
        }
      }).catch(function (err) {
      });
    }
  }
</script>

<style scoped>
  div.successful_trade {
  }

  div.successful_trade div.money {
    width: 100%;
    padding: 2.675rem 0px 0.925rem 0px;
    background-color: #36c65f;
    position: relative;
  }

  div.successful_trade div.money p {
    text-align: center;
    color: #fff;
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  div.successful_trade div.money span {
    text-align: center;
    color: #fffefe;
    font-size: 0.65rem;
    display: block;
  }

  div.successful_trade div.money div.graphical {
    width: 18rem;
    height: 0.75rem;
    background-color: #248940;
    border-radius: 0.875rem;
    margin: 1.125rem auto 0 auto;
  }

  div.successful_trade div.money div.transaction_content {
    width: 17.25rem;
    height: 14.5rem;
    background-image: url(../../assets/images/j-pay-img/transaction_content.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: 83%;
    left: 50%;
    margin-left: -8.625rem;
    padding-top: 2rem;
  }

  div.successful_trade div.money div.transaction_content:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
  }

  div.successful_trade div.money div.transaction_content div {
    margin: 0rem 0.75rem;
    padding: 0.75rem 0.75rem;
    zoom: 1;
    border-bottom: 1px dashed #dddddd;
  }

  div.successful_trade div.money div.transaction_content div:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
  }

  div.successful_trade div.money div.transaction_content div label {
    float: left;
    font-size: 0.7rem;
    color: #999999;
  }

  div.successful_trade div.money div.transaction_content div span {
    float: right;
    font-size: 0.7rem;
    color: #333333;
  }

  div.successful_trade div.money div.transaction_content div label.clr {
    color: #34c45d;
  }

  div.successful_trade div.money div.transaction_content div span.clr {
    color: #999999;
  }
</style>
