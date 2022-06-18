const card_list = [];
const existing_list = [];
var turn_flag = 0;
var card_check1, card_check2;
card_check1 = card_check2 = null;
var boardSize = 0,
  total_points;

class User {
  constructor(name = "No-Name") {
    this.name = name;
    this.score = 0;
    this.wins = 0;
  }
}

for (let i = 1; i <= 14; i++) {
  card_list.push("card" + i);
  existing_list.push(0);
}

var user1, user2;

function flip_turn() {
  var pl1 = document.querySelector("#p1").querySelector("h2");
  var pl2 = document.querySelector("#p2").querySelector("h2");
  //console.log("turn_flag >>>> ");
  //console.log(turn_flag);

  if (turn_flag % 2 == 0) {
    pl1.style.fontSize = "3vw";
    pl2.style.fontSize = "2vw";
  } else {
    pl1.style.fontSize = "2vw";
    pl2.style.fontSize = "3vw";
  }
}

async function flip(card) {
  var imgs = card.querySelectorAll("img");
  // console.log(imgs);
  if (imgs[0].style.display != "none") {
    imgs[0].style.display = "none";
    imgs[1].style.display = "block";
  } else {
    imgs[1].style.display = "none";
    imgs[0].style.display = "initial";
  }
  card.classList.toggle("is-flipped");
}

function initGame() {
  flip_turn(turn_flag);
  boardSize = 4;
  total_points = parseInt((boardSize * boardSize) / 2, 10);
  createBoardGame(boardSize);
}

function createBoardGame(boardSize) {
  var container = document.getElementsByClassName("content")[0];
  var game = document.getElementsByClassName("game")[0];
  container.style.display = "none";

  var tbl = document.createElement("table");
  tbl.setAttribute("border", "4");
  var counter = 1;
  for (var i = 0; i < boardSize; i++) {
    var tr = document.createElement("tr");
    for (var j = 0; j < boardSize; j++) {
      var td = document.createElement("td");
      var card = document.createElement("div");
      var front_img = new Image();
      front_img.setAttribute("class", "front_image");
      card.classList.add("card");
      card.classList.add(counter++);

      front_img.src = "./assets/back.png";

      td.style.backgroundColor = "#444";

      td.appendChild(card);
      card.appendChild(front_img);
      tr.appendChild(td);
    }
    tbl.appendChild(tr);
    game.appendChild(tbl);
  }

  randomizeBoard();
}

function initPlayerInfo() {
  //get the names of the players from local storage
  var n1 = document.getElementById("nme1").value;
  var n2 = document.getElementById("nme2").value;
  user1 = new User(n1);
  user2 = new User(n2);

  if (n1 !== "") user1.name = n1;
  if (n2 !== "") user2.name = n2;

  document.querySelector("#players").style.display = "block";
  document.querySelector("#p1").querySelector("h2").innerText = n1;
  document.querySelector("#p1").querySelector("h3").innerText =
    "Score: " + user1.score;

  document.querySelector("#p2").querySelector("h2").innerText = n2;
  document.querySelector("#p2").querySelector("h3").innerText =
    "Score: " + user2.score;
}

function randomizeBoard() {
  var ok;
  var table = document.querySelector("table");
  var rows = table.children;
  var random;
  var calc_num;

  for (let i = 0; i < rows.length; i++) {
    var cols = rows[i].children;
    for (let j = 0; j < cols.length; j++) {
      ok = false;
      while (!ok) {
        if (rows.length == 4) calc_num = 8;
        else if (rows.length == 2) calc_num = 2;
        else if (rows.length == 3) calc_num = 4;
        else calc_num = 13;

        random = parseInt(Math.random() * calc_num, 10);
        if (rows.length == 5 && random == 12 && existing_list[random] == 1) {
          continue;
        } else if (existing_list[random] < 2) {
          var card = cols[j].getElementsByClassName("card")[0];
          var image = new Image();
          image.setAttribute("class", "back_image");
          image.src = "./assets/" + card_list[random] + ".png";
          image.style.display = "none";

          card.appendChild(image);

          existing_list[random]++;
          ok = true;
        }
      }
    }
  }

  function check_pairs(card1, card2) {
    if (card1 === card2) {
      return;
    }
    if (
      card1
        .querySelectorAll("img")[1]
        .src.includes(card2.querySelectorAll("img")[1].src)
    ) {
      //console.log("match");
      return 1;
    }
    return 0;
  }

  function findImageColumn(card) {
    var tbl = document.querySelector("table");
    var rows = tbl.children;
    var cols;
    for (let i = 0; i < rows.length; i++) {
      cols = rows[i].children;
      for (let j = 0; j < rows.length; j++) {
        if (
          cols[j]
            .querySelectorAll("img")[1]
            .contains(card.querySelectorAll("img")[1])
        ) {
          cols[j].querySelector("div").classList.add("checked");
          cols[j].querySelector("div").style.cursor = "not-allowed";
          // console.log("found");
        }
      }
    }
  }

  function gameOver(user, isTie = false) {
    var user_wins = 1;

    var players = document.querySelector("#players");
    var game = document.querySelector(".game");

    game.style.display = players.style.display = "none";

    var win_container = document.createElement("div");
    var game_over = document.createElement("h2");
    var winner = document.createElement("h1");
    var play_again_btn = document.createElement("button");
    var btn_text = document.createElement("div");

    play_again_btn.setAttribute("onclick", "location.reload();");
    play_again_btn.setAttribute("type", "button");
    play_again_btn.setAttribute("class", "slide");

    btn_text.innerText = "Play Again >>";

    play_again_btn.appendChild(btn_text);

    win_container.setAttribute("class", "win-container");
    game_over.setAttribute("class", "game-over");
    game_over.innerText = "Game Over!";

    if (!isTie) {
      winner.innerText =
        "The Winner is: " +
        user.name +
        ", Score: " +
        user.score +
        ", Total Wins: " +
        user_wins;
    } else {
      winner.innerText = "It's a Tie!";
    }
    win_container.appendChild(game_over);
    win_container.appendChild(winner);
    win_container.appendChild(play_again_btn);
    document.body.appendChild(win_container);
  }

  var cards = document.querySelectorAll(".card");
  var is_match = 0;
  [...cards].forEach((card) => {
    card.addEventListener("click", function () {
      if (card.querySelectorAll("img")[1].src.includes("card13")) {
        if (turn_flag % 2 == 0) {
          // user2.wins++;
          // gameOver(user2);
        } else {
          // user1.wins++;
          // gameOver(user1);
        }
      }
      if (card.getAttribute("class").includes("checked")) {
        //console.log("cannot flip it");
      } else {
        flip(card);
        setTimeout(() => {
          if (card_check1 == null && card_check2 == null) card_check1 = card;
          else if (card_check1 != null && card_check2 == null) {
            card_check2 = card;
            is_match = check_pairs(card_check1, card_check2);

            if (!is_match) {
              flip(card_check1);
              flip(card_check2);
            } else {
              findImageColumn(card_check1);
              findImageColumn(card_check2);
            }
            card_check1 = card_check2 = null;
            turn_flag++;
            flip_turn();

            // console.log(is_match);
            is_match = 0;
          }
        }, 750);
      }
    });
  });
}
