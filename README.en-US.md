# Video Director · 视频导演

[中文](README.md)

A DesireCore Agent that works with the separately maintained [Video Creation · 视频创作](https://github.com/desirecore-agent/video-creation) application. It creates editable films from ideas, scripts and media, including storyboards, motion graphics, screen demos, editing, subtitles, picture-in-picture and quality review.

This repository distributes Agent configuration, persona, principles and skills. The application repository provides the editor, playback and render services. The Agent uses DesireCore's existing model routing and tools; no separate Agent harness is bundled.

## Install and connect

1. Install the Video Creation application and prepare its runtime dependencies using its own instructions.
2. Import this repository using DesireCore's existing Agent repository import or reviewed market installation flow. Private repositories require an existing authorized repository connection. Do not copy source directly into a runtime AgentFS; use ManageAgent when creating an instance.
3. Select the film project as an authorized working directory and provide file/process tool access as needed through the platform. The package grants no new tool or media service access.
4. Configure the installed application path through `VIDEO_CREATION_ROOT` or the wrapper's `--app-root` option. Adjacent source checkouts can be discovered automatically; installed Agents do not depend on that layout.
5. Add the installed Video Creation entry to the Agent through the platform. Association is an entry preference and grants no file, tool, credential or communication access.

Example requests: “Make a 30-second product introduction from these assets” or “Change only the title in the second shot.” The user can edit in the application and then ask the Agent to continue with a specific part.

## Application interface

```bash
node <skills-directory>/video-creation/scripts/video-creation.mjs --app-root <application-directory> --locate
```

The wrapper invokes the installed application's `desirecore/cli.mjs` with the original arguments and working directory, without a shell, download or model request. Commands include `start`, `inspect`, `patch`, `check`, `render`, and job inspection/retry/cancel. Read the installed CLI's `--help` and the [main skill](skills/video-creation/SKILL.md) for precise arguments. Start the service with its own application `--home`; other commands connect to that same running service. A submitted render is not a completed render; playback is verified separately.

Authenticated hosts associate entries through `PATCH /api/app-layout`, operation `bind-agent`. Resolve actual local Agent and application identities from the platform. The package UUID is not the local Agent slug; never grant a webpage a general platform token.

## Package and routing

`agent.json` uses the current `agent-seed` Schema and `llm.smart.profile`, requiring code and tool-use capability without fixing a Provider/model. Visual review may require a task-specific vision route. Avatar generation is disabled. There are no configured MCP servers, media credentials or additional tool grants; `compute_credentials.allowed_providers` is empty.

Persona and principles use exact L0/L1/L2 headings and on-demand L2 sections. Standing instructions live in `instructions.md`. The main skill implements application discovery and describes the film contract, revision-aware editing, checking and rendering. Ten adapted upstream skills provide optional creative methods. `USAGE.md` is the market-facing introduction; provenance and licenses live in `NOTICE` and `licenses/`.

## Validate and publish

With Node.js 22 or later:

```bash
node --test tests/*.test.mjs
node scripts/validate.mjs --desirecore-root <DesireCore-source-directory>
```

The second command loads the selected DesireCore checkout's installed tsx, Ajv and current Agent seed Schema, then checks skill references, layered prompts, paths and licenses. No separate Schema copy is maintained. These checks do not prove runtime installation, video generation or third-party service availability; application and platform runtime verification is separate.

Review content through branch pull requests. Market publication requires its normal review and a pinned content commit; repository creation does not establish a market listing.

## Attribution

The film manual, format specification and creative skills directly reuse MIT-licensed OpenFilm content. See [NOTICE](NOTICE) and the [preserved upstream license](licenses/OpenFilm-MIT.txt) for exact commits and adaptations. Unchanged originals are provenance references; their official CLI and download instructions are superseded by the application integration. The independent application is named 视频创作 and the Agent 视频导演, without affiliation or endorsement from OpenFilm.
