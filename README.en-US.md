# Video Director · 视频导演

[中文](README.md)

A DesireCore Agent that works with the separately maintained [Video Creation · 视频创作](https://github.com/desirecore-agent/video-creation) application. It creates editable films from ideas, scripts, data, music and media, including general 2D/2.5D motion graphics, product demos without narration, data explainers, music visuals, editing and optional subtitles. The Agent chooses reusable components, composition or original scenes; transcription and effect cards are not mandatory.

This repository distributes Agent configuration, persona, principles and skills. The application repository provides the editor, playback and render services. The Agent uses DesireCore's existing model routing and tools; no separate Agent harness is bundled.

## Install and connect

1. Install the Video Creation application and prepare its runtime dependencies using its own instructions.
2. Import this repository using DesireCore's existing Agent repository import or reviewed market installation flow. Private repositories require an existing authorized repository connection. Do not copy source directly into a runtime AgentFS; use ManageAgent when creating an instance.
3. Select the film project as an authorized working directory and provide file/process tool access as needed through the platform. The package grants no new tool or media service access.
4. For a managed application, the Agent can use `ToolCatalog` → `AppManage get` → `release_history` for the same instance to discover the current material root and application data home. The installer can also supply exact paths. Pass `--app-root` explicitly to the wrapper and the same instance's `--home` to application commands. `VIDEO_CREATION_ROOT` configures only the material root; installed Agents do not depend on adjacent source checkouts. If an older platform omits the data-root summary, ask the installer for the exact path rather than searching the home directory.
5. Add the installed Video Creation entry to the Agent through the platform. Association is an entry preference and grants no file, tool, credential or communication access.

Example requests: “Use these product screenshots and music to make a 30-second film without narration,” “Animate these data with editable numbers,” or “Keep my adjusted parameters and locks; change only the second shot’s title.” The user can edit in the application and then ask the Agent to continue with a specific part.

## Application interface

The following `inspect` example applies to a project with an existing `film.html`; see the main skill for first-time creation.

```bash
node <skills-directory>/video-creation/scripts/video-creation.mjs --app-root <application-directory> --locate
node <skills-directory>/video-creation/scripts/video-creation.mjs --app-root <application-directory> inspect <project-directory> --home <same-installation-application-data-directory>
```

The wrapper invokes the installed application's `desirecore/cli.mjs` with the original arguments and working directory, without a shell, download or model request. Commands include `start`, `inspect`, `patch`, `motion-catalog`, `motion-inspect`, `motion-install`, `motion-take`, `motion-patch`, `check`, `render`, and job inspection/retry/cancel. `motion-install` copies the bundled local SDK; `motion-take` imports a built-in component through the existing Saved dependency closure, leaving timeline placement to the Agent; `motion-patch` uses real revision and lock protection. Render options include codecs, alpha, frame shape, frame rate and quality. Use `--` to separate wrapper options from application arguments. Read the installed CLI's `--help` and the [main skill](skills/video-creation/SKILL.md) for precise arguments.

The [main skill](skills/video-creation/SKILL.md) describes exact managed-installation discovery and missing-field handling: use `app.instanceId` from `get` as `installation_id` for `release_history`, then use its `current.materialRoot` for `--app-root` and optional top-level `currentData.dataRoot` for `--home`. These paths grant no additional access and do not prove service health. An entry association or application work request does not automatically inject Bash environment variables. If a summary is missing, use only paths explicitly supplied by the installer; do not infer them from historical releases, runtime bindings or platform ledgers.

Reuse an existing managed service without another `start` or registration. Start only when the task needs it and no instance is running for that home, following the installed version's runtime contract with its own application `--home` and `--project`. Other commands connect to that same running service. A submitted render is not a completed render; verify job outputs and actual playback separately.

Authenticated hosts associate entries through `PATCH /api/app-layout`, operation `bind-agent`. Resolve actual local Agent and application identities from the platform. The package UUID is not the local Agent slug; never grant a webpage a general platform token.

## General motion and collaboration

Inputs may be data, music, text events, real product media or optional narration. Existing scenes and free-form code remain valid. The Agent may inspect component manifests in the project, install the local SDK, compose scenes or write original absolute-time HTML/CSS/SVG/Canvas/WebGL scenes. Components do not dictate the story or replace the Agent’s creative decisions.

A scene declares parameters, defaults, structured data and assets through schemas with descriptions. Instance parameters, property tracks, markers and locks stay in `film.html`. `frame(t, context)` receives validated and sampled inputs before the first frame; existing `frame(t)` scenes remain compatible. Declared parameters can be edited through general controls; arbitrary Canvas code does not automatically become an editable layer tree.

Before editing, inspect the real revision, current instance, tracks and human `overrides`, then patch only the relevant fields. Re-read and reconcile after concurrent changes or lock conflicts; do not replay stale operations with a new base or bypass locks through file writes. Report actual checks for out-of-order seeks, first-frame parameters, target aspect ratios, frame rates, alpha composition and playback, with real render job IDs, failures and explicit retries. These are execution and reporting rules, not proof that every platform or media service has already been verified by installing this Agent.

## Package and routing

`agent.json` uses the current `agent-seed` Schema and `llm.smart.profile`, requiring code and tool-use capability without fixing a Provider/model. Visual review may require a task-specific vision route. Avatar generation is disabled. There are no configured MCP servers, media credentials or additional tool grants; `compute_credentials.allowed_providers` is empty.

Persona and principles use exact L0/L1/L2 headings and on-demand L2 sections. Standing instructions live in `instructions.md`. The main skill implements application discovery and describes the film contract, revision-aware editing, checking and rendering. The motion-graphics skill adds general motion, data, event and original-scene guidance; nine other adapted upstream skills provide optional creative methods. `USAGE.md` is the market-facing introduction; provenance and licenses live in `NOTICE` and `licenses/`.

## Validate and publish

With Node.js 22 or later:

```bash
node --test tests/*.test.mjs
node scripts/validate.mjs --desirecore-root <DesireCore-source-directory>
```

The second command loads the selected DesireCore checkout's installed tsx, Ajv and current Agent seed Schema, then checks skill references, layered prompts, paths and licenses. No separate Schema copy is maintained. These checks do not prove runtime installation, video generation or third-party service availability; application and platform runtime verification is separate.

Review content through branch pull requests. Market publication requires its normal review and a pinned content commit; repository creation does not establish a market listing.

## Attribution

The film manual, format specification and creative skills directly reuse MIT-licensed OpenFilm content. See [NOTICE](NOTICE) and the [preserved upstream license](licenses/OpenFilm-MIT.txt) for exact commits and adaptations. Unchanged originals are provenance references; their official CLI and download instructions are superseded by the application integration. Overlay Studio is referenced only for component-organization ideas. Its restricted code, skills, templates and assets are not copied; general-motion integration and skill extensions are independently implemented. The independent application is named 视频创作 and the Agent 视频导演, without affiliation or endorsement from OpenFilm.
