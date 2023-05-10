import { Pressable, StyleSheet, Text, View, ToastAndroid } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
const range = (start, end, length = end - start + 1) => Array.from({ length }, (_, i) => start + i)

import InvertSignalSymbol from './components/InvertSignalSymbol';
import ExpressionText from './components/ExpressionText';
import { StatusBar } from 'expo-status-bar';
import { checkIfItIsAValidExpression, checkIfThereIsNumber, checkCharacterLimit } from './utils/validation';
import { closeParenthesis, executeOperations, executePercentages, roundResult } from './utils/utils';
import { timesSign, operationSymbols } from './utils/constants';

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
    try { checkCharacterLimit(currentExpression) }
    catch (msg) {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
      return
    }

    if (character === '.' && currentExpression.includes('.')) return

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

  return (
    <View style={styles.container}>
      <StatusBar style='light' />
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
    backgroundColor: "#22242c"
  },
  visorContainer: {
    backgroundColor: "#22242c",
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
    flex: 6,
    flexWrap: 'wrap',
    flexDirection: "row",
    gap: 10,
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    justifyContent: "space-between",
    alignContent: "space-between",
    paddingBottom: 40,
    paddingHorizontal: 15,
    paddingTop: 10,
    backgroundColor: "#282c36"
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
    backgroundColor: '#262a33',
    borderRadius: 10
  }

});
