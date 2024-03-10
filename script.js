function Game(){
    this.gameboard = new Gameboard();

    this.display = new Display();
    this.display.displayBoard(gameboard.gameboard);

    this.computer = Computer(this.gameboard, this.display)

    this.player = new Player(this.display.squares, this.gameboard, this.display, this.computer);

    numPlayersButton = document.querySelector(".num-players-button")
    numPlayersButton.addEventListener("click", () => {
        if (numPlayersButton.textContent == "Single Player"){
            numPlayersButton.textContent = "Multi-Player";
            player.setMultiPlayer(true);
        }
        else{
            numPlayersButton.textContent = "Single Player";
            player.setMultiPlayer(false);
        }
    })

    restartButton = document.querySelector(".restart-button")
    restartButton.addEventListener("click", () => {
        this.gameboard.reset();
        this.display.displayBoard(gameboard.gameboard);
        document.querySelector(".winner-text").innerHTML = "";
    })
}

function Gameboard(){
    this.gameboard = [[" "," "," "],[" "," "," "],[" "," "," "]];

    this.placeMarker = (marker, row, column) => {
        if (!this.getWinner() && this.gameboard[row][column] == " "){
            this.gameboard[row][column] = marker;
            if (this.getWinner()){
                document.querySelector(".winner-text").innerHTML = this.getWinner() + " Wins!"
            }
            return(true)
        }
    }

    this.getWinner = () => {
        const winningPositions = [[[0,0],[1,1],[2,2]],[[0,0],[0,1],[0,2]],[[0,0],[1,0],[2,0]],[[1,0],[1,1],[1,2]],[[2,0],[2,1],[2,2]],[[0,1],[1,1],[2,1]],[[0,2],[1,2],[2,2]],[[0,2],[1,1],[2,0]]];
        let winner = "";
        winningPositions.forEach((pos) => {
            if (this.gameboard[pos[0][0]][pos[0][1]] == this.gameboard[pos[1][0]][pos[1][1]] && this.gameboard[pos[1][0]][pos[1][1]] == this.gameboard[pos[2][0]][pos[2][1]] && (this.gameboard[pos[0][0]][pos[0][1]] == "X" || this.gameboard[pos[0][0]][pos[0][1]] == "O")){
                winner = this.gameboard[pos[0][0]][pos[0][1]];
                return false;
            }
        });

        return winner;
    }

    this.reset = () => {
        this.gameboard = [[" "," "," "],[" "," "," "],[" "," "," "]];
    }
}

function Player(squares, gb, dis, comp){
    this.multiPlayer = false;
    this.marker = "X";
    this.gameboard = gb;
    this.display = dis;
    this.computer = comp;

    this.setMarker = (m) => {
        this.marker = m
        document.querySelector(".turn-text").innerText = "It's " + m + "'s turn!";
    }

    this.setMultiPlayer = (m) => {
        this.multiPlayer = m;
        this.gameboard.reset();
        this.display.displayBoard(this.gameboard.gameboard)
    }

    squares.forEach((row) => {
        row.forEach((square) => {
            square.addEventListener("click", () => {
                let column = square.parentElement.className.split(" ")[1];
                let row = square.parentElement.className.split(" ")[2];
                if (this.gameboard.placeMarker(this.marker, row, column)){
                    if (this.multiPlayer){
                        if (this.marker == "X"){
                            this.setMarker("O")
                        }
                        else{
                            this.setMarker("X");
                        }
                    }
                    else{
                        //this.computer.playMove()
                    }
                }
                this.display.displayBoard(this.gameboard.gameboard);
            })
        })
    })
}

function Display(){
    const row1 = document.querySelector(".board").children[0]
    const square1 = row1.children[0].children[0];
    const square2 = row1.children[1].children[0];
    const square3 = row1.children[2].children[0];
    const row2 = document.querySelector(".board").children[1]
    const square4 = row2.children[0].children[0];
    const square5 = row2.children[1].children[0];
    const square6 = row2.children[2].children[0];
    const row3 = document.querySelector(".board").children[2]
    const square7 = row3.children[0].children[0];
    const square8 = row3.children[1].children[0];
    const square9 = row3.children[2].children[0];
    this.squares = [[square1,square2,square3],[square4,square5,square6],[square7,square8,square9]]

    this.displayBoard = (gameboard) => {
        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                this.squares[i][j].innerHTML = gameboard[i][j];
            }
        }
    }
}

function Computer(gb, dis){
    this.gameboard = gb;
    this.display = dis;

    this.playMove = () => {
        
    }
}

Game();