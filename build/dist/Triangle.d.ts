import React from "react";
interface Props {
    size: number;
    color: string;
    direction: "up" | "down" | "left" | "right";
}
export default class Triangle extends React.PureComponent<Props> {
    static defaultProps: Pick<Props, "size" | "color" | "direction">;
    render(): JSX.Element;
}
export {};
