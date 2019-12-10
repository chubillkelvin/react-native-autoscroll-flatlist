import React from "react";
import { FlatList, StyleSheet } from "react-native";
export default class AutoScrollFlatList extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.listRef = React.createRef();
        this.flatListHeight = 0;
        this.contentHeight = 0;
        this.enabledAutoScrollToEnd = true;
        // TODO: use componentDidUpdate, then compare data.length < prevData.length to trigger scroll or show newMessageAlert, to replace onContentSizeChange?
        // TODO: I think it's better because onContentSizeChange not necessarily means should scroll. discuss.
        /**
         *  Exposing FlatList Methods To AutoScrollFlatList's Ref
         */
        this.scrollToEnd = (params = { animated: true }) => {
            this.scrollToOffset({ offset: this.contentHeight - this.flatListHeight, animated: params.animated });
        };
        this.scrollToIndex = (params) => {
            if (this.listRef.current) {
                this.listRef.current.scrollToIndex(params);
            }
        };
        this.scrollToItem = (params) => {
            if (this.listRef.current) {
                this.listRef.current.scrollToItem(params);
            }
        };
        this.scrollToOffset = (params) => {
            if (this.listRef.current) {
                this.listRef.current.scrollToOffset(params);
            }
        };
        this.recordInteraction = () => {
            if (this.listRef.current) {
                this.listRef.current.recordInteraction();
            }
        };
        this.flashScrollIndicators = () => {
            if (this.listRef.current) {
                this.listRef.current.flashScrollIndicators();
            }
        };
        this.getMetrics = () => {
            if (this.listRef.current) {
                return this.listRef.current.getMetrics();
            }
        };
        /**
         * End of Exposed Methods
         */
        this.onLayout = (event) => {
            this.flatListHeight = event.nativeEvent.layout.height;
            if (this.listRef.current && this.enabledAutoScrollToEnd) {
                this.scrollToEnd();
            }
            // User-defined onLayout event
            const { onLayout } = this.props;
            if (onLayout) {
                onLayout(event);
            }
        };
        this.onContentSizeChange = (width, height) => {
            this.contentHeight = height;
            if (this.enabledAutoScrollToEnd) {
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
            this.enabledAutoScrollToEnd = event.nativeEvent.contentOffset.y + this.props.threshold >= Math.floor(this.contentHeight - this.flatListHeight);
            // User-defined onScroll event
            const { onScroll } = this.props;
            if (onScroll) {
                onScroll(event);
            }
        };
    }
    render() {
        const { contentContainerStyle, threshold, ...restProps } = this.props;
        return <FlatList {...restProps} ref={this.listRef} contentContainerStyle={[styles.contentContainer, contentContainerStyle]} onLayout={this.onLayout} onContentSizeChange={this.onContentSizeChange} onScroll={this.onScroll}/>;
    }
}
AutoScrollFlatList.defaultProps = {
    threshold: 0,
    showScrollToEndIndicator: true,
};
const styles = StyleSheet.create({
    contentContainer: {
        alignItems: "stretch",
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
});
//# sourceMappingURL=index.js.map