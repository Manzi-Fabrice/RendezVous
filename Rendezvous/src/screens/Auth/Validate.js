export const validateEmail = (email) =>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export const validatePhoneNumber = (phoneNumber) =>{
    const strongPhoneNumber =  /^(\+\d{1,3}[- ]?)?\d{10}$/;
    return strongPhoneNumber.test(phoneNumber);
}