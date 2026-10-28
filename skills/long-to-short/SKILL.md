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
the subtitles; the person sets how they look. A short trims the original recording or an explicitly prepared working
copy (`#t=`) and frames it with CSS; individual fine cuts remain timeline edits rather than separately re-encoded files.
A page can also play the recording, silent, with its time set from t, when the picture has to move over it.
Anything you can make titles and motion with, and your own built-in tools.

## 长素材与文稿精剪

按主技能的[口播长素材与文稿精剪](../video-creation/SKILL.md#口播长素材与文稿精剪)选择工作媒体和选句计划。工作副本保留来源与时钟映射，不自动改变影片；原 ASR 波形时间须先映射回媒体时间，再映射到剪后的成片，不能因换源而丢失音轨起点。

把重复起句、长等待和可能的识别幻听列成候选，由本次任务的内容与真实原声决定删保。`speech-cut` 只提出同片段整句或连续句的声画删除；先看受影响对象、调边界并预听，再 `speech-cut-apply`。单独改/删字幕不等于剪视频。影片或字幕版本变化后重新取计划，不用新基线掩盖旧选择；保留正常气口、完整条件和人工锁。播放器跳区试听不证明最终剪口自然，编码后再听看实际接缝。

## With the person

What they ask for comes before anything here. The recording, where the shorts will go, and how many they want (else the
few best). Ask whether there are moments they must keep or must not use, without holding up the work. When done, list
the shorts: for each, its length, its first line, and why you chose it.
