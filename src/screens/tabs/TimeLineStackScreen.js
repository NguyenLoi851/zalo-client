import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TimeLineScreen from "../TimeLineScreen";
import PostScreen from "../PostScreen";
import SearchScreen from "../SearchScreen"
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import CreatePost from "../CreatePost";
import EditPost from "../EditPost";
import NoConnectionScreen from "../NoConnectionScreen";
import ProfileScreen from "../ProfileScreen";
import ProfileEditScreen from "../ProfileEditScreen";
import ViewProfileScreen from "../ViewProfileScreen";
import ProfileOptionScreen from "../ProfileOptionScreen";
import PersonalInformationScreen from "../PesonalInformationScreen";
import ViewProfileOptionScreen from "../ViewProfileOptionScreen";
import ConversationScreen from "../ConversationScreen";
import ConversationOptionScreen from "../ConversationOptionScreen";

const TimeLineStack = createNativeStackNavigator();

export default function TimeLineStackScreen({ route, navigation }) {
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const hideScreens = [
      "PostScreen",
      "CreatePost",
      "ProfileScreen",
      "CreatePost",
      "ChangePasswordScreen",
      "ProfileOptionScreen",
      "ProfileEditScreen",
      "ViewProfileScreen",
      "PersonalInformationScreen",
      "NoConnectionScreen",
      "ViewProfileOptionScreen",
      "ConversationScreen",
      "ConversationOption",
    ]
    if (hideScreens.includes(routeName)) {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: null } });
    }
  }, [navigation, route]);
  return (
    <TimeLineStack.Navigator
      screenOptions={{
        headerShown: false,
      }}

    >
      <TimeLineStack.Screen name="TimeLineScreen" component={TimeLineScreen} />
      <TimeLineStack.Screen name="PostScreen" component={PostScreen} />
      <TimeLineStack.Screen name="CreatePost" component={CreatePost} />
      <TimeLineStack.Screen name="EditPost" component={EditPost} />
      <TimeLineStack.Screen name="NoConnectionScreen" component={NoConnectionScreen} />
      <TimeLineStack.Screen name="SearchScreen" component={SearchScreen} options={{ animation: 'none' }} />
      <TimeLineStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <TimeLineStack.Screen
        name="ProfileEditScreen"
        component={ProfileEditScreen}
      />
      <TimeLineStack.Screen
        name="ViewProfileScreen"
        component={ViewProfileScreen}
      />
      <TimeLineStack.Screen
        name="ProfileOptionScreen"
        component={ProfileOptionScreen}
      />
      <TimeLineStack.Screen
        name="PersonalInformationScreen"
        component={PersonalInformationScreen}
      />
      <TimeLineStack.Screen
        name="ViewProfileOptionScreen"
        component={ViewProfileOptionScreen}
      />
      <TimeLineStack.Screen
        name="ConversationScreen"
        component={ConversationScreen}
      />
      <TimeLineStack.Screen
        name="ConversationOption"
        component={ConversationOptionScreen}
      />
    </TimeLineStack.Navigator>
  );
}
