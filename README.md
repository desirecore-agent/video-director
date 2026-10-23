# 视频导演

[English](README.en-US.md)

与 [视频创作](https://github.com/desirecore-agent/video-creation) 应用共同工作的 DesireCore 智能体。把创意、脚本、数据、音乐和素材制作成可编辑的影片，支持通用 2D／2.5D 动效、无口播产品演示、数据图解、音乐视觉、剪辑、可选字幕和导出协作。导演自主选择构件、组合或原创场景，不要求先转写口播或套用动效卡。

两个产品分别维护在独立仓库。本仓库分发智能体角色、原则与技能；编辑器、播放器、媒体依赖和渲染服务由应用仓库提供。智能体使用 DesireCore 现有模型路由与工具，不捆绑第二套 Agent 运行时。

## 开始使用

1. 按视频创作仓库说明安装应用并准备它的运行依赖。
2. 通过 DesireCore 现有的 Agent 仓库导入或审核后的市场安装流程，导入 `https://github.com/desirecore-agent/video-director`。私有仓库需要平台已有的仓库访问授权。不要将源码直接复制到运行实例的 AgentFS；新建运行实例使用 ManageAgent。
3. 在平台中给视频导演选择本次影片的工作目录，并按实际需要提供文件与进程工具的已有授权。Agent 包本身不新增工具授权或媒体服务凭据。
4. 受管应用可由 Agent 沿 `ToolCatalog` → `AppManage get` → 同一实例的 `release_history` 发现当前材料根与数据 home；安装者也可明确提供准确路径。调用包装器时显式传 `--app-root`，领域命令显式传同一实例的 `--home`。`VIDEO_CREATION_ROOT` 只配置材料根，正式安装不依赖源码并排布局；旧平台缺少数据根摘要时需安装者补充，不能搜索 home 猜路径。
5. 在视频导演的应用入口中添加已安装的“视频创作”。关联只保存入口偏好；不会授予项目、工具或凭据访问，也不会自动创建通信桥。

告诉视频导演：“不用旁白，用产品截图和音乐制作一段 30 秒介绍”，“把这组数据做成可调整数字的图解动画”，或“保留我刚调好的参数和锁定，只改第二个镜头标题”。人工在应用里编辑后，可以继续要求导演修改指定片段。

## 应用连接

包装器在安装后的技能目录中；以下 `inspect` 示例用于已有 `film.html` 的工程，首次创建见主技能：

```bash
node <技能目录>/video-creation/scripts/video-creation.mjs --app-root <应用目录> --locate
node <技能目录>/video-creation/scripts/video-creation.mjs --app-root <应用目录> inspect <项目目录> --home <同一安装的应用数据目录>
```

它直接调用 `<应用目录>/desirecore/cli.mjs`，保留参数、退出码和原工作目录，不通过 shell、不下载官方原版、不请求模型。应用领域 CLI 提供 `start`、`inspect`、`patch`、`scene-read`、`scene-revise`、`motion-catalog`、`motion-inspect`、`motion-install`、`motion-take`、`motion-patch`、`check`、`review`、`get`、`render` 与渲染任务查询/重试/取消；`motion-install` 复制应用自带的本地 SDK，`motion-take` 通过现有 Saved 依赖闭包取用内置构件，是否插入时间线由导演决定；`motion-patch` 沿用真实 revision 与锁保护；渲染可传完整编码、alpha、画幅、帧率和质量参数。包装器可用 `--` 分隔应用定位选项与领域参数。精确参数以安装版本的 `--help` 和 [主技能](skills/video-creation/SKILL.md) 为准。

受管安装发现的准确调用与缺省处理见[主技能](skills/video-creation/SKILL.md)：`get` 返回的 `app.instanceId` 用作 `release_history` 的 `installation_id`，后者的 `current.materialRoot` 与顶层可选 `currentData.dataRoot` 分别用于 `--app-root` 与 `--home`。这些路径不增加访问权限，也不证明服务正在运行；入口关联或应用工作请求不自动向 Bash 注入环境变量。缺少摘要时仅使用安装者明确提供的路径，不从历史版本、运行绑定或平台账本推算。

已有受管服务只复用，不重复 `start` 或重新注册。确需启动且已确认没有该 home 的运行实例时，再按安装版本的运行合同使用 `start`，指定应用自己的 `--home` 与 `--project`；其余命令连接同一个应用 home 的已运行服务。渲染提交成功不等于渲染完成；导演需根据 job 回执核对输出，实际查看/播放后才报告对应验证。

操作字段不明确时，包装器的 `patch --help` 可发现 `patch --schema`：它无需服务、项目或 home 就返回安装版本的只读 Draft-07 操作合同，MCP `video_patch` 使用同源 Schema。导演按公开合同与真实 `inspect` 修改，不需要扫描安装材料源码。`RUNTIME.md` 不在读域时明确记录缺口；已知正式服务和同一实例的实际 home 仍可按现有授权使用公开帮助与合同，不绕过文件范围或猜测启动。最小换源示例及人工锁保留要求见[主技能的修改与冲突](skills/video-creation/SKILL.md#修改与冲突)。

修改已引用的本地场景可使用 `scene-read` 的同 Buffer 原字节摘要与 `scene-revise --args` 的严格影片基线，完整发布新版本后只切换选定共享实例，保留原源码、非 src 字段和人工锁；两命令的 `--schema` 离线发现同源合同。省略全文不是已读全文，发布后失败或回执未知须先检查实际映射，不自动删新文件或重发。它不承诺操作系统 CAS、两文件事务或任意新代码遵守人工参数的语义，详见[主技能的源码修订](skills/video-creation/SKILL.md#场景原字节与新版本修订)。

`review` 可为当前工程预览或指定已完成 job 的原编码输出生成带版本、时间点和文件摘要的观察材料；两种来源分别报告，不将预览冒充编码帧。生成回执不代表已经看过：导演需按摘要实际读取必要图片，依据可见内容说明判断和修订理由。无法读取、超出图片预算或本次模型没有视觉能力时明确报告观察缺口，保留自主创作、人工参数、DOM 覆盖和锁。精确来源、时间点和读取方法见[主技能的审片入口](skills/video-creation/SKILL.md#带版本与时间点的审片)。

质量复盘按作品用途选择结构化测量、目标观看宽度和首尾材料，说明具体来源、实际时间与观察限制。测量不是审美评分；无音轨不自动是缺陷，首尾静帧不证明节奏、听感或无缝循环，也不要求每次都修片或重新导出。导演继续自主创作并保留人工锁，细节见[主技能的用途判断](skills/video-creation/SKILL.md#按用途判断与选择观察)。

已授权并连接 MiMo 后，可用 `get <项目> tts --args <无凭据JSON文件> --via mimo --model mimo-v2.5-tts --home <应用数据目录>` 制作自然口语旁白，沿同一服务保存 WAV。默认使用普通 API；Token Plan 需要安装者显式配置匹配的 `MIMO_API_BASE_URL`，不能与普通 API Key 混用或充当产品通用后端。Key 保留在现有应用凭据机制或服务环境，不能进入工程或 ZIP。MiMo 无词级时间戳，字幕需按真实新音轨对齐；回执未知时不盲目重复付费调用。参数、预置音色与执行边界见[主技能的 MiMo 语音说明](skills/video-creation/SKILL.md#mimo-预置语音)。

维护者通过当前用户已认证的宿主接口关联入口：`PATCH /api/app-layout`，`op: "bind-agent"`。必须从平台读取真实的 Agent ID、sourceId、appId、entrypointId 与安装实例 ID；不能把本仓库 UUID 或示例值当作本地 Agent slug，更不能向应用网页提供平台全权 token。

## 通用动效与协作

创作输入可以是数据、音乐、文字事件、真实产品素材或可选旁白。现有场景与自由代码继续有效；导演可以发现项目中的构件声明、安装本地 SDK、组合场景，或自主写 HTML／CSS／SVG／Canvas／WebGL 的绝对时间场景。构件不限制作品类型，也不替代智能体的创作判断。

场景以带 description 的 Schema 声明参数、默认值、结构化数据和资源，实例参数、属性轨、标记与锁保存在 `film.html`。`frame(t, context)` 在首帧前获得经过校验并按时间求值的参数；旧 `frame(t)` 兼容。声明的参数支持通用编辑，自由 Canvas 代码不自动成为可视编辑图层。

修改已有作品先读取真实 revision、当前实例、轨道和人工 `overrides`；只提交需要的字段。同期修改或锁冲突后重新读取并合并，不直接换一个新基线重放旧操作，也不绕开锁写文件。交付按任务检查乱序 seek、首帧参数、目标横竖方画幅、多帧率、透明合成与成片播放，记录真实导出 job、失败和显式重试。这些是导演的执行与报告约定，不代表安装 Agent 后每个平台或媒体服务都已经验收。

## 包内内容

| 文件 | 职责 |
| --- | --- |
| `agent.json` | 安装源 Schema、Smart profile、能力标签和私有技能启用清单 |
| `persona.md`、`principles.md` | 精确 L0/L1/L2 角色与原则，L2 按需加载 |
| `instructions.md` | 常驻的应用协作与交付约定 |
| `skills/video-creation/` | 应用定位、影片契约、冲突保护、版本化审片、检查与渲染 |
| `skills/motion-graphics/` | 通用动效、数据与事件、自主场景和检查约定 |
| 其他 9 个 `skills/*/` | 复用上游并适配的可选创作方法 |
| `USAGE.md` | 市场详情可读取的简明使用说明 |
| `NOTICE`、`licenses/` | 固定来源、修改说明与上游许可 |

`agent.json` 使用现行 `agent-seed` Schema 和 `llm.smart.profile`，按 Run 解析实际模型；源码不固定 Provider/model。默认能力需求是代码与工具调用，视觉检查按任务需要选择支持视觉的路由。头像保留字符回落，安装不自动发起图像生成。包不预配置 MCP、媒体服务或密钥，`compute_credentials.allowed_providers` 为空。

## 开发验证

Node.js 22 或更新版本即可运行本仓库定向测试，无需安装包：

```bash
node --test tests/*.test.mjs
node scripts/validate.mjs --desirecore-root <DesireCore 源码目录>
```

第二条使用指定源码检出中已安装的 `tsx`、Ajv 与当前 Schema，校验完整 Agent 安装源，再核对技能、分层标题、引用路径与许可。没有维护独立的 Schema 副本。这些测试不证明已在 DesireCore 安装、实际生成视频或第三方媒体服务可用；运行验收由应用与平台共同完成。

发布内容通过分支 PR 审阅。市场上架另走现有审核流程，市场指针应 pin 已审阅的内容提交；创建此仓库不等于市场已收录。

## 来源与许可

创作技能、原版手册和影片格式直接复用 OpenFilm 的 MIT 内容，固定版本、改动及全文许可见 [NOTICE](NOTICE) 和 [上游许可](licenses/OpenFilm-MIT.txt)。原文仅用于对照，官方命令已由本应用接入替代。本轮仅参考 Overlay Studio 的构件组织方法，没有复制其受限代码、技能、模板或素材；通用动效集成与技能扩展独立实现。智能体名为“视频导演”，应用名为“视频创作”，与 OpenFilm 官方无隶属或背书关系。

## 时间窗与小尺寸复审

安装版公开v3审片合同时，导演可按用途选择sequence时间窗总览或compareWidths同一次捕获的多尺寸对照。每格实际时点／尺寸、来源摘要与限制来自应用唯一Schema；编码低分辨率全帧活动、稀疏contact格和工程partial seek分别报告，不把它们当节奏评分或完整播放证明。实际读取组合图并引用其版本与证据，保留自主HTML/SVG/Canvas/WebGL、人工锁与原源；不固定标题出现秒数／最低字号，不按提示自动剪片或解锁。详见主技能的「时间窗总览与同捕获多尺寸观察」。

总览使用独立标签带及较大格子，极小格的简化/省略有回执标明；完整时点与整数PTS仍看metadata。时间窗最大灰度差相邻对提供实际PTS定位，不能代替审美判断。
