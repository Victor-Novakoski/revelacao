import sys, importlib.util
from PIL import Image, ImageEnhance, ImageFilter, ImageChops
W = sys.argv[1]
spec = importlib.util.spec_from_file_location('real', sys.argv[2])
# Reaproveita ghost/bright_head/place de pessoa.py sem rodar o fim do arquivo.
src = open(sys.argv[2]).read().split('\ngg, ga = ghost(bright_head(g, 2.0), a)')[0]
ns = {'__name__': 'x', 'sys': sys}; sys.argv = [sys.argv[0], W]; exec(src, ns)
g, a = ns['g'], ns['a']
gg, ga = ns['ghost'](ns['bright_head'](g, 2.0), a)
N = 324
# (nome, arquivo, recorte em px da grade de 800, x, pés, altura em fração do quadro)
SHOTS = [
    ('2-jardim', 'dl/camp/02.jpg', (290, 20, 760, 490), 0.57, 0.80, 0.16),
    ('3-rua', 'dl/camp/05.jpg', (300, 20, 760, 480), 0.77, 0.95, 0.235),
    ('4-largo', 'dl/camp2/03.jpg', (20, 15, 490, 485), 0.66, 0.97, 0.32),
    ('5-perto', 'dl/camp/07.jpg', (300, 60, 770, 530), 0.72, 1.75, 1.85),
]
for name, f, box, x, foot, h in SHOTS:
    im = Image.open(f).convert('L'); k = im.width / 800
    crop = im.crop(tuple(int(v * k) for v in box)).resize((N, N), Image.LANCZOS)
    out, _, _ = ns['place'](crop, gg, ga, x * N, foot * N, int(h * N), dark=0.5, lift=14)
    out.save(f'{W}/{name}.png')
