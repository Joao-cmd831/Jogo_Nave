function Animacao(context, largura, altura) {
    this.context = context;
    this.largura = largura;
    this.altura = altura;
    this.sprites = [];
    this.ligado = false;
}

Animacao.prototype = {
    novoSprite: function(sprite) {
        this.sprites.push(sprite);
    },
    ligar: function() {
        this.ligado = true;
        this.proximoFrame();
    },
    proximoFrame: function() {
        if (!this.ligado) return;

        this.limparTela();

        for (var i in this.sprites) {
            this.sprites[i].atualizar();
        }

        for (var i in this.sprites) {
            this.sprites[i].desenhar();
        }

        var animacao = this;
        requestAnimationFrame(function() {
            animacao.proximoFrame();
        });
    },
    limparTela: function() {
        var gradient = this.context.createLinearGradient(0, 0, 0, this.altura);
        gradient.addColorStop(0, '#0a0e27');
        gradient.addColorStop(0.5, '#1a0a3a');
        gradient.addColorStop(1, '#0f0520');
        this.context.fillStyle = gradient;
        this.context.fillRect(0, 0, this.largura, this.altura);

        this.context.fillStyle = '#ffffff';
        for (let i = 0; i < 100; i++) {
            const x = (i * 71) % this.largura;
            const y = (i * 97) % this.altura;
            this.context.beginPath();
            this.context.arc(x, y, 0.5, 0, Math.PI * 2);
            this.context.fill();
        }
    }
}