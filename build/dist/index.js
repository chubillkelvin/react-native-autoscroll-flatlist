import React from "react";
import { FlatList, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import Triangle from "./Triangle";
export default class AutoScrollFlatList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.listRef = React.createRef();
        this.flatListHeight = 0;
        this.contentHeight = 0;
        this.scrollTop = 0;
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
            if (this.listRef.current && this.state.enabledAutoScrollToEnd) {
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
            if (this.state.enabledAutoScrollToEnd) {
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
            const prevScrollTop = this.scrollTop;
            this.scrollTop = this.props.horizontal ? event.nativeEvent.contentOffset.x : event.nativeEvent.contentOffset.y;
            const isScrollingDown = prevScrollTop <= this.scrollTop;
            const isEndOfList = this.scrollTop + this.props.threshold >= Math.floor(this.contentHeight - this.flatListHeight);
            this.setState({ enabledAutoScrollToEnd: (this.state.enabledAutoScrollToEnd && isScrollingDown) || isEndOfList }, () => {
                // User-defined onScroll event
                const { onScroll } = this.props;
                if (onScroll) {
                    onScroll(event);
                }
            });
        };
        this.renderDefaultNewMessageAlertComponent = (newMessageCount) => (<View style={styles.newMessageAlert}>
            <Text style={styles.alertMessage}>{`${newMessageCount} new message${newMessageCount > 1 ? "s" : ""}`}</Text>
            <Triangle size={4}/>
        </View>);
        this.renderDefaultIndicatorComponent = () => (<View style={this.props.indicatorContainerStyle ?? styles.scrollToEndIndicator}>
            <Triangle />
        </View>);
        this.state = {
            enabledAutoScrollToEnd: true,
            newMessageCount: 0,
        };
    }
    componentDidUpdate(prevProps, prevState) {
        const { data } = this.props;
        const { enabledAutoScrollToEnd, newMessageCount } = this.state;
        if (!enabledAutoScrollToEnd && data && prevProps.data && data.length !== prevProps.data.length) {
            this.setState({ newMessageCount: prevState.newMessageCount + data.length - prevProps.data.length });
        }
        else if (enabledAutoScrollToEnd && newMessageCount) {
            this.setState({ newMessageCount: 0 });
        }
    }
    render() {
        const { contentContainerStyle, threshold, showScrollToEndIndicator, showNewMessageAlert, newMessageAlertComponent, indicatorContainerStyle, indicatorComponent, ...restProps } = this.props;
        const { enabledAutoScrollToEnd, newMessageCount } = this.state;
        return (<View style={styles.container}>
                <FlatList {...restProps} ref={this.listRef} contentContainerStyle={contentContainerStyle ?? styles.contentContainer} onLayout={this.onLayout} onContentSizeChange={this.onContentSizeChange} onScroll={this.onScroll}/>
                {showNewMessageAlert && !enabledAutoScrollToEnd && newMessageCount > 0 && (<TouchableWithoutFeedback onPress={() => this.scrollToEnd()}>{newMessageAlertComponent ? newMessageAlertComponent(newMessageCount) : this.renderDefaultNewMessageAlertComponent(newMessageCount)}</TouchableWithoutFeedback>)}
                {showScrollToEndIndicator && !enabledAutoScrollToEnd && <TouchableWithoutFeedback onPress={() => this.scrollToEnd()}>{indicatorComponent ?? this.renderDefaultIndicatorComponent()}</TouchableWithoutFeedback>}
            </View>);
    }
}
AutoScrollFlatList.defaultProps = {
    threshold: 0,
    showScrollToEndIndicator: true,
    showNewMessageAlert: true,
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        alignItems: "stretch",
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
    scrollToEndIndicator: {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#000000",
        borderRadius: 5,
    },
    newMessageAlert: {
        position: "absolute",
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        top: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#000000",
        paddingVertical: 3,
        paddingHorizontal: 6,
    },
    alertMessage: {
        marginRight: 4,
    },
});
//# sourceMappingURL=index.js.map