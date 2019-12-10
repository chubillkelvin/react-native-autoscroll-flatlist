import React from "react";
import {FlatList, FlatListProps, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, StyleProp, StyleSheet, TextStyle, ViewStyle} from "react-native";

/**
 * An enhanced React Native <FlatList> component to provide auto-scrolling functionality.
 * Auto-scrolling will only be enabled if:
 * 1. the scrollTop is at the end of the list; or
 * 2. the user has scrolled back and/or past the end of the list
 * This is to prevent auto-scrolling from annoying the user when the user tries to scroll and look for something in the list.
 */

interface Props<T> extends FlatListProps<T> {
    threshold: number;
    // TODO: render a {position: absolute} indicator if enabledAutoScrollToEnd is false
    showScrollToEndIndicator: boolean;
    newMessageAlertRenderer?: (newMessageCount: number) => string;
    indicatorContainerStyle?: StyleProp<ViewStyle>;
    indicatorTextStyle?: StyleProp<TextStyle>;
}

export default class AutoScrollFlatList<T> extends React.PureComponent<Props<T>> {
    static defaultProps: Pick<Props<any>, "threshold" | "showScrollToEndIndicator"> = {
        threshold: 0,
        showScrollToEndIndicator: true,
    };

    private readonly listRef: React.RefObject<FlatList<T>> = React.createRef();
    private flatListHeight: number = 0;
    private contentHeight: number = 0;
    private enabledAutoScrollToEnd: boolean = true;

    // TODO: use componentDidUpdate, then compare data.length < prevData.length to trigger scroll or show newMessageAlert, to replace onContentSizeChange?
    // TODO: I think it's better because onContentSizeChange not necessarily means should scroll. discuss.

    /**
     *  Exposing FlatList Methods To AutoScrollFlatList's Ref
     */

    scrollToEnd = (params: {animated: boolean} = {animated: true}) => {
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

    getMetrics = () => {
        if (this.listRef.current) {
            return this.listRef.current.getMetrics();
        }
    };

    /**
     * End of Exposed Methods
     */

    private onLayout = (event: LayoutChangeEvent) => {
        this.flatListHeight = event.nativeEvent.layout.height;
        if (this.listRef.current && this.enabledAutoScrollToEnd) {
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
        if (this.enabledAutoScrollToEnd) {
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
        this.enabledAutoScrollToEnd = event.nativeEvent.contentOffset.y + this.props.threshold >= Math.floor(this.contentHeight - this.flatListHeight);

        // User-defined onScroll event
        const {onScroll} = this.props;
        if (onScroll) {
            onScroll(event);
        }
    };

    render() {
        const {contentContainerStyle, threshold, ...restProps} = this.props;
        return <FlatList {...restProps} ref={this.listRef} contentContainerStyle={[styles.contentContainer, contentContainerStyle]} onLayout={this.onLayout} onContentSizeChange={this.onContentSizeChange} onScroll={this.onScroll} />;
    }
}

const styles = StyleSheet.create({
    contentContainer: {
        alignItems: "stretch",
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
});
