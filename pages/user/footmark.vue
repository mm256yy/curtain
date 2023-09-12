<template>
	<view class="content">
		<view class="footBox">
			<view class="markBox" v-for="(value,key) in specifications" :key="key">
				<view class="time">{{Changetime(key)}}</view>
				<view class="goods_list_box">
					<view class="goods" ref="info" v-for="(item2,index2) in value.children" :key="index2">
						<view class="box5" @click="Todetail(item2.dataId)">
							<view class="image">
								<image class="goodsImg" :src="item2.previewUrl" mode="aspectFill"></image>
							</view>
							<view class="info">
								<view class="title">{{item2.goodsName}}</view>
								<view class="price">
									<text class="price-text">价格:</text><text
										class="mini_price">¥{{item2.goodsPrice}}</text>
								</view>
								<view class="add price-text">
									<view>{{timestampToTime2(item2.createTime)}}浏览</view>
								</view>
							</view>
						</view>
						<view class="del-icon" @click="delFootlist(item2.id)">
							<u-icon name="trash-fill" color="#909399" size="20"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
<!-- 		<view class="none_list_box" v-if="specifications===null">
			<image src="../../static/images/none_data_icon_02.png" lazy-load="true" mode="widthFix"></image>
			<span>暂无浏览记录</span>
		</view> -->
		<backtop ref="VT" :scrollTop="top"></backtop>
	</view>
</template>

<script>
	import JSONBig from 'json-bigint'
	export default {
		data() {
			return {
				businessId: '',
				specifications: '',
				top:0
			}
		},
		onLoad() {

		},
		onShow() {
			let self = this;
			self.getbussinessId()
			// self.getfootList();
		},
		onPageScroll(e) {
			this.$refs.VT.topData(e.scrollTop)
		},
		methods: {
			timestampToTime2(timestamp) {
				let self = this;
				let date = new Date(timestamp)
				let Y = date.getFullYear() + '-'
				let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
				let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
				let H = date.getHours() + ':'
				let M2 = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
				let S = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
				return Y + M + D
				// self.creatOrderTime=Y + M + D + H + M2 + S
			},
			Changetime(liutime) {
				let time = liutime;
				time = this.dayjs(time).format("YYYY-MM-DD");
				return time
			},
			getbussinessId() {
				let self = this;
				self.Get2('/api/plugs/getBusinessInfo').then(res => {
					if (res.code == 200) {
						let list = res.body;
						let listArr = [];
						list.forEach((item) => {
							listArr.push(JSONBig.parse(item.jsonData))
						})
						self.BusinessList = listArr;
						self.businessId = self.BusinessList[0].businessId;
						// this.initData();
						self.getfootList();
					}
				})
			},
			getfootList() {
				let self = this;
				let postData = {
					businessId: self.businessId,
					page: 1,
					size: 50
				}
				self.Get('/api/plugs/searchPlugsFootmarkListUserId', postData).then(res => {
					if (res.code == 200) {
						let tempSpecifications = res.body;
						let specifications1 = {}
						for (let key in tempSpecifications) {
							let obj1 = {
								start: 0,
								children: tempSpecifications[key]
							}
							specifications1[key] = obj1
						}
						this.specifications = specifications1;
						// console.log(this.specifications,'kkkkkk')
					}
				})
			},
			delFootlist(i) {
				let self = this;
				let postdata = `ids=${i}`
				self.Post('/api/plugs/delPlugsFootmark', postdata).then(res => {
					if (res.code == 200) {
						uni.showModal({
							title: '提示',
							content: '确定要删除吗',
							success: function(res) {
								if (res.confirm) {
									self.getfootList();
									self.getbussinessId();
								} else if (res.cancel) {
									// console.log('用户点击取消');
								}
							}
						});
					}
				})
			},
			Todetail(id){
				uni.navigateTo({
					url:`/pages/index/detail?id=${id}`
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	page {
		background-color: #fff;
	}
	.content{
		width: 100%;
		overflow-x: hidden;
	}
	.markBox {
		margin-bottom: 30rpx;

		.time {
			width: 100%;
			height: 60rpx;
			line-height: 60rpx;
			color: #999;
			padding-left: 20rpx;
			font-size: 24rp;
			border-bottom: 3rpx solid #f5f5f5;
		}
	}

	.goods_list_box {
		width: 100%;

		.goods {
			width: 100%;
			height: 180rpx;
			padding: 20rpx;
			// margin-bottom: 5rpx;
			border-bottom: 3rpx solid #f5f5f5;
			display: flex;
			box-sizing: border-box;
			background-color: #fff;
			position: relative;

			.box5 {
				display: flex;
				width: 94%;
				border-right: 3rpx dashed #afb9c1;
			}

			.image .goodsImg {
				width: 140rpx;
				height: 140rpx;
				margin-right: 20rpx;
				border-radius: 16rpx;
			}

			.info {
				// width:570rpx;
				// background-color: aliceblue;
				box-sizing: border-box;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.title {
					color: #1c1c1c;
					font-size: 24rpx;
					display: -webkit-box; //将对象作为弹性伸缩盒子模型显示
					-webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式
					-webkit-line-clamp: 2; //一个块元素显示的文本的行数
					overflow: hidden; //溢出隐藏
				}
			}

			.del-icon {
				position: absolute;
				bottom: 24rpx;
				right: 20rpx;
				width: 30rpx;
				height: 30rpx;
				// background-color: #afb9c1;
			}

			// display: flex;
			// flex-direction: column;
			// justify-content: space-between;
			.price {
				margin-bottom: 12rpx;
			}

			.price-text {
				font-size: 24rpx;
				color: #999;
			}

			.line {
				margin: 0 10rpx;
			}

			.mini_price {
				color: #f1433f;
				font-size: 24rpx;
				font-weight: 600;
				// margin-bottom: 10rpx;
			}

			.add {
				display: flex;
				justify-content: space-between;
			}

			// border-radius: 20rpx;
		}
	}
</style>
