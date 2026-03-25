import{ ScrollView, View, Text } from 'react-native'
import Panel from '@/components/panel'
import { Styles } from '@/constants/theme'

export default function Subscriptions() {
    return(
      <ScrollView style={Styles.scrollview}>
        <Panel amount={200} />
        <Panel title="Adios" amount={5} />
        <Panel description="Gasto por nose" amount={10} />
        <Panel description="Gasto por nose2" amount={10} />
        <Panel title="Adios" amount={5} />
        <Panel title="Adios" amount={5} />
      </ScrollView>
    )
}