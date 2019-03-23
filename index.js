const screenWidth = window.innerWidth;

const Bird = {
  id: null,
  canvas: null,
  ctx: null,
  bird: {
    x: 50,
    y: 250
  },
  speed: 0,
  score: 0, // 分数
  ac: .15, // 加速度
  columns: [], // 柱子
  empty: 130, // 缺口高度
  space: 180, // 柱子之间的间隔
  init() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = screenWidth;
    this.canvas.height = 500;
    this.run();
    this.bind();
  },
  randomColumn() { // 随机生成柱子
    const tl = 130 + 150 * Math.random();
    return {
      tl,
      w: 50,
      bl: this.canvas.height - tl - this.empty,
      x: this.canvas.width,
    }
  },
  run() {
    const column = this.randomColumn();
    column.x = 300;
    this.columns.push(column);
    this.gameOver = false;
    this.bird = {
      x: 50,
      y: 250
    };
    this.speed = 0;
    this.scope = 0;
    this.id = requestAnimationFrame(this.draw.bind(this));
  },
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.speed += this.ac;
    this.bird.y += this.speed;
    this.drawBird();
    this.drawColumn();
    this.drawNumber();
    this.collision();
    this.id = requestAnimationFrame(this.draw.bind(this));
    if (this.gameOver) {
      cancelAnimationFrame(this.id);
    }

  },
  drawBird() { // 画鸟
    const x = this.bird.x;
    const y = this.bird.y;
    this.ctx.strokeRect(x, y + 15, 22, 16);
    this.ctx.arc(x + 30, y + 23, 8, 2 * Math.PI, false);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x + 4, y);
    this.ctx.lineTo(x + 10, y + 15);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x + 4, y);
    this.ctx.lineTo(x + 22, y + 15);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x + 4, y + 50);
    this.ctx.lineTo(x + 10, y + 31);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x + 4, y + 50);
    this.ctx.lineTo(x + 22, y + 31);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x + 50, y + 25);
    this.ctx.lineTo(x + 38, y + 27);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x + 50, y + 25);
    this.ctx.lineTo(x + 38, y + 22);
    this.ctx.stroke();
    this.ctx.beginPath();
  },
  drawColumn() { // 画柱子
    for (let i = 0; i < this.columns.length; i++) {
      const column = this.columns[i];
      this.ctx.strokeRect(column.x, 0, column.w, column.tl);
      this.ctx.strokeRect(column.x, column.tl + this.empty, column.w, column.bl);
      this.columns[i].x--;
    }

    // 判断最后一根柱子是否移动超过间隔，则增加一根柱子
    if (this.columns[this.columns.length - 1].x < this.canvas.width - this.space) {
      this.columns.push(this.randomColumn());
    }

    // 判断第一根柱子是否移出屏幕外，增删除第一根柱子
    if (this.columns[0].x < -this.columns[0].w) {
      this.columns.shift();
    }

  },
  drawNumber() { // 画分数
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#000';
    this.ctx.font = '18px STheiti, SimHei';
    this.ctx.fillText(`得分：${this.score}`, 20, 20);
  },
  collision() { // 碰撞检测，判断鸟与第一根柱子是否碰撞（鸟的体积小于2根柱子之间的距离，所以只用检测第一根柱子）
    const x = this.columns[0].x;
    const y = this.columns[0].tl;
    if (x === 0) {
      this.score++;
    }
    if (x > 100 || x < 0) return;
    if ((this.bird.y < y) || ((this.bird.y + 50) > (y + this.empty))) {
      this.gameOver = true;
    }
  },
  bind() {
    this.canvas.addEventListener('touchstart', () => {
      this.speed = -4;
    });
  },
}

Bird.init();