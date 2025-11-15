export default function DrawingLayer({ color, drawMode, eraser, onFinishStroke }) {
    const [currentStroke, setCurrentStroke] = useState(null);
  
    const handleMouseDown = (e) => {
      if (!drawMode) return;
  
      const rect = e.target.getBoundingClientRect();
      setCurrentStroke({
        id: crypto.randomUUID(),
        type: eraser ? "erase" : "drawing",
        color,
        points: [{ x: e.clientX - rect.left, y: e.clientY - rect.top }]
      });
    };
  
    const handleMouseMove = (e) => {
      if (!currentStroke) return;
  
      const rect = e.target.getBoundingClientRect();
      setCurrentStroke(prev => ({
        ...prev,
        points: [...prev.points, { x: e.clientX - rect.left, y: e.clientY - rect.top }]
      }));
    };
  
    const handleMouseUp = () => {
      if (currentStroke) {
        onFinishStroke(currentStroke);
        setCurrentStroke(null);
      }
    };
  
    return (
      <svg 
        className="absolute inset-0 pointer-events-auto"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {currentStroke && (
          <polyline
            points={currentStroke.points.map(p => `${p.x},${p.y}`).join(" ")}
            stroke={eraser ? "white" : color}
            strokeWidth={eraser ? 20 : 4}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    );
  }
  