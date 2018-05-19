/* @flow */

import * as React from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import { View, Text } from 'react-native'

export default class ChapelSpeakers extends React.Component {
  static title = "Chapel Speakers"
  static backgroundColor = '#f44336'
  static appbarElevation = 0

  render() {
    return (
      <View style={styles.main}>
        <Text style={styles.text}>
          Wishful, but I admire your optimism...
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontWeight: "bold"
  }
});