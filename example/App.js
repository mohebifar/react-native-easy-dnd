import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  FlatList,
  Button
} from "react-native";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";

import { createDndContext } from "react-native-easy-dnd";

const { Provider, Droppable, Draggable } = createDndContext();

export default function App() {
  const droppableOpacity = React.useRef(new Animated.Value(0));
  const trashIconScale = React.useRef(new Animated.Value(1));
  const [items, setItems] = React.useState([1, 2, 3]);

  const animateValue = (ref, toValue) =>
    Animated.timing(ref.current, {
      toValue,
      duration: 300
    }).start();

  return (
    <Provider>
      <View style={styles.container}>
        <View style={{ paddingTop: 40, flex: 1, width: "100%" }}>
          {items.length === 0 ? (
            <Button
              title="Reset Draggable Items"
              onPress={() => {
                setItems([1, 2, 3]);
              }}
            />
          ) : null}
          {items.map(item => (
            <Draggable
              key={item}
              onDragStart={() => {
                animateValue(droppableOpacity, 1);
              }}
              onDragEnd={() => {
                animateValue(droppableOpacity, 0);
              }}
              payload={item}
            >
              {({ viewProps }) => {
                return (
                  <Animated.View
                    {...viewProps}
                    style={[viewProps.style, styles.draggable]}
                  >
                    <Text style={{ color: "#333", fontWeight: "bold" }}>
                      Draggable Item {item}
                    </Text>
                  </Animated.View>
                );
              }}
            </Draggable>
          ))}
        </View>

        <Droppable
          onEnter={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            animateValue(trashIconScale, 1.2);
          }}
          onLeave={() => {
            animateValue(trashIconScale, 1);
          }}
          onDrop={({ payload }) => {
            setItems(items.filter(item => item !== payload));
          }}
        >
          {({ active, viewProps }) => {
            return (
              <Animated.View
                {...viewProps}
                style={[
                  {
                    opacity: droppableOpacity.current,
                    backgroundColor: active
                      ? "rgba(0,0,0,0.4)"
                      : "rgba(0,0,0,0.3)"
                  },
                  viewProps.style,
                  styles.droppableArea
                ]}
              >
                <Text style={styles.droppableText}>Drag to delete</Text>
                <Animated.View
                  style={[
                    {
                      transform: [
                        {
                          scale: trashIconScale.current
                        }
                      ]
                    },
                    styles.trashIconWrapper
                  ]}
                >
                  <Feather name="trash-2" size={24} color="white" />
                </Animated.View>
              </Animated.View>
            );
          }}
        </Droppable>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  droppableArea: {
    width: "100%",
    height: 120,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "space-between"
  },
  droppableText: { color: "white", fontWeight: "700" },
  trashIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderColor: "white",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center"
  },
  draggable: {
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
    borderWidth: 1,
    borderColor: "#ababab",
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: "white"
  }
});
