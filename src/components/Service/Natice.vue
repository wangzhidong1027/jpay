<template>
  <mt-loadmore :bottom-method="loadBottom" :bottomLoadingText='""' :bottomDropText='""' :bottomPullText='""' :auto-fill="false" ref='loadmore' :bottomDistance=150>
  <div class="cservice">
    <div class="list" v-for="item in native">
      <a :href='"#/jpay/service/natice/content/"+item.id'>
        <p class="ptitle">
          <span class="sfont">{{item.title}}</span><i v-if="isread(item.id,item.addtime)"></i>
          <span class="stime">{{item.addtime}}</span>
        </p>
        <p class="pcontent">{{item.content}}</p>
      </a>
    </div>
  </div>
  </mt-loadmore>
</template>

<script>
  import { Indicator,Toast } from 'mint-ui';
  import axios from 'axios';
  import qs from 'qs';
  export default{
    name: 'Natice',
    data() {
      return {
        page:'1',
        native:[]
      }
    },
    methods: {
      loadBottom(){
        this.page++;
        this.getNatice()
      },
      getNatice(){
        Indicator.open()
        var that =this
        var token=localStorage.getItem('token')
        axios.post(BASE_URL +'/index.php?r=Apitransaction/noticelist',qs.stringify({
          token:token,
          page:this.page,
        })).then(function(res){
          Indicator.close()
          var a=Base64.decode(res.data)
          a=JSON.parse(a)
          if(a.code==10000){
            that.native=a.data.data.res
            }else{
            Toast(a.info)
          }
          that.$refs.loadmore.onBottomLoaded();
        }).catch(function(err){
          Indicator.close()
        });
      },
      isread(id,time){
        var now = new Date()
        var to = new Date(time)
        const day = 30 *24 *60*60*1000
        if((now-to)>=day){
          return false
        }else{
          var title= JSON.parse(localStorage.getItem('natice'))
          if (!title) {
            return true
          }
          for(var i = 0 ;i<title.length;i++){
            if(title[i]==id){
               return  false
            }
          }
          return true
        }
      }
    },
    mounted() {
      this.getNatice()
    },
    updated() {

    },
    activated() {

    },
    components: {}
  }
</script>

<style scoped lang="scss">
  div.cservice{ background-color: #f5f5f5; padding:0.75rem;height: 100%;width: 100%}
  div.cservice div.list{ background-color: #fff; border-radius: 0.1rem; margin-bottom: 0.5rem; padding: 0.625rem 0.75rem;}
  div.cservice div.list a{display: block;}
  div.cservice div.list p.ptitle:after{content: ""; display: block; height: 0; clear: both; }
  div.cservice div.list p.ptitle{padding-bottom: 0.625rem; border-bottom: 1px solid #eeeeee; position: relative;}
  div.cservice div.list p.ptitle span.sfont{ float: left; font-size: 0.7rem; color: #333333;}
  div.cservice div.list p.ptitle i{display:block; width:0.375rem; height: 0.375rem; border-radius: 50%; background-color: #ff3b3b; float: left;}
  div.cservice div.list p.ptitle span.stime{ float: right; font-size: 0.6rem; color: #666666;}
  div.cservice div.list p.pcontent{ font-size: 0.6rem; padding-top:0.75rem;  color: #999999;overflow: hidden; height: 1.5rem}

</style>
