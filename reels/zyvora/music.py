"""Gera a trilha do reels (15 s, 120 BPM) sintetizada com numpy.

Uso: python3 music.py saida.wav
"""
import sys
import wave

import numpy as np

SR = 44100
DUR = 15.0
BPM = 120
BEAT = 60 / BPM
N = int(SR * DUR)
t_all = np.arange(N) / SR
mix = np.zeros((N, 2))
rng = np.random.default_rng(3)


def note(freq):
    return 440 * 2 ** ((freq - 69) / 12)


def add(sig, start, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    mix[i : i + len(sig), 0] += sig * (1 - pan) / 2 * 2 ** 0.5
    mix[i : i + len(sig), 1] += sig * (1 + pan) / 2 * 2 ** 0.5


def env(n, a=0.005, r=0.2):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / r)


def kick():
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t * 35)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)


def hat(length=0.06):
    n = int(length * SR)
    noise = rng.standard_normal(n)
    noise = np.diff(noise, prepend=0)  # passa-altas simples
    return noise * env(n, 0.001, length / 3) * 0.3


def pad(midi_notes, length):
    n = int(length * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for m in midi_notes:
        for det in (-0.08, 0.0, 0.08):
            s += np.sin(2 * np.pi * note(m + det) * t) + 0.3 * np.sin(4 * np.pi * note(m + det) * t)
    shape = np.minimum(1, t / 0.4) * np.minimum(1, (length - t) / 0.4)
    return s * shape / (len(midi_notes) * 3)


def bass(m, length):
    n = int(length * SR)
    t = np.arange(n) / SR
    s = np.sign(np.sin(2 * np.pi * note(m) * t)) * 0.4 + np.sin(2 * np.pi * note(m) * t)
    return np.tanh(s * 1.2) * env(n, 0.005, length * 0.6)


def whoosh(length):
    n = int(length * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    k = np.linspace(0.02, 0.4, n)  # filtro que "abre"
    out = np.zeros(n)
    y = 0.0
    for i in range(n):
        y += k[i] * (noise[i] - y)
        out[i] = y
    return out * (t / length) ** 2


def impact():
    n = int(1.8 * SR)
    t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * (40 + 60 * np.exp(-t * 8)) * t) * np.exp(-t * 2.5)
    shimmer = sum(np.sin(2 * np.pi * note(m) * t) for m in (81, 88, 93)) * np.exp(-t * 1.6) * 0.12
    return boom + shimmer


# Progressão Am - F - C - G, um acorde a cada 2 compassos curtos (4 tempos)
chords = [(57, 60, 64), (53, 57, 60), (48, 55, 64), (55, 59, 62)]
roots = [45, 41, 48, 43]
bar = 4 * BEAT
for k in range(int(DUR / bar) + 1):
    c = k % 4
    add(pad(chords[c], bar + 0.3), k * bar, 0.22, pan=-0.2)
    add(pad(tuple(m + 12 for m in chords[c]), bar + 0.3), k * bar, 0.08, pan=0.3)

beats = int(DUR / BEAT)
for b in range(beats):
    tb = b * BEAT
    # Intro (cenas 1-2) mais leve; groove completo após a revelação do logo
    full = tb >= 6.0
    if full or b % 2 == 0:
        add(kick(), tb, 0.9 if full else 0.6)
    add(hat(), tb + BEAT / 2, 0.5, pan=0.4)
    if full:
        add(hat(0.03), tb + BEAT / 4, 0.25, pan=-0.4)
        add(hat(0.03), tb + 3 * BEAT / 4, 0.25, pan=-0.4)
        add(bass(roots[int(tb / bar) % 4], BEAT * 0.9), tb, 0.35)

# Transições: whoosh antes de cada troca de cena e impacto no logo
for start in (2.8, 5.6, 9.0, 12.4):
    add(whoosh(0.7), start - 0.7, 0.35)
add(impact(), 6.05, 0.9)

# Master: corta graves extremos, comprime suavemente, fade final
mix = np.tanh(mix * 1.3)
fade = np.minimum(1, (DUR - t_all) / 1.2)[:, None]
fade_in = np.minimum(1, t_all / 0.05)[:, None]
mix *= fade * fade_in
mix /= np.max(np.abs(mix)) / 0.89

with wave.open(sys.argv[1] if len(sys.argv) > 1 else "music.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
