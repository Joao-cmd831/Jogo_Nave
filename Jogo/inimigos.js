function Inimigo(context, x, y, gameSpeed, tipo) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.largura = 30;
    this.altura = 30;
    this.tipo = tipo || 'normal';
    this.vx = (Math.random() - 0.5) * 3 * gameSpeed;
    this.vy = (Math.random() * 2 + 1) * gameSpeed;
    this.vida = tipo === 'strong' ? 2 : 1;
    this.angle = 0;
}

Inimigo.prototype = {
    atualizar: function() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += 0.05;
    },

    desenhar: function() {
        this.context.save();
        this.context.translate(this.x, this.y);
        this.context.rotate(this.angle);

        if (this.tipo === 'normal') {
            this.context.fillStyle = '#ff0055';
            this.context.beginPath();
            for (let i = 0; i < 8; i++) {
                const ang = (i / 8) * Math.PI * 2;
                const x = Math.cos(ang) * 15;
                const y = Math.sin(ang) * 15;
                if (i === 0) this.context.moveTo(x, y);
                else this.context.lineTo(x, y);
            }
            this.context.closePath();
            this.context.fill();
            this.context.strokeStyle = '#ff88cc';
            this.context.lineWidth = 2;
            this.context.stroke();
        } else {
            this.context.fillStyle = '#ff6600';
            this.context.fillRect(-15, -15, 30, 30);
            this.context.strokeStyle = '#ffcc00';
            this.context.lineWidth = 2;
            this.context.strokeRect(-15, -15, 30, 30);
        }

        this.context.restore();
    },

    estaForaDeTelaVertical: function() {
        return this.y > 600 + 50;
    }
}