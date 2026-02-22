import { Redirect } from "expo-router";

export default function EntryPoint() {
  // This sends the user specifically to the stack that contains your Pager & BottomNav
  return <Redirect href="/(main)/(stack)/mainpager" />;
}
