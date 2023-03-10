import { useLinkProps } from "@react-navigation/native";
import React, { useState, useEffect, useRef, useContext } from "react";
import {
    StyleSheet,
    Pressable,
    Text,
    TextInput,
    StatusBar,
    View,
    TouchableHighlight,
    Keyboard,
    TouchableOpacity,
    Dimensions,
    Alert,
} from "react-native";
import { Avatar, Icon, Image, Divider, Overlay } from "react-native-elements";
import ImageView from "react-native-image-viewing";
import { Video, AVPlaybackStatus } from "expo-av";
import RBSheet from "react-native-raw-bottom-sheet";
import IconMenuDelete from "../../../assets/ic_bottom_sheet_menu_delete.svg";
import IconMenuReport from "../../../assets/ic_bottom_sheet_menu_report.svg";
import IconMenuBan from "../../../assets/ic_bottom_sheet_menu_ban.svg";
import IconMenuHide from "../../../assets/ic_hide_social.svg";
import IconComment from "../../../assets/ico_comment.svg";
import IconUnLike from "../../../assets/ic_unlike.svg";
import IconLike from "../../../assets/ic_like.svg";
import IconSend from "../../../assets/icn_send_black.svg";
import * as myConst from "../../utils/Constants";
import { Api } from "../../api/Api";
import AuthContext from "../../components/context/AuthContext";
import AppContext from "../../components/context/AppContext";
import { TextUtility } from "../../utils/TextUtility";
import { TimeUtility } from "../../utils/TimeUtility";
import { AvatarReactElementCache, ImageReactElementCache } from "./ImageCache";
import Modal from "react-native-modal";

const BaseURL = myConst.BaseURL;

export default function Post(props) {
    const video = React.useRef(null);
    const refRBSheet = React.useRef(null);
    const refRBSheetReport = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [visible, setIsVisible] = useState(false);
    const [blockModalVisible, setBlockModalVisible] = useState(false);
    const [imageIndex, setImageIndex] = useState(1);
    const images = props.post.images;
    const videos = props.post.videos;
    const [numLike, setNumLike] = useState(props.post.like.length);
    const [isLike, setIsLike] = useState(props.post.isLike);
    const postTime = new Date(props.post.createdAt);

    useEffect(() => {
        setNumLike(props.post.like.length);
        setIsLike(props.post.isLike);
    }, [props.post])

    const context = useContext(AuthContext);
    const appContext = useContext(AppContext);

    let userName = props.post.author.username;
    let numComment = props.post.countComments;

    var goToUserPage = () => {
        if (props.post.author._id != context.loginState.userId) {
            props.navigation.navigate("ViewProfileScreen", { userId: props.post.author._id })
        }else{
            props.navigation.navigate("ProfileScreen")
        }
    };

    var showMenu = () => {
        refRBSheet.current.open();
    };

    const setPostLike = async () => {
        try {
            let accessToken = context.loginState.accessToken;
            let postID = props.post._id;
            let userID = context.loginState.userId;
            let likes = await Api.setPostLike(postID, accessToken);
            let usersLike = likes.data.data;
            let allUserIDLike = [];
            for (let i = 0; i < usersLike.like.length; i++) {
                allUserIDLike.push(usersLike.like[i]._id);
            }
            setIsLike(allUserIDLike.includes(userID));
            setNumLike(usersLike.like.length);

            if (props.from.includes("postscreen")) {
                if (props.from.includes("timeline")) {
                    appContext.setNeedUpdateTimeline(true);
                }
                if (props.from.includes("profile")) {
                    appContext.setNeedUpdateProfile(true);
                    appContext.setNeedUpdateTimeline(true);
                }
                if(props.from.includes("viewuser")){
                    appContext.setNeedUpdateViewProfileScreen(true);
                    appContext.setNeedUpdateTimeline(true);
                }
            }else{
                if (props.from.includes("profile")) {
                    appContext.setNeedUpdateProfile(true);
                    appContext.setNeedUpdateTimeline(true);
                }
                if(props.from.includes("viewuser")){
                    appContext.setNeedUpdateViewProfileScreen(true);
                    appContext.setNeedUpdateTimeline(true);
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    let iconLikeStatus = isLike ? IconLike : IconUnLike;

    let renderImages = [];
    for (let i = 0; i < images.length; i++) {
        renderImages.push({ uri: BaseURL + images[i].fileName });
    }

    let media = <></>;
    let addition = <></>;

    if (videos.length == 0) {
        if (renderImages.length > 0) {
            if (renderImages.length > 1) {
                let additionImages = [];
                let imageHeight =
                    renderImages.length <= 2
                        ? 400
                        : (400 - 3 * (renderImages.length - 2)) / (renderImages.length - 1);
                for (let i = 1; i < renderImages.length; i++) {
                    additionImages.push(
                        <View key={i}>
                            <ImageReactElementCache
                                source={renderImages[i]}
                                style={{ height: imageHeight, resizeMode: "cover" }}
                                onPress={() => {
                                    setImageIndex(i);
                                    setIsVisible(true);
                                }}
                            />
                        </View>
                    );
                }
                addition = (
                    <View
                        style={{
                            flex: 1,
                            paddingTop: 20,
                            flexDirection: "column",
                            left: 3,
                            justifyContent: "space-between",
                        }}
                    >
                        {additionImages}
                    </View>
                );
            }
            media = (
                <>
                    <ImageView
                        images={renderImages}
                        imageIndex={imageIndex}
                        visible={visible}
                        onRequestClose={() => setIsVisible(false)}
                        swipeToCloseEnabled={true}
                        FooterComponent={(props) => {
                            return (
                                <View>
                                    <Text style={styles.imageViewFooter}>
                                        {props.imageIndex + 1} / {renderImages.length}
                                    </Text>
                                </View>
                            );
                        }}
                    />
                    <View style={{ flex: 1, paddingTop: 20 }}>
                        <Image
                            source={[renderImages[0]]}
                            style={{ height: 400, resizeMode: "cover" }}
                            onPress={() => {
                                setImageIndex(0);
                                setIsVisible(true);
                            }}
                        />
                    </View>
                    {addition}
                </>
            );
        }
    } else {
        media = (
            <View style={{ flex: 1, paddingTop: 20 }}>
                <Video
                    ref={video}
                    style={styles.video}
                    source={{
                        uri: BaseURL + videos[0].fileName,
                    }}
                    useNativeControls={true}
                    resizeMode="contain"
                    isLooping={true}
                    onPlaybackStatusUpdate={(status) => setStatus(() => status)}
                />
            </View>
        );
    }

    var navigateToCommentScreen = () => {
        Keyboard.dismiss();
        if (props.mode !== "comment") {
            if (videos.length > 0) video.current.pauseAsync();
            props.post.like.length = numLike;
            props.navigation.navigate("PostScreen", {
                postId: props.post._id,
                post: { ...props.post, isLike, like: props.post.like },
                from: "postscreen " + props.from,
            });
        }
    };

    var onPressDelete = () => {
        Alert.alert("X??c nh???n", "B???n c?? mu???n x??a b??i vi???t?", [
            { text: "Kh??ng" },
            { text: 'C??', onPress: () => { deletePost() } }
        ])
    }

    var deletePost = async () => {
        try {
            let res = await Api.deletePost(context.loginState.accessToken,
                props.post._id);
            console.log(res);
            appContext.displayMessage({
                message: "???? x??a b??i ????ng",
                type: "default",
                style: { width: 195, marginBottom: 200 },
                titleStyle: { fontSize: 14 },
                duration: 1900,
                icon: "success",
                position: "center",
                backgroundColor: "#262626",
            });
            props.navigation.navigate("TimeLineScreen");
        } catch (err) {
            if (err.response && err.response.status == 404) {
                console.log(err.response.data.message);
                appContext.displayMessage({
                    message: "Kh??ng t??m th???y b??i ????ng",
                    type: "default",
                    style: { width: 195, marginBottom: 200 },
                    titleStyle: { fontSize: 14 },
                    duration: 1900,
                    position: "center",
                    backgroundColor: "#262626",
                });
                return
            }
            console.log(err);
            navigation.navigate("NoConnectionScreen", { message: "Vui l??ng ki???m tra k???t n???i internet v?? th??? l???i" })
            return
        }
    };

    var onPressEdit = () => {
        refCallBack.current = () => {
            props.navigation.navigate("EditPost", {
                post: props.post,
                from: props.from
            });
        };
        refRBSheet.current.close();
    };

    var onPressHide = () => {
        refCallBack.current = () => {
            setBlockModalVisible(true);
        };
        refRBSheet.current.close();
    };

    var BlockConfirm = () => {
        let hide = !appContext.blockedDiary.includes(props.post.author._id);

        let block = async () => {
            try {
                let accessToken = context.loginState.accessToken;
                const res = await Api.setBlockDiary(
                    accessToken,
                    props.post.author._id,
                    hide
                );
                if (res.status == 200) {
                    appContext.displayMessage({
                        message: hide ? "Ch???n th??nh c??ng" : "B??? ch???n th??nh c??ng",
                        type: "default",
                        style: { width: 195, marginBottom: 200 },
                        titleStyle: { fontSize: 14 },
                        duration: 1900,
                        icon: "success",
                        position: "center",
                        backgroundColor: "#262626",
                    });
                    appContext.setBlockedDiary(res.data.data.blocked_diary);
                }
                appContext.setNeedUpdateTimeline(true);
            } catch (err) {
                console.log(err);
                if (err.response && err.response.status == 400) {
                    console.log(err.response.data.message);
                    appContext.displayMessage({
                        message: err.response.data.message,
                        type: "default",
                        style: { width: 195, marginBottom: 200 },
                        titleStyle: { fontSize: 14 },
                        duration: 1900,
                        position: "center",
                        backgroundColor: "#262626",
                    });
                    return;
                }
                props.navigation.navigate("NoConnectionScreen", { message: "" });
            }
        };

        return (
            <Modal
                isVisible={blockModalVisible}
                onBackdropPress={() => {
                    setBlockModalVisible(false);
                    refCallBack.current = ()=>{};
                }}
                style={{alignSelf: "center", width:292 }}
                animationIn="fadeInUp"
                animationOut="fadeOutDownBig"
            >
                <View style={styles.menuStyle}>
                    <Text style={styles.menuTitle}>
                        {(hide ? "???n" : "B??? ???n") + " ng?????i n??y?"}
                    </Text>
                    <Text style={styles.menuDesription}>
                        {"B???n s??? " + (hide ? "" : "b??? ") + "???n nh???t k?? c???a ng?????i n??y"}
                    </Text>
                    <View style={styles.menuBottom}>
                        <TouchableOpacity
                            flex={1}
                            style={styles.menuCancelBtn}
                            onPress={() => {
                                setBlockModalVisible(false);
                                refCallBack.current = ()=>{};
                            }}
                        >
                            <Text style={styles.textCancel}>Kh??ng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            flex={1}
                            style={styles.menuAcceptBtn}
                            onPress={() => {
                                setBlockModalVisible(false);
                                refCallBack.current = ()=>{};
                                block();
                            }}
                        >
                            <Text style={styles.textAccept}>C??</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    var onPressHide2 = async () => {
        let hide = !appContext.blockedDiary.includes(props.post.author._id);
        Alert.alert(
            "X??c nh???n",
            "B???n c?? mu???n ".concat(hide ? "" : "b??? ", "???n nh???t k?? c???a ng?????i n??y?"),
            [
                { text: "Kh??ng" },
                {
                    text: "C??",
                    onPress: async () => {
                        // navigation.goBack()
                        refRBSheet.current.close();
                        try {
                            let accessToken = context.loginState.accessToken;
                            const res = await Api.setBlockDiary(
                                accessToken,
                                props.post.author._id,
                                hide
                            );
                            if (res.status == 200) {
                                appContext.displayMessage({
                                    message: hide ? "Ch???n th??nh c??ng" : "B??? ch???n th??nh c??ng",
                                    type: "default",
                                    style: { width: 195, marginBottom: 200 },
                                    titleStyle: { fontSize: 14 },
                                    duration: 1900,
                                    icon: "success",
                                    position: "center",
                                    backgroundColor: "#262626",
                                });
                                appContext.setBlockedDiary(res.data.data.blocked_diary);
                            }
                        } catch (err) {
                            console.log(err);
                            if (err.response && err.response.status == 400) {
                                console.log(err.response.data.message);
                                appContext.displayMessage({
                                    message: err.response.data.message,
                                    type: "default",
                                    style: { width: 195, marginBottom: 200 },
                                    titleStyle: { fontSize: 14 },
                                    duration: 1900,
                                    position: "center",
                                    backgroundColor: "#262626",
                                });
                                return;
                            }
                            props.navigation.navigate("NoConnectionScreen", { message: "" });
                        }
                    },
                },
            ]
        );
    };

    let refCallBack = useRef(() => { });

    var onPressReport = () => {
        refCallBack.current = () => {
            refRBSheetReport.current.open();
        };
        refRBSheet.current.close();
    };

    const sendReport = async (reason, details) => {
        try {
            let accessToken = context.loginState.accessToken;
            const res = await Api.createReport(
                accessToken,
                props.post._id,
                reason,
                details
            );
            if (res.status == 200) {
                appContext.displayMessage({
                    message: "B??o x???u th??nh c??ng",
                    type: "default",
                    style: { width: 195, marginBottom: 200 },
                    titleStyle: { fontSize: 14 },
                    duration: 1900,
                    icon: "success",
                    position: "center",
                    backgroundColor: "#262626",
                });
            }
        } catch (err) {
            console.log(err);
            props.navigation.navigate("NoConnectionScreen", { message: "" });
        }
    };

    const [reportKhac, setReportKhac] = useState({ show: false, content: "" });
    let shoundReportKhacOpen = useRef(false);
    var onPressReportReason = (reason) => {
        refRBSheetReport.current.close();
        if (reason != myConst.REPORT_KHAC) {
            sendReport(reason);
        } else {
            shoundReportKhacOpen.current = true;
        }
    };

    const openReportKhac = () => {
        if (shoundReportKhacOpen.current) {
            setReportKhac({ show: true, content: "" });
        }
    };

    var renderPostContent = () => {
        let [phone, TextUI] = TextUtility.detectThenFormatPhoneAndURLAndIcon(
            props.post.described
        );
        return TextUI;
    };

    return (
        <View style={styles.postContainer}>
            {visible && <StatusBar hidden />}
            <Pressable onPress={navigateToCommentScreen}>
                <View>
                    <View style={styles.postHeader}>
                        <View style={styles.posterAvatar}>
                            <AvatarReactElementCache
                                key={props.post.author.avatar.fileName}
                                size={42}
                                rounded
                                onPress={() => goToUserPage()}
                                activeOpacity={0.8}
                                source={{ uri: BaseURL + props.post.author.avatar.fileName }}
                            />
                        </View>
                        <View style={styles.posterInfo}>
                            <View style={{ flex: 1 }}>
                                <Pressable
                                    onPress={() => {
                                        goToUserPage();
                                    }}
                                >
                                    <Text
                                        style={{
                                            textAlign: "right",
                                            fontSize: 16,
                                            color: "#000",
                                            fontWeight: "600",
                                            lineHeight: 28,
                                        }}
                                    >
                                        {userName}
                                    </Text>
                                </Pressable>
                            </View>
                            <Text
                                style={{
                                    flex: 1,
                                    fontSize: 14,
                                    color: "#77797c",
                                    marginTop: 0,
                                }}
                            >
                                {TimeUtility.getTimeStr(postTime)}
                            </Text>
                        </View>
                        <View style={styles.postMenu}>
                            <Icon
                                name="options"
                                type="simple-line-icon"
                                color="#898989"
                                size={20}
                                onPress={() => showMenu("")}
                            />
                        </View>
                    </View>
                    <View style={styles.postContent}>{renderPostContent()}</View>
                </View>
            </Pressable>

            <View style={styles.postMedia}>{media}</View>
            <Pressable onPress={navigateToCommentScreen}>
                <View style={styles.postFooter}>
                    <View style={{ flexDirection: "row", marginRight: 36 }}>
                        <Pressable style={{ marginTop: 4 }} onPress={setPostLike}>
                            {iconLikeStatus}
                        </Pressable>
                        <Text style={{ marginLeft: 9, fontSize: 18, lineHeight: 34 }}>
                            {numLike}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            display: props.mode == "comment" ? "none" : null,
                        }}
                    >
                        <Pressable
                            style={{ marginTop: 4 }}
                            onPress={navigateToCommentScreen}
                        >
                            {IconComment}
                        </Pressable>
                        <Text style={{ marginLeft: 10, fontSize: 18, lineHeight: 34 }}>
                            {numComment}
                        </Text>
                    </View>
                </View>
            </Pressable>
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                closeOnPressBack={true}
                onClose={() => refCallBack.current()}
                animationType="fade"
                height={props.post.author._id == context.loginState.userId ? 240 : 160}
                customStyles={{
                    wrapper: {
                        backgroundColor: "rgba(0,0,0,0.28)",
                    },
                    container: {
                        borderTopLeftRadius: 20,
                        borderTopEndRadius: 20,
                    },
                    draggableIcon: {
                        opacity: 0,
                    },
                }}
            >
                <View
                    style={{
                        justifyContent: "center",
                        flexDirection: "column",
                        height:
                            props.post.author._id == context.loginState.userId ? 240 : 160,
                        marginTop: -20,
                    }}
                >
                    {props.post.author._id == context.loginState.userId && (
                        <Pressable
                            style={[styles.menuOption, { height: 72 }]}
                            onPress={onPressDelete}
                        >
                            <IconMenuDelete
                                flex={1}
                                style={{ marginTop: "auto", marginBottom: "auto" }}
                            />
                            <View flex={10} style={styles.inMenuOption}>
                                <Text
                                    style={{ fontSize: 16, fontWeight: "400", marginBottom: 4 }}
                                >
                                    Xo?? b??i ????ng
                                </Text>
                                <Text style={{ fontSize: 14, color: "#9ea1a6" }}>
                                    B??i ????ng n??y b??? x??a kh???i nh???t k??
                                </Text>
                            </View>
                        </Pressable>
                    )}

                    {props.post.author._id == context.loginState.userId && (
                        <Pressable
                            style={[styles.menuOption, { height: 72 }]}
                            onPress={onPressEdit}
                        >
                            <IconMenuDelete
                                flex={1}
                                style={{ marginTop: "auto", marginBottom: "auto" }}
                            />
                            <View flex={10} style={styles.inMenuOption}>
                                <Text
                                    style={{ fontSize: 16, fontWeight: "400", marginBottom: 4 }}
                                >
                                    S???a b??i ????ng
                                </Text>
                                <Text style={{ fontSize: 14, color: "#9ea1a6" }}>
                                    S???a n???i dung b??i ????ng
                                </Text>
                            </View>
                        </Pressable>
                    )}

                    {props.post.author._id != context.loginState.userId && (
                        <Pressable
                            style={[styles.menuOption, { height: 90 }]}
                            onPress={onPressHide}
                        >
                            <IconMenuHide
                                flex={1}
                                style={{ marginTop: "auto", marginBottom: "auto" }}
                            />
                            <View flex={10} style={styles.inMenuOption}>
                                <Text
                                    style={{ fontSize: 16, fontWeight: "400", marginBottom: 4 }}
                                >
                                    {appContext.blockedDiary.includes(props.post.author._id)
                                        ? "B??? ???n"
                                        : "???n"}{" "}
                                    nh???t k?? c???a {userName}
                                </Text>
                                <Text style={{ fontSize: 14, color: "#9ea1a6" }}>
                                    To??n b??? b??i ????ng v?? kho???nh kh???c c???a ng?????i n??y s???{" "}
                                    {appContext.blockedDiary.includes(props.post.author._id)
                                        ? "???????c b??? ???n"
                                        : "b??? ???n ??i"}
                                </Text>
                            </View>
                        </Pressable>
                    )}

                    {/* <Pressable
                        style={[styles.menuOption, { height: 90 }]}
                        onPress={onPressBlock}
                    >
                        <IconMenuBan
                            flex={1}
                            style={{ marginTop: "auto", marginBottom: "auto" }}
                        />
                        <View flex={10} style={styles.inMenuOption}>
                            <Text
                                style={{ fontSize: 16, fontWeight: "400", marginBottom: 4 }}
                            >
                                Ch???n {userName} xem nh???t k?? c???a t??i
                            </Text>
                            <Text style={{ fontSize: 14, color: "#9ea1a6" }}>
                                Ng?????i n??y s??? kh??ng th???y to??n b??? b??i ????ng v?? kho???nh kh???c c???a b???n
                            </Text>
                        </View>
                    </Pressable> */}

                    <Pressable
                        style={[styles.menuOption, { height: 68 }]}
                        onPress={onPressReport}
                    >
                        <IconMenuReport
                            flex={1}
                            style={{ marginTop: "auto", marginBottom: "auto" }}
                        />
                        <View flex={10} style={styles.reportMenuOption}>
                            <Text style={{ fontSize: 16, fontWeight: "400" }}>B??o x???u</Text>
                        </View>
                    </Pressable>
                </View>
            </RBSheet>

            <RBSheet
                ref={refRBSheetReport}
                closeOnDragDown={true}
                closeOnPressMask={true}
                closeOnPressBack={true}
                animationType="fade"
                height={420}
                onClose={() => {
                    refCallBack.current = () => { };
                    openReportKhac();
                }}
                customStyles={{
                    wrapper: {
                        backgroundColor: "rgba(0,0,0,0.28)",
                        width: "100%",
                    },
                    container: {
                        marginBottom: 10,
                        width: "95%",
                        alignSelf: "center",
                        backgroundColor: "rgba(255,255,255,0)",
                    },
                    draggableIcon: {
                        opacity: 0,
                    },
                }}
            >
                <View
                    style={{
                        justifyContent: "center",
                        flexDirection: "column",
                        height: "100%",
                        width: "100%",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "rgba(220,220,220,1)",
                            borderTopLeftRadius: 15,
                            borderTopEndRadius: 15,
                            borderBottomRightRadius: 15,
                            borderBottomStartRadius: 15,
                            justifyContent: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: "#767676",
                                textAlign: "center",
                                marginTop: 15,
                            }}
                        >
                            X??c nh???n
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: "#767676",
                                textAlign: "center",
                                marginTop: 15,
                                marginBottom: 20,
                            }}
                        >
                            B???n mu???n b??o x???u ho???t ?????ng n??y?
                        </Text>
                        <Divider orientation="horizontal" />
                        <TouchableHighlight
                            style={styles.reportOption}
                            onPress={() => {
                                onPressReportReason(myConst.REPORT_NHAYCAM);
                            }}
                            activeOpacity={0.99}
                            underlayColor="#989898"
                        >
                            <Text style={styles.reportOptionText}>N???i dung nh???y c???m</Text>
                        </TouchableHighlight>
                        <Divider orientation="horizontal" />
                        <TouchableHighlight
                            style={styles.reportOption}
                            onPress={() => {
                                onPressReportReason(myConst.REPORT_LAMPHIEN);
                            }}
                            activeOpacity={0.99}
                            underlayColor="#989898"
                        >
                            <Text style={styles.reportOptionText}>L??m phi???n</Text>
                        </TouchableHighlight>
                        <Divider orientation="horizontal" />
                        <TouchableHighlight
                            style={styles.reportOption}
                            onPress={() => {
                                onPressReportReason(myConst.REPORT_LUADAO);
                            }}
                            activeOpacity={0.99}
                            underlayColor="#989898"
                        >
                            <Text style={styles.reportOptionText}>L???a ?????o</Text>
                        </TouchableHighlight>
                        <Divider orientation="horizontal" />
                        <TouchableHighlight
                            style={styles.reportOption}
                            onPress={() => {
                                onPressReportReason(myConst.REPORT_KHAC);
                            }}
                            activeOpacity={0.99}
                            underlayColor="#989898"
                        >
                            <Text style={styles.reportOptionText}>L?? do kh??c</Text>
                        </TouchableHighlight>
                    </View>
                    <TouchableHighlight
                        style={{
                            backgroundColor: "#fff",
                            borderTopLeftRadius: 15,
                            borderTopEndRadius: 15,
                            borderBottomRightRadius: 15,
                            borderBottomStartRadius: 15,
                            justifyContent: "center",
                            alignItems: "center",
                            height: 60,
                            marginTop: 10,
                            marginBottom: 10,
                        }}
                        onPress={() => refRBSheetReport.current.close()}
                        activeOpacity={0.999}
                        underlayColor="#989898"
                    >
                        <Text style={{ color: "#0085ff", fontWeight: "600", fontSize: 19 }}>
                            H???y
                        </Text>
                    </TouchableHighlight>
                </View>
            </RBSheet>
            <Overlay
                isVisible={reportKhac.show}
                overlayStyle={{
                    borderTopLeftRadius: 15,
                    borderTopEndRadius: 15,
                    borderBottomRightRadius: 15,
                    borderBottomStartRadius: 15,
                    height: 220,
                    width: (Dimensions.get("window").width / 10) * 9,
                    backgroundColor: "#fff",
                    alignSelf: "center",
                    top: -100,
                    padding: 0,
                }}
            >
                <View style={{ flex: 1, width: "100%" }}>
                    <Text
                        style={{
                            textAlign: "center",
                            fontSize: 17,
                            fontWeight: "400",
                            lineHeight: 20,
                            marginBottom: 10,
                            marginTop: 10,
                        }}
                    >
                        B??o x???u
                    </Text>
                    <Divider orientation="horizontal" />
                    <TextInput
                        style={{ height: 135, padding: 10 }}
                        placeholder="Nh???p l?? do b??o x???u"
                        returnKeyType="none"
                        value={reportKhac.content}
                        onChangeText={(text) =>
                            setReportKhac({ show: reportKhac.show, content: text })
                        }
                        enablesReturnKeyAutomatically={false}
                        multiline={true}
                        autoFocus
                    />
                    <View style={{ flexDirection: "row", flex: 1, width: "100%" }}>
                        <TouchableHighlight
                            onPress={() => {
                                setReportKhac({ show: false, content: "" }),
                                    (shoundReportKhacOpen.current = false);
                            }}
                            activeOpacity={0.999}
                            underlayColor="#dedede"
                            style={{
                                flex: 1,
                                borderTopWidth: 1,
                                height: 45,
                                alignItems: "center",
                                justifyContent: "center",
                                borderColor: "#dedede",
                            }}
                        >
                            <Text style={{ textAlign: "center", fontSize: 16 }}>H???y</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{
                                flex: 1,
                                borderLeftWidth: 1,
                                borderTopWidth: 1,
                                height: 45,
                                alignItems: "center",
                                justifyContent: "center",
                                borderColor: "#dedede",
                            }}
                            activeOpacity={0.999}
                            underlayColor="#dedede"
                            onPress={() => {
                                shoundReportKhacOpen.current = false;
                                sendReport(myConst.REPORT_KHAC, reportKhac.content);
                                setReportKhac({ show: false, content: reportKhac.content });
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: "center",
                                    color: "#0085ff",
                                    fontWeight: "500",
                                    fontSize: 16,
                                }}
                            >
                                ?????ng ??
                            </Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Overlay>
            <BlockConfirm />
        </View>
    );
}

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: "#fff",
        marginTop: 0,
    },
    posterAvatar: {
        marginLeft: 18,
        marginTop: 16,
    },
    posterInfo: {
        paddingTop: 12,
        marginLeft: 12,
    },
    postHeader: {
        flexDirection: "row",
        height: 60,
        marginBottom: 20,
    },
    postContent: {
        paddingLeft: 8,
        paddingRight: 6,
        fontSize: 18,
        marginTop: -10,
        marginBottom: -11,
    },
    postMedia: {
        flexDirection: "row",
        maxHeight: 500,
    },
    postFooter: {
        paddingTop: 8,
        height: 50,
        textAlignVertical: "center",
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 18,
        borderTopColor: "#ebebeb",
        borderTopWidth: 1,
        marginTop: 20,
    },
    postMenu: {
        marginLeft: "auto",
        marginRight: 16,
        marginTop: 8,
    },
    imageViewFooter: {
        color: "#fff",
        fontSize: 18,
        marginLeft: "auto",
        marginBottom: 4,
        marginRight: "auto",
        paddingRight: 2,
        fontWeight: "500",
    },
    video: {
        alignSelf: "center",
        width: "100%",
        height: 400,
    },
    menuOption: {
        flexDirection: "row",
        paddingLeft: 14,
        paddingRight: 18,
    },
    inMenuOption: {
        flexDirection: "column",
        justifyContent: "center",
        marginLeft: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#adb1b7",
    },
    reportMenuOption: {
        flexDirection: "column",
        justifyContent: "center",
        marginLeft: 12,
    },
    enterReportTitle: {
        fontSize: 24,
        margin: 10,
        fontWeight: "bold",
    },
    enterReport: {
        padding: 10,
        height: 50,
        backgroundColor: "#fff",
        fontSize: 18,
        margin: 10,
        borderColor: "gray",
        borderRadius: 2,
        borderWidth: 2,
        flex: 1,
    },
    sendReportButton: {
        alignSelf: "center",
        margin: 10,
    },
    sentAlert: {
        marginBottom: 10,
        color: "green",
    },
    reportOption: {
        alignItems: "center",
        justifyContent: "center",
        height: 55,
    },
    reportOptionText: {
        color: "#0085ff",
        fontSize: 20,
        fontWeight: "400",
    },
    menuStyle: {
        flexDirection: "column",
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingTop: 20,
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
    },

    menuDesription: {
        textAlign: "center",
        fontSize: 14,
        paddingTop: 8,
        paddingBottom: 16,
        fontWeight: "400",
        paddingLeft: 12,
        paddingRight: 12,
    },
    menuBottom: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "#dadada",
    },
    menuCancelBtn: {
        height: 50,
        width: "50%",
        borderRightColor: "#dadada",
        borderRightWidth: 1,
    },
    menuAcceptBtn: {
        height: 50,
        width: "50%",
    },
    textCancel: {
        fontSize: 17,
        textAlign: "center",
        paddingTop: 12,
        fontWeight: "400",
        color: "#1476f8",
    },
    textAccept: {
        fontSize: 17,
        textAlign: "center",
        paddingTop: 12,
        fontWeight: "400",
        color: "#ed4732",
    },
});
