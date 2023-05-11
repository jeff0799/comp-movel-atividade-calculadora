import { timesSign } from "./constants"


export function checkDigitLimit(expression) {
    const lastNumberObject = expression.match(/([\d\.])+$/)
    const lastNumber = lastNumberObject ? lastNumberObject[0] : null
    if (lastNumber && lastNumber.length >= 9) {
        throw 'não é possivel inserir mais de 9 digitos'
    }
}

export function checkIfItIsAValidExpression(expression) {
    const regexExpressionFormat = RegExp(String.raw`^(\(-[\d\.]+%?\)|-?[\d\.]+%?)([\+-${timesSign}÷](\(-[\d\.]+%?\)?|[\d\.]+%?))+$`)
    const regexSinglePercentNumber = RegExp(/^(\(-[\d\.]+%?\)|-?[\d\.]+%)$/)
    const regexSinglePositiveNumber = RegExp(/^-?[\d\.]+$/)
    if (expression.match(regexSinglePositiveNumber)) throw 'insira alguma operação'
    if (!expression.match(regexExpressionFormat)
        && !expression.match(regexSinglePercentNumber)) {
        throw 'operação invalida'
    }
}

export function checkIfThereIsNumber(expression) {
    if (expression.length === 0) {
      throw 'insira um número primeiro'
    }
  }