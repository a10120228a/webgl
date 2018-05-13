<template>
  <div class="glodBox">
    <div class="openBox" :class="startAnimation ? startAnimation : ''" v-if="showGlodBox"></div>
    <div class="boxProgress" v-else>
      <div class="closeThisPage" @click="closePage"></div>
      <h3>
        你获得了
        <span v-html="starTotalNum"></span>
        颗星，已领取了
        <span v-html="receiveBox"></span>
        个宝箱！
      </h3>
      <div class="boxContainer">
        <img src="../assets/images/glodBox-box.png" alt="">
      </div>
      <div class="progressTotal">
        <p class="progressBtLeft" :style="minStarNum.a">
          <span v-html="progressBtLeft"></span>
        </p>
        <p class="progressBtRight">
          <span v-html="progressBtRight"></span>
        </p>
        <div class="grayBgColor" :style="grayBgColorStyle.a">
          <div class="bigYeBgColor">
            <div class="containerStar"></div>
            <div class="progressTop" :style="minStarNum.b">
              <span v-html="progressTop"></span>
              <p class="progressTitle" :style="grayBgColorStyle.b">
                还差
                <span v-html="diffBoxNum"></span>
                颗星哦~
              </p>
            </div>
          </div>
        </div>
      </div>
      <p class="showBottomText"><span class="showPoint">·</span>每获得9颗星可以获得丰厚的奖励哦！<span class="showPoint">·</span></p>
    </div>
  </div>
</template>
<script>
  export default {
    props:{
      glodBoxData: {
        type: Object,
        default: function(){
          return {
            level: 0,   //宝箱的级别
            open: true, //与surprised做运算，看宝箱是否开启
            offset: 0,  //偏移量
            allStar: 0,//所有星数
            surprised: false,
            classId:null
          };
        }
      }
    },
    data(){
      return {
        showGlodBox:false,
        starTotalNum:'',
        receiveBox:'',
        diffBoxNum:'',
        progressTop:'',
        progressBtLeft:'',
        progressBtRight:'',
        grayBgColorStyle:'',
        minStarNum:'',
        startAnimation:false,
      };
    },
    methods:{
      closePage(){
        //关闭弹窗
        this.$emit('close');
      }
    },
    mounted(){
      const { level, allStar, open, surprised, offset,classId } = this.glodBoxData;
      if(open && surprised){
        this.showGlodBox = true;
        const that = this;
        const timer = setTimeout(function(){
          that.startAnimation = 'startAnimation';
          clearTimeout(timer);
        },300);
        const timer2 = setTimeout(function(){
          //请求后台接口 将开箱子的数据传过去
          console.log(classId);
          //关闭弹窗
          this.$emit('close');
          clearTimeout(timer2);
        },2300);
      }else{
        this.showGlodBox = false;
      }
      const boxNum = Math.floor(allStar / 9);
      const maxStar = level * 9;
      const minStar = maxStar - 9;
      const topNum = minStar + offset;
      const diffNum = maxStar - topNum;
      this.minStarNum = countStyle(minStar,offset);
      this.starTotalNum = count(allStar);         //总星数
      this.receiveBox = count(boxNum);            //已经领取的宝箱数
      this.diffBoxNum = count(diffNum,'diff');    //还差几颗星获得宝箱
      this.progressTop = count(topNum);           // 进度条星星数
      this.progressBtLeft = count(minStar);       // 起始位置星星数
      this.progressBtRight = count(maxStar);      // 终止位置星星数
      this.grayBgColorStyle = widthCount(topNum); //进度条长度样式
    }
  };
  function countStyle(num,diff){
    let a = {};
    if(num >= 100){
      a.a = { left:'-15px' };
      a.b = { left:'-6px' };
    }else if(num >= 10){
      a.a = { left:'-9px' };
      a.b = { left:'-2px' };
    }else if(num + diff >= 10){
      a.a = { left:'-5px' };
      a.b = { left:'-2px' };
    }else{
      a.a = { left:'-4px' };
      a.b = { left:'4px' };
    }
    return a;
  }
  function widthCount(w){
    let mw = Math.floor((w % 9) / 9 * 255);
    let b = {};
    let a = {};
    if(mw > 168){
      b = {
        left:'-96px!important',
        top:'-1px'
      };
    }
    a = {width: mw + 'px'};
    return {
      a:a,
      b:b
    };
  }
  function myObj(a,type){
    let baiFenBi = '';
    a === 1 ? baiFenBi = '50% 70%' : type ? baiFenBi = '65% 65%' : baiFenBi = '80% 80%';
    if(a || a === 0){
      return `
        display:inline-block;
        width:10px;
        height:16px;
        background:${"url(" + require("../assets/images/glodBox-" + a + ".png") + ") center bottom no-repeat"};
        background-size:${baiFenBi}
      `;
    }else{
      return {};
    }
  }
  function count(num,type){
    let a = null,
      b = null ,
      c = null;
    if(num >= 100){
      a = Math.floor(num / 100);
      b = Math.floor(num % 100 / 10);
      c = num % 10;
    }else if(num >= 10){
      a = Math.floor(num / 10);
      b = num % 10;
    } else {
      a = num;
    };
    const obj = {
      a:myObj(a,type),
      b:myObj(b,type),
      c:myObj(c,type)
    };
    return `<span style="${obj.a}"></span><span style="${obj.b}"></span><span style="${obj.c}"></span>`;
  }
</script>

<style scoped>
  .glodBox{
    width:590px;
    height:686px;
    position:absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    margin:auto;
    background:rgba(0,0,0,0);
    border-radius:8px;
    z-index:99999;
  .openBox{
    width:750px;
    height:808px;
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    margin:auto;
    background:url(../assets/images/glodBox-animation.png) left top no-repeat;
    background-size:500% 400%;
  }
  .startAnimation{
    animation:openDlodBox 2s 1 steps(1,start);
  }
  .boxProgress{
    width:100%;
    height:100%;
    background:white;
    padding-top:60px;
    border-radius:8px;
  .closeThisPage{
    width:40px;
    height:40px;
    position:absolute;
    top:20px;
    right: 20px;
    background:url(../assets/images/glodBox-close.png) center no-repeat;
    background-size:100% 100%;
  }
  h3{
    width:410px;
    height:88px;
    font-size:32px;
    color:rgba(0,0,0,0.85);
    margin:0 auto 0;
    text-align:center;
    line-height:44px;
    font-family:PingFangSc-Regular;
  }
  .boxContainer{
    width:214px;
    height:220px;
    margin:40px auto 0;
  img{
    width:100%;
    height:100%;
  }
  }
  .progressTotal{
    width:510px;
    height:14px;
    margin:72px 40px 112px 40px;
    background:rgba(216,216,216,0.65);
    border-radius:10px;
    position:relative;
  .progressBtLeft{
    position:absolute;
    top:20px;
    left:18px;
  }
  .progressBtRight{
    position:absolute;
    right:0;
    top:20px;
  }
  .grayBgColor{
    position:absolute;
    left:0;
    top:0;
    background-image: linear-gradient(-90deg, #FCD172 0%, #FFB805 100%);
    height:14px;
    border-radius:10px;
  .bigYeBgColor{
    width:32px;
    height:32px;
    background:#FFB805;
    border-radius:50%;
    position:absolute;
    right:-16px;
    top:-8px;
  .containerStar{
    width:100%;
    height:100%;
    background:url(../assets/images/glodBox-star.png) center center no-repeat;
    background-size:50% 50%;
  }
  .progressTop{
    position:absolute;
    top:-42px;
    right:-18px;
    width:60px;
  .progressTitle{
    width:180px;
    height:34px;
    font-size:24px;
    color:rgba(0,0,0,0.65);
    font-family:PingFangSc-Regular;
    position:absolute;
    top:-4px;
    left:66px;
  }
  }
  }
  }
  }
  .showBottomText{
    width:504px;
    height:40px;
    margin:112px auto 0;
    font-size:28px;
    color:rgba(0,0,0,0.55);
  .showPoint{
    display:inline-block;
    width:20px;
  }
  }
  }
  }
  @keyframes openDlodBox{
    0%{
      background-position:left top;
    }
    4%{
      background-position:-750px top;
    }
    8%{
      background-position:-1500px top;
    }
    12%{
      background-position:-2250px top;
    }
    16%{
      background-position:-3000px top;
    }
    20%{
      background-position:left -808px;
    }
    24%{
      background-position:-750px -808px;
    }
    28%{
      background-position:-1500px -808px;
    }
    32%{
      background-position:-2250px -808px;
    }
    36%{
      background-position:-3000px -808px;
    }
    40%{
      background-position:left -1616px;
    }
    44%{
      background-position:-750px -1616px;
    }
    48%{
      background-position:-1500px -1616px;
    }
    52%{
      background-position:-2250px -1616px;
    }
    56%{
      background-position:-3000px -1616px;
    }
    60%{
      background-position:left -2424px;
    }
    64%{
      background-position:-750px -2424px;
    }
    68%{
      background-position:-1500px -2424px;
    }
    72%{
      background-position:-2250px -2424px;
    }
    73%{
      background-position:-3000px -2424px;
    }
    100%{
      background-position:-3000px -2424px;
    }
  }
</style>
