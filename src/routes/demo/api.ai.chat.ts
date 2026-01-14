import { createFileRoute } from '@tanstack/react-router'
import { chat, maxIterations, toServerSentEventsResponse } from '@tanstack/ai'
import { anthropicText } from '@tanstack/ai-anthropic'
import { openaiText } from '@tanstack/ai-openai'
import { geminiText } from '@tanstack/ai-gemini'
import { ollamaText } from '@tanstack/ai-ollama'

import { getGuitars, recommendGuitarTool } from '@/lib/demo-guitar-tools'

// ===== 原始提示词 - 保留参考 =====
// const ORIGINAL_SYSTEM_PROMPT = `You are a helpful assistant for a store that sells guitars.
//
// CRITICAL INSTRUCTIONS - YOU MUST FOLLOW THIS EXACT WORKFLOW:
//
// When a user asks for a guitar recommendation:
// 1. FIRST: Use the getGuitars tool (no parameters needed)
// 2. SECOND: Use the recommendGuitar tool with the ID of the guitar you want to recommend
// 3. NEVER write a recommendation directly - ALWAYS use the recommendGuitar tool
//
// IMPORTANT:
// - The recommendGuitar tool will display the guitar in a special, appealing format
// - You MUST use recommendGuitar for ANY guitar recommendation
// - ONLY recommend guitars from our inventory (use getGuitars first)
// - The recommendGuitar tool has a buy button - this is how customers purchase
// - Do NOT describe the guitar yourself - let the recommendGuitar tool do it
// `

const SYSTEM_PROMPT = `你是一名资深前端工程专家，专注于 React/TypeScript/Vite/Tailwind 技术栈。

## 核心原则（必须遵循）

1. **简单至上** - 追求最小复杂度，避免过度抽象和预设计
2. **按需实现** - 只实现当前需求，不预留"可能需要"的功能
3. **消除重复** - 复用逻辑提取到 hooks/utils，统一使用 Token
4. **单一职责** - 组件/函数只做一件事，超过 200 行必须拆分

## 代码规范（MUST）

### 组件与导出
- ✅ 使用命名导出（export const）
- ✅ 组件使用 FC 类型，显式声明 Props
- ❌ 禁止默认导出

### 样式与命名
- ✅ 使用 className 和 cn() 合并条件类名
- ✅ 使用 Design Token 而非硬编码颜色
- ❌ 禁止 gap 属性（兼容性问题）
- ❌ 禁止硬编码颜色值

### 文件命名
- 组件文件：PascalCase (UserProfile.tsx)
- 工具/hooks：kebab-case (use-auth.ts)
- 变量/函数：camelCase
- 常量：UPPER_SNAKE_CASE
- 布尔值：is/has/can 前缀

### TypeScript（MUST）
- ✅ 使用 type import
- ✅ 函数返回类型显式声明
- ✅ Props 使用 type 定义
- ❌ 禁止使用 any

## 组件结构

\`\`\`tsx
import type { FC } from "react";
import { cn } from "@app-factory/components-ui";
import { Text, Button } from "@app-factory/components-ui";

type MyComponentProps = {
  title: string;
  variant?: "default" | "highlight";
};

export const MyComponent: FC<MyComponentProps> = ({ title, variant = "default" }) => {
  // 1. State/Refs
  // 2. Queries/Mutations
  // 3. Derived state (useMemo)
  // 4. Effects
  // 5. Handlers
  // 6. Early returns
  // 7. JSX

  return (
    <div className={cn("p-4", variant === "highlight" && "bg-primary-50")}>
      <Text variant="heading" size={2}>{title}</Text>
    </div>
  );
};
\`\`\`

## 自检清单（提交前必查）

- [ ] 使用了现有 UI 组件而非重复造轮子？
- [ ] 样式使用 Design Token 而非硬编码？
- [ ] 组件是否超过 200 行？需要拆分吗？
- [ ] 是否有重复逻辑可以抽取到 hooks/utils？
- [ ] 列表渲染使用唯一 key（非 index）？
- [ ] 所有导入都是命名导出？
- [ ] TypeScript 类型是否完整（无 any）？
- [ ] 组件复杂度是否符合单一职责？

## 工作流程

1. **理解需求** - 确认任务范围和预期输出
2. **查找复用** - 检查现有组件/工具是否可用
3. **最小实现** - 只实现必要功能，避免过度设计
4. **自检验证** - 运行清单检查，确保无类型错误
5. **简要总结** - 说明完成了什么，有何注意事项

回复时优先代码，必要时再解释。使用中文回复，简洁直接。`

export const Route = createFileRoute('/demo/api/ai/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Capture request signal before reading body (it may be aborted after body is consumed)
        const requestSignal = request.signal

        // If request is already aborted, return early
        if (requestSignal.aborted) {
          return new Response(null, { status: 499 }) // 499 = Client Closed Request
        }

        const abortController = new AbortController()

        try {
          const body = await request.json()
          const { messages } = body

          // Determine the best available provider
          let provider: string = 'ollama'
          let model: string = 'mistral:7b'
          if (process.env.ANTHROPIC_API_KEY) {
            provider = 'anthropic'
            // model = 'claude-haiku-4-5'
            model = 'claude-opus-4-5-20251101'
          } else if (process.env.OPENAI_API_KEY) {
            provider = 'openai'
            model = 'gpt-4o'
          } else if (process.env.GEMINI_API_KEY) {
            provider = 'gemini'
            model = 'gemini-2.0-flash-exp'
          }

          // Adapter factory pattern for multi-vendor support
          const adapterConfig = {
            anthropic: () =>
              anthropicText((model || 'claude-haiku-4-5') as any, {
                baseURL: process.env.ANTHROPIC_BASE_URL,
              } as any),
            openai: () => openaiText((model || 'gpt-4o') as any),
            gemini: () => geminiText((model || 'gemini-2.0-flash-exp') as any),
            ollama: () => ollamaText((model || 'mistral:7b') as any),
          }

          const adapter = adapterConfig[provider]()

          const stream = chat({
            adapter,
            tools: [
              // getGuitars, // Server tool
              // recommendGuitarTool, // Server tool with guitar recommendation output
            ],
            systemPrompts: [SYSTEM_PROMPT],
            agentLoopStrategy: maxIterations(5),
            messages,
            abortController,
          })

          return toServerSentEventsResponse(stream, { abortController })
        } catch (error: any) {
          // If request was aborted, return early (don't send error response)
          if (error.name === 'AbortError' || abortController.signal.aborted) {
            return new Response(null, { status: 499 }) // 499 = Client Closed Request
          }
          return new Response(
            JSON.stringify({ error: 'Failed to process chat request' }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        }
      },
    },
  },
})
