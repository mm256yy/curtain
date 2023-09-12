<template>
	<view class="content">
		<view class="collect-num">
			共<text>{{collectList.length}}个</text>收藏
		</view>
		<view class="goods_box">
			<view class="goods_list_box">
				<view class="goods" v-for="(item, index) in collectList" :key="item.id" >
					<!-- getPathTap('/pages/index/detail?id='+item.id) -->
					<view class="box5"  @click="Todetail(item.dataId)">
						<view class="image">
							<image class="goodsImg" :src="item.previewUrl" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="title">{{item.goodsName}}</view>
							<view class="box">
								<view class="price">
									<text class="price-text">价格:</text><text class="mini_price">¥{{item.goodsPrice}}</text>
								</view>
								<view class="add price-text">
									<view>{{timestampToTime2(item.createTime)}}收藏</view>
								</view>
							</view>
						</view>
					</view>
					
					<view class="del-icon" @click="delCollect(item.id)">
						<u-icon name="trash-fill" color="#909399" size="20"></u-icon>
					</view>
				</view>
			</view>
			<view class="none_list_box" v-if="favoriteList.length===0">
				<image src="../../static/images/none_data_icon_01.png" mode="widthFix"></image>
				<span>暂无收藏商品</span>
			</view>
		</view>
		<backtop ref="VT" :scrollTop="top"></backtop>
	</view>
</template>

<script>
	import JSONBig from 'json-bigint'
	export default{
		data(){
			return{
				collectList:[],
				top:0
			}
		},
		onLoad() {
			
		},
		onPageScroll(e) {
			this.$refs.VT.topData(e.scrollTop)
		},
		onShow() {
			let self=this;
			self.getbussinessId()
		},
		methods:{
			timestampToTime2(timestamp) {
				let self=this;
				let date = new Date(timestamp)
				let Y = date.getFullYear() + '-'
				let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
				let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
				let H = date.getHours() + ':'
				let M2 = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
				let S = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
				return Y + M + D
			},
			getbussinessId(){
				let self=this;
				self.Get2('/api/plugs/getBusinessInfo').then(res => {
					console.log("getBusinessInfo", res)
					if (res.code == 200) {
						let list = res.body;
						let listArr = [];
						list.forEach((item) => {
							listArr.push(JSONBig.parse(item.jsonData))
					    })
						self.BusinessList=listArr;
						self.businessId=self.BusinessList[0].businessId;
						// console.log(self.businessId,'self.businessIdself.businessId')
						// this.getCartList(id)
						// let id = this.ddminiUserInfo.id
						// this.getCartList(id)
						self.getcollectList()
					}
				})
			},
			getcollectList(){
				let self=this;
				let postdata={
					businessId:this.businessId.toString(),
					page:1,
					size:50
				}
				self.Get('/api/plugs/searchPlugsCollectByUserId',postdata).then(res=>{
					if(res.code==200){
						self.collectList=res.body.list;
						// self.collectList = list.filter(itm => itm.dataId === this.goodsDict.id);
						// if(self.collectList.length>0){
						// 	self.is_collect=true;
						// }
					}
				})
			},
			delCollect(i){
				let self=this;
				let postData = `ids=${i}`
				uni.showModal({
					title: '提示',
					content: '确定删除吗',
					success: function (res) {
						if (res.confirm) {
							self.Post('/api/plugs/delPlugsCollect',postData).then(res=>{
								if(res.code==200){
									uni.showToast({
										title:'删除成功'
									})
									self.getcollectList();
								}
							})
						} else if (res.cancel) {
							
						}
					}
				});
			},
			Todetail(i){
				uni.navigateTo({
					url: '/pages/index/detail?id='+i,
				})
			},
			
		}
	}
</script>

<style lang="less" scoped>
	.content{
		width: 100%;
		overflow-x: hidden;
	}
	.collect-num{
		width: 100%;
		height: 80rpx;
		// margin: 20rpx auto;
		margin-bottom: 20rpx;
		padding-left: 20rpx;
		line-height: 80rpx;
		background-color: #fff;
		text{
			color: #f64319 !important;
		}
	}
	.goods_box{
		width: 100%;
	}
	.goods_list_box{
		width: 100%;
		.goods{
			width: 100%;
			height:200rpx ;
			padding: 20rpx;
			margin-bottom: 5rpx;
			display: flex;
			box-sizing: border-box;
			background-color: #fff;
			position: relative;
			.box5{
				display: flex;
				width: 94%;
				border-right: 3rpx dashed #afb9c1;
			}
			.image .goodsImg{
				width: 160rpx;
				height: 160rpx;
				margin-right: 20rpx;
				border-radius: 16rpx;
			}
			.info{
				// width:570rpx;
				// background-color: aliceblue;
				box-sizing: border-box;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.title{
						color: #1c1c1c;		
						font-size: 28rpx;
						display: -webkit-box; //将对象作为弹性伸缩盒子模型显示
						-webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式
						-webkit-line-clamp: 2; //一个块元素显示的文本的行数
						overflow: hidden; //溢出隐藏
					}
			}
			.del-icon{
				position: absolute;
				bottom: 24rpx;
				right: 20rpx;
				width: 30rpx;
				height: 30rpx;
				// background-color: #afb9c1;
			}
			.box{
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.price{
					margin-bottom: 12rpx;
				}
				.price-text{
					font-size: 24rpx;
					color: #999 ;
				}
				.line{
					margin:0 10rpx;
				}
				.mini_price{
					color: #f1433f;
					font-size: 28rpx;
					font-weight: 600;
					// margin-bottom: 10rpx;
				}
				.add{
					display: flex;
					justify-content: space-between;
				}
			}
			// border-radius: 20rpx;
		}
	}
</style>