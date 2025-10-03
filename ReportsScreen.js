import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { API_BASE, CURRENCY } from '../config';

export default function ReportsScreen(){
  const [report, setReport] = useState(null);

  useEffect(()=>{ load(); }, []);

  const load = async ()=>{
    try{
      const res = await fetch(API_BASE + '/reports');
      const data = await res.json();
      setReport(data);
    }catch(e){ Alert.alert('خطأ','فشل تحميل التقارير'); }
  };

  if(!report) return (<View style={styles.container}><Text>جارِ التحميل...</Text></View>);

  return (
    <View style={styles.container}>
      <Text style={styles.line}>رأس مال المخزون: {report.inventory_value} {CURRENCY}</Text>
      <Text style={styles.line}>المبيعات الكلية: {report.total_sales} {CURRENCY}</Text>
      <Text style={styles.line}>المشتريات الكلية: {report.total_purchases} {CURRENCY}</Text>
      <Text style={styles.net}>صافي الأرباح: {report.net_profit} {CURRENCY}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, padding:12},
  line:{fontSize:16, marginBottom:8},
  net:{fontSize:18, fontWeight:'bold', marginTop:12}
});