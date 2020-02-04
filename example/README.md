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

Please read `src/index.tsx` for more explanations and details.

# Methods

This component extends the official [`FlatList Methods`](https://facebook.github.io/react-native/docs/flatlist) with the following modified / additional methods:

| Method          | Parameters                                     | Description                                                                                      |
| --------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------ | 
| scrollToEnd     | params: {animated: boolean} = {animated: true} | Set `newMessageCount` (an internal state) to 0 and then trigger `scrollToOffset` to end of page. | 
| isAutoScrolling |                                                | Returns whether auto-scrolling (boolean) is in effect.                                           | 

# Troubleshoot

### Q: I have an error running `yarn prepare` after `yarn install`!

A: Please make sure you have `Xcode` and [`Cocoapods`](https://guides.cocoapods.org/using/getting-started.html) installed properly.

You may temporarily remove this step if you do not have iOS simulator and/or Android simulator installed.

This will not affect working with the code.

### Q: I have an error running the Android app!

A: Try to run

```
yarn jetify
```

and then go into the `example/android` directory to run

```
./gradlew clean
```

Now, you can try again and see if the Android app works now!
