import React from 'react';
import { Text } from "react-native";

export default function InvertSignalSymbol({color}){
    return (
        <>
            <Text style={{
                color: color,
                fontSize: 20,
                position: 'absolute',
                top: '20%',
                left: '30%'
            }}>
                +
            </Text>
            <Text style={{
                color: color,
                fontSize: 28,
                position: 'absolute',
                transform: [{ rotate: '10deg' }]
            }}>
                /
            </Text>
            <Text style={{
                color: color,
                fontSize: 20,
                position: 'absolute',
                bottom: '20%',
                right: '35%'
            }}>
                -
            </Text>
            {/* <Text
            style={{
                color: color,
                fontSize: 36,
                position: 'absolute',
                // bottom: '10%',
                right: '35%'
            }}
            >%</Text> */}
        </>
    )
}