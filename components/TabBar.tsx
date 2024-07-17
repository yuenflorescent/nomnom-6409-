import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react';
import { AntDesign } from '@expo/vector-icons';

function TabBar({ state, descriptors, navigation }) {

  const primarycolour = '#ed800c'
  const greycolour = 'grey'

  const icons = {
    home: (props) => <AntDesign name="home" size={26} color={greycolour} {...props}/>,
    post: (props) => <AntDesign name="plussquare" size={26} color={greycolour} {...props}/>,
    profile: (props) => <AntDesign name="user" size={26} color={greycolour} {...props}/>,

  };

    // Get the current route name
    const currentRouteName = state.routes[state.index].name;

    // Check if the current route is 'postdetails'
    if (currentRouteName === 'postdetails' || currentRouteName === 'bookmarks') {
      return null;
    }
  
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        if (route.name === 'postdetails') {
          return null; // Skip rendering PostDetails tab
        }
        if (route.name === 'bookmarks') {
          return null; // Skip rendering PostDetails tab
        }
        
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
          key = {route.name}
          style = {styles.tabBarItem}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            {
              icons[route.name]({
                color: isFocused ? primarycolour : greycolour
              })
            }

            <Text style={{
              color: isFocused ? primarycolour : greycolour,
              fontSize: 10,
              fontWeight:'bold'
              }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    paddingVertical: 8, 
    borderRadius: 25,
    borderCurve: 'continuous',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 20}, 
    shadowOpacity: 0.5,
    shadowRadius: 200,
    elevation: 10,
  },
  tabBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
export default TabBar