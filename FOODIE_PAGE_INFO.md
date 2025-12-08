# Foodie 登录页面 - 快速参考

## 访问页面

开发环境：`http://localhost:3000/foodie-login`

## 导航入口

在网站顶部导航栏的最右侧已添加 "Foodie" 链接，点击即可跳转。

## 页面位置

`app/(marketing)/foodie-login/page.tsx`

## 删除指南

如需删除此独立页面，只需两步：

1. **删除文件夹**：
   ```bash
   rm -rf app/(marketing)/foodie-login
   ```

2. **移除导航链接**：
   编辑 `components/navbar/index.tsx`，删除：
   ```tsx
   {
     title: "Foodie",
     link: "/foodie-login",
   },
   ```

## 特性说明

- ✅ 完全独立的代码，不依赖其他组件
- ✅ 响应式设计，适配移动端和桌面端
- ✅ 包含邮箱、密码输入
- ✅ 密码显示/隐藏切换
- ✅ Google 和 Facebook 社交登录图标
- ✅ 渐变粉色主题背景
- ✅ 自定义 Foodie Logo

---
创建日期：2025-12-08
