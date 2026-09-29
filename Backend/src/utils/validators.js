export const isNonEmptyString = (value) => {
    return typeof value === "string" && value.trim().length > 0;
};

export const isNonNegativeInteger = (value) => {
    return Number.isInteger(value) && value >= 0;
};

export const isPositiveIntegerString = (value) => {
    return /^[1-9]\d*$/.test(value);
};
