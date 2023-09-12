<template>
	<view class="content">
		<view class="address_form">
			<view class="form_box box_shadow">
				<view class="label">
					<view class="title">联系人</view>
					<view class="input">
						<input type="text" v-model="addressData.name" placeholder="请输入联系人姓名"
							placeholder-style="color: #bbb" />
					</view>
				</view>
				<view class="label">
					<view class="title">手机号</view>
					<view class="input">
						<input type="number" :maxlength="11" v-model="addressData.mobile" placeholder="请输入联系人手机号码"
							placeholder-style="color: #bbb" />
					</view>
				</view>
				<view class="label">
					<view class="title">所属区域</view>
					<view class="input">
						<picker mode="region" :value="region" @change="selectRegion">
							<view class="picker">
								<block v-for="(item, index) in region" :key="index">
									<text v-if="index>0">-</text>{{item}}
								</block>
							</view>
						</picker>
					</view>
				</view>
				<view class="label">
					<view class="title">街道信息</view>
					<view class="input">
						<!-- <input type="text" v-model="addressData.address" placeholder="请输入街道门牌信息" style="width: 80%;"
							placeholder-style="color: #bbb" /> -->
						<input  type="text" v-model="addressData.address" placeholder="请输入街道门牌信息" style="width: 80%;" placeholder-style="color: #bbb"/>
						<!-- <input v-else type="text" disabled :value="addressData.address" placeholder="请选择所在位置信息" style="width: 80%;" placeholder-style="color: #bbb" @click="chooseLocationTap()"/> -->
						<view  class="local" @click="chooseLocationTap()">
							<!-- <aicon type="map-pin-line" size="22" color="#F54319"></aicon> -->
							<u-icon name="map-fill" color="#ff5d32" size="28"></u-icon>
						</view>
					</view>
				</view>
				<view class="label">
					<view class="title">默认地址</view>
					<view class="input" style="border: none;">
						<u-switch activeColor="#F54319" v-model="addressData.default" size="20"></u-switch>
					</view>
				</view>
				<view class="button">
					<view class="saveBtn" @click="saveAddress()">保存地址信息</view>
					<view class="saveBtn" style="background-color: #F5431960;" v-if="addressData.id"
						@click="delAddress()">删除地址信息</view>
					<!-- <view class="saveBtn wechat" v-if="!addressData.id" @click="getWechatAdds()">获取微信地址</view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	import qqmap from "@/static/utils/qqmapsdk.js";
	const qqmapsdk = new qqmap({key: 'KEDBZ-NJ7WJ-OOXFM-KGYWA-YSG4O-M5FT4'});
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				region: ['浙江省', '杭州市', '余杭区'],
				addressData:{
					"default": false,
					"address": "",
					"province": "浙江省",
					"city": "杭州市",
					"district": "余杭区",
					"latitude": 0,
					"name": "",
					"mobile": "",
					"longitude": 0,
					"order": 0,
				},
				editAddressStatus: false,
				addressList:[],
				index:'',
				list1:'',
			}
		},
		onLoad() {
			let self = this;
		},
		onShow() {
			let self=this;
			self.getAddressList();
		},
		methods: {
			selectRegion(e) {
				this.region = e.detail.value;
				this.addressData.province=this.region[0];
				this.addressData.city=this.region[1];
				this.addressData.district=this.region[2];
				// this.addressData.region_id = e.detail.code[2];
				// console.log(e,'地址');
			},
			getAddressList(){
				let self=this;
				let id=uni.getStorageSync('__ddminiUserInfo').id;
				self.Get('/api/user/searchUserInfoById',{"userId":id}).then(res=>{
					if(res.code==200){
						let list=res.body.receiveAddressJson;
						if(list!='' && list!=null){
							self.addressList=JSON.parse(list)
						}
						
						// let index=self.index;
						// if(index!=null){
						// self.list1=self.addressList[self.index];
						// 	if(self.list1!=''){
						// 		self.addressData=self.list1;
						// 	}
						// }
						console.log(self.addressList,'地址列表222')
					}
				})
			},
			getWechatAdds() {
				let self = this;
				uni.chooseLocation({
					success: function (res) {
						// console.log('位置名称：' + res.name);
						// console.log('详细地址：' + res.address);
						// console.log('纬度：' + res.latitude);
						// console.log('经度：' + res.longitude);
					}
				});
			},
			editaddreee(){
				let self = this;
				// if(self.index!=''){
				// 	let list2=self.addressList
				// 	let list=list2.splice(self.index,1);
				// 	self.addressList=list2;
				// }
			},
			saveAddress() {
				let self = this;
				let data = self.addressData;
				let time = Date.now();
				self.addressData.order=time;
				// self.editaddreee();
				// console.log(self.addressData.id,'self.addressData.id')
				// if(self.index!=''){
				// 	let list2=self.addressList
				// 	let list=list2.splice(self.index,1);
				// 	self.addressList=list2;
				// }
				// let time = Date.now();
				// self.addressData.id=time;
				if(self.addressData.default==true){
					self.addressList.forEach(item=>{
						if(item.default==true){
							item.default=false
						}
					})
				}
				// console.log(self.addressList,'tttttttt');
				if (!data.name) {
					uni.showModal({
						title: '提示',
						content: '请输入联系人姓名',
						showCancel: false
					});
					return
				} else if (!data.mobile) {
					uni.showModal({
						title: '提示',
						content: '请输入联系人手机',
						showCancel: false
					});
					return
				} else if (!(/^1[3456789]\d{9}$/.test(data.mobile))) {
					uni.showModal({
						title: '手机格式错误',
						content: '请输入正确的手机号码',
						showCancel: false
					});
					return
				} else if (!data.address) {
					uni.showModal({
						title: '地址保存提示',
						content: '请输入详细的街道门牌信息',
						showCancel: false
					});
					return
				} 
				else {
					let list1=[self.addressData]
					let list2=self.addressList;
					let list3=[]
					if(list2.length>0){
						list3=list1.concat(list2)
					}else{
						list3=list1;
					}
					let postData={
						"receiveAddressJson":JSON.stringify(list3)
					}
					self.Post3('/api/user/updateUserInfo',postData ).then(res => {
						if (res.code == 200) {
							uni.showToast({
								title: '地址保存成功'
							});
							// self.getAddressList();
							setTimeout(function () {
								uni.navigateBack();
							}, 500);
						} else {
						    console.log(res)
							
							uni.showToast({
								title: '添加失败',
								duration: 1000,
								icon: 'error'
							})
						}
					});
				}
			},
			// delAddress() {
			// 	let self = this;
			// 	uni.showModal({
			// 		title: '删除地址',
			// 		content: '地址删除后不可恢复，是否删除该地址？',
			// 		success(res) {
			// 			if (res.confirm) {
			// 				self.Get(self.Url.addressDel, {
			// 					id: self.addressData.id
			// 				}).then(res => {
			// 					if (res.code === 0) {
			// 						uni.showToast({
			// 							title: '地址删除成功'
			// 						});
			// 						setTimeout(function() {
			// 							uni.navigateBack();
			// 						}, 500);
			// 					} else {
			// 						uni.showModal({
			// 							content: res.mag,
			// 							showCancel: false
			// 						});
			// 					}
			// 				})
			// 			}
			// 		}
			// 	})
			// },
			chooseLocationTap() {
				let self = this;
				let data = self.addressData;
				uni.chooseLocation({
					latitude: data.latitude || '',
					longitude: data.longitude || '',
					success(res) {
						qqmapsdk.reverseGeocoder({
							location: {
								latitude: res.latitude,
								longitude: res.longitude
							},
							success(qes) {
								let ads = res.address.split('区');
								let str;
								if (ads.length === 1) {
									let ads1 = res.address.split('市');
									str = ads1[ads1.length - 1]
								} else {
									str = ads[1];
								}
								let qdata = qes.result.ad_info;
								self.region = [qdata.province, qdata.city, qdata.district];
								// self.addressData.region_id = qdata.adcode;
								self.addressData.province=qdata.province;
								self.addressData.city=qdata.city;
								self.addressData.district=qdata.district;
								self.addressData.address = str;
								self.addressData.latitude = res.latitude;
								self.addressData.longitude = res.longitude;
							}
						})
					},
					fail(err) {
						self.editAddressStatus = true;
						return uni.showToast({
							title: '选择位置失败，请手动输入',
							icon: 'none'
						});
					}
				})
			}
		}
	}
</script>

<style lang="less">
	page {
		width: 100%;
		height: 100%;
	}
	.content{
		padding-top: 20rpx;
	}
	.address_form {

		// padding-top: 30rpx;
		.form_box {
			width: 92%;
			margin: 0 auto;
			background-color: #fff;
			border-radius: 20rpx;
			padding: 20rpx 0;

			.label {
				display: flex;
				align-items: center;
				height: 120rpx;
				width: 90%;
				margin: 0 auto;

				.title {
					width: 140rpx;
					color: #1c1c1c;
					font-size: 28rpx;
				}

				.input {
					flex: 1;
					height: 70rpx;
					display: flex;
					align-items: center;
					border: 1px solid #efefef;
					border-radius: 10rpx;
					justify-content: space-between;

					input {
						width: 92%;
						height: 100%;
						color: #1c1c1c;
						font-size: 28rpx;
						padding-left: 20rpx;
					}

					.local {
						width: 70rpx;
						height: 70rpx;
						background-color: #efefef;
						display: flex;
						align-items: center;
						justify-content: center;
					}

					picker {
						width: 92%;
						height: 100%;
						line-height: 70rpx;
						color: #1c1c1c;
						font-size: 28rpx;
						padding-left: 20rpx;

						.picker {
							width: 100%;

							text {
								padding: 0 10rpx;
								color: #bbb;
							}
						}
					}
				}
			}

			.button {
				width: 70%;
				margin: 0 auto;
				padding-bottom: 30rpx;

				.saveBtn {
					width: 100%;
					height: 80rpx;
					font-size: 30rpx;
					color: #fff;
					border-radius: 100rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-top: 30rpx;
					// border: 1px solid;
					color: #fff;
					background-color:#ff5d32;
				}

				.wechat {
					background-color: #fff;
					color: #07c160;
					border: 1px solid #07c160;
				}
			}
		}
	}
</style>
