import sys
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
W = sys.argv[1]
base = Image.open(W + '/crop.png').convert('L')
cut = Image.open(W + '/man-cut.png')
cut = cut.crop(cut.getbbox())
g, a = cut.convert('L'), cut.getchannel('A')

def ghost(g, a):
    # Mexeu a cabeça durante a exposição: o rosto vira um borrão claro,
    # o corpo fica nítido. Só a cabeça, com transição suave no pescoço.
    w, h = g.size
    head = int(h * 0.17)
    smear = Image.new('L', g.size, 0)
    for dy in range(-18, 19, 3):
        smear = ImageChops.lighter(smear, ImageChops.offset(g, 0, dy).point(lambda p: p))
    gb = g.filter(ImageFilter.BoxBlur(6))
    smear = Image.blend(gb, smear, 0.5)
    m = Image.new('L', g.size, 0); d = ImageDraw.Draw(m)
    d.rectangle([0, 0, w, head], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(18))
    g2 = Image.composite(smear, g, m)
    a2 = Image.composite(ImageChops.lighter(a, ImageChops.offset(a, 0, -14).filter(ImageFilter.GaussianBlur(4))), a, m)
    return g2, a2

def place(base, g, a, x, foot, h, stretch=1.07, hide=None):
    w = int(g.width * h / g.height / stretch)
    gs = g.resize((w * 4, h * 4), Image.LANCZOS).resize((w, h), Image.LANCZOS)
    as_ = a.resize((w, h), Image.LANCZOS)
    # Mesmo tom da foto: menos contraste e um pouco mais escuro (fica na sombra das árvores).
    gs = ImageEnhance.Contrast(gs).enhance(0.75).point(lambda p: int(p * 0.62 + 20))
    gs = gs.filter(ImageFilter.GaussianBlur(0.6)); as_ = as_.filter(ImageFilter.GaussianBlur(0.5))
    layer = Image.new('L', base.size, 0); alpha = Image.new('L', base.size, 0)
    ox, oy = int(x - w / 2), int(foot - h)
    layer.paste(gs, (ox, oy)); alpha.paste(as_, (ox, oy))
    if hide: alpha = ImageChops.subtract(alpha, hide)
    return Image.composite(layer, base, alpha), layer, alpha

def bush():
    m = Image.new('L', (324, 324), 0); d = ImageDraw.Draw(m)
    d.ellipse([222, 111, 292, 172], fill=255); d.rectangle([222, 140, 292, 178], fill=255)
    return m.filter(ImageFilter.GaussianBlur(1.2))


def bright_head(g, k=1.6):
    w, h = g.size; m = Image.new('L', g.size, 0); d = ImageDraw.Draw(m)
    d.ellipse([w*0.3, h*0.0, w*0.75, h*0.16], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(10))
    return Image.composite(g.point(lambda p: min(255, int(p * k + 40))), g, m)

v1, _, _ = place(base, g, a, 277, 169, 47)
v1.save(W + '/r1.png')
gg, ga = ghost(bright_head(g), a)
v2, _, _ = place(base, gg, ga, 277, 169, 47)
v2.save(W + '/r2.png')
v3, _, _ = place(base, gg, ga, 296, 177, 56, hide=bush())
v3.save(W + '/r3.png')
