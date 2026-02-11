function Jogo(context, teclado, animacao, largura, altura) {
    this.context = context;
    this.teclado = teclado;
    this.animacao = animacao;
    this.largura = largura;
    this.altura = altura;

    this.score = 0;
    this.vidas = 3;
    this.nivel = 1;
    this.inimigosDestruidos = 0;
    this.gameSpeed = 1;
    this.jogando = true;
    this.pausado = false;

    this.nave = new Nave(context, teclado, largura, altura);
    this.tiros = [];
    this.inimigos = [];
    this.powerUps = [];
    this.explosoes = [];

    this.animacao.novoSprite(this);
    this.iniciarInimigos();

    var jogo = this;
    document.getElementById('pauseBtn').addEventListener('click', function() {
        jogo.togglePause();
    });
}

Jogo.prototype = {
    atualizar: function() {
        if (!this.jogando || this.pausado) return;

        this.nave.atualizar();

        for (var i = this.tiros.length - 1; i >= 0; i--) {
            this.tiros[i].atualizar();
            if (!this.tiros[i].estaValido()) {
                this.tiros.splice(i, 1);
            }
        }

        for (var i = 0; i < this.inimigos.length; i++) {
            this.inimigos[i].atualizar();
            if (this.inimigos[i].estaForaDeTelaVertical()) {
                this.inimigos.splice(i, 1);
                i--;
            }
        }

        for (var i = this.powerUps.length - 1; i >= 0; i--) {
            this.powerUps[i].atualizar();
            if (this.powerUps[i].estaForaDeTelaVertical()) {
                this.powerUps.splice(i, 1);
            }
        }

        for (var i = this.explosoes.length - 1; i >= 0; i--) {
            this.explosoes[i].atualizar();
            if (this.explosoes[i].estaCompleta()) {
                this.explosoes.splice(i, 1);
            }
        }

        this.verificarColisoesTiros();
        this.verificarColisoeNaveeInimigos();
        this.verificarColisoesPowerUps();

        if (this.inimigos.length === 0) {
            this.nivel++;
            this.iniciarInimigos();
        }

        this.atualizarUI();
    },

    desenhar: function() {
        if (!this.jogando) return;

        this.nave.desenhar();

        for (var i = 0; i < this.tiros.length; i++) {
            this.tiros[i].desenhar();
        }

        for (var i = 0; i < this.inimigos.length; i++) {
            this.inimigos[i].desenhar();
        }

        for (var i = 0; i < this.powerUps.length; i++) {
            this.powerUps[i].desenhar();
        }

        for (var i = 0; i < this.explosoes.length; i++) {
            this.explosoes[i].desenhar();
        }
    },

    atirar: function() {
        var tiro = new Tiro(this.context, this.nave.x, this.nave.y);
        this.tiros.push(tiro);
        this.playSound(800, 0.1);
    },

    verificarColisoesTiros: function() {
        for (var i = this.tiros.length - 1; i >= 0; i--) {
            for (var j = this.inimigos.length - 1; j >= 0; j--) {
                var tiro = this.tiros[i];
                var inimigo = this.inimigos[j];
                var dx = tiro.x - inimigo.x;
                var dy = tiro.y - inimigo.y;
                var dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 20) {
                    this.tiros.splice(i, 1);
                    inimigo.vida--;
                    this.explosoes.push(new Explosao(this.context, inimigo.x, inimigo.y, 15));
                    this.playSound(600, 0.08);

                    if (inimigo.vida <= 0) {
                        this.inimigos.splice(j, 1);
                        this.score += inimigo.tipo === 'strong' ? 30 : 10;
                        this.inimigosDestruidos++;

                        if (this.inimigosDestruidos % 5 === 0) {
                            this.gameSpeed += 0.2;
                            this.playSound(1200, 0.2);
                            this.playSound(1500, 0.1);
                        }

                        this.explosoes.push(new Explosao(this.context, inimigo.x, inimigo.y, 30));
                        if (Math.random() < 0.3) {
                            this.powerUps.push(new PowerUp(this.context, inimigo.x, inimigo.y, 'life'));
                        }
                    }
                    break;
                }
            }
        }
    },

    verificarColisoeNaveeInimigos: function() {
        for (var i = 0; i < this.inimigos.length; i++) {
            var inimigo = this.inimigos[i];
            var dx = this.nave.x - inimigo.x;
            var dy = this.nave.y - inimigo.y;
            var dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 35) {
                this.vidas--;
                this.inimigos = [];
                this.explosoes.push(new Explosao(this.context, this.nave.x, this.nave.y, 40));
                this.playSound(100, 0.3);

                if (this.vidas <= 0) {
                    this.gameOver();
                } else {
                    this.nave.x = this.largura / 2;
                    this.nave.y = this.altura - 80;
                }
            }
        }
    },

    verificarColisoesPowerUps: function() {
        for (var i = this.powerUps.length - 1; i >= 0; i--) {
            var powerup = this.powerUps[i];
            var dx = this.nave.x - powerup.x;
            var dy = this.nave.y - powerup.y;
            var dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 30) {
                if (powerup.tipo === 'life') {
                    this.vidas++;
                    this.playSound(800, 0.2);
                    this.playSound(1000, 0.1);
                }
                this.powerUps.splice(i, 1);
            }
        }
    },

    iniciarInimigos: function() {
        var count = 2 + Math.floor(this.nivel * 0.5);
        for (var i = 0; i < count; i++) {
            var tipo = Math.random() > 0.7 ? 'strong' : 'normal';
            var inimigo = new Inimigo(this.context, Math.random() * (this.largura - 60) + 30, -30, this.gameSpeed, tipo);
            this.inimigos.push(inimigo);
        }
    },

    atualizarUI: function() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.vidas;
        document.getElementById('level').textContent = this.nivel;
    },

    togglePause: function() {
        this.pausado = !this.pausado;
        document.getElementById('pauseMenu').style.display = this.pausado ? 'block' : 'none';
        document.getElementById('pauseBtn').textContent = this.pausado ? '▶ RETOMAR' : '⏸ PAUSA';
    },

    gameOver: function() {
        this.jogando = false;
        document.getElementById('finalScore').textContent = 'Score: ' + this.score;
        document.getElementById('gameOverMenu').style.display = 'block';
    },

    reset: function() {
        this.score = 0;
        this.vidas = 3;
        this.nivel = 1;
        this.inimigosDestruidos = 0;
        this.gameSpeed = 1;
        this.jogando = true;
        this.pausado = false;
        this.tiros = [];
        this.inimigos = [];
        this.powerUps = [];
        this.explosoes = [];
        this.nave.x = this.largura / 2;
        this.nave.y = this.altura - 80;
        document.getElementById('pauseMenu').style.display = 'none';
        document.getElementById('gameOverMenu').style.display = 'none';
        document.getElementById('pauseBtn').textContent = '⏸ PAUSA';
        this.iniciarInimigos();
    },

    playSound: function(frequency, duration) {
        try {
            var audioContext = new (window.AudioContext || window.webkitAudioContext)();
            var osc = audioContext.createOscillator();
            var gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = frequency;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.1, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + duration);
        } catch (e) {}
    }
}
