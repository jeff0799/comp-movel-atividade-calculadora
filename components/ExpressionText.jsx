import { Text } from "react-native"

export default function ExpressionText(props) {
    const numbers = props.expression.match(/(^-[\d\.]+%?)|(\(-[\d\.]+%?\)?)|([\d\.]+%?)|(\(-$)/g)

    const expressionWithoutNumbers = numbers ? numbers.reduce(
        (expression, number) => expression.replace(number, ''),
        props.expression
    ) : null
    const operators = expressionWithoutNumbers ? [...expressionWithoutNumbers] : null

    return (
        <Text style={props.style}>
            {numbers ? numbers.map((number, i) => {
                return (
                    <Text key={i}>
                        <Text
                            style={{
                                color: props.numberColor ?? 'white'
                            }}>
                            {number}
                        </Text>

                        {operators && operators[i] ?
                            <Text
                                style={{
                                    color: props.operatorColor ?? 'red'
                                }}>
                                {' ' + operators[i] + ' '}
                            </Text>
                            : null}
                    </Text>
                )
            })
                : null}

        </Text>
    )
}