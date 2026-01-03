# 📊 用户行为监控集成指南

本文档提供详细的用户行为监控工具集成步骤。

---

## 🎯 推荐方案

### 方案 A：免费全栈方案（推荐）

```
PostHog + Microsoft Clarity + Sentry = $0/月
```

**覆盖**:
- ✅ 事件追踪 + 漏斗分析（PostHog）
- ✅ 会话回放 + 热力图（Clarity）
- ✅ 错误监控（Sentry）

---

## 1️⃣ Microsoft Clarity 集成（5分钟）

### 步骤 1：创建账号

1. 访问 https://clarity.microsoft.com
2. 用 Microsoft/Google 账号登录
3. 点击 "Add new project"
4. 输入网站信息：
   - Name: `Lingtrue`
   - Website URL: `https://www.lingtrue.com`
5. 获取 Clarity ID（格式：`abc123def`）

### 步骤 2：集成到 Next.js

在 `app/layout.tsx` 的 `<head>` 中添加：

\`\`\`tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Microsoft Clarity */}
        {process.env.NODE_ENV === 'production' && (
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: \`
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "\${process.env.NEXT_PUBLIC_CLARITY_ID}");
              \`,
            }}
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
\`\`\`

### 步骤 3：添加环境变量

在 `.env.local` 和 Vercel 中添加：

\`\`\`bash
NEXT_PUBLIC_CLARITY_ID=your_clarity_id_here
\`\`\`

### 步骤 4：验证

1. 部署到生产环境
2. 访问你的网站
3. 回到 Clarity Dashboard
4. 等待 2-3 分钟，查看"Session Recordings"

**完成！现在你可以**:
- 📹 观看用户会话录像
- 🔥 查看热力图（点击、滚动、移动）
- 📊 分析用户行为模式

---

## 2️⃣ PostHog 集成（15分钟）

### 步骤 1：创建账号

1. 访问 https://posthog.com
2. 注册账号（推荐用 GitHub 登录）
3. 选择部署方式：
   - **PostHog Cloud**（推荐，简单）
   - Self-hosted（需要自己部署）

### 步骤 2：安装 SDK

\`\`\`bash
npm install posthog-js
\`\`\`

### 步骤 3：创建 PostHog Provider

\`\`\`tsx
// lib/posthog.ts
import posthog from 'posthog-js'

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      },
      capture_pageview: false, // 我们手动追踪页面浏览
    })
  }
}

export { posthog }
\`\`\`

\`\`\`tsx
// components/posthog-provider.tsx
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initPostHog, posthog } from '@/lib/posthog'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    initPostHog()
  }, [])

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url = url + \`?\${searchParams.toString()}\`
      }
      posthog.capture('$pageview', {
        '$current_url': url
      })
    }
  }, [pathname, searchParams])

  return <>{children}</>
}
\`\`\`

### 步骤 4：集成到 Layout

\`\`\`tsx
// app/layout.tsx
import { PostHogProvider } from '@/components/posthog-provider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}
\`\`\`

### 步骤 5：追踪事件

\`\`\`tsx
// components/pain-point-search.tsx
import { posthog } from '@/lib/posthog'

const handleSearch = async () => {
  // 追踪搜索事件
  posthog.capture('pain_point_search', {
    query: searchQuery,
    platforms: selectedPlatforms,
    user_id: session?.user?.id,
    is_logged_in: !!session,
  })

  // ... 执行搜索
}

// 追踪结果查看
posthog.capture('view_results', {
  query: searchQuery,
  frustration_score: analysisResult.frustrationScore,
  insights_count: analysisResult.insights.length,
  total_posts: redditPosts.length + xPosts.length,
})

// 追踪导出
posthog.capture('export_report', {
  query: searchQuery,
  format: 'pdf',
})
\`\`\`

### 步骤 6：识别用户

\`\`\`tsx
// 用户登录后
import { posthog } from '@/lib/posthog'

useEffect(() => {
  if (session?.user) {
    posthog.identify(session.user.id, {
      email: session.user.email,
      name: session.user.name,
      membership_type: session.user.membershipType,
    })
  }
}, [session])
\`\`\`

### 步骤 7：环境变量

\`\`\`bash
# .env.local
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
\`\`\`

---

## 3️⃣ Sentry 集成（10分钟）

### 步骤 1：安装

\`\`\`bash
npx @sentry/wizard@latest -i nextjs
\`\`\`

这个命令会自动：
- 安装 Sentry SDK
- 创建配置文件
- 添加环境变量

### 步骤 2：配置（已自动完成）

检查是否生成了以下文件：
- \`sentry.client.config.ts\`
- \`sentry.server.config.ts\`
- \`sentry.edge.config.ts\`

### 步骤 3：添加用户上下文

\`\`\`tsx
// app/layout.tsx 或登录后
import * as Sentry from '@sentry/nextjs'

useEffect(() => {
  if (session?.user) {
    Sentry.setUser({
      id: session.user.id,
      email: session.user.email,
      username: session.user.name,
    })
  } else {
    Sentry.setUser(null)
  }
}, [session])
\`\`\`

### 步骤 4：手动捕获错误

\`\`\`tsx
try {
  await fetch('/api/pain-points/analyze', { ... })
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'pain-point-search',
    },
    extra: {
      query: searchQuery,
      platforms: selectedPlatforms,
    },
  })
}
\`\`\`

### 步骤 5：环境变量

\`\`\`bash
# .env.local (已自动添加)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=your_auth_token
\`\`\`

---

## 📊 关键事件追踪清单

### 用户行为事件

\`\`\`typescript
// 1. 页面浏览
posthog.capture('page_view', { page: '/dashboard' })

// 2. 用户注册
posthog.capture('user_signup', {
  method: 'email' | 'google' | 'github'
})

// 3. 用户登录
posthog.capture('user_login', {
  method: 'email' | 'google' | 'github'
})

// 4. 痛点搜索
posthog.capture('pain_point_search', {
  query: string,
  platforms: string[],
  is_logged_in: boolean
})

// 5. 查看结果
posthog.capture('view_results', {
  query: string,
  frustration_score: number,
  insights_count: number,
  total_posts: number
})

// 6. 导出报告
posthog.capture('export_report', {
  query: string,
  format: 'pdf' | 'copy'
})

// 7. 查看历史记录
posthog.capture('view_history', {
  history_count: number
})

// 8. 升级会员
posthog.capture('upgrade_membership', {
  plan: 'monthly' | 'yearly',
  price: number
})

// 9. 支付成功
posthog.capture('payment_success', {
  plan: string,
  amount: number,
  provider: 'paypal' | 'stripe'
})

// 10. 配额用尽
posthog.capture('quota_exceeded', {
  quota_type: 'search' | 'message',
  user_type: 'guest' | 'free' | 'premium'
})
\`\`\`

---

## 🎯 漏斗分析示例

### 用户转化漏斗

在 PostHog 中创建漏斗：

\`\`\`
步骤 1: page_view (page = '/')
步骤 2: pain_point_search
步骤 3: view_results
步骤 4: export_report
步骤 5: user_signup
步骤 6: upgrade_membership
\`\`\`

**分析问题**:
- 如果步骤 1→2 流失率高 → 首页 CTA 不够吸引
- 如果步骤 2→3 流失率高 → 搜索结果慢/失败
- 如果步骤 3→4 流失率高 → 导出功能不明显
- 如果步骤 4→5 流失率高 → 注册流程有问题

---

## 🔍 会话回放应用场景

### 场景 1：用户搜索后立即离开

**在 Clarity 中查看**:
1. 筛选：搜索后 < 10秒离开的会话
2. 观看录像
3. 发现：用户在等待结果时看到加载中，等了5秒就关闭了

**优化**: 添加进度条 + 预计时间提示

---

### 场景 2：用户找不到导出按钮

**在 Clarity 中查看**:
1. 筛选：在结果页停留 > 1分钟但未导出的会话
2. 观看录像
3. 发现：用户一直向下滚动找不到按钮

**优化**: 把导出按钮固定在顶部

---

### 场景 3：用户注册流程卡住

**在 Clarity 中查看**:
1. 筛选：在注册页停留 > 2分钟的会话
2. 观看录像
3. 发现：用户在密码输入框反复尝试

**优化**: 添加密码强度提示

---

## ⚠️ 隐私合规

### GDPR 合规清单

- [ ] 添加 Cookie 同意横幅
- [ ] 提供隐私政策链接
- [ ] 允许用户选择退出追踪
- [ ] 匿名化敏感数据（邮箱、IP）

### 实现 Cookie 同意

\`\`\`tsx
// components/cookie-consent.tsx
'use client'

import { useState, useEffect } from 'react'

export function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShow(true)
    } else if (consent === 'accepted') {
      // 初始化追踪工具
      initPostHog()
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShow(false)
    initPostHog()
    // 重新加载以激活 Clarity 和 Sentry
    window.location.reload()
  }

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 text-white p-4 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <p>
          We use cookies to improve your experience. 
          <a href="/privacy" className="underline ml-1">Learn more</a>
        </p>
        <div className="flex gap-2">
          <button onClick={decline} className="px-4 py-2 border border-white rounded">
            Decline
          </button>
          <button onClick={accept} className="px-4 py-2 bg-white text-black rounded">
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
\`\`\`

---

## 📈 数据分析仪表板

### PostHog 仪表板示例

创建一个仪表板包含：

1. **关键指标卡片**
   - 今日活跃用户（DAU）
   - 本周新注册用户
   - 总搜索次数
   - 平均搜索/用户

2. **趋势图表**
   - 每日搜索量趋势（7天）
   - 新用户注册趋势（30天）
   - 付费转化趋势

3. **漏斗分析**
   - 访问 → 搜索 → 导出 → 注册 → 付费

4. **用户留存**
   - Day 1, Day 7, Day 30 留存率

---

## 🚀 快速启动命令

\`\`\`bash
# 1. 安装依赖
npm install posthog-js

# 2. 安装 Sentry
npx @sentry/wizard@latest -i nextjs

# 3. 添加环境变量到 .env.local
echo "NEXT_PUBLIC_CLARITY_ID=your_id" >> .env.local
echo "NEXT_PUBLIC_POSTHOG_KEY=your_key" >> .env.local
echo "NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com" >> .env.local

# 4. 部署到 Vercel（自动应用环境变量）
git add .
git commit -m "feat: 添加用户行为监控"
git push origin main
\`\`\`

---

## 📚 参考资源

- **PostHog 文档**: https://posthog.com/docs
- **Microsoft Clarity 文档**: https://docs.microsoft.com/en-us/clarity/
- **Sentry Next.js 集成**: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **GDPR 合规指南**: https://gdpr.eu/cookies/

---

**文档版本**: v1.0  
**创建日期**: 2025-12-30  
**最后更新**: 2025-12-30
