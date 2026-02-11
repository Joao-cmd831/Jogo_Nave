function PowerUp(context, x, y, tipo) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.tipo = tipo;
    this.vy = 2;
    this.angle = 0;
}

PowerUp.prototype = {
    atualizar: function() {
        this.y += this.vy;
        this.angle += 0.1;
    },

    desenhar: function() {
        this.context.save();
        this.context.translate(this.x, this.y);
        this.context.rotate(this.angle);

        this.context.fillStyle = '#ff00ff';
        this.context.beginPath();
        this.context.moveTo(0, 5);
        this.context.bezierCurveTo(-8, -5, -10, -8, -5, -8);
        this.context.bezierCurveTo(0, -13, 5, -8, 10, -8);
        this.context.bezierCurveTo(5, -8, 0, 5, 0, 5);
        this.context.closePath();
        this.context.fill();

        this.context.restore();
    },

    estaForaDeTelaVertical: function() {
        return this.y > 600;
    }
}