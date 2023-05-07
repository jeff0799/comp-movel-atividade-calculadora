import React from 'react';
import { Text } from "react-native";

export default function InvertSignalSymbol({color}){
    return (
        <>
            <Text style={{
                position: 'absolute',
                color: color,
                fontSize: 20,
                top: '10%',
                left: '30%'
            }}>
                +
            </Text>
            <Text style={{
                position: 'absolute',
                color: color,
                fontSize: 28,
                transform: [{ rotate: '10deg' }]
            }}>
                /
            </Text>
            <Text style={{
                position: 'absolute',
                color: color,
                fontSize: 20,
                bottom: '10%',
                right: '35%'
            }}>
                -
            </Text>
        </>
    )
}