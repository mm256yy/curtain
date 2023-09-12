<template>
	<view class="content" :style="{backgroundColor: template.color.back_color}">
		<view class="address_list">
			<u-swipe-action>
				<u-swipe-action-item v-for="(item, index) in addressList" :key="item.order" :options="options" @click="delAddress(index)">
					<view class="label box_shadow" @click="editAddressTap(index)">
						<view v-if="item.default" class="stu">
							<span :style="{backgroundColor: template.color.temp_color}">默认</span>
						</view>
						<view class="tit">{{item.name}}<span>{{item.mobile}}</span></view>
						<view class="txt">{{item.province}}{{item.city}}{{item.district}}{{item.address}}</view>
					</view>
				</u-swipe-action-item>
			</u-swipe-action>
			<view class="none_list_box" v-if="addressList.length===0">
				<image src="../../static/images/none_data_icon_01.png" mode="widthFix"></image>
				<span>暂无地址信息</span>
			</view>
		</view>
		<view class="seat_box">
			<view class="seat"></view>
		</view>
		<view class="footer">
			<view class="label">
				<view class="button" @click="addAddress()" :style="{backgroundColor: template.color.temp_color}">添加地址</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				template: uni.getStorageSync('__ddminiTemplateConfig'),
				type: '',
				addressList: [],
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#fa3534'
					}
				}]
			}
		},
		onShow() {
			let self = this;
			self.getAddressList();
		},
		onLoad(e){
			let self = this;
			if(e.type){
				self.type = e.type;
			}
		},
		methods: {
			getAddressList(){
				let self=this;
				let id=uni.getStorageSync('__ddminiUserInfo').id;
				self.Get('/api/user/searchUserInfoById',{"userId":id}).then(res=>{
					if(res.code==200){
						let list=res.body.receiveAddressJson;
						if(list!='' && list!=null){
							self.addressList=JSON.parse(list)
						}
						// console.log(self.addressList,'地址列表')
					}
				})
			},
			editAddressTap(data){
				let self = this;
				console.log(data,'下标')
				// let list= self.addressList[data]
				// console.log(list,'dzdzdzdzddzdzdzd')
				// uni.setStorage({
				// 	key: '__addeslist',
				// 	data: list
				// });
				if (self.type == 'select') {
					uni.$emit('selectAddress', data);
					uni.navigateBack();
					return
				}else{
					uni.navigateTo({url: `/pages/user/changeAddress?id=${data}`});
				}
				
			},
			addAddress(){
				uni.navigateTo({
					url:'/pages/user/addressEdit'
				})
			},
			clickAddressTap(e){
				let self = this;
				let id = self.addressList[e.index].id;
				self.delAddress(id);
			},
			delAddress(i) {
				let self = this;
				uni.showModal({
					title: '删除地址',
					content: '地址删除后不可恢复，是否删除该地址？',
					success(res) {
						if(res.confirm){
							let list2=self.addressList
							let list=list2.splice(i,1);
							console.log(list2,'list2');
							let postData={
								"receiveAddressJson":JSON.stringify(list2)
							}

							console.log(postData,'postData')
							self.Post3('/api/user/updateUserInfo',postData ).then(res => {
								if(res.code === 200){
									uni.showToast({title: '地址删除成功'});
									self.getAddressList();
								}else{
									uni.showModal({
										content: res.mag,
										showCancel: false
									});
								}
							})
						}
					}
				})
			},
			provinceText(text){
				if(text){
					let str = text.replace(/,/g, '');
					return str
				}
			}
		}
	}
</script>

<style lang="less">
	.content{
		padding-top: 30rpx;
	}
	page{
		width: 100%;
		height: 100%;
		background-color: #fff;
	}
	.address_list{
		// padding-top: 30rpx;
		.u-swipe-action{
			width: 92%;
			margin: 0 auto;
			.u-swipe-action-item{
				width: 100%;
				background-color: #fff;
				border-radius: 20rpx;
				box-shadow: 0px 0px 8px 0px rgba(207, 207, 207, 0.5);
				margin-bottom: 30rpx;
			}
		}
		.label{
			padding: 20rpx 20rpx;
			.stu{
				span{
					background-color: #4395ff;
					color: #fff;
					padding: 2rpx 14rpx;
					font-size: 24rpx;
					border-radius: 10rpx;
				}
			}
			.tit{
				font-size: 32rpx;
				padding: 12rpx 0;
				font-weight: bold;
				color: #1c1c1c;
				span{
					font-size: 30rpx;
					font-weight: normal;
					padding-left: 20rpx;
				}
			}
			.txt{
				color: #666;
				font-size: 28rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}
	.footer{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 100;
		padding-bottom: env(safe-area-inset-bottom);
		.label{
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 120rpx;
			width: 100%;
			.button{
				width: 80%;
				margin: 0 auto;
				height: 80rpx;
				border-radius: 100rpx;
				color: #fff;
				font-size: 32rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #F54319;
			}
		}
	}
</style>
