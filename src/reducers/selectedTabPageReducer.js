export default function(state = null, action) {
  switch (action.type) {
    case "CLIENT":
    case "USER":
    case "TEAM":
    case "PRACTICE":
    case "LOCATION":
    case "PROVIDER":
    case "REFERRING PROVIDER":
    case "INSURANCE":
    case "INSURANCE PLAN":
    case "INSURANCE PLAN ADDRESS":
      case "INSURANCE PORTAL":
    case "ICD":
    case "CPT":
    case "MODIFIERS":
    case "POS":
    case "CLAIM STATUS CATEGORY CODES":
    case "CLAIM STATUS CODES":
    case "ADJUSTMENT CODES":
    case "REMARK CODES":
    case "EDI SUBMIT PAYER":
    case "EDI ELIGIBILITY PAYER":
    case "EDI STATUS PAYER":
    case "ELECTRONIC SUBMISSION":
    case "PAPER SUBMISSION":
    case "SUBMISSION LOG":
    case "REPORTS LOG":
    case "DEMOGRAPHICS":
    case "PLAN":
    case "PAYMENT":
    case "NEWCHARGE":
    case "CHARGE":
    case "HCFA1500":
    case "CHARGEPAYMENT":
    case "HISTORY":
    case "Visit":
    case "PLAN FOLLOW UP":
    case "PATIENT FOLLOW UP":
    case "GROUP":
    case "ACTION":
    case "REASON":
    case "BATCHDOCUMENT":
    case "DOCUMENTTYPE":
    case "PROVIDER SCHEDULE":
    case "DAY SHEET":
    case "CALENDARSCHEDULER":
    case "RECEIVER":
    case "UNIT REPORT":
    case "AGING SUMMARY REPORT":
    case "COLLECTION REPORT":
    case "PATIENT VISIT REPORT":
    case "SUBMITTER":
    case "FOLLOWUP":
    case "APPOINTMENT STATUS":
    case "PENDING CLAIMS":
    case "AGING DETAIL REPORT":
    case "COPAY COLLECTION":
    case "REFERRAL PHYSICIAN":
    case "PATIENT SHEET":
    case "CHARGES SHEET":
    case "INSURANCE MAPPING":
    case "PATIENT AUTHORIZATION":
    case "STATEMENT LOG":
      return action.payload;
      break;
    case "USER_INFO":
      return "Dashboard";
      break;
  }
  return state;
}
