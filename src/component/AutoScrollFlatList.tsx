import React from "react";
import type {FlatListProps, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, ScrollViewComponent, StyleProp, TextStyle, ViewStyle} from "react-native";
import {Animated, FlatList, StyleSheet, Text, TouchableWithoutFeedback, View} from "react-native";
import {Triangle} from "./Triangle";

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

export class AutoScrollFlatList<T> extends React.PureComponent<Props<T>, State> {
    static displayName = "AutoScrollFlatList";

    static defaultProps: Pick<Props<any>, "threshold" | "showScrollToEndIndicator" | "showNewItemAlert"> = {
        threshold: 0,
        showScrollToEndIndicator: true,
        showNewItemAlert: true,
    };

    private readonly listRef: React.RefObject<FlatList<T>> = React.createRef();
    private flatListHeight: number = 0;
    private contentHeight: number = 0;
    private scrollTop: number = 0;

    constructor(props: Props<T>) {
        super(props);
        this.state = {
            enabledAutoScrollToEnd: true,
            newItemCount: 0,
            alertY: new Animated.Value(0),
        };
    }

    componentDidUpdate(prevProps: Readonly<Props<T>>, prevState: Readonly<State>) {
        const {data, filteredDataForNewItemCount} = this.props;
        const {enabledAutoScrollToEnd, newItemCount, alertY} = this.state;
        const filteredPrevData = filteredDataForNewItemCount ? filteredDataForNewItemCount(prevProps.data ?? []) : prevProps.data ?? [];
        const filteredData = filteredDataForNewItemCount ? filteredDataForNewItemCount(data ?? []) : data ?? [];
        if (!enabledAutoScrollToEnd && filteredData.length > filteredPrevData.length) {
            const newCount = prevState.newItemCount + filteredData.length - filteredPrevData.length;
            this.setState({newItemCount: newCount});
            if (newCount === 1) {
                alertY.setValue(-30);
                Animated.timing(alertY, {
                    toValue: 10,
                    duration: 250,
                    useNativeDriver: false,
                }).start();
            }
        } else if (enabledAutoScrollToEnd && newItemCount) {
            this.setState({newItemCount: 0});
        }
    }

    /**
     *  Exposing FlatList Methods To AutoScrollFlatList's Ref
     */

    scrollToEnd = (params: {animated: boolean} = {animated: true}) => {
        this.setState({newItemCount: 0});
        this.scrollToOffset({offset: this.contentHeight - this.flatListHeight, animated: params.animated});
    };

    scrollToIndex = (params: {index: number; viewOffset?: number; viewPosition?: number; animated?: boolean}) => {
        if (this.listRef.current) {
            this.listRef.current.scrollToIndex(params);
        }
    };

    scrollToItem = (params: {item: T; viewPosition?: number; animated: boolean}) => {
        if (this.listRef.current) {
            this.listRef.current.scrollToItem(params);
        }
    };

    scrollToOffset = (params: {offset: number; animated?: boolean}) => {
        if (this.listRef.current) {
            this.listRef.current.scrollToOffset(params);
        }
    };

    recordInteraction = () => {
        if (this.listRef.current) {
            this.listRef.current.recordInteraction();
        }
    };

    flashScrollIndicators = () => {
        if (this.listRef.current) {
            this.listRef.current.flashScrollIndicators();
        }
    };

    getScrollableNode = (): any => {
        if (this.listRef.current) {
            return this.listRef.current.getScrollableNode();
        }
    };

    getNativeScrollRef = (): React.RefObject<View> | React.RefObject<ScrollViewComponent> | null | undefined => {
        if (this.listRef.current) {
            return this.listRef.current.getNativeScrollRef();
        }
    };

    getScrollResponder = (): JSX.Element | null | undefined => {
        if (this.listRef.current) {
            return this.listRef.current.getScrollResponder();
        }
    };

    isAutoScrolling = () => this.state.enabledAutoScrollToEnd;

    render() {
        /**
         * Need to force a refresh for the FlatList by changing the key when numColumns changes.
         * Ref: https://stackoverflow.com/questions/44291781/dynamically-changing-number-of-columns-in-react-native-flat-list
         */
        const {contentContainerStyle, threshold, showScrollToEndIndicator, showNewItemAlert, newItemAlertRenderer, indicatorContainerStyle, indicatorComponent, numColumns, ...restProps} = this.props;
        const {enabledAutoScrollToEnd, newItemCount, alertY} = this.state;
        return (
            <View style={styles.container}>
                <FlatList {...restProps} ref={this.listRef} key={numColumns} numColumns={numColumns} contentContainerStyle={contentContainerStyle ?? styles.contentContainer} onLayout={this.onLayout} onContentSizeChange={this.onContentSizeChange} onScroll={this.onScroll} />
                {showNewItemAlert && !enabledAutoScrollToEnd && newItemCount > 0 && (
                    <TouchableWithoutFeedback onPress={() => this.scrollToEnd()}>{newItemAlertRenderer ? newItemAlertRenderer(newItemCount, alertY) : this.renderDefaultNewItemAlertComponent(newItemCount, alertY)}</TouchableWithoutFeedback>
                )}
                {showScrollToEndIndicator && !enabledAutoScrollToEnd && <TouchableWithoutFeedback onPress={() => this.scrollToEnd()}>{indicatorComponent ?? this.renderDefaultIndicatorComponent()}</TouchableWithoutFeedback>}
            </View>
        );
    }

    /**
     * Private Methods
     */

    private onLayout = (event: LayoutChangeEvent) => {
        this.flatListHeight = event.nativeEvent.layout.height;
        if (this.listRef.current && this.state.enabledAutoScrollToEnd) {
            this.scrollToEnd();
        }

        // User-defined onLayout event
        const {onLayout} = this.props;
        if (onLayout) {
            onLayout(event);
        }
    };

    private onContentSizeChange = (width: number, height: number) => {
        this.contentHeight = height;
        if (this.state.enabledAutoScrollToEnd) {
            this.scrollToEnd();
        }

        // User-defined onContentSizeChange event
        const {onContentSizeChange} = this.props;
        if (onContentSizeChange) {
            onContentSizeChange(width, height);
        }
    };

    private onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        /**
         *  Default behavior: if scrollTop is at the end of <Flatlist>, autoscroll will be enabled.
         *  CAVEAT: Android has precision error here from 4 decimal places, therefore we need to use Math.floor() to make sure the calculation is correct on Android.
         */
        const prevScrollTop = this.scrollTop;
        this.scrollTop = this.props.horizontal ? event.nativeEvent.contentOffset.x : event.nativeEvent.contentOffset.y;
        const isScrollingDown = prevScrollTop <= this.scrollTop;
        const isEndOfList = this.scrollTop + this.props.threshold >= Math.floor(this.contentHeight - this.flatListHeight);
        this.setState({enabledAutoScrollToEnd: (this.state.enabledAutoScrollToEnd && isScrollingDown) || isEndOfList}, () => {
            // User-defined onScroll event
            const {onScroll} = this.props;
            if (onScroll) {
                onScroll(event);
            }
        });
        /**
         * Need to check if event.persist is defined before using to account for usage in react-native-web
         */
        event.persist && event.persist();
    };

    private renderDefaultNewItemAlertComponent = (newItemCount: number, translateY: Animated.Value) => {
        const {newItemAlertMessage, newItemAlertContainerStyle, newItemAlertTextStyle} = this.props;
        const message = newItemAlertMessage ? newItemAlertMessage(newItemCount) : `${newItemCount} new item${newItemCount > 1 ? "s" : ""}`;
        return (
            <Animated.View style={[styles.newItemAlert, newItemAlertContainerStyle, {transform: [{translateY}]}]}>
                <Text style={[styles.alertMessage, newItemAlertTextStyle]}>{message}</Text>
                <Triangle size={4} />
            </Animated.View>
        );
    };

    private renderDefaultIndicatorComponent = () => (
        <View style={this.props.indicatorContainerStyle ?? styles.scrollToEndIndicator}>
            <Triangle />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: "hidden",
    },
    contentContainer: {
        alignItems: "stretch",
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
    scrollToEndIndicator: {
        position: "absolute",
        right: 20,
        bottom: 20,
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#000000",
        borderRadius: 5,
        backgroundColor: "#ffffff",
    },
    newItemAlert: {
        position: "absolute",
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#000000",
        backgroundColor: "#ffffff",
        paddingVertical: 3,
        paddingHorizontal: 8,
    },
    alertMessage: {
        marginRight: 4,
    },
});
