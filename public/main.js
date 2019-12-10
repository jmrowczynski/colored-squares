const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const scoreDOM = document.getElementById('score');

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
    this.colors = ['red', 'orange', 'yellow', 'green', 'blue', 'navy', 'purple'];
    this.score = 0;
  }

  createMap() {
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
        square.draw();
      });
    });
  }

  createGroup(square) {
    const group = [];
    for (let i = square.y; i < this.squares.length; i++) {
      if (this.squares[i][square.x].visited) {
        this.score++;
        this.squares[i][square.x].visited = false;
        this.squares[i][square.x].color = 'x';
        group.push(this.squares[i][square.x]);
      }
    }
    return group;
  }

  moveGroup(group, distance) {
    group.forEach(({ x }) => {
      for (let i = distance; i > 0; i--) {
        const temp = this.squares[i][x].color;
        this.squares[i][x].color = this.squares[i - 1][x].color;
        this.squares[i - 1][x].color = temp;
      }
    });
  }

  fillEmptySquares() {
    this.squares.forEach(squares => {
      squares.forEach(square => {
        if (square.color === 'x') {
          square.color = this.colors[getRandomInt(0, this.colors.length)];
        }
      });
    });
  }

  update() {
    this.squares.forEach(squares => {
      squares.forEach(square => {
        if (square.visited) {
          const group = this.createGroup(square); // making vertical groups and updating score
          const dist = group[group.length - 1].y;
          this.moveGroup(group, dist);
          this.fillEmptySquares();
        }
      });
    });
    this.drawMap();
    scoreDOM.textContent = `Score: ${this.score}`;
  }

  search(obj) {
    if (obj.visited) return;
    const { x, y, color } = obj;
    if (x + 1 < this.squares[0].length && color === this.squares[y][x + 1].color) {
      obj.visited = true;
      this.search(this.squares[y][x + 1]);
    }

    if (x - 1 >= 0 && color === this.squares[y][x - 1].color) {
      obj.visited = true;
      this.search(this.squares[y][x - 1]);
    }
    if (y + 1 < this.squares.length && color === this.squares[y + 1][x].color) {
      obj.visited = true;
      this.search(this.squares[y + 1][x]);
    }

    if (y - 1 >= 0 && color === this.squares[y - 1][x].color) {
      obj.visited = true;
      this.search(this.squares[y - 1][x]);
    }
  }

  init(x, y) {
    m.squares.forEach(squares => {
      squares.forEach(square => {
        const { dx, dy } = square;
        if (dx < x && dx + SIZE > x && dy < y && dy + SIZE > y) {
          this.search(square);
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

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.dx, this.dy, this.sizeX, this.sizeY);
  }
}

const m = new Map(10, 10);
m.createMap();
m.drawMap();

canvas.addEventListener('mouseup', function(e) {
  const rect = this.getBoundingClientRect();
  const x = e.pageX - (rect.left + window.scrollX);
  const y = e.pageY - (rect.top + window.scrollY);
  m.init(x, y);
});
