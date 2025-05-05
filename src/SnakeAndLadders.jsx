import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Zoom,
  TextareaAutosize
} from "@mui/material";

const BOARD_WIDTH = 6;
const BOARD_HEIGHT = 6;
const BOARD_SIZE = BOARD_WIDTH * BOARD_HEIGHT;

export default function SnakeAndLadders() {
  React.useEffect(() => {
    const startMusic = () => {
      const audio = document.getElementById("bg-music");
      if (audio && audio.paused) {
        audio.play().catch(() => {});
      }
      document.removeEventListener("click", startMusic);
    };

    document.addEventListener("click", startMusic);
    return () => document.removeEventListener("click", startMusic);
  }, []);
  
  const [positions, setPositions] = useState({ pizza: 0, laptop: 0 });
  const [turn, setTurn] = useState("pizza");
  const [dialog, setDialog] = useState({ open: false, index: null });
  const [notes, setNotes] = useState(Array(BOARD_SIZE).fill(""));
  const [tempNote, setTempNote] = useState("");
  const [flash, setFlash] = useState(null);
  const [connections, setConnections] = useState({});
  const [connectionDialog, setConnectionDialog] = useState(false);
  const [startPos, setStartPos] = useState("");
  const [endPos, setEndPos] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState("");
  
  const handleAddConnection = () => {
    const start = parseInt(startPos);
    const end = parseInt(endPos);
    if (!isNaN(start) && !isNaN(end) && start >= 0 && start < BOARD_SIZE && end >= 0 && end < BOARD_SIZE) {
      setConnections(prev => ({ ...prev, [start]: end }));
      setConnectionDialog(false);
      setStartPos("");
      setEndPos("");
    }
  };

  const handleDeleteConnection = () => {
    setConnections(prev => {
      const updated = { ...prev };
      delete updated[deleteIndex];
      return updated;
    });
    setDeleteDialogOpen(false);
    setDeleteIndex("");
  };

  const handleSquareClick = (index) => {
    const destination = connections[index] ?? index;
    setPositions(prev => ({ ...prev, [turn]: destination }));
    setFlash(index in connections ? index : null);
    setDialog({ open: true, index: destination });
    setTempNote(notes[destination] || "");
    setTurn(prev => (prev === "pizza" ? "laptop" : "pizza"));
    setTimeout(() => setFlash(null), 600);
  };

  const handleNoteSave = () => {
    const updatedNotes = [...notes];
    updatedNotes[dialog.index] = tempNote;
    setNotes(updatedNotes);
    setDialog({ open: false, index: null });
  };

  const getCoords = (index) => {
    const row = Math.floor(index / BOARD_WIDTH);
    const col = row % 2 === 0 ? index % BOARD_WIDTH : BOARD_WIDTH - 1 - (index % BOARD_WIDTH);
    return { x: col * 80 + 40, y: (BOARD_HEIGHT - 1 - row) * 80 + 40 };
  };

  const renderConnections = () => {
    return Object.entries(connections).map(([start, end], i) => {
      const from = getCoords(Number(start));
      const to = getCoords(end);
      const isLadder = end > start;
      return (
        <path
          key={i}
          d={`M${from.x},${from.y} C${from.x},${(from.y + to.y) / 2} ${to.x},${(from.y + to.y) / 2} ${to.x},${to.y}`}
          stroke={isLadder ? "#81c784" : "#e57373"}
          strokeWidth="8"
          fill="none"
          strokeDasharray={isLadder ? "10,6" : ""}
          markerEnd="url(#arrow)"
        />
      );
    });
  };

  const getZigZagBoard = () => {
    const squares = [];
    for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
      const base = row * BOARD_WIDTH;
      const rowSquares = [];
      for (let col = 0; col < BOARD_WIDTH; col++) {
        const index = row % 2 === 0 ? base + col : base + (BOARD_WIDTH - 1 - col);
        rowSquares.push(index);
      }
      squares.push(...rowSquares);
    }
    return squares;
  };

  const renderSquare = (i) => {
    const hasPizza = positions.pizza === i;
    const hasLaptop = positions.laptop === i;
    const hasConnectionStart = Object.keys(connections).includes(i.toString());
    const isLadder = hasConnectionStart && connections[i] > i;
    const isSnake = hasConnectionStart && connections[i] < i;

    return (
      <Paper
        key={i}
        onClick={() => handleSquareClick(i)}
        elevation={6}
        sx={{
          width: 80,
          height: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: flash === i ? "#fff59d" : isLadder ? "#e8f5e9" : isSnake ? "#ffebee" : "#fafafa",
          borderRadius: 3,
          border: "2px solid #90a4ae",
          cursor: "pointer",
          position: "relative",
          transition: "all 0.3s ease",
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 4,
          },
        }}
      >
        <Typography variant="caption" color="textSecondary">
          Casilla {i + 1}
        </Typography>
        <Zoom in={hasPizza} timeout={300}>
          <Typography variant="h5" sx={{ position: 'absolute', top: 28, left: 12 }}>🍕</Typography>
        </Zoom>
        <Zoom in={hasLaptop} timeout={300}>
          <Typography variant="h5" sx={{ position: 'absolute', bottom: 8, right: 12 }}>💻</Typography>
        </Zoom>
        {isLadder && <Typography variant="h6" sx={{ position: 'absolute', top: 0, right: 0 }}>🪜</Typography>}
        {isSnake && <Typography variant="h6" sx={{ position: 'absolute', top: 0, left: 0 }}>🐍</Typography>}
      </Paper>
    );
  };

  return (
    <>
      <audio id="bg-music" loop>
  <source src="/comotuFondo.mp3" type="audio/mpeg" />
  Tu navegador no soporta audio HTML5.
</audio>


      <Box
        sx={{ p: { xs: 2, sm: 3 }, background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom color="#37474f">
          🎲 Somos Algo
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Turno actual: <strong>{turn === "pizza" ? "Crys 🍕" : "Yahel 💻"}</strong>
        </Typography>
        <Button onClick={() => setConnectionDialog(true)} variant="contained" color="primary" sx={{ mb: 1 }}>➕ Añadir Escalera o Serpiente</Button>
        <Button onClick={() => setDeleteDialogOpen(true)} variant="contained" color="error" sx={{ mb: 2 }}>🗑️ Eliminar Escalera o Serpiente</Button>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mb: 4 }}>
          <Box sx={{ position: "relative", width: '100%', maxWidth: BOARD_WIDTH * 80, height: BOARD_HEIGHT * 80, mx: 'auto' }}>
            <svg width={BOARD_WIDTH * 80} height={BOARD_HEIGHT * 80} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="black" />
                </marker>
              </defs>
              {renderConnections()}
            </svg>
            <Box display="grid" gridTemplateColumns={`repeat(${BOARD_WIDTH}, 1fr)`} sx={{ position: "relative", zIndex: 1 }}>
              {getZigZagBoard().map((index) => renderSquare(index))}
            </Box>
          </Box>

          <Box sx={{ width: '100%', maxWidth: 300, maxHeight: BOARD_HEIGHT * 80, overflowY: "auto", bgcolor: "#ffffff", borderRadius: 2, p: 2, border: "1px solid #ccc" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>📝 Notas de Casillas</Typography>
            {notes.map((note, idx) =>
              note.trim() ? (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">Casilla {idx + 1}</Typography>
                  <Typography variant="body2">{note}</Typography>
                </Box>
              ) : null
            )}
            {notes.every(n => !n.trim()) && (
              <Typography variant="body2" color="text.secondary">No hay notas aún.</Typography>
            )}
          </Box>
        </Box>

        <Dialog open={connectionDialog} onClose={() => setConnectionDialog(false)}>
          <DialogTitle>Añadir conexión</DialogTitle>
          <DialogContent>
            <TextField label="Casilla de inicio" type="number" fullWidth margin="dense" value={startPos} onChange={(e) => setStartPos(e.target.value)} />
            <TextField label="Casilla de destino" type="number" fullWidth margin="dense" value={endPos} onChange={(e) => setEndPos(e.target.value)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConnectionDialog(false)} color="error">Cancelar</Button>
            <Button onClick={handleAddConnection} variant="contained">Guardar</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Eliminar conexión</DialogTitle>
          <DialogContent>
            <TextField label="Casilla de inicio" type="number" fullWidth margin="dense" value={deleteIndex} onChange={(e) => setDeleteIndex(e.target.value)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">Cancelar</Button>
            <Button onClick={handleDeleteConnection} color="error" variant="contained">Eliminar</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={dialog.open} onClose={() => setDialog({ open: false, index: null })}>
          <DialogTitle>Reflexión - Casilla {dialog.index + 1}</DialogTitle>
          <DialogContent>
            <TextareaAutosize minRows={3} value={tempNote} onChange={(e) => setTempNote(e.target.value)} placeholder="¿Por qué llegaste a esta casilla?" style={{ width: '100%', padding: 8 }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialog({ open: false, index: null })} color="error">Cancelar</Button>
            <Button onClick={handleNoteSave} variant="contained">Guardar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
