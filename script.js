function Game(){
    this.gameboard = new Gameboard();

    this.display = new Display();
    this.display.displayBoard(gameboard.gameboard);

    this.computer = new Computer(this.gameboard, this.display)

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

    this.fullBoard = () => {
        let full = true;

        for (let i = 0; i < 3; i++){
            this.gameboard[i].forEach((board) => {
                if (board[0] == " " || board[1] == " " || board[2] == " "){
                    full = false;
                }
            })
        }
        return full;
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
        if (!m){
            this.setMarker("X")
        }
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
                        if (!this.gameboard.fullBoard()){
                            this.computer.playMove()
                        }
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

function Computer(gameboard, dis){
    this.gb = gameboard;
    this.display = dis;
    const winningPositions = [[[0,0],[1,1],[2,2]],[[0,0],[0,1],[0,2]],[[0,0],[1,0],[2,0]],[[1,0],[1,1],[1,2]],[[2,0],[2,1],[2,2]],[[0,1],[1,1],[2,1]],[[0,2],[1,2],[2,2]],[[0,2],[1,1],[2,0]]];

    this.playMove = () => {
        // Copy gameboard
        let gameboardCopy = []
        gameboardCopy.push(this.gb.gameboard[0].slice())
        gameboardCopy.push(this.gb.gameboard[1].slice())
        gameboardCopy.push(this.gb.gameboard[2].slice())


        move = this.minimax(gameboardCopy, "O");
        this.gb.placeMarker("O", move.row, move.column);
        this.display.displayBoard(this.gb.gameboard);
    }

    this.minimax = (newBoard, player) => {
        // Make list of the empty spots
        let array = this.availableMoves(newBoard);

        // Check for terminal states and return object with score property of +1 or -1 depending on who wins
        winner = this.getWinner(newBoard);
        if (winner == "X"){
            return {score : -1}
        }
        else if (winner == "O"){
            return {score : 1}
        }
        else if (array.length == 0) {
            return {score : 0}
        }

        // Loop through empty spots, changing newBoard and player
        let moves = []
        array.forEach((emptySpace) => {
            let move = {};
            move.row = emptySpace[0];
            move.column = emptySpace[1];
            newBoard = this.nextBoard(newBoard, player, move.row, move.column);

            if (player == "O"){
                let g = this.minimax(newBoard, "X")
                move.score = g.score;
            }
            else{
                let g = this.minimax(newBoard, "O")
                move.score = g.score;
            }

            newBoard = this.nextBoard(newBoard, " ", move.row, move.column)

            moves.push(move)
        })

        // Return the lowest or highest of the returned values depending on who wins
        let bestMove;
        if (player == "O"){
            let bestScore = -10000;
            moves.forEach((move) => {
                if (move.score > bestScore){
                    bestScore = move.score;
                    bestMove = move;
                }
            })
        }
        else{
            let bestScore = 10000;
            moves.forEach((move) => {
                if (move.score < bestScore){
                    bestScore = move.score;
                    bestMove = move;
                }
            })
        }
        return bestMove;
    }

    this.nextBoard = (gameboard, marker, row, column) => {
        let returnGameboard = gameboard;
        returnGameboard[row][column] = marker;
        return(returnGameboard);
    }

    this.getWinner = (gameboard) => {
        const winningPositions = [[[0,0],[1,1],[2,2]],[[0,0],[0,1],[0,2]],[[0,0],[1,0],[2,0]],[[1,0],[1,1],[1,2]],[[2,0],[2,1],[2,2]],[[0,1],[1,1],[2,1]],[[0,2],[1,2],[2,2]],[[0,2],[1,1],[2,0]]];
        let winner = "";
        winningPositions.forEach((pos) => {
            if (gameboard[pos[0][0]][pos[0][1]] == gameboard[pos[1][0]][pos[1][1]] && gameboard[pos[1][0]][pos[1][1]] == gameboard[pos[2][0]][pos[2][1]] && (gameboard[pos[0][0]][pos[0][1]] == "X" || gameboard[pos[0][0]][pos[0][1]] == "O")){
                winner = gameboard[pos[0][0]][pos[0][1]];
                return false;
            }
        });

        return winner;
    }

    this.availableMoves = (board) => {
        let moves = [];

        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                if (board[i][j] == " "){
                    moves.push([i,j]);
                }
            }
        }

        return(moves);
    }
}

Game();