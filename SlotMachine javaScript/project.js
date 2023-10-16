// 1. User deposits money
// 2. Determine no. of lines to bet on
// 3. collect bet amount
// 4. Spin slot machine
// 5. Check is user won
// 6. give/take the user winnings/bet
// 7. play again?

const prompt = require("prompt-sync")();

//global variables in ALL CAPS
const ROWS  = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8,
};

const SYMBOLS_VALUES = {    //multiplier for each symbol
    A: 5,
    B: 4,
    C: 3,
    D: 2,
};

const deposit = () => {
    while (true){
        const depositAmount = prompt("Enter a deposit amount: ");
        //conv string to int
        const numberDepositAmount = parseFloat(depositAmount);

        if(isNaN(numberDepositAmount) || numberDepositAmount <= 0){
            console.log("Invalid deposit amount, try again.");
        } else {
            return numberDepositAmount;
        }
    }
};

const getNumberLines = () => {
    while(true){
        const lines = prompt("Enter the number of lines to bet on (1-3): ");
        const numberOfLines = parseFloat(lines);

        if(isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3){
            console.log("Invalid number of lines, try again.");
        } 
        else {
            return numberOfLines;
        }
    }
};

const getBet = (balance, lines) => {
    while(true){
        const bet = prompt("Enter the bet per line: ");
        const numberBet = parseFloat(bet);

        if(isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines){
            console.log("Invalid bet, try again.");
        } 
        else {
            return numberBet;
        }
    }
};

const spin = () => {
    const symbols = []; //array is constant and we are referencing things inside
    for(const[symbol, count] of Object.entries(SYMBOLS_COUNT)){
        for(let i = 0; i< count; i++){
            symbols.push(symbol);
        }
    }

    /* symbols array is : 
    A, A, B, B, B,
    B, C, C, C, C, 
    C, C, D, D, D, 
    D, D, D, D, D
    */

    const reels = []; //nested array is a col
    for(let i = 0; i<COLS; i++){
        reels.push([]); //insert a col or a nested array for each COL, i.e if COL = 3 we get reels[] = [[], [], []]
        const reelSymbols = [...symbols];   //copy symbols to new array called reelSymbols
        //doing this cause we need to choose possible symbols from symbols array and then delete the chosen one as we add them into each reel(i.e nested array)
        for(let j = 0; j<ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length)  //random returns float number between 0 and 1, floor of (how many symbols we have)
            //using floor as we want to round down because the possible indices we can pick from is length of reelSymbols - 1 (due to 0 based indexing)
                //randomIndex generates a number between 0 and (symbols.length - 1)
            
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            //remove selected symbol 
            reelSymbols.splice(randomIndex, 1)  //remove one element from randomIndex
        }
    }
    return reels;
};

//we need to transpose the reels array
/*
from [[A D A], [B C A], [D D A]]
to  [A B D]
    [D C D]
    [A A A]
*/

const transpose = (reels) => {
    const rows = [];
    for(let i = 0; i< ROWS; i++){
        rows.push([]);
        for(let j = 0; j<COLS; j++){
            //get element from first row in each col and push into rows array
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

const printRows = (rows) => {   
    for(const row of rows){
        let rowString = "";
        for(const [i, symbol] of row.entries()){
            rowString += symbol;
            if(i != row.length - 1)
                rowString += " | "
        }
        console.log(rowString);
    }
};

const getWinnings = (rows, bet, numberOfLines) => {
    //check as many rows as the user bet on
    let winnings = 0;

    for(let row = 0; row<numberOfLines; row++){
        //ex - if numberOfLines = 2, look at row index = 0 and 1 etc.
        const symbols = rows[row];
        let allSame = true;

        for(const symbol of symbols){
            if(symbol != symbols[0]){   //comparing each symbol to first symbol
                allSame = false;
                break;
            }
        }
        if(allSame){
            winnings += bet * SYMBOLS_VALUES[symbols[0]]    //multiply bet with the multiplier of the symbol in the rows i.e if A | A | A then multiply the multiplier for A with the bet, then add this to winnings
        }
    }
    return winnings;
};

const game = () => {
    
    let balance = deposit();
    while(true){
        console.log("Current balance = $" + balance);
        const numberOfLines = getNumberLines();
        const bet = getBet(balance, numberOfLines); //bet per line
        //subtract bet from balance
        balance = balance - bet * numberOfLines;

        const reels = spin();
        //console.log(reels);

        const rows = transpose(reels);
        //console.log(rows);

        printRows(rows)

        const winnings = getWinnings(rows, bet, numberOfLines);
        //add winnings to balance
        balance += winnings;
        console.log("Congrats! You won $" + winnings.toString());

        if(balance == 0){
            console.log("You have insufficient funds!");
            break;
        }
        //ask if they want to play again
        const playAgain = prompt("Play again (y/n)? ");
        if(playAgain != 'y')
            break;
    }
};

game();
