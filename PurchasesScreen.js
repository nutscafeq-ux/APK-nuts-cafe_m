import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { API_BASE } from '../config';

export default function PurchasesScreen(){
  const [products, setProducts] = useState([]);
  const [operationId, setOperationId] = useState('');
  const [productId, setProductId] = useState('');
  const [qtyPieces, setQtyPieces] = useState('0');
  const [qtyBoxes, setQtyBoxes] = useState('0');
  const [pricePerUnit, setPricePerUnit] = useState('0');

  useEffect(()=>{ loadProducts(); }, []);

  const loadProducts = async ()=>{
    try{
      const res = await fetch(API_BASE + '/products');
      const data = await res.json();
      setProducts(data);
    }catch(e){ console.log(e); }
  };

  const addPurchase = async ()=>{
    if(!productId) return Alert.alert('خطأ','اختر المنتج (ID)');
    const payload = { operation_id: operationId || String(Date.now()), product_id: parseInt(productId), qty_pieces: parseInt(qtyPieces||0), qty_boxes: parseInt(qtyBoxes||0), price_per_unit: parseFloat(pricePerUnit||0), date: new Date().toISOString() };
    try{
      await fetch(API_BASE + '/purchases',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      Alert.alert('تم','تم تسجيل عملية الشراء');
      setOperationId(''); setProductId(''); setQtyPieces('0'); setQtyBoxes('0'); setPricePerUnit('0');
      loadProducts();
    }catch(e){ Alert.alert('خطأ','فشل تسجيل الشراء'); console.log(e); }
  };

  return (
    <View style={styles.container}>
      <Text style={{fontSize:18, fontWeight:'bold'}}>تسجيل مشتريات</Text>
      <TextInput placeholder="رقم العملية" style={styles.input} value={operationId} onChangeText={setOperationId} />
      <TextInput placeholder="رقم المنتج (ID)" style={styles.input} value={productId} onChangeText={setProductId} keyboardType="numeric" />
      <TextInput placeholder="كمية بالقطع" style={styles.input} value={qtyPieces} onChangeText={setQtyPieces} keyboardType="numeric" />
      <TextInput placeholder="كمية بالعلب" style={styles.input} value={qtyBoxes} onChangeText={setQtyBoxes} keyboardType="numeric" />
      <TextInput placeholder="سعر الشراء للوحدة" style={styles.input} value={pricePerUnit} onChangeText={setPricePerUnit} keyboardType="numeric" />
      <TouchableOpacity style={styles.actionBtn} onPress={addPurchase}><Text style={{color:'#fff'}}>أضف شراء</Text></TouchableOpacity>
      <FlatList data={products} keyExtractor={p=>String(p.id)} renderItem={({item})=>(<Text style={{padding:6}}>{item.id} - {item.name} - المخزون: { (item.qty_boxes*(item.pieces_per_box||1)) + (item.qty_pieces||0) }</Text>)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, padding:12},
  input:{borderWidth:1, padding:8, marginBottom:8, borderRadius:6},
  actionBtn:{backgroundColor:'#2563eb', padding:12, borderRadius:8, alignItems:'center', marginBottom:8}
});