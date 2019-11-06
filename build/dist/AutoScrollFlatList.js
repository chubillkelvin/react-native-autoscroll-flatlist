import React from "react";
import { FlatList, StyleSheet } from "react-native";
export default class AutoScrollFlatList extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.listRef = React.createRef();
        this.flatListHeight = 0;
        this.contentHeight = 0;
        this.enabledAutoScrollToEnd = true;
        this.scrollToEnd = () => {
            if (this.listRef.current && this.enabledAutoScrollToEnd) {
                this.listRef.current.scrollToOffset({ offset: this.contentHeight - this.flatListHeight });
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
            this.scrollToEnd();
            // User-defined onContentSizeChange event
            const { onContentSizeChange } = this.props;
            if (onContentSizeChange) {
                onContentSizeChange(width, height);
            }
        };
        this.onScroll = (event) => {
            // if scrollTop is at end / user scroll to end, the FlatList will now enabledAutoScrollToEnd
            if (this.listRef.current) {
                this.enabledAutoScrollToEnd = event.nativeEvent.contentOffset.y >= this.contentHeight - this.flatListHeight;
            }
            // User-defined onScroll event
            const { onScroll } = this.props;
            if (onScroll) {
                onScroll(event);
            }
        };
    }
    render() {
        const { contentContainerStyle, ...restProps } = this.props;
        return <FlatList {...restProps} ref={this.listRef} contentContainerStyle={[styles.contentContainer, contentContainerStyle]} onLayout={this.onLayout} onContentSizeChange={this.onContentSizeChange} onScroll={this.onScroll}/>;
    }
}
const styles = StyleSheet.create({
    contentContainer: {
        alignItems: "stretch",
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
});
//# sourceMappingURL=AutoScrollFlatList.js.map