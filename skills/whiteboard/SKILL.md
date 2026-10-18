---
name: whiteboard
description: "Make an explainer drawn on a board while a voice explains, every drawing and word drawn out as it is spoken. Use for lessons, micro-lectures, training, how-it-works and concept explainers, when the person turns a document, slides or notes into an explainer, or asks for a whiteboard, hand-drawn, sketch or doodle style (白板, 手绘, 讲解, 微课, 课件)."
---

> 应用集成：先加载 `video-creation` 技能，使用其中的本地应用定位、revision 冲突保护和检查/渲染命令。以下创作方法按当前任务选用，不授予工具、素材上传或付费调用权限；有密钥也不代表消费授权。
> 本技能直接复用并改编 OpenFilm 创作技能，来源与 MIT 许可见仓库 `NOTICE`、`licenses/OpenFilm-MIT.txt`，原文保留于 `skills/video-creation/references/upstream/skills/whiteboard/SKILL.original.md`。


# Whiteboard explainer

Make the explainer a great teacher would draw: a voice explains and the board grows with it, so the viewer watches the
idea being built and remembers it.

The drawing is the explanation: each mark is drawn as the words that name it are spoken. A finished picture that fades
or slides in is not a whiteboard explainer.

## What has to be true

- **Drawn as it is said.** Each mark starts when the voice reaches it and is done before the next idea. Check it in the
  frames against the voice's word times, and report how close it is.
- **True to the source.** Every fact, number, term and example as the person's document has it. What you add is your own
  sentence, never a new fact; what you correct, you say.
- **Words on the board spelled right**, and readable at the size it will be watched.
- **It holds up next to the best explainers you know**, its drawings made for this subject. Watch the whole film as a
  viewer would, and refine within the agreed scope and budget.
- **It stays editable**: the person can change the script, or put their own voice in its place, and the drawing still
  lands on the words.

## What you have

A voice from an explicitly authorized speech-generation tool, with a WebVTT beside it that times every word; the person's own recording gets the
same from an authorized transcription tool. Anything you can draw and move with: the web platform and any library on it, renderers whose
output becomes a clip, any font whose license allows it, images from authorized media tools, your own built-in tools, and services explicitly
authorized for this task. 视频创作's own rules still hold: the picture at t depends on t alone, a page has no sound, and what
you render elsewhere enters as a clip under `assets/` with the script that made it. Ask before downloading anything
large onto the person's computer.

## With the person

What they ask for comes before anything here. The document, slides or notes, who will watch, and their own voice if
they have recorded it. Without a voice service, use a clearly labeled silent timing draft; do not invent a spoken audio track or request paid generation without authorization. When
done, tell them in a few lines what the boards show, how close the drawing is to the voice, and where the script is so
they can change it.
