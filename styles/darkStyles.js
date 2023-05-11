import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
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
      fontSize: 46,
      fontWeight: 700,
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
    },
    buttonPressed:{
      backgroundColor: '#363a43'
    }
  
  });