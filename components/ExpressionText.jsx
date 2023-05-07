import { Text } from "react-native"

export default function ExpressionText(props) {
    const numbers = props.expression.match(/(^-[\d\.]+%?)|(\(-[\d\.]+%?\)?)|([\d\.]+%?)/g)

    const expressionWithoutNumbers = numbers ? numbers.reduce(
        (expression, number) => expression.replace(number, ''),
        props.expression
    ) : null
    const operators = expressionWithoutNumbers ? [...expressionWithoutNumbers] : null
    console.log(numbers)

    return (
        <Text style={props.style}>
            {numbers ? numbers.map((number, i) => {
                return (
                    <>
                        <Text key={i}
                            style={{
                                color: props.numberColor ?? 'white'
                            }}>{number}</Text>
                        {operators && operators[i] ?
                            <Text key={'o' + i}
                                style={{
                                    color: props.operatorColor ?? 'red'
                                }}> {operators[i]} </Text>
                            : null}
                    </>
                )
            })
                : null}
            {/* {numbers && numbers.length> ? <Text
                style={{
                    color: props.numberColor ?? 'white'
                }}>
                {numbers[numbers.length - 1]}
            </Text>
                : null} */}
        </Text>
    )
}