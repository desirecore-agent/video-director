# 视频导演源码维护

本仓库是可分发的 DesireCore Agent 内容源；运行实例由平台现有安装流程或 ManageAgent 管理。不要复制文件到用户 AgentFS、调用人类专用创建接口，或把这里当作运行实例修改权限。

- 角色在 `persona.md`，边界在 `principles.md`，常驻约定在 `instructions.md`。角色和原则保持精确的 `## L0`、`## L1`、`## L2` 标题；L2 章节提供 `prompt-section` 的稳定 ID 和适用描述。
- `agent.json` 遵循当前 `agent-seed` Schema，使用 `llm.smart.profile`，不锁定 Provider 或模型，不携带凭据，不默认授予新工具权限。
- `skills/video-creation/` 是应用集成入口；其他技能改编自 OpenFilm。保留 `NOTICE`、`LICENSE` 和 `licenses/`，修改上游参考时更新来源说明。
- 应用路径通过 `--app-root` 或 `VIDEO_CREATION_ROOT` 配置；禁止写入维护者电脑的绝对路径，禁止 `npx openfilm` 或下载官方原版兜底。
- 本文件是唯一协作入口，不创建 `CLAUDE.md`、`.claude/CLAUDE.md` 或 `CLAUDE.local.md`。
- 内容发布到分支 PR；市场条目应单独 pin 审核过的源码 SHA。本仓库不能伪造市场已收录或安装已完成。

验证：`node --test tests/*.test.mjs`；`node scripts/validate.mjs --desirecore-root <DesireCore 源码目录>` 直接加载该检出的现行 Schema。不要复制一份私有 Schema 到本仓库。
