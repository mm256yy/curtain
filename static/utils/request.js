import JSONBig from 'json-bigint';
// const domainLinks = 'http://192.168.31.55:7001';
const domainLinks ='https://api.daccf.com';
// const domainLinks = 'https://api.tfwangluo.com';
function serverGet(url, data) {
	let promise = new Promise((resolve,reject) => {
		// let token = uni.getStorageSync('__ddminiUserInfo').token;
		let headers = {
			"testToken": "2gq72h2qrbhx256y0167uf5wd64ls55u",
			"BGDEBUG": 0,
			"requestType": "web",
			"Authorization": uni.getStorageSync('__ddminiUserInfo').accessToken || "",
			"Content-Type": "application/x-www-form-urlencoded",
			"ADMIN_ID": '1',
			"user_service_token": "ax001"
		};
		let postData = data;
		uni.request({
			url: domainLinks + url,
			data: postData,
			method: 'GET',
			header: headers,
			success: function(res) {
				let data = res.data;
				if (data.code == 200) {
					resolve(data);
				} else if (data.code == 11001) {
					uni.showToast({
						icon: 'none',
						title: '登陆过期，请重新登陆'
					})
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/user/login'
						})
					}, 1000)
				} else {
				 uni.showToast({
						icon: 'none',
						title: data.msg
					})
				}
			},
			fail(res) {
				// 失败处理
				reject(res);
			}
		})
	});
	return promise;
}
function serverGet2(url, data) {
        let promise = new Promise((resolve,reject) => {
                // let token = uni.getStorageSync('__ddminiUserInfo').token;
                let headers = {
                        "testToken": "2gq72h2qrbhx256y0167uf5wd64ls55u",
                        "BGDEBUG": 0,
						"requestType": "web",
                        "Authorization": uni.getStorageSync('__ddminiUserInfo').accessToken || "",
                        "Content-Type": "application/x-www-form-urlencoded",
                        "ADMIN_ID": '1',
                        "user_service_token": "ax001"
                };
                // if(token){
                //         headers.authorization = token;
                // }
                let postData = data;
				uni.showLoading({
					title:'加载中...'
				})
                uni.request({
                        url: domainLinks + url,
                        data: postData,
                        method: 'GET',
                        header: headers,
                        dataType: 'string',//手动处理19位数字精度问题
						success: function(res) {
							uni.hideLoading()
							let data =JSONBig.parse(res.data);
							if (data.code == 200) {
								resolve(data);
							} else if (data.code == 11001) {
								uni.showToast({
									icon: 'none',
									title: '登陆过期，请重新登陆'
								})
								setTimeout(() => {
									uni.navigateTo({
										url: '/pages/user/login'
									})
								}, 1000)
							} else {
							 uni.showToast({
									icon: 'none',
									title: data.msg
								})
							}
						},
						fail(res) {
							// 失败处理
							reject(res);
						}
                })
        });
        return promise;
}


function serverPost(url, data) {
	let promise = new Promise((resolve,reject) => {
		// let token = uni.getStorageSync('__ddminiUserInfo').token;
		let headers = {
			"testToken": "2gq72h2qrbhx256y0167uf5wd64ls55u",
			"BGDEBUG": 0,
			"requestType": "web",
			"Authorization": uni.getStorageSync('__ddminiUserInfo').accessToken || "",
			"Content-Type": "application/x-www-form-urlencoded",
			"ADMIN_ID": '1',
			"user_service_token": "ax001"
		};
		// if(token){
		// 	headers.authorization = token;
		// }
		let postData = data;
		// uni.showLoading({
		// 	title:'加载中...'
		// })
		uni.request({
			url: domainLinks + url,
			data: postData,
			method: 'POST',
			header: headers,
			success: function(res) {
				let data = res.data;
				if (data.code == 200) {
					resolve(data);
				} else if (data.code == 11001) {
					uni.showToast({
						icon: 'none',
						title: '登陆过期，请重新登陆'
					})
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/user/login'
						})
					}, 1000)
				} else {
				 uni.showToast({
						icon: 'none',
						title: data.msg
					})
				}
			},
			fail(res) {
				// 失败处理
				reject(res);
			}
		})
	});
	return promise;
}

function serverPost2(url, data) {
	let promise = new Promise((resolve,reject) => {
		// let token = uni.getStorageSync('__ddminiUserInfo').token;
		let headers = {
			"testToken": "2gq72h2qrbhx256y0167uf5wd64ls55u",
			"BGDEBUG": 0,
			"requestType": "web",
			"Authorization": uni.getStorageSync('__ddminiUserInfo').accessToken || "",
			"Content-Type": "application/json",
			"ADMIN_ID": '1',
			"user_service_token": "ax001",
			// "bussinessId": uni.getStorageSync('__shoplistInfo')[0].businessId 
		};
		// if(token){
		// 	headers.authorization = token;
		// }
		let postData = data;
		// uni.showLoading({
		// 	title:'加载中...'
		// })
		uni.request({
			url: domainLinks + url,
			data: postData,
			method: 'POST',
			header: headers,
			success: function(res) {
				let data = res.data;
				if (data.code == 200) {
					resolve(data);
				} else if (data.code == 11001) {
					uni.showToast({
						icon: 'none',
						title: '登陆过期，请重新登陆'
					})
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/user/login'
						})
					}, 1000)
				} else {
				 uni.showToast({
						icon: 'none',
						title: data.msg
					})
				}
			},
			fail(res) {
				// 失败处理
				reject(res);
			}
		})
	});
	return promise;
}

function serverPost3(url, data) {
	let promise = new Promise((resolve,reject) => {
		// let token = uni.getStorageSync('__ddminiUserInfo').token;
		let headers = {
			// 'template-key': templateKey, //模版服务码
			// 'miniapps-key': uni.getAccountInfoSync().miniProgram.appId, //小程序AppID
			"testToken": "2gq72h2qrbhx256y0167uf5wd64ls55u",
			"BGDEBUG": 0,
			"requestType": "web",
			"Authorization": uni.getStorageSync('__ddminiUserInfo').accessToken || "",
			"Content-Type": "application/json",
			"ADMIN_ID": '1',
			"user_service_token": "ax001"
		};
		data.userServiceToken = "ax001"

		let postData = data;

		// console.log("serverPost3 PostData", postData)
		// uni.showLoading({
		// 	title:'加载中...'
		// })
		uni.request({
			url: domainLinks + url,
			data: postData,
			method: 'POST',
			header: headers,
			success: function(res) {
				let data = res.data;
				if (data.code == 200) {
					resolve(data);
				} else if (data.code == 11001) {
					uni.showToast({
						icon: 'none',
						title: '登陆过期，请重新登陆'
					})
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/user/login'
						})
					}, 1000)
				} else {
				 uni.showToast({
						icon: 'none',
						title: data.msg
					})
				}
			},
			fail(res) {
				// 失败处理
				reject(res);
			}
		})
	});
	return promise;
}

function serverUpload(url, data) {
	let promise = new Promise((resolve,reject) => {
		// let token = uni.getStorageSync('__ddminiUserInfo').token;
		let headers = {
			"testToken": "2gq72h2qrbhx256y0167uf5wd64ls55u",
			"BGDEBUG": 0,
			"requestType": "web",
			"Authorization": uni.getStorageSync('__ddminiUserInfo').accessToken || "",
			"Content-Type": "application/json",
			"ADMIN_ID": '1',
			"user_service_token": "ax001"
		};
		uni.uploadFile({
			url: domainLinks + url,
			filePath: data.file,
			formData:data || {},
			name: 'file',
			dataType:'string',
			header: headers,
			success: function(res) {
				let data =JSONBig.parse(res.data);
				if (data.code == 200) {
					resolve(data);
				} else if (data.code == 11001) {
					uni.showToast({
						icon: 'none',
						title: '登陆过期，请重新登陆'
					})
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/user/login'
						})
					}, 1000)
				} else {
				 uni.showToast({
						icon: 'none',
						title: data.msg
					})
				}
			},
			fail(res) {
				// 失败处理
				reject(res);
			}
		});
	});
	return promise;
}
function templateConfig() {
	let promise = new Promise((resolve) => {
		uni.request({
			url: domainLinks + '/api/template/yipins',
			method: 'GET',
			header: {
				'template-key': templateKey, //模版服务码
				'miniapps-key': uni.getAccountInfoSync().miniProgram.appId, //小程序AppID
			},
			success: function(res) {
				resolve(res.data);
			}
		})
	});
	return promise;
}


module.exports = {
	get: serverGet,
	get2: serverGet2,
	post: serverPost,
	post2: serverPost2,
	post3: serverPost3,
	upload: serverUpload,
	config: templateConfig
}
