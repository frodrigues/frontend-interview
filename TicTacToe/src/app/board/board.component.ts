import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  squares: any[];
  xIsNext: boolean;
  winner: string;

  timer: number = 0;
  interval;
  display;
  matches;
  winners: string[] = [];
  winsP1 = 0;
  winsP2 = 0;


  constructor() { }

  ngOnInit() {
    this.newGame();
  }
  startTimer() {
    this.interval = setInterval(() => {
      this.timer++;
      this.display = this.transform(this.timer)
    }, 1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }
  newGame() {
    this.squares = Array(9).fill(null);
    this.winner = null;
    this.xIsNext = true;
    this.timer = 0;


    //matches
    if (localStorage.getItem("matches") === null) {
      localStorage.setItem("matches", "0");
      this.matches = localStorage.getItem("matches");
    } else {
      this.matches = parseInt(localStorage.getItem('matches')) + 1;
      localStorage.setItem('matches', this.matches);
    }

  }

  get player() {
    return this.xIsNext ? 'X' : 'O';
  }

  makeMove(idx: number) {

    if (this.squares.filter(e => e === null).length === 9) {
      this.startTimer();
    }

    if (!this.squares[idx]) {
      this.squares.splice(idx, 1, this.player);
      this.xIsNext = !this.xIsNext;
    }

    this.winner = this.calculateWinner();

    if (this.winner != null) {
      let player = this.winner == 'X' ? '1' : '2';
      this.winners.push("P" + player);
      localStorage["winners"] = JSON.stringify(this.winners);

      this.winsP1 = this.winners.filter(e => e === 'P1').length;
      this.winsP2 = this.winners.filter(e => e === 'P2').length;


      Swal.fire({
        title: 'Player ' + player + ' won the game!',
        text: "New game?",
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#37a8ee',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, please!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.newGame();
        }
      })
    } else {
      if (this.squares.filter(e => e === null).length === 0) {
        Swal.fire({
          title: 'It\'s a tie!',
          text: "New game?",
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#37a8ee',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, please!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.newGame();
          }
        })
      }
    }
  }

  calculateWinner() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        this.squares[a] &&
        this.squares[a] === this.squares[b] &&
        this.squares[a] === this.squares[c]
      ) {
        this.pauseTimer();
        return this.squares[a];
      }
    }
    return null;
  }

  transform(value: number): string {
    var sec_num = value;
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);


    return this.pad(hours, 2) + ':' + this.pad(minutes, 2) + ':' + this.pad(seconds, 2);
  }
  pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
  }
}
