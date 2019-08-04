[![Build Status](https://travis-ci.org/mohebifar/react-native-easy-dnd.svg?branch=master)](https://travis-ci.org/mohebifar/react-native-easy-dnd)
[![NPM Version](https://img.shields.io/npm/v/react-native-easy-dnd.svg)](https://www.npmjs.com/package/react-native-easy-dnd)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

<p align="center">
  <img alt="React native easy DnD Demo" src="https://github.com/mohebifar/react-native-easy-dnd/raw/f6d57edee863cf22de91d6f3007dcbd687c2cb9a/demo.gif" />
</div>

# Installation

```
npm install --save react-native-easy-dnd

# or using yarn

yarn add react-native-easy-dnd
```

# Usage

First, you need to import `createDndContext`. This function creates the context for storing the data for the draggable and droppable child components.

```js
import { createDndContext } from "react-native-easy-dnd";

const { Provider, Droppable, Draggable } = createDndContext();
```


## Provider
Wrap the part of your application that you want to enable drag and drop for inside `Provider`.

```jsx
<Provider>
   <View>
      {/*  */}
   </View>
</Provider>
```

## Draggable
Add a `Draggable` component with a function as a child. The element that you want to make draggable needs to be `Animated.View` whose props must extend `viewProps` passed in by the render prop function.


```jsx
import {Animated} from 'react-native';

// ...
<Draggable
  onDragStart={() => {
    console.log('Started draggging');
  }}
  onDragEnd={() => {
    console.log('Ended draggging');
  }}
  payload="my-draggable-item"
>
  {({ viewProps }) => {
    return (
      <Animated.View
        {...viewProps}
        style={[viewProps.style, { width: 200, height: 200, backgroundColor: "red" }]}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Drag me
        </Text>
      </Animated.View>
    );
  }}
</Draggable>
```

### Props

| Prop          | Type       | Description   |      
| ------------- | ---------- | ------------- |
| `onDragStart` | `Function` | Callback that is triggerd when user starts dragging the draggable element |
| `onDragStart` | `Function` | Callback that is triggerd when user ends dragging the draggable element |
| `payload`     | `any`      | An arbitrary value (often) unique to this draggable that can later be used to determine which draggable item was dropped onto a droppable |

## Droppable
Add a `Droppable` component with a function as a child. Similarly, the element that you want to make droppable needs to be `Animated.View` whose props must extend `viewProps` passed in by the render prop function.

```jsx
import {Animated} from 'react-native';

// ...

<Droppable
  onEnter={() => {
    console.log('Draggable entered');
  }}
  onLeave={() => {
    console.log('Draggable left');
  }}
  onDrop={({ payload }) => {
    console.log('Draggable with the following payload was dropped', payload);
  }}
>
  {({ active, viewProps }) => {
    return (
      <Animated.View
        {...viewProps}
        style={[
          {
            width: 300,
            height: 200,
            backgroundColor: active
              ? "blue"
              : "green"
          },
          viewProps.style,
        ]}
      >
        <Text style={{ fontWeight: "bold", color: "white" }}>Drop here</Text>
      </Animated.View>
    );
  }}
</Droppable>
```

### Props

| Prop          | Type       | Description   |      
| ------------- | ---------- | ------------- |
| `onEnter`     | `Function` | Callback that is triggerd when a draggable enters the droppable area |
| `onLeave`     | `Function` | Callback that is triggerd when a draggable leaves the droppable area |
| `onDrop`      | `Function` | Callback that is triggerd when a draggable is dropped onto the droppable area |

# Fun Fact!

I wrote most of the code on a flight from Toronto to St. John's in March 2019. ✈

# License

Licensed under the [MIT License](https://github.com/mohebifar/react-native-easy-dnd/blob/master/LICENSE), Copyright © 2019 Mohamad Mohebifar.
