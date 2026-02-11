var NAVE_DIREITA = 1;
var NAVE_ESQUERDA = 2;

function Nave(context, teclado, largura, altura) {
    this.context = context;
    this.teclado = teclado;
    this.x = largura / 2;
    this.y = altura - 80;
    this.largura = 40;
    this.altura = 50;
    this.velocidade = 6;
    this.direcao = NAVE_DIREITA;
}

Nave.prototype = {
    atualizar: function() {
        if (this.teclado.pressionada(SETA_DIREITA)) {
            this.x += this.velocidade;
            this.direcao = NAVE_DIREITA;
        } else if (this.teclado.pressionada(SETA_ESQUERDA)) {
            this.x -= this.velocidade;
            this.direcao = NAVE_ESQUERDA;
        }

        if (this.x < 20) this.x = 20;
        if (this.x > 800 - 20) this.x = 800 - 20;
    },

    desenhar: function() {
        this.context.save();
        this.context.translate(this.x, this.y);

        var gradient = this.context.createLinearGradient(-20, -30, 20, 30);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.5, '#00ff88');
        gradient.addColorStop(1, '#00ccff');
        this.context.fillStyle = gradient;
        this.context.beginPath();
        this.context.moveTo(0, -28);
        this.context.lineTo(-18, 22);
        this.context.lineTo(-8, 8);
        this.context.lineTo(8, 8);
        this.context.lineTo(18, 22);
        this.context.closePath();
        this.context.fill();

        this.context.strokeStyle = '#00ffff';
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.moveTo(0, -28);
        this.context.lineTo(-18, 22);
        this.context.lineTo(18, 22);
        this.context.closePath();
        this.context.stroke();

        this.context.fillStyle = '#ffff00';
        this.context.beginPath();
        this.context.arc(0, -12, 6, 0, Math.PI * 2);
        this.context.fill();

        this.context.fillStyle = '#ff0055';
        this.context.fillRect(-12, 10, 6, 12);
        this.context.fillRect(6, 10, 6, 12);
        this.context.fillStyle = '#00ccff';
        this.context.fillRect(-3, 8, 6, 14);

        this.context.restore();
    }
}