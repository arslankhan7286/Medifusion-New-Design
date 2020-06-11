import { combineReducers } from "redux";
import userReducer from "./reducer-user";
import ActiveUserReducer from "./reducer-active-user";
import selectedTabReducer from "./selectedTabReducer";
import selectedTabPageReducer from "./selectedTabPageReducer";
import showPracticeReducer from "./showPracticeReducer";
import leftNavMenusReducer from "./leftNavMenusReducer";
import LoginReducer from "./LoginReducer";
import LoginInfoReducer from "./LoginInfoReducer";
import selectPatientReducers from "./selectPatientReducer";
import CPTReducer from "./CPTReducer";
import ICDReducer from "./ICDReducer";
import POSReducer from "./POSReducer";
import ModifierReducer from "./ModifierReducer";
import TaxonomyCodesReducers from './TaxonomyReducer';
import SetICDReducer from './SetICDReducer';
import setCPTReducer from './SetCPTReducer';
import ProviderReducer from './ProviderReducer';
import RefProviderReducer from './RefProviderReducer';
import LocationReducer from './LocationReducer';
import SetVisitGridDataReducer from './SetVisitGridDataReducer';
import SetPaymentGridDataReducer from './SetPaymentGridDataReducer';
import SetPatientGridDataReducer from './SetPatientGridDataReducer';
import setDateReducer from './setDateReducer';
import insurancePlans from './InsurancePlanReducer';
import ReceiverRducer from "./ReceiverReducer";
import AdjustmentCodeReducer from './AdjustmentCodeReducer';
import RemarkCodeReducer from './RemarkCodeReducer';
import MoreAlertReducer from "./MoreAlertReducer";
import TopFormReducer from "./TopFormReducer";

const allReducers = combineReducers({
  // users: userReducer,
  // activeUser: ActiveUserReducer,
  loginToken: LoginReducer,
  loginInfo: LoginInfoReducer,
  selectedTab: selectedTabReducer,
  selectedTabPage: selectedTabPageReducer,
  selectPatient: selectPatientReducers,
  //selectedPopup: showPracticeReducer,
  leftNavigationMenus: leftNavMenusReducer,
  CPTReducer: CPTReducer,
  ICDReducer: ICDReducer,
  POSReducer: POSReducer,
  ModifierReducer: ModifierReducer,
  TaxonomyCodesReducers:TaxonomyCodesReducers,
  SetICDReducer:SetICDReducer,
  setCPTReducer:setCPTReducer,
  ProviderReducer:ProviderReducer,
  RefProviderReducer:RefProviderReducer,
  LocationReducer:LocationReducer,
  VisitGridDataReducer:SetVisitGridDataReducer,
  PaymentGridDataReducer:SetPaymentGridDataReducer,
  PatientGridDataReducer:SetPatientGridDataReducer,
  LeftMenuDates:setDateReducer,
  insurancePlans:insurancePlans,
  receivers:ReceiverRducer,
  adjustmentCodes:AdjustmentCodeReducer,
  remarkCodes:RemarkCodeReducer,
  MoreAlertReducer: MoreAlertReducer,
  TopFormReducer: TopFormReducer,
  url: "http://192.168.110.44/database/api"
});

export default allReducers;
