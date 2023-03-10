import React from 'react';
import { StyleSheet, Text, StatusBar, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import IconBack from '../../../assets/ic_nav_header_back.svg'
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { left } from 'styled-system';

const HeaderBar = (props) => {
    let goBackFunc = () => { props.navigation.goBack() };
    if (props.goBackFunc){
        goBackFunc = props.goBackFunc;
    }
    return(
        <>
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
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <TouchableOpacity
                        style={styles.iconBackWrap}
                        onPress={() => goBackFunc()}
                    >
                        <IconBack style={styles.iconBack} />
                    </TouchableOpacity>
                    <Text style={styles.title} >{props.text}</Text>
                    {props.moreButton &&
                    <TouchableOpacity
                        style={styles.iconMore}
                        onPress={() => props.moreButton()}
                    >
                        <Icon
                                name="options"
                                type="simple-line-icon"
                                color="#ffffff"
                                size={20}
                        />
                    </TouchableOpacity>
                    }
                </View>
            </LinearGradient>
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        color: "#fff",
        height: 62,
    },
    iconBack: {
        marginTop: 30,
        left: 10,
    },
    iconBackWrap: {
        width: 40,
        position: "absolute",
    },
    title: {
        marginTop: 30,
        marginLeft: 'auto',
        marginRight: 'auto',
        color: '#fff',
        fontSize: 18,
    },
    iconMore: {
        width: 40,
        position: "absolute",
        right: 0,
        top: "50%"
    },
});

module.exports = HeaderBar;