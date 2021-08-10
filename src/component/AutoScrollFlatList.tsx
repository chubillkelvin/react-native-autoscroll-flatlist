import React from "react";
import type {LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, ScrollViewComponent} from "react-native";
import {Animated, FlatList, StyleSheet, Text, TouchableWithoutFeedback, View} from "react-native";
import {Triangle} from "./Triangle";
import type {Props} from "./type";
import type {Props as TriangleProps} from "./Triangle";

/**
 * An enhanced React Native <FlatList> component to provide auto-scrolling functionality.
 * Auto-scrolling will only be enabled if:
 * 1. the scrollTop is at the end of the list; or
 * 2. the user has scrolled back and/or past the end of the list
 * This is to prevent auto-scrolling from annoying the user when the user tries to scroll and look for something in the list.
 */

interface State {
    enabledAutoScrollToEnd: boolean;
    newItemCount: number;
    alertY: Animated.Value;
    isEndOfList: boolean;
}

export class AutoScrollFlatList<T> extends React.PureComponent<Props<T>, State> {
    static displayName = "AutoScrollFlatList";

    static defaultProps: Pick<Props<any>, "threshold" | "showScrollToEndIndicator" | "showNewItemAlert" | "autoScrollDisabled"> = {
        threshold: 0,
        showScrollToEndIndicator: true,
        showNewItemAlert: true,
        autoScrollDisabled: false,
    };

    private readonly listRef: React.RefObject<FlatList<T>> = React.createRef();
    private flatListHeight: number = 0;
    private flatListWidth: number = 0;
    private contentHeight: number = 0;
    private contentWidth: number = 0;
    private scrollTop: number = 0;

    constructor(props: Props<T>) {
        super(props);
        this.state = {
            enabledAutoScrollToEnd: props.autoScrollDisabled ? false : true,
            newItemCount: 0,
            alertY: new Animated.Value(0),
            isEndOfList: true,
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
        const offset = this.props.horizontal ? this.contentWidth - this.flatListWidth : this.contentHeight - this.flatListHeight;
        this.setState({newItemCount: 0});
        this.scrollToOffset({offset, animated: params.animated});
    };

    scrollToIndex = (params: {index: number; viewOffset?: number; viewPosition?: number; animated?: boolean}) => {
        this.listRef.current?.scrollToIndex(params);
    };

    scrollToItem = (params: {item: T; viewPosition?: number; animated: boolean}) => {
        this.listRef.current?.scrollToItem(params);
    };

    scrollToOffset = (params: {offset: number; animated?: boolean}) => {
        this.listRef.current?.scrollToOffset(params);
    };

    recordInteraction = () => {
        this.listRef.current?.recordInteraction();
    };

    flashScrollIndicators = () => {
        this.listRef.current?.flashScrollIndicators();
    };

    getScrollableNode = (): any => {
        return this.listRef.current?.getScrollableNode();
    };

    getNativeScrollRef = (): React.RefObject<View> | React.RefObject<ScrollViewComponent> | null | undefined => {
        return this.listRef.current?.getNativeScrollRef();
    };

    getScrollResponder = (): JSX.Element | null | undefined => {
        return this.listRef.current?.getScrollResponder();
    };

    isAutoScrolling = () => this.state.enabledAutoScrollToEnd;

    render() {
        /**
         * Need to force a refresh for the FlatList by changing the key when numColumns changes.
         * Ref: https://stackoverflow.com/questions/44291781/dynamically-changing-number-of-columns-in-react-native-flat-list
         */
        const {contentContainerStyle, threshold, showScrollToEndIndicator, showNewItemAlert, newItemAlertRenderer, indicatorContainerStyle, indicatorComponent, numColumns, ...restProps} = this.props;
        const {enabledAutoScrollToEnd, newItemCount, alertY, isEndOfList} = this.state;
        return (
            <View style={styles.container}>
                <FlatList {...restProps} ref={this.listRef} key={numColumns} numColumns={numColumns} contentContainerStyle={contentContainerStyle ?? styles.contentContainer} onLayout={this.onLayout} onContentSizeChange={this.onContentSizeChange} onScroll={this.onScroll} />
                {showNewItemAlert && !enabledAutoScrollToEnd && newItemCount > 0 && (
                    <TouchableWithoutFeedback onPress={() => this.scrollToEnd()}>{newItemAlertRenderer ? newItemAlertRenderer(newItemCount, alertY) : this.renderDefaultNewItemAlertComponent(newItemCount, alertY)}</TouchableWithoutFeedback>
                )}
                {showScrollToEndIndicator && !enabledAutoScrollToEnd && !isEndOfList && <TouchableWithoutFeedback onPress={() => this.scrollToEnd()}>{indicatorComponent ?? this.renderDefaultIndicatorComponent()}</TouchableWithoutFeedback>}
            </View>
        );
    }

    /**
     * Private Methods
     */

    private getTriangleDirection = (): TriangleProps["direction"] => {
        const {inverted, horizontal, triangleDirection} = this.props;
        let direction: TriangleProps["direction"];
        if (horizontal) {
            if (inverted) {
                direction = "left";
            } else {
                direction = "right";
            }
        } else {
            if (inverted) {
                direction = "up";
            } else {
                direction = "down";
            }
        }
        return triangleDirection ?? direction;
    };

    private getScrollToEndIndicatorPosition = () => {
        const {inverted, horizontal} = this.props;
        return {
            top: inverted && !horizontal ? 20 : undefined,
            bottom: inverted && !horizontal ? undefined : 20,
            left: inverted && horizontal ? 30 : undefined,
            right: inverted && horizontal ? undefined : 20,
        };
    };

    private onLayout = (event: LayoutChangeEvent) => {
        this.flatListHeight = event.nativeEvent.layout.height;
        this.flatListWidth = event.nativeEvent.layout.width;
        if (this.listRef.current && this.state.enabledAutoScrollToEnd) {
            this.scrollToEnd();
        }

        // User-defined onLayout event
        this.props.onLayout?.(event);
    };

    private onContentSizeChange = (width: number, height: number) => {
        this.contentHeight = height;
        this.contentWidth = width;
        if (this.state.enabledAutoScrollToEnd) {
            this.scrollToEnd();
        }

        // User-defined onContentSizeChange event
        this.props.onContentSizeChange?.(width, height);
    };

    private onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        /**
         *  Default behavior: if scrollTop is at the end of <Flatlist>, autoscroll will be enabled.
         *  CAVEAT: Android has precision error here from 4 decimal places, therefore we need to use Math.floor() to make sure the calculation is correct on Android.
         */
        const prevScrollTop = this.scrollTop;
        this.scrollTop = this.props.horizontal ? event.nativeEvent.contentOffset.x : event.nativeEvent.contentOffset.y;
        const isScrollingDown = prevScrollTop <= this.scrollTop;
        const scrollEnd = this.props.horizontal ? this.contentWidth - this.flatListWidth : this.contentHeight - this.flatListHeight;
        const isEndOfList = this.scrollTop + this.props.threshold >= Math.floor(scrollEnd);
        this.setState({isEndOfList, enabledAutoScrollToEnd: this.props.autoScrollDisabled ? false : (this.state.enabledAutoScrollToEnd && isScrollingDown) || isEndOfList}, () => {
            // User-defined onScroll event
            this.props.onScroll?.(event);
        });
        /**
         * Need to check if event.persist is defined before using to account for usage in react-native-web
         */
        event.persist?.();
    };

    private renderDefaultNewItemAlertComponent = (newItemCount: number, translateY: Animated.Value) => {
        const {inverted, horizontal, newItemAlertMessage, newItemAlertContainerStyle, newItemAlertTextStyle} = this.props;
        const direction = this.getTriangleDirection();
        const message = newItemAlertMessage ? newItemAlertMessage(newItemCount) : `${direction === "left" ? " " : ""}${newItemCount} new item${newItemCount > 1 ? "s" : ""}`;
        const position = inverted && !horizontal ? {bottom: translateY} : {top: translateY};
        return (
            <Animated.View style={[styles.newItemAlert, newItemAlertContainerStyle, position]}>
                {direction === "left" && <Triangle size={4} direction={direction} />}
                <Text style={[styles.alertMessage, newItemAlertTextStyle]}>{message}</Text>
                {direction !== "left" && <Triangle size={4} direction={direction} />}
            </Animated.View>
        );
    };

    private renderDefaultIndicatorComponent = () => {
        const {indicatorContainerStyle} = this.props;
        return (
            <View style={indicatorContainerStyle ?? [styles.scrollToEndIndicator, this.getScrollToEndIndicatorPosition()]}>
                <Triangle direction={this.getTriangleDirection()} />
            </View>
        );
    };
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
