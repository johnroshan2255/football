import React, { useState, useRef, useEffect } from 'react';
import { Move, Trash2, Grid3x3, Save, Upload, Circle, Navigation, ArrowRight, ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';

const FootballTacticsBoard = () => {
  const [items, setItems] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState('#FF0000');
  const [showGrid, setShowGrid] = useState(false);
  const [fieldLayout, setFieldLayout] = useState('full');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [playerCounter, setPlayerCounter] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const fieldRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const colors = ['#FF0000', '#0000FF', '#FFFF00', '#FFFFFF', '#000000', '#FFA500', '#800080', '#00FF00'];
  
  const tools = [
    { id: 'move', name: 'Move', icon: Move },
    { id: 'player', name: 'Player', icon: Circle },
    { id: 'ball', name: 'Ball', icon: Circle },
    { id: 'arrow-right', name: '→', icon: ArrowRight },
    { id: 'arrow-left', name: '←', icon: ArrowLeft },
    { id: 'arrow-up', name: '↑', icon: ArrowUp },
    { id: 'arrow-down', name: '↓', icon: ArrowDown },
    { id: 'wavy-left', name: '~←', icon: Navigation },
    { id: 'wavy-up', name: '~↑', icon: Navigation },
  ];

  const layouts = [
    { id: 'full', name: 'Full' },
    { id: 'half', name: 'Half' },
    { id: 'penalty', name: 'Penalty' },
  ];

  const clearAll = () => {
    setItems([]);
    setSelectedItem(null);
    setPlayerCounter(1);
  };

  const handleFieldClick = (e) => {
    if (!selectedTool || selectedTool === 'move' || isDragging) return;
    
    const rect = fieldRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    // Adjust coordinates for mobile rotation
    // if (isMobile) {
    //   const tempX = x;
    //   x = y;
    //   y = rect.width - tempX;
    // }
    
    const newItem = {
      id: Date.now(),
      type: selectedTool,
      x,
      y,
      color: currentColor,
      rotation: 0,
      number: selectedTool === 'player' ? playerCounter : null,
    };

    console.log('Placing item:', newItem);
    
    
    if (selectedTool === 'player') {
      setPlayerCounter(playerCounter + 1);
    }
    
    setItems([...items, newItem]);
  };

  const handleItemMouseDown = (e, item) => {
    if (selectedTool !== 'move') return;
    
    e.stopPropagation();
    setSelectedItem(item.id);
    setIsDragging(true);
    
    const rect = fieldRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - item.x;
    const offsetY = e.clientY - rect.top - item.y;
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !selectedItem || selectedTool !== 'move') return;
    
    const rect = fieldRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;
    
    setItems(items.map(item => 
      item.id === selectedItem ? { ...item, x, y } : item
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, selectedItem, dragOffset, selectedTool]);

  const handleTouchStart = (e, item) => {
    if (selectedTool !== 'move') return;
    
    e.preventDefault();
    const touch = e.touches[0];
    setSelectedItem(item.id);
    setIsDragging(true);
    
    const rect = fieldRef.current.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left - item.x;
    const offsetY = touch.clientY - rect.top - item.y;
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !selectedItem || selectedTool !== 'move') return;
    
    const touch = e.touches[0];
    const rect = fieldRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left - dragOffset.x;
    const y = touch.clientY - rect.top - dragOffset.y;
    
    setItems(items.map(item => 
      item.id === selectedItem ? { ...item, x, y } : item
    ));
  };

  const deleteSelectedItem = () => {
    if (selectedItem) {
      setItems(items.filter(item => item.id !== selectedItem));
      setSelectedItem(null);
    }
  };

  const changeItemColor = (color) => {
    if (selectedItem) {
      setItems(items.map(item => 
        item.id === selectedItem ? { ...item, color } : item
      ));
    }
    setCurrentColor(color);
  };

  const changeLayout = (layout) => {
    setFieldLayout(layout);
    setItems([]);
    setSelectedItem(null);
    setPlayerCounter(1);
  };

  const saveBoard = () => {
    const json = JSON.stringify({ items, fieldLayout, playerCounter }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tactics-board.json';
    a.click();
  };

  const loadBoard = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          setItems(data.items || []);
          setFieldLayout(data.fieldLayout || 'full');
          setPlayerCounter(data.playerCounter || 1);
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const renderItem = (item) => {
    const isSelected = selectedItem === item.id && selectedTool === 'move';
    const cursorClass = selectedTool === 'move' ? 'cursor-move' : 'cursor-default';
    
    if (item.type === 'player') {
      return (
        <div
          key={item.id}
          className={`absolute ${cursorClass}`}
          style={{
            left: item.x - 20,
            top: item.y - 20,
            transform: `rotate(${item.rotation}deg)`,
          }}
          onMouseDown={(e) => handleItemMouseDown(e, item)}
          onTouchStart={(e) => handleTouchStart(e, item)}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
              isSelected ? 'ring-4 ring-yellow-400' : ''
            }`}
            style={{ backgroundColor: item.color, borderColor: '#fff' }}
          >
            <span className="text-white text-sm font-bold">{item.number}</span>
          </div>
        </div>
      );
    }
    
    if (item.type === 'ball') {
        return (
          <div
            key={item.id}
            className={`absolute ${cursorClass}`}
            style={{
              left: item.x - 15,
              top: item.y - 15,
              fontSize: '15px',
            }}
            onMouseDown={(e) => handleItemMouseDown(e, item)}
            onTouchStart={(e) => handleTouchStart(e, item)}
          >
            <span className={isSelected ? "inline-block ring-4 ring-yellow-400 rounded-full" : ""}>
              ⚽
            </span>
          </div>
        );
      }
    
    if (item.type.startsWith('arrow')) {
        const rotation = {
          'arrow-right': 0,
          'arrow-left': 180,
          'arrow-up': 270,
          'arrow-down': 90,
        }[item.type];
      
        return (
          <div
            key={item.id}
            className={`absolute ${cursorClass}`}
            style={{
              left: item.x - 15,
              top: item.y - 7,
              transform: `rotate(${rotation}deg)`,
            }}
            onMouseDown={(e) => handleItemMouseDown(e, item)}
            onTouchStart={(e) => handleTouchStart(e, item)}
          >
            <svg
              width="30"
              height="15"
              className={isSelected ? 'ring-2 ring-yellow-400 rounded' : ''}
            >
              <defs>
                <marker
                  id={`arrowhead-${item.id}`}
                  markerWidth="5"
                  markerHeight="5"
                  refX="4"
                  refY="2.5"
                  orient="auto"
                >
                  <polygon points="0 0, 5 2.5, 0 5" fill={item.color} />
                </marker>
              </defs>
              <line
                x1="2"
                y1="7.5"
                x2="25"
                y2="7.5"
                stroke={item.color}
                strokeWidth="2"
                markerEnd={`url(#arrowhead-${item.id})`}
              />
            </svg>
          </div>
        );
      }
      
    
      if (item.type.startsWith('wavy')) {
        const rotation = {
          'wavy-right': 0,
          'wavy-left': 180,
          'wavy-up': 270,
          'wavy-down': 90,
        }[item.type] || 0; // default to right
      
        return (
          <div
            key={item.id}
            className={`absolute ${cursorClass}`}
            style={{
              left: item.x - 20,
              top: item.y - 10,
              transform: `rotate(${rotation}deg)`,
            }}
            onMouseDown={(e) => handleItemMouseDown(e, item)}
            onTouchStart={(e) => handleTouchStart(e, item)}
          >
            <svg
              width="40"
              height="20"
              className={isSelected ? 'ring-2 ring-yellow-400 rounded' : ''}
            >
              <path
                d="M 2 10 Q 12 2, 20 10 T 38 10"
                stroke={item.color}
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        );
      }
      
  };

  const getFieldHeight = () => {
    switch (fieldLayout) {
      case 'half': return '50%';
      case 'penalty': return '30%';
      default: return '100%';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Toolbar */}
      <div className="bg-white shadow-md p-1 md:p-2 flex items-center gap-1 md:gap-2 overflow-x-auto backdrop-blur-sm bg-opacity-95">
        {tools.map(tool => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`flex flex-col items-center p-1 md:p-2 rounded-lg min-w-[45px] md:min-w-[60px] transition-all ${
                selectedTool === tool.id 
                  ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg scale-105 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Icon size={16} className="md:hidden" />
              <Icon size={20} className="hidden md:block" />
              <span className="text-[10px] md:text-xs mt-0.5 md:mt-1 font-medium">{tool.name}</span>
            </button>
          );
        })}
      </div>

      {/* Field Layout Selector */}
      <div className="bg-white shadow-sm p-1 md:p-2 flex items-center gap-1 md:gap-2 backdrop-blur-sm bg-opacity-95">
        <span className="text-gray-700 text-xs md:text-sm font-semibold">Layout:</span>
        {layouts.map(layout => (
          <button
            key={layout.id}
            onClick={() => changeLayout(layout.id)}
            className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-medium transition-all ${
              fieldLayout === layout.id 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {layout.name}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="bg-white shadow-sm p-1 md:p-2 flex items-center gap-1 md:gap-2 overflow-x-auto backdrop-blur-sm bg-opacity-95">
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`flex items-center gap-1 px-2 md:px-3 py-1 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
            showGrid 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } whitespace-nowrap`}
        >
          <Grid3x3 size={14} className="md:hidden" />
          <Grid3x3 size={18} className="hidden md:block" />
          <span>Grid</span>
        </button>
        
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs md:text-sm font-medium transition-all whitespace-nowrap"
        >
          <div
            className="w-3 h-3 md:w-4 md:h-4 rounded border-2 border-gray-400 shadow-sm"
            style={{ backgroundColor: currentColor }}
          />
          <span>Color</span>
        </button>
        
        <button
          onClick={deleteSelectedItem}
          disabled={!selectedItem}
          className={`flex items-center gap-1 px-2 md:px-3 py-1 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
            selectedItem 
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          } whitespace-nowrap`}
        >
          <Trash2 size={14} className="md:hidden" />
          <Trash2 size={18} className="hidden md:block" />
          <span>Delete</span>
        </button>

        <button
          onClick={clearAll}
          className={`flex items-center gap-1 px-2 md:px-3 py-1 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md whitespace-nowrap`}
        >
          <Trash2 size={14} className="md:hidden" />
          <Trash2 size={18} className="hidden md:block" />
          <span>Clear All</span>
        </button>
        
        <button
          onClick={saveBoard}
          className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 text-xs md:text-sm font-medium transition-all shadow-md whitespace-nowrap"
        >
          <Save size={14} className="md:hidden" />
          <Save size={18} className="hidden md:block" />
          <span>Save</span>
        </button>
        
        <label className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 cursor-pointer text-xs md:text-sm font-medium transition-all shadow-md whitespace-nowrap">
          <Upload size={14} className="md:hidden" />
          <Upload size={18} className="hidden md:block" />
          <span>Load</span>
          <input
            type="file"
            accept=".json"
            onChange={loadBoard}
            className="hidden"
          />
        </label>
      </div>

      {/* Color Picker */}
      {showColorPicker && (
        <div className="bg-white shadow-sm p-2 flex gap-2 overflow-x-auto backdrop-blur-sm bg-opacity-95">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => changeItemColor(color)}
              className={`w-8 h-8 rounded-lg border-2 flex-shrink-0 transition-all hover:scale-110 ${
                currentColor === color ? 'border-yellow-400 ring-2 ring-yellow-300 shadow-lg scale-110' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}

      {/* Field Container */}
      <div className="flex-1 overflow-hidden relative bg-gradient-to-br from-gray-50 to-gray-100 p-0 md:p-4">
        <div
          ref={fieldRef}
          className="relative bg-green-600 shadow-2xl md:rounded-xl"
          style={{ 
            cursor: selectedTool && selectedTool !== 'move' ? 'crosshair' : 'default',
            // Mobile: rotate 90deg, Desktop: normal orientation
            // transform: isMobile ? 'rotate(90deg)' : 'none',
            transformOrigin: 'center center',
            width: isMobile ? '100vw' : '100%',
            height: isMobile ? '100%' : '100%',
            maxWidth: isMobile ? '100vw' : 'none',
            maxHeight: isMobile ? '100vh' : 'none',
            margin: 'auto',
          }}
          onClick={handleFieldClick}
        >
          {/* Grid */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none">
              <svg width="100%" height="100%" className="opacity-30">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          )}

          {/* Field Markings - Different orientation for mobile vs desktop */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {isMobile ? (
              // Mobile: Goals at top and bottom
              <>
                {/* Outer border */}
                <rect x="2%" y="2%" width="96%" height="96%" fill="none" stroke="white" strokeWidth="2" />
                
                {/* Center line */}
                {fieldLayout === 'full' && (
                  <>
                    <line x1="2%" y1="50%" x2="98%" y2="50%" stroke="white" strokeWidth="2" />
                    <circle cx="50%" cy="50%" r="8%" fill="none" stroke="white" strokeWidth="2" />
                    <circle cx="50%" cy="50%" r="1%" fill="white" />
                  </>
                )}
                
                {/* Penalty areas - Top */}
                <rect x="30%" y="2%" width="40%" height="16%" fill="none" stroke="white" strokeWidth="2" />
                <rect x="40%" y="2%" width="20%" height="8%" fill="none" stroke="white" strokeWidth="2" />
                
                {/* Goal - Top */}
                <rect x="42%" y="0" width="16%" height="2%" fill="none" stroke="white" strokeWidth="2" />
                
                {fieldLayout === 'full' && (
                  <>
                    {/* Penalty areas - Bottom */}
                    <rect x="30%" y="82%" width="40%" height="16%" fill="none" stroke="white" strokeWidth="2" />
                    <rect x="40%" y="90%" width="20%" height="8%" fill="none" stroke="white" strokeWidth="2" />
                    
                    {/* Goal - Bottom */}
                    <rect x="42%" y="98%" width="16%" height="2%" fill="none" stroke="white" strokeWidth="2" />
                  </>
                )}
              </>
            ) : (
              // Desktop: Goals at left and right
              <>
                {/* Outer border */}
                <rect x="2%" y="2%" width="96%" height="96%" fill="none" stroke="white" strokeWidth="2" />
                
                {/* Center line */}
                {fieldLayout === 'full' && (
                  <>
                    <line x1="50%" y1="2%" x2="50%" y2="98%" stroke="white" strokeWidth="2" />
                    <circle cx="50%" cy="50%" r="8%" fill="none" stroke="white" strokeWidth="2" />
                    <circle cx="50%" cy="50%" r="1%" fill="white" />
                  </>
                )}
                
                {/* Penalty areas - Left */}
                <rect x="2%" y="30%" width="16%" height="40%" fill="none" stroke="white" strokeWidth="2" />
                <rect x="2%" y="40%" width="8%" height="20%" fill="none" stroke="white" strokeWidth="2" />
                
                {/* Goal - Left */}
                <rect x="0" y="42%" width="2%" height="16%" fill="none" stroke="white" strokeWidth="2" />
                
                {fieldLayout === 'full' && (
                  <>
                    {/* Penalty areas - Right */}
                    <rect x="82%" y="30%" width="16%" height="40%" fill="none" stroke="white" strokeWidth="2" />
                    <rect x="90%" y="40%" width="8%" height="20%" fill="none" stroke="white" strokeWidth="2" />
                    
                    {/* Goal - Right */}
                    <rect x="98%" y="42%" width="2%" height="16%" fill="none" stroke="white" strokeWidth="2" />
                  </>
                )}
              </>
            )}
          </svg>

          {/* Render all items */}
          {items.map(item => renderItem(item))}
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-white shadow-md p-2 text-center text-gray-700 text-xs md:text-sm backdrop-blur-sm bg-opacity-95 font-medium">
        {selectedTool === 'move' 
          ? 'Move mode: Select and drag items' 
          : selectedTool 
            ? `Selected: ${tools.find(t => t.id === selectedTool)?.name} - Click field to place` 
            : 'Select a tool to begin'}
      </div>
    </div>
  );
};

export default FootballTacticsBoard;