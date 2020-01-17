# react-native-autoscroll-flatlist

[![react-native-autoscroll-flatlist is released under the MIT license.](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/RageBill/react-native-autoscroll-flatlist/blob/master/LICENSE)
[![build status for react-native-autoscroll-flatlist](https://travis-ci.org/RageBill/react-native-autoscroll-flatlist.svg?branch=master)](https://travis-ci.org/RageBill/react-native-autoscroll-flatlist)

An enhanced version of the original react-native `<FlatList>` component with built-in support for both Javascript and Typescript usage.

This component enables auto-scrolling on new item added to the list - which works like any chat client.

Now supports horizontal `<FlatList>` as well in version `>= 1.6.0`.

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

| Prop                     | Type                                               | Required | Default value | Description                                                                   |
| ------------------------ | -------------------------------------------------- | -------- | ------------- | ----------------------------------------------------------------------------- |
| threshold                | number                                             | No       | 0             | Distance from end of list to enable auto-scrolling.                            |
| showScrollToEndIndicator | boolean                                            | No       | true          | Whether to show an indicator to scroll to end.                                 |
| indicatorContainerStyle  | StyleProp<ViewStyle>                               | No       | see code      | The style for container of the indicator. Best to use with position absolute. |
| indicatorComponent       | React.ComponentType<any>, React.ReactElement, null | No       | see code      | The indicator itself. There is a default provided. See code for details.      |

# Example Usage

Import the component with:

```
import AutoScrollFlatList from "react-native-autoscroll-flatlist";
```

and simply use it like an ordinary `<FlatList>`, for example:

```
<AutoScrollFlatList
    ref={this.myRef}
    threshold={20}
    data={myData}
    renderItem={({item, index}) => <YourComponent item={item} index={index} />}
    keyExtractor={item => item.id}
/>
```

You can check out the `example` folder for further details.
