/**
 * Additional dependencies must be installed and
 * additional configuration to AwesomeProject is also required.
 * See README.md in Root Directory.
 * @format
 * @flow strict-local
 */

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { IssuesScreen, AddIssueScreen, BlacklistScreen } from "./IssueList.js";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";

/**
 * Q5 - Screen Navigation
 */
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Issues"
      screenOptions={{
        tabBarStyle: { backgroundColor: "#CBDCEB" },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Issues"
        component={IssuesScreen}
        options={{
          tabBarLabel: "Issues",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="format-list-bulleted"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddIssueScreen}
        options={{
          tabBarLabel: "Add",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="plus-circle"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Blacklist"
        component={BlacklistScreen}
        options={{
          tabBarLabel: "Blacklist",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-off"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// App rewritten as function component
export default function App() {
  return (
    <NavigationContainer>
      <Tabs />
    </NavigationContainer>
  );
}
