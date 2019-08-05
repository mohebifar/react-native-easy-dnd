import { createDndContext } from "../src/dragAndDropContext";

describe("createDnDContext", () => {
  it("Should return Provider, Consumer, Draggable, and Droppable", () => {
    const context = createDndContext();
    expect(context).toHaveProperty("Provider");
    expect(context).toHaveProperty("Consumer");
    expect(context).toHaveProperty("Draggable");
    expect(context).toHaveProperty("Droppable");
  });
});
