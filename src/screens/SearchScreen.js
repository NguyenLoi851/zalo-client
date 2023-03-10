import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import IconBack from "../../assets/arrow-back-outline.svg";
import IconQR from "../../assets/ic_scan_qr_footer.svg";
import IconDown from "../../assets/down.svg";
import IconList from "../../assets/illus_emptystate_list.svg";
import ChatContext from "../components/context/ChatContext";
import Contact from "./components/Contact";
import { Api } from "../api/Api";
import AuthContext from "../components/context/AuthContext";
import { Avatar } from "react-native-elements";
import { TimeUtility } from "../utils/TimeUtility";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
  FlatList,
  Animated,
  Easing,
} from "react-native";
import matchAll from 'string.prototype.matchall';
import { marginRight, style } from "styled-system";

export default function SearchScreen({ navigation }) {
  const BaseURL = "http://13.76.46.159:8000/files/";
  const limitRenderContact = 5;
  const [searchText, setsearchText] = useState("");
  const [people, setPeople] = useState([]);
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const context = React.useContext(AuthContext);
  const chatContext = React.useContext(ChatContext);
  const [more, setMore] = useState(false);
  const updateSearchText = (searchText) => {
    updateRenderContact();
    setsearchText(searchText);
  };

  const pressChat = (chatId, friend, isread) => {
    chatContext.setCurChatId(chatId);
    chatContext.setCurFriendId(friend.id);
    chatContext.setInChat(true);
    if (!isread) {
      chatContext.setNeedUpdateListChat(true);
    }
    navigation.navigate("ConversationScreen", {
      chatId: chatId,
      friend: friend,
      isread: isread,
      from: "ContactScreen",
    });
    // console.log("go to chat screen");
  };

  var Message = (message) => {
    let content = message.content;
    let time = message.time;
    let chatId = message.chatId;
    let userName = message.friend.username;
    let avatarURL = BaseURL + message.friend.avatar.fileName;
    let userId = context.loginState.userId;
    let phonenumber = message.friend.phonenumber;
    let isread = true;
    const index = [...matchAll(content, new RegExp(searchText, "gi"))].map(
      (a) => a.index
    );
    const indexDraw = [];
    for (let i = 0; i < index.length; i++) {
      indexDraw.push(index[i]);
      for (let j = index[i] + 1; j < searchText.length + index[i]; j++) {
        indexDraw.push(j);
      }
    }
    if (message.senderId._id == userId) {
      content = "B???n: " + content;
      for(let i = 0; i<indexDraw.length; i++){
        indexDraw[i] += "B???n: ".length;
      }
    }
    return (
      <TouchableOpacity
        onPress={() => {
          let friend = {
            username: userName,
            avatar: avatarURL,
            id: message.friend._id,
            phonenumber: phonenumber,
          };
          pressChat(chatId, friend, isread);
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.avatars}>
            <Avatar
              rounded
              size={55.5}
              source={{
                uri: avatarURL,
              }}
            />
          </View>
          <View
            style={{
              marginLeft: 12,
              width: "80%",
              borderBottomColor: "#ebeceb",
              borderBottomWidth: 1,
              marginTop: 12,
              paddingBottom: 16,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: isread ? "500" : "700",
                    paddingBottom: 6,
                  }}
                >
                  {userName}
                </Text>
              </View>
              <View style={{ marginLeft: "auto", marginRight: 10 }}>
                <Text
                  style={{
                    textAlign: "right",
                    opacity: isread ? 0.5 : 1,
                    fontSize: 13,
                    fontWeight: isread ? "400" : "500",
                  }}
                >
                  {TimeUtility.getTimeStr(new Date(time))}{" "}
                </Text>
              </View>
            </View>
            <Text
              style={{
                opacity: isread ? 0.5 : 1,
                fontSize: 15,
                maxWidth: "74%",
                fontWeight: isread ? "400" : "500",
              }}
              numberOfLines={1}
            >
              {content.split("").map((x, ind) => (
                <Text
                  style={{ color: indexDraw.includes(ind) ? "blue" : "black" }}
                  key={ind}
                >
                  {x + ""}
                </Text>
              ))}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const getSearch = async () => {
    try {
      accessToken = context.loginState.accessToken;
      let searchedDatas = await Api.searchFriendAndMessage(
        accessToken,
        searchText
      );
      // console.log(searchedDatas.data.data);
      setPeople(searchedDatas.data.data.people);
      setMessages(searchedDatas.data.data.messages);
      setFriends(searchedDatas.data.data.friends);
    } catch (e) {
      // console.log(e);
    }
  };
  let messageList = [];
  for (let i = 0; i < messages.length; i++) {
    messageList.push(
      <TouchableHighlight key={i} style={{ marginTop: 12 }}>
        {Message(messages[i])}
      </TouchableHighlight>
    );
  }

  let friendList = [];
  let nonFriendList = [];
  for (let i = 0; i < people.length; i++) {
    nonFriendList.push(
      <TouchableHighlight key={i} style={{ marginTop: 12 }}>
        <Contact
          data={people[i]}
          isfriend={false}
          searchText={searchText}
          navigation={navigation}
        ></Contact>
      </TouchableHighlight>
    );
  }

  for (let i = 0; i < friends.length; i++) {
    // friends[i].friendStatus = "friend";
    friendList.push(
      <TouchableHighlight key={i} style={{ marginTop: 12 }}>
        <Contact
          data={friends[i]}
          isfriend={true}
          searchText={searchText}
          navigation={navigation}
        ></Contact>
      </TouchableHighlight>
    );
  }

  const [isRenderMessage, setisRenderMessage] = useState(false);
  const [isRenderContact, setisRenderContact] = useState(true);
  const updateRenderMessage = () => {
    setisRenderMessage(true);
    setisRenderContact(false);
  };
  const updateRenderContact = () => {
    setisRenderMessage(false);
    setisRenderContact(true);
  };
  const RenderSearchBar = () => {
    if (searchText === "") {
      return (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Danh s??ch t??m ki???m g???n ????y tr???ng
        </Text>
      );
    } else
      return (
        <View style={styles.barSearch}>
          <View
            style={[
              styles.contactBarSearch,
              { opacity: isRenderContact ? 1 : 0.5 },
            ]}
          >
            <Pressable>
              <Text
                style={{
                  marginLeft: "auto",
                  fontWeight: "600",
                  fontSize: 15,
                  marginBottom: 10,
                }}
                onPress={updateRenderContact}
              >
                LI??N H??? ({friendList.length + nonFriendList.length})
              </Text>
            </Pressable>
          </View>
          <View
            style={[
              styles.messageBarSearch,
              { opacity: isRenderMessage ? 1 : 0.5 },
            ]}
          >
            <Pressable>
              <Text
                style={{
                  marginLeft: "auto",
                  fontWeight: "600",
                  fontSize: 15,
                  marginBottom: 10,
                }}
                onPress={updateRenderMessage}
              >
                TIN NH???N ({messages.length})
              </Text>
            </Pressable>
          </View>
        </View>
      );
  };
  useEffect(() => {
    if (searchText === "") {
      setisRenderContact(false);
      setisRenderMessage(false);
    } else {
      getSearch();
      // setMore(false);
    }
  }, [searchText]);

  const RenderMore = () => {
    return (
      <View>
        <Pressable
          style={{
            flex: 1,
            flexDirection: "row",
            borderColor: "#dedede",
            borderWidth: 0.5,
            alignItems: "center",
            justifyContent: "center",
            height: 40,
          }}
          onPress={() => setMore(true)}
        >
          <Text>XEM TH??M </Text>
          <IconDown style={styles.iconDown}></IconDown>
        </Pressable>
      </View>
    );
  };
  const RenderLimit = (props) => {
    let datas = props.data;
    let cutlist = [];
    if (datas.length > limitRenderContact && more === false) {
      for (let i = 0; i < limitRenderContact; i++) {
        cutlist.push(datas[i]);
      }
      return (
        <View>
          <View>{cutlist}</View>
          <RenderMore></RenderMore>
        </View>
      );
    } else {
      cutlist = datas;
      return (
        <View>
          <View>{cutlist}</View>
        </View>
      );
    }
  };
  const RenderList = () => {
    if (isRenderMessage) {
      if (messages.length === 0) {
        return (
          <View style={{ justifyContent: "center", flexDirection: "column"}}>
            <IconList style={{marginBottom: 18, marginLeft: "auto", marginRight: "auto", marginTop: 20 }} />
            <Text style={{ textAlign: "center", fontSize: 16 , fontWeight: "400"}}>
              Kh??ng t??m th???y k???t qu??? ph?? h???p
            </Text>
          </View>
        );
      }
      return (
        <ScrollView>
          <RenderLimit data={messageList}></RenderLimit>
        </ScrollView>
      );
    }
    if (isRenderContact) {
      if (people.length === 0 && friends.length === 0) {
        return (
          <View style={{ justifyContent: "center", flexDirection: "column"}}>
            <IconList style={{marginBottom: 18, marginLeft: "auto", marginRight: "auto", marginTop: 20 }} />
            <Text style={{ textAlign: "center", fontSize: 16 , fontWeight: "400"}}>
              Kh??ng t??m th???y k???t qu??? ph?? h???p
            </Text>
          </View>
        );
      }
      return (
        <ScrollView>
          <Text style={{ marginLeft: 10, marginTop: 20 }}>
            B???n b?? ({friendList.length})
          </Text>
          <RenderLimit data={friendList} />
          <Text style={{ marginLeft: 10, marginTop: 20 }}>
            Ng?????i l??? ({nonFriendList.length})
          </Text>
          <RenderLimit data={nonFriendList}></RenderLimit>
        </ScrollView>
      );
    } else
      return (
        <View>
          <Text></Text>
        </View>
      );
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <LinearGradient
          colors={["#0085ff", "#05adff"]}
          start={[0, 1]}
          end={[1, 0]}
          style={styles.header}
        >
          <View style={{ flexDirection: "row", marginTop: 25 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View style={{ flex: 1 }}>
                <IconBack style={styles.iconBack} />
              </View>
            </TouchableOpacity>

            <View style={{ flex: 5, marginRight: 10 }}>
              <TextInput
                style={styles.input}
                value={searchText}
                onChangeText={updateSearchText}
                onEndEditing={getSearch}
                autoFocus={true}
                placeholder="T??m b???n b??, tin nh???n, ..."
                placeholderTextColor="#dedede"
              ></TextInput>
            </View>
            <View style={{ flex: 1 }}>
              <IconQR style={styles.iconQR} />
            </View>
          </View>
        </LinearGradient>
        <RenderSearchBar></RenderSearchBar>
        <RenderList />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f6f6f6",
    minHeight: "100%",
    flexDirection: "column",
  },
  input: {
    color: "black",
    fontSize: 16,
    marginLeft: 16,
    marginRight: "auto",
    width: "100%",
    marginTop: 4,
    backgroundColor: "white",
    borderColor: "white",
    borderWidth: 4,
    borderRadius: 5,
  },
  header: {
    width: "100%",
    color: "#fff",
    height: 62,
  },

  iconBack: {
    width: 24,
    height: 24,
    color: "white",
    marginLeft: 10,
    marginTop: 2,
  },
  iconQR: {
    width: 24,
    height: 24,
    color: "white",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 2,
  },
  iconDown: {
    width: 18,
    height: 18,
    color: "grey",
  },
  barSearch: {
    flexDirection: "row",
    marginTop: 10,
  },
  contactBarSearch: {
    flex: 1,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  messageBarSearch: {
    flex: 1,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  avatars: {
    marginLeft: 12,
    marginTop: 6,
    marginBottom: 10,
  },
});
