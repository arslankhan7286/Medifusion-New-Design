// import clientIcon from "../images/icons/client.png";
// import clientHIcon from "../images/icons/clienth.png";
// import userIcon from "../images/icons/user.png";
// import userHIcon from "../images/icons/userh.png";
// import teamIcon from "../images/icons/team.png";
// import teamHIocn from "../images/icons/teamh.png";
import practiceIcon from "../images/icons/practice.png";
import practiceHIocn from "../images/icons/practiceh.png";
import providerIocn from "../images/provider.png";
import providerHIcon from "../images/icons/providerh.png";
import refProviderIcon from "../images/icons/refProvider.png";
import refProviderHIcon from "../images/icons/refProviderh.png";
import insuranceIcon from "../images/icons/insurance.png";
import insuranceHIocn from "../images/icons/insuranceh.png";
import insurancePlanIcon from "../images/icons/insurancePlan.png";
import insurancePlanHIcon from "../images/icons/insurancePlanh.png";
import insurancePlanAddressIcon from "../images/icons/insurancePlanAddress.png";
import insurancePlanAddressHIcon from "../images/icons/insurancePlanAddressh.png";
// import submitIocn from "../images/icons/submit.png";
// import submitHIcon from "../images/icons/submith.png";
// import eligibilityIcon from "../images/icons/eligibility.png";
// import eligibilityHIcon from "../images/icons/eligibilityh.png";
// import statusIcon from "../images/icons/status.png";
// import statusHIcon from "../images/icons/statush.png";
import icdIcon from "../images/icons/icd.png";
import icdHIcon from "../images/icons/icdh.png";
import cptIcon from "../images/icons/cpt.png";
import cptHIcon from "../images/icons/cpth.png";
import modifierIcon from "../images/icons/modifier.png";
import modifierHIcon from "../images/icons/modifierh.png";
import posIcon from "../images/icons/pos.png";
import posHIcon from "../images/icons/posh.png";
// import adjustmentIcon from "../images/icons/adjustment.png";
// import adjustmentHIcon from "../images/icons/adjustmenth.png";
// import remarkIocn from "../images/icons/remark.png";
// import remarkHIcon from "../images/icons/remarkh.png";
// import receiverIcon from "../images/icons/receiver.png";
// import receiverHIcon from "../images/icons/receiverh.png";

import facilityIcon from "../images/facility-icon.png";
import facilityHIcon from "../images/facility-icon-hover.png";
import locationIcon from "../images/icons/location.png";
import locationHIcon from "../images/icons/locationh.png";
import provIcon from "../images/provider-icon.png";
import provHIcon from "../images/provider-icon-hover.png";
import refprovIcon from "../images/referring-icon.png";
import refprovHIcon from "../images/referring-icon-hover.png";

export default function(state = [], action) {
  //alert(action.payload)
  let lefNav = [];
  let selectedTab = "";

  try {
    selectedTab =
      action.payload !== undefined ? action.payload.selectedTab : "";
  } catch {}
  switch (selectedTab) {
    case "Patient":
      break;

    case "Reports":
      break;
    case "Documents":
      break;

    case "Submissions":
      //alert('submissions');
      break;

    case "CLIENT":
    case "USER":
    case "FACILITY":
    case "LOCATION":
    case "PROVIDER":
    case "REFERRING PROVIDER":
    case "INSURANCE":
    case "INSURANCE PLAN":
    case "INSURANCE PLAN ADDRESS":
    case "CPT":
    case "ICD":
    case "MODIFIERS":
    case "POS":
    case "EDI SUBMIT PAYER":
    case "EDI ELIGIBILITY PAYER":
    case "EDI STATUS PAYER":
    case "CLAIM STATUS CATEGORY CODES":
    case "CLAIM STATUS CODES":
    case "ADJUSTMENT CODES":
    case "REMARK CODES":
    case "Setup":
      lefNav = [
        {
          Category: "CLIENT SETUP",
          Icon: "",
          hIcon: "",
          expanded: true,
          SubCategories: [
            {
              SubCategory: "Client",
              Icon: facilityIcon,
              hIcon: facilityHIcon,
              selected: selectedTab === "CLIENT" ? true : false
            },
            {
              SubCategory: "User",
              Icon: locationIcon,
              hIcon: locationHIcon,
              selected: action.payload === "USER" ? true : false
            },
            {
              SubCategory: "Team",
              Icon: locationIcon,
              hIcon: locationHIcon,
              selected: action.payload === "TEAM" ? true : false
            }
          ]
        },
        {
          Category: "ADMIN",
          Icon: "",
          hIcon: "",
          expanded: false,
          SubCategories: [
            {
              SubCategory: "Practice",
              Icon: practiceIcon,
              hIcon: practiceHIocn,
              selected: selectedTab === "PRACTICE" ? true : false
            },
            {
              SubCategory: "Location",
              Icon: locationIcon,
              hIcon: locationHIcon,
              selected: action.payload === "LOCATION" ? true : false
            },
            {
              SubCategory: "Provider",
              Icon: providerIocn,
              hIcon: providerHIcon,
              selected: false
            },
            {
              SubCategory: "Referring Provider",
              Icon: refProviderIcon,
              hIcon: refProviderHIcon,
              selected: false
            }
          ]
        },
        {
          Category: "INSURANCE",
          Icon: "",
          handler: "",
          expanded: false,
          SubCategories: [
            {
              SubCategory: "Insurance",
              Icon: insuranceIcon,
              hIcon: insuranceHIocn,
              selected: false
            },
            {
              SubCategory: "Insurance Plan",
              Icon:insurancePlanIcon,
              hIcon: insurancePlanIcon,
              selected: false
            },
            {
              SubCategory: "Insurance Plan Address",
              Icon: insurancePlanAddressIcon,
              hIcon: insurancePlanAddressHIcon,
              selected: false
            },
            {
              SubCategory: "EDI Submit Payer",
              Icon: provIcon,
              hIcon: provHIcon,
              selected: false
            },
            {
              SubCategory: "EDI Eligibility Payer",
              Icon: provIcon,
              hIcon: provHIcon,
              selected: false
            },
            {
              SubCategory: "EDI Status Payer",
              Icon: provIcon,
              hIcon: provHIcon,
              selected: false
            }
          ]
        },
        {
          Category: "CODING",
          Icon: "",
          handler: "",
          expanded: false,
          SubCategories: [
            {
              SubCategory: "ICD",
              Icon: icdIcon,
              hIcon: icdHIcon,
              selected: false
            },
            {
              SubCategory: "CPT",
              Icon: cptIcon,
              hIcon: cptHIcon,
              selected: false
            },
            {
              SubCategory: "Modifiers",
              Icon: modifierIcon,
              hIcon: modifierHIcon,
              handler: () => this.props.selectTabPageAction("MODIFIER"),
              selected: false
            },
            {
              SubCategory: "POS",
              Icon: posIcon,
              hIcon: posHIcon,
              handler: () => this.props.selectTabPageAction("POS"),
              selected: false
            }
          ]
        },
        {
          Category: "EDI CODES",
          Icon: "",
          handler: "",
          expanded: false,
          SubCategories: [
            {
              SubCategory: "Claim Status Category Codes",
              Icon: facilityIcon,
              hIcon: facilityHIcon,
              handler: () => this.props.selectTabPageAction("CS_CAT_CODES"),
              selected: false
            },
            {
              SubCategory: "Claim Status Codes",
              Icon: locationIcon,
              hIcon: locationHIcon,
              handler: () => this.props.selectTabPageAction("CS_CODES"),
              selected: false
            },
            {
              SubCategory: "Adjustment Codes",
              Icon: provIcon,
              hIcon: provHIcon,
              handler: () => this.props.selectTabPageAction("ADJUSTMENT CODES"),
              selected: false
            },
            {
              SubCategory: "Remark Codes",
              Icon: provIcon,
              hIcon: provHIcon,
              handler: () => this.props.selectTabPageAction("REMARK_CODES"),
              selected: false
            }
          ]
        },
        {
          Category: "RECIVER SETUP",
          Icon: "",
          handler: "",
          expanded: false,
          SubCategories: [
            {
              SubCategory: "Receiver",
              Icon: facilityHIcon,
              hIcon: facilityHIcon,
              handler: () => this.props.selectTabPageAction("RECEIVER"),
              selected: false
            },
            {
              SubCategory: "Submitter",
              Icon: locationIcon,
              hIcon: locationHIcon,
              handler: () => this.props.selectTabPageAction("SUBMITTER"),
              selected: false
            }
          ]
        }
      ];

      break;
  }

  //console.log(lefNav)
  return lefNav;
}
