import React from "react";
import {FlatList, FlatListProps, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, StyleProp, StyleSheet, Text, TouchableWithoutFeedback, View, ViewStyle} from "react-native";
import Triangle from "./Triangle";

/**
 * An enhanced React Native <FlatList> component to provide auto-scrolling functionality.
 * Auto-scrolling will only be enabled if:
 * 1. the scrollTop is at the end of the list; or
 * 2. the user has scrolled back and/or past the end of the list
 * This is to prevent auto-scrolling from annoying the user when the user tries to scroll and look for something in the list.
 */

interface Props<T> extends FlatListProps<T> {
    threshold: number;
    showScrollToEndIndicator: boolean;
    showNewMessageAlert: boolean;
    newMessageAlertRenderer?: (newMessageCount: number) => React.ComponentType<any> | React.ReactElement;
    indicatorContainerStyle?: StyleProp<ViewStyle>;
    indicatorComponent?: React.ComponentType<any> | React.ReactElement | null;
}

interface State {
    enabledAutoScrollToEnd: boolean;
    newMessageCount: number;
}

export default class AutoScrollFlatList<T> extends React.PureComponent<Props<T>, State> {
    static defaultProps: Pick<Props<any>, "threshold" | "showScrollToEndIndicator" | "showNewMessageAlert"> = {
        threshold: 0,
        showScrollToEndIndicator: true,
        showNewMessageAlert: true,
    };

    constructor(props: Props<T>) {
        super(props);
        this.state = {
            enabledAutoScrollToEnd: true,
            newMessageCount: 0,
        };
    }

    private readonly listRef: React.RefObject<FlatList<T>> = React.createRef();
    private flatListHeight: number = 0;
    private contentHeight: number = 0;
    private scrollTop: number = 0;

    componentDidUpdate(prevProps: Readonly<Props<T>>, prevState: Readonly<State>) {
        const {data} = this.props;
        const {enabledAutoScrollToEnd, newMessageCount} = this.state;
        if (!enabledAutoScrollToEnd && data && prevProps.data && data.length !== prevProps.data.length) {
            this.setState({newMessageCount: prevState.newMessageCount + data.length - prevProps.data.length});
        } else if (enabledAutoScrollToEnd && newMessageCount) {
            this.setState({newMessageCount: 0});
        }
    }

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
    };

    private renderDefaultNewMessageAlertComponent = (newMessageCount: number) => (
        <View style={styles.newMessageAlert}>
            <Text style={styles.alertMessage}>{`${newMessageCount} new message${newMessageCount > 1 ? "s" : ""}`}</Text>
            <Triangle size={4} />
        </View>
    );

    private renderDefaultIndicatorComponent = () => (
        <View style={this.props.indicatorContainerStyle ?? styles.scrollToEndIndicator}>
            <Triangle />
        </View>
    );

    render() {
        const {contentContainerStyle, threshold, showScrollToEndIndicator, showNewMessageAlert, newMessageAlertRenderer, indicatorContainerStyle, indicatorComponent, ...restProps} = this.props;
        const {enabledAutoScrollToEnd, newMessageCount} = this.state;
        return (
            <View style={styles.container}>
                <FlatList {...restProps} ref={this.listRef} contentContainerStyle={contentContainerStyle ?? styles.contentContainer} onLayout={this.onLayout} onContentSizeChange={this.onContentSizeChange} onScroll={this.onScroll} />
                {showNewMessageAlert && !enabledAutoScrollToEnd && newMessageCount > 0 && (
                    <TouchableWithoutFeedback onPress={() => this.scrollToEnd()}>{newMessageAlertRenderer ? newMessageAlertRenderer(newMessageCount) : this.renderDefaultNewMessageAlertComponent(newMessageCount)}</TouchableWithoutFeedback>
                )}
                {showScrollToEndIndicator && !enabledAutoScrollToEnd && <TouchableWithoutFeedback onPress={() => this.scrollToEnd()}>{indicatorComponent ?? this.renderDefaultIndicatorComponent()}</TouchableWithoutFeedback>}
            </View>
        );
    }
}

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
