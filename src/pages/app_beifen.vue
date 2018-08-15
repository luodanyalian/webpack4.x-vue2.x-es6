<template>
    <div class="container">
        <header class="header" v-show="isOwn">
            <figure :class="[status==0?'hdbg0':'hdbg1']">
                <img :src="cardInfo.thumb">
                <figcaption>
                    <span>{{cardInfo.title}}</span>
                    <span>{{status==0?"拆开红包即可获得该藏品":"已成为您的藏品"}}</span>
                </figcaption>
            </figure>
        </header>
        <!-- 已拆翻转卡片（本人） -->
        <div class="main fanzhuan" :class='isFZ?classBack:classFont' v-on:click="fanzhuan" v-if="status == 1 && isOwn">
            <div class="basic back">
                <img class="img-card" :src="cardInfo.colours">
                <img class="img-honbao" src="../assets/img_lucky_money_s@3x.png">
                <img class="img-ip" :src="cardInfo.ip_image">
            </div>
            <div class="basic font">
                <!-- 失效 -->
                <section v-if="state==2||state==4">
                        <span class="money">¥ {{money}}</span>
                        <img class="icon-hongbao" src="../assets/img_red_packet_lock@3x.png" >

                        <p class="font-context" v-if="state==2">超过72小时未领取红包<br/>该红包已失效</p>
                        <p class="font-context" v-else>超过24小时未领取红包<br/>该红包已失效</p>
                </section>
                <!-- 已领取 -->
                <section v-else-if="state==5">
                    <span class="money">¥ {{money}}</span>
                    <p class="font-context">红包已领取<br/>可在微信零钱包中进行查看</p>
                    <img class="icon-hongbao" src="../assets/img_red_packet_open@3x.png" > 
                </section>
                 <!-- 未领取 -->
                <section v-else>
                    <span class="money top2">¥ {{money}}</span>
                    <div class="icon-shine"></div>
                    <img class="icon-ribbon" src="../assets/img_red_packet_ribbon@3x.png">
                    <img class="icon-hongbao top1" src="../assets/img_red_packet_open@3x.png">
                    <!-- 已关注未领取 -->
                    <img class="icon-context" src="../assets/img_card_tips_03@3x.png" v-if="state==3">
                    <!-- 未关注未领取 -->
                    <img class="icon-context" src="../assets/img_card_tips_02@3x.png" v-else>
                </section>
                <img class="icon-point" src="../assets/img_card_banner_plane@3x.png">
            </div>
        </div>
        <!-- 已拆（别人）（二维码失效） -->
        <div class="main main-bg top3" v-else-if="status == 1 && !isOwn">
            <p class="font-context">这个红包及藏品卡片
                <br/>已被领取啦！</p>
            <img class="icon-hongbao" src="../assets/img_red_packet_empty@3x.png">
            <a class="btn-zixun" href="tel:400-0000-688"></a>
            <img class="icon-zixun" src="../assets/img_call_tips@3x.png">
        </div>
        <div class="main main-bg" v-else>
            <!-- 未拆分 -->
            <!-- 手机号弹框 -->
            <div class="mask" v-show="isReg">
                <div class="box">
                    <img src="../assets/btn_24_x.png" class="btn-close" @click="hidebox">
                    <input class="inputnum" type="number" name="mobile" placeholder="手机号码" maxlength=11 v-model="items.mobile">
                    <input class="inputcode" type="text" placeholder="验证码" name="code" v-model="items.codeValue">
                    <button class="btn-code" :class="[code.disabled?'code-disable':'code-nor']" type="button" @click="getCode" :disabled="code.disabled">{{code.text}}</button>
                    <button class="btn-recevie" type="button" :class="[submitDisable?'btn1-disable':'btn1-nor']" :disabled="submitDisable" @click="register"></button>
                </div>
            </div>
            <div class="icon-shine"></div>
            <img class="icon-context" src="../assets/img_card_tips_01@3x.png">
            <img class="icon-hongbao top1" src="../assets/img_red_packet_nor@3x.png" @click="chai">
            <img class="icon-point" src="../assets/img_card_banner_plane@3x.png">
        </div>
    </div>
</template>
<script>
import D from 'wc-messagebox'
import Vue from 'vue'
Vue.use(D)
import wx from 'weixin-js-sdk'
import { ajaxGet, wxShareGet, ajaxPost } from "../http/api"
import { wxShare, hideShare } from '../common/js/wxapi.js'
import { settime,getQuery,removeQuery, throttle, checkMobile } from '../common/js/util'
import config from '../config.js'
export default {
    name: 'Root',
    data() {
        return {
            link: '', //当前页地址
            openid: '',
            isFZ: false,
            classBack: 'an_back',
            classFont: 'an_font',
            isReg: false, //是否注册
            isOwn: false,
            status: 0,//0未拆1已拆
            state: 0,
            // 1 72小时内未发放 (可以通知关注服务号，进行发放) 2 超过72小时未发放 (失效，即时此时关注了服务号，将不能发放)
            // 3 已发放 - 待领取 (可以去微信领取) 4 已发放 - 已领取  5 已发发 - 退回 (因为超过24小时，微信自动退回)
            text: '可可',
            items: {
                mobile: '',
                codeValue: ''
            },
            code: {
                text: '获取验证码',
                disabled: true
            },
            submitDisable: true,
            timer: null,
            countdown: 0,
            pro_id: '',
            cardInfo: {
                thumb: "",
                title: "",
                ip_image: ""
            },
            money: ""
        }
    },
    watch: {
        items: {
            handler(val, oldval) {
                if (this.items.mobile !== "" &&
                    this.items.codeValue !== "") {
                    this.submitDisable = false;
                }
                if (!this.timer) {
                    if (this.items.mobile == "" || !checkMobile(this.items.mobile)) {
                        this.$set(this.code, "disabled", true)
                    } else {
                        this.$set(this.code, "disabled", false)
                    }
                }
            },
            deep: true
        }
    },
    methods: {
        fanzhuan() {
            this.isFZ = !this.isFZ
        },
        chai() {
            this.isCheckRes();
        },
        hidebox() {
            this.isReg = false;
        },
        getCode: throttle(function() {
            let self = this;
            //发送
            ajaxPost({ url: "/sms/code", data: { mobile: this.items.mobile } }).then(r => {
                let data = JSON.parse(r);
                if (data.error_code == 0) {
                    self.$toast("验证码已发送");
                    settime(self);
                } else if (data.error_code == 50110) {
                    self.$toast("该手机号已被注册");
                } else {
                    self.$toast("发送失败")
                    console.log(data.error_msg);
                }
            })
        }),
        // 一键注册
        register: throttle(function() {
            let self = this;
            ajaxPost({ url: "/wechat/register", data: { mobile: this.items.mobile, openid: this.openid } }).then(r => {
                let data = JSON.parse(r);
                if (data.error_code == 0) {
                    //注册成功
                    localStorage.setItem("mobile", res.mobile);
                    localStorage.setItem("uid", res.uid);
                    localStorage.setItem("unionid", res.unionid);
                    self.reseive();
                } else {
                    console.log("注册失败", data.error_msg)
                }
            })
        }),
        //拆红包
        reseive() {
            let self = this;
            ajaxPost({ url: "/hb/open", data: { qrcode: self.qrcode, uid: parseInt(localStorage.getItem("uid")) } }).then(r => {
                let data = JSON.parse(r);
                if (data.error_code == 0) {
                    self.isOwn = true;
                    self.status = 1;
                    self.money = data.data.money;
                } else {
                    console.log("拆红包失败", data.error_msg);
                }
            })
        },
        alert() {
            this.$alert('第一个弹窗');
            this.$alert('第二个弹窗')
        },
        //微信授权 
       wxauth() {
            var self = this;
            self.openid = localStorage.getItem("openid");
            self.link = decodeURIComponent(window.location.href);
            var code = getQuery('code', self.link);
            if (code) {
                console.log("code", code);
                // self.link = decodeURIComponent(window.location.href);
                ajaxPost({ url: "/wechat/auth", data: { code: code } }).then(r => {
                    let res = JSON.parse(r);
                    if (res.error_code == 0) {
                        localStorage.setItem("openid", res.openid);
                        self.openid = res.openid;
                        // window.location.href = config.h5url + '/index.html'
                        let linkstr = removeQuery("code",self.link)
                        window.location.href = removeQuery("state",linkstr);
                        self.checkhb();
                    } else {
                        self.$toast("获取用户信息失败");
                    }
                })
            } else {
                if (!localStorage.getItem("openid")) {
                    var redirect_uri = encodeURIComponent(window.location.href);
                    // var redirect_uri = config.h5url + '/index.html'
                    window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + config.appid + "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
                }else{
                    self.checkhb();
                }
            }
        },
        //判断用户是否注册
        isCheckRes() {
            let self = this;
            ajaxPost({ url: "/wechat/register/info", data: { openid: self.openid } }).then(r => {
                let res = JSON.parse(r);
                if (res.error_code == 0) {
                    console.log("已注册", res);
                    localStorage.setItem("mobile", res.mobile);
                    localStorage.setItem("uid", res.uid);
                    localStorage.setItem("unionid", res.unionid);
                    self.reseive();
                } else if (res.error_code == 50107) {
                    self.status = 0;
                    self.isReg = true;
                } else {
                    self.$toast("获取用户信息失败");
                }
            })
        },
        //获取卡片信息
        getcardinfo() {
            let self = this;
            ajaxPost({ url: "/card/info", data: { id: parseInt(self.pro_id) } }).then(r => {
                let res = JSON.parse(r);
                if (res.error_code == 0) {
                    self.cardInfo = res.data;
                } else {
                    console.log("获取卡片信息失败");
                }
            })
        },
        //检查红包
        checkhb() {
            let self = this;
            ajaxPost({ url: "/hb/check", data: { qrcode: self.qrcode, openid: self.openid } }).then(r => {
                let res = JSON.parse(r);
                if (res.error_code == 0) {
                    if (res.data !== null) {
                        self.isOwn = true;
                        self.status = 1;
                        self.money = res.data.money;
                        self.state = res.data.state;
                        self.getcardinfo();
                    }else{
                       self.isOwn = false; 
                    }
                } else if (res.error_code == 10007) { //查询时还未激活
                    self.isOwn = true;
                    self.status = 0;
                    self.getcardinfo();
                } else {
                    console.log("获取卡片信息失败");
                }
            })
        },
        hideShare: function() {
            const _this = this;
            let params = {
                url: window.location.href
            }
            wxShareGet(params).then(r => {
                var data = r.data;
                console.log(data);
                hideShare(data);
            })
        },
        // //分享
        // share() {
        //     const _this = this;
        //     let params = {
        //         url: window.location.href
        //     }
        //     wxShareGet(params).then(r => {
        //         var data = r.data;
        //         console.log(data);
        //         wxShare(data, {
        //             shareSuccess: function(type) {
        //                 console.log(type + "分享成功");
        //             },
        //             links: window.location.href,
        //             title: "分享标题",
        //             desc: '分享描述',
        //             shareImage: config.h5url + '/images/share.jpg',
        //             shareFailure: function() {
        //                 _this.$toast("分享失败,您取消了分享!")
        //             },
        //             configFailure: function() {
        //                 _this.$toast("微信接口出现异常，请稍后再试!")
        //             }
        //         });
        //     })
        // }
    },
    created() {
        this.hideShare();
        this.status = parseInt(getQuery("status"));
        this.pro_id = parseInt(getQuery("pro_id"));
        this.qrcode = getQuery("qrcode");
        this.wxauth();
        // this.share();
        //处理授权之后的逻辑
        // [1,2,3].map(function(r){alert(r+1)})
    }
}
</script>
<style module lang="scss">
@import '../common/scss/index.scss';
</style>