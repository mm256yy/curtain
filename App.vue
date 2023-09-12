<script>
	import Vue from 'vue';
	import Links from 'static/utils/links.js';
	import Request from 'static/utils/request.js';
	export default {
		onLaunch: function() {
			let self = this;
			/****
				* 封装常用组件，在其他页面可直接使用 this.xxx 调用，比如：
				* this.Url.xxx 为API接口链接
				* this.Get 为Get的请求方法
				* this.Post 为Post的请求方法
				* this.Upload 为上传的请求方法
				* this.Config 为请求模版配置的方法（不同的模版用不同的接口，如果该模版使用后台管理则会用到该接口）
			*****/
			Vue.prototype.Url = Links.links;
			Vue.prototype.Get = Request.get;
			Vue.prototype.Get2 = Request.get2;
			Vue.prototype.Post = Request.post;
			Vue.prototype.Post2 = Request.post2;
			Vue.prototype.Post3 = Request.post3;
			Vue.prototype.Upload = Request.upload;
			Vue.prototype.Config = Request.config;
			uni.getSystemInfo({
				success: function(e) {
					/****
						* 封装一些日常会用到的计算组件
						* this.windowWidth 为设备宽度
						* this.WindowHeight 为设备高度
						* this.IphoneX 判断该设备是不是iphoneX（留海）
						* MP-WEIXIN 下面的方法仅在微信小程序端生效，具体请见微信API接口说明
					*****/
					Vue.prototype.windowWidth = e.windowWidth;
					Vue.prototype.WindowHeight = e.windowHeight;
					Vue.prototype.IphoneX = e.model.search("iPhone X")>=0?0:e.model.search("iPhone 11")>=0?0:-1;
					// #ifdef MP-WEIXIN
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.StatusBarHeight = e.statusBarHeight+custom.height;
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.SafeHeight = e.safeArea.height;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif
				}
			});
			// #ifdef MP-WEIXIN
				// self.$options.weiLogin();//调用微信登录
				// self.$options.getShopInfo();//获取店铺信息
			// #endif
			// self.weiLogin();
		},
		//获取店铺信息
		getShopInfo() {
			let self = this;
			Vue.prototype.Get(Vue.prototype.Url.shopInfo, {}).then(res => {
				if (res.code === 0) {
					uni.setStorage({key: '__ddminiShopInfo',data: res.data});
				}else{
					uni.removeStorageSync('__ddminiShopInfo');
				}
			});
		},
		// weiLogin(){
		// 	let self = this;
		// 	let token = uni.getStorageSync('__ddminiUserInfo').accessToken;
		// 	if(token==null){
		// 		uni.navigateTo({
		// 			url:'/pages/user/login'
		// 		})
		// 	}
		// },
		//微信登录
		wechatLogin() {
			// let self = this;
			// let token = uni.getStorageSync('__ddminiUserInfo').accessToken;
			// if(token==null){
			// 	uni.navigateTo({
			// 		url:'/pages/user/login'
			// 	})
			// }
			// if(token){
			// 	Vue.prototype.Get(Vue.prototype.Url.checkToken, {}).then(res => {
			// 		if (res.code === 0) {
			// 			self.globalData.user = true;
			// 		}else{
			// 			self.globalData.user = false;
			// 			uni.removeStorageSync('__ddminiUserInfo');
			// 			self.wechatLogin();
			// 		}
			// 	});
			// }else{
			// 	uni.login({
			// 	    success: function(wes) {
			// 			provider: 'weixin',
			// 			Vue.prototype.Get(Vue.prototype.Url.wechatLogin, {code: wes.code}).then(res => {
			// 				if(res.code === 1e4){
			// 					self.globalData.user = false;
			// 					uni.removeStorageSync('__ddminiUserInfo');
			// 					return
			// 				}
			// 				if(res.code === 0){
			// 					self.globalData.user = true;
			// 					uni.setStorage({key: '__ddminiUserInfo',data: res.data});
			// 				}
			// 			});
			// 	    }
			// 	});
			// }
		},
		globalData: {
			user: false,
			getPathTap(path){
				if(!path){
					return uni.showToast({title: '敬请关注', icon: 'none'});
				}
				let tabbar = [
					'pages/index/index',
					'pages/category/category',
					'pages/cart/cart',
					'pages/user/index'
					
				]
				let test = tabbar.filter(itm => path.indexOf(itm)>=0);
				if(test.length===0){
					if(!getApp().globalData.user){
						return uni.navigateTo({url: '/pages/user/login'});
					}
					uni.navigateTo({url: path});
				}else{
					uni.switchTab({url: path});
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	page {
		font-size: 28rpx;
		background-color: #f5f5f5;
		.content {
			height: 100%;
		}
	}
	
	image {
		width: 100%;
		height: 100%;
		display: block;
	}

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}
	
	.none_list_box{
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		height: 70vh;
		image{
			height: 400rpx;
			width: 400rpx;
		}
		span{
			color: #999;
			font-size: 28rpx;
		}
	}
	
</style>
