const formatPhoneNumber = (phoneNumberString: string) => {
  const phoneNumberRegex = /^\+?(\d{1,2})?\s??1?\-?\.?\s?\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})$/;
  const match = phoneNumberString.match(phoneNumberRegex);
  if (match) {
    // if country code is present, add it to the beginning of the phone number with + before and - after
    const countryCode = match[1] ? `+${match[1]}-` : '';
    return [countryCode, match[2], '-', match[3], '-', match[4]].join('');
  }
  return null;
};

export { formatPhoneNumber };
