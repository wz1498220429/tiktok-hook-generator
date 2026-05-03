# 需求实施计划

- [x] 1. 初始化 Next.js 应用骨架与基础配置
  - 创建 `package.json`、TypeScript、Next.js App Router、Tailwind CSS 与基础脚本，覆盖需求 10.1、10.3。
  - 添加 `next.config` 与 `allowedHosts` 配置，保证本地预览域名可访问，覆盖设计文档 `UI Implementation Notes` 第 5 条。
  - 创建全局布局、基础 metadata 与暗色主题样式，覆盖需求 2.1、2.5、8.5。

- [x] 2. 实现生成器页面与垂类路由
  - [x] 2.1 实现根生成器页面和垂类页面骨架
    - 创建 `app/page.tsx`、`app/generator/page.tsx`、`app/generator/[vertical]/page.tsx`，覆盖需求 9.1、9.2、9.3。
    - 抽取垂类配置与 metadata 构建逻辑，保持共享生成器行为一致，覆盖需求 8.5、9.4。
  - [x] 2.2 实现输入区、结果区和 FAQ 组件
    - 实现 `HookGeneratorForm`、`HookResultsList`、`HookCard`、`PhonePreviewMock`、`FaqSection`，覆盖需求 1.1-1.5、2.1-2.5、5.1-5.4、8.1-8.4。
  - [x]* 2.3 为页面组件编写单元与组件测试
    - 覆盖生成按钮状态、FAQ 渲染与 Hook 卡片交互。

- [x] 3. 实现 AI 服务层与 Edge API
  - [x] 3.1 实现共享类型、prompt 构建与结果归一化
    - 创建 `lib/ai` 下的输入输出类型、prompt builder、结果校验与归一化逻辑，覆盖需求 4.1-4.5、7.1-7.5。
    - 保证每条 hook 含 `text` 与 `category`，并限制在 15 个英文单词内，覆盖设计文档 `Correctness Properties` 1-3。
  - [x] 3.2 实现 provider 抽象和 Vercel Edge 路由
    - 实现 DeepSeek / Gemini 适配层与 `app/api/generate-hooks/route.ts`、`app/api/regenerate-hook/route.ts`，覆盖需求 3.4、6.4、7.4、7.5、10.2、10.4、10.5。
  - [x]* 3.3 为 AI 服务层编写测试
    - 覆盖 prompt 输出、结果过滤和错误映射。

- [x] 4. 连接前端交互并完善体验
  - 将表单提交、整批生成、单条重生成、复制反馈和 loading 动画连接到 API，覆盖需求 3.1-3.5、6.1-6.5。
  - 实现移动端优先布局、玻璃拟态和渐变按钮视觉，覆盖需求 2.1-2.4。
  - 提供无密钥时的 demo 回退体验，避免空仓库下无法预览核心流程，覆盖需求 7.4、10.5。

- [x] 5. 检查点 - 确保所有测试通过
  - 确保所有测试通过,如有疑问请询问用户

- [x] 6. 运行验证并补充项目知识
  - 运行 lint、测试和生产构建，确认实现符合需求 10.1-10.5。
  - 启动本地预览，检查根页面与垂类页面的实际渲染效果。
  - 将项目结构、运行命令与已验证流程写入 `.monkeycode/MEMORY.md`。
