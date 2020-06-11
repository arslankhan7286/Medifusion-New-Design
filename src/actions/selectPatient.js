export const selectPatient = (patientInfo ) => {

    return {
        type: 'SELECT_PATIENT',
        payload: patientInfo
    }
};