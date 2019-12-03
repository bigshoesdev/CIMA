import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    ImageBackground,
    ScrollView,
    Platform
} from 'react-native';

import Styles from '../assets/styles/styles'
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import Button from 'apsl-react-native-button'
import { Navigation } from 'react-native-navigation'

export default class TermsAndConditionsPage extends Component {
	constructor(props) {
        super(props);
    }

	render() {
        let backgroundImage = require('../assets/images/background.png');

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <View style={ [Styles.innerContainer, style.container, Styles.smallPadding] } >
                    <View >
                        <Text style={ [Styles.lightGrayColor, Styles.normalPaddingTop, Styles.largeFont, Styles.textAlignCenter, Styles.middleFont] }>TERMS & CONDITIONS</Text>
                    </View>

                    {/* space */}
                    <View style={ [Styles.normalSpace] } />

                    {/* PDF view */}
                    <View style={style.contentContainer}>
                        <ScrollView style={{alignSelf: 'stretch'}}>
                            <Text style={ [Styles.lightGrayColor, Styles.middleFont,] }>1. TERMS OF USE</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>By downloading, browsing, accessing or using this Boulder World mobile application (“<Text style={ [Styles.bold] }>Mobile Application</Text>”), you agree to be bound by these Terms and Conditions of Use. We reserve the right to amend these terms and conditions at any time. If you disagree with any of these Terms and Conditions of Use, you must immediately discontinue your access to the Mobile Application and your use of the services offered on the Mobile Application. Continued use of the Mobile Application will constitute acceptance of these Terms and Conditions of Use, as may be amended from time to time.</Text>

                            {/* space */}
                            <View style={ [Styles.normalSpace] } />
                            <Text style={ [Styles.lightGrayColor, Styles.middleFont,] }>2. DEFINITIONS</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>In these Terms and Conditions of Use, the following capitalised terms shall have the following meanings, except where the context otherwise requires:</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>"<Text style={ [Styles.bold] }>Account</Text>" means an account created by a User on the Mobile Application as part of Registration.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>"<Text style={ [Styles.bold] }>BoulderWorld</Text>" refers to Boulder World Pte Ltd, whose products and services can be purchased and/or redeemed (as the case may be) via the Mobile Application.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>"<Text style={ [Styles.bold] }>Privacy Policy</Text>" means the privacy policy set out in Clause 14 of these Terms and Conditions of Use.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>"<Text style={ [Styles.bold] }>Redeem</Text>" means to redeem BoulderWorld’s products or Services on these Terms and Conditions of Use and "<Text style={ [Styles.bold] }>Redemption</Text>" means the act of redeeming such products or Services.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>"<Text style={ [Styles.bold] }>Register</Text>" means to create an Account on the Mobile Application and "<Text style={ [Styles.bold] }>Registration</Text>" means the act of creating such an Account.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>"<Text style={ [Styles.bold] }>Services</Text>" means all the services provided by BoulderWorld via the Mobile Application to Users, and "Service" means any one of them,</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>"<Text style={ [Styles.bold] }>Users</Text>" means users of the Mobile Application, including you and "User" means any one of them.</Text>

                            {/* space */}
                            <View style={ [Styles.normalSpace] } />
                            <Text style={ [Styles.lightGrayColor, Styles.middleFont,] }>3. GENERAL ISSUES ABOUT THE MOBILE APPLICATION AND THE SERVICES</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>3.1 <Text style={ [Styles.italic] }>Applicability of terms and conditions</Text>: The use of any Services and/or the Mobile Application and the making of any Redemptions are subject to these Terms and Conditions of Use.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>3.2 <Text style={ [Styles.italic] }>Location</Text>: The Mobile Application, the Services and any Redemptions are intended solely for use by Users who access the Mobile Application in Singapore. We make no representation that the Services (or any goods or services) are available or otherwise suitable for use outside of Singapore. Notwithstanding the above, if you access the Mobile Application, use the Services or make any Redemptions from locations outside Singapore, you do so on your own initiative and are responsible for the consequences and for compliance with all applicable laws.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>3.3 <Text style={ [Styles.italic] }>Scope</Text>: The Mobile Application, the Services and any Redemptions are for your non-commercial, personal use only and must not be used for business purposes.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>3.4 <Text style={ [Styles.italic] }>Prevention on use</Text>: We reserve the right to prevent you using the Mobile Application and the Service (or any part of them) and to prevent you from making any Redemptions.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>3.5 <Text style={ [Styles.italic] }>Equipment and Networks</Text>: The provision of the Services and the Mobile Application does not include the provision of a mobile telephone or handheld device or other necessary equipment to access the Mobile Application or the Services or make any Redemptions. To use the Mobile Application or Services or to make Redemptions, you will require Internet connectivity and appropriate telecommunication links. You acknowledge that the terms of agreement with your respective mobile network provider ("<Text style={ [Styles.bold] }>Mobile Provider</Text>") will continue to apply when using the Mobile Application. As a result, you may be charged by the Mobile Provider for access to network connection services for the duration of the connection while accessing the Mobile Application or any such third party charges as may arise. You accept responsibility for any such charges that arise.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>3.6 <Text style={ [Styles.italic] }>Permission to use Mobile Application</Text>: If you are not the bill payer for the mobile telephone or handheld device being used to access the Mobile Application, you will be assumed to have received permission from the bill payer for using the Mobile Application.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>3.7 <Text style={ [Styles.italic] }>License to Use Material</Text>: By submitting any text or images (including photographs) (“<Text style={ [Styles.bold] }>Material</Text>”) via the Application, you represent that you are the owner of the Material, or have proper authorization from the owner of the Material to use, reproduce and distribute it. You hereby grant us a worldwide, royalty-free, non-exclusive license to use the Material to promote any products or services.</Text>

                            {/* space */}
                            <View style={ [Styles.normalSpace] } />
                            <Text style={ [Styles.lightGrayColor, Styles.middleFont,] }>4. REDEMPTIONS</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>4.1 <Text style={ [Styles.italic] }>Need for registration</Text>: You must Register to make a Redemption from the Mobile Application.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>4.2 <Text style={ [Styles.italic] }>Application of these Terms and Conditions of Use</Text>: By making any Redemption, you acknowledge that the Redemption is subject to these Terms and Conditions of Use.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>4.3 <Text style={ [Styles.italic] }>Redemption</Text>: Any attempted Redemption not consistent with these Terms and Conditions of Use may be disallowed or rendered void at the BoulderWorld’s discretion.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>4.4 <Text style={ [Styles.italic] }>Refund</Text>: No refund will be awarded for voided Redemption.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>4.5 <Text style={ [Styles.italic] }>Restrictions</Text>: (a) Reproduction, sale, resale or trading of any products or Redeemed products is prohibited. (b) If any product is Redeemed for less than its face value, there is no entitlement to a credit, cash or Sample equal to the difference between the face value and the amount Redeemed. (c) Redemption of products is subject to availability of the relevant BoulderWorld’s stocks.</Text>

                            {/* space */}
                            <View style={ [Styles.normalSpace] } />
                            <Text style={ [Styles.lightGrayColor, Styles.middleFont,] }>5. YOUR OBLIGATIONS</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>5.1 <Text style={ [Styles.italic] }>BoulderWorld terms</Text>: You agree to (and shall) abide by the terms and conditions of BoulderWorld, as may be amended from time to time.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>5.2 <Text style={ [Styles.italic] }>Accurate information</Text>: You warrant that all information provided on Registration and contained as part of your Account is true, complete and accurate and that you will promptly inform us of any changes to such information by updating the information in your Account.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>5.3 <Text style={ [Styles.italic] }>Content on the Mobile Application and Service</Text>: It is your responsibility to ensure that any products, Services or information available through the Mobile Application meet your specific requirements before making any Redemption.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>5.4 <Text style={ [Styles.italic] }>Prohibitions in relation to usage of Services or Mobile Application</Text>: Without limitation, you undertake not to use or permit anyone else to use the Services or Mobile Application:-</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>5.4.1 to utilize your Account to gain access to BoulderWorld’s product and services</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>5.4.2 to cause annoyance, inconvenience or needless anxiety;</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>5.4.3 for a purpose other than which we have designed them or intended them to be used;</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>5.4.4 for any fraudulent purpose;</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>5.4.5 other than in conformance with accepted Internet practices and practices of any connected networks;</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>5.4.6 in any way which is calculated to incite hatred against any ethnic, religious or any other minority or is otherwise calculated to adversely affect any individual, group or entity; or</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>5.4.7 in such a way as to, or commit any act that would or does, impose an unreasonable or disproportionately large load on our infrastructure.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>5.5 <Text style={ [Styles.italic] }>Prohibitions in relation to usage of Services, Mobile Application</Text>: Without limitation, you further undertake not to or permit anyone else to:-</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>5.5.1 resell any products or Services ;</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>5.5.2 furnish false data including false names, addresses and contact details and fraudulently use credit/debit card numbers;</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>5.5.3 attempt to circumvent our security or network including to access data not intended for you, log into a server or account you are not expressly authorised to access, or probe the security of other networks (such as running a port scan);</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>5.5.4 execute any form of network monitoring which will intercept data not intended for you;</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>5.5.5 enter into fraudulent interactions or transactions with the BoulderWorld (including interacting or transacting purportedly on behalf of a third party where you have no authority to bind that third party or you are pretending to be a third party);</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>5.5.6 extract data from or hack into the Mobile Application;</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>5.5.7 use the Services or Mobile Application in breach of these Terms and Conditions of Use;</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>5.5.8 engage in any unlawful activity in connection with the use of the Mobile Application or the Services; or</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>5.5.9 engage in any conduct which, in our exclusive reasonable opinion, restricts or inhibits any other customer from properly using or enjoying the Mobile Application or Services.</Text>

                            {/* space */}
                            <View style={ [Styles.normalSpace] } />
                            <Text style={ [Styles.lightGrayColor, Styles.middleFont,] }>6. RULES ABOUT USE OF THE SERVICE AND THE MOBILE APPLICATION</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>6.1 We will use reasonable endeavours to correct any errors or omissions as soon as practicable after being notified of them. However, we do not guarantee that the Services or the Mobile Application will be free of faults, and we do not accept liability for any such faults, errors or omissions. In the event of any such error, fault or omission, you should report it by contacting us at climb@boulderworld.com</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>6.2 We do not warrant that your use of the Services or the Mobile Application will be uninterrupted and we do not warrant that any information (or messages) transmitted via the Services or the Mobile Application will be transmitted accurately, reliably, in a timely manner or at all. Notwithstanding that we will try to allow uninterrupted access to the Services and the Mobile Application, access to the Services and the Mobile Application may be suspended, restricted or terminated at any time.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>6.3 We do not give any warranty that the Services and the Mobile Application are free from viruses or anything else which may have a harmful effect on any technology.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>6.4 We reserve the right to change, modify, substitute, suspend or remove without notice any information or Services on the Mobile Application from time to time. Your access to the Mobile Application and/or the Services may also be occasionally restricted to allow for repairs, maintenance or the introduction of new facilities or services. We will attempt to restore such access as soon as we reasonably can. For the avoidance of doubt, we reserve the right to withdraw any information or Services from the Mobile Application at any time.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>6.5 We reserve the right to block access to and/or to edit or remove any material which in our reasonable opinion may give rise to a breach of these Terms and Conditions of Use.</Text>

                            {/* space */}
                            <View style={ [Styles.normalSpace] } />
                            <Text style={ [Styles.lightGrayColor, Styles.middleFont,] }>7. SUSPENSION AND TERMINATION</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>7.1 If you use (or anyone other than you, with your permission uses) the Mobile Application, any Services in contravention of these Terms and Conditions of Use, we may suspend your use of the Services and/or Mobile Application.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>7.2 If we suspend the Services or Mobile Application, we may refuse to restore the Services or Mobile Application for your use until we receive an assurance from you, in a form we deem acceptable, that there will be no further breach of the provisions of these Terms and Conditions of Use.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>7.3 BouderWorld shall fully co-operate with any law enforcement authorities or court order requesting or directing BoulderWorld to disclose the identity or locate anyone in breach of these Terms and Conditions of Use.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>7.4 Without limitation to anything else in this Clause 8, we shall be entitled immediately or at any time (in whole or in part) to: (a) suspend the Services and/or Mobile Application; (b) suspend your use of the Services and/or Mobile Application; and/or (c) suspend the use of the Services and/or Mobile Application for persons we believe to be connected (in whatever manner) to you, if:</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>7.4.1 you commit any breach of these Terms and Conditions of Use;</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>7.4.2 we suspect, on reasonable grounds, that you have, might or will commit a breach of these Terms and Conditions of Use; or</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>7.4.3 we suspect, on reasonable grounds, that you may have committed or be committing any fraud against us or any person.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>7.5 Our rights under this Clause 7 shall not prejudice any other right or remedy we may have in respect of any breach or any rights, obligations or liabilities accrued prior to termination.</Text>

                            {/* space */}
                            <View style={ [Styles.normalSpace] } />
                            <Text style={ [Styles.lightGrayColor, Styles.middleFont,] }>8. DISCLAIMER AND EXCLUSION OF LIABILITY</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>8.1 The Mobile Application, the Services, the information on the Mobile Application and use of all related facilities are provided on an "as is, as available" basis without any warranties whether express or implied.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>8.2 To the fullest extent permitted by applicable law, we disclaim all representations and warranties relating to the Mobile Application and its contents, including in relation to any inaccuracies or omissions in the Mobile Application, warranties of merchantability, quality, fitness for a particular purpose, accuracy, availability, non-infringement or implied warranties from course of dealing or usage of trade.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>8.3 We do not warrant that the Mobile Application will always be accessible, uninterrupted, timely, secure, error free or free from computer virus or other invasive or damaging code or that the Mobile Application will not be affected by any acts of God or other force majeure events, including inability to obtain or shortage of necessary materials, equipment facilities, power or telecommunications, lack of telecommunications equipment or facilities and failure of information technology or telecommunications equipment or facilities.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>8.4 While we may use reasonable efforts to include accurate and up-to-date information on the Mobile Application, we make no warranties or representations as to its accuracy, timeliness or completeness.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>8.5 We shall not be liable for any acts or omissions of any third parties howsoever caused, and for any direct, indirect, incidental, special, consequential or punitive damages, howsoever caused, resulting from or in connection with the mobile application and the services offered in the mobile application, your access to, use of or inability to use the mobile application or the services offered in the mobile application, reliance on or downloading from the mobile application and/or services, or any delays, inaccuracies in the information or in its transmission including but not limited to damages for loss of business or profits, use, data or other intangible, even if we have been advised of the possibility of such damages.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>8.6 We shall not be liable in contract, tort (including negligence or breach of statutory duty) or otherwise howsoever and whatever the cause thereof, for any indirect, consequential, collateral, special or incidental loss or damage suffered or incurred by you in connection with the Mobile Application and these Terms and Conditions of Use. For the purposes of these Terms and Conditions of Use, indirect or consequential loss or damage includes, without limitation, loss of revenue, profits, anticipated savings or business, loss of data or goodwill, loss of use or value of any equipment including software, claims of third parties, and all associated and incidental costs and expenses.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>8.7 The above exclusions and limitations apply only to the extent permitted by law. None of your statutory rights as a consumer that cannot be excluded or limited are affected.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>8.8 Notwithstanding our efforts to ensure that our system is secure, you acknowledge that all electronic data transfers are potentially susceptible to interception by others. We cannot, and do not, warrant that data transfers pursuant to the Mobile Application, or electronic mail transmitted to and from us, will not be monitored or read by others.</Text>

                            {/* space */}
                            <View style={ [Styles.normalSpace] } />
                            <Text style={ [Styles.lightGrayColor, Styles.middleFont,] }>9. INDEMNITY</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>You agree to indemnify and keep us indemnified against any claim, action, suit or proceeding brought or threatened to be brought against us which is caused by or arising out of (a) your use of the Services, (b) any other party’s use of the Services using your user ID, verification PIN and/or any identifier number allocated by BoulderWorld, and/or (c) your breach of any of these Terms and Conditions of Use, and to pay us damages, costs and interest in connection with such claim, action, suit or proceeding.</Text>

                            {/* space */}
                            <View style={ [Styles.normalSpace] } />
                            <Text style={ [Styles.lightGrayColor, Styles.middleFont,] }>10. INTELLECTUAL PROPERTY RIGHTS</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>10.1 All editorial content, information, photographs, illustrations, artwork and other graphic materials, and names, logos and trade marks on the Mobile Application are protected by copyright laws and/or other laws and/or international treaties, and belong to us and/or our suppliers, as the case may be. These works, logos, graphics, sounds or images may not be copied, reproduced, retransmitted, distributed, disseminated, sold, published, broadcasted or circulated whether in whole or in part, unless expressly permitted by us and/or our suppliers, as the case may be.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>10.2 Nothing contained on the Mobile Application should be construed as granting by implication, estoppel, or otherwise, any license or right to use any trademark displayed on the Mobile Application without our written permission. Misuse of any trademarks or any other content displayed on the Mobile Application is prohibited.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>10.3 We will not hesitate to take legal action against any unauthorised usage of our trade marks, name or symbols to preserve and protect its rights in the matter. All rights not expressly granted herein are reserved. Other product and company names mentioned herein may also be the trade marks of their respective owners.</Text>

                            {/* space */}
                            <View style={ [Styles.normalSpace] } />
                            <Text style={ [Styles.lightGrayColor, Styles.middleFont,] }>11. AMENDMENTS</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>11.1 We may periodically make changes to the contents of the Mobile Application, including to the descriptions and prices of goods and services advertised, at any time and without notice. We assume no liability or responsibility for any errors or omissions in the content of the Mobile Application.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>11.2 We reserve the right to amend these Terms and Conditions of Use from time to time without notice. The revised Terms and Conditions of Use will be posted on the Mobile Application and shall take effect from the date of such posting. You are advised to review these terms and conditions periodically as they are binding upon you.</Text>

                            {/* space */}
                            <View style={ [Styles.normalSpace] } />
                            <Text style={ [Styles.lightGrayColor, Styles.middleFont,] }>12. APPLICABLE LAW AND JURISDICTION</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>12.1 The Mobile Application can be accessed from all countries around the world where the local technology permits. As each of these places have differing laws, by accessing the Mobile Application both you and we agree that the laws of the Republic of Singapore, without regard to the conflicts of laws principles thereof, will apply to all matters relating to the use of the Mobile Application.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>12.2 You accept and agree that both you and we shall submit to the exclusive jurisdiction of the courts of the Republic of Singapore in respect of any dispute arising out of and/or in connection with these Terms and Conditions of Use.</Text>

                            {/* space */}
                            <View style={ [Styles.normalSpace] } />
                            <Text style={ [Styles.lightGrayColor, Styles.middleFont,] }>13. PRIVACY POLICY</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>13.1 Access to the Mobile Application and use of the Services offered on the Mobile Application by BoulderWorld and/or its group of companies is subject to this Privacy Policy. By accessing the Mobile Application and by continuing to use the Services offered, you are deemed to have accepted this Privacy Policy, and in particular, you are deemed to have consented to our use and disclosure of your personal information in the manner prescribed in this Privacy Policy and for the purposes set out in Clauses 3.7 and/or 4.1. We reserve the right to amend this Privacy Policy from time to time. If you disagree with any part of this Privacy Policy, you must immediately discontinue your access to the Mobile Application and your use of the Services.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>13.2 As part of the normal operation of our Services, we collect, use and, in some cases, disclose information about you to third parties. Accordingly, we have developed this Privacy Policy in order for you to understand how we collect, use, communicate and disclose and make use of your personal information when you use the Services on the Mobile Application:-</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>(a) Before or at the time of collecting personal information, we will identify the purposes for which information is being collected.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>(b) We will collect and use of personal information solely with the objective of fulfilling those purposes specified by us and for other compatible purposes, unless we obtain the consent of the individual concerned or as required by law.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>(c) We will only retain personal information as long as necessary for the fulfillment of those purposes.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>(d) We will collect personal information by lawful and fair means and, where appropriate, with the knowledge or consent of the individual concerned.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>(e) Personal information should be relevant to the purposes for which it is to be used, and, to the extent necessary for those purposes, should be accurate, complete, and up-to-date.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>(f) We will protect personal information by reasonable security safeguards against loss or theft, as well as unauthorized access, disclosure, copying, use or modification.</Text>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>We are committed to conducting our business in accordance with these principles in order to ensure that the confidentiality of personal information is protected and maintained.</Text>
                        </ScrollView>
                    </View>
                </View>
            </ImageBackground>
		);
	}
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'center'
    },
    contentContainer: {
        alignSelf: 'stretch', 
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'       
    }
})

TermsAndConditionsPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};