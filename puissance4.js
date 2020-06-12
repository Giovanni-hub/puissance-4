$(document).ready(function() {
    const puissance4 = new Puissance4('#puissance4'); 
});

class Puissance4 {

    constructor(board) {
        this.ROWS = 6;
        this.COLS = 7;
        this.player = 'red';
        this.board = board;
        this.endGame = false;
        this.createTable();
        this.tokenMove();
    }

    createTable() { //method create grid

        const $board = $(this.board);
        $board.empty();
        this.endGame = false;
        this.player = 'red';

        for (let row = 0; row < this.ROWS; row++) {
            const $row = $('<div>').addClass('row');  // add class row to each div
                for (let col = 0; col < this.COLS; col++) {
                    const $col = $('<div>').addClass('col empty').attr('data-col', col).attr('data-row', row); // add 1 class col empty & 2 data attributes 
                    $row.append($col); //add cols to rows append: Insert content, specified by the parameter, to the end of each element in the set of matched elements
                }
        $board.append($row); //add rows to board 
        }
    }

    tokenMove() {

        const $board = $(this.board);
        const that = this; // refer to player

        function lastBlankCell(col) {
        const cells = $(`.col[data-col='${col}']`); // var cell = value of class col attr data col

        for (let i = cells.length - 1; i >= 0; i--) { // inverse loop that begin from the bottom
            const $cell = $(cells[i]);
                if ($cell.hasClass('empty')) { // cell that have a class empty
                    return $cell;
                }
        }
        return null;
    }

    $board.on('mouseenter', '.col.empty', function() { // when mouse enter class col empty
        if (that.endGame) return;
        const col = $(this).data('col'); // var col prends la valeur de l'attr de données data
        const $lastBlankCell = lastBlankCell(col);
        $lastBlankCell.addClass(`next-${that.player}`);
    });

    $board.on('mouseleave', '.col', function() {
        $('.col').removeClass(`next-${that.player}`); // remove class next player red or yellow
    });

    $board.on('click', '.col.empty', function() {  // on click on class col empty
        if (that.endGame) return;
        const col = $(this).data('col'); 
        const $lastBlankCell = lastBlankCell(col);
        $lastBlankCell.removeClass(`empty next-${that.player}`);
        $lastBlankCell.addClass(that.player);
        $lastBlankCell.data('player', that.player);
        const winner = that.checkVictory($lastBlankCell.data('row'), $lastBlankCell.data('col'));
        
        if (winner) {
            that.endGame = true;
            alert(`Player ${that.player} Win!`);
            if(confirm('Try Again?')){
                window.location.reload();  
            }
            return;
        }

        that.player = (that.player === 'red') ? 'yellow' : 'red'; // change player
        $('p').text(`Player turn ${that.player}`);
        });
    }

    checkVictory(row, col) {
    const that = this;

    function $getCell(Y, X) { 
    return $(`.col[data-row='${Y}'][data-col='${X}']`);
    }

    function checkTrajectory(trajectory) {
        let total = 0;
        let Y = row + trajectory.Y;
        let X = col + trajectory.X;
        let $next = $getCell(Y, X);
        while (Y >= 0 && Y < that.ROWS && X >= 0 && X < that.COLS && $next.data('player') === that.player) {
            total++;
            Y += trajectory.Y;
            X += trajectory.X;
            $next = $getCell(Y, X);
        }
        return total;
    }

    function checkWin(trajectory1, trajectory2) {
        const total = 1 + checkTrajectory(trajectory1) + checkTrajectory(trajectory2);
        if (total >= 4) {
            return that.player;
        }
        else {
            return null;
        }
    }
    
    function checkVertical() {
        return checkWin({Y: -1, X: 0}, {Y: 1, X: 0});
    }

    function checkHorizontal() {
        return checkWin({Y: 0, X: -1}, {Y: 0, X: 1});
    }
    function checkDiagonal1() {
        return checkWin({Y: 1, X: -1}, {Y: 1, X: 1});
    }

    function checkDiagonal2() {
        return checkWin({Y: 1, X: 1}, {Y: -1, X: -1});
    }

    

    return checkVertical() || checkHorizontal() || checkDiagonal1() || checkDiagonal2();
    }
}