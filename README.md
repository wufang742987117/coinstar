hft_webapp - Front-end()
==============================
The front end of the exchange
A full implementation of szzc exchange using Node.js, and AngularJS

打包流程
1.安装nodejs和npm包管理器
Ubuntu apt-get命令安装
	sudo apt-get install nodejs
	sudo apt-get install npm
备注：其他安装方式，请查询官方文档资料
2.安装打包工具gulp
	npm install --global gulp
3.安装依赖
	npm install
4.打包
	1.打包 第一步：gulp 
	       第二步：gulp share:test   ios下载二维码覆盖 （测试 gulp share:test;生产:gulp share:master)

	2.将./dist文件夹下面的文件发布到服务器上

备注：以上1-2两步是安装工具，只需要执行一次，3步是安装依赖，如果项目引入新依赖需要重新安装，反之，4步是每次代码更新必须执行

		

