import React from "react";
import { StyleSheet, View } from "react-native";
export default class Triangle extends React.PureComponent {
    render() {
        const { size, color, direction } = this.props;
        const directionMapper = {
            up: "0",
            down: "180deg",
            left: "270deg",
            right: "90deg",
        };
        const borderStyle = {
            borderLeftWidth: size,
            borderRightWidth: size,
            borderBottomWidth: size * 1.5,
            borderBottomColor: color,
            transform: [
                {
                    rotate: directionMapper[direction],
                },
            ],
        };
        return <View style={[styles.triangle, borderStyle]}/>;
    }
}
Triangle.defaultProps = {
    size: 8,
    color: "#000000",
    direction: "down",
};
const styles = StyleSheet.create({
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
    },
});
//# sourceMappingURL=Triangle.js.map