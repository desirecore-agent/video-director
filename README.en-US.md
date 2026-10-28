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

The wrapper invokes the installed application's `desirecore/cli.mjs` with the original arguments and working directory, without a shell, download or model request. Commands include `start`, `inspect`, `patch`, `scene-read`, `scene-revise`, `motion-catalog`, `motion-inspect`, `motion-install`, `motion-take`, `motion-patch`, `check`, `review`, `captions`, `prepare-media`, `speech-cut`, `speech-cut-apply`, `get`, `render`, and job inspection/retry/cancel. `motion-install` copies the bundled local SDK; `motion-take` imports a built-in component through the existing Saved dependency closure, leaving timeline placement to the Agent; `motion-patch` uses real revision and lock protection. Render options include codecs, alpha, frame shape, frame rate and quality. Use `--` to separate wrapper options from application arguments. Read the installed CLI's `--help` and the [main skill](skills/video-creation/SKILL.md) for precise arguments.

The [main skill](skills/video-creation/SKILL.md) describes exact managed-installation discovery and missing-field handling: use `app.instanceId` from `get` as `installation_id` for `release_history`, then use its `current.materialRoot` for `--app-root` and optional top-level `currentData.dataRoot` for `--home`. These paths grant no additional access and do not prove service health. An entry association or application work request does not automatically inject Bash environment variables. If a summary is missing, use only paths explicitly supplied by the installer; do not infer them from historical releases, runtime bindings or platform ledgers.

Reuse an existing managed service without another `start` or registration. Start only when the task needs it and no instance is running for that home, following the installed version's runtime contract with its own application `--home` and `--project`. Other commands connect to that same running service. A submitted render is not a completed render; verify job outputs and actual playback separately.

When operation fields are unclear, the wrapper's `patch --help` points to `patch --schema`. This returns the installed version's read-only Draft-07 operation contract without a service, project or home; MCP `video_patch` uses the same Schema. Edit from that public contract and the actual `inspect` response, without scanning installed implementation source. If `RUNTIME.md` is outside the read scope, report that gap. A known formal service and its exact installation home can still be used through public help and contracts under existing authorization; do not bypass file scope or guess startup arguments. See the [main skill's editing and conflicts section](skills/video-creation/SKILL.md#修改与冲突) for a minimal source-replacement example and preservation of human locks.

For an existing local scene, `scene-read` supplies a digest of the original bytes from the same Buffer. `scene-revise --args` requires the exact film baseline, publishes a complete new version and switches only the selected shared instances, preserving the original source, non-src fields and human locks. Both commands expose the shared contract through offline `--schema`. Omitted text has not been read in full; after a publication failure or unknown receipt, inspect the actual mappings before retrying and retain the published file. This does not promise an operating-system CAS, a two-file transaction or that arbitrary new code respects the meaning of human parameters. See the [main skill's source-revision guidance](skills/video-creation/SKILL.md#场景原字节与新版本修订).

`review` generates observation material with versions, time points and file digests from either the current project preview or the original encoded output of a specified completed job. Report these sources separately; a preview is not an encoded frame. A generation receipt does not mean the frames have been viewed: read the required images with their digests before explaining a visual judgement or revision. Report unreadable images, image-budget limits or a model without vision as observation gaps. Creative choices, human parameters, DOM overrides and locks remain intact. See the [main skill's review entry](skills/video-creation/SKILL.md#带版本与时间点的审片) for exact source, time-point and image-reading guidance.

For a quality review, choose structured measurements, target viewing width and first/last material to suit the film's purpose, citing the exact source, actual time and observation limits. Measurements are not an aesthetic score. No audio stream is not automatically a defect; paired stills do not prove rhythm, listening quality or a seamless loop, and a review need not lead to an edit or another export. The Director retains creative choice and human locks. See the [main skill's purpose-based guidance](skills/video-creation/SKILL.md#按用途判断与选择观察).

For narration, distinguish measured recording/recognition word times, text-proportional or interpolated estimates, and unknown provenance. After editing text or changing a voice, check the new audio, subtitles and timing basis. Use the installed version’s subtitle write preconditions and reread and merge after a conflict. Listen to the final encoded segment and inspect its corresponding frames before reporting observed synchronisation; stills, correct transcription and no overall audio offset do not replace listening. Creative decisions remain with the Director, and a user-frozen line must retain its appearance and position after source revisions.

When supported by the installed app, `prepare-media` creates a traceable SDR working copy for a long or explicitly HDR source, preserving the original, source digests and audio-origin mapping. The Director chooses whether to reference it in the timeline. `captions` reads actual cues and their source revision; `speech-cut` only proposes a media cut, and `speech-cut-apply` submits it after preview with fixed film and subtitle preconditions. Deleting subtitles alone does not remove speech or video. Recompute stale plans; the UI retains single-batch undo and human locks. These commands reuse the existing timeline without requiring automatic pause removal or a fixed effects workflow. See the [main skill](skills/video-creation/SKILL.md#口播长素材与文稿精剪) for the boundaries.

Once MiMo is authorised and connected, `get <project> tts --args <credential-free-JSON-file> --via mimo --model mimo-v2.5-tts --home <application-data-directory>` generates natural narration as WAV through the same service. The ordinary API endpoint is the default. Token Plan requires an installer-configured matching `MIMO_API_BASE_URL`; its keys are separate from ordinary API credentials and must not be used as a general product backend. Keys stay in existing application credential storage or the service environment, outside the project and ZIP. MiMo returns no word timestamps, so align subtitles to the actual new audio. Never blindly repeat a paid request after an unknown receipt. See the [main skill's MiMo guidance](skills/video-creation/SKILL.md#mimo-预置语音) for parameters, preset voices and execution boundaries.

Authenticated hosts associate entries through `PATCH /api/app-layout`, operation `bind-agent`. Resolve actual local Agent and application identities from the platform. The package UUID is not the local Agent slug; never grant a webpage a general platform token.

## General motion and collaboration

Inputs may be data, music, text events, real product media or optional narration. Existing scenes and free-form code remain valid. The Agent may inspect component manifests in the project, install the local SDK, compose scenes or write original absolute-time HTML/CSS/SVG/Canvas/WebGL scenes. Components do not dictate the story or replace the Agent’s creative decisions.

A scene declares parameters, defaults, structured data and assets through schemas with descriptions. Instance parameters, property tracks, markers and locks stay in `film.html`. `frame(t, context)` receives validated and sampled inputs before the first frame; existing `frame(t)` scenes remain compatible. Declared parameters can be edited through general controls; arbitrary Canvas code does not automatically become an editable layer tree.

Before editing, inspect the real revision, current instance, tracks and human `overrides`, then patch only the relevant fields. Re-read and reconcile after concurrent changes or lock conflicts; do not replay stale operations with a new base or bypass locks through file writes. Report actual checks for out-of-order seeks, first-frame parameters, target aspect ratios, frame rates, alpha composition and playback, with real render job IDs, failures and explicit retries. These are execution and reporting rules, not proof that every platform or media service has already been verified by installing this Agent.

## Package and routing

`agent.json` uses the current `agent-seed` Schema and `llm.smart.profile`, requiring code and tool-use capability without fixing a Provider/model. Visual review may require a task-specific vision route. Avatar generation is disabled. There are no configured MCP servers, media credentials or additional tool grants; `compute_credentials.allowed_providers` is empty.

Persona and principles use exact L0/L1/L2 headings and on-demand L2 sections. Standing instructions live in `instructions.md`. The main skill implements application discovery and describes the film contract, revision-aware editing, versioned review, checking and rendering. The motion-graphics skill adds general motion, data, event and original-scene guidance; nine other adapted upstream skills provide optional creative methods. `USAGE.md` is the market-facing introduction; provenance and licenses live in `NOTICE` and `licenses/`.

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

## Time-window and small-size review

When the installed app exposes review v3, the Director can choose a sequence window or a same-capture compareWidths artifact for the intended delivery. Actual cell times/sizes, source digests and limits come from the app's single Schema. Encoded low-resolution full-frame activity, sparse contact cells and partial project seeks remain separate evidence, not pace scores or continuous-playback certification. Read the actual composite and cite its source and observations while preserving original HTML/SVG/Canvas/WebGL creation, human locks and sources. Do not impose a universal title deadline or font threshold, automatically cut the film, or remove locks. See the main skill's time-window and same-capture comparison section.

Sheets use separate label bands and larger cells, explicitly reporting labels simplified or omitted in tiny cells. Metadata retains full times and integer PTS. The maximum-luma-delta adjacent pair supplies actual PTS locators without an aesthetic verdict.

Review v4 adds optional viewing intent, version-bound navigation with save/input checks, and review-pair comparisons of existing timed frames. Missing legacy time mappings or captured fields remain unknown. Image enlargement adds no pixels; there is no automatic layout, unlocking or quality verdict.

The existing wrapper forwards optional `review --read <ID> --copy-to <authorized-workdir>` to reuse saved PNGs for Read without another capture or permission grant. Receipt identity establishes generation history; current workdir lists and intent-only edits do not establish pixel changes.
