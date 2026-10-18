# 视频导演

[English](README.en-US.md)

与 [视频创作](https://github.com/desirecore-agent/video-creation) 应用共同工作的 DesireCore 智能体。把创意、脚本和素材制作成可编辑的影片，支持分镜、动效、录屏演示、剪辑、字幕、画中画、质量检查和导出协作。

两个产品分别维护在独立仓库。本仓库分发智能体角色、原则与技能；编辑器、播放器、媒体依赖和渲染服务由应用仓库提供。智能体使用 DesireCore 现有模型路由与工具，不捆绑第二套 Agent 运行时。

## 开始使用

1. 按视频创作仓库说明安装应用并准备它的运行依赖。
2. 通过 DesireCore 现有的 Agent 仓库导入或审核后的市场安装流程，导入 `https://github.com/desirecore-agent/video-director`。私有仓库需要平台已有的仓库访问授权。不要将源码直接复制到运行实例的 AgentFS；新建运行实例使用 ManageAgent。
3. 在平台中给视频导演选择本次影片的工作目录，并按实际需要提供文件与进程工具的已有授权。Agent 包本身不新增工具授权或媒体服务凭据。
4. 将应用实际安装目录通过 `VIDEO_CREATION_ROOT` 或包装器的 `--app-root` 参数提供给 Agent。源码并排检出时可自动定位旁边的 `video-creation/`，正式安装不依赖该布局。
5. 在视频导演的应用入口中添加已安装的“视频创作”。关联只保存入口偏好；不会授予项目、工具或凭据访问，也不会自动创建通信桥。

告诉视频导演：“用这些素材制作一段 30 秒的产品介绍”，或“只把第二个镜头标题改成这句话”。人工在应用里编辑后，可以继续要求导演修改指定片段。

## 应用连接

包装器在安装后的技能目录中：

```bash
node <技能目录>/video-creation/scripts/video-creation.mjs --app-root <应用目录> --locate
```

它直接调用 `<应用目录>/desirecore/cli.mjs`，保留参数、退出码和原工作目录，不通过 shell、不下载官方原版、不请求模型。应用领域 CLI 提供 `start`、`inspect`、`patch`、`check`、`render` 与渲染任务查询/重试/取消；精确参数以安装版本的 `--help` 和 [主技能](skills/video-creation/SKILL.md) 为准。

首次 `start` 可指定应用自己的 `--home` 与 `--project`。其余命令连接同一个应用 home 的已运行服务。渲染提交成功不等于渲染完成；导演需根据 job 回执核对输出，实际查看/播放后才报告对应验证。

维护者通过当前用户已认证的宿主接口关联入口：`PATCH /api/app-layout`，`op: "bind-agent"`。必须从平台读取真实的 Agent ID、sourceId、appId、entrypointId 与安装实例 ID；不能把本仓库 UUID 或示例值当作本地 Agent slug，更不能向应用网页提供平台全权 token。

## 包内内容

| 文件 | 职责 |
| --- | --- |
| `agent.json` | 安装源 Schema、Smart profile、能力标签和私有技能启用清单 |
| `persona.md`、`principles.md` | 精确 L0/L1/L2 角色与原则，L2 按需加载 |
| `instructions.md` | 常驻的应用协作与交付约定 |
| `skills/video-creation/` | 应用定位、影片契约、冲突保护、检查与渲染 |
| 其他 10 个 `skills/*/` | 直接复用并适配的上游创作方法 |
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

创作技能、原版手册和影片格式直接复用 OpenFilm 的 MIT 内容，固定版本、改动及全文许可见 [NOTICE](NOTICE) 和 [上游许可](licenses/OpenFilm-MIT.txt)。原文仅用于对照，官方命令已由本应用接入替代。智能体名为“视频导演”，应用名为“视频创作”，与 OpenFilm 官方无隶属或背书关系。
