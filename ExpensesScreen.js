import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { API_BASE, CURRENCY } from '../config';

export default function ExpensesScreen(){
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('0');
  const [expenses, setExpenses] = useState([]);

  useEffect(()=>{ loadExpenses(); }, []);

  const loadExpenses = async ()=>{
    try{
      const res = await fetch(API_BASE + '/expenses');
      const data = await res.json();
      setExpenses(data);
    }catch(e){ console.log(e); }
  };

  const addExpense = async ()=>{
    const payload = { description, amount: parseFloat(amount||0), date: new Date().toISOString() };
    try{
      await fetch(API_BASE + '/expenses',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      setDescription(''); setAmount('0');
      loadExpenses();
      Alert.alert('تم','تمت إضافة المصروف');
    }catch(e){ Alert.alert('خطأ','فشل إضافة المصروف'); console.log(e); }
  };

  return (
    <View style={styles.container}>
      <Text style={{fontSize:18, fontWeight:'bold'}}>المصاريف</Text>
      <TextInput placeholder="الوصف" style={styles.input} value={description} onChangeText={setDescription} />
      <TextInput placeholder="القيمة" style={styles.input} value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <TouchableOpacity style={styles.actionBtn} onPress={addExpense}><Text style={{color:'#fff'}}>أضف مصروف</Text></TouchableOpacity>
      <FlatList data={expenses} keyExtractor={(e,i)=>String(i)} renderItem={({item})=>(<Text style={{padding:6}}>{item.description} - {item.amount} {CURRENCY}</Text>)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, padding:12},
  input:{borderWidth:1, padding:8, marginBottom:8, borderRadius:6},
  actionBtn:{backgroundColor:'#333', padding:12, borderRadius:8, alignItems:'center', marginBottom:8}
});