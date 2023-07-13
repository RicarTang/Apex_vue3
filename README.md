使用vue3构建测试平台前端实战
---
后端地址参考（开发中）：https://github.com/RicarTang/Fastapi_tortoise
## 开发状态
- 开发中
## 技术栈
- Vue3
- element plus，使用自动导入插件
- commentjs
- axios
- vue-router
## 使用
1. 安装依赖
```Bash
npm i
```
2. 添加环境变量
```Bash
echo -e "VITE_API_HOST=http://127.0.0.1:4000\nVITE_TOKEN_TIME=60" > .env.development # -e使转义字符生效
```
3. 启动项目
```Bash
npm run dev
```
