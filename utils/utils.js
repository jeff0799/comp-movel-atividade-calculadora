import { timesSign } from "./constants"

export function removeParenthesis(numbers) {
    return numbers.map(value => {
        value = value.replace(/[()]/g, '')
        return Number(value)
    })
}

export function closeParenthesis(expression) {
    if (expression.match(/\(-[\d\.]+%?$/)) return expression + ')'
    else return expression
}

export function executePercentages(expression) {
    const percentNumbers = expression.match(/[\d\.]+%/g)
    if (percentNumbers) {
        percentNumbers.forEach(percentNumber => {
            const number = Number(percentNumber.replace('%', ''))
            expression = expression.replace(percentNumber, number / 100)
        })
    }
    return expression
}

export function executeOperation(operation) {
    const regexOperation = RegExp(String.raw`(\(-[\d\.]+\)|-?[\d\.]+)([\+-${timesSign}÷])(\(-[\d\.]+\)?|[\d\.]+)`)
    const splitedOperation = operation.match(regexOperation)
        .slice(1)

    if (!splitedOperation) throw 'operação invalida'

    const values = removeParenthesis([splitedOperation[0], splitedOperation[2]])

    const operator = splitedOperation[1]

    let result
    switch (operator) {
        case timesSign: result = values[0] * values[1]
            break;
        case '÷':
            if (values[1] === 0) throw 'não tem como dividir por 0'
            result = values[0] / values[1]
            break;
        case '+': result = values[0] + values[1]
            break;
        case '-': result = values[0] - values[1]
            break;
    }

    return result
}

export function executeOperations(expression, operators) {
    const operatorsString = operators.map((operator) => {
        if (operator === '+') return '\\+';
        return operator;
    }).join('');

    const regexOperationformat = RegExp(String.raw`(\(-[\d\.]+\)|-?[\d\.]+)[${operatorsString}](\(-[\d\.]+\)?|[\d\.]+)`)
    let operation = expression.match(regexOperationformat);
    while (operation !== null) {

        const result = executeOperation(operation[0])
        if (operation.index !== 0 && result < 0) result = `(${result})`

        expression = expression.replace(operation[0], result)

        operation = expression.match(regexOperationformat)
    }

    return expression
}

export function roundResult(stringNumber) {
    const number = Number(stringNumber)
    const roundedNumber = Math.round(number * 10 ** 5) / 10 ** 5
    return String(roundedNumber)
}