import Expo from 'expo';
import * as React from 'react';
import {
	ImageBackground,
	DrawerLayoutAndroid,
	AsyncStorage,
	Platform,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import TabbedMenu from './components/TabbedMenu'
import Whoswho from './components/Whoswho'
import ChapelSpeakers from './components/ChapelSpeakers'

const PERSISTENCE_KEY = 'index_persistence';

const EXAMPLE_COMPONENTS = [
	TabbedMenu,
	Whoswho,
	ChapelSpeakers
];

type State = {
	title: string,
	index: number,
	restoring: boolean,
};

export default class ExampleList extends React.Component<{}, State> {
	state = {
		title: 'Wheat Free',
		index: 0,
		restoring: false,
	};

	componentDidMount() {
		if (process.env.NODE_ENV !== 'production') {
			this._restoreNavigationState();
		}
	}

	_persistNavigationState = async (currentIndex: number) => {
		if (process.env.NODE_ENV !== 'production') {
			await AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(currentIndex));
		}
	};

	_restoreNavigationState = async () => {
		this.setState({
			restoring: true,
		});

		const savedIndexString = await AsyncStorage.getItem(PERSISTENCE_KEY);

		try {
			const savedIndex = JSON.parse(savedIndexString);
			if (typeof savedIndex === 'number' && !isNaN(savedIndex)) {
				this.setState({
					index: savedIndex,
				});
			}
		} catch (e) {
			// ignore
		}

		this.setState({
			restoring: false,
		});
	};

	_handleNavigate = index => {
		this.setState({
			index,
		});
		this._persistNavigationState(index);
	};

	_handleNavigateBack = () => {
		this._handleNavigate(-1);
	};

	_drawerMenu = () => {
		return <View>
			<View style={{height: 150}}>
			<ImageBackground resizeMode='cover' style={{
				width: "100%",
				height: "100%",
				flex: 1
			}} source={require("./assets/menuheader.png")}/>
			</View>
			<ScrollView>{EXAMPLE_COMPONENTS.map(this._renderItem)}</ScrollView>
		</View>
	}
	_renderItem = (component, i) => {
		return (
			<TouchableOpacity
				key={i}
				style={styles.touchable}
				onPress={() => {
					this._handleNavigate(i)
					this._closeDrawer()
				}}
			>
				<Text style={styles.item}>
					{i + 1}. {component.title}
				</Text>
			</TouchableOpacity>
		);
	}
	_openDrawer() {
		this.refs['DRAWER'].openDrawer()
	}
	_closeDrawer() {
		this.refs['DRAWER'].closeDrawer()
	}

	render() {
		if (this.state.restoring) {
			return null;
		}

		const { index } = this.state;

		const ExampleComponent = EXAMPLE_COMPONENTS[index] || null;
		const backgroundColor =
			ExampleComponent && ExampleComponent.backgroundColor
				? ExampleComponent.backgroundColor
				: '#111';
		const tintColor =
			ExampleComponent && ExampleComponent.tintColor
				? ExampleComponent.tintColor
				: 'white';
		const appbarElevation =
			ExampleComponent && Number.isFinite(ExampleComponent.appbarElevation)
				? ExampleComponent.appbarElevation
				: 4;
		const statusBarStyle =
			ExampleComponent && ExampleComponent.statusBarStyle
				? ExampleComponent.statusBarStyle
				: 'light-content';
		const borderBottomWidth =
			Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0;



		return (
			<DrawerLayoutAndroid
				ref={'DRAWER'}
				drawerWidth={300}
				drawerPosition={DrawerLayoutAndroid.positions.Left}
				renderNavigationView={this._drawerMenu}>
				<View style={styles.container}>
					<StatusBar
						barStyle={
							/* $FlowFixMe */
							Platform.OS === 'ios' ? statusBarStyle : 'light-content'
						}
					/>
					<Expo.KeepAwake />
					<View
						style={[
							styles.statusbar,
							backgroundColor ? { backgroundColor } : null,
						]}
					/>
					<View
						style={[
							styles.appbar,
							backgroundColor ? { backgroundColor } : null,
							appbarElevation
								? { elevation: appbarElevation, borderBottomWidth }
								: null,
						]}
					>
						{/* {index > -1 ? ( */}
							<TouchableOpacity
								style={styles.button}
								onPress={this._openDrawer.bind(this)}
							>
								<Ionicons
									name={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
									size={24}
									color={tintColor}
								/>
							</TouchableOpacity>
						{/* ) : null} */}
						<Text style={[styles.title, tintColor ? { color: tintColor } : null]}>
							{index > -1 ? EXAMPLE_COMPONENTS[index].title : this.state.title}
						</Text>
						{index > -1 ? <View style={styles.button} /> : null}
					</View>
					{index === -1 ? (
						<ScrollView>{EXAMPLE_COMPONENTS.map(this._renderItem)}</ScrollView>
					) : ExampleComponent ? (
						<ExampleComponent />
					) : null}
				</View>
			</DrawerLayoutAndroid>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#eceff1',
	},
	statusbar: {
		height: Platform.OS === 'ios' ? 20 : 25,
	},
	appbar: {
		flexDirection: 'row',
		alignItems: 'center',
		height: Platform.OS === 'ios' ? 44 : 56,
		borderBottomColor: 'rgba(0, 0, 0, 0.1)',
	},
	title: {
		flex: 1,
		margin: 16,
		textAlign: Platform.OS === 'ios' ? 'center' : 'left',
		fontSize: 18,
		color: '#fff',
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		width: 56,
		padding: Platform.OS === 'ios' ? 12 : 16,
	},
	touchable: {
		padding: 16,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0, 0, 0, .06)',
	},
	item: {
		fontSize: 16,
		color: '#333',
	},
});

Expo.registerRootComponent(ExampleList);