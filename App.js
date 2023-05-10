import { Pressable, StyleSheet, Text, View, ToastAndroid } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
const range = (start, end, length = end - start + 1) => Array.from({ length }, (_, i) => start + i)

import InvertSignalSymbol from './components/InvertSignalSymbol';
import ExpressionText from './components/ExpressionText';

export default function App() {
  const [history, setHistory] = useState([])
  const [currentExpression, setCurrentExpression] = useState('')

  const timesSign = '×'
  const operationSymbols = ['+', '-', timesSign, '÷', '%']

  const buttons = [
    {
      text: currentExpression ? 'C' : 'AC',
      color: "#27f5ce",
      action: () => setCurrentExpression('')
    }
    , {
      text: '+/-',
      color: "#27f5ce",
      action: invertSignal
    }, {
      text: "%",
      color: "#27f5ce",
    }, {
      text: "÷",
      color: "#e26262"
    },
    { text: "7" },
    { text: "8" },
    { text: "9" },
    {
      text: timesSign,
      color: "#e26262"
    },
    { text: "4" },
    { text: "5" },
    { text: "6" },
    {
      text: "-",
      color: "#e26262"
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
    { text: "+", color: "#e26262" },
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
      text: "=", color: "#e26262",
      action: compute
    }
  ]

  function checkIfThereIsNumber(expression) {
    if (expression.length === 0) {
      throw 'insira um número primeiro'
    }
  }
  function checkIfItIsAValidExpression(expression) {
    const regexExpressionFormat = RegExp(String.raw`^(\(-[\d\.]+%?\)|-?[\d\.]+%?)([\+-${timesSign}÷](\(-[\d\.]+%?\)?|[\d\.]+%?))+$`)
    const regexSinglePercentNumber = RegExp(/^(\(-[\d\.]+%?\)|-?[\d\.]+%)$/)
    const regexSinglePositiveNumber = RegExp(/^-?[\d\.]+$/)
    if(expression.match(regexSinglePositiveNumber)) throw 'insira alguma operação'
    if (!expression.match(regexExpressionFormat)
      && !currentExpression.match(regexSinglePercentNumber)) {
      throw 'operação invalida'
    }
  }

  function input(character) {
    if (currentExpression.length >= 9) {
      ToastAndroid.show('não é possivel inserir mais de 9 digitos', ToastAndroid.SHORT)
      return
    }

    if (character === '.' && currentExpression.includes('.')) return

    if (operationSymbols.includes(character)) {
      try { checkIfThereIsNumber(currentExpression) }
      catch (error) {
        ToastAndroid.show(error, ToastAndroid.SHORT)
        return
      }
      if (character === '%') setCurrentExpression(closeParenthesis(currentExpression + character))
      else setCurrentExpression(closeParenthesis(currentExpression) + character)
    }
    else setCurrentExpression(currentExpression + character)

  }
  function backspace() {
    if (
      operationSymbols.includes(currentExpression[currentExpression.length - 2])
      && currentExpression[currentExpression.length - 2] === ')'
    ) {
      setCurrentExpression(currentExpression.substring(0, currentExpression.length - 2))
    }
    else setCurrentExpression(currentExpression.substring(0, currentExpression.length - 1))
  }

  function compute() {
    try {
      checkIfThereIsNumber(currentExpression)
      checkIfItIsAValidExpression(currentExpression)
    }
    catch (error) {
      ToastAndroid.show(error, ToastAndroid.SHORT)
      return
    }

    let expression = currentExpression

    expression = executePercentages(expression)

    try {
      expression = executeOperations(expression, [timesSign, '÷'])
      expression = executeOperations(expression, ['+', '-'])
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.SHORT)
      return
    }

    setHistory([...history, currentExpression])
    setCurrentExpression(expression)
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

    const values = [splitedOperation[0], splitedOperation[2]]
      .map(value => {
        value = value.replace(/[()]/g, '')
        return Number(value)
      })
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

    const regex = RegExp(String.raw`(\(-[\d\.]+\)|-?[\d\.]+)[${operatorsString}](\(-[\d\.]+\)?|[\d\.]+)`)
    let operation = expression.match(regex);
    while (operation !== null) {

      const result = executeOperation(operation[0])
      if (operation.index !== 0 && result < 0) result = `(${result})`

      expression = expression.replace(operation[0], result)

      operation = expression.match(regex)
    }

    return expression
  }
  function closeParenthesis(expression) {
    if (currentExpression.match(/\(-[\d\.]+%?$/)) return expression + ')'
    else return expression
  }
  function invertSignal() {
    try { checkIfThereIsNumber(currentExpression) }
    catch (error) {
      ToastAndroid.show(error, ToastAndroid.SHORT)
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

  return (
    <View style={styles.container}>
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
            operatorColor='red' />

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
                  style={styles.button}
                  onPress={button.action ?? defaultAction}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#1e1e1e"
  },
  visorContainer: {
    backgroundColor: "#1e1e1e",
    flex: 4,
    width: "100%"
  },
  historyContainer: {
    flex: 2,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 10
  },
  resultContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 10
  },
  historyText: {
    fontSize: 30,
    color: "white"
  },
  resultText: {
    fontSize: 50,
    fontWeight: 800,
    color: "white"
  },
  buttonsContainer: {
    flex: 6, backgroundColor: "#3f3d41",
    flexWrap: 'wrap', flexDirection: "row",
    gap: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    justifyContent: "space-between", alignContent: "space-between",
    paddingBottom: 70,
    paddingHorizontal: 15,
    paddingTop: 10,
    backgroundColor: "#22252d"
  },
  column: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    flexGrow: 1,
    width: "100%",
    gap: 30,
  },
  button: {
    flex: 1,
    width: 40,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#14161A',
    borderRadius: 10
  }

});
