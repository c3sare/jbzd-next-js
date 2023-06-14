import type { ObservedBlockList } from "@/types/ObservedBlockList";

export default function createObservedBlockGroup(lists: ObservedBlockList[]) {
  return {
    user: {
      follow: lists
        .filter((item) => item.type === "USER" && item.method === "FOLLOW")
        .map((item) => item.name),
      block: lists
        .filter((item) => item.type === "USER" && item.method === "BLOCK")
        .map((item) => item.name),
    },
    tag: {
      follow: lists
        .filter((item) => item.type === "TAG" && item.method === "FOLLOW")
        .map((item) => item.name),
      block: lists
        .filter((item) => item.type === "TAG" && item.method === "BLOCK")
        .map((item) => item.name),
    },
    section: {
      follow: lists
        .filter((item) => item.type === "SECTION" && item.method === "FOLLOW")
        .map((item) => item.name),
    },
  };
}
