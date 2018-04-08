<template>
  <div class='record'>
    <div class="header">
      <div class="date">
        <p class="startDate"><i></i>
          <span @click="selectDate('start')" v-text="startdate"></span>
        </p>
        <b>到</b>
        <p class="overDate" @click="selectDateend('end')">
          <i></i>
          <span v-text="enddate"></span>
          </p>
      </div>
    </div>
    <div class="nav">
      <span :class="state=='succeed'?'active':''" @click="change('succeed')">交易成功</span>
      <span :class="state=='defeated'?'active':''" @click="change('defeated')">交易失败</span>
    </div>
    <div class="record_list" >
      <div class="mylist">
      <mt-loadmore :bottom-method="loadBottom" :bottomLoadingText='""' :bottomDropText='""' :bottomPullText='""' :auto-fill="false" ref='loadmore' :bottomDistance=150>
        <div>
        <p class="number">共计：{{num}}条 总交易金额{{money}}</p>
        <ul>
          <li v-for="item in recordlist">
            <p class="orderNo"><b>订单号：<b>{{item.orderid}}</b></b><span>{{item.jpayname}}</span></p>
            <div class="mesg">
              <p class="time"><span>交易时间：</span><b>{{item.opentime}}</b></p>
              <div class="status">
                <p><span>交易状态：</span><b>{{text}}</b></p>
                <h5>{{item.jpaymoney}}</h5>
              </div>
            </div>
          </li>
        </ul>
        </div>
      </mt-loadmore>
      </div>
    </div>
    <mt-datetime-picker
      ref="picker1"
      type="date"
      :endDate= "new Date()"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      @confirm="handleConfirm1">
    </mt-datetime-picker>
    <mt-datetime-picker
      ref="picker"
      type="date"
      :endDate= "new Date()"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      @confirm="handleConfirm2">
    </mt-datetime-picker>
  </div>
</template>

<script>
  import { DatetimePicker} from 'mint-ui';
  import { Indicator,Toast } from 'mint-ui';
  import axios from 'axios';
  import qs from 'qs';
  export default{
    name: 'J_Record',
    data() {
      return {
        startdate:'',
        enddate:'',
        state:'succeed',
        page:'1',
        recordlist:'',
        money:'',
        num:'',
        text:'交易成功'
      }
    },
    methods: {
      loadBottom(){
        this.page++
        this.getrecord(this.state,this.startdate,this.enddate)
      },
      change(type){
        this.startdate=''
        this.enddate=''
        this.state=type
        if(this.state=='succeed'){
          this.text='交易成功'
        }else{
          this.text='交易失败'
        }
        this.page=1
        this.getrecord(type)
      },
      getrecord(type,starttime,endtime){
        var _type = null
        if(type=='succeed'){
          _type=1
        }else{
          _type=-1
        }
        var that =this
        var token=localStorage.getItem('token')
        Indicator.open()
        axios.post(BASE_URL +'/index.php?r=Apitransaction/Apitrlist',qs.stringify({
            token:token,
            page:this.page,
            type:_type,
            starttime:starttime,
            endtime:endtime
        })).then(function(res){
          Indicator.close()
          var a=Base64.decode(res.data)
          a=JSON.parse(a)
          if(a.code==10000){
            that.recordlist=a.data.data.rows
            that.num=a.data.data.totalCount
            that.money=a.data.data.countmoney
          }else{
            Toast(a.info)
          }
          that.$refs.loadmore.onBottomLoaded();
        }).catch(function(err){
          Indicator.close()
        });
      },
      selectDate(status){
        if(status=='start'){
          this.$refs.picker1.open();
        }else{
          this.$refs.picker.open();
        }
      },
      handleConfirm1(date){
        if( this.enddate && date-new Date(this.enddate)>0){
          Toast('请选择正确的日期')
          return
        }
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        this.startdate = y + '-' + m + '-' + d;
        if(this.enddate){
          this.getrecord(this.state,this.startdate,this.enddate)
        }

      },
      selectDateend(){
        if(!this.startdate){
          Toast('请先选择开始日期')
          return
        }
        this.$refs.picker.open();
      },
      handleConfirm2(date){
        if(date-new Date(this.startdate)<0){
          Toast('请选择正确的日期')
          return
        }
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        this.enddate = y + '-' + m + '-' + d;
        this.getrecord(this.state,this.startdate,this.enddate)
      },
    },
    mounted() {
      this.getrecord(this.state,this.startdate,this.enddate)
    },
    updated() {

    },
    activated() {

    },
    components: {}
  }
</script>

<style scoped lang="scss">
.record{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .header{
    height: 4.25rem;
    width: 100%;
    background: url('../../assets/images/jpay/record.png') no-repeat ;
    background-size:100%;
    .date{
      width: 100%;
      height: 100%;
      padding: 0 0.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      p{
        width: 7.5rem;
        height: 1.75rem;
        display: flex;
        align-items: center;
        position: relative;
        i{
          width: 1.1rem;
          height: 100%;
          background:url('../../assets/images/jpay/date.png') no-repeat center;
          background-size: 100%;
          position: absolute;
          left:0.5rem;
          top: 0;
        }
        span{
          width: 100%;
          height: 100%;
          opacity: 0.5;
          background: #fff;
          border-radius: 4px;
          padding-left: 2.1rem;
          font-size: 0.75rem;
          line-height: 1.75rem;
          color: #000;
        }
      }
      b{
        font-size: 0.75rem;
        color: #fff;
        font-weight: normal;
      }
    }

  }
  .nav{
    height: 2.45rem;
    width: 100%;
    background: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid #dddddd;
    span{
      font-size: 0.75rem;
      color: #666666;
      padding: 10px 0;
    }
    .active{
      color: #ff3737;
      border-bottom:2px solid #ff3737;
    }
  }
  .record_list{
    padding: 0 0.75rem;
    display: flex;
    flex: 1;
    .mylist{
      width: 100%;
      height: 100%;
      overflow: scroll;
      ::-webkit-scrollbar{
        display:none;
      }
    }
    .number{
      text-align: right;
      font-size: 0.6rem;
      color: #666666;
      line-height:1.6rem;
    }
    ul{
      display: flex;
      flex-direction: column;
      li{
        background: #fff;
        border-radius: 8px;
        margin-bottom: 0.5rem;
        padding:0 0.75rem;
        .orderNo{
          display: flex;
          justify-content: space-between;
          line-height: 2rem;
          border-bottom: 1px solid #eee;
          b{
            font-size:0.7rem;
            color:#333;
          }
          span{
            color: #999;
            font-size: 0.6rem;
          }
        }
        .mesg{
          padding: 0.75rem 0;
          font-size: 0.6rem;
          span{
            color: #666;
          }
          .status{
            padding-top: .25rem;
            display: flex;
            justify-content: space-between;
            b{
              color: #25b625;
            }
            h5{
              color: #ff3737;
            }
          }
        }
      }
    }
  }


}

</style>
