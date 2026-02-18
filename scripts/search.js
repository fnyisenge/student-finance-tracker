export const compileRegex = (input, flags='i') => {
    try { return new RegExp(input, flags); }
    catch { return null; }
};

export const highlight = (text, re) => {
    if (!re) return text;
    return text.replace(re, match => `<mark>${match}</mark>`);
};
