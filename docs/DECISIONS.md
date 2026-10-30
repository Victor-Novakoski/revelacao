# Decisões

Registro das escolhas e do porquê. A mais nova em cima.

| Data | Decisão | Por quê |
| --- | --- | --- |
| 30/10/2026 | Etapa 6: onde a figura fica em cada foto é um dado só (`photos/figures.ts`), usado pelo desenho e pelo detalhe da lupa | Com dezenas de fotos, desenho e lupa descasariam. Um teste confere que toda foto com figura tem o detalhe, e que o dia 1 e a Senhorita Amanda nunca têm |
| 30/10/2026 | Etapa 6: a lupa só acha a figura numa cópia que ficou tempo no revelador | "Tirar cedo é seguro, mas perde pistas" vira regra de jogo, com a mesma conta da camada da figura |
| 30/10/2026 | Etapa 6: o rolo queimado é um passo próprio, um gesto por botão, e o fim é uma escolha com três finais guardada no estado | O jogador faz o gesto em vez de ler; a escolha fica salva para o cartão do fim e para "Começar de novo" |
| 30/10/2026 | Etapa 6: sons da história (telefone, rangido, fósforo, silêncio) gerados no Tone.js, baixos e com legenda | Mesma regra do som da sala: nada a licenciar e nenhum susto. O silêncio de repente é o único corte brusco |
| 30/10/2026 | Etapa 5: as fotos do dia 1 são desenhadas em código (canvas), como a foto de teste, até a arte do Blender. O roteiro é um arquivo TypeScript por dia, sem JSON nem backend | O dia precisava ser jogável agora; trocar o desenho pela camada do Blender não muda o roteiro nem os detalhes da lupa, que ficam em fração da foto. Roteiro em TS é checado pelo compilador e pelos testes |
| 30/10/2026 | Etapa 5: o tempo de luz do ampliador multiplica o tom da cópia, mas a figura depende só do tempo no revelador | É como o papel funciona (a luz define o quanto escurece) e deixa uma escolha para o jogador: menos luz e mais revelador mostra mais detalhe sem escurecer |
| 30/10/2026 | Etapa 5: a fala do cliente na entrega muda com as cópias (no ponto, pálidas, escuras, borradas ou misturadas) | O jogador sente que o trabalho importa sem placar nem nota |
| 30/10/2026 | Etapa 4: todo o som da sala é gerado pelo Tone.js, sem arquivo de áudio. A valsa do rádio é o começo da Gymnopédie nº 1 (Satie). O Tone.js só carrega no clique de entrar | Zero licença para conferir, nada a baixar antes do jogo abrir, e o rádio pode desafinar de verdade (tempo e afinação são parâmetros). A Gymnopédie, em 3/4, faz o papel da valsa até ter uma de Nazareth transcrita |
| 30/10/2026 | WebP com `gen2brain/webp` (a libwebp traduzida para Go puro; usa a do sistema se existir), com perda e qualidade 82 | A biblioteca padrão do Go não escreve WebP. Esta não precisa de cgo nem de libwebp instalada, então roda igual no PC e na CI. Com perda porque WebP sem perda de foto com grão fica pesado no celular |
| 30/10/2026 | O negativo sai só da primeira camada (a cena) | A criatura só existe nas fotografias: no filme ela não está, aparece no papel |
| 30/10/2026 | Música de compositores em domínio público (Ernesto Nazareth, Satie, Chopin) tocada pelo jogo via Tone.js, gravações do Musopen e efeitos CC0 do Freesound. Nada de música gerada por IA | O Victor não compõe; direitos de IA são confusos. Música como código deixa fazer a "nota errada" do final |
| 30/10/2026 | Jogo 100% front, sem backend | Spoiler pelo DevTools e recados entre jogadores não valem sem público. Hospedagem tem que ser grátis |
| 30/10/2026 | Go entra como a CLI `revela`, que prepara as fotos | Mostra Go de verdade (goroutines, CLI, testes, CI) sem precisar hospedar |
| 30/10/2026 | Deploy na Vercel (Hobby), site estático | Grátis, sem cartão, preview por PR, pausa em vez de cobrar |
| 30/10/2026 | Three.js com React Three Fiber, no lugar de PixiJS | A sala 3D com luz vermelha, sombra e grão dá o clima; a revelação continua um shader |
| 30/10/2026 | Web, sem motor (Unity, Godot, Unreal) | Abre na hora pelo link, roda no celular e usa a stack das vagas que o Victor busca |
| 30/10/2026 | Tema: câmara escura, terror de tensão | Escolhido entre várias ideias. "Ecos" e "Ascensorista" ficam para depois |
