import React from "react";
import {FlatList, FlatListProps, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, StyleSheet} from "react-native";

/**
 * An enhanced React Native <FlatList> component to provide auto-scrolling functionality.
 * Auto-scrolling will only be enabled if:
 * 1. the scrollTop is at the end of the list; or
 * 2. the user has scrolled back and/or past the end of the list
 * This is to prevent auto-scrolling from annoying the user when the user tries to scroll and look for something in the list.
 */

interface Props<T> extends Exclude<FlatListProps<T>, "ref"> {}

export default class AutoScrollFlatList<T> extends React.PureComponent<Props<T>> {
    private readonly listRef: React.RefObject<FlatList<T>>;
    private flatListHeight: number = 0;
    private contentHeight: number = 0;
    private enabledAutoScrollToEnd: boolean = true;

    constructor(props: Props<T>) {
        super(props);
        this.listRef = React.createRef();
    }

    scrollToEnd = () => {
        if (this.listRef.current && this.enabledAutoScrollToEnd) {
            this.listRef.current.scrollToOffset({offset: this.contentHeight - this.flatListHeight});
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
        this.scrollToEnd();

        // User-defined onContentSizeChange event
        const {onContentSizeChange} = this.props;
        if (onContentSizeChange) {
            onContentSizeChange(width, height);
        }
    };

    onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        // if scrollTop is at end / user scroll to end, the FlatList will now enabledAutoScrollToEnd
        if (this.listRef.current) {
            this.enabledAutoScrollToEnd = event.nativeEvent.contentOffset.y >= this.contentHeight - this.flatListHeight;
        }

        // User-defined onScroll event
        const {onScroll} = this.props;
        if (onScroll) {
            onScroll(event);
        }
    };

    render() {
        const {contentContainerStyle, ...restProps} = this.props;
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
