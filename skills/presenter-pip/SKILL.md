---
name: presenter-pip
description: "Make a talking-head video where the content fills the screen and the presenter speaks from a small window: slides, screens, charts and pictures that follow what they say, their face always there. Use when the person gives a recording of themselves talking (with slides, a screen, data or notes) and asks for a lesson, a knowledge video, a business review, a commentary or a presentation with them in a corner (小窗人物口播, 画中画, 口播, 讲解视频)."
---

> 应用集成：先加载 `video-creation` 技能，使用其中的本地应用定位、revision 冲突保护和检查/渲染命令。以下创作方法按当前任务选用，不授予工具、素材上传或付费调用权限；有密钥也不代表消费授权。
> 本技能直接复用并改编 OpenFilm 创作技能，来源与 MIT 许可见仓库 `NOTICE`、`licenses/OpenFilm-MIT.txt`，原文保留于 `skills/video-creation/references/upstream/skills/presenter-pip/SKILL.original.md`。


# Presenter in a window

Make the video that keeps the person present and puts what they talk about in charge: each thing they mention fills
the screen the moment they say it, and they speak from a window that never gets in its way.

## What has to be true

- **The picture follows their words.** Each slide, screen, chart, number or picture arrives as they say it and leaves
  when they move on. Check it in the frames against the transcript's word times, and say how close it is.
- **The window never covers what matters**: the content, the subtitles, or a phone app's buttons; their face is never
  cut badly.
- **Their words and meaning.** Cuts fall in pauses; ums and false starts go only when they ask; nothing appears that they
  did not say or give. A number on screen is the one they say, from their data or its source.
- **It holds up next to the best explainers you know.** Watch the whole film as a viewer would, and refine within the agreed scope and budget.

## What you have

Their original recording stays intact. Its in and out points, or those of an explicitly prepared working copy, define
the cuts; CSS shapes its window. Its transcript carries word times from an authorized transcription tool, and Studio draws
the subtitles. A version you treat (its background removed, its sound cleaned, or its HDR converted for working use) is a
new file under `assets/`, with its source and time mapping retained; the cuts stay trims of it. Their slides as pictures or
rebuilt as pages, anything you can make charts, pictures and motion with, images and sound from authorized media tools, your own
built-in tools, and services explicitly authorized for this task. Ask before downloading anything large onto the person's computer.

## 剪辑与解释画面

按主技能的[口播长素材与文稿精剪](../video-creation/SKILL.md#口播长素材与文稿精剪)读取真实字幕版本、选择声画删除范围并预听，不将删字幕误当成删口播，也不绕过目标或联动轨道的人工锁。旧 ASR 的波形零点可能不同于原媒体零点，按实际工作副本回执映射；动效触发使用剪后成片时间。

字幕承载原话，图解解释关系，避免两层文字重复压住脸、嘴或关键内容。讲到测试过程和数字时，优先使用真实录屏或数据；缺少来源则明确为原理示意或暂不展示数值，不把口播中的几组不同口径合成排行榜。特效数量、构件和原创场景仍由你按内容判断，不固定为逐句套卡；用实际编码画面和原声核对结果。

## With the person

What they ask for comes before anything here. The recording, their slides, data or notes, where it will be watched, and
whether ums and pauses should go. Ask without holding up the work. When done, tell them in a few lines what you made,
how close the content is to their words, and what of theirs would make it better.
