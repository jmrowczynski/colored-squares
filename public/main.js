const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const scoreDOM = document.getElementById("score");

const SIZE = 70;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

class Map {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.squares = [];
    this.colors = [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "navy",
      "purple"
    ];
    this.score = 0;
  }

  create() {
    for (let i = 0; i < this.y; i++) {
      const tempArr = [];
      for (let j = 0; j < this.x; j++) {
        const color = this.colors[getRandomInt(0, this.colors.length)];
        tempArr.push(new Square(j * SIZE, i * SIZE, j, i, color));
      }
      this.squares.push(tempArr);
    }
  }

  drawMap() {
    canvas.height = this.y * SIZE;
    canvas.width = this.x * SIZE;
    this.squares.forEach(squares => {
      squares.forEach(square => {
        square.paint();
      });
    });
  }

  update() {
    this.squares.forEach(squares => {
      squares.forEach(square => {
        if (square.visited) {
          this.score++;
          square.visited = false;
        }
      });
    });
    scoreDOM.textContent = `Score: ${this.score}`;
  }

  search(obj) {
    //debugger;
    if (obj.visited) return;

    if (
      this.squares[obj.y][obj.x + 1] &&
      obj.color === this.squares[obj.y][obj.x + 1].color
    ) {
      obj.visited = true;
      this.search(this.squares[obj.y][obj.x + 1]);
    }
    if (
      this.squares[obj.y][obj.x - 1] &&
      obj.color === this.squares[obj.y][obj.x - 1].color
    ) {
      obj.visited = true;
      this.search(this.squares[obj.y][obj.x - 1]);
    }
    if (
      this.squares[obj.y + 1][obj.x] &&
      obj.color === this.squares[obj.y + 1][obj.x].color
    ) {
      obj.visited = true;
      this.search(this.squares[obj.y + 1][obj.x]);
    }
    if (
      this.squares[obj.y - 1][obj.x] &&
      obj.color === this.squares[obj.y - 1][obj.x].color
    ) {
      obj.visited = true;
      this.search(this.squares[obj.y - 1][obj.x]);
    }
  }

  init(x, y) {
    m.squares.forEach(squares => {
      squares.forEach(square => {
        if (
          square.dx < x &&
          square.dx + SIZE > x &&
          square.dy < y &&
          square.dy + SIZE > y
        ) {
          this.search(square);

          for (const s of m.squares) {
            const temp = [];
            for (const e of s) {
              temp.push(e.visited);
            }
            console.log(temp);
          }
          this.update();
        }
      });
    });
  }
}

class Square {
  constructor(dx, dy, x, y, color) {
    this.dx = dx;
    this.dy = dy;
    this.x = x;
    this.y = y;
    this.color = color;
    this.sizeX = SIZE;
    this.sizeY = SIZE;
    this.visited = false;
  }

  paint() {
    c.fillStyle = this.color;
    c.fillRect(this.dx, this.dy, this.sizeX, this.sizeY);
  }
}

const m = new Map(12, 12);
m.create();
m.drawMap();

canvas.addEventListener("mouseup", function(e) {
  const rect = this.getBoundingClientRect();
  const x = e.pageX - (rect.left + window.scrollX);
  const y = e.pageY - (rect.top + window.scrollY);
  m.init(x, y);
});
