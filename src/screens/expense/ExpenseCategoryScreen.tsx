import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet, ActivityIndicator, ScrollView, Alert
} from "react-native";
import { api } from "../../config/api"; // Import Axios instance
import Ionicons from "react-native-vector-icons/Ionicons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { textColor, designBackgoundColor, designTextColor, buttonColor, buttonTextColor, buttonTextSecondaryColor, primaryColor, secondaryColor } from '../../utils/globalStyle';

const ExpenseCategoryScreen = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editCategory, setEditCategory] = useState(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/expense/expense-categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add or Edit a category
  const saveCategory = async () => {
    if (!categoryName.trim()) return;
    try {
      if (editCategory) {
        await api.put(`/expense/expense-categories/edit/${editCategory.id}`, { name: categoryName });
        setCategories(categories.map(cat => cat.id === editCategory.id ? { ...cat, name: categoryName } : cat));
      } else {
        const response = await api.post("/expense/expense-categories/add", { name: categoryName });
        setCategories([response.data.data,...categories]);
      }
      setModalVisible(false);
      setCategoryName("");
      setEditCategory(null);
    } catch (error) {
      console.error("Error saving category:", error.response?.data || error.message);
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    try {
      await api.delete(`/expense/expense-categories/delete/${id}`);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderRightActions = (item) => (
    <View style={styles.swipeActions}>
      <TouchableOpacity style={styles.editButton} onPress={() => {
        setEditCategory(item);
        setCategoryName(item.name);
        setModalVisible(true);
      }}>
         <Ionicons name="pencil" size={25} color='#d5bbfc' />
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteCategory(item.id)}>
        {/* <Text style={styles.buttonText}>Delete</Text> */}
        <Ionicons name="close" size={25} color='#ffadae' />
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Title Section with Add Button */}
        <View style={styles.titleContainer}>
          <View>
          <Text style={styles.title}>Expense Category</Text>
            <Text style={styles.subTitle}>Welcome here!</Text>
            </View>
          {/* <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Ionicons name="add" size={25} color={buttonColor} />
          </TouchableOpacity> */}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            renderItem={({ item }) => (
              <Swipeable renderRightActions={() => renderRightActions(item)}>
                <View style={styles.categoryItem}>
                  <Text style={styles.categoryText}>{item.name}</Text>
                </View>
              </Swipeable>
            )}
          />
        )}

     {/* Floating Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color={buttonColor} />
      </TouchableOpacity> 

        {/* Add/Edit Category Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{editCategory ? "Edit Category" : "Add Category"}</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Category Name"
                value={categoryName}
                onChangeText={setCategoryName}
              />
              <View style={styles.modalButtons}>
             
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={() => {
                    setModalVisible(false);
                    setEditCategory(null);
                    setCategoryName("");
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={saveCategory}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
};

export default ExpenseCategoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: designBackgoundColor, padding: 10 },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 50,
    marginBottom: 10,
  },
  title: { fontSize: 25, fontWeight: 'bold', color: primaryColor },
  subTitle: { fontSize: 15, color: secondaryColor, paddingHorizontal: 2, paddingVertical:5 },

  addButton: { padding: 2, borderRadius: 5 },
  categoryItem: { padding: 12, borderRadius: 5, elevation: 2, borderColor: secondaryColor, borderTopWidth: 0.3, justifyContent: 'center' },
  categoryText: { fontSize: 14, color: primaryColor },
  swipeActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  editButton: { backgroundColor: secondaryColor, padding: 7, justifyContent: 'center', borderRadius:10, marginHorizontal:5},
  deleteButton: { backgroundColor: secondaryColor, padding: 7,justifyContent: 'center', borderRadius:10 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "80%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 10 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  button: { backgroundColor: "#5f75cc", padding: 10, borderRadius: 5, flex: 1, alignItems: "center", marginHorizontal: 5 },
  cancelButton: { backgroundColor: "#d9534f" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  floatingButton: {
    position: "absolute",
    bottom: 90, // Adjusted to stay above the tab bar
    right: 30,
    backgroundColor: secondaryColor,
  //  backgroundColor: "#5f75cc",
    borderRadius: 50,
    padding: 5,
    elevation: 5,
  },
});