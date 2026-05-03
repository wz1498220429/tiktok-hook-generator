# 用户指令记忆

本文件记录了用户的指令、偏好和教导，用于在未来的交互中提供参考。

## 格式

### 用户指令条目
用户指令条目应遵循以下格式：

[用户指令摘要]
- Date: [YYYY-MM-DD]
- Context: [提及的场景或时间]
- Instructions:
  - [用户教导或指示的内容，逐行描述]

### 项目知识条目
Agent 在任务执行过程中发现的条目应遵循以下格式：

[项目知识摘要]
- Date: [YYYY-MM-DD]
- Context: Agent 在执行 [具体任务描述] 时发现
- Category: [代码结构|代码模式|代码生成|构建方法|测试方法|依赖关系|环境配置]
- Instructions:
  - [具体的知识点，逐行描述]

## 去重策略
- 添加新条目前，检查是否存在相似或相同的指令
- 若发现重复，跳过新条目或与已有条目合并
- 合并时，更新上下文或日期信息
- 这有助于避免冗余条目，保持记忆文件整洁

## 条目

[仓库当前为绿色字段起步项目]
- Date: 2026-05-03
- Context: Agent 在执行 TikTok Hook Master AI 需求文档整理时发现
- Category: 代码结构
- Instructions:
  - 仓库当前未发现 `.monkeycode/docs/` 项目文档、历史规格文件或现成的 Next.js 前端结构。
  - 后续实现可按 greenfield 项目处理，无需兼容既有页面或 API 约束。

[TikTok Hook Master AI 项目结构与运行方式]
- Date: 2026-05-03
- Context: Agent 在执行 TikTok Hook Master AI 网站实现与验证时发现
- Category: 构建方法
- Instructions:
  - 项目使用 Next.js App Router、Tailwind CSS 和 Vercel Edge API Route。
  - 常用命令为 `npm install`、`npm run lint`、`npm test`、`npm run build`、`npm run dev`。
  - 生成接口支持 `DEEPSEEK_API_KEY` 或 `GEMINI_API_KEY`；未配置密钥时自动回退到 demo hooks，便于本地预览。
  - 垂类页面使用 `/generator/[vertical]` 路由，目前内置 `fitness`、`gaming`、`beauty` 示例配置。
  - Next.js 当前应使用 `allowedDevOrigins` 配置预览域名，而不是旧式 `allowedHosts` 字段。

[TikTok Hook Master AI 垂类与环境约定]
- Date: 2026-05-03
- Context: Agent 在执行网站交互完善时发现
- Category: 代码模式
- Instructions:
  - 未预置的 `/generator/[vertical]` 路径不返回 404，而是使用占位配置继续渲染可工作的生成器页面。
  - 主生成按钮的 loading 态内嵌 Lottie 动画，符合需求文档中的生成中反馈要求。
  - 项目根目录提供 `.env.example`，用于声明 `AI_PROVIDER`、`DEEPSEEK_API_KEY` 和 `GEMINI_API_KEY`。

[TikTok Hook Master AI 真实 AI 集成约定]
- Date: 2026-05-03
- Context: Agent 在执行真实 AI API 联调准备时发现
- Category: 依赖关系
- Instructions:
  - DeepSeek 使用 OpenAI 兼容的 `https://api.deepseek.com/chat/completions`，默认模型为 `deepseek-chat`，可通过 `DEEPSEEK_MODEL` 覆盖。
  - Gemini 使用 `generateContent` 接口、`x-goog-api-key` 头和 `responseJsonSchema` 进行结构化 JSON 输出，默认模型为 `gemini-2.5-flash`，可通过 `GEMINI_MODEL` 覆盖。
  - provider 选择逻辑优先使用 `AI_PROVIDER`，若首选 provider 未配置密钥则自动回退到另一个可用 provider；两个都不可用时使用 demo hooks。

[TikTok Hook Master AI DeepSeek 已验通]
- Date: 2026-05-03
- Context: Agent 在执行真实 DeepSeek API 联调时发现
- Category: 测试方法
- Instructions:
  - 将 `.env.local` 设置为 `AI_PROVIDER=deepseek` 并提供有效的 `DEEPSEEK_API_KEY` 后，`/api/generate-hooks` 与 `/api/regenerate-hook` 已成功返回真实结果。
  - DeepSeek 偶尔会偏离指定 JSON 字段，因此归一化层需要兼容 `hook` 字段别名并为缺失 `category` 提供兜底值。

[TikTok Hook Master AI API 防护约定]
- Date: 2026-05-03
- Context: Agent 在执行 API 错误提示与限流增强时发现
- Category: 代码模式
- Instructions:
  - API 路由统一通过 `ApiError` 和 `toApiError` 返回用户可读错误，避免直接暴露原始 provider 异常文本。
  - `/api/generate-hooks` 使用基于客户端地址的每分钟 8 次限流，`/api/regenerate-hook` 使用每分钟 12 次限流。
  - 命中限流时接口返回 `429` 和 `Retry-After`，前端会在错误文案中追加等待秒数提示。

[TikTok Hook Master AI 统计与配额面板约定]
- Date: 2026-05-03
- Context: Agent 在执行访问统计、埋点和配额面板实现时发现
- Category: 代码模式
- Instructions:
  - 统计与埋点使用轻量级内存存储，适合本地预览和单实例部署验证，不保证跨实例持久化。
  - 前端通过 `/api/telemetry` 上报事件，通过 `/api/usage-stats` 拉取聚合统计与当前客户端配额快照。
  - Hook 分类标签会通过规范化层收敛为 `Curiosity Gap`、`Loss Aversion`、`Social Proof`、`Pattern Interrupt`、`Storytime`、`Contrarian Take`、`Authority Hook` 等统一标签。

[TikTok Hook Master AI 持久化统计约定]
- Date: 2026-05-03
- Context: Agent 在执行 Redis 持久化统计接入时发现
- Category: 依赖关系
- Instructions:
  - 当 `UPSTASH_REDIS_REST_URL` 与 `UPSTASH_REDIS_REST_TOKEN` 存在时，统计计数与限流桶会持久化到 Upstash Redis。
  - 当 Redis 环境变量缺失时，系统自动回退到进程内存存储，以保留本地开发与无配置预览能力。
  - 持久化层通过 `lib/persistent-kv.ts` 统一封装，避免 API 路由直接依赖具体存储实现。

[TikTok Hook Master AI 限流 TTL 单位约定]
- Date: 2026-05-03
- Context: Agent 在执行 Redis 持久化限流验证时发现
- Category: 代码模式
- Instructions:
  - `lib/rate-limit.ts` 的 `setBucket` 接口接收毫秒窗口，并在内部统一转换为 Redis 需要的秒级 TTL；调用方不要重复做秒转换。
  - Upstash 读取 JSON 字符串时可能直接返回反序列化后的对象，`lib/persistent-kv.ts` 需要把非字符串值重新 `JSON.stringify` 后交给上层解析。

[TikTok Hook Master AI Vercel 安全部署约定]
- Date: 2026-05-03
- Context: Agent 在执行 Vercel 部署报错排查时发现
- Category: 构建方法
- Instructions:
  - Vercel 会拦截已知存在高危安全公告的 Next.js 版本，即使 `next build` 本身已经成功。
  - 对于当前 15.5.x 发布线，需至少升级到 Next.js `15.5.9`，并同步升级 `eslint-config-next` 到同版本，才能避免被安全策略阻断部署。

[TikTok Hook Master AI Vercel 观测接入约定]
- Date: 2026-05-03
- Context: Agent 在执行 Vercel Analytics 与 Speed Insights 接入时发现
- Category: 构建方法
- Instructions:
  - Next.js App Router 项目统一在 `app/layout.tsx` 中挂载 Vercel 官方组件，分别使用 `@vercel/analytics/next` 的 `<Analytics />` 和 `@vercel/speed-insights/next` 的 `<SpeedInsights />`。
  - 安装这两个 Vercel 包时，当前仓库因 `vitest/vite` 的可选 peer 解析可能需要使用 `npm install --legacy-peer-deps`。
