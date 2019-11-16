import React from "react";
import { FlatList, FlatListProps, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
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
declare class AutoScrollFlatList<T> extends React.PureComponent<Props<T>> {
    private flatListHeight;
    private contentHeight;
    private enabledAutoScrollToEnd;
    scrollToEnd: () => void;
    onLayout: (event: LayoutChangeEvent) => void;
    onContentSizeChange: (width: number, height: number) => void;
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    render(): JSX.Element;
}
declare const _default: React.ForwardRefExoticComponent<Pick<ForwardedProps<any>, "style" | "horizontal" | "data" | "threshold" | "ItemSeparatorComponent" | "ListEmptyComponent" | "ListFooterComponent" | "ListFooterComponentStyle" | "ListHeaderComponent" | "ListHeaderComponentStyle" | "columnWrapperStyle" | "keyboardShouldPersistTaps" | "extraData" | "getItemLayout" | "initialNumToRender" | "initialScrollIndex" | "keyExtractor" | "legacyImplementation" | "numColumns" | "onEndReached" | "onEndReachedThreshold" | "onRefresh" | "onViewableItemsChanged" | "refreshing" | "renderItem" | "viewabilityConfig" | "removeClippedSubviews" | "debug" | "disableVirtualization" | "getItem" | "getItemCount" | "inverted" | "listKey" | "maxToRenderPerBatch" | "onLayout" | "onScrollToIndexFailed" | "progressViewOffset" | "renderScrollComponent" | "updateCellsBatchingPeriod" | "viewabilityConfigCallbackPairs" | "windowSize" | "contentContainerStyle" | "invertStickyHeaders" | "keyboardDismissMode" | "onContentSizeChange" | "onScroll" | "onScrollBeginDrag" | "onScrollEndDrag" | "onMomentumScrollEnd" | "onMomentumScrollBegin" | "pagingEnabled" | "scrollEnabled" | "showsHorizontalScrollIndicator" | "showsVerticalScrollIndicator" | "refreshControl" | "snapToAlignment" | "snapToInterval" | "snapToOffsets" | "snapToStart" | "snapToEnd" | "disableIntervalMomentum" | "disableScrollViewPanResponder" | "hitSlop" | "pointerEvents" | "testID" | "nativeID" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityStates" | "accessibilityState" | "accessibilityHint" | "onAccessibilityAction" | "accessibilityComponentType" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityTraits" | "accessibilityViewIsModal" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "alwaysBounceHorizontal" | "alwaysBounceVertical" | "automaticallyAdjustContentInsets" | "bounces" | "bouncesZoom" | "canCancelContentTouches" | "centerContent" | "contentInset" | "contentOffset" | "contentInsetAdjustmentBehavior" | "decelerationRate" | "directionalLockEnabled" | "indicatorStyle" | "maximumZoomScale" | "minimumZoomScale" | "onScrollAnimationEnd" | "pinchGestureEnabled" | "scrollEventThrottle" | "scrollIndicatorInsets" | "scrollsToTop" | "stickyHeaderIndices" | "zoomScale" | "endFillColor" | "scrollPerfTag" | "overScrollMode" | "nestedScrollEnabled"> & React.RefAttributes<FlatList<any>>>;
export default _default;
