# Requirements Document

## Introduction

`TikTok Hook Master AI` 是一个面向海外短视频创作者的单页 Web 应用，用于根据视频主题、目标受众、语气风格和趋势模板，快速生成高转化开场钩子文案。系统目标是在移动端优先的暗色界面中，于一次请求内返回 5 到 10 条可直接使用的英文 hook，并为后续 Programmatic SEO 页面扩展预留稳定的信息架构。

## Glossary

- **System**: `TikTok Hook Master AI` 网站及其前后端能力。
- **Hook**: 用于短视频开场的短句文案，目标是提升前三秒停留与继续观看概率。
- **Topic**: 用户输入的视频主题或创意描述。
- **Audience**: 用户输入的目标受众描述。
- **Tone**: Hook 语气类型，可选 `Shocking`、`Educational`、`Relatable`、`Controversial`、`Storytime`。
- **Trend Template**: 2026 年短视频趋势模板，可选 `#POV`、`#LifeHack`、`#UnpopularOpinion`。
- **Generator Page**: 生成器页面，包括根路径页面及未来的垂直子路径页面，例如 `/generator/fitness`。
- **AEO**: 面向 AI 搜索与答案引擎的内容优化方式。

## Requirements

### Requirement 1

**User Story:** AS an overseas short video creator, I want to enter a video idea and audience, so that I can generate relevant opening hooks quickly.

#### Acceptance Criteria

1. WHEN the Generator Page loads, the System SHALL display a Topic multiline input.
2. WHEN the Generator Page loads, the System SHALL display an Audience text input.
3. WHEN the Generator Page loads, the System SHALL display a Tone selector with `Shocking`, `Educational`, `Relatable`, `Controversial`, and `Storytime` options.
4. WHEN the Generator Page loads, the System SHALL display an optional Trend Template selector with `#POV`, `#LifeHack`, and `#UnpopularOpinion` options.
5. WHILE the user is entering values, the System SHALL preserve the current form state in the browser until the page is refreshed or reset.

### Requirement 2

**User Story:** AS a creator, I want the interface to feel native to short-form content culture, so that the tool appears modern and trustworthy.

#### Acceptance Criteria

1. WHEN the Generator Page renders, the System SHALL use a dark theme with neon red and cyan accent colors.
2. WHEN the primary form card renders, the System SHALL apply a glassmorphism style that keeps all form controls readable against the background.
3. WHEN the page renders on a viewport width below 768 pixels, the System SHALL prioritize one-column mobile-first layout behavior.
4. WHEN the page renders on a viewport width of 768 pixels or above, the System SHALL expand spacing and result layout without hiding core actions.
5. WHEN text content renders, the System SHALL use a bold sans-serif presentation consistent with Inter or Montserrat style.

### Requirement 3

**User Story:** AS a creator, I want one clear action to generate hooks, so that I can use the tool with minimal friction.

#### Acceptance Criteria

1. WHEN the user has entered a Topic and Audience, the System SHALL enable the primary `Generate Hooks` action.
2. IF the Topic is empty, the System SHALL present a validation message that asks the user to enter a video topic.
3. IF the Audience is empty, the System SHALL present a validation message that asks the user to enter a target audience.
4. WHEN the user activates `Generate Hooks`, the System SHALL send the Topic, Audience, selected Tone, and optional Trend Template to the server generation endpoint.
5. WHILE generation is in progress, the System SHALL replace the idle button state with a loading state that includes animation feedback.

### Requirement 4

**User Story:** AS a creator, I want high-quality short hooks, so that I can reuse them directly in TikTok, Reels, or Shorts.

#### Acceptance Criteria

1. WHEN the server receives a valid generation request, the System SHALL instruct the AI model to generate English hooks using the provided Topic and Audience.
2. WHEN the AI model returns a successful result, the System SHALL show 5 to 10 hook items.
3. WHEN each hook item renders, the System SHALL limit the visible hook text to a concise single statement that stays under 15 words.
4. WHEN each hook item renders, the System SHALL assign a persuasion category label such as `The Negative Hook` or `The Curiosity Gap`.
5. IF the AI response includes invalid or overlong items, the System SHALL filter or normalize the result before displaying hooks to the user.

### Requirement 5

**User Story:** AS a creator, I want to compare hooks visually, so that I can judge which one fits a vertical video best.

#### Acceptance Criteria

1. WHEN hook results are available, the System SHALL render each result inside a Hook Card.
2. WHEN a Hook Card renders, the System SHALL display the hook text, category label, and one-click actions.
3. WHEN a Hook Card renders, the System SHALL display a TikTok-style phone preview frame that shows how the hook appears as a caption mock-up.
4. WHILE multiple Hook Cards are visible, the System SHALL preserve visual distinction between cards without reducing text legibility.

### Requirement 6

**User Story:** AS a creator, I want to reuse and refine individual hooks, so that I can iterate without repeating the entire workflow.

#### Acceptance Criteria

1. WHEN a Hook Card renders, the System SHALL provide a `Copy to Clipboard` action for that hook.
2. WHEN the user activates `Copy to Clipboard`, the System SHALL copy the hook text and provide immediate success feedback.
3. WHEN a Hook Card renders, the System SHALL provide a `Regenerate` action for that specific hook.
4. WHEN the user activates `Regenerate` for one Hook Card, the System SHALL request one replacement hook using the original form context and the specific hook category when available.
5. WHILE a single-item regeneration is in progress, the System SHALL keep unaffected Hook Cards interactive.

### Requirement 7

**User Story:** AS a product owner, I want the system to guide AI output quality consistently, so that the generator produces punchy hooks across different topics.

#### Acceptance Criteria

1. WHEN the System builds the generation prompt, the System SHALL include a system instruction that positions the model as a world-class TikTok viral consultant.
2. WHEN the System builds the generation prompt, the System SHALL request psychological triggers including loss aversion, curiosity, or social proof.
3. WHEN the System builds the generation prompt, the System SHALL request five or more punchy hooks under 15 words each.
4. WHEN the configured primary AI provider is unavailable, the System SHALL return a recoverable generation error message to the user.
5. WHEN the deployment environment selects DeepSeek-V3 or Gemini 1.5 Flash, the System SHALL isolate provider-specific logic behind a shared generation interface.

### Requirement 8

**User Story:** AS a search-driven product owner, I want the page to include answer-friendly supporting content, so that the tool can compete in SEO and AEO discovery channels.

#### Acceptance Criteria

1. WHEN the Generator Page renders, the System SHALL display a FAQ section below the generator results area.
2. WHEN the FAQ section renders, the System SHALL include a `How it works` entry.
3. WHEN the FAQ section renders, the System SHALL include a `Why hooks matter` entry.
4. WHEN the FAQ content renders, the System SHALL use 2026 answer-engine-oriented keywords relevant to TikTok hooks, creator retention, and viral short-form scripting.
5. WHEN page metadata renders, the System SHALL provide a meta title and meta description aligned to the generator's primary purpose.

### Requirement 9

**User Story:** AS a growth team member, I want future vertical pages, so that the product can scale via programmatic SEO.

#### Acceptance Criteria

1. WHEN the application defines routing, the System SHALL support a root generator page and category sub-pages under `/generator/[vertical]`.
2. WHEN a vertical sub-page renders, the System SHALL allow the page to inject vertical-specific heading and metadata content.
3. WHEN a vertical sub-page renders before dedicated content exists, the System SHALL show a valid placeholder experience instead of a broken route.
4. WHILE shared generator logic is reused across vertical pages, the System SHALL keep the generation form and results behavior consistent.

### Requirement 10

**User Story:** AS a deployment owner, I want the application to deploy cleanly to Vercel, so that the product can be published with minimal operational effort.

#### Acceptance Criteria

1. WHEN the application is built for production, the System SHALL use Next.js App Router compatible structure.
2. WHEN the generation endpoint runs on Vercel, the System SHALL execute through an Edge-compatible API route.
3. WHEN the application styling builds, the System SHALL use Tailwind CSS.
4. WHEN the application is configured for deployment, the System SHALL source AI credentials from environment variables rather than hard-coded values.
5. IF the generation endpoint encounters an upstream provider error, the System SHALL return a non-sensitive error response suitable for display in the UI.
