const FieldStagesEnum = require('../enums/fieldStagesEnum');
const FIELDSTATUSENUM = require('../enums/fieldStatusEnum');
const AppError = require('../utils/appError');

/**
 * FieldStatusCalculator - Calculates field health status based on planting date and current stage
 * 
 * Status Rules:
 * - HARVESTED → COMPLETED (field is done)
 * - PLANTED/GROWING within growth window → ACTIVE (on track)
 * - READY beyond harvest window (>90 days) → AT_RISK (needs attention)
 * - Backward stage progression → AT_RISK (data integrity issue)
 */
class FieldStatusCalculator {
    // Configuration constants for easy maintainability
    static CONFIG = {
        GROWTH_WINDOW_DAYS: 90, // Expected growth period before ready to harvest
        HARVEST_WINDOW_DAYS: 30, // Days field can stay in READY state before at risk
        STAGE_ORDER: ['planted', 'growing', 'ready', 'harvested'], // Expected progression
    };

    calculateFieldStatus(field) {
        try {
            // Input validation
            if (!field || typeof field !== 'object') {
                throw new AppError('Field object is required', 400);
            }

            if (!field.plantingDate) {
                throw new AppError('Field must have a plantingDate', 400);
            }

            if (!field.currentStage) {
                throw new AppError('Field must have a currentStage', 400);
            }

            // Validate stage is valid
            const validStages = Object.values(FieldStagesEnum.STAGE);
            if (!validStages.includes(field.currentStage)) {
                throw new AppError(`Invalid stage: ${field.currentStage}`, 400);
            }

            // Parse dates safely (use UTC to avoid timezone issues)
            const plantingDate = new Date(field.plantingDate);
            if (isNaN(plantingDate.getTime())) {
                throw new AppError(`Invalid plantingDate format: ${field.plantingDate}`, 400);
            }

            const currentDate = new Date();
            // Calculate days elapsed since planting
            const daysElapsed = Math.floor((currentDate - plantingDate) / (1000 * 60 * 60 * 24));

            // If negative days, planting date is in future
            if (daysElapsed < 0) {
                return {
                    status: FIELDSTATUSENUM.STATUS.ACTIVE,
                    message: 'Field planting date is in the future',
                    daysElapsed: 0,
                    riskLevel: 'low',
                };
            }

            // Determine status based on stage and elapsed time
            return this.getStatusByStage(field.currentStage, daysElapsed);

        } catch (error) {
            // Return error in consistent format
            return {
                status: FIELDSTATUSENUM.STATUS.ACTIVE, // Default to safe status
                message: `Status calculation error: ${error.message}`,
                daysElapsed: 0,
                riskLevel: 'unknown',
                error: true,
            };
        }
    }

    getStatusByStage(stage, daysElapsed) {
        // Determines status based on stage and time elapsed for a particular field
        switch (stage) {
            case FieldStagesEnum.STAGE.HARVESTED:
                return {
                    status: FIELDSTATUSENUM.STATUS.COMPLETED,
                    message: 'Field has been harvested',
                    daysElapsed,
                    riskLevel: 'none',
                };

            case FieldStagesEnum.STAGE.READY:
                // Field in READY stage beyond harvest window is at risk
                if (daysElapsed > FieldStatusCalculator.CONFIG.GROWTH_WINDOW_DAYS + FieldStatusCalculator.CONFIG.HARVEST_WINDOW_DAYS) {
                    return {
                        status: FIELDSTATUSENUM.STATUS.AT_RISK,
                        message: `Field ready for harvest for ${daysElapsed - FieldStatusCalculator.CONFIG.GROWTH_WINDOW_DAYS} days. Immediate action needed.`,
                        daysElapsed,
                        riskLevel: 'high',
                    };
                }
                return {
                    status: FIELDSTATUSENUM.STATUS.ACTIVE,
                    message: 'Field is ready for harvest',
                    daysElapsed,
                    riskLevel: 'low',
                };

            case FieldStagesEnum.STAGE.GROWING:
                // Growing stage is normal active
                if (daysElapsed > FieldStatusCalculator.CONFIG.GROWTH_WINDOW_DAYS) {
                    return {
                        status: FIELDSTATUSENUM.STATUS.AT_RISK,
                        message: `Field has been growing for ${daysElapsed} days. Should have progressed to READY stage.`,
                        daysElapsed,
                        riskLevel: 'medium',
                    };
                }
                return {
                    status: FIELDSTATUSENUM.STATUS.ACTIVE,
                    message: 'Field is actively growing',
                    daysElapsed,
                    riskLevel: 'low',
                };

            case FieldStagesEnum.STAGE.PLANTED:
                // Recently planted is active
                if (daysElapsed > FieldStatusCalculator.CONFIG.GROWTH_WINDOW_DAYS) {
                    return {
                        status: FIELDSTATUSENUM.STATUS.AT_RISK,
                        message: `Field has been planted for ${daysElapsed} days without stage progression. Please update stage.`,
                        daysElapsed,
                        riskLevel: 'medium',
                    };
                }
                return {
                    status: FIELDSTATUSENUM.STATUS.ACTIVE,
                    message: 'Field recently planted',
                    daysElapsed,
                    riskLevel: 'low',
                };

            default:
                return {
                    status: FIELDSTATUSENUM.STATUS.ACTIVE,
                    message: `Unknown stage: ${stage}`,
                    daysElapsed,
                    riskLevel: 'unknown',
                };
        }
    }


    computeStatusForFields(fields) {
        // Computes status for an array of fields
        if (!Array.isArray(fields)) {
            // Invalid input
            return [];
        }

        return fields.map(field => {
            const { status, message, daysElapsed, riskLevel, error } = this.calculateFieldStatus(field);
            return {
                ...field,
                status,
                statusMessage: message,
                daysElapsed,
                riskLevel,
                ...(error && { statusError: true }), // Flag calculation errors
            };
        });
    }
}

module.exports = new FieldStatusCalculator();