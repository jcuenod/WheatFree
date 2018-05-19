/* @flow */

import * as React from 'react'
import { Platform, ImageBackground, ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import Accordion from 'react-native-collapsible/Accordion'

const url = "https://legacy.cafebonappetit.com/api/2/menus?cafe=339&date="
const backgroundImages = {
	even: require("../assets/menu_even.jpg"),
	odd: require("../assets/menu_odd.jpg")
}
const getBackground = (even) => {
	return backgroundImages[even ? "even" : "odd"]
}
const weightedStations = {
	"Sabor": 0,
	"Pan Asian": 1,
	"Classics": 2,
	"Cucina": 3,
	"Breakfast Bar": 4,
	"Sandwich Bar": 5
}
const sortStations = (a, b) => {
	const aWeight = weightedStations.hasOwnProperty(a.title) ? weightedStations[a.title] : 100
	const bWeight = weightedStations.hasOwnProperty(b.title) ? weightedStations[b.title] : 100
	return aWeight - bWeight
}
const unstrong = (name) => {
	return name ? name.replace(/(^<strong>|<\/strong>$)/g, "") : ""
}

const parseBonAppetit = (disasterJson) => {
	const day = disasterJson.days[0]
	//Note that by filtering for specials, we probably don't need to worry about title casing the labels so code above can go
	
	const menuItems = disasterJson.items
	const specials = Object.keys(menuItems).filter(k => menuItems[k].special === 1).map(k => menuItems[k])
	//This method removes the distinction between the different stations by concat-ing at the end
	const mealItems = (mealIndex) => disasterJson.days[0].cafes[339].dayparts[0][mealIndex].stations.reduce((a,v) => a.concat(...v.items), [])
	const reducedMealItems = (items) => {
		return items.map(i => ({
			name: i.label,
			description: i.description,
			station: unstrong(i.station)
		}))
	}

	const meals = disasterJson.days[0].cafes[339].dayparts[0].map((m, index) => {
		const thisMealItems = mealItems(index)
		const theseSpecials = specials.filter(s => thisMealItems.includes(s.id))
		const customItemsObj = reducedMealItems(theseSpecials)
		return {
			name: m.label,
			items: customItemsObj
		}
	})
	for (let i = 0; i < meals.length; i++) {
		if (!meals[i].items.length)
			meals.splice(i, 1)
	}
	
	return {
		date: day.date,
		meals: meals
	}
}

const LoadingScreen = () => (
	<View style={{flex: 1, height: "100%", backgroundColor: "rgba(0,0,0,0.6)", justifyContent:"center", alignContent:"center"}}>
		<ActivityIndicator size={Platform.OS === "ios" ? "large" : 70} />
	</View>
)

export default class Menu extends React.Component {
	state = {
		menu: null,
		// activeAccordionSection: false,
		isLoading: true
	}
	componentDidMount() {
		const dayurl = url + this.props.day
		// const proxyUrl = "http://192.168.0.115:3000?url=" + encodeURIComponent(dayurl)
		fetch(dayurl).then((response) => {
			return response.json()
		}).then((responseJson) => {
			// const menu = parseBonAppetit(responseJson)
			const fakeResponse = require("../assets/menus.json")
			const menu = parseBonAppetit(fakeResponse)
			this.setState({
				menu,
				isLoading: false,
			})
		}).catch(error => {
			console.log(error)
			this.setState({error: error, isLoading: false})
		})
	}
	render() {
		return (
			<ImageBackground resizeMode='cover' style={{
				width: "100%",
				height: "100%",
				flex: 1
			}} source={getBackground(this.props.even)}>
				{this.state.menu ? (
					<ScrollView>
						<View>
							{this.state.menu.meals.map(meal => (
								<View key={meal.name} style={styles.mealRow}>
									<Text style={styles.title}>{meal.name}</Text>
									{meal.items.map((item, i) => (
										<View style={styles.itemHolder} key={i}>
											<Text style={styles.itemName}>{item.name}</Text>
											{item.description ? <Text style={styles.itemDescription}>{item.description}</Text> : null}
											<Text style={styles.itemStation}>{item.station}</Text>
										</View>
									))}
								</View>
							))}
						</View>
					</ScrollView>
				) : <LoadingScreen />}
			</ImageBackground>
		)
	}
}

const styles = StyleSheet.create({
	mealRow: {
		marginVertical: 15,
		marginHorizontal: 10,
		paddingTop: 15,
		paddingBottom: 20,
		paddingHorizontal: 25,
		backgroundColor: 'rgba(0, 0, 0, 0.6)'
	},
	title: {
		color: '#fff',
		fontSize: 35,
		marginVertical: 5,
	},
	itemHolder: {
		marginVertical: 8,
	},
	itemName: {
		color: '#efefef',
		fontFamily: 'Roboto',
		fontWeight: 'bold',
		fontSize: 15,
	},
	itemDescription: {
		color: '#ddd',
		fontSize: 13,
	},
	itemStation: {
		color: '#efefef',
		fontWeight: 'bold',
		fontSize: 10,
	},
});
