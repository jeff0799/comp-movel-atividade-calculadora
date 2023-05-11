import { Pressable, Text, View, ToastAndroid } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
const range = (start, end, length = end - start + 1) => Array.from({ length }, (_, i) => start + i)

import InvertSignalSymbol from './components/InvertSignalSymbol';
import ExpressionText from './components/ExpressionText';
import { StatusBar } from 'expo-status-bar';
import { checkIfItIsAValidExpression, checkIfThereIsNumber, checkDigitLimit } from './utils/validation';
import { timesSign, operationSymbols } from './utils/constants';
import styles from './styles/darkStyles'

export default function App() {
  const [history, setHistory] = useState([])
  const [currentExpression, setCurrentExpression] = useState('')


  const buttons = [
    {
      text: currentExpression ? 'C' : 'AC',
      color: "#27fbd5",
      action: () => setCurrentExpression('')
    }
    , {
      text: '+/-',
      color: "#27fbd5",
      action: invertSignal
    }, {
      text: "%",
      color: "#27fbd5",
    }, {
      text: "÷",
      color: "#d76161"
    },
    { text: "7" },
    { text: "8" },
    { text: "9" },
    {
      text: timesSign,
      color: "#d76161"
    },
    { text: "4" },
    { text: "5" },
    { text: "6" },
    {
      text: "-",
      color: "#d76161"
    },
    {
      text: "1"
    },
    {
      text: "2"
    },
    {
      text: "3"
    },
    { text: "+", color: "#d76161" },
    {
      text: <Feather name="rotate-ccw" size={24} />,
      action: backspace
    },
    {
      text: "0"
    },
    {
      text: ".",
    },
    {
      text: "=", color: "#d76161",
      action: compute
    }
  ]

  function input(character) {
    try {
      if (character.match(/[\d\.]/)) checkDigitLimit(currentExpression)
    }
    catch (msg) {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
      return
    }

    if (character === '.') {
      const lastNumber= currentExpression.match(/([\d\.])+$/)
      if (lastNumber && lastNumber[0].includes('.')) return
    }
    if (operationSymbols.includes(character)) {
      try { checkIfThereIsNumber(currentExpression) }
      catch (msg) {
        ToastAndroid.show(msg, ToastAndroid.SHORT)
        return
      }
      if (character === '%') setCurrentExpression(closeParenthesis(currentExpression + character))
      else setCurrentExpression(closeParenthesis(currentExpression) + character)
    }
    else setCurrentExpression(currentExpression + character)

  }
  function backspace() {
    const lastButOneIsCloseParenthesis = operationSymbols.includes(currentExpression[currentExpression.length - 2])
      && currentExpression[currentExpression.length - 2] === ')'
    if (lastButOneIsCloseParenthesis) {
      setCurrentExpression(currentExpression.substring(0, currentExpression.length - 2))
    }
    else setCurrentExpression(currentExpression.substring(0, currentExpression.length - 1))
  }

  function compute() {
    try {
      checkIfThereIsNumber(currentExpression)
      checkIfItIsAValidExpression(currentExpression)
    }
    catch (msg) {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
      return
    }

    let expression = currentExpression

    expression = executePercentages(expression)

    try {
      expression = executeOperations(expression, [timesSign, '÷'])
      expression = executeOperations(expression, ['+', '-'])
    } catch (msg) {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
      return
    }

    expression = roundResult(expression)

    setHistory([...history, currentExpression])
    setCurrentExpression(expression)
  }

  function invertSignal() {
    try { checkIfThereIsNumber(currentExpression) }
    catch (msg) {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
      return
    }

    const regexLastNegativeNumber = RegExp(/(?:^-([\d\.]+))|(?:\(-([\d\.]+)%?\)?)$/)
    const regexLastPositiveNumber = RegExp(/[\d\.]+%?$/)
    const regexLastMinusSignal = RegExp(/\(-$/)
    const regexLastOperator = RegExp(String.raw`[\+-${timesSign}÷]$`)

    const regexNumber = RegExp(/[\d\.]+%?/)

    let newLastTerm, oldLastTerm
    if (currentExpression.match(regexLastNegativeNumber)) {
      oldLastTerm = currentExpression.match(regexLastNegativeNumber);
      const numberValue = oldLastTerm[0].match(regexNumber)[0];
      newLastTerm = numberValue;
    }
    else if (currentExpression.match(regexLastPositiveNumber)) {
      oldLastTerm = currentExpression.match(regexLastPositiveNumber);
      const numberValue = oldLastTerm[0];
      if (numberValue[numberValue.length - 1] === '%') newLastTerm = `(-${numberValue})`;
      else newLastTerm = `(-${numberValue}`;
    }
    else if (currentExpression.match(regexLastMinusSignal)) {
      oldLastTerm = currentExpression.match(regexLastMinusSignal);
      newLastTerm = '';
    }
    else {
      oldLastTerm = currentExpression.match(regexLastOperator);
      newLastTerm = oldLastTerm[0] + '(-';
    }

    setCurrentExpression(
      currentExpression.slice(0, oldLastTerm.index) + newLastTerm
    )
  }

  function removeParenthesis(numbers) {
    return numbers.map(value => {
      value = value.replace(/[()]/g, '')
      return Number(value)
    })
  }

  function closeParenthesis(expression) {
    if (expression.match(/\(-[\d\.]+%?$/)) return expression + ')'
    else return expression
  }

  function executePercentages(expression) {
    const percentNumbers = expression.match(/[\d\.]+%/g)
    if (percentNumbers) {
      percentNumbers.forEach(percentNumber => {
        const number = Number(percentNumber.replace('%', ''))
        expression = expression.replace(percentNumber, number / 100)
      })
    }
    return expression
  }

  function executeOperation(operation) {
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

  function executeOperations(expression, operators) {
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

  function roundResult(stringNumber) {
    const number = Number(stringNumber)
    const roundedNumber = Math.round(number * 10 ** 5) / 10 ** 5
    return String(roundedNumber)
  }

  return (
    <View style={styles.container}>
      <StatusBar style='light'
        backgroundColor='black' />

      <View style={styles.visorContainer}>
        <View style={styles.historyContainer}>

          {history.map((expression, i) => {
            return <ExpressionText
              key={i}
              expression={expression}
              style={styles.historyText}
            />
          })}

        </View>

        <View style={styles.resultContainer}>
          <ExpressionText expression={currentExpression}
            style={styles.resultText}
            NumberColor='white'
            operatorColor='#d76161' />

        </View>

      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.column}>

          {range(0, 4).map((row) => {
            return <View key={row} style={styles.row}>
              {range(0, 3).map((column) => {
                const button = buttons[row * 4 + column]
                const defaultAction = () => input(button.text)

                return <Pressable
                  key={column}
                  onPress={button.action ?? defaultAction}
                  style={({ pressed }) => [styles.button,
                    pressed ? styles.buttonPressed : {}
                  ]}
                >{button.text === "+/-" ? <InvertSignalSymbol color={button.color} /> :
                  <Text style={{
                    fontSize: 36,
                    color: button.color ? button.color : "#f4f4f5"
                  }}>
                    {button.text}
                  </Text>
                  }
                </Pressable>

              })}
            </View>
          })}
        </View>
      </View>
    </View>
  )
}


