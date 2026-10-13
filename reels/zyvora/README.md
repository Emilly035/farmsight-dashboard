# Reels Zyvora

Reels institucional de 15 s (1080×1920, 30 fps, H.264 + AAC), pronto para Instagram/TikTok.

- `zyvora-reels.mp4`: vídeo final
- `zyvora-capa.jpg`: sugestão de capa
- `scene.html`: animação (textos, cores e tempos de cada cena)
- `music.py`: trilha sintetizada (120 BPM)
- `render.mjs`: renderiza `scene.html` quadro a quadro com Playwright

## Gerar de novo

```sh
python3 music.py /tmp/music.wav
node render.mjs /tmp/frames 30 15
ffmpeg -framerate 30 -i /tmp/frames/f%05d.jpg -i /tmp/music.wav \
  -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest zyvora-reels.mp4
```
