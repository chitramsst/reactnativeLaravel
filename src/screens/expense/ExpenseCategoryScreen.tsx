import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet, ActivityIndicator 
} from "react-native";
import { api } from "../../config/api"; // Import Axios instance
import Ionicons from "react-native-vector-icons/Ionicons";
import { textColor, designBackgoundColor, designTextColor, buttonColor, buttonTextColor, buttonTextSecondaryColor, primaryColor, secondaryColor } from '../../utils/globalStyle';


const ExpenseCategoryScreen = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/expense/expense-categories");
      console.log("Categories Data:", response.data); // Debugging
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add a new category
  const addCategory = async () => {
    if (!categoryName.trim()) return;
    
    try {
      const response = await api.post("/expense/expense-categories/add", { name: categoryName });
      setCategories([response.data.data, ...categories]);
      setModalVisible(false);
      setCategoryName("");
    } catch (error) {
      console.error("Error adding category:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);



  return (
    <View style={styles.container}>
      {/* Title Section */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Expense Category 12123</Text>
        <Text style={styles.subTitle}>Welcome here!</Text>
      </View>


      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()} // Ensure unique key
          renderItem={({ item }) => (
            <View style={styles.categoryItem}>
              <Text style={styles.categoryText}>{item.name}</Text>
            </View>
          )}
        />
      )}

      {/* Floating Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Add Category Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Category Name"
              value={categoryName}
              onChangeText={setCategoryName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.button} onPress={addCategory}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ExpenseCategoryScreen;

const styles = StyleSheet.create({
    container: { flex: 1,  backgroundColor: designBackgoundColor, padding: 10 },
   
     // Title Styles (No Padding)
     titleContainer: {
       backgroundColor: designBackgoundColor,
       width: '100%',
       //alignItems: 'center',
       marginBottom: 10,
       elevation: 5,
       // borderBottomLeftRadius: 20, // Rounded top-left
       // borderBottomRightRadius: 20
     },
     title: { fontSize: 25, fontWeight: 'bold', color: primaryColor, paddingHorizontal: 10, paddingTop: 50 },
     subTitle: { fontSize: 15, color: secondaryColor, paddingHorizontal: 10, paddingVertical:5 },
   
   
  categoryItem: { 
    backgroundColor: "black", 
    padding: 15, 
    marginBottom: 10, 
    borderRadius: 5, 
    elevation: 2,
  },
  categoryText: { fontSize: 16, color: primaryColor },
  floatingButton: {
    position: "absolute",
    bottom: 90, // Adjusted to stay above the tab bar
    right: 30,
    backgroundColor: "#5f75cc",
    borderRadius: 50,
    padding: 15,
    elevation: 5,
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.5)" 
  },
  modalContent: { 
    backgroundColor: "#fff", 
    padding: 20, 
    borderRadius: 10, 
    width: "80%", 
    elevation: 5 // Adds shadow effect
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    padding: 10, 
    borderRadius: 5, 
    marginBottom: 10 
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  button: { 
    backgroundColor: "#5f75cc", 
    padding: 10, 
    borderRadius: 5, 
    flex: 1, 
    alignItems: "center", 
    marginHorizontal: 5 
  },
  cancelButton: { backgroundColor: "#d9534f" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
