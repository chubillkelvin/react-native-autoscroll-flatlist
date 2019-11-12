import React from "react";
import { FlatList, FlatListProps, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
/**
 * An enhanced React Native <FlatList> component to provide auto-scrolling functionality.
 * Auto-scrolling will only be enabled if:
 * 1. the scrollTop is at the end of the list; or
 * 2. the user has scrolled back and/or past the end of the list
 * This is to prevent auto-scrolling from annoying the user when the user tries to scroll and look for something in the list.
 */
interface Props<T> extends FlatListProps<T> {
    threshold: number;
    flatListRef?: (refObj: React.RefObject<FlatList<T>>) => void;
}
export default class AutoScrollFlatList<T> extends React.PureComponent<Props<T>> {
    static defaultProps: {
        threshold: number;
    };
    private readonly listRef;
    private flatListHeight;
    private contentHeight;
    private enabledAutoScrollToEnd;
    scrollToEnd: () => void;
    onLayout: (event: LayoutChangeEvent) => void;
    onContentSizeChange: (width: number, height: number) => void;
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    render(): JSX.Element;
}
export {};
