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
