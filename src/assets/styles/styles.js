import { StyleSheet } from 'react-native';
import { scale, moderateScale, verticalScale} from '../../Helper/Scaling'

var darkGrayColor = '#4A4A4A';
var normalGrayColor = '#979797';
var lightGrayColor = '#696969';
var veryLightGrayColor = '#d8d8d8';

var lightGreenColor = '#5EC3AE';
var darkGreenColor = '#0D4C6B';

const styles = StyleSheet.create({
    // container
    centerContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },

    centerInColumn: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },

    centerInRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    topContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },

    stretch: {
        flex: 1
    },

    stretch2X: {
        flex: 2
    },

    stretch3X: {
        flex: 3
    },
    
    // margin & padding
    smallMargin: {
        margin: moderateScale(10)
    },

	normalMargin: {
        margin: moderateScale(20)
    },

    middleMargin: {
        margin: moderateScale(30)
    },

    largeMargin: {
        margin: moderateScale(50)
    },

    verySmallPadding: {
        padding: moderateScale(5)
    },

    smallPadding: {
        padding: moderateScale(10)
    },

    normalPadding: {
        padding: moderateScale(20)
    },

    middlePadding: {
        padding: moderateScale(30)
    },

    verySmallPaddingTop: {
        paddingTop: moderateScale(1)
    },

    smallPaddingTop: {
        paddingTop: moderateScale(10)
    },

    normalPaddingTop: {
        paddingTop: moderateScale(20)
    },

    middlePaddingTop: {
        paddingTop: moderateScale(30)
    },

    largePaddingTop: {
        paddingTop: moderateScale(40)
    },

    // badget
    iconBadge: {
        position: 'absolute',
        top: moderateScale(-10),
        right: moderateScale(-10),
        minWidth: moderateScale(32),
        height: moderateScale(32),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },

    // font
    largeFont: {
        fontSize: moderateScale(18),
    },

    middleFont: {
        fontSize: moderateScale(15),
    },

    smallFont: {
        fontSize: moderateScale(12)
    },

    bold: {
        fontWeight: 'bold'
    },

    italic: {
        fontStyle: 'italic'
    },

    textUnderline: {
        textDecorationLine: 'underline'
    },

    // color
    darkGrayColor: {
        color: darkGrayColor,
    },  

    lightGrayColor: {
        color: lightGrayColor
    },

    veryLightGrayColor: {
        color: veryLightGrayColor
    },

    normalBackgroundGrayColor: {
        backgroundColor: normalGrayColor,
    },

    hideLogoByBackground: {
    },

    lightGrayBackgroundColor: {
        backgroundColor: lightGrayColor
    },

    lightGreenColor: {
        color: lightGreenColor
    },

    darkGreenColor: {
        color: darkGreenColor
    },

    whiteColor: {
        color: 'white'
    },

    redColor: {
        color: 'red'
    },

    activeButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: moderateScale(32),
    },

    activeButton: {
        borderColor: lightGreenColor,
        backgroundColor: lightGreenColor,
        height: moderateScale(35),
        borderRadius: moderateScale(4),
    },

    inactiveButton: {
        borderColor: veryLightGrayColor,
        backgroundColor: veryLightGrayColor,
        height: moderateScale(35),
        borderRadius: moderateScale(4),
    },

    // other
    phoneNumber: {
        color: lightGrayColor,
        height: moderateScale(20)
    },

    underline: {
        borderBottomWidth: moderateScale(1),
        borderBottomColor: '#979797'
    },

    smallSpace: {
        height: moderateScale(10),
        width: moderateScale(10)
    },

    normalSpace: {
        height: moderateScale(20),
        width: moderateScale(20)
    },

    middleSpace: {
        height: moderateScale(40),
        width: moderateScale(40)
    },

    superLargeSpace: {
        height: moderateScale(60),
        width: moderateScale(60)
    },

    grayBorder: {
        borderColor: normalGrayColor,
        borderWidth: 1
    },

    textAlignCenter: {
        textAlign: 'center',
    },

    textAlignLeft: {
        textAlign: 'left'
    },

    textAlignRight: {
        textAlign: 'right'
    },

    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
    },

    innerContainer: {
        borderWidth: moderateScale(1),
        borderRadius: moderateScale(5),
        margin: moderateScale(25),
        borderColor: '#035561',
        backgroundColor: 'white',
    },

    visible: {
        display: 'flex'
    },
    
    hidden: {
        display: 'none'
    },
});

export default styles;
