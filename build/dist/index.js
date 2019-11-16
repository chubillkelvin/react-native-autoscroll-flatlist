import React from "react";
import { FlatList, StyleSheet } from "react-native";
class AutoScrollFlatList extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.flatListHeight = 0;
        this.contentHeight = 0;
        this.enabledAutoScrollToEnd = true;
        this.scrollToEnd = () => {
            const { flatListRef } = this.props;
            if (flatListRef.current) {
                flatListRef.current.scrollToOffset({ offset: this.contentHeight - this.flatListHeight });
            }
        };
        this.onLayout = (event) => {
            this.flatListHeight = event.nativeEvent.layout.height;
            // User-defined onLayout event
            const { onLayout } = this.props;
            if (onLayout) {
                onLayout(event);
            }
        };
        this.onContentSizeChange = (width, height) => {
            this.contentHeight = height;
            const { flatListRef } = this.props;
            if (flatListRef.current && this.enabledAutoScrollToEnd) {
                this.scrollToEnd();
            }
            // User-defined onContentSizeChange event
            const { onContentSizeChange } = this.props;
            if (onContentSizeChange) {
                onContentSizeChange(width, height);
            }
        };
        this.onScroll = (event) => {
            /**
             *  Default behavior: if scrollTop is at the end of <Flatlist>, autoscroll will be enabled.
             *  CAVEAT: Android has precision error here from 4 decimal places, therefore we need to use Math.floor() to make sure the calculation is correct on Android.
             */
            if (this.props.flatListRef.current) {
                this.enabledAutoScrollToEnd = event.nativeEvent.contentOffset.y + this.props.threshold >= Math.floor(this.contentHeight - this.flatListHeight);
            }
            // User-defined onScroll event
            const { onScroll } = this.props;
            if (onScroll) {
                onScroll(event);
            }
        };
    }
    render() {
        const { flatListRef, contentContainerStyle, threshold, ...restProps } = this.props;
        return <FlatList {...restProps} ref={flatListRef} contentContainerStyle={[styles.contentContainer, contentContainerStyle]} onLayout={this.onLayout} onContentSizeChange={this.onContentSizeChange} onScroll={this.onScroll}/>;
    }
}
export default React.forwardRef((props, ref) => {
    const listRef = ref && ref.hasOwnProperty("current") ? ref : React.createRef();
    return <AutoScrollFlatList {...props} threshold={props.threshold || 10} flatListRef={listRef}/>;
});
const styles = StyleSheet.create({
    contentContainer: {
        alignItems: "stretch",
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
});
//# sourceMappingURL=index.js.map