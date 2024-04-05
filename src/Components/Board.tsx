import React, { useState } from 'react';
import { BOARD_SIZE, Piece, initializeBoard } from '../gererics/elements';


// se ira corrigiendo con el tiempo, hay cosas a discutir
const Board: React.FC = () => {
  const [board, setBoard] = useState<Piece[][]>(initializeBoard());
  // casilla seleccionada
  const [selectedPiece, setSelectedPiece] = useState<{ row: number, col: number } | null>(null);
  // movimientos validos
  const [validMoves, setValidMoves] = useState<{ row: number, col: number }[]>([]);

  const handleSquareClick = (rowIndex: number, colIndex: number) => {
    // Si ya hay una ficha-dama seleccionada entonces se buscan los movimientos validos
    if (selectedPiece) {
      // Si la misma ficha es clickeada otra vez... la deseleccionamos
      if (selectedPiece.row === rowIndex && selectedPiece.col === colIndex) {
        setSelectedPiece(null);
        setValidMoves([]);
        return;
      }
      // Checkea si la casilla clickeada es un movimiento valido
      if (validMoves.some(move => move.row === rowIndex && move.col === colIndex)) {
        // Acá se hace la logica del movimiento de la fichas
        const newBoard = [...board];
        newBoard[rowIndex][colIndex] = newBoard[selectedPiece.row][selectedPiece.col];
        newBoard[selectedPiece.row][selectedPiece.col] = 'none';
        setBoard(newBoard);

        // Aca se hace la funcionalidad de capturar la ficha del equipo contrario
        // como vector v = (actual - selectedPiece) -> v/2 = (actual - selectedPiece)/2
        // actual = (rowIndex, colIndex) 
        const middlePieceRow = selectedPiece.row + (rowIndex - selectedPiece.row) / 2;
        const middlePieceCol = selectedPiece.col + (colIndex - selectedPiece.col) / 2;
        // middlePiece = selectedPiece + vector/2

        // tiene que ser la diferencia entre la ficha futura y la actual 2
        if (Math.abs(rowIndex - selectedPiece.row) === 2 && Math.abs(colIndex - selectedPiece.col) === 2) {
          newBoard[middlePieceRow][middlePieceCol] = 'none'; // Elimina la pieza capturada-comida
        }

        // Limpiamos la pieza seleccionada y los movimientos validos
        setSelectedPiece(null);
        setValidMoves([]);
        return;
      }
    }
    // Chequea si la casilla seleccionada contiene una ficha-dama
    if (board[rowIndex][colIndex] !== 'none') {
      // Si la ficha es clickeada, la ponemos como seleccionada y calculamos y mostramos sus posibles jugadas-movimientos validos que puede realizar
      setSelectedPiece({ row: rowIndex, col: colIndex });
      calculateValidMoves(rowIndex, colIndex);
    } else {
      setSelectedPiece(null);
      setValidMoves([]);
    }
  };

  // Funcion para calcular los movimientos validos de una pieza seleccionada
  const calculateValidMoves = (rowIndex: number, colIndex: number) => {
    const forwardDirection = board[rowIndex][colIndex] === 'red' ? -1 : 1;
    // aca se guardan los movimientos posibles
    const validMovesForPiece: { row: number, col: number }[] = [];

    const possibleMoves = [
      { row: rowIndex + forwardDirection, col: colIndex - 1 }, // Diagonal izq
      { row: rowIndex + forwardDirection, col: colIndex + 1 }, // Diagonal der
    ];

    possibleMoves.forEach(move => {
      const [row, col] = [move.row, move.col];
      // para verificar si es válido y añadirlo como posible
      if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE && board[row][col] === 'none') {
        validMovesForPiece.push({ row, col });
      }
    });

    // Los movimientos de captura
    const capturingMoves = [
      { row: rowIndex + forwardDirection * 2, col: colIndex - 2 }, // Diagonal izq
      { row: rowIndex + forwardDirection * 2, col: colIndex + 2 }, // Diagonal der
    ];

    capturingMoves.forEach(move => {
      const [row, col] = [move.row, move.col];
      const middlePieceRow = rowIndex + forwardDirection;
      const middlePieceCol = (colIndex + col) / 2;
      // basicamente: colIndex + |-2| o colIndex + forwardDirection :v okno

      if (
        // condiciones de existencia
        row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE &&
        // que la casilla trasera diagonal de la opuesta nos podamos mover
        board[row][col] === 'none' &&
        // que al que va a comer no sea nulo
        board[middlePieceRow][middlePieceCol] !== 'none' &&
        // no es del mismo color
        board[middlePieceRow][middlePieceCol] !== board[rowIndex][colIndex]
      ) {
        validMovesForPiece.push({ row, col });
      }
    });

    setValidMoves(validMovesForPiece);
  };


  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div className="row" key={rowIndex}>
          {row.map((piece, colIndex) => (
            <div className={`square ${piece}`}
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
              style={{
                backgroundColor: validMoves.some(move => move.row === rowIndex && move.col === colIndex) ? '#9ACD32' : '',
              }}
            >
              {/*imagen?)*/}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}


export default Board;