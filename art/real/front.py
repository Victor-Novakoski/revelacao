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
    ('quintal-gramado', None),
    ('mooca-familia', None),
    ('mooca-saida', None),
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

# Nas fotos do Vilela não tem gente para esconder a figura: quem fica na
# frente dela são as coisas da praça, desenhadas à mão em fração da cena.
OBJECTS = {
    # O arbusto redondo à direita do coreto e os canteiros baixos.
    'anapolis-coreto': [
        ('ellipse', (0.672, 0.335, 0.905, 0.535)),
        ('rect', (0.5, 0.5, 1.0, 0.615)),
    ],
    # O tronco da palmeira da direita.
    'campinas-jardim': [
        ('poly', [(0.797, 0.0), (0.873, 0.0), (0.88, 0.5), (0.893, 0.8), (0.91, 0.87), (0.775, 0.87), (0.788, 0.8), (0.8, 0.5)]),
    ],
    # O carro.
    'campinas-bento-quirino': [
        ('poly', [(0.0, 0.87), (0.05, 0.825), (0.12, 0.79), (0.165, 0.748), (0.2, 0.735), (0.3, 0.728), (0.42, 0.73),
                  (0.47, 0.75), (0.5, 0.785), (0.6, 0.8), (0.69, 0.815), (0.74, 0.85), (0.74, 0.93), (0.7, 1.0), (0.0, 1.0)]),
    ],
}

for name, shapes in OBJECTS.items():
    w, h = Image.open(f'{src}/{name}.png').size
    m = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(m)
    for kind, g in shapes:
        if kind == 'poly':
            d.polygon([(x * w, y * h) for x, y in g], fill=255)
        else:
            box = [g[0] * w, g[1] * h, g[2] * w, g[3] * h]
            (d.ellipse if kind == 'ellipse' else d.rectangle)(box, fill=255)
    m = m.filter(ImageFilter.GaussianBlur(2))
    Image.merge('LA', (Image.new('L', m.size, 0), m)).save(f'{out}/{name}-frente.png', optimize=True)
