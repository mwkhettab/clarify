import { View, Pressable } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import type { LinkProps } from "expo-router";

type IconButtonProps = {
  icon: ComponentProps<typeof MaterialIcons>["name"];
  href?: LinkProps["href"];
  onPress?: () => void;
};

export default function IconButton({ icon, href, onPress }: IconButtonProps) {
  const content = (
    <View className="p-3 rounded-full bg-blue-500 shadow-blue-500 shadow-lg">
      <MaterialIcons name={icon} size={24} color="white" />
    </View>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return <Pressable onPress={onPress}>{content}</Pressable>;
}
