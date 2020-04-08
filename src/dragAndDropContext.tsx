import * as React from "react";

import createReactContext, {
  ConsumerProps,
  Context,
  ProviderProps
} from "create-react-context";
import { draggable } from "./draggable";
import { droppable } from "./droppable";

import {
  DNDContext,
  DraggableProps,
  DroppableProps,
  Draggable,
  Droppable,
  State,
  DndId,
  Position,
  DNDRegistration
} from "./types";

interface Props {
  children: ProviderProps<DNDContext>['children'];
}

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type DNDContextType = Context<DNDContext>;

export interface DragAndDropContext {
  Consumer: DNDContextType["Consumer"];
  Provider: React.ComponentType<Props>;
  Draggable: React.ForwardRefExoticComponent<DraggableProps>;
  Droppable: React.ForwardRefExoticComponent<DroppableProps>;
}

function createDndContext(): DragAndDropContext {
  const Context = createReactContext<DNDContext>({} as any);
  const { Provider, Consumer } = Context;

  class DragAndDropProvider
    extends React.Component<Props, State>
    implements DNDRegistration {
    state: State = {
      draggables: [],
      droppables: [],
      dragOffset: [0, 0]
    };

    registerDraggable = (id: DndId, data: Partial<Draggable>) => {
      const existing = this.getDraggable(id);
      if (existing) {
        throw new Error(`Draggable has already been registered.`);
      }

      const draggable: Draggable = {
        id,
        layout: { x: 0, y: 0, width: 0, height: 0 },
        dragging: false,
        ...data
      };

      this.setState(({ draggables }) => ({
        draggables: [...draggables, draggable]
      }));
    };

    updateDraggable = (id: DndId, data: Draggable) => {
      this.setState(({ draggables }) => ({
        draggables: draggables.map(draggable => {
          if (draggable.id === id) {
            return {
              ...draggable,
              ...data
            };
          }

          return draggable;
        })
      }));
    };

    unregisterDraggable = (id: DndId) => {
      this.setState(({ draggables }) => ({
        draggables: draggables.filter(draggable => draggable.id !== id)
      }));
    };

    registerDroppable = (id: DndId, data: Partial<Droppable>) => {
      const existing = this.getDroppable(id);
      if (existing) {
        throw new Error(`Droppable has already been registered.`);
      }

      const droppable: Droppable = {
        id,
        ...data,
        layout: { x: 0, y: 0, width: 0, height: 0 }
      };

      this.setState(({ droppables }) => ({
        droppables: [...droppables, droppable]
      }));
    };

    unregisterDroppable = (id: DndId) => {
      this.setState(({ droppables }) => ({
        droppables: droppables.filter(droppable => droppable.id !== id)
      }));
    };

    updateDroppable = (id: DndId, data: Droppable) => {
      this.setState(({ droppables }) => ({
        droppables: droppables.map(droppable => {
          if (droppable.id === id) {
            return {
              ...droppable,
              ...data
            };
          }

          return droppable;
        })
      }));
    };

    getDraggable = (id?: DndId) => {
      return this.state.draggables.find(draggable => draggable.id === id);
    };

    getDroppable = (id?: DndId) => {
      return this.state.droppables.find(droppable => droppable.id === id);
    };

    getDroppableInArea = ({ x, y }: Position) => {
      const _x = x - this.state.dragOffset[0];
      const _y = y - this.state.dragOffset[1];

      return this.state.droppables.find(({ layout }) => {
        return (
          layout &&
          _x >= layout.x &&
          _y >= layout.y &&
          _x <= layout.x + layout.width &&
          _y <= layout.y + layout.height
        );
      });
    };

    handleDragStart = (id: DndId, position: Position) => {
      const draggable = this.getDraggable(id);

      if (draggable) {
        const { layout } = draggable;
        const center = [
          layout.x + Math.round(layout.width / 2),
          layout.y + Math.round(layout.height / 2)
        ];

        const dragOffset = [position.x - center[0], position.y - center[1]];

        this.setState({
          currentDragging: id,
          dragOffset
        });

        if (draggable.onDragStart) {
          draggable.onDragStart();
        }
      }
    };

    handleDragEnd = (draggingId: DndId, position: Position) => {
      const droppable = this.getDroppableInArea(position);
      const draggable = this.getDraggable(draggingId);

      if (draggable && droppable && droppable.onDrop) {
        droppable.onDrop(draggable, position);
      }

      if (draggable && draggable.onDragEnd) {
        draggable.onDragEnd(droppable);
      }

      this.setState({ currentDragging: undefined, dragOffset: [0, 0] });
    };

    handleDragMove = (draggingId: DndId, position: Position) => {
      const currentDroppable = this.getDroppableInArea(position);
      const draggable = this.getDraggable(draggingId)!;
      const prevDroppingId = this.state.currentDropping;

      if (currentDroppable) {
        if (currentDroppable.id !== this.state.currentDropping && draggable) {
          this.setState({ currentDropping: currentDroppable.id });

          if (currentDroppable.onEnter) {
            currentDroppable.onEnter(draggable, position);
          }
        }
      } else if (this.state.currentDropping) {
        if (prevDroppingId) {
          const prevDroppable = this.getDroppable(prevDroppingId);
          if (prevDroppable && prevDroppable.onLeave) {
            prevDroppable.onLeave(draggable, position);
          }
        }

        this.setState({ currentDropping: undefined });
      }
    };

    render() {
      return (
        <Provider
          value={{
            currentDragging: this.state.currentDragging,
            currentDropping: this.state.currentDropping,
            droppables: this.state.droppables,
            draggables: this.state.draggables,
            dragOffset: this.state.dragOffset,
            registerDraggable: this.registerDraggable,
            updateDraggable: this.updateDraggable,
            unregisterDraggable: this.unregisterDraggable,
            registerDroppable: this.registerDroppable,
            updateDroppable: this.updateDroppable,
            unregisterDroppable: this.unregisterDroppable,
            handleDragStart: this.handleDragStart,
            handleDragEnd: this.handleDragEnd,
            handleDragMove: this.handleDragMove,
            getDraggable: this.getDraggable,
            getDroppable: this.getDroppable
          }}
        >
          {this.props.children}
        </Provider>
      );
    }
  }

  const Draggable = draggable(Consumer);
  const Droppable = droppable(Consumer);

  return {
    Provider: DragAndDropProvider,
    Draggable,
    Droppable,
    Consumer
  };
}

export { createDndContext };
