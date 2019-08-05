import * as React from "react";
import renderer from "react-test-renderer";
import { View, Animated } from "react-native";

import { createDndContext, DragAndDropContext } from "../dragAndDropContext";
import { droppable } from "../droppable";
import { DraggableRenderProps } from "../types";

describe("droppable", () => {
  let Context: DragAndDropContext;
  let Droppable: DragAndDropContext["Droppable"];
  let Draggable: DragAndDropContext["Draggable"];

  beforeAll(() => {
    Context = createDndContext();
    Droppable = droppable(Context.Consumer);
    Draggable = Context.Draggable;
  });

  it("Should create a Droppable component", () => {
    expect(Droppable.displayName).toBe("ConnectedDroppable");
  });

  it("Should provide required render props", () => {
    const renderPropSpy = jest.fn().mockReturnValue(<View />);

    renderer.create(
      <Context.Provider>
        <Droppable>{renderPropSpy}</Droppable>
      </Context.Provider>
    );

    expect(renderPropSpy).toHaveBeenCalled();
    expect(renderPropSpy.mock.calls[0][0]).toEqual({
      active: expect.any(Boolean),
      computeDistance: expect.any(Function),
      viewProps: expect.objectContaining({
        onLayout: expect.any(Function),
        style: expect.any(Object),
        ref: expect.any(Function)
      })
    });
  });

  it("Should trigger onEnter when a draggable enters the droppable area", () => {
    const draggableRenderPropSpy = jest
      .fn()
      .mockImplementation(({ viewProps }: DraggableRenderProps) => (
        <Animated.View {...viewProps} />
      ));
    const droppableRenderPropSpy = jest
      .fn()
      .mockImplementation(({ viewProps }: DraggableRenderProps) => (
        <Animated.View {...viewProps} />
      ));
    const onEnterSpy = jest.fn();

    const wrapper = renderer.create(
      <Context.Provider>
        <Draggable customId="draggable-1">{draggableRenderPropSpy}</Draggable>
        <Droppable customId="droppable-1" onEnter={onEnterSpy}>
          {droppableRenderPropSpy}
        </Droppable>
      </Context.Provider>
    );

    const instance = wrapper.getInstance() as any;

    instance.updateDraggable("draggable-1", {
      layout: { x: 0, y: 0, width: 50, height: 50 }
    });
    instance.updateDroppable("droppable-1", {
      layout: { x: 100, y: 100, width: 50, height: 50 }
    });
    expect(onEnterSpy).not.toBeCalled();

    instance.handleDragMove("draggable-1", {
      x: 110,
      y: 110
    });

    expect(onEnterSpy).toBeCalled();
  });

  it("Should trigger onDrop when a draggable is dropped onto the droppable area", () => {
    const draggableRenderPropSpy = jest
      .fn()
      .mockImplementation(({ viewProps }: DraggableRenderProps) => (
        <Animated.View {...viewProps} />
      ));
    const droppableRenderPropSpy = jest
      .fn()
      .mockImplementation(({ viewProps }: DraggableRenderProps) => (
        <Animated.View {...viewProps} />
      ));
    const onDropSpy = jest.fn();

    const wrapper = renderer.create(
      <Context.Provider>
        <Draggable customId="draggable-1">{draggableRenderPropSpy}</Draggable>
        <Droppable customId="droppable-1" onDrop={onDropSpy}>
          {droppableRenderPropSpy}
        </Droppable>
      </Context.Provider>
    );

    const instance = wrapper.getInstance() as any;

    instance.updateDraggable("draggable-1", {
      layout: { x: 0, y: 0, width: 50, height: 50 }
    });
    instance.updateDroppable("droppable-1", {
      layout: { x: 100, y: 100, width: 50, height: 50 }
    });
    expect(onDropSpy).not.toBeCalled();

    instance.handleDragEnd("draggable-1", {
      x: 110,
      y: 110
    });

    expect(onDropSpy).toBeCalled();
  });

  it("Should trigger onLeave when a draggable leaves the droppable area", () => {
    const draggableRenderPropSpy = jest
      .fn()
      .mockImplementation(({ viewProps }: DraggableRenderProps) => (
        <Animated.View {...viewProps} />
      ));
    const droppableRenderPropSpy = jest
      .fn()
      .mockImplementation(({ viewProps }: DraggableRenderProps) => (
        <Animated.View {...viewProps} />
      ));
    const onLeaveSpy = jest.fn();
    const onEnterSpy = jest.fn();

    const wrapper = renderer.create(
      <Context.Provider>
        <Draggable customId="draggable-1">{draggableRenderPropSpy}</Draggable>
        <Droppable customId="droppable-1" onLeave={onLeaveSpy} onEnter={onEnterSpy}>
          {droppableRenderPropSpy}
        </Droppable>
      </Context.Provider>
    );

    const instance = wrapper.getInstance() as any;

    instance.updateDraggable("draggable-1", {
      layout: { x: 0, y: 0, width: 50, height: 50 }
    });
    instance.updateDroppable("droppable-1", {
      layout: { x: 100, y: 100, width: 50, height: 50 }
    });

    instance.handleDragMove("draggable-1", {
      x: 110,
      y: 110
    });
    expect(onEnterSpy).toBeCalled();
    expect(onLeaveSpy).not.toBeCalled();

    instance.handleDragMove("draggable-1", {
      x: 0,
      y: 0
    });

    expect(onLeaveSpy).toBeCalled();
  });
});
