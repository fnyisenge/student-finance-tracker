export const validateRecord = (record) => {
    const descRegex = /^\S(?:.*\S)?$/;
    const amountRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    const categoryRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

    if (!descRegex.test(record.description)) return { valid: false, message: 'Invalid description' };
    if (!amountRegex.test(record.amount)) return { valid: false, message: 'Invalid amount' };
    if (!dateRegex.test(record.date)) return { valid: false, message: 'Invalid date' };
    if (!categoryRegex.test(record.category)) return { valid: false, message: 'Invalid category' };

    return { valid: true };
};
