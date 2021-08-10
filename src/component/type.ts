import type React from "react";
import type {Animated, FlatListProps, StyleProp, TextStyle, ViewStyle} from "react-native";
import type {Props as TriangleProps} from "./Triangle";

export interface Props<T> extends FlatListProps<T> {
    /**
     * Distance from end of list to enable auto-scrolling.
     * Default is 0.
     */
    threshold: number;

    /**
     * Whether to show an indicator to scroll to end.
     * Default is true.
     */
    showScrollToEndIndicator: boolean;

    /**
     * Whether to show an alert on top when auto-scrolling is temporarily disabled.
     * Default is true.
     */
    showNewItemAlert: boolean;

    /**
     * The style for container of the scrollToEndIndicator. Best used with position: "absolute".
     * Default is styles.scrollToEndIndicator.
     */
    indicatorContainerStyle?: StyleProp<ViewStyle>;

    /**
     * The component for scrollToEndIndicator.
     * A default component is provided.
     */
    indicatorComponent?: React.ComponentType<any> | React.ReactElement | null;

    /**
     * This changes the wordings of the default newItemAlertMessage.
     * @param newItemCount - number of item since auto-scrolling is temporarily disabled.
     * Note: Will be overridden if newItemAlertRenderer is set.
     */
    newItemAlertMessage?: (newItemCount: number) => string;

    /**
     * This applies additional ViewStyle to the <Animated.View> that wraps the default newItemAlert.
     * Note: Will be overridden if newItemAlertRenderer is set.
     */
    newItemAlertContainerStyle?: StyleProp<ViewStyle>;

    /**
     * This applies additional TextStyle to the <Text> that wraps the newItemAlertMessage.
     * Note: Will be overridden if newItemAlertRenderer is set.
     */
    newItemAlertTextStyle?: StyleProp<TextStyle>;

    /**
     * The component that indicates number of new messages. Best with position absolute.
     * A default renderer is provided.
     *
     * @param newItemCount - number of item since auto-scrolling is temporarily disabled.
     * @param translateY - the Animated Value for positioning the alert which slides in from top.
     */
    newItemAlertRenderer?: (newItemCount: number, translateY: Animated.Value) => React.ComponentType<any> | React.ReactElement;

    /**
     * This returns a filtered data array which is then used to count the newItemCount.
     *
     * @param data - the original data props supplied to the list.
     */
    filteredDataForNewItemCount?: (data: readonly T[]) => readonly T[];

    /**
     * This controls the direction of the triangle shown when using the default indicator component.
     */
    triangleDirection?: TriangleProps["direction"];

    /**
     * This is an extra condition to check if auto-scrolling is disabled.
     * When false, auto-scrolling will not happen.
     */
    autoScrollDisabled?: boolean;
}
