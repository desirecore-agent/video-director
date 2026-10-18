---
name: long-to-short
description: "Turn a long video (a talk, podcast, interview, lesson, livestream or vlog) into short vertical clips that each stand alone and hold attention from the first second. Use when the person gives a long recording and asks for clips, shorts, highlights or cut-downs for Douyin, Reels, Shorts or similar (长视频转短视频, 切片, 剪短视频, 高光, 拆条)."
---

> 应用集成：先加载 `video-creation` 技能，使用其中的本地应用定位、revision 冲突保护和检查/渲染命令。以下创作方法按当前任务选用，不授予工具、素材上传或付费调用权限；有密钥也不代表消费授权。
> 本技能直接复用并改编 OpenFilm 创作技能，来源与 MIT 许可见仓库 `NOTICE`、`licenses/OpenFilm-MIT.txt`，原文保留于 `skills/video-creation/references/upstream/skills/long-to-short/SKILL.original.md`。


# Long video to shorts

Find the moments in this recording that people would stop scrolling for, and make each one a short a channel would post
as it is: it opens on its strongest real line, ends on its point, and makes sense to someone who never saw the long
video. The speaker, watching it, would say: yes, that is what I meant.

## What has to be true

- **The speaker's meaning, intact.** Nothing said in different places is joined into a claim they did not make; an
  "if", a "not" or an "in some cases" is never cut away; an answer keeps its question. A title or any other text on
  screen says only what the recording says, or is plainly yours.
- **It stands alone**: a viewer knows who is speaking and what they are answering.
- **Every word exact.** The transcript says exactly what was said; names, numbers and terms you cannot confirm are named
  in your reply. Each cut falls in a pause: no clip starts on a clipped word or stops mid-thought.
- **Made for a phone**: the one who is speaking well framed at every moment, and nothing that matters where the app's
  buttons and captions sit.
- **Worth posting**: each one holds up next to the best clips on the platform, as long as its moment needs and no
  longer. Watch each as a viewer would; a clip you would scroll past is not done.

## What you have

The recording's transcript with every word's time (an authorized transcription tool, a WebVTT beside it), from which Studio draws
the subtitles; the person sets how they look. A short is the same recording trimmed (`#t=`) and framed with CSS, never
cut or re-encoded into new files; a page can also play the recording, silent, with its time set from t, when the
picture has to move over it. Anything you can make titles and motion with, and your own built-in tools.

## With the person

What they ask for comes before anything here. The recording, where the shorts will go, and how many they want (else the
few best). Ask whether there are moments they must keep or must not use, without holding up the work. When done, list
the shorts: for each, its length, its first line, and why you chose it.
