/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from "react";
import {Dimensions, StyleSheet, Text, View} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import {OrientationLock} from "expo-screen-orientation";
import {AutoScrollFlatList} from "react-native-autoscroll-flatlist";
import {Colors} from "./Colors";

interface Message {
    id: string;
    isSelf: boolean;
}

interface Props {}

interface State {
    messages: Message[];
}

export default class App extends React.PureComponent<Props, State> {
    private readonly ref: React.RefObject<AutoScrollFlatList<Message>> = React.createRef();
    private timer: NodeJS.Timer | null = null;
    private isInverted: boolean = false;

    constructor(props: Props) {
        super(props);
        this.state = {
            messages: [],
        };
    }

    // Automatically generate messages on screen
    async componentDidMount() {
        await ScreenOrientation.lockAsync(OrientationLock.LANDSCAPE_RIGHT);
        this.timer = setInterval(() => {
            const newMessages = [...this.state.messages];
            newMessages.push({
                id: newMessages.length.toString(),
                isSelf: Math.random() < 0.5, // 50% chance the new message will be from self
            });
            this.setState({messages: newMessages});
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer!);
    }

    renderMessage = ({item, index}: {item: Message; index: number}) => {
        const extraHorizontalMargin = this.isInverted ? {marginLeft: 50} : {marginRight: 50};
        return (
            <View style={[styles.messageContainer, item.isSelf && styles.messageSelf, index === this.state.messages.length - 1 && extraHorizontalMargin]}>
                <Text>{item.isSelf ? "Me" : "Someone"}</Text>
                <View style={styles.grayContent} />
                <View style={styles.grayContent} />
                <View style={styles.grayContent} />
                <View style={styles.grayContent} />
                <View style={styles.grayContent} />
                <View style={styles.grayContent} />
                <View style={styles.grayContent} />
            </View>
        );
    };

    render() {
        const extraPadding = {paddingLeft: this.isInverted ? 0 : 34};
        return (
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>react-native-autoscroll-flatlist</Text>
                </View>
                <AutoScrollFlatList inverted={this.isInverted} horizontal ref={this.ref} data={this.state.messages} renderItem={this.renderMessage} keyExtractor={(item) => item.id} style={[styles.flatList, extraPadding]} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // ref: https://stackoverflow.com/questions/47976358/how-to-make-react-native-web-full-height
        width: Dimensions.get("window").width,
        maxWidth: Dimensions.get("window").width,
        backgroundColor: Colors.TEAL_GREEN,
    },
    title: {
        height: 50,
        justifyContent: "center",
    },
    titleText: {
        fontSize: 24,
        textAlign: "center",
        color: Colors.WHITE,
        fontWeight: "bold",
    },
    flatList: {
        backgroundColor: Colors.PALE_GRAY,
    },
    messageContainer: {
        borderRadius: 5,
        backgroundColor: Colors.WHITE,
        height: "60%",
        minWidth: 180,
        margin: 8,
        padding: 8,
        justifyContent: "space-between",
    },
    messageSelf: {
        alignSelf: "flex-end",
        backgroundColor: Colors.LIGHT_BLUE,
    },
    grayContent: {
        height: 6,
        width: "100%",
        backgroundColor: Colors.GAINSBORO,
        borderRadius: 10,
    },
});
