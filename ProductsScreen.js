import React, {useEffect, useState} from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { API_BASE, CURRENCY } from '../config';

export default function ProductsScreen({navigation}) {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [costPrice, setCostPrice] = useState('0');
  const [salePrice, setSalePrice] = useState('0');
  const [qtyPieces, setQtyPieces] = useState('0');
  const [qtyBoxes, setQtyBoxes] = useState('0');
  const [piecesPerBox, setPiecesPerBox] = useState('1');

  useEffect(()=>{ loadProducts(); }, []);

  const loadProducts = async ()=>{
    try{
      const res = await fetch(API_BASE + '/products');
      const data = await res.json();
      setProducts(data);
    }catch(e){
      console.log(e);
      Alert.alert('خطأ','فشل جلب المنتجات من السيرفر');
    }
  };

  const addProduct = async ()=>{
    if(!name) return Alert.alert('خطأ','ادخل اسم المنتج');
    const payload = {
      name, category, cost_price: parseFloat(costPrice||0), sale_price: parseFloat(salePrice||0),
      qty_pieces: parseInt(qtyPieces||0), qty_boxes: parseInt(qtyBoxes||0), pieces_per_box: parseInt(piecesPerBox||1)
    };
    try{
      const res = await fetch(API_BASE + '/products',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const j = await res.json();
      setName(''); setCategory(''); setCostPrice('0'); setSalePrice('0'); setQtyPieces('0'); setQtyBoxes('0'); setPiecesPerBox('1');
      loadProducts();
    }catch(e){
      console.log(e);
      Alert.alert('خطأ','فشل إضافة المنتج');
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>الفئة: {item.category || '-'}</Text>
      <Text>سعر التكلفة: {item.cost_price} {CURRENCY} — سعر البيع: {item.sale_price} {CURRENCY}</Text>
      <Text>المخزون: { (item.qty_boxes*(item.pieces_per_box||1)) + (item.qty_pieces||0) } قطعة</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topButtons}>
        <TouchableOpacity style={styles.btn} onPress={()=>navigation.navigate('Purchases')}><Text style={styles.btnText}>مشتريات</Text></TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={()=>navigation.navigate('Sales')}><Text style={styles.btnText}>مبيعات</Text></TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={()=>navigation.navigate('Expenses')}><Text style={styles.btnText}>مصروفات</Text></TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={()=>navigation.navigate('Reports')}><Text style={styles.btnText}>تقارير</Text></TouchableOpacity>
      </View>

      <FlatList data={products} keyExtractor={p=>String(p.id)} renderItem={renderItem} style={{flex:1}} />

      <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
        <Text style={styles.formTitle}>إضافة منتج جديد</Text>
        <TextInput placeholder="اسم المنتج" style={styles.input} value={name} onChangeText={setName} />
        <TextInput placeholder="الفئة" style={styles.input} value={category} onChangeText={setCategory} />
        <TextInput placeholder="سعر التكلفة" style={styles.input} value={costPrice} onChangeText={setCostPrice} keyboardType="numeric" />
        <TextInput placeholder="سعر البيع" style={styles.input} value={salePrice} onChangeText={setSalePrice} keyboardType="numeric" />
        <TextInput placeholder="كمية بالقطع" style={styles.input} value={qtyPieces} onChangeText={setQtyPieces} keyboardType="numeric" />
        <TextInput placeholder="كمية بالعلب" style={styles.input} value={qtyBoxes} onChangeText={setQtyBoxes} keyboardType="numeric" />
        <TextInput placeholder="عدد القطع بالعلبة" style={styles.input} value={piecesPerBox} onChangeText={setPiecesPerBox} keyboardType="numeric" />
        <TouchableOpacity style={styles.actionBtn} onPress={addProduct}><Text style={styles.actionText}>أضف المنتج</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, backgroundColor:'#fff'},
  topButtons:{flexDirection:'row', justifyContent:'space-around', padding:8, backgroundColor:'#f7f7f7'},
  btn:{backgroundColor:'#2b6cb0', padding:8, borderRadius:6},
  btnText:{color:'#fff', fontWeight:'bold'},
  item:{padding:12, borderBottomWidth:1, borderColor:'#eee'},
  title:{fontSize:16, fontWeight:'bold'},
  form:{padding:12, backgroundColor:'#fafafa', borderTopWidth:1, borderColor:'#ddd', maxHeight:350},
  formTitle:{fontSize:16, fontWeight:'bold', marginBottom:8},
  input:{backgroundColor:'#fff', padding:10, marginBottom:8, borderRadius:6, borderWidth:1, borderColor:'#ddd'},
  actionBtn:{backgroundColor:'#059669', padding:12, borderRadius:8, alignItems:'center'},
  actionText:{color:'#fff', fontWeight:'bold'}
});