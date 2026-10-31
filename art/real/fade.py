# O Elias sumindo (dia 4): a cada foto do rolo dele, sobra menos dele. Tira
# a pessoa da cena (máscara do rembg, fundo refeito com o inpaint do OpenCV)
# e mistura de volta só uma parte. Roda depois do prepare.py e antes do
# `revela age`, sobre as cenas já recortadas.
# Uso: python3 fade.py <tmp>
import sys

import cv2
import numpy as np
from PIL import Image
from rembg import new_session, remove

src = sys.argv[1]
session = new_session('u2net_human_seg')

# (cena, quanto do Elias fica). Na última (rota-cabine) ele já não está.
SCENES = [
    ('rota-caminhao', 0.8),
    ('rota-serra', 0.5),
    ('rota-janela', 0.2),
]

for name, keep in SCENES:
    im = Image.open(f'{src}/{name}.png').convert('L')
    a = np.asarray(im)
    m = np.asarray(remove(im.convert('RGB'), session=session, only_mask=True))
    hard = cv2.dilate((m > 100).astype(np.uint8) * 255, np.ones((15, 15), np.uint8))
    empty = cv2.inpaint(a, hard, 12, cv2.INPAINT_TELEA)
    soft = cv2.GaussianBlur(hard, (0, 0), 4).astype(np.float32) / 255
    w = soft * (1 - keep)
    out = a * (1 - w) + empty * w
    Image.fromarray(out.clip(0, 255).astype(np.uint8)).save(f'{src}/{name}.png')
