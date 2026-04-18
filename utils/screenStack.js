import { withTiming } from "react-native-reanimated";

const PUSH_OFFSET = 80; // tweak this to taste
const DURATION = 250; // match your existing slide-in duration

const stack = [];

export function pushScreen(translateX) {
  if (stack.length > 0) {
    stack[stack.length - 1].value = withTiming(-PUSH_OFFSET, {
      duration: DURATION,
    });
  }
  stack.push(translateX);
}

export function popScreen() {
  stack.pop();
  if (stack.length > 0) {
    stack[stack.length - 1].value = withTiming(0, { duration: DURATION });
  }
}
