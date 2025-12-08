# Foodie Login Page

这是一个独立的美食配送应用登录页面，基于设计图创建。

## 功能特性

- 📧 邮箱登录
- 🔒 密码输入（带显示/隐藏切换）
- 🔗 忘记密码链接
- 🌐 Google 和 Facebook 社交登录按钮
- 📱 响应式设计
- 🎨 粉色渐变主题

## 文件结构

```
app/(marketing)/foodie-login/
├── page.tsx          # 登录页面主文件
└── README.md         # 本说明文档
```

## 如何删除此页面

如果不再需要此页面，请执行以下步骤：

### 1. 删除页面文件夹
```bash
rm -rf app/(marketing)/foodie-login
```

### 2. 移除导航链接
编辑 `components/navbar/index.tsx` 文件，删除以下内容：

```tsx
{
  title: "Foodie",
  link: "/foodie-login",
},
```

完成以上两步即可完全移除此页面，不会影响网站的其他功能。

## 技术栈

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Lucide React (图标)

## 注意事项

- 此页面代码完全独立，不依赖网站的其他组件
- 所有样式都使用内联的 Tailwind CSS 类
- 图标使用 Lucide React 库（已在项目中安装）
- 表单提交逻辑需要根据实际后端 API 进行实现
