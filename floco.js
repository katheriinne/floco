const tela = document.getElementById('canvas');
const contexto = tela.getContext('2d'); // é o que você usa para desenhar no canvas no caso linhas, e é um desenho plano ou seja,2D

let nivel = 0; //no pdf diz pra começar com um triângulo, por isso que é zer e quanto mais o nível maior os detalhes e maior o floco
let angulo = 0; //posiçao na tela onde ele vai rodar
let velocidadeRotacao = 1; //define se o floco gira, e para qual lado

// muda a rotação a cada 5 segundos
setInterval(() => {
  velocidadeRotacao *= -1; //Se estava somando +1, passa a subtrair -1 (pra girar no outro sentido)
}, 5000);

// Define uma velocidade inicial aleatória (positiva)
velocidadeRotacao = Math.random() * 2 + 0.5;

// Função para desenhar uma linha
function desenharLinha(x1, y1, x2, y2) { //se eu desse o valor era (10, 10, 100, 100); ai ia ser uma linha indo pra baixo na diagonal
  contexto.beginPath(); // esse aqui é pra dizer que vai começar a desenhar
  contexto.moveTo(x1, y1); //esse aqui vai mover tipo o cursor que desenha, mas não vai desenhar ainda
  contexto.lineTo(x2, y2); //ai esse aqui vai começar a desenhar a linha que começou no x1,y1 e terminar no x2,y2
  contexto.stroke();//esse aqui vai mostrar a linha desenhada
}

// tipo assim começa com uma linha reta ai a cada nível, substitui essa linha por 4 novas linhas fazendo o traiângulo, por isso coloquei nivelAtual === 0
function flocoDeKoch(x1, y1, x2, y2, nivelAtual) {
  if (nivelAtual === 0) { //é recursiva então se chegar a 0 não precisa dividir ai desenha
    desenharLinha(x1, y1, x2, y2);
  } else {
    const dx = x2 - x1; //dx e dy é a diferença 
    const dy = y2 - y1;
/* se fosse x1 = 10, y1 = 20
            x2 = 40, y2 = 80
            40 - 10 = 30
            80 - 20 = 60
            é a distancia pra ir de um ponto ao outro no caso, de 30 até 60 (pixels né)
*/
    // eu coloquei 6 níveis pq o floco de neve tem 6 lados mas eu não testei com mais então...
    const x3 = x1 + dx / 3;  //como é pra dividir a reta em três partes iguais
    const y3 = y1 + dy / 3;  //esses calculos são pra achar o ponto do "meio" que divide em três partes ou seja 1/3

    const x4 = x1 + 2 * dx / 3;
    const y4 = y1 + 2 * dy / 3;
//O x5 e y5é como se fosse a ponta do floco
    const x5 = (x1 + x2) / 2 /*é o x do meio*/ + Math.sqrt(3) * (y1 - y2) / 6; // pra medir a altura triângulo equilátero, a altura é (lado × √3) / 2 no caso o lado é 1/3 ai fica (1/3) × (√3) / 2 = √3 / 6 ai não da pra usar essa formula ai usa Math.sqrt(3)
const y5 = (y1 + y2) / 2 /*é o y do meio*/ + Math.sqrt(3) * (x2 - x1) / 6; 
// é pra que o triângulo tenha todos os lados iguais, ou seja equilátero

    //vai chamar a recursividade em 4 partes agora  (é -1 pq ela vai diminuindo o nível até chegar no 0)
    flocoDeKoch(x1, y1, x3, y3, nivelAtual - 1); //esse aqui uma reta
    flocoDeKoch(x3, y3, x5, y5, nivelAtual - 1); //esse o lado do triangulo
    flocoDeKoch(x5, y5, x4, y4, nivelAtual - 1); //esse outro lado do triângulo
    flocoDeKoch(x4, y4, x2, y2, nivelAtual - 1); //e esse a ultima reta
  }
}

// atualizar o desenho
function desenharFloco() {
  contexto.clearRect(0, 0, tela.width, tela.height); //apagar o desenho e desenhar o novo
  contexto.save(); //é pra salvar a posição do desenho
  contexto.translate(tela.width / 2, tela.height / 2); //esse daqui é pq por padrão o desenho vai pro canto esquerdo ai é posicionando pro meio pra poder girar
  contexto.rotate(angulo * Math.PI / 180); //esse aqui é pra girar só que não pe em grau é em radiano ai converte

  const tamanho = 200; //aqui é o tamnho do triângulo
// esse aqui é a criação do triangulo são 3 pq vão desenhar os 3 lados que começam o triângulo
  flocoDeKoch(-tamanho / 2, tamanho / 3, tamanho / 2, tamanho / 3, nivel); // essa é a base do triangulo só a retinha da esquerda pra diretita
  flocoDeKoch(tamanho / 2, tamanho / 3, 0, -tamanho * (Math.sqrt(3) / 3), nivel); //essa aqui é a subida na diagonal pra direita
  flocoDeKoch(0, -tamanho * (Math.sqrt(3) / 3), -tamanho / 2, tamanho / 3, nivel); // e essa vai da ponta do triangulo pra baixo na diagonal pra esquerda

  contexto.restore(); // é como se tivesse limpando o desenho pra começar outro
  angulo += velocidadeRotacao; //faz o floco girar aos poucos, como se tivesse pegando velocidade
  requestAnimationFrame(desenharFloco); //esse chama o próximo desenho
}

// aqui é pra aumentar e diminuir o tamanho/nível que começou com 0 
document.getElementById('aumentarNivel').addEventListener('click', () => {
  if (nivel < 6) nivel++; 
});

document.getElementById('diminuirNivel').addEventListener('click', () => {
  if (nivel > 0) nivel--;
});

// Inicia o desenho
desenharFloco();
