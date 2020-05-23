<template>
    <div class="flexPage setting">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">   
            <div class="signWrapper">
                <div class="signHead">
                    <h3>{{$t('user.setting.set')}}</h3>
                </div>
                <div class="signForm kyc">
                    <van-cell-group>
                        <!-- <van-cell :title="$t('user.setting.rate')" :value="defaultRate" @click="showRate = true" is-link /> -->
                        <van-cell :title="$t('user.setting.rate')" :value="defaultRate" />
                    </van-cell-group>
                </div>
            </div>
        </div>   

        <!-- 修改模式 -->
        <van-popup v-model="showLang" position="bottom">
            <div class="modal">
                <div class="head flexLevel">
                    <span>{{$t('user.setting.chooseModal')}}</span>
                    <van-icon name="cross" @click="showLang = false" />
                </div>
                <div class="content">
                    <ul>
                        <li v-for="(item,index) in languages" :key="index" :class="{active:cur == index}" @click="cur = index"><span>{{item}}</span></li>
                    </ul>
                </div>
                <div class="btnBox"><van-button size="large" @click="onChooseLang" class="active">{{$t('button.public.submit')}}</van-button></div>
            </div>
        </van-popup> 

        <!-- 修改汇率 -->
        <van-popup v-model="showRate" position="bottom">
            <div class="modal">
                <div class="head flexLevel">
                    <span>{{$t('user.setting.chooseRate')}}</span>
                    <van-icon name="cross" @click="showRate = false" />
                </div>
                <div class="content">
                    <ul>
                        <li v-for="(item,index) in rates" :key="index" :class="[{active:active == index},'fw']" @click="active = index"><span>{{item.currency}}</span></li>
                    </ul>
                </div>
                <div class="btnBox"><van-button size="large" @click="onChooseRate" class="active">{{$t('button.public.submit')}}</van-button></div>
            </div>
        </van-popup> 
	</div>
</template>
<script>
import backbar from "@/views/modules/back.vue"
export default {
	data(){
        return {
            backUrl:{
                url: ''
            },
            btnStatus: false, 
            cur: 0,
            active: 0,
            rates:[],
            languages:['简体中文','English'],
            showLang: false,
            showRate: false,
            defaultRate: localStorage.getItem('defaultRate') || 'CNY',
            defaultLang: localStorage.getItem('language') || 'zh-CN',
        }
    },
    components:{backbar},
    computed:{
        vLanguage(){
            switch(this.defaultLang){
                case 'zh-CN':
                    return '简体中文';
                case 'en-US':
                    return 'English';
                default: 
                    return '简体中文';
            }
        }
    },
	mounted(){
        this.initPage();
    },
    watch:{
        
    },
	methods:{
        initPage(){
            this.vCur();
            this.vActive();
            this.getRates();
        },
        vCur(){
            switch(this.defaultLang){
                case 'zh-CN':
                    this.cur = 0;
                    break;
                case 'en-US':
                    this.cur = 1;
                    break;
                default:
                    this.cur = 0;
                    break;
            }
        },
        vActive(){
            switch(this.defaultRate){
                case 'CNY':
                    this.active = 0;
                    break;
                case 'USD':
                    this.active = 1;
                    break;
                case 'EUR':
                    this.active = 2;
                    break;
                case 'JPY':
                    this.active = 3;
                    break;
                case 'GBP':
                    this.active = 4;
                    break;
                default:
                    this.active = 0;
                    break;
            }
        },
        onChangeTheme(status){
            localStorage.setItem('theme',JSON.stringify(status));
        },
        getRates(){
            let that = this;
            that.$mts.posts({
                url: 'api/me/currency/rateArray',
                data:{},
                success(response){
                    if(response.data.status == 200){
                        that.rates = response.data.data;
                    }
                }
            })
        },
        onChooseLang(){
            this.showLang = false;
            switch(this.cur){
                case 0:
                    this.defaultLang = 'zh-CN';
                    break;
                case 1:
                    this.defaultLang = 'en-US';
                    break;
                default:
                    this.defaultLang = 'zh-CN';
                    break;
            }
            localStorage.setItem("language",this.defaultLang);
            location.reload();
        },
        onChooseRate(){
            this.showRate = false;
            this.defaultRate = this.rates[this.active].currency;
            localStorage.setItem('defaultRate',this.defaultRate);
        },
	}
}
</script>

<style lang="scss">
    .setting {
        .signWrapper {
            .signForm {
                .van-cell-group {
                    .van-cell {
                        background-color: #E4EEEF;
                        border-bottom: 1px solid #d5d5d5;
                    }
                }
            }
        }
    }
</style>
