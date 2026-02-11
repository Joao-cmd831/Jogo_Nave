function Tiro(context, x, y) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.vy = -8;
    this.raio = 3;
    this.vida = 3000;
}

Tiro.prototype = {
    atualizar: function() {
        this.y += this.vy;
        this.vida -= 16;
    },

    desenhar: function() {
        this.context.fillStyle = '#ffff00';
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.raio, 0, Math.PI * 2);
        this.context.fill();
    },

    estaValido: function() {
        return this.vida > 0 && this.x > 0 && this.x < 800 && this.y > 0;
    }
}