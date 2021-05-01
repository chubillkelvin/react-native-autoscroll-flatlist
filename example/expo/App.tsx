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
import {SafeAreaView, StyleSheet, View, Text, Dimensions} from "react-native";
import {Colors} from "./Colors";
import {AutoScrollFlatList} from "react-native-autoscroll-flatlist";

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

    constructor(props: Props) {
        super(props);
        this.state = {
            messages: [],
        };
    }

    // Automatically generate messages on screen
    componentDidMount() {
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

    renderMessage = ({item}: {item: Message}) => {
        return (
            <View style={[styles.messageContainer, item.isSelf && styles.messageSelf]}>
                <Text>{item.isSelf ? "Me" : "Someone"}</Text>
                <View style={styles.grayContent} />
                <View style={styles.grayContent} />
                <View style={styles.grayContent} />
            </View>
        );
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>react-native-autoscroll-flatlist</Text>
                </View>
                <AutoScrollFlatList ref={this.ref} data={this.state.messages} renderItem={this.renderMessage} keyExtractor={(item) => item.id} style={styles.flatList} />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // ref: https://stackoverflow.com/questions/47976358/how-to-make-react-native-web-full-height
        height: Dimensions.get("window").height,
        maxHeight: Dimensions.get("window").height,
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
        width: "80%",
        minHeight: 65,
        margin: 8,
        padding: 8,
        justifyContent: "space-between",
    },
    messageSelf: {
        alignSelf: "flex-end",
        backgroundColor: Colors.LIGHT_BLUE,
        alignItems: "flex-end",
    },
    grayContent: {
        height: 6,
        width: "100%",
        backgroundColor: Colors.GAINSBORO,
        borderRadius: 10,
    },
});
