import React from 'react';
import { StyleSheet, ActivityIndicator, Button, View, Modal, Text, Image, SectionList, TouchableOpacity } from 'react-native';

const url = "https://legacy.cafebonappetit.com/api/2/menus?cafe=339&date="
const pad = (n) => n < 10 ? `0${n}` : n
const dayUrl = (day) => url + `${day.getFullYear()}-${pad(day.getMonth()+1)}-${pad(day.getDate())}`

const parseBonAppetit = (disasterJson) => disasterJson.days.map(day => {
	const dayObj = {
		date: day.date,
		daypartSections: []
	}
	const daypartMap = {}
	const injectDaypart = (dp) => {
		daypartMap[dp] = dayObj.daypartSections.length
		dayObj.daypartSections.push({
			title: dp,
			data: []
		})
	}
	const injectMenuItem = (item, partOfDay) => {
		if (!daypartMap.hasOwnProperty(partOfDay))
			injectDaypart(partOfDay)
		dayObj.daypartSections[daypartMap[partOfDay]].data.push(item)
	}
	const dp = day.cafes[339].dayparts[0]
	dp.forEach(p => {
		p.stations.forEach(station => {
			const partOfDay = p.label
			station.items.forEach(item => {
				injectMenuItem({
					"name": disasterJson.items[item].label,
					"meta": disasterJson.items[item].cor_icon
				}, partOfDay)
			})
		});
	})
	return dayObj
})


export default class App extends React.Component {
	state = {
		modalVisible: false,
		menu: {
			breakfast: []
		},
		isLoading: true,
		error: false,
		url: "",
	}

	refreshMenu(daysInFuture = 0) {
		const d = new Date()
		d.setDate(d.getDate() + daysInFuture)
		const url = dayUrl(d)
		this.setState({url: url})
		fetch("http://192.168.0.115:3000?url=" + encodeURIComponent(url)).then((response) => {
			return response.json()
		}).then((responseJson) => {
			this.setState({
				menu:parseBonAppetit(responseJson),
				isLoading: false
			})
		}).catch(error => {
			console.log(error)
			this.setState({error: error, isLoading: false})
		})
	}

	componentDidMount() {
		this.setState({isLoading: true})
		this.refreshMenu()
	}

	render() {
		let i = 0
		return (
			<View style={styles.container}>
				<View>
					<TouchableOpacity style={styles.button}
						onPress={() => this.setState({modalVisible: true})}
						disabled={this.state.isLoading || this.state.error !== false}>
						<Image source={require("./assets/food.jpg")}/>
					</TouchableOpacity>
				</View>
				<Button
					onPress={() => this.refreshMenu(1)}
					title={"Refresh Menu"}
					disabled={this.state.isLoading} />
				{this.state.isLoading ? <ActivityIndicator/> : null}
				<Text>{this.state.url}</Text>
				{this.state.error !== false ? <Text>{JSON.stringify(this.state.error.message)}</Text> : null}
				<Modal
					animationType="slide"
					transparent={false}
					visible={this.state.modalVisible}
					onRequestClose={() => {}}>
					<View style={{flex: 1}}>
						<View style={{flex: 1}}>
							<Text>A la Carte</Text>
						</View>
						<View style={{flex: 8}}>
							{this.state.menu.length > 0 ? <SectionList
								renderItem={({ item, index, section }) => <Text key={index} style={{ fontSize: 18 }}>{item.name}</Text>}
								renderSectionHeader={({ section: { title } }) => <Text style={{ fontWeight: 'bold', fontSize: 30 }}>{title}</Text>}
								sections={this.state.menu[0].daypartSections}
								keyExtractor={(item, index) => item + index}
								/> : null
							}
						</View>
						<View style={{flex: 1}}>
							<Button
								onPress={() => this.setState({modalVisible: false})}
								title={"Hide Menu"} />
						</View>
					</View>
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	button: {
	  backgroundColor: '#859a9b',
	  borderRadius: 20,
	  padding: 10,
	  marginBottom: 20,
	  shadowColor: '#303838',
	  shadowOffset: { width: 0, height: 5 },
	  shadowRadius: 10,
	  shadowOpacity: 0.35,
	},
  });