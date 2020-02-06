import React from "react";
import { Animated, FlatListProps, ScrollViewComponent, StyleProp, TextStyle, View, ViewStyle } from "react-native";
import Triangle from "./Triangle";
/**
 * An enhanced React Native <FlatList> component to provide auto-scrolling functionality.
 * Auto-scrolling will only be enabled if:
 * 1. the scrollTop is at the end of the list; or
 * 2. the user has scrolled back and/or past the end of the list
 * This is to prevent auto-scrolling from annoying the user when the user tries to scroll and look for something in the list.
 */
interface Props<T> extends FlatListProps<T> {
    /**
     * Distance from end of list to enable auto-scrolling.
     * Default is 0.
     */
    threshold: number;
    /**
     * Whether to show an indicator to scroll to end.
     * Default is true.
     */
    showScrollToEndIndicator: boolean;
    /**
     * Whether to show an alert on top when auto-scrolling is temporarily disabled.
     * Default is true.
     */
    showNewItemAlert: boolean;
    /**
     * The style for container of the scrollToEndIndicator. Best used with position: "absolute".
     * Default is styles.scrollToEndIndicator.
     */
    indicatorContainerStyle?: StyleProp<ViewStyle>;
    /**
     * The component for scrollToEndIndicator.
     * A default component is provided.
     */
    indicatorComponent?: React.ComponentType<any> | React.ReactElement | null;
    /**
     * This changes the wordings of the default newItemAlertMessage.
     * @param newItemCount - number of item since auto-scrolling is temporarily disabled.
     * Note: Will be overridden if newItemAlertRenderer is set.
     */
    newItemAlertMessage?: (newItemCount: number) => string;
    /**
     * This applies additional ViewStyle to the <Animated.View> that wraps the default newItemAlert.
     * Note: Will be overridden if newItemAlertRenderer is set.
     */
    newItemAlertContainerStyle?: StyleProp<ViewStyle>;
    /**
     * This applies additional TextStyle to the <Text> that wraps the newItemAlertMessage.
     * Note: Will be overridden if newItemAlertRenderer is set.
     */
    newItemAlertTextStyle?: StyleProp<TextStyle>;
    /**
     * The component that indicates number of new messages. Best with position absolute.
     * A default renderer is provided.
     *
     * @param newItemCount - number of item since auto-scrolling is temporarily disabled.
     * @param translateY - the Animated Value for positioning the alert which slides in from top.
     */
    newItemAlertRenderer?: (newItemCount: number, translateY: Animated.Value) => React.ComponentType<any> | React.ReactElement;
    /**
     * This returns a filtered data array which is then used to count the newItemCount.
     *
     * @param data - the original data props supplied to the list.
     */
    filteredDataForNewItemCount?: (data: readonly T[]) => readonly T[];
}
interface State {
    enabledAutoScrollToEnd: boolean;
    newItemCount: number;
    alertY: Animated.Value;
}
export default class AutoScrollFlatList<T> extends React.PureComponent<Props<T>, State> {
    static defaultProps: Pick<Props<any>, "threshold" | "showScrollToEndIndicator" | "showNewItemAlert">;
    constructor(props: Props<T>);
    private readonly listRef;
    private flatListHeight;
    private contentHeight;
    private scrollTop;
    componentDidUpdate(prevProps: Readonly<Props<T>>, prevState: Readonly<State>): void;
    /**
     *  Exposing FlatList Methods To AutoScrollFlatList's Ref
     */
    scrollToEnd: (params?: {
        animated: boolean;
    }) => void;
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
    getScrollableNode: () => any;
    getNativeScrollRef: () => React.RefObject<View> | React.RefObject<ScrollViewComponent> | null | undefined;
    getScrollResponder: () => JSX.Element | null | undefined;
    isAutoScrolling: () => boolean;
    /**
     * End of Exposed Methods
     */
    private onLayout;
    private onContentSizeChange;
    private onScroll;
    private renderDefaultNewItemAlertComponent;
    private renderDefaultIndicatorComponent;
    render(): JSX.Element;
}
export { Triangle };
