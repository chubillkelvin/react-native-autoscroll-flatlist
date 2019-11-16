# Example App for react-native-autoscroll-flatlist

![demo](../demo.gif)

This example is generated using the command from the [official RN docs](https://facebook.github.io/react-native/docs/getting-started):

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

to test the project in an Android emulator (you need to manually start the Android emulator first).

# Properties

This component extends the official [`FlatListProps`](https://facebook.github.io/react-native/docs/flatlist) with the following additional props:

| Prop      | Type   | Required | Default value | Description                                        |
| --------- | ------ | -------- | ------------- | -------------------------------------------------- |
| threshold | number | No       | 0             | Distance from end of list to enable auto-scrolling |

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
