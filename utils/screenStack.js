import { withTiming } from "react-native-reanimated";

const PUSH_OFFSET = 80;
const DURATION = 300;
const stack = [];

export function pushScreen(translateX, instant = false) {
  if (stack.length > 0) {
    if (instant) {
      stack[stack.length - 1].value = -PUSH_OFFSET; //  instant, invisible
    } else {
      stack[stack.length - 1].value = withTiming(-PUSH_OFFSET, {
        duration: DURATION,
      });
    }
  }
  stack.push(translateX);
}

export function popScreen() {
  stack.pop();
  if (stack.length > 0) {
    stack[stack.length - 1].value = withTiming(0, { duration: DURATION });
  }
}

export function snapScreen() {
  stack.pop();
  if (stack.length > 0) {
    stack[stack.length - 1].value = -PUSH_OFFSET; // instant snap to -80
  }
}

export function clearStack() {
  stack.length = 0; //  wipes all stale entries
}
