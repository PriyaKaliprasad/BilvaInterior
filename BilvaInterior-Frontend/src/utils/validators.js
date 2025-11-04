const minMaxLengthWarning = (value) => {
  if (value?.length < 5) return 'Should be at least 5 characters long.';
  if (value?.length > 100) return 'Should not exceed 100 characters.';
  return '';
};

// Non-blocking validator: always returns undefined
const minMaxLengthValidator = (value) => {
  return undefined;
};
const nameValidator = (value) =>
    !value ? 'Required' : value.length < 3 ? 'Should be at least 3 characters long.' : '';

const emailRegex = new RegExp(/\S+@\S+\.\S+/);
const emailValidator = (value) => (emailRegex.test(value) ? '' : 'Please enter a valid email.');

const emailWarning = (value) => {
  if (!value) return '';
  if (!emailRegex.test(value)) return 'Please enter a valid email.';
  return '';
};

const passwordValidator = (value) => (value && value.length >= 8 ? '' : 'Password must be at least 8 characters.');

const phoneValidator = (value) => {
  // Remove everything except digits
  const digits = (value || "").replace(/\D/g, "");

  if (!digits) {
    return "Phone is required";
  }

  if (digits.length !== 10) {
    return "Phone must be 10 digits.";
  }

  return "";
};

const phoneWarning = (value) => {
  // Only show warning if value is present but not valid
  const digits = (value || "").replace(/\D/g, "");
  if (!value) return "";
  if (digits.length !== 10) return "Phone should be 10 digits.";
  return "";
};

const pincodeValidator = (value) => {
  // Keep only digits
  const digits = (value || "").replace(/\D/g, "");

  if (!digits) {
    return "Pincode is required";
  }

  if (digits.length !== 6) {
    return "Pincode must be 6 digits.";
  }

  return "";
};

const imageValidator = (files) => {
  if (!files || files.length === 0) return 'Profile picture is required';
  const file = files[0]?.getRawFile ? files[0].getRawFile() : files[0];
  if (!file) return 'Profile picture is required';
  if (!['image/jpeg', 'image/png'].includes(file.type)) return 'Only JPG or PNG allowed';
  if (file.size > 500 * 1024) return 'Max file size is 500KB';
  return '';
};

const requiredValidator = (value) => {
    if (value === undefined || value === null || value === "") {
      return "This field is required.";
    }
    return "";
  };

export { nameValidator, emailValidator, emailWarning, passwordValidator, phoneValidator, phoneWarning, pincodeValidator, imageValidator, requiredValidator, minMaxLengthValidator, minMaxLengthWarning };