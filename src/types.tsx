import {
  GestureResponderHandlers,
  StyleProp,
  ViewStyle,
  ViewProps
} from "react-native";

export type DndId = string | symbol;
export type HandleDropFunction = (
  draggable: Draggable,
  position: Position
) => any;
export type HandleEnterFunction = (
  draggable: Draggable,
  position: Position
) => any;
export type HandleLeaveFunction = (
  draggable: Draggable,
  position: Position
) => any;
export type HandleDragStartFunction = () => any;
export type HandleDragEndFunction = (droppale?: Droppable) => any;

export interface Position {
  x: number;
  y: number;
}

interface LayoutData {
  layout: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface Draggable extends LayoutData {
  id: DndId;
  dragging: boolean;
  onDragStart?: HandleDragStartFunction;
  onDragEnd?: HandleDragEndFunction;
  payload?: any;
}

export interface Droppable extends LayoutData {
  id: DndId;
  onDrop?: HandleDropFunction;
  onEnter?: HandleEnterFunction;
  onLeave?: HandleLeaveFunction;
}

export interface DNDRegistration {
  registerDraggable(id: DndId, data: Partial<Draggable>): void;
  updateDraggable(id: DndId, data: Partial<Draggable>): void;
  unregisterDraggable(id: DndId): void;
  registerDroppable(id: DndId, data: Partial<Droppable>): void;
  updateDroppable(id: DndId, data: Partial<Draggable>): void;
  unregisterDroppable(id: DndId): void;
  handleDragStart(id: DndId, position: Position): void;
  handleDragEnd(draggingId: DndId, position: Position): void;
  handleDragMove(draggingId: DndId, position: Position): void;
}

export interface State {
  draggables: Array<Draggable>;
  droppables: Array<Droppable>;
  dragOffset: number[];
  currentDragging?: DndId;
  currentDropping?: DndId;
}

export interface DNDContext extends DNDRegistration, State {
  getDraggable(id?: DndId): Draggable | undefined;
  getDroppable(id?: DndId): Droppable | undefined;
}

export interface DraggableRenderProps {
  viewProps: GestureResponderHandlers & {
    style: ViewProps["style"];
    onLayout: ViewProps["onLayout"];
    ref: any;
  };
}

export interface DroppableRenderProps {
  active: boolean;
  computeDistance(): number | undefined;
  viewProps: {
    onLayout: ViewProps["onLayout"];
    style: ViewProps["style"];
    ref: any;
  };
}

export interface DraggableProps {
  onLayout?: Function;
  children: (props: DraggableRenderProps) => React.ReactNode;
  bounceBack?: boolean;
  onDragStart?: HandleDragStartFunction;
  onDragEnd?: HandleDragEndFunction;
  payload?: any;
  customId?: DndId;
}

export interface DraggableInnerProps extends DraggableProps {
  __dndContext: DNDContext;
}

export interface DroppableProps {
  onLayout?: Function;
  children: (props: DroppableRenderProps) => React.ReactNode;
  onDrop?: HandleDropFunction;
  onEnter?: HandleEnterFunction;
  onLeave?: HandleLeaveFunction;
  customId?: DndId;
}

export interface DroppableInnerProps extends DroppableProps {
  __dndContext: DNDContext;
}
