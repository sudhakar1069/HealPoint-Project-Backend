import { Op } from "sequelize";

export const getDateRangeFilter = (month?: number, year?: number) => {
    if (month && year) {
        return {
            [Op.between]: [
                new Date(year, month - 1, 1),
                new Date(year, month, 0)
            ]
        };
    }
    if (year) {
        return {
            [Op.between]: [
                new Date(year, 0, 1),
                new Date(year, 11, 31)
            ]
        };
    }
    if (month) {
        const currentYear = new Date().getFullYear();
        return {
            [Op.between]: [
                new Date(currentYear, month - 1, 1),
                new Date(currentYear, month, 0)
            ]
        };
    }
    return undefined;
};