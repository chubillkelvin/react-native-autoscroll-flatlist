import React from "react";
import {FlatList, FlatListProps, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, StyleSheet} from "react-native";

/**
 * An enhanced React Native <FlatList> component to provide auto-scrolling functionality.
 * Auto-scrolling will only be enabled if:
 * 1. the scrollTop is at the end of the list; or
 * 2. the user has scrolled back and/or past the end of the list
 * This is to prevent auto-scrolling from annoying the user when the user tries to scroll and look for something in the list.
 */

interface ForwardedProps<T> extends FlatListProps<T> {
    ref?: React.Ref<AutoScrollFlatList<T>>;
    threshold?: number;
}

interface Props<T> extends FlatListProps<T> {
    flatListRef: React.RefObject<FlatList<T>>;
    threshold: number;
}

class AutoScrollFlatList<T> extends React.PureComponent<Props<T>> {
    private flatListHeight: number = 0;
    private contentHeight: number = 0;
    private enabledAutoScrollToEnd: boolean = true;

    scrollToEnd = () => {
        const {flatListRef} = this.props;
        if (flatListRef.current) {
            flatListRef.current.scrollToOffset({offset: this.contentHeight - this.flatListHeight});
        }
    };

    onLayout = (event: LayoutChangeEvent) => {
        this.flatListHeight = event.nativeEvent.layout.height;

        // User-defined onLayout event
        const {onLayout} = this.props;
        if (onLayout) {
            onLayout(event);
        }
    };

    onContentSizeChange = (width: number, height: number) => {
        this.contentHeight = height;
        const {flatListRef} = this.props;
        if (flatListRef.current && this.enabledAutoScrollToEnd) {
            this.scrollToEnd();
        }

        // User-defined onContentSizeChange event
        const {onContentSizeChange} = this.props;
        if (onContentSizeChange) {
            onContentSizeChange(width, height);
        }
    };

    onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        /**
         *  Default behavior: if scrollTop is at the end of <Flatlist>, autoscroll will be enabled.
         *  CAVEAT: Android has precision error here from 4 decimal places, therefore we need to use Math.floor() to make sure the calculation is correct on Android.
         */
        if (this.props.flatListRef.current) {
            this.enabledAutoScrollToEnd = event.nativeEvent.contentOffset.y + this.props.threshold >= Math.floor(this.contentHeight - this.flatListHeight);
        }

        // User-defined onScroll event
        const {onScroll} = this.props;
        if (onScroll) {
            onScroll(event);
        }
    };

    render() {
        const {flatListRef, contentContainerStyle, threshold, ...restProps} = this.props;
        return <FlatList {...restProps} ref={flatListRef} contentContainerStyle={[styles.contentContainer, contentContainerStyle]} onLayout={this.onLayout} onContentSizeChange={this.onContentSizeChange} onScroll={this.onScroll} />;
    }
}

export default React.forwardRef<FlatList<any>, ForwardedProps<any>>((props, ref) => {
    const listRef: React.RefObject<FlatList<any>> = ref && ref.hasOwnProperty("current") ? (ref as React.RefObject<FlatList<any>>) : React.createRef();
    return <AutoScrollFlatList {...props} threshold={props.threshold || 10} flatListRef={listRef} />;
});

const styles = StyleSheet.create({
    contentContainer: {
        alignItems: "stretch",
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
});
