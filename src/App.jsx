import React, { useState, useRef } from 'react';
import { DndContext, useDraggable, useDroppable, DragOverlay, PointerSensor, useSensor, useSensors, TouchSensor } from '@dnd-kit/core';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import PlayerSvg from './components/svg/PlayerSvg';

// Button Component
function Button({ children, variant = 'default', size = 'default', className = '', onClick }) {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-100',
    ghost: 'hover:bg-gray-100'
  };
  
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3 text-sm',
    custom: 'text-[.8em] px-2 py-1 h-[3em]'
  };  
  
  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

// Draggable Item Component
function DraggableItem({ id, children, data, activeId }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data
  });

  const isActive = activeId === id;

  console.log(transform);
  

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isActive ? 0 : 1,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab active:cursor-grabbing"
    >
      {children}
    </div>
  );
}

// Color Swatch Component
function ColorSwatch({ color, active, onClick }) {
  const colorMap = {
    green: 'bg-[#10b981]',
    blue: 'bg-[#3b82f6]',
    yellow: 'bg-[#fbbf24]',
    red: 'bg-[#ef4444]',
    black: 'bg-[#1f2937]',
    gray: 'bg-[#9ca3af]'
  };

  return (
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded ${colorMap[color]} ${active ? 'ring-2 ring-gray-900' : ''} transition-all hover:scale-110`}
    />
  );
}

// Sidebar Section Component
function SidebarSection({ title, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium">{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && <div className="p-3">{children}</div>}
    </div>
  );
}

// Shape Components
function ShapeItem({ variant, color }) {
  const colorMap = {
    green: 'border-[#10b981] bg-[#10b981]',
    blue: 'border-[#3b82f6] bg-[#3b82f6]',
    yellow: 'border-[#fbbf24] bg-[#fbbf24]',
    red: 'border-[#ef4444] bg-[#ef4444]',
    black: 'border-[#1f2937] bg-[#1f2937]',
    gray: 'border-[#9ca3af] bg-[#9ca3af]'
  };

  if (variant === 'square') {
    return <div className={`w-6 h-6 ${colorMap[color]}`} />;
  }
  if (variant === 'square-outline') {
    return <div className={`w-6 h-6 border-2 ${colorMap[color]} bg-transparent`} />;
  }
  if (variant === 'circle') {
    return <div className={`w-6 h-6 rounded-full border-2 ${colorMap[color]} bg-transparent`} />;
  }
  return null;
}

// Equipment Components
function EquipmentItem({ variant, color }) {
  const colorMap = {
    green: '#10b981',
    blue: '#3b82f6',
    yellow: '#fbbf24',
    red: '#ef4444',
    black: '#1f2937',
    gray: '#9ca3af'
  };

  if (variant === 'ball') {
    return <div className="w-6 h-6 rounded-full bg-[#1f2937] border-2 border-white flex items-center justify-center">
      <div className="w-2 h-2 rounded-full bg-white"></div>
    </div>;
  }
  if (variant === 'cone') {
    return <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[14px] border-l-transparent border-r-transparent border-b-[#fbbf24]"></div>;
  }
  if (variant === 'triangle') {
    return <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[14px] border-l-transparent border-r-transparent border-b-[#fbbf24]"></div>;
  }
  if (variant === 'goal-top' || variant === 'goal-small') {
    return <div className="w-10 h-3" style={{
      background: 'repeating-conic-gradient(#555 0% 25%, #888 0% 50%) 50% / 4px 4px'
    }}></div>;
  }
  if (variant === 'ladder') {
    return <div className="flex gap-[2px]">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-1 h-6 bg-[#1f2937]"></div>
      ))}
    </div>;
  }
  if (variant === 'hurdle') {
    return <div className="w-6 h-6 border-2 border-[#1f2937] border-t-0"></div>;
  }
  if (variant === 'pole') {
    return <div className="w-1 h-8 bg-[#1f2937]"></div>;
  }

  return null;
}

function PlayerItem({ variant, color, gender = "male" }) {
  const colorHexMap = {
    green: "#10b981",
    blue: "#3b82f6",
    yellow: "#fbbf24",
    red: "#ef4444",
    black: "#1f2937",
    gray: "#9ca3af",
  };

  const jersey = colorHexMap[color] || colorHexMap.black;

  if (variant === "circle") {
    return (
      <div className={`w-6 h-6 rounded-full border-2`} style={{ borderColor: jersey }} />
    );
  }

  if (variant === "filled") {
    return (
      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: jersey }} />
    );
  }

  if (variant === "svg") {
    return (
      <div className="w-6 h-6">
        <PlayerSvg jersey={jersey} gender={gender} className="w-full h-full" />
      </div>
    );
  }

  return null;
}

// Arrow Components
function ArrowItem({ variant, color, direction = "right" }) {
  const colorMap = {
    green: '#10b981',
    blue: '#3b82f6',
    yellow: '#fbbf24',
    red: '#ef4444',
    black: '#1f2937',
    gray: '#9ca3af'
  };

  const stroke = colorMap[color];

  // Rotation based on direction
  const rotationMap = {
    right: 0,
    left: 180,
    up: -90,
    down: 90
  };

  const rotation = rotationMap[direction];

  // Styles for different line variants
  const dash = variant.includes("dashed") ? "4,3" : null;
  const isWavy = variant.includes("wavy");

  return (
    <svg
      width="40"
      height="40"
      style={{ overflow: "visible", transform: `rotate(${rotation}deg)` }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill={stroke} />
        </marker>
      </defs>

      {isWavy ? (
        <path
          d="M 0 20 
             Q 10 10, 20 20 
             T 40 20"
          stroke={stroke}
          strokeWidth="2"
          fill="none"
          strokeDasharray={dash}
          markerEnd="url(#arrowhead)"
        />
      ) : (
        <line
          x1="0"
          y1="20"
          x2="40"
          y2="20"
          stroke={stroke}
          strokeWidth="2"
          strokeDasharray={dash}
          markerEnd="url(#arrowhead)"
        />
      )}
    </svg>
  );
}

function PlacedItem({ item, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: { type: "existing-item", existing: true, item }
  });

  console.log(item);
  

  const style = {
    position: "absolute",
    left: item.x,
    top: item.y,
    zIndex: 50,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group">
      {/* Drag wrapper — ONLY this div gets draggable listeners */}
      <div
        {...listeners}
        {...attributes}
        className="cursor-grab active:cursor-grabbing touch-none"
      >
        {item.type === "shape" && <ShapeItem variant={item.variant} color={item.color} />}
        {item.type === "equipment" && <EquipmentItem variant={item.variant} color={item.color} />}
        {item.type === "player" && <PlayerItem variant={item.variant} color={item.color} />}
        {item.type === "arrow" && <ArrowItem variant={item.variant} color={item.color} />}
      </div>

      {/* Remove Button — NOT draggable anymore */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(item.id);
        }}
        className="
          pointer-events-auto 
          absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 
          text-white rounded-full w-4 h-4 flex items-center justify-center 
          opacity-0 group-hover:opacity-100 transition-opacity shadow-lg 
          text-xs font-bold
        "
      >
        ×
      </button>
    </div>
  );
}


// Football Field Component
function FootballField({ children, fieldRef, showGrid }) {
  const { setNodeRef } = useDroppable({
    id: 'football-field'
  });

  return (
    <div
  ref={(node) => {
    setNodeRef(node);
    if (fieldRef) fieldRef.current = node;
  }}
  className="
    relative w-full rounded-lg overflow-hidden border-2 border-gray-400 bg-green-600
    max-h-[600px]          /* mobile only */
    sm:max-h-none          /* remove limit on larger screens */
  "
  style={{
    minHeight: "400px",
    height: "calc(100vh - 150px)",
    touchAction: "none"
  }}
>
      {/* Grid */}
      {showGrid && (
        <div className="absolute inset-0 z-0 opacity-30" style={{
          backgroundImage:
          'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',          
          backgroundSize: '40px 40px'
        }} />
      )}

      {/* Field Lines - White on Green */}
      <div className="absolute inset-2 border-2 border-white rounded-lg z-10"></div>
      
      {/* Center Line - Dashed */}
      <div className="absolute left-1/2 top-2 bottom-2 w-[2px] transform -translate-x-1/2 z-10
                md:left-1/2 md:top-2 md:bottom-2 md:w-[2px] md:-translate-x-1/2
                max-md:left-2 max-md:right-2 max-md:top-1/2 max-md:bottom-auto max-md:w-auto max-md:h-[2px] max-md:-translate-y-1/2 max-md:translate-x-0 
                md:bg-[length:2px_12px] max-md:bg-[length:12px_2px]"
     style={{
       backgroundImage: typeof window !== 'undefined' && window.innerWidth < 768 
         ? 'linear-gradient(to right, white 50%, transparent 50%)'
         : 'linear-gradient(to bottom, white 50%, transparent 50%)'
     }}
/>
      
      {/* Center Circle */}
      <div className="absolute left-1/2 top-1/2 w-24 h-24 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10" />
      <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10" />

      {/* Left Penalty Areas (Top on mobile) */}
      <div className="absolute left-2 top-1/2 w-16 h-40 border-2 border-white border-l-0 transform -translate-y-1/2 z-10 
                      md:left-2 md:top-1/2 md:w-16 md:h-40 md:border-l-0 md:border-t-2
                      max-md:left-1/2 max-md:top-2 max-md:w-40 max-md:h-16 max-md:border-t-0 max-md:border-l-2 max-md:border-r-2 max-md:-translate-x-1/2 max-md:translate-y-0" />
      <div className="absolute left-2 top-1/2 w-8 h-24 border-2 border-white border-l-0 transform -translate-y-1/2 z-10
                      md:left-2 md:top-1/2 md:w-8 md:h-24 md:border-l-0 md:border-t-2
                      max-md:left-1/2 max-md:top-2 max-md:w-24 max-md:h-8 max-md:border-t-0 max-md:border-l-2 max-md:border-r-2 max-md:-translate-x-1/2 max-md:translate-y-0" />

      {/* Right Penalty Areas (Bottom on mobile) */}
      <div className="absolute right-2 top-1/2 w-16 h-40 border-2 border-white border-r-0 transform -translate-y-1/2 z-10
                      md:right-2 md:top-1/2 md:w-16 md:h-40 md:border-r-0 md:border-b-2
                      max-md:right-auto max-md:left-1/2 max-md:bottom-2 max-md:top-auto max-md:w-40 max-md:h-16 max-md:border-b-0 max-md:border-l-2 max-md:border-r-2 max-md:-translate-x-1/2 max-md:translate-y-0" />
      <div className="absolute right-2 top-1/2 w-8 h-24 border-2 border-white border-r-0 transform -translate-y-1/2 z-10
                      md:right-2 md:top-1/2 md:w-8 md:h-24 md:border-r-0 md:border-b-2
                      max-md:right-auto max-md:left-1/2 max-md:bottom-2 max-md:top-auto max-md:w-24 max-md:h-8 max-md:border-b-0 max-md:border-l-2 max-md:border-r-2 max-md:-translate-x-1/2 max-md:translate-y-0" />

      {/* Goals - Top and Bottom */}
      <div className="absolute left-1/2 top-0 w-16 h-3 transform -translate-x-1/2 z-10" 
          style={{
            background: 'repeating-conic-gradient(#555 0% 25%, #888 0% 50%) 50% / 4px 4px'
          }}
      />
      <div className="absolute left-1/2 bottom-0 w-16 h-3 transform -translate-x-1/2 z-10"
          style={{
            background: 'repeating-conic-gradient(#555 0% 25%, #888 0% 50%) 50% / 4px 4px'
          }}
      />
      
      {children}
    </div>
  );
}

export default function TacticsBoard() {
  const [fieldItems, setFieldItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [activeData, setActiveData] = useState(null);
  const [activeColor, setActiveColor] = useState('green');
  const [showGrid, setShowGrid] = useState(false);
  const fieldRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,        // Hold for 250ms before drag activates
        tolerance: 5,      // Can move 5px during the delay
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,        // Hold for 250ms before drag activates  
        tolerance: 5,      // Can move 5px during the delay
      },
    })
  );

  function handleDragStart(event) {
    setActiveId(event.active.id);
    console.log(event.active.data.current);
    
    setActiveData(event.active.data.current);
  }

  function handleDragEnd(event) {
    const { active, over, delta } = event;
    const data = active.data.current;
  
    console.log("Drag End Event:", { active, over, delta, data });
  
    const fieldRect = fieldRef.current.getBoundingClientRect();
  
    // Calculate new position
    const initialX = event.activatorEvent?.clientX || 0;
    const initialY = event.activatorEvent?.clientY || 0;
  
    const x = initialX - fieldRect.left + (delta?.x || 0);
    const y = initialY - fieldRect.top + (delta?.y || 0);
  
    // ⚡ EXISTING ITEM MOVEMENT — does NOT require "over"
    if (data?.type === "existing-item") {
      setFieldItems((prev) =>
        prev.map((item) =>
          item.id === data.item.id
            ? { ...item, x, y }
            : item
        )
      );
  
      setActiveId(null);
      setActiveData(null);
      return;
    }
  
    // ⚠ NEW ITEMS REQUIRE A VALID "over"
    if (!over) return;
  
    // 🆕 PLACE NEW ITEM FROM SIDEBAR
    if (over.id === "football-field" && data) {
      
      const newItem = {
        id: `placed-${Date.now()}-${Math.random()}`,
        type: data.type,
        variant: data.variant,
        color: activeColor,
        x,
        y
      };
  
      setFieldItems((prev) => [...prev, newItem]);
    }
  
    setActiveId(null);
    setActiveData(null);
  }
  

  function clearField() {
    setFieldItems([]);
  }

  function removeItem(id) {
    setFieldItems(fieldItems.filter(item => item.id !== id));
  }

  function setDummyFieldItems() {
    const dummyItems = [
      {
        "id": "placed-1763220429788-0.975574249535869",
        "type": "player",
        "variant": "svg",
        "color": "green",
        "x": 54,
        "y": 400
      },
      {
        "id": "placed-1763220439759-0.0013260281605991242",
        "type": "player",
        "variant": "svg",
        "color": "red",
        "x": 996,
        "y": 396
      },
      {
        "id": "placed-1763220444096-0.06784954325611225",
        "type": "player",
        "variant": "svg",
        "color": "red",
        "x": 745,
        "y": 161
      },
      {
        "id": "placed-1763220446892-0.5459797549768602",
        "type": "player",
        "variant": "svg",
        "color": "red",
        "x": 661,
        "y": 236
      },
      {
        "id": "placed-1763220449037-0.4507693364184088",
        "type": "player",
        "variant": "svg",
        "color": "red",
        "x": 709,
        "y": 569
      },
      {
        "id": "placed-1763220452421-0.007763417635174519",
        "type": "player",
        "variant": "svg",
        "color": "red",
        "x": 850,
        "y": 401
      },
      {
        "id": "placed-1763220456674-0.29084376058574657",
        "type": "player",
        "variant": "svg",
        "color": "green",
        "x": 159,
        "y": 306
      },
      {
        "id": "placed-1763220458308-0.05520707577492723",
        "type": "player",
        "variant": "svg",
        "color": "green",
        "x": 338,
        "y": 20
      },
      {
        "id": "placed-1763220460524-0.08853059736406677",
        "type": "player",
        "variant": "svg",
        "color": "green",
        "x": 254,
        "y": 608
      },
      {
        "id": "placed-1763220462357-0.5727016796711161",
        "type": "player",
        "variant": "svg",
        "color": "green",
        "x": 366,
        "y": 475
      },
      {
        "id": "placed-1763220464745-0.012478101848568235",
        "type": "player",
        "variant": "svg",
        "color": "green",
        "x": 389,
        "y": 295
      }
    ];
    setFieldItems(dummyItems);
  }

  function saveBoard() {
    const boardData = JSON.stringify(fieldItems, null, 2);
    console.log('Saved Board Data:', boardData);
    alert('Board data has been logged to the console.');
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-white flex flex-col-reverse md:flex-row touch-pan-y">
        {/* Sidebar */}
        <div className="w-full h-[200px] overflow-y-auto md:overflow-hidden md:h-auto md:w-64 bg-white border-b lg:border-r border-gray-200">
          {/* <div className="p-3 border-b border-gray-200">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div> */}

          {/* Global Color Picker */}
          <div className="p-3 border-b border-gray-200">
            <div className="space-y-2">
              <span className="text-sm font-medium">Color</span>
              <div className="flex gap-1.5 flex-wrap">
                {['green', 'blue', 'yellow', 'red', 'black', 'gray'].map(color => (
                  <ColorSwatch
                    key={color}
                    color={color}
                    active={activeColor === color}
                    onClick={() => setActiveColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Shapes Section */}
          <SidebarSection title="Shapes">
            <div className="grid grid-cols-3 gap-1">
              <DraggableItem id="shape-square" data={{ type: 'shape', variant: 'square' }} activeId={activeId}>
                <div className=" sm:h-[4em] sm:w-[4em] aspect-square flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
                  <ShapeItem variant="square" color={activeColor} />
                </div>
              </DraggableItem>
              <DraggableItem id="shape-square-outline" data={{ type: 'shape', variant: 'square-outline' }} activeId={activeId}>
                <div className=" sm:h-[4em] sm:w-[4em] aspect-square flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
                  <ShapeItem variant="square-outline" color={activeColor} />
                </div>
              </DraggableItem>
              <DraggableItem id="shape-circle" data={{ type: 'shape', variant: 'circle' }} activeId={activeId}>
                <div className=" sm:h-[4em] sm:w-[4em] aspect-square flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
                  <ShapeItem variant="circle" color={activeColor} />
                </div>
              </DraggableItem>
            </div>
          </SidebarSection>

          {/* Equipment Section */}
          <SidebarSection title="Equipment">
            <div className="grid grid-cols-3 gap-1">
              <DraggableItem id="equipment-ball" data={{ type: 'equipment', variant: 'ball' }} activeId={activeId}>
                <div className=" sm:h-[4em] sm:w-[4em] aspect-square flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
                  <EquipmentItem variant="ball" color={activeColor} />
                </div>
              </DraggableItem>
              <DraggableItem id="equipment-triangle" data={{ type: 'equipment', variant: 'triangle' }} activeId={activeId}>
                <div className=" sm:h-[4em] sm:w-[4em] aspect-square flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
                  <EquipmentItem variant="triangle" color={activeColor} />
                </div>
              </DraggableItem>
              <DraggableItem id="equipment-goal-small" data={{ type: 'equipment', variant: 'goal-small' }} activeId={activeId}>
                <div className=" sm:h-[4em] sm:w-[4em] aspect-square flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
                  <EquipmentItem variant="goal-small" color={activeColor} />
                </div>
              </DraggableItem>
              <DraggableItem id="equipment-hurdle" data={{ type: 'equipment', variant: 'hurdle' }} activeId={activeId}>
                <div className=" sm:h-[4em] sm:w-[4em] aspect-square flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
                  <EquipmentItem variant="hurdle" color={activeColor} />
                </div>
              </DraggableItem>
              <DraggableItem id="equipment-ladder" data={{ type: 'equipment', variant: 'ladder' }} activeId={activeId}>
                <div className=" sm:h-[4em] sm:w-[4em] aspect-square flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
                  <EquipmentItem variant="ladder" color={activeColor} />
                </div>
              </DraggableItem>
              <DraggableItem id="equipment-pole" data={{ type: 'equipment', variant: 'pole' }} activeId={activeId}>
                <div className=" sm:h-[4em] sm:w-[4em] aspect-square flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
                  <EquipmentItem variant="pole" color={activeColor} />
                </div>
              </DraggableItem>
            </div>
          </SidebarSection>

          {/* Players Section */}
          <SidebarSection title="Players">
            <div className="grid grid-cols-3 gap-1">
              <DraggableItem id="player-circle" data={{ type: 'player', variant: 'circle' }} activeId={activeId}>
                <div className=" sm:h-[4em] sm:w-[4em] aspect-square flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
                  <PlayerItem variant="circle" color={activeColor} />
                </div>
              </DraggableItem>
              <DraggableItem id="player-svg-male" data={{ type: 'player', variant: 'svg', gender: 'male' }} activeId={activeId}>
                <div className=" sm:h-[4em] sm:w-[4em] aspect-square flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
                  <PlayerItem variant="svg" color={activeColor} gender="male" />
                </div>
              </DraggableItem>
              <DraggableItem id="player-filled" data={{ type: 'player', variant: 'filled' }} activeId={activeId}>
                <div className=" sm:h-[4em] sm:w-[4em] aspect-square flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
                  <PlayerItem variant="filled" color={activeColor} />
                </div>
              </DraggableItem>
              <DraggableItem id="player-svg-female" data={{ type: 'player', variant: 'svg', gender: 'female' }} activeId={activeId}>
                <div className=" sm:h-[4em] sm:w-[4em] aspect-square flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
                  <PlayerItem variant="svg" color={activeColor} gender="female" />
                </div>
              </DraggableItem>
            </div>
          </SidebarSection>

          {/* Arrows Section */}
          <SidebarSection title="Arrows + Lines">
          <div className="grid grid-cols-3 gap-1">

{/* ---- SOLID ARROWS ---- */}
<DraggableItem id="arrow-solid-right" data={{ type: 'arrow', variant: 'solid', direction: 'right' }} activeId={activeId}>
  <div className=" sm:h-[4em] sm:w-[4em] aspect-square flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
    <ArrowItem variant="solid" color={activeColor} direction="right" />
  </div>
</DraggableItem>

<DraggableItem id="arrow-solid-left" data={{ type: 'arrow', variant: 'solid', direction: 'left' }} activeId={activeId}>
  <div className=" sm:h-[4em] sm:w-[4em] aspect-square flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
    <ArrowItem variant="solid" color={activeColor} direction="left" />
  </div>
</DraggableItem>

<DraggableItem id="arrow-solid-up" data={{ type: 'arrow', variant: 'solid', direction: 'up' }} activeId={activeId}>
  <div className=" sm:h-[4em] sm:w-[4em] aspect-square flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
    <ArrowItem variant="solid" color={activeColor} direction="up" />
  </div>
</DraggableItem>

<DraggableItem id="arrow-solid-down" data={{ type: 'arrow', variant: 'solid', direction: 'down' }} activeId={activeId}>
  <div className=" sm:h-[4em] sm:w-[4em] aspect-square flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
    <ArrowItem variant="solid" color={activeColor} direction="down" />
  </div>
</DraggableItem>


{/* ---- DASHED ARROWS ---- */}
<DraggableItem id="arrow-dashed-right" data={{ type: 'arrow', variant: 'dashed', direction: 'right' }} activeId={activeId}>
  <div className=" sm:h-[4em] sm:w-[4em] aspect-square flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
    <ArrowItem variant="dashed" color={activeColor} direction="right" />
  </div>
</DraggableItem>

<DraggableItem id="arrow-dashed-left" data={{ type: 'arrow', variant: 'dashed', direction: 'left' }} activeId={activeId}>
  <div className=" sm:h-[4em] sm:w-[4em] aspect-square flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
    <ArrowItem variant="dashed" color={activeColor} direction="left" />
  </div>
</DraggableItem>

<DraggableItem id="arrow-dashed-up" data={{ type: 'arrow', variant: 'dashed', direction: 'up' }} activeId={activeId}>
  <div className=" sm:h-[4em] sm:w-[4em] aspect-square flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
    <ArrowItem variant="dashed" color={activeColor} direction="up" />
  </div>
</DraggableItem>

<DraggableItem id="arrow-dashed-down" data={{ type: 'arrow', variant: 'dashed', direction: 'down' }} activeId={activeId}>
  <div className=" sm:h-[4em] sm:w-[4em] aspect-square flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">
    <ArrowItem variant="dashed" color={activeColor} direction="down" />
  </div>
</DraggableItem>

</div>
          </SidebarSection>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
            <div className="flex gap-3">
              <Button variant="outline" size="custom" onClick={clearField}>
                Clear all
              </Button>
              <Button variant="outline" size="custom" onClick={() => setShowGrid(!showGrid)}>
                Toggle grid
              </Button>
              <Button variant="outline" size="custom" onClick={setDummyFieldItems}>
                Show Dummy Data
              </Button>
            </div>
            <Button size="custom" onClick={saveBoard}>
              Save
            </Button>
          </div>

          {/* Field Area */}
          <div className="flex-1 p-6">
            <div className="w-full h-full">
              <FootballField fieldRef={fieldRef} showGrid={showGrid}>
                {fieldItems.map((item) => (
                  <PlacedItem 
                    key={item.id}
                    item={item}
                    onRemove={removeItem}
                  />
                ))}
              </FootballField>
            </div>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId && activeData ? (
          <div className="opacity-50">
            {activeData.type === 'shape' && <ShapeItem variant={activeData.variant} color={activeColor} />}
            {activeData.type === 'equipment' && <EquipmentItem variant={activeData.variant} color={activeColor} />}
            {activeData.type === 'player' && <PlayerItem variant={activeData.variant} color={activeColor} />}
            {activeData.type === 'arrow' && <ArrowItem variant={activeData.variant} color={activeColor} />}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}