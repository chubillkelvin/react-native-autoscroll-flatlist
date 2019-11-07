# react-native-autoscroll-flatlist

An enhanced version of the original react-native `<FlatList>` component with built-in support for both Javascript and Typescript usage.

This component enables auto-scrolling on new item added to the list - which works like any chat client.

Note: only work for vertical orientation for now.

# Demo

![demo](https://github.com/RageBill/react-native-autoscroll-flatlist/blob/master/demo.gif?raw=true)

# Installation

```
npm install --save react-native-autoscroll-flatlist
```

or

```
yarn add react-native-autoscroll-flatlist
```

# Properties

This component extends the official [`FlatListProps`](https://facebook.github.io/react-native/docs/flatlist) with an additional prop of `flatListRef`.

Note that the `ref` you get will be the wrapper component's ref.

If you wish to get the actual ref of the `<FlatList>` component inside, please use `flatListRef`.

# Example Usage

Import the component with:

```
import AutoScrollFlatList from "react-native-autoscroll-flatlist";
```

and simply use it like an ordinary `<FlatList>`, for example:

```
<AutoScrollFlatList
    flatListRef={this.myRef}
    data={myData}
    renderItem={({item, index}) => <YourComponent item={item} index={index} />}
    keyExtractor={item => item.id}
/>
```
