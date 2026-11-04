export const isNonEmptyString = (value) => {
    return typeof value === "string" && value.trim().length > 0;
};

export const isNonNegativeInteger = (value) => {
    return Number.isInteger(value) && value >= 0;
};

export const isPositiveIntegerString = (value) => {
    return /^[1-9]\d*$/.test(value);
};

export const isPositiveInteger = (value) => {
    return Number.isInteger(value) && value > 0;
};

export const isNonNegativeNumber = (value) => {
    return typeof value === "number" && Number.isFinite(value) && value >= 0;
};

export const isValidDate = (value) => {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

export const isValidTime = (value) => {
    return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
};

export const isValidEmail = (value) => {
    return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};
