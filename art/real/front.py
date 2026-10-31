# As máscaras de frente: o que, em cada cena, fica na frente da figura (as
# pessoas da foto), para ela sair atrás delas e não colada por cima. Usa o
# rembg (modelo u2net_human_seg) nas cenas recortadas pelo prepare.py.
# Uso: python3 front.py <tmp> <saída>
import sys
from PIL import Image, ImageChops, ImageDraw, ImageFilter
from rembg import new_session, remove

src, out = sys.argv[1], sys.argv[2]
session = new_session('u2net_human_seg')

# (cena, faixa de baixo que também fica na frente, em fração da altura)
SCENES = [
    ('estudio-rapaz', None),
    # Os convidados sentados: dos ombros deles para baixo, tudo na frente.
    ('mooca-convidados', 0.42),
    ('mooca-noivos', None),
    ('quintal-bolhas', None),
    ('quintal-gato', None),
    ('augusto-cadeira', None),
    ('augusto-olhar', None),
    ('augusto-cintura', None),
    ('augusto-cigarro', None),
    ('augusto-rosto', None),
    ('augusto-fogo', None),
]

for name, floor in SCENES:
    im = Image.open(f'{src}/{name}.png').convert('RGB')
    m = remove(im, session=session, only_mask=True).point(lambda p: 255 if p > 110 else 0)
    # Fecha os buracos (estampas de roupa) e alisa a borda.
    m = m.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MinFilter(7)).filter(ImageFilter.GaussianBlur(1.5))
    if floor is not None:
        band = Image.new('L', m.size, 0)
        ImageDraw.Draw(band).rectangle([0, round(m.height * floor), m.width, m.height], fill=255)
        m = ImageChops.lighter(m, band.filter(ImageFilter.GaussianBlur(3)))
    # Só o alfa conta: a figura é apagada onde ele é opaco.
    Image.merge('LA', (Image.new('L', m.size, 0), m)).save(f'{out}/{name}-frente.png', optimize=True)
