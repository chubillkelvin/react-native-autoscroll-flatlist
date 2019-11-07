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
import {SafeAreaView, StyleSheet, View, Text} from "react-native";
import AutoScrollFlatList from "react-native-autoscroll-flatlist";

enum Colors {
    "#e04836",
    "#f39D41",
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

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>react-native-autoscroll-flatlist</Text>
                </View>
                <AutoScrollFlatList data={this.state.messages} renderItem={({item}) => <Text style={[styles.message, {color: item.color}]}>{item.content}</Text>} keyExtractor={item => item.id} style={styles.flatList} />
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
        backgroundColor: "white",
    },
    message: {
        fontSize: 24,
    },
});
