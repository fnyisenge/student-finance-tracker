export function validateDescription(value) {
  return /^\S(?:.*\S)?$/.test(value.trim());
}

export function validateAmount(value) {
  return /^(0|[1-9]\d*)(\.\d{1,2})?$/.test(value);
}

export function validateCategory(value) {
  return /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/.test(value.trim());
}

export function validateDate(value) {
  return /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value);
}

export function validateDuplicateWords(value) {
  return !/\b(\w+)\s+\1\b/i.test(value);
}
