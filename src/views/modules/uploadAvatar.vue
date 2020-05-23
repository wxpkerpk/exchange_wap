<template>
<div class="uploadAvatar flexpage" :class="{active:$store.state.app.uploadAvatar.show}">
    <div class="loading" v-if="submiting"><span>{{$t('other.imgUpload')}}</span></div>
    <div class="goback" @click="closeMe()"><van-icon name="cross" /></div>
    <div class="pageContent">
        <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :fixedBox="option.fixedBox"
            @realTime="realTime"
            @imgLoad="imgLoad"
        />
    </div>
    <div class="downconfig">
        <label class="downconfiBtn" for="uploads">{{$t('other.chooseImg')}}</label>
        <input type="file" id="uploads" :value="imgFile" class="downfile" :accept="accept" @change="uploadImg($event, 1)">
        <input type="button" class="sureBtn" :value="$t('other.uploadSure')" @click="finish('blob')">
    </div>
</div>
</template>
<script>
    import { VueCropper }  from 'vue-cropper' 
    export default {
        data(){
            return {
                submiting:false,
                accept:"",
                headImg:'',
                //剪切图片上传
                crap: false,
                previews: {},
                option: {
                    img: '',
                    outputSize:1, //剪切后的图片质量（0.1-1）
                    full: false,//输出原图比例截图 props名full
                    outputType: 'png',
                    canMove: true, 
                    original: false, 
                    canMoveBox: true, 
                    autoCrop: true, 
                    autoCropWidth: 400, 
                    autoCropHeight: 400, 
                    canScale:false,
                    fixedBox: true 
                }, 
                token: !localStorage.getItem('token')?'':localStorage.getItem('token'),
                fileName:'',  //本机文件地址
                downImg: '#',
                imgFile:'',
                uploadImgRelaPath:'', //上传后的图片的地址（不带服务器域名）
            }
        },
        props:{

        },
        watch:{
            "$store.state.app.uploadAvatar.show":function(cur,old){
                if(cur){ //打开
                    
                }else{  //关闭
                    
                }
            }
        },
        components: {
            VueCropper
        },
        mounted(){
            var u = navigator.userAgent;
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            if(isiOS){
                this.accept = "image/png, image/jpeg, image/gif, image/jpg";
            }else{
                this.accept = "image/*";
            }
        },
        methods:{
            closeMe(){
                this.$store.state.app.uploadAvatar.show = false;
                this.submiting = false;
            },
            //放大/缩小
            changeScale(num) { 
                num = num || 1; 
                this.$refs.cropper.changeScale(num); 
            }, 
            //左旋转
            rotateLeft() { 
                this.$refs.cropper.rotateLeft(); 
            }, 
            //右旋转
            rotateRight() { 
                this.$refs.cropper.rotateRight(); 
            }, 
            //上传图片（点击上传按钮）
            finish(type) { 
                let _this = this;
                if(!this.option.img){
                    _this.$mts.toast(_this.$t('other.goChoose'));
                }else{
                    _this.submiting = true;
                }
                if(!_this.submiting) return;

                let formData = new FormData();
                // 输出 
                if (type === 'blob') { 
                    _this.$refs.cropper.getCropBlob((data) => { 
                        let img = window.URL.createObjectURL(data)
                        _this.model = true; 
                        _this.modelSrc = img; 
                        // 文件路径
                        formData.append("type", "user");
                        formData.append("name", _this.fileName);
                        formData.append("file",data);
                        _this.$mts.upload({
                            url:"api/push/image/upload/?fileName="+_this.fileName,
                            data:formData,
                            success(response){
                                if(response.data.status == 200){
                                    _this.submiting = false;
                                    _this.$emit('uploadsuccess', response.data.data);
                                }
                            }
                        });
                    }) 
                } else { 
                    this.$refs.cropper.getCropData((data) => { 
                        this.model = true; 
                        this.modelSrc = data; 
                        _this.submiting = false;
                    }) 
                } 
            }, 
            // 实时预览函数 
            realTime(data) { 
                this.previews = data 
            }, 
            //下载图片
            down(type) { 
                var aLink = document.createElement('a') 
                aLink.download = 'author-img' 
                if (type === 'blob') { 
                    this.$refs.cropper.getCropBlob((data) => { 
                        this.downImg = window.URL.createObjectURL(data)
                        aLink.href = window.URL.createObjectURL(data) 
                        aLink.click() 
                    }) 
                } else { 
                    this.$refs.cropper.getCropData((data) => { 
                        this.downImg = data;
                        aLink.href = data; 
                        aLink.click() 
                    }) 
                } 
            }, 
            //选择本地图片
            uploadImg(e, num) { 
                var _this = this;
                //上传图片 
                var file = e.target.files[0] 
                _this.fileName = file.name;
                if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) { 
                    _this.$mts.toast(_this.$t('other.imgType'));
                    return false;
                } 

                if(file.size/1024 > 1024 * 5){
                    _this.$mts.toast(_this.$t('other.imgSize'))
                    return false;
                }
                var reader = new FileReader(); 
                reader.onload =(e) => { 
                    let data; 
                    if (typeof e.target.result === 'object') { 
                        // 把Array Buffer转化为blob 如果是base64不需要 
                        data = window.URL.createObjectURL(new Blob([e.target.result])) 
                    } 
                    else { 
                        data = e.target.result 
                    }
                    if (num === 1) { 
                        _this.option.img = data 
                    } else if (num === 2) { 
                        _this.example2.img = data 
                    } 
                } 
                // 转化为base64 
                // reader.readAsDataURL(file) 
                // 转化为blob 
                reader.readAsArrayBuffer(file);
            }, 
            imgLoad (msg) { 
            
            }
        }
    }
</script>

<style lang="scss">
    .uploadAvatar .loading{background: rgba(0,0,0,0.5);position: fixed;left:0;top:0;right:0;bottom:0;z-index:10; display: flex;justify-content: center;align-items: center;color:#fff;}
    .uploadAvatar .loading span{background: rgba(0,0,0,0.8);border-radius: 5px;padding:2vw 5vw;}

    .flexpage{display:flex;flex-direction:column;height:100vh;width:100vw;}
    .pageContent{flex:1;}

    .uploadAvatar{position: fixed;left:0;top:0;right:0;bottom:0;z-index:200;width:100vw;height:100vh;background: rgba(0,0,0,0.9); transition:ease all 0.2s;transform:scale(0);
        &.active{
            transform:scale(1);
        }
        .downconfig{height:10vw;display: flex;padding:3vw;justify-content:space-between;align-items:center;background:#fff;
            .downconfiBtn{height:10vw;display: flex;justify-content:center;align-items:center;background:none;color:#2064d1;border-radius: 5px;}
            .downfile{position:absolute; clip:rect(0 0 0 0);}
            .sureBtn{height:10vw;border:0;font-size:4vw;padding:0 5vw;
            background: #2064d1;color:#fff;border-radius: 5px;
            }
        }
        .goback{position: absolute;left:3vw;top:3vw;background: rgba(0,0,0,0.3);color:#fff;display: flex;justify-content:center;align-items:center;width:8vw;height:8vw;z-index:200;border-radius: 1000px;
            i{font-size: 4vw;}
        }
    }
</style>
