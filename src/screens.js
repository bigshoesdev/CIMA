/* eslint-disable import/prefer-default-export */
import { Navigation } from 'react-native-navigation';

// registration
import PhonenumberPage from './Registration/PhonenumberPage';
import OnboardingContainer from './Registration/OnboardingContainer';
import VerificationPage from './Registration/VerificationPage';
import NamePage from './Registration/NamePage';
import NameUpdatePage from './Registration/NameUpdatePage';
import NRICPage from './Registration/NRICPage';
import NRICUpdatePage from './Registration/NRICUpdatePage';
import DOBPage from './Registration/DOBPage';
import DOBUpdatePage from './Registration/DOBUpdatePage';
import EmergencyContactPage from './Registration/EmergencyContactPage';
import GuardianContactPage from './Registration/GuardianContactPage';
import EmergencyContactUpdatePage from './Registration/EmergencyContactUpdatePage';
import SelfiePage from './Registration/SelfiePage';
import SummaryPage from './Registration/SummaryPage';
import WaiverPage from './Registration/WaiverPage';
import PhoneAuth from './Registration/PhoneAuth';

// main
import HomePage from './Main/HomePage';
import SettingsPage from './Main/SettingsPage';
import PurchasePage from './Main/PurchasePage';

// settings
import PersonalInfoPage from './Settings/PersonalInfoPage';
import QualificationPage from './Settings/QualificationPage';
import RecordPage from './Settings/RecordPage';
import ViewIndemnityPage from './Settings/ViewIndemnityPage';
import TermsAndConditionsPage from './Settings/TermsAndConditionsPage';
import FeedbackPage from './Settings/FeedbackPage';
import NoEmailPage from './Settings/NoEmailPage';
import EditPersonalInfoPage from './Settings/EditPersonalInfoPage';

// passes
import PassInOutPage from './Passes/PassInOutPage';
import QRCodePage from './Passes/QRCodePage';
import AfterScanoutPage from './Passes/AfterScanoutPage';

// buy
import PassesPage from './Buy/PassesPage';
import RentalPage from './Buy/RentalPage';
import CartPage from './Buy/CartPage';
import MultipassPage from './Buy/MultipassPage';
import DaypassPage from './Buy/DaypassPage';
import SeasonpassPage from './Buy/SeasonpassPage';
import ShoeRentalPage from './Buy/ShoeRentalPage';
import SockRentalPage from './Buy/SockRentalPage';
import GearRentalPage from './Buy/GearRentalPage';
import CourseAndWorkshopPage from './Buy/CourseAndWorkshopPage';
import CourseDetailPage from './Buy/CourseDetailPage';

// other
import SuccessPage from './utils/SuccessPage';
import PaymentSuccessPage from './utils/PaymentSuccessPage';

export function registerScreens(store, Provider) {
	
	// registration
	Navigation.registerComponent('Registration.PhonenumberPage', () => PhonenumberPage, store, Provider);
	Navigation.registerComponent('Registration.OnboardingContainer', () => OnboardingContainer, store, Provider);
	Navigation.registerComponent('Registration.VerificationPage', () => VerificationPage, store, Provider);
	Navigation.registerComponent('Registration.NRICPage', () => NRICPage, store, Provider);
	Navigation.registerComponent('Registration.NRICUpdatePage', () => NRICUpdatePage, store, Provider);
	Navigation.registerComponent('Registration.NamePage', () => NamePage, store, Provider);
	Navigation.registerComponent('Registration.NameUpdatePage', () => NameUpdatePage, store, Provider);
	Navigation.registerComponent('Registration.DOBPage', () => DOBPage, store, Provider);
	Navigation.registerComponent('Registration.DOBUpdatePage', () => DOBUpdatePage, store, Provider);
	Navigation.registerComponent('Registration.EmergencyContactPage', () => EmergencyContactPage, store, Provider);
	Navigation.registerComponent('Registration.GuardianContactPage', () => GuardianContactPage, store, Provider);
	Navigation.registerComponent('Registration.EmergencyContactUpdatePage', () => EmergencyContactUpdatePage, store, Provider);
	Navigation.registerComponent('Registration.SelfiePage', () => SelfiePage, store, Provider);
	Navigation.registerComponent('Registration.SummaryPage', () => SummaryPage, store, Provider);
	Navigation.registerComponent('Registration.WaiverPage', () => WaiverPage, store, Provider);
	Navigation.registerComponent('Registration.PhoneAuth', () => PhoneAuth, store, Provider);

	// Main
	Navigation.registerComponent('Main.HomePage', () => HomePage, store, Provider);
	Navigation.registerComponent('Main.SettingsPage', () => SettingsPage, store, Provider);
	Navigation.registerComponent('Main.PurchasePage', () => PurchasePage, store, Provider);

	// Setting
	Navigation.registerComponent('Settings.PersonalInfoPage', () => PersonalInfoPage, store, Provider);
	Navigation.registerComponent('Settings.QualificationPage', () => QualificationPage, store, Provider);
	Navigation.registerComponent('Settings.RecordPage', () => RecordPage, store, Provider);
	Navigation.registerComponent('Settings.ViewIndemnityPage', () => ViewIndemnityPage, store, Provider);
	Navigation.registerComponent('Settings.TermsAndConditionsPage', () => TermsAndConditionsPage, store, Provider);
	Navigation.registerComponent('Settings.FeedbackPage', () => FeedbackPage, store, Provider);
	Navigation.registerComponent('Settings.NoEmailPage', () => NoEmailPage, store, Provider);
	Navigation.registerComponent('Settings.EditPersonalInfoPage', () => EditPersonalInfoPage, store, Provider);

	// Passes
	Navigation.registerComponent('Passes.PassInOutPage', () => PassInOutPage, store, Provider);
	Navigation.registerComponent('Passes.QRCodePage', () => QRCodePage, store, Provider);
	Navigation.registerComponent('Passes.AfterScanoutPage', () => AfterScanoutPage, store, Provider);

	// Buy
	Navigation.registerComponent('Buy.PassesPage', () => PassesPage, store, Provider);
	Navigation.registerComponent('Buy.RentalPage', () => RentalPage, store, Provider);
	Navigation.registerComponent('Buy.CartPage', () => CartPage, store, Provider);
	Navigation.registerComponent('Buy.MultipassPage', () => MultipassPage, store, Provider);
	Navigation.registerComponent('Buy.DaypassPage', () => DaypassPage, store, Provider);
	Navigation.registerComponent('Buy.SeasonpassPage', () => SeasonpassPage, store, Provider);
	Navigation.registerComponent('Buy.ShoeRentalPage', () => ShoeRentalPage, store, Provider);
	Navigation.registerComponent('Buy.SockRentalPage', () => SockRentalPage, store, Provider);
	Navigation.registerComponent('Buy.GearRentalPage', () => GearRentalPage, store, Provider);
	Navigation.registerComponent('Buy.CourseAndWorkshopPage', () => CourseAndWorkshopPage, store, Provider);
	Navigation.registerComponent('Buy.CourseDetailPage', () => CourseDetailPage, store, Provider);

	// Other
	Navigation.registerComponent('Utils.SuccessPage', () => SuccessPage, store, Provider);
	Navigation.registerComponent('Utils.PaymentSuccessPage', () => PaymentSuccessPage, store, Provider);
}
