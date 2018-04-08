<template>
  <div class="notice_details">
    <div class="notice">
      <p class="pnotice" v-text="content.title"></p>
      <p class="pcontent" v-text="content.content"></p>
      <p class="psignature" v-text="content.seodescription"></p>
      <p class="ptime" v-text="content.addtime"></p>
    </div>
  </div>
</template>

<script>
  import { Indicator,Toast } from 'mint-ui';
  import axios from 'axios';
  import qs from 'qs';
  export default{
    name: 'NaticeContent',
    data() {
      return {
        a:'',
        content:'',
      }
    },
    methods: {
      read(id,time){
        var now = new Date()
        var to = new Date(time)
        const day = 30 *24 *60*60*1000
        
        
        if((now-to)>=day){
          return
          
        }
        
        var  isread = JSON.parse(localStorage.getItem('natice'))
          if(!isread){
              isread = [id]
          }else{
            isread.push(id)
            var res = [];
            var json = {};
            for(var i = 0; i < isread.length; i++){
              if(!json[isread[i]]){
              res.push(isread[i]);
              json[isread[i]] = 1;
              }
            }
             isread = res; 
          }
          isread =JSON.stringify(isread)
          localStorage.setItem('natice',isread)
      }
    },
    mounted() {
      var that = this
      this.a=this.$route.params.id
      axios.post(BASE_URL +'/index.php?r=Apitransaction/Noticeview',qs.stringify({
          id:this.a
      })).then(function(res){
        var data = JSON.parse(Base64.decode(res.data))
        if(data.code==10000){
          if(data.data.err==10000){
            that.content=data.data.data
            that.read(that.a,that.content.addtime)
          }else{
            Toast(data.data.msg)
          }
        }else{
          Toast(data.info)
        }
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
  .notice_details{ background-color: #ffffff; padding: 2.25rem 0.75rem;min-height: 100%;}
  .notice_details p.pnotice{text-align: center; font-size: 0.8rem; color: #333; font-weight: bold; margin-bottom: 1.875rem;}
  .notice_details p.pcontent{ font-size: 0.7rem; color: #666666; text-indent: 1rem; line-height: 1.25rem; margin-bottom: 1.25rem;}
  .notice_details p.psignature{ text-align: right; font-size: 0.7rem; color: #666666; margin-bottom: 0.625rem;}
  .notice_details p.ptime{text-align: right; font-size: 0.7rem; color: #666666;}
</style>
