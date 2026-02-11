function Explosao(context, x, y, tamanho) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.tamanho = tamanho || 20;
    this.vida = 500;
    this.maxVida = 500;
    this.particles = [];

    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        this.particles.push({
            vx: Math.cos(angle) * (Math.random() * 4 + 2),
            vy: Math.sin(angle) * (Math.random() * 4 + 2)
        });
    }
}

Explosao.prototype = {
    atualizar: function() {
        this.vida -= 16;
    },

    desenhar: function() {
        const progress = 1 - (this.vida / this.maxVida);
        this.context.save();

        for (let p of this.particles) {
            this.context.fillStyle = `rgba(255, ${Math.floor(100 - progress * 100)}, 0, ${this.vida / 500})`;
            this.context.beginPath();
            this.context.arc(
                this.x + p.vx * (1 - progress) * 30,
                this.y + p.vy * (1 - progress) * 30,
                2 + progress * 3,
                0,
                Math.PI * 2
            );
            this.context.fill();
        }

        this.context.fillStyle = `rgba(255, 200, 0, ${this.vida / this.maxVida})`;
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.tamanho * (1 - progress * 0.5), 0, Math.PI * 2);
        this.context.fill();

        this.context.restore();
    },

    estaCompleta: function() {
        return this.vida <= 0;
    }
}