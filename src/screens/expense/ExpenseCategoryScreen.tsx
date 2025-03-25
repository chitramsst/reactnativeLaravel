import React, { useEffect, useState, useRef } from "react";
import {
  View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet, ActivityIndicator, ScrollView, Alert
} from "react-native";
import { api } from "../../config/api"; // Import Axios instance
import Ionicons from "react-native-vector-icons/Ionicons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { textColor, designBackgoundColor, designTextColor, buttonColor, buttonTextColor, buttonTextSecondaryColor, primaryColor, secondaryColor } from '../../utils/globalStyle';
import Toast from "react-native-toast-message";

const ExpenseCategoryScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editCategory, setEditCategory] = useState(null);
  const swipeableRefs = useRef({});

  const [searchQuery, setSearchQuery] = useState("");

  // Filtered categories based on search query
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        await api.post(`/expense/expense-categories/edit/${editCategory.id}`, { name: categoryName });
        setCategories(categories.map(cat => cat.id === editCategory.id ? { ...cat, name: categoryName } : cat));
        if (editCategory && swipeableRefs.current[editCategory.id]) {
          swipeableRefs.current[editCategory.id].close();
        }
      } else {
        const response = await api.post("/expense/expense-categories/add", { name: categoryName });
        setCategories([response.data.data, ...categories]);
      }
      setModalVisible(false);
      setCategoryName("");
      setEditCategory(null);

    } catch (error) {
      console.error("Error saving category:", error.response?.data || error.message);
    }
  };

  const deleteCategory = async (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this category?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const response = await api.delete(`/expense/expense-categories/delete/${id}`);

              if (response.data.success === false) {
                // Show toast message if deletion is restricted
                Toast.show({
                  type: "error",
                  text1: "Delete Restriction.",
                  text2: "This category has expense data!",
                });
                return;
              }

              setCategories(categories.filter(cat => cat.id !== id));

              if (swipeableRefs.current[id]) {
                swipeableRefs.current[id].close();
              }

            } catch (error) {
              console.error("Error deleting category:", error.response?.data || error.message);
            }
          },
          style: "destructive", // Makes the delete button red (iOS only)
        },
      ]
    );
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
        <Ionicons name="pencil" size={20} color='#000' />
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteCategory(item.id)}>
        {/* <Text style={styles.buttonText}>Delete</Text> */}
        <Ionicons name="close" size={20} color='#000' />
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Title Section with Add Button */}
        <View style={styles.titleContainer}>
          {/* Back Arrow Icon */}
          <TouchableOpacity onPress={() => navigation.navigate("DashboardMain")} style={styles.backIcon}>
            <Ionicons name="arrow-back" size={20} color={primaryColor} />
          </TouchableOpacity>

          {/* Title (Centered) */}
          <View>
            <Text style={styles.title}>Expense Category</Text>
            {/* <Text style={styles.subTitle}>Expense Category</Text> */}
          </View>

          {/* Add Icon on Right */}
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addIcon}>
            <Ionicons name="add" size={20} color={primaryColor} />
          </TouchableOpacity>
        </View>
        {/* Search Input Field */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={secondaryColor} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search here..."
            placeholderTextColor={secondaryColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <View style={{height:500}}>
          <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item, index }) => {
            const isLastItem = index === filteredCategories.length - 1;
            
            return (
              <Swipeable
                ref={(ref) => (item.id ? (swipeableRefs.current[item.id] = ref) : null)}
                renderRightActions={() => renderRightActions(item)}
                overshootRight={false}
              >
                <View
                  style={[
                    styles.categoryItem,
                    isLastItem && styles.lastCategoryItem,
                  ]}
                >
                  <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                    {/* ✅ Round Icon with First Letter */}
                    <View style={styles.iconCircle}>
                      <Text style={styles.iconText}>
                        {item.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
        
                    {/* ✅ Category Name (with spacing) */}
                    <Text style={styles.categoryText}>{item.name}</Text>
        
                    {/* ✅ Right Arrow Icon */}
                    <View style={{ marginLeft: "auto" }}>
                      <Ionicons name="chevron-forward" size={18} color={secondaryColor} style={styles.rightIcon} />
                    </View>
                  </View>
                </View>
              </Swipeable>
            );
          }}
          showsVerticalScrollIndicator={true} // Show scrollbar
          scrollIndicatorInsets={{ right: 1 }} // Ensures visibility on some devices
          contentContainerStyle={styles.scrollContainer} // Custom styling
        />
        </View>
        )}

        {/* Floating Button */}
        {/* <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
  <View style={styles.floatingButtonContent}>
    <Ionicons name="add" size={30} color={buttonColor} />
    <Text style={[styles.floatingButtonText, { color: buttonColor }]}>Add</Text>
  </View>
</TouchableOpacity> */}


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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Ensures equal spacing between elements
    // paddingHorizontal: 10,
    paddingTop: 50,
    marginBottom: 20,
  },

  backIcon: {
    padding: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: primaryColor,
    textAlign: "center",
    flex: 1, // Allows title to take available space and center itself
  },
  subTitle: { fontSize: 15, color: secondaryColor, paddingHorizontal: 2, paddingVertical: 5 },

  addButton: { padding: 2, borderRadius: 5 },
  categoryItem: {
    padding: 12, borderRadius: 5, elevation: 2, borderColor: '#000000', borderTopWidth: 0.9, justifyContent: "space-between", // ✅ Push text & icon apart
    flexDirection: "row", // ✅ Align text & icon horizontally
    alignItems: "center",
    marginBottom: 7
  },
  lastCategoryItem: {
    borderBottomWidth: 0.3, // ✅ Add bottom border only for last item
  },
  rightIcon: {
    marginLeft: 10, // ✅ Space between text & icon
  },
  categoryText: { fontSize: 14, color: primaryColor },
  swipeActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  //editButton: { backgroundColor: secondaryColor, padding: 7, justifyContent: 'center', borderRadius: 10, marginHorizontal: 5 },

  swipeContainer: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  editButton: {
    backgroundColor:buttonColor,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: "100%",
    padding: 10
  },

  //deleteButton: { backgroundColor: secondaryColor, padding: 7, justifyContent: 'center', borderRadius: 10 },
  deleteButton: {
    backgroundColor: "#ffadae",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: "100%",
    padding: 10
  },

  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.8)" },
  modalContent: { backgroundColor: "#1e1e1e", padding: 20, borderRadius: 10, width: "80%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#fff" },
  input: { borderWidth: 1, borderColor: "#444", padding: 10, borderRadius: 5, marginBottom: 10, color: "#fff" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  button: { backgroundColor: buttonColor, padding: 10, borderRadius: 5, flex: 1, alignItems: "center", marginHorizontal: 5 },
  cancelButton: { backgroundColor: "#ffadae" },
  buttonText: { color: buttonTextColor, fontWeight: "bold" },
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    borderWidth: 1,
    borderColor: "#001",
    marginBottom: 15
  },
  searchIcon: {
    marginRight: 8, // Space between icon and text input
  },
  searchInput: {
    flex: 1, // Takes the remaining space
    color: primaryColor

  },

  floatingButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },

  floatingButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5, // Space between icon and text
  },

  iconCircle: {
    width: 35,  // Circle width
    height: 35, // Circle height
    borderRadius: 20, // Make it round
    backgroundColor: secondaryColor,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15, // Space between icon and text
  },
  scrollContainer: {
    paddingBottom: 10, // Ensures smooth scrolling
  },
  iconText: {
    color: "#00000", // White text inside circle
    fontSize: 14,
    fontWeight: "bold",
  },
});