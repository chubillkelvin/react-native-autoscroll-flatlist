# react-native-autoscroll-flatlist

[![react-native-autoscroll-flatlist is released under the MIT license.](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/RageBill/react-native-autoscroll-flatlist/blob/master/LICENSE)
[![build status for react-native-autoscroll-flatlist](https://travis-ci.org/RageBill/react-native-autoscroll-flatlist.svg?branch=master)](https://travis-ci.org/RageBill/react-native-autoscroll-flatlist)

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

This component extends the official [`FlatListProps`](https://facebook.github.io/react-native/docs/flatlist) with the following additional props:

| Prop        | Type            | Required | Default value | Description                                        |
| ----------- | --------------- | -------- | ------------- | -------------------------------------------------- |
| threshold   | number          | No       | 0             | Distance from end of list to enable auto-scrolling |
| flatListRef | React.RefObject | No       | undefined     | `ref` of the actual `<FlatList>` component         |

Note that the original `ref` prop refers to the wrapper component's ref.

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
    threshold={20}
    data={myData}
    renderItem={({item, index}) => <YourComponent item={item} index={index} />}
    keyExtractor={item => item.id}
/>
```
