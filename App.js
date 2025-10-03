import React from 'react';
import { I18nManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductsScreen from './screens/ProductsScreen';
import PurchasesScreen from './screens/PurchasesScreen';
import SalesScreen from './screens/SalesScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import ReportsScreen from './screens/ReportsScreen';

I18nManager.allowRTL(false);

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Products" screenOptions={{headerTitleAlign:'center'}}>
        <Stack.Screen name="Products" component={ProductsScreen} options={{title: 'المنتجات'}} />
        <Stack.Screen name="Purchases" component={PurchasesScreen} options={{title: 'المشتريات'}} />
        <Stack.Screen name="Sales" component={SalesScreen} options={{title: 'المبيعات'}} />
        <Stack.Screen name="Expenses" component={ExpensesScreen} options={{title: 'المصاريف'}} />
        <Stack.Screen name="Reports" component={ReportsScreen} options={{title: 'التقارير'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
