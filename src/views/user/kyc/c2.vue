<template>
    <div class="flexPage themeColor">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">
            <div class="signWrapper">
                <div class="signHead">
                    <h3>{{$t('user.kyc.authentication')}}</h3>
                </div>
                <div class="signForm kyc">
                    <ul class="documentBox">
                        <li v-for="(item,index) in documents" :key="index" :class="{active: cur == index}"
                            @click="onChoose(index)">{{item.name}}</li>
                    </ul>
                    <div class="picBox" v-if="cur == 0">
                        <div class="uploadBox">
                            <p>{{$t('form.kyc.face')}}</p>
                            <van-uploader :max-size="8388608" @oversize="oversize()" name="picFace"
                                :after-read="onRead">
                                <img v-if="!face && !theme" src="@/assets/img/picFace.png" alt="" />
                                <img v-if="!face && theme" src="@/assets/img/picFace_dark.png" alt="" />
                                <img v-if="face" :src="form.data.picFace.value" />
                            </van-uploader>
                        </div>
                        <div class="uploadBox">
                            <p>{{$t('form.kyc.back')}}</p>
                            <van-uploader :max-size="8388608" @oversize="oversize()" name="picBack"
                                :after-read="onRead">
                                <img v-if="!back && !theme" src="@/assets/img/picBack.png" alt="" />
                                <img v-if="!back && theme" src="@/assets/img/picBack_dark.png" alt="" />
                                <img v-if="back" :src="form.data.picBack.value" />
                            </van-uploader>
                        </div>
                        <div class="uploadBox">
                            <p>{{$t('form.kyc.hold')}}</p>
                            <van-uploader :max-size="8388608" @oversize="oversize()" name="picHold"
                                :after-read="onRead">
                                <img v-if="!hold && !theme" src="@/assets/img/picHold.png" alt="" />
                                <img v-if="!hold && theme" src="@/assets/img/picHold_dark.png" alt="" />
                                <img v-if="hold" :src="form.data.picHold.value" />
                            </van-uploader>
                        </div>
                        <div class="uploadBox toast">
                            <p>{{$t('form.kyc.note')}}</p>
                            <p>1.huodun</p>
                            <p>2.{{$t('form.kyc.date')}}</p>
                            <p>3.UID</p>
                        </div>
                    </div>
                    <div class="picBox" v-if="cur == 1">
                        <div class="uploadBox">
                            <p>{{$t('form.kyc.facePassport')}}</p>
                            <van-uploader :max-size="8388608" @oversize="oversize()" name="picFacePassport"
                                :after-read="onRead">
                                <img v-if="!facePassport && !theme" src="@/assets/img/picFace.png" alt="" />
                                <img v-if="!facePassport && theme" src="@/assets/img/picFace_dark.png" alt="" />
                                <img v-if="facePassport" :src="form.data.picFacePassport.value" />
                            </van-uploader>
                        </div>
                        <div class="uploadBox">
                            <p>{{$t('form.kyc.backPassport')}}</p>
                            <van-uploader :max-size="8388608" @oversize="oversize()" name="picBackPassport"
                                :after-read="onRead">
                                <img v-if="!backPassport && !theme" src="@/assets/img/picBack.png" alt="" />
                                <img v-if="!backPassport && theme" src="@/assets/img/picBack_dark.png" alt="" />
                                <img v-if="backPassport" :src="form.data.picBackPassport.value" />
                            </van-uploader>
                        </div>
                        <div class="uploadBox">
                            <p>{{$t('form.kyc.holdPassport')}}</p>
                            <van-uploader :max-size="8388608" @oversize="oversize()" name="picHoldPassport"
                                :after-read="onRead">
                                <img v-if="!holdPassport && !theme" src="@/assets/img/picHold.png" alt="" />
                                <img v-if="!holdPassport && theme" src="@/assets/img/picHold_dark.png" alt="" />
                                <img v-if="holdPassport" :src="form.data.picHoldPassport.value" />
                            </van-uploader>
                        </div>
                        <div class="uploadBox toast">
                            <p>{{$t('form.kyc.note')}}</p>
                            <p>1.huodun</p>
                            <p>2.{{$t('form.kyc.date')}}</p>
                            <p>3.UID</p>
                        </div>
                    </div>
                    <div class="toast">{{$t('form.kyc.img')}}</div>
                    <div class="btnBox fixed">
                        <van-button size="large" @click="onSubmit" :class="{active: btnStatus}">
                            {{$t('button.public.submit')}}</van-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import lrz from 'lrz';
    import backbar from "@/views/modules/back.vue"

    export default {
        data() {
            return {
                backUrl: {
                    url: 'security'
                },
                cur: 0,
                btnStatus: false,
                documents: [{
                    name: this.$t('form.kyc.idCard')
                }, {
                    name: this.$t('form.kyc.passport')
                }],
                defaultType: 'NationalID', // 身份证
                areaCode: localStorage.getItem('areaCode') || 86,
                form: {
                    data: {
                        picFace: {
                            value: '',
                            isError: true,
                            isDefault: true
                        },
                        picBack: {
                            value: '',
                            isError: true,
                            isDefault: true
                        },
                        picHold: {
                            value: '',
                            isError: true,
                            isDefault: true
                        },
                        picFacePassport: {
                            value: '',
                            isError: true,
                            isDefault: true
                        },
                        picBackPassport: {
                            value: '',
                            isError: true,
                            isDefault: true
                        },
                        picHoldPassport: {
                            value: '',
                            isError: true,
                            isDefault: true
                        },
                    }
                }
            }
        },
        components: {
            backbar
        },
        computed: {
            face() {
                let that = this;
                if (that.form.data && that.form.data.picFace.value) {
                    return true;
                }
                return false;
            },
            back() {
                let that = this;
                if (that.form.data && that.form.data.picBack.value) {
                    return true;
                }
                return false;
            },
            hold() {
                let that = this;
                if (that.form.data && that.form.data.picHold.value) {
                    return true;
                }
                return false;
            },
            facePassport() {
                let that = this;
                if (that.form.data && that.form.data.picFacePassport.value) {
                    return true;
                }
                return false;
            },
            backPassport() {
                let that = this;
                if (that.form.data && that.form.data.picBackPassport.value) {
                    return true;
                }
                return false;
            },
            holdPassport() {
                let that = this;
                if (that.form.data && that.form.data.picHoldPassport.value) {
                    return true;
                }
                return false;
            },
            theme() {
                return this.$store.state.app.theme;
            }
        },
        mounted() {

        },
        watch: {
            "form.data.picHold.value": function () {
                this.form.data.picHold.isDefault = false;
                this.form.data.picHold.isError = !this.form.data.picHold.value;
                this.checkAllForm();
            },
            "form.data.picFace.value": function () {
                this.form.data.picFace.isDefault = false;
                this.form.data.picFace.isError = !this.form.data.picFace.value;
                this.checkAllForm();
            },
            "form.data.picBack.value": function () {
                this.form.data.picBack.isDefault = false;
                this.form.data.picBack.isError = !this.form.data.picBack.value;
                this.checkAllForm();
            },
            "form.data.picHoldPassport.value": function () {
                this.form.data.picHoldPassport.isDefault = false;
                this.form.data.picHoldPassport.isError = !this.form.data.picHoldPassport.value;
                this.checkAllForm();
            },
            "form.data.picFacePassport.value": function () {
                this.form.data.picFacePassport.isDefault = false;
                this.form.data.picFacePassport.isError = !this.form.data.picFacePassport.value;
                this.checkAllForm();
            },
            "form.data.picBackPassport.value": function () {
                this.form.data.picBackPassport.isDefault = false;
                this.form.data.picBackPassport.isError = !this.form.data.picBackPassport.value;
                this.checkAllForm();
            }
        },
        methods: {
            checkAllForm() {
                let arr = [];
                if (this.cur == 0) {
                    this.btnStatus = false;
                    arr = [
                        this.$data.form.data.picHold.isDefault,
                        this.$data.form.data.picHold.isError,
                        this.$data.form.data.picBack.isDefault,
                        this.$data.form.data.picBack.isError,
                        this.$data.form.data.picFace.isDefault,
                        this.$data.form.data.picFace.isError
                    ];
                    let validate = true;
                    for (let i in arr) {
                        if (arr[i]) {
                            validate = false;
                        }
                    }
                    this.btnStatus = validate;
                } else if (this.cur == 1) {
                    this.btnStatus = false;
                    arr = [
                        this.$data.form.data.picHoldPassport.isDefault,
                        this.$data.form.data.picHoldPassport.isError,
                        this.$data.form.data.picBackPassport.isDefault,
                        this.$data.form.data.picBackPassport.isError,
                        this.$data.form.data.picFacePassport.isDefault,
                        this.$data.form.data.picFacePassport.isError
                    ];
                    let validate = true;
                    for (let i in arr) {
                        if (arr[i]) {
                            validate = false;
                        }
                    }
                    this.btnStatus = validate;
                }
            },
            onChoose(index) {
                this.cur = index;
                switch (index) {
                    case 0:
                        this.defaultType = 'NationalID';
                        break;
                    case 1:
                        this.defaultType = 'Passport';
                        break;
                    default:
                        this.defaultType = 'NationalID';
                        break;
                }
            },
            oversize() {
                this.$mts.toast(that.$t('message.kyc.oversize'));
            },
            // onRead(file, detail) {
            //     // 开始上传图片
            //     let that = this;
            //     let data = new FormData();
            //     data.append('file', file.file);
            //     data.append('type', 'kyc');
            //     data.append('name', detail.name)
            //     that.$mts.upload({
            //         url: 'api/push/image/upload',
            //         data,
            //         success(response) {
            //             if (response.status == 200) {
            //                 that.form.data[detail.name].value = response.data.data;
            //             }
            //         }
            //     });
            // },
            onRead(file, detail) {
                // console.log(file)
                // 开始上传图片
                const that = this;
                let data = new FormData();
                lrz(file.file, {
                    quality: 0.5
                })
                    .then(res => {
                        data = res.formData;
                        data.append('type', 'kyc');
                        data.append('name', detail.name);
                        that.$mts.upload({
                            url: 'api/push/image/upload',
                            data,
                            success(response) {
                                if (response.status == 200) {
                                    that.form.data[detail.name].value = response.data.data;
                                }
                            }
                        });
                })
                    .catch(() => {
                        data.append('file', file.file);
                        data.append('type', 'kyc');
                        data.append('name', detail.name)
                        that.$mts.upload({
                            url: 'api/push/image/upload',
                            data,
                            success(response) {
                                if (response.status == 200) {
                                    that.form.data[detail.name].value = response.data.data;
                                }
                            }
                        });
                });
            },
            onSubmit() {
                let that = this;
                if(that.cur == 0){
                //     if(that.btnStatus){
                        that.$mts.posts({
                            url:'api/me/security/kyc',
                            data:{
                                areaCode:that.areaCode,
                                firstName: that.$route.query.param.firstName.value,
                                lastName: that.$route.query.param.lastName.value,
                                documentNumber: that.$route.query.param.documentNumber.value,
                                frontSide: that.form.data.picFace.value,
                                backSide: that.form.data.picBack.value,
                                documentAndFace: that.form.data.picHold.value,
                                documentType: that.defaultType
                            },success(response){
                                if (response.data.status == 200) {
                                    that.$mts.toast(that.$t('message.kyc.s3'));
                                    that.$router.push({name: 'security'});
                                } else {
                                    that.$mts.toast(response.data.message);
                                }
                            }
                        });
                    // }else{
                    //     that.$mts.toast(that.$t('message.kyc.allImg'));
                    // }
                }else if(that.cur == 1){
                    // if(that.btnStatus){
                        that.$mts.posts({
                            url:'api/me/security/kyc',
                            data:{
                                areaCode:that.areaCode,
                                firstName: that.$route.query.param.firstName.value,
                                lastName: that.$route.query.param.lastName.value,
                                documentNumber: that.$route.query.param.documentNumber.value,
                                frontSide: that.form.data.picFacePassport.value,
                                backSide: that.form.data.picBackPassport.value,
                                documentAndFace: that.form.data.picHoldPassport.value,
                                documentType: that.defaultType
                            },success(response){
                                if (response.data.status == 200) {
                                    that.$mts.toast(that.$t('message.kyc.s3'));
                                    that.$router.push({'name': 'security'});
                                }
                            }
                        });
                    // }else{
                    //     that.$mts.toast(that.$t('message.kyc.allImg'));
                    // }
                }
            }
        }
    }
</script>