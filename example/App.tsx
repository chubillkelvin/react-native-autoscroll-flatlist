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
import {SafeAreaView, StyleSheet, View, Text, FlatList, TouchableHighlight} from "react-native";
import AutoScrollFlatList from "react-native-autoscroll-flatlist";

enum Colors {
    "#e04836",
    "#f39d41",
    "#8d5924",
    "#5696bc",
    "#2f5168",
}

interface Message {
    id: string;
    content: string;
    color: string;
}

interface Props {}

interface State {
    messages: Message[];
}

export default class App extends React.PureComponent<Props, State> {
    private readonly ref: React.RefObject<FlatList<Message>> = React.createRef();
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
                content: Math.random()
                    .toString(36)
                    .slice(-5),
                color: Colors[Math.floor(Math.random() * Object.keys(Colors).length)],
            });
            this.setState({messages: newMessages});
        }, 500);
    }

    componentWillUnmount() {
        clearInterval(this.timer!);
    }

    scrollToEnd = () => this.ref.current && this.ref.current.scrollToEnd({animated: false});

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>react-native-autoscroll-flatlist</Text>
                </View>
                <AutoScrollFlatList ref={this.ref} data={this.state.messages} renderItem={({item}) => <Text style={[styles.message, {color: item.color}]}>{item.content}</Text>} keyExtractor={item => item.id} style={styles.flatList} />
                <TouchableHighlight style={styles.scrollToEndButton} onPress={this.scrollToEnd}>
                    <Text style={styles.buttonText}>Scroll To End</Text>
                </TouchableHighlight>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2f5168",
    },
    title: {
        height: 40,
    },
    titleText: {
        fontSize: 24,
        textAlign: "center",
        color: "#e04836",
        fontWeight: "bold",
    },
    flatList: {
        backgroundColor: "#ffffff",
    },
    message: {
        fontSize: 24,
    },
    scrollToEndButton: {
        height: 60,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e04836",
    },
    buttonText: {
        fontSize: 24,
    },
});
