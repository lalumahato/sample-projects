function check_even(num) {
    return (num % 2 === 0) ? true : false;
}

function reverse_num(num) {
    result = 0;
    while (num > 0) {
        let digit = num % 10;
        result = result * 10 + digit;
        num = Math.floor(num / 10);
    }
    return result
}

function palindrome_num(num) {
    result = 0;
    let temp = num;
    while (num > 0) {
        let digit = num % 10;
        result = result * 10 + digit;
        num = Math.floor(num / 10);
    }
    return (temp === result) ? true : false;
}

module.exports = {
    reverse_num,
    check_even,
    palindrome_num
};
