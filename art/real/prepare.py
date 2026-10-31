# Prepara as fotos reais do jogo a partir dos originais baixados (ver
# README.md): recorta cada foto no quadro do filme (quadrado no 120, 3:2 no
# 35 mm) e trata a pessoa
# recortada (rosto borrado, tom da foto). Depois, `revela age` envelhece
# cada cena. Uso: python3 prepare.py <originais> <saída>
import sys
from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter

src, out = sys.argv[1], sys.argv[2]
SIDE = 648
FILM_35 = (648, 432)

# (saída, original, recorte em fração da largura e da altura: x0, y0, x1, y1)
SCENES = [
    ('anapolis-coreto', 'anapolis.png', (682 / 1280, 452 / 847, 982 / 1280, 752 / 847)),
    ('campinas-jardim', 'jardim-carlos-gomes-2.jpg', (290 / 800, 20 / 533, 760 / 800, 490 / 533)),
    ('campinas-bento-quirino', 'praca-bento-quirino-2.jpg', (300 / 800, 20 / 521, 760 / 800, 480 / 521)),
    ('campinas-rosario', 'largo-do-rosario-2.jpg', (20 / 800, 15 / 520, 490 / 800, 485 / 520)),
    ('campinas-pompeo', 'praca-antonio-pompeo-3.jpg', (300 / 800, 60 / 615, 770 / 800, 530 / 615)),
    ('cambuci-porta', 'smulders-3812.jpg', (60 / 960, 0 / 749, 809 / 960, 749 / 749)),
    ('cambuci-altar', 'smulders-3794.jpg', (100 / 960, 0 / 751, 851 / 960, 751 / 751)),
    ('cambuci-bolo', 'smulders-3820.jpg', (100 / 960, 0 / 748, 848 / 960, 748 / 748)),
    ('cambuci-retrato', 'smulders-3805.jpg', (0 / 960, 0 / 728, 728 / 960, 728 / 728)),
    ('estudio-keiko', 'kitashirakawa-familia.jpg', (222 / 960, 520 / 1437, 782 / 960, 1080 / 1437)),
    ('estudio-okada', 'shimizu-familia.jpg', (420 / 960, 190 / 1470, 960 / 960, 730 / 1470)),
    ('estudio-rapaz', 'shimizu-familia.jpg', (80 / 960, 150 / 1470, 660 / 960, 730 / 1470)),
    ('estudio-ito', 'familia-1920.jpg', (0 / 960, 0 / 1291, 960 / 960, 960 / 1291)),
    ('mooca-convidados', 'bruiloft1966-0436.jpg', (50 / 960, 0 / 636, 686 / 960, 636 / 636)),
    ('mooca-familia', 'bruiloft1966-0432.jpg', (100 / 960, 0 / 620, 720 / 960, 620 / 620)),
    ('mooca-noivos', 'bruiloft1966-0435.jpg', (0 / 960, 100 / 1449, 960 / 960, 1060 / 1449)),
    ('mooca-saida', 'bruiloft1966-0444.jpg', (160 / 960, 0 / 630, 790 / 960, 630 / 630)),
]

# As de 35 mm, no mesmo formato.
SCENES_35 = [
    ('amersfoort-toalha', 'amersfoort-schaftuur.jpg', (215 / 960, 90 / 864, 731 / 960, 434 / 864)),
    ('amersfoort-turma', 'amersfoort-genietend.jpg', (204 / 960, 72 / 932, 724 / 960, 419 / 932)),
    ('renee-soneca', 'renee-gras.jpg', (0 / 960, 40 / 735, 960 / 960, 680 / 735)),
    ('sarphatipark-patos', 'sarphatipark-eenden.jpg', (110 / 960, 40 / 803, 960 / 960, 607 / 803)),
    ('comunhao-porta', 'nickerie-5484.jpg', (0 / 960, 240 / 932, 960 / 960, 880 / 932)),
    ('comunhao-altar', 'nickerie-5472.jpg', (0 / 960, 120 / 937, 960 / 960, 760 / 937)),
    ('comunhao-igreja', 'nickerie-5473.jpg', (0 / 960, 150 / 946, 960 / 960, 790 / 946)),
    ('comunhao-procissao', 'nickerie-5482.jpg', (0 / 960, 200 / 931, 960 / 960, 840 / 931)),
    ('quintal-bolhas', 'vandepoll-252-0729.jpg', (0 / 960, 300 / 1238, 960 / 960, 940 / 1238)),
    ('quintal-gramado', 'vandepoll-189-0416.jpg', (0 / 960, 40 / 726, 960 / 960, 680 / 726)),
    ('quintal-gato', 'vandepoll-252-1483.jpg', (0 / 960, 180 / 1256, 960 / 960, 820 / 1256)),
    ('quintal-escada', 'vandepoll-252-0857.jpg', (0 / 960, 200 / 1241, 960 / 960, 840 / 1241)),
    ('livraria-vitrine', 'vandepoll-255-1853.jpg', (0 / 960, 120 / 977, 960 / 960, 760 / 977)),
    ('livraria-estantes', 'anefo-900-8741.jpg', (0 / 960, 260 / 965, 960 / 960, 900 / 965)),
    ('livraria-gato', 'anefo-906-9507.jpg', (110 / 960, 90 / 748, 960 / 960, 657 / 748)),
    ('livraria-balcao', 'vandepoll-255-1852.jpg', (0 / 960, 200 / 957, 960 / 960, 840 / 957)),
]

for scenes, size in ((SCENES, (SIDE, SIDE)), (SCENES_35, FILM_35)):
    for name, f, (x0, y0, x1, y1) in scenes:
        im = Image.open(f'{src}/{f}').convert('L')
        box = (round(x0 * im.width), round(y0 * im.height), round(x1 * im.width), round(y1 * im.height))
        im.crop(box).resize(size, Image.LANCZOS).save(f'{out}/{name}.png')

# A pessoa: o rosto vira um borrão claro (mexeu a cabeça na exposição), o
# corpo fica nítido, e o tom desce para o da foto.
cut = Image.open(f'{src}/pessoa-recorte.png')
cut = cut.crop(cut.getbbox())
g, a = cut.convert('L'), cut.getchannel('A')
w, h = g.size
face = Image.new('L', g.size, 0)
ImageDraw.Draw(face).ellipse([w * 0.3, 0, w * 0.75, h * 0.16], fill=255)
g = Image.composite(g.point(lambda p: min(255, int(p * 2 + 40))), g, face.filter(ImageFilter.GaussianBlur(10)))
smear = Image.new('L', g.size, 0)
for dy in range(-18, 19, 3):
    smear = ImageChops.lighter(smear, ImageChops.offset(g, 0, dy))
smear = Image.blend(g.filter(ImageFilter.BoxBlur(6)), smear, 0.5)
head = Image.new('L', g.size, 0)
ImageDraw.Draw(head).rectangle([0, 0, w, int(h * 0.17)], fill=255)
head = head.filter(ImageFilter.GaussianBlur(18))
g = Image.composite(smear, g, head)
a = Image.composite(ImageChops.lighter(a, ImageChops.offset(a, 0, -14).filter(ImageFilter.GaussianBlur(4))), a, head)
g = ImageEnhance.Contrast(g).enhance(0.75).point(lambda p: int(p * 0.5 + 14))
# Um pouco esticada: alta demais para gente.
size = (round(w * 600 / h / 1.07), 600)
person = Image.merge('LA', (g.resize(size, Image.LANCZOS), a.resize(size, Image.LANCZOS)))
person.save(f'{out}/pessoa.png')
