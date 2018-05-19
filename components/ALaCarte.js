/* @flow */

import * as React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import {
  TabViewAnimated,
  TabBar,
  TabViewPagerScroll,
  SceneMap,
} from 'react-native-tab-view';
import Menu from './Menu'

import type { Route, NavigationState } from 'react-native-tab-view/types';

type State = NavigationState<
  Route<{
    key: string,
    title: string,
  }>
>;

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const pad = (n) => n < 10 ? `0${n}` : n
const formattedDate = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
const today = new Date()
const tomorrow = new Date()
tomorrow.setDate(today.getDate() + 1)


export default class NativeDriverExample extends React.Component<*, State> {
  static title = 'A la Carte';
  static backgroundColor = '#f44336';
  static appbarElevation = 0;

  state = {
    index: 0,
    routes: [
      { key: 'today', title: 'Today' },
      { key: 'tomorrow', title: 'Tomorrow' }
    ],
  };

  _handleIndexChange = index =>
    this.setState({
      index,
    });

  _renderHeader = props => (
    <TabBar {...props} style={styles.tabbar} labelStyle={styles.label} />
  );

  _renderScene = SceneMap({
    today: () => <Menu day={formattedDate(today)} even={true} />,
    tomorrow: () => <Menu day={formattedDate(tomorrow)} even={false} />
  })

  _renderPager = props => <TabViewPagerScroll {...props} />;

  render() {
    return (
      <TabViewAnimated
        style={[styles.container, this.props.style]}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        renderPager={this._renderPager}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
        useNativeDriver
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: '#f44336',
  },
  label: {
    color: '#fff',
    fontWeight: '400',
  },
});