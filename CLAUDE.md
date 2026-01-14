# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 TanStack Start 构建的全栈应用示例，展示了会议/活动网站的实现（Haute Pâtisserie 2026 烘焙大会）。集成了 AI 助手、GraphQL (Apollo Client)、tRPC、Prisma 数据库等现代技术栈。

## 常用命令

```bash
# 开发
pnpm dev              # 启动开发服务器 (端口 3000)
pnpm build            # 构建生产版本
pnpm start            # 运行生产构建

# 代码质量
pnpm lint             # Biome 代码检查
pnpm format           # Biome 格式化
pnpm check            # Biome 完整检查

# 测试
pnpm test             # 运行 Vitest 测试

# 数据库 (Prisma)
pnpm db:generate      # 生成 Prisma Client
pnpm db:push          # 推送 schema 到数据库
pnpm db:migrate       # 运行数据库迁移
pnpm db:studio        # 打开 Prisma Studio
pnpm db:seed          # 运行数据库 seed

# Shadcn UI 组件
pnpm dlx shadcn@latest add <component>   # 添加组件
```

## 架构概述

### 技术栈
- **框架**: TanStack Start (基于 Vite)
- **路由**: TanStack Router (基于文件系统路由)
- **状态管理**: TanStack Store
- **数据获取**: TanStack Query + Apollo Client (GraphQL) + tRPC
- **数据库**: Prisma + Neon PostgreSQL
- **样式**: Tailwind CSS
- **AI 集成**: TanStack AI (支持 Anthropic/OpenAI/Gemini/Ollama)
- **错误监控**: Sentry

### 关键目录结构
```
src/
├── routes/           # 基于文件的路由 (TanStack Router)
│   ├── __root.tsx    # 根布局
│   ├── index.tsx     # 首页
│   └── demo/         # 演示页面
├── components/       # React 组件
├── integrations/     # 第三方集成
│   ├── tanstack-query/
│   └── trpc/
├── lib/              # 工具函数和 hooks
└── generated/        # 自动生成的代码 (Prisma Client)

content/              # Markdown 内容 (content-collections)
├── speakers/         # 演讲者资料
└── talks/            # 演讲主题

prisma/
├── schema.prisma     # 数据库 Schema
└── seed.ts           # 数据库 Seed
```

### 路由系统
路由在 `src/routes/` 目录下通过文件系统自动生成。主要路由：
- `/` - 首页
- `/speakers`, `/speakers/:slug` - 演讲者列表和详情
- `/talks`, `/talks/:slug` - 演讲列表和详情
- `/schedule` - 会议日程
- `/demo/*` - 各种功能演示

### 内容管理
使用 `content-collections` 管理 Markdown 内容。配置在 `content-collections.ts`，内容文件在 `content/` 目录。

### 环境变量
需要配置的环境变量（在 `.env.local`）：
- `DATABASE_URL` / `VITE_DATABASE_URL` - Neon 数据库连接
- `ANTHROPIC_API_KEY` - Claude AI API 密钥 (可选)
- `OPENAI_API_KEY` - OpenAI API 密钥 (可选)
- `GEMINI_API_KEY` - Google Gemini API 密钥 (可选)
- `VITE_SENTRY_DSN` - Sentry DSN (可选)
- `VITE_GRAPHQL_ENDPOINT` - GraphQL 端点 (可选)

## Sentry 集成

错误收集在 `src/router.tsx` 中自动配置。对于服务器函数，使用 `Sentry.startSpan` 进行性能追踪：

```tsx
import * as Sentry from '@sentry/tanstackstart-react'

Sentry.startSpan({ name: '操作描述' }, async () => {
  // 执行操作
})
```

## 代码风格

项目使用 Biome 进行代码检查和格式化：
- 缩进: Tab
- 引号: 双引号
- 自动整理 imports
