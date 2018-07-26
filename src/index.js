import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

// Since the Square components no longer maintain state
// the Square components receive values from the Board component
// and inform the Board component when they’re clicked.
// In React terms, the Square components are now controlled components.
// The Board has full control over them
// class Square extends React.Component {
//   render() {
//     return (
//       // Let’s fill the Square component with an “X” when we click it
//       // onClick={ alert('click') } would fire the alert every time the component re-renders but click
//       <button
//         className="square"
//         onClick={ () => this.props.onClick() }>
//         { this.props.value }
//       </button>
//     );
//   }
// }

// functional components are a simply way to write components that only contain a render method
// and don't have their state
// Instead of defining a class which extends React.Component
function Square(props) {
  return (
    <button
      className="square"
      onClick={ props.onClick }>
      { props.value }
    </button>
  )
}


class Board extends React.Component {

  renderSquare(i) {
    return <Square
      value={ this.props.squares[i] }
      onClick={ this.props.onClick.bind(this, i) } />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          { this.renderSquare(0) }
          { this.renderSquare(1) }
          { this.renderSquare(2) }
        </div>
        <div className="board-row">
          { this.renderSquare(3) }
          { this.renderSquare(4) }
          { this.renderSquare(5) }
        </div>
        <div className="board-row">
          { this.renderSquare(6) }
          { this.renderSquare(7) }
          { this.renderSquare(8) }
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(i) {
    const HISTORY = [...this.state.history];
    const CURRENT = HISTORY[this.state.stepNumber];
    const squares = [...CURRENT.squares]

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      // the concat() methods doesn't mutate the original array
      // so we prefer it
      history: HISTORY.concat([{
        squares: squares,
      }]),
      stepNumber: HISTORY.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const HISTORY = [...this.state.history];
    const CURRENT = HISTORY[this.state.stepNumber];
    const WINNER = calculateWinner(CURRENT.squares);
    let status;
    if (WINNER) {
      status = 'Winner: ' + WINNER
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const MOVES = HISTORY.map((step, move) => {
      const DESC = move ? 'Go to move #' + move : 'Go to game start';
      return (
        // Keys help React identify which items have changed, are added, or are removed.
        // The best way to pick a key is to use a string that uniquely identifies a list item among its siblings
        // Only do this if items have no stable IDs <li key={ move }>
        // We don’t recommend using indexes for keys if the order of items may change
        // If you choose not to assign an explicit key to list items then React will default to using indexes as keys
        <li key={ move }>
          <button
            className={move === this.state.stepNumber ? 'bold' : ''}
            onClick={ this.jumpTo.bind(this, move) }>
            { DESC }
          </button>
        </li>
      )
    })

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={ CURRENT.squares }
            onClick={ this.handleClick } />
        </div>
        <div className="game-info">
          <div>
            { status }
          </div>
          <ol>
            { MOVES }
          </ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
)

function calculateWinner(squares) {
  const LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < LINES.length; i++) {
    const [a, b, c] = LINES[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// here are some ideas for improvements
// that you could make to the tic-tac-toe game
// which are listed in order of increasing difficulty:
/**
 * 1. Display the location for each move in the format (col, row) in the move history list.
 * 2. Bold the currently selected item in the move list.
 * 3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
 * 4. Add a toggle button that lets you sort the moves in either ascending or descending order.
 * 5. When someone wins, highlight the three squares that caused the win.
 * 6. When no one wins, display a message about the result being a draw.
 */
