import * as React from "react";
import { View, LayoutChangeEvent } from "react-native";
import { Context } from "create-react-context";

import {
  DroppableProps,
  DroppableInnerProps,
  DNDContext,
  DndId,
  Droppable
} from "./types";

type DroppableState = {};

export function droppable(
  Consumer: Context<DNDContext>["Consumer"]
): React.ForwardRefExoticComponent<DroppableProps> {
  class BaseDroppable extends React.Component<
    DroppableInnerProps,
    DroppableState
  > {
    private element?: View;
    private identifier: DndId;

    static defaultProps = {
      bounceBack: true
    };

    constructor(props: DroppableInnerProps) {
      super(props);

      this.identifier = this.props.customId || Symbol("droppable");
    }

    componentDidMount() {
      this.props.__dndContext.registerDroppable(this.identifier, {
        onDrop: this.props.onDrop,
        onEnter: this.props.onEnter,
        onLeave: this.props.onLeave
      });
    }

    componentWillUnmount() {
      this.props.__dndContext.unregisterDroppable(this.identifier);
    }

    componentDidUpdate(prevProps: DroppableInnerProps) {
      const updatedDroppable: Partial<Droppable> = {};

      if (prevProps.onEnter !== this.props.onEnter) {
        updatedDroppable.onEnter = this.props.onEnter;
      }
      if (prevProps.onDrop !== this.props.onDrop) {
        updatedDroppable.onDrop = this.props.onDrop;
      }
      if (prevProps.onLeave !== this.props.onLeave) {
        updatedDroppable.onLeave = this.props.onLeave;
      }

      if (Object.keys(updatedDroppable).length !== 0) {
        this.props.__dndContext.updateDroppable(
          this.identifier,
          updatedDroppable
        );
      }
    }

    onLayout = (...args: any[]) => {
      if (this.props.onLayout) {
        this.props.onLayout(...args);
      }

      this.measure();
    };

    handleRef = (element: any) => {
      if (element.getNode) {
        this.element = element.getNode();
      } else {
        this.element = element;
      }
    };

    measure() {
      if (this.element) {
        this.element.measureInWindow((x, y, width, height) => {
          this.props.__dndContext.updateDroppable(this.identifier, {
            layout: { x, y, width, height }
          });
        });
      }
    }

    computeDistance = () => {
      const {
        currentDragging,
        getDraggable,
        getDroppable
      } = this.props.__dndContext;
      if (!currentDragging) {
        return;
      }

      const draggable = getDraggable(currentDragging);
      const droppable = getDroppable(this.identifier);
      if (!draggable || !droppable) {
        return;
      }

      return Math.sqrt(
        (draggable.layout.x - droppable.layout.x) ** 2 +
          (draggable.layout.y - droppable.layout.y) ** 2
      );
    };

    render() {
      const { children } = this.props;

      return children({
        computeDistance: this.computeDistance,
        active: this.props.__dndContext.currentDropping === this.identifier,
        viewProps: {
          onLayout: this.onLayout,
          ref: this.handleRef,
          style: {
            zIndex: -1
          }
        }
      });
    }
  }

  const Droppable = React.forwardRef(
    (props: DroppableProps, ref?: React.Ref<BaseDroppable>) => (
      <Consumer>
        {dndContext => (
          <BaseDroppable {...props} ref={ref} __dndContext={dndContext} />
        )}
      </Consumer>
    )
  );
  Droppable.displayName = "ConnectedDroppable";

  return Droppable;
}
