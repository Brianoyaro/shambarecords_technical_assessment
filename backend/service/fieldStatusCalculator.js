const { FieldStageEnum } = require('../models/field');
const FIELDSTATUSENUM = require('../enums/fieldStatusEnum');

/*
@param {Object} field - The field object containing plantingDate and currentStage
@return {status, message} - The calculated stage of the field based on plantingDate and current date
*/
class FieldStatusCalculator {
    calculateFieldStage(field) {
        const currentDate = new Date();
        const plantingDateObj = new Date(field.plantingDate);
        const daysSincePlanting = Math.floor((currentDate - plantingDateObj) / (1000 * 60 * 60 * 24));
        
        // if the field stage is planted and days passed since planting is less than 90, then the field is active, otherwise it is ready for harvest
        let currentStage = field.currentStage;
        let status;

        if (currentStage === FieldStageEnum.STAGE.HARVEDTED) {
            return { status: FIELDSTATUSENUM.STATUS.COMPLETED, message: 'Field has been harvested' };
        }
        // the field is ready for harvesting but has been in that stage for more than 90 days, then it is at risk
        if ([FieldStageEnum.STAGE.READY, FieldStageEnum.STAGE.GROWING, FieldStageEnum.STAGE.PLANTED].includes(currentStage) && daysSincePlanting >= 90) {
            return { status: FIELDSTATUSENUM.STATUS.AT_RISK, message: 'Field is at risk' };
        }
        return { status: FIELDSTATUSENUM.STATUS.ACTIVE, message: 'Field is active' };
    }
    computeStatusForFields(fields) {
        return fields.map(field => {
            const { status, message } = this.calculateFieldStage(field);
            return {
                ...field,
                status,
                statusMessage: message,
            };
        });
    }
}

module.exports = new FieldStatusCalculator();

