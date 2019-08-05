import * as React from "react";
import renderer from "react-test-renderer";
import { View, Animated } from "react-native";

import { createDndContext, DragAndDropContext } from "../src/dragAndDropContext";
import { draggable } from "../src/draggable";

describe("draggable", () => {
  let Context: DragAndDropContext;
  let Draggable: DragAndDropContext["Draggable"];

  beforeAll(() => {
    Context = createDndContext();
    Draggable = draggable(Context.Consumer);
  });

  it("Should create a Draggable component", () => {
    expect(Draggable.displayName).toBe("ConnectedDraggable");
  });

  it("Should provide required render props", () => {
    const renderPropSpy = jest.fn().mockReturnValue(<View />);

    renderer.create(
      <Context.Provider>
        <Draggable>{renderPropSpy}</Draggable>
      </Context.Provider>
    );

    expect(renderPropSpy).toHaveBeenCalled();
    expect(renderPropSpy.mock.calls[0][0]).toEqual({
      viewProps: expect.objectContaining({
        onLayout: expect.any(Function),
        onMoveShouldSetResponder: expect.any(Function),
        onMoveShouldSetResponderCapture: expect.any(Function),
        onResponderEnd: expect.any(Function),
        onResponderGrant: expect.any(Function),
        onResponderMove: expect.any(Function),
        onResponderReject: expect.any(Function),
        onResponderRelease: expect.any(Function),
        onResponderStart: expect.any(Function),
        onResponderTerminate: expect.any(Function),
        onResponderTerminationRequest: expect.any(Function),
        onStartShouldSetResponder: expect.any(Function),
        onStartShouldSetResponderCapture: expect.any(Function),
        style: expect.any(Object),
        ref: expect.any(Function)
      })
    });
  });

  it("Should trigger onDragStart for the Draggable that was dragged", () => {
    const renderPropSpy = jest
      .fn()
      .mockImplementation(({ viewProps }) => <Animated.View {...viewProps} />);
    const onDragStartSpy1 = jest.fn();
    const onDragStartSpy2 = jest.fn();

    const wrapper = renderer.create(
      <Context.Provider>
        <Draggable customId="draggable-1" onDragStart={onDragStartSpy1}>
          {renderPropSpy}
        </Draggable>
        <Draggable customId="draggable-2" onDragStart={onDragStartSpy2}>
          {renderPropSpy}
        </Draggable>
      </Context.Provider>
    );

    (wrapper.getInstance() as any).handleDragStart("draggable-1", {
      x: 0,
      y: 0
    });

    expect(onDragStartSpy1).toBeCalled();
    expect(onDragStartSpy2).not.toBeCalled();
  });

  it("Should trigger onDragEnd for the Draggable that was dragged", () => {
    const renderPropSpy = jest
      .fn()
      .mockImplementation(({ viewProps }) => <Animated.View {...viewProps} />);
    const onDragEndSpy1 = jest.fn();
    const onDragEndSpy2 = jest.fn();

    const wrapper = renderer.create(
      <Context.Provider>
        <Draggable customId="draggable-1" onDragEnd={onDragEndSpy1}>
          {renderPropSpy}
        </Draggable>
        <Draggable customId="draggable-2" onDragEnd={onDragEndSpy2}>
          {renderPropSpy}
        </Draggable>
      </Context.Provider>
    );

    (wrapper.getInstance() as any).handleDragEnd("draggable-1", {
      x: 0,
      y: 0
    });

    expect(onDragEndSpy1).toBeCalled();
    expect(onDragEndSpy2).not.toBeCalled();
  });
});
