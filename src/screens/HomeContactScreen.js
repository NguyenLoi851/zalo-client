import React, { useState, useLayoutEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Pressable,
  Text,
  View,
  StatusBar,
  Button,
  ImageBackground,
  TouchableHighlight,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import IconBack from "../../assets/ic_nav_header_back.svg";
import { TextField } from "rn-material-ui-textfield";
import { Icon } from "react-native-elements";
import { Api } from "../api/Api";
import AuthContext from "../components/context/AuthContext";
import AddFriendIcon from "../../assets/ic_cscsticky_addfriend.svg";
import IconSearch from "../../assets/search-outline.svg";
import Loimoiketban from "../../assets/loimoiketban.svg";
import Danhba from "../../assets/icn_friend_from_contacts.svg";
import { useLinkProps } from "@react-navigation/native";
import VideoIcon from "../../assets/ic_video_line_24.svg";
import CallIcon from "../../assets/ic_call_line_24.svg";
import { Avatar } from "native-base";
import { AvatarNativeBaseCache } from "./components/ImageCache";
import { BaseURL } from "../utils/Constants";
import ChatContext from "../components/context/ChatContext";
import AppContext from "../components/context/AppContext";
import { useIsFocused } from "@react-navigation/native";


export default function HomeContactScreen({ navigation }) {
  const context = React.useContext(AuthContext);
  const [listFriend, setListFriend] = useState([]);
  const chatContext = React.useContext(ChatContext);
  const appContext = React.useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();

  const Friend = (props) => {
    return (
      <TouchableHighlight
        style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15 }}
        onPress={() => {
          chatContext.setCurFriendId(props.userId);
          chatContext.setInChat(true);
          chatContext.setNeedUpdateListChat(true);
          let friend = {
            username: props.name,
            avatar: props.img,
            id: props.userId,
            phonenumber: props.phonenumber,
          };
          navigation.navigate("ConversationScreen", {
            from: "ContactScreen",
            friend: friend,
            isread: false,
          });
        }}
        activeOpacity={0.99999}
        underlayColor="#05adff22"
      >
        <View style={{ flexDirection: "row" }}>
          <AvatarNativeBaseCache size="12" source={{ uri: props.img }} />
          <Text
            style={{
              alignSelf: "center",
              marginLeft: 15,
              fontSize: 16,
            }}
          >
            {props.name}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };
  
  const ListFr1 = (props) => {
    if (props.listFr.length == 0) {
      return <></>;
    }
    let tmp = [];
    const data = props.listFr;
    for (let i = 0; i < data.length; i++) {
      tmp.push(
        <Friend
          key={i}
          name={data[i].username}
          img={BaseURL + data[i].avatar.fileName}
          userId = {data[i]._id}
          phonenumber= {data[i].phonenumber}
        />
      );
    }
    return (
      <View>
        <Text style={{ paddingLeft: 15 }}>{props.chucai}</Text>
        {tmp}
      </View>
    );
  };
  
  const ListDanhBa = (props) => {
    let myArr = props.listFr;
  
    if (myArr.length == 0) {
      return (
        <Text
          style={{
            textAlign: "center",
            color: "#767676",
            paddingBottom: Dimensions.get("window").height - 300,
          }}
        >
          Ch??a c?? b???n b?? n??o
        </Text>
      );
    }
  
    function removeVietnameseTones(str) {
      str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a");
      str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e");
      str = str.replace(/??|??|???|???|??/g, "i");
      str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o");
      str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u");
      str = str.replace(/???|??|???|???|???/g, "y");
      str = str.replace(/??/g, "d");
      str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "A");
      str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "E");
      str = str.replace(/??|??|???|???|??/g, "I");
      str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "O");
      str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "U");
      str = str.replace(/???|??|???|???|???/g, "Y");
      str = str.replace(/??/g, "D");
      str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
      str = str.replace(/\u02C6|\u0306|\u031B/g, "");
      str = str.replace(/ + /g, " ");
      str = str.trim();
      // str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
      return str;
    }
  
    myArr.forEach(function (val) {
      // console.log(myArr);
      // console.log(val);
      val.username = val.username.trim();
    });
  
    myArr.sort((a, b) => a.username > b.username);
    let a = [];
    let b = [];
    let c = [];
    let d = [];
    let e = [];
    let f = [];
    let g = [];
    let h = [];
    let ii = [];
    let j = [];
    let k = [];
    let l = [];
    let m = [];
    let n = [];
    let o = [];
    let p = [];
    let q = [];
    let r = [];
    let s = [];
    let t = [];
    let u = [];
    let v = [];
    let w = [];
    let x = [];
    let y = [];
    let z = [];
    let other = [];
  
    for (var i = 0; i < myArr.length; i++) {
      let tmp = removeVietnameseTones(myArr[i].username.toLowerCase())[0];
      if (tmp == "a") {
        a.push(myArr[i]);
        continue;
      }
      if (tmp == "b") {
        b.push(myArr[i]);
        continue;
      }
      if (tmp == "c") {
        c.push(myArr[i]);
        continue;
      }
      if (tmp == "d") {
        d.push(myArr[i]);
        continue;
      }
      if (tmp == "e") {
        e.push(myArr[i]);
        continue;
      }
      if (tmp == "f") {
        f.push(myArr[i]);
        continue;
      }
      if (tmp == "g") {
        g.push(myArr[i]);
        continue;
      }
      if (tmp == "h") {
        h.push(myArr[i]);
        continue;
      }
      if (tmp == "i") {
        ii.push(myArr[i]);
        continue;
      }
      if (tmp == "j") {
        j.push(myArr[i]);
        continue;
      }
      if (tmp == "k") {
        k.push(myArr[i]);
        continue;
      }
      if (tmp == "l") {
        l.push(myArr[i]);
        continue;
      }
      if (tmp == "m") {
        m.push(myArr[i]);
        continue;
      }
      if (tmp == "n") {
        n.push(myArr[i]);
        continue;
      }
      if (tmp == "o") {
        o.push(myArr[i]);
        continue;
      }
      if (tmp == "p") {
        p.push(myArr[i]);
        continue;
      }
      if (tmp == "q") {
        q.push(myArr[i]);
        continue;
      }
      if (tmp == "r") {
        r.push(myArr[i]);
        continue;
      }
      if (tmp == "s") {
        s.push(myArr[i]);
        continue;
      }
      if (tmp === "t") {
        t.push(myArr[i]);
        continue;
      }
      if (tmp == "u") {
        u.push(myArr[i]);
        continue;
      }
      if (tmp == "v") {
        v.push(myArr[i]);
        continue;
      }
      if (tmp == "w") {
        w.push(myArr[i]);
        continue;
      }
      if (tmp == "x") {
        x.push(myArr[i]);
        continue;
      }
      if (tmp == "y") {
        y.push(myArr[i]);
        continue;
      }
      if (tmp == "z") {
        z.push(myArr[i]);
        continue;
      }
      other.push(myArr[i]);
    }
    return (
      <>
        <ListFr1 chucai="A" listFr={a} />
        <ListFr1 chucai="B" listFr={b} />
        <ListFr1 chucai="C" listFr={c} />
        <ListFr1 chucai="D" listFr={d} />
        <ListFr1 chucai="E" listFr={e} />
        <ListFr1 chucai="F" listFr={f} />
        <ListFr1 chucai="G" listFr={g} />
        <ListFr1 chucai="H" listFr={h} />
        <ListFr1 chucai="I" listFr={ii} />
        <ListFr1 chucai="J" listFr={j} />
        <ListFr1 chucai="K" listFr={k} />
        <ListFr1 chucai="L" listFr={l} />
        <ListFr1 chucai="M" listFr={m} />
        <ListFr1 chucai="N" listFr={n} />
        <ListFr1 chucai="O" listFr={o} />
        <ListFr1 chucai="P" listFr={p} />
        <ListFr1 chucai="Q" listFr={q} />
        <ListFr1 chucai="R" listFr={r} />
        <ListFr1 chucai="S" listFr={s} />
        <ListFr1 chucai="T" listFr={t} />
        <ListFr1 chucai="U" listFr={u} />
        <ListFr1 chucai="W" listFr={w} />
        <ListFr1 chucai="X" listFr={x} />
        <ListFr1 chucai="Y" listFr={y} />
        <ListFr1 chucai="Z" listFr={z} />
        <ListFr1 chucai="Other" listFr={other} />
      </>
    );
  };

  const getListFriends = async () => {
    try {
      const accessToken = context.loginState.accessToken;
      let friends = await Api.getListFriends(accessToken, null);
      // console.log(friends.data.data.friends);
      // console.log(typeof friends.data.data.friends);
      setListFriend(Object.values(friends.data.data.friends));
      setIsLoading(false);
      if(appContext.needUpdateContact){
        appContext.setNeedUpdateContact(false);
      }
    } catch (e) {
      console.log(e);
      navigation.navigate("NoConnectionScreen", {
        message: "Vui l??ng ki???m tra k???t n???i internet v?? th??? l???i",
      });
    }
  };

  useLayoutEffect(() => {
    setIsLoading(true);
    getListFriends();
  }, []);

  if(appContext.needUpdateContact && isFocused && !isLoading){
    setIsLoading(true);
    getListFriends();
  }

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#00000000"
        barStyle="light-content"
        translucent={true}
      />

      <LinearGradient
        colors={["#0085ff", "#05adff"]}
        start={[0, 1]}
        end={[1, 0]}
        style={styles.header}
      >
        <View style={{ flexDirection: "row", marginTop: 28 }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SearchScreen");
            }}
          >
            <View style={{ flex: 1 }}>
              <IconSearch style={styles.iconSearch} />
            </View>
          </TouchableOpacity>

          <View style={{ flex: 6 }}>
            <TextInput
              style={styles.input}
              onTouchStart={() => {
                navigation.navigate("SearchScreen");
              }}
              placeholder="T??m b???n b??, tin nh???n..."
              placeholderTextColor="#fff"
            ></TextInput>
          </View>
          <View style={{ marginLeft: "auto", marginRight: 15, marginTop: 2 }}>
            <AddFriendIcon style={{ height: 28, width: 28 }} />
          </View>
        </View>
      </LinearGradient>
      <ScrollView style={{ backgroundColor: "#f6f6f6" }}>
        <View style={styles.part1}>
          <TouchableHighlight
            style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15 }}
            onPress={() => {
              appContext.setEditFriendRequestsInfo(null);
              navigation.navigate("FriendRequests");
            }}
            activeOpacity={0.99999}
            underlayColor="#05adff22"
          >
            <View style={{ flexDirection: "row" }}>
              <Loimoiketban />
              <Text
                style={{
                  fontSize: 16,
                  marginLeft: 15,
                  alignSelf: "center",
                }}
              >
                L???i m???i k???t b???n
              </Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={{
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 15,
            }}
            onPress={() => {}}
            activeOpacity={0.99999}
            underlayColor="#05adff22"
          >
            <View style={{ flexDirection: "row" }}>
              <Danhba />
              <Text
                style={{
                  fontSize: 16,
                  alignSelf: "center",
                  marginLeft: 15,
                }}
              >
                B???n t??? danh b??? m??y
              </Text>
            </View>
          </TouchableHighlight>
        </View>
        <View
          style={{
            marginTop: 10,
            backgroundColor: "#fff",
            paddingTop: 10,
          }}
        >
          <Text
            style={{
              fontWeight: "600",
              marginBottom: 10,
              paddingLeft: 15,
            }}
          >
            Danh b???
          </Text>
          <ListDanhBa listFr={listFriend} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  part1: {
    borderBottomColor: "#ababab",
    borderBottomWidth: 0.1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  input: {
    color: "white",
    fontSize: 16,
    marginLeft: 16,
    width: "100%",
    marginTop: 4,
  },
  header: {
    width: "100%",
    color: "#fff",
    height: 62,
  },
  iconSearch: {
    width: 24,
    height: 24,
    color: "white",
    marginLeft: 10,
    marginTop: 2,
  },
  chucai: {
    marginLeft: 20,
  },
  Loimoiketban: {
    marginTop: 32,
    marginLeft: 10,
  },
  placeHold: {
    marginTop: 32,
    marginLeft: 25,
    color: "#fff",
    fontSize: 14,
  },
});
