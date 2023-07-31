window.onload = function () {


  // Variables permettant  de créer le canvas et de le rafraîchir et d'afficher le score


  var canvas;
  var ctx;
  var canvasWidth = 900;
  var canvasHeight = 600;
  var delay = 80;
  var score;
  var timeout;

  // Variables permettant de créer le serpent et la pomme

  var snakee;
  var applee;
  var blockSize = 30;

  // Variables permettant de vérifier les collisions

  var widthInBlock = canvasWidth / blockSize;
  var heightInBlock = canvasHeight / blockSize;

  init();

  function init() {

    //créer un canvas de dimension définie par les variables canvasWidth et canvasHeight et de bordure 1px solid grey

    canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "15px solid #111";
    canvas.style.borderRadius = "10px";
    canvas.style.margin = "50px auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#F3F3F3";
    
    const imgs = [
      {id: 'apple', src: './apple.png'}
    ]
    imgs.forEach(({id, src}) => {
      const image = document.createElement('img')
      image.id = id
      image.src = src
      canvas.appendChild(image)
      
    })


    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');

    //var snakee est l'objet Snake de tel coordonnées

    snakee = new Snake([[6, 4], [5, 4], [4, 4], [3, 4], [2, 4]], "right");
    applee = new Apple([10, 10]);
    score = 0;
    //Appelle la fonction qui rafraîchit le canvas

    refreshCanvas();

  }

  function refreshCanvas() {

    snakee.advance();
    if (snakee.checkCollision()) {
      gameOver();
    }
    else {
      if (snakee.isEatingApple(applee)) {
        score++;
        snakee.ateApple = true
        do {
          applee.setNewPosition();
        }
        while (applee.isOnSnake(snakee))
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawScore();
      snakee.draw();
      applee.draw();
      timeout = setTimeout(refreshCanvas, delay);

    }


  }

  function gameOver() {
    ctx.save();
    ctx.font = " 70px Poppins";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // ctx.strokeStyle = "#E5AED5";
    ctx.lineWidth = 5;
    var centreX = canvasWidth / 2;
    var centreY = canvasHeight / 2;
    ctx.strokeText("Game Over", centreX, centreY - 180);
    ctx.fillText("Game Over", centreX, centreY - 180);
    ctx.font = "30px Poppins";
    ctx.fillText("Appuyer sur la touche espace pour rejouer", centreX, centreY - 120);
    ctx.restore();
  }

  function restart() {
    snakee = new Snake([[6, 4], [5, 4], [4, 4], [3, 4], [2, 4]], "right");
    applee = new Apple([10, 10]);
    score = 0;
    clearTimeout(timeout);
    refreshCanvas();
  }

  function drawScore() {
    ctx.save();
    ctx.font = "bold 200px sans-serif";
    ctx.fillStyle = "#D59DEC";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var centreX = canvasWidth / 2;
    var centreY = canvasHeight / 2;
    ctx.fillText(score.toString(), centreX, centreY);
    ctx.restore();
  }
  function drawBlock(ctx, position) {

    var x = position[0] * blockSize;
    var y = position[1] * blockSize;

    // fillrect sur l'axe x aux coordonées position[0]*30 et 
    //sur l'axe y position[1]*30 et de taille 30 sur l'axe x, 30 sur l"axe y

    ctx.fillRect(x, y, blockSize, blockSize);

  }

  function Apple(position) { //10 pour x et 10 pour y
    this.position = position;
    this.draw = function () {
      /** Simple shape */
      // ctx.save();
      // ctx.fillStyle = "#A3E6EC ";
      // ctx.beginPath();
      // var radius = blockSize / 2;
      // var x = this.position[0] * blockSize + radius;
      // var y = this.position[1] * blockSize + radius;
      // ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      // ctx.fill();
      // ctx.restore();

      var x = this.position[0] * blockSize;
      var y = this.position[1] * blockSize;
      const img = document.querySelector('#apple')
      ctx.drawImage(img, x, y, blockSize, blockSize);


    };
    this.setNewPosition = function () {
      var newX = Math.round(Math.random() * (widthInBlock - 1));
      var newY = Math.round(Math.random() * (heightInBlock - 1));
      this.position = [newX, newY];

    };
    this.isOnSnake = function (snakeToCheck) {

      var isOnSnake = false;
      console.log(this.position[1]);

      for (var i = 0; i < snakeToCheck.body.length; i++) {
        console.log(snakeToCheck.body[i][0]);
        console.log(snakeToCheck.body[i][1]);
        if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {

          isOnSnake = true;
        }
      }
      return isOnSnake;

    };
  }

  function Snake(body, direction) //[[6, 4],[5, 4], [4, 4]] 
  {
    this.body = body;
    this.direction = direction;
    this.ateApple = false;
    this.draw = function () {
      //snakee.draw = dessine le snake de coordonnées [[6, 4],[5, 4], [4, 4]]

      ctx.save();
      ctx.fillStyle = "#48E3C7 ";
      for (var i = 0; i < this.body.length; i++) {
        drawBlock(ctx, this.body[i]);
      }
      ctx.restore();

    };

    this.advance = function () { //méthode avancer
      var nextPosition = this.body[0].slice(); //tête du serpent stocké dans nextPos
      switch (this.direction) {
        case "left":
          nextPosition[0] -= 1; //x de tête du serpent -1
          break;
        case "right":
          nextPosition[0] += 1; //x de tête du serpent +1
          break;
        case "up":
          nextPosition[1] -= 1; //y de tête du serpent -1
          break;
        case "down":
          nextPosition[1] += 1; //y de tête du serpent +1
          break;
        default:
          return;

      }
      this.body.unshift(nextPosition); //renvoie la taille du tableau avec la nouvelle valeur ???
      if (!this.ateApple)
        this.body.pop(); //Enlève le dernier élément du array (la queue du serpent)
      else
        this.ateApple = false;
    };
    this.setDirection = function (newDirection)
    //setDirection prend en paramètre newDirection qui renvoie left, right, down ou up 
    //en fonction de la touche utilisée
    {
      var allowedDirections;
      switch (this.direction) {
        case "left":
        case "right":
          allowedDirections = ["up", "down"];
          break;
        //dans le cas ou notre serpent se dirige vers la gauche ou vers la droite, 
        //on peut lui faire changer de direction vers le haut ou vers le bas
        case "down":
        case "up":
          allowedDirections = ["right", "left"];
          break;
        //dans le cas ou notre serpent se dirige en haut/en bas, 
        //on peut lui faire changer de direction vers la droite ou vers la gauche
        default:
          return;
      }

      if (allowedDirections.indexOf(newDirection) > -1) {
        this.direction = newDirection; //paramètre direction du snake prend la valeur de newDirection
      }


    };

    this.checkCollision = function () {

      var wallCollision = false;
      //boolean false/true de verification de collision dans le mur
      var snakeCollision = false;
      //boolean false/true de verification de serpent qui... se mord la queue


      var head = this.body[0]; //premier block de snakee contenant ses coords x et y
      var rest = this.body.slice(1);

      var snakeX = head[0]; //x du premier block de snakee
      var snakeY = head[1]; //y du premier block de snakee

      var minX = 0; //minX = 0 a comparer avec x de snakee
      var minY = 0; //minY = 0 a comparer avec y de snakee

      var maxX = widthInBlock - 1; //maxX = (900/30) -1 soit 29
      var maxY = heightInBlock - 1; //maxY = (600/30) -1 soit 19

      //Si snakeX est inférieur à 0/supérieur à 29 stocké dans isNotBetweenHorizontalWalls
      var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;

      //Si snakeY est inférieur à 0/supérieur à 19 stocké dans isNotBetweenVerticalWalls

      var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

      //Au moment ou l'une des deux vars ci dessus se réalisent, alors wallCollision = true

      if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
        wallCollision = true;
      }

      for (var i = 0; i < rest.length; i++) {
        if (snakeX === rest[i][0] && snakeY === rest[i][1])

          snakeCollision = true;
      }

      return wallCollision || snakeCollision;
    };

    this.isEatingApple = function (AppleToEat) {
      var head = this.body[0];
      if (head[0] === AppleToEat.position[0] && head[1] === AppleToEat.position[1])
        return true;
      else
        return false;

    };





  }

  document.onkeydown = function handleKeyDown(e) {
    var key = e.keyCode;
    var newDirection;
    switch (key) {
      case 37:
        newDirection = "left";
        break;

      case 38:
        newDirection = "up";
        break;

      case 39:
        newDirection = "right";
        break;

      case 40:
        newDirection = "down";
        break;

      case 32:
        restart();
        return

      default:
        return;
    }

    snakee.setDirection(newDirection);
  }

}