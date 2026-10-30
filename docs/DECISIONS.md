# Decisões

Registro das escolhas e do porquê. A mais nova em cima.

| Data | Decisão | Por quê |
| --- | --- | --- |
| 30/10/2026 | WebP com `gen2brain/webp` (a libwebp traduzida para Go puro; usa a do sistema se existir), com perda e qualidade 82 | A biblioteca padrão do Go não escreve WebP. Esta não precisa de cgo nem de libwebp instalada, então roda igual no PC e na CI. Com perda porque WebP sem perda de foto com grão fica pesado no celular |
| 30/10/2026 | O negativo sai só da primeira camada (a cena) | A criatura só existe nas fotografias: no filme ela não está, aparece no papel |
| 30/10/2026 | Música de compositores em domínio público (Ernesto Nazareth, Satie, Chopin) tocada pelo jogo via Tone.js, gravações do Musopen e efeitos CC0 do Freesound. Nada de música gerada por IA | O Victor não compõe; direitos de IA são confusos. Música como código deixa fazer a "nota errada" do final |
| 30/10/2026 | Jogo 100% front, sem backend | Spoiler pelo DevTools e recados entre jogadores não valem sem público. Hospedagem tem que ser grátis |
| 30/10/2026 | Go entra como a CLI `revela`, que prepara as fotos | Mostra Go de verdade (goroutines, CLI, testes, CI) sem precisar hospedar |
| 30/10/2026 | Deploy na Vercel (Hobby), site estático | Grátis, sem cartão, preview por PR, pausa em vez de cobrar |
| 30/10/2026 | Three.js com React Three Fiber, no lugar de PixiJS | A sala 3D com luz vermelha, sombra e grão dá o clima; a revelação continua um shader |
| 30/10/2026 | Web, sem motor (Unity, Godot, Unreal) | Abre na hora pelo link, roda no celular e usa a stack das vagas que o Victor busca |
| 30/10/2026 | Tema: câmara escura, terror de tensão | Escolhido entre várias ideias. "Ecos" e "Ascensorista" ficam para depois |
