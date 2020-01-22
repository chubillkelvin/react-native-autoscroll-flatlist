# Example App for react-native-autoscroll-flatlist

![demo](https://github.com/RageBill/react-native-autoscroll-flatlist/blob/master/demo/autoscroll.gif?raw=true)

This example was generated initially using the command from the [official RN docs](https://facebook.github.io/react-native/docs/getting-started):

```
npx react-native init AwesomeTSProject --template react-native-template-typescript
```

# How to use

Run `yarn install` under this current directory where this README.md sits. This will automatically install the ios pods for you.

If you have any trouble configuring `android` or `ios`, please refer to the official guides.

You can then run

```
yarn ios
```

to test the project in an iOS emulator; or run

```
yarn android
```

to test the project in an Android emulator (you may need to manually start the Android emulator first).

# Properties

This component extends the official [`FlatListProps`](https://facebook.github.io/react-native/docs/flatlist) with the following additional props:

| Prop                     | Type                                                                                                         | Required | Default value | Description                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------ | -------- | ------------- | --------------------------------------------------------------------------------- |
| threshold                | number                                                                                                       | No       | 0             | Distance from end of list to enable auto-scrolling.                               |
| showScrollToEndIndicator | boolean                                                                                                      | No       | true          | Whether to show an indicator to scroll to end.                                    |
| showNewMessageAlert      | boolean                                                                                                      | No       | true          | Whether to show new message alert when auto-scrolling is temporarily disabled.    |
| newMessageAlertRenderer  | (newMessageCount: number, translateY?: Animated.Value) => React.ComponentType<any> &#124; React.ReactElement | No       | true          | The component that indicates number of new messages. Best with position absolute. |
| indicatorContainerStyle  | StyleProp<ViewStyle>                                                                                         | No       | see code      | The style for container of the indicator. Best with position absolute.            |
| indicatorComponent       | React.ComponentType<any> &#124; React.ReactElement &#124; null                                               | No       | see code      | The indicator itself. There is a default provided. See code for details.          |

# Troubleshoot

Q: I have an error running the Android app!

A: Try to run

```
yarn jetify
```

and then go into the `example/android` directory to run

```
./gradlew clean
```

Now, you can try again and see if the Android app works now!
