# react-native-autoscroll-flatlist

[![react-native-autoscroll-flatlist is released under the MIT license.](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/RageBill/react-native-autoscroll-flatlist/blob/master/LICENSE)
[![build status for react-native-autoscroll-flatlist](https://travis-ci.org/RageBill/react-native-autoscroll-flatlist.svg?branch=master)](https://travis-ci.org/RageBill/react-native-autoscroll-flatlist)
[![react-native-autoscroll-flatlist's current npm package version](https://badge.fury.io/js/react-native-autoscroll-flatlist.svg)](https://www.npmjs.org/package/react-native-autoscroll-flatlist)

An enhanced version of the original react-native `<FlatList>` component with built-in support for both Javascript and Typescript usage.

This component enables auto-scrolling on new item added to the list - which works like any chat client.

Now supports horizontal `<FlatList>` as well in version `>= 1.6.0`.

# Demo

![demo](https://github.com/RageBill/react-native-autoscroll-flatlist/blob/master/demo/autoscroll.gif?raw=true)

# Features

Auto-scroll is disabled when scrolled away from end of list. There are 3 ways to re-enable auto-scrolling:

- You can manually scroll back to the end of list.

![scroll to end manually](https://github.com/RageBill/react-native-autoscroll-flatlist/blob/master/demo/selfScrollToEnd.gif?raw=true)

- You can tap on the `scrollToEndIndicator` (customizable) shown on the bottom right of the list.

![scroll to end by tapping on scrollToEndIndicator](https://github.com/RageBill/react-native-autoscroll-flatlist/blob/master/demo/scrollToEndIndicator.gif?raw=true)

- You can tap on the `newMessageAlertComponent` (customizable) shown on the top of the list.

![scroll to end by tapping on newMessageAlert](https://github.com/RageBill/react-native-autoscroll-flatlist/blob/master/demo/newMessageAlert.gif?raw=true)

# Installation

```
npm install --save react-native-autoscroll-flatlist
```

or

```
yarn add react-native-autoscroll-flatlist
```

# Example Usage

Import the component with:

```
import {AutoScrollFlatList} from "react-native-autoscroll-flatlist";
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

# Properties

This component extends the official [`FlatListProps`](https://facebook.github.io/react-native/docs/flatlist) with the following additional props:

Please read `src/index.tsx` for more explanations and details.

# Methods

This component extends the official [`FlatList Methods`](https://facebook.github.io/react-native/docs/flatlist) with the following modified / additional methods:

| Method          | Parameters                                     | Description                                                               |
| --------------- | ---------------------------------------------- | ------------------------------------------------------------------------- |
| scrollToEnd     | params: {animated: boolean} = {animated: true} | Set `newItemCount` to 0 and then trigger `scrollToOffset` to end of page. |
| isAutoScrolling |                                                | Returns whether auto-scrolling (boolean) is in effect.                    |

# FAQ for usage on react-native-web

There are certain caveats for usage on react-native-web:

Q: My page keeps expanding in height and the autoscroll function is not being triggered. How do I fix this?

A: For usage in react-native, usually add a flex property such as `flex: 1` to the container would be sufficient to get FlatList working.
However, when it comes to react-native-web, you will have to explicitly set the height of the container such that it will not keep expanding.
To do so, a simple fix would be to add 
```javascript
height: Dimensions.get("window").height
``` 
 to the container style (depending on your use cases).

# TODOs

1. Add support for inverted orientation.

2. Add example for landscape usage.
