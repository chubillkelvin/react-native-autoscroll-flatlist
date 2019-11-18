import React from "react";
import { FlatListProps } from "react-native";
/**
 * An enhanced React Native <FlatList> component to provide auto-scrolling functionality.
 * Auto-scrolling will only be enabled if:
 * 1. the scrollTop is at the end of the list; or
 * 2. the user has scrolled back and/or past the end of the list
 * This is to prevent auto-scrolling from annoying the user when the user tries to scroll and look for something in the list.
 */
interface Props<T> extends FlatListProps<T> {
    threshold: number;
}
export default class AutoScrollFlatList<T> extends React.PureComponent<Props<T>> {
    static defaultProps: {
        threshold: number;
    };
    private readonly listRef;
    private flatListHeight;
    private contentHeight;
    private enabledAutoScrollToEnd;
    /**
     *  Exposing FlatList Methods To AutoScrollFlatList's Ref
     */
    scrollToEnd: (params?: {
        animated: boolean;
    } | undefined) => void;
    scrollToIndex: (params: {
        index: number;
        viewOffset?: number | undefined;
        viewPosition?: number | undefined;
        animated?: boolean | undefined;
    }) => void;
    scrollToItem: (params: {
        item: T;
        viewPosition?: number | undefined;
        animated: boolean;
    }) => void;
    scrollToOffset: (params: {
        offset: number;
        animated?: boolean | undefined;
    }) => void;
    recordInteraction: () => void;
    flashScrollIndicators: () => void;
    getMetrics: () => {
        contentLength: number;
        totalRows: number;
        renderedRows: number;
        visibleRows: number;
    } | undefined;
    /**
     * End of Exposed Methods
     */
    private onLayout;
    private onContentSizeChange;
    private onScroll;
    render(): JSX.Element;
}
export {};
