import React, { useEffect, useState, useRef } from "react";
import {
  View, Text, FlatList, TouchableWithoutFeedback, TouchableOpacity, Modal, TextInput, StyleSheet, ActivityIndicator, ScrollView, Alert
} from "react-native";
import { api } from "../../config/api"; // Import Axios instance
import Ionicons from "react-native-vector-icons/Ionicons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { textColor, designBackgoundColor, designTextColor, buttonColor, buttonTextColor, buttonTextSecondaryColor, primaryColor, secondaryColor } from '../../utils/globalStyle';
import { Platform } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";


const ExpenseScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [expenseName, setExpenseName] = useState("");
  const [editExpense, setEditExpense] = useState(null);
  const swipeableRefs = useRef({});
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(0);
  //const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [date, setDate] = useState(new Date());
  const [modalCategoyVisible, setModalCategoryVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [currentDatePicker, showCurrentDatePicker] = useState(false);

  const onChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios'); // Keep picker open on iOS
    if (selectedDate) {
      setDate(selectedDate);
    }
  };


  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios"); // Keep picker open on iOS
    if (selectedDate) setDate(selectedDate);
  };


  // Filtered categories based on search query
  const filteredExpenses = data.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/expense/categories"); // Ensure this is the correct endpoint
      setCategories(response.data.data);
      // Alert.alert("Categories", JSON.stringify(response.data.data)); // Proper alert usage
    } catch (error) {
      console.error("Error fetching categories:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/expense/get-expenses");
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter categories based on input
  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim()) {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories); // Show all if no search
    }
  };
  // Select category
  const handleSelectCategory = (category) => {
    setSearchText(category.name); // Show category name in input
    setSelectedCategory(category.id); // Store category ID
    setModalCategoryVisible(false);
  };


  // Add or Edit a expense
  const saveExpense = async () => {
    if (!expenseName.trim() || !amount.trim() || !selectedCategory || !date) {
      Alert.alert("Validation Error", "All fields are required.");

      return;
    }
    try {
      const expenseData = {
        name: expenseName,
        amount,
        category: selectedCategory, // Ensure this holds the category ID
        date: date.toISOString(), // Convert Date object to string
        description,
      };

      if (editExpense) {
        await api.post(`/expense/edit/${editExpense.id}`, expenseData);
        setData(data.map(exp => (exp.id === editExpense.id ? { ...exp, ...expenseData } : exp)));
      } else {
        const response = await api.post("/expense/add", expenseData);
        setData([response.data.data, ...data]);
      }

      // Reset form
      setModalVisible(false);
      setExpenseName("");
      setAmount("");
      setSelectedCategory(null);
      setDate(new Date());
      setDescription("");
      setEditExpense(null);
    } catch (error) {
      console.error("Error saving expense:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to save expense.");
    }
  };

  const resetInputFields = async () => {
    setEditExpense(null);
    setExpenseName("");
    setAmount("");
    setCategory(0);
    setDescription("");
  }


  const deleteExpense = async (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this expense?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await api.delete(`/expense/delete/${id}`);
              setData(data.filter(exp => exp.id !== id));

              if (swipeableRefs.current[id]) {
                swipeableRefs.current[id].close();
              }
            } catch (error) {
              console.error("Error deleting expense:", error.response?.data || error.message);
              Alert.alert("Error", "Failed to delete expense.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };


  useEffect(() => {
    const fetchDataAsync = async () => {
      await fetchCategories();
      await fetchData();
    };

    fetchDataAsync();
  }, []);

  const renderRightActions = (item) => (
    <View style={styles.swipeActions}>
      <TouchableOpacity style={styles.editButton} onPress={() => {
        setEditExpense(item);
        setDescription(item.description);
        setAmount(item.amount);
        setCategory(item.expense_category_id);
        setExpenseName(item.name);
        setModalVisible(true);
      }}>
        <Ionicons name="pencil" size={20} color='#000' />
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteExpense(item.id)}>
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
          <TouchableOpacity onPress={() => navigation.navigate("Dashboard")} style={styles.backIcon}>
            <Ionicons name="arrow-back" size={20} color={primaryColor} />
          </TouchableOpacity>

          {/* Title (Centered) */}
          <View>
            <Text style={styles.title}>Expense</Text>
            {/* <Text style={styles.subTitle}>Expense Expense</Text> */}
          </View>

          {/* Add Icon on Right */}
          <TouchableOpacity onPress={() => { setModalVisible(true); resetInputFields(); }} style={styles.addIcon}>
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

          <FlatList
            data={filteredExpenses}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            renderItem={({ item, index }) => {
              const isLastItem = index === filteredExpenses.length - 1;

              return (
                <Swipeable
                  ref={(ref) => (item.id ? (swipeableRefs.current[item.id] = ref) : null)}
                  renderRightActions={() => renderRightActions(item)}
                  overshootRight={false}
                >
                  <View
                    style={[
                      styles.expenseItem,
                      isLastItem && styles.lastExpenseItem,
                    ]}
                  >
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                      {/* ✅ Round Icon with First Letter */}
                      <View style={styles.iconCircle}>
                        <Text style={styles.iconText}>
                          {item.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>

                      {/* ✅ Expense Name (with spacing) */}
                      <Text style={styles.expenseText}>{item.name}</Text>

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

        )}

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{editExpense ? "Edit Expense" : "Add Expense"}</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Expense Name"
                  placeholderTextColor={secondaryColor}
                  value={expenseName}
                  onChangeText={setExpenseName}
                />
              </View>

              {/* Category Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Category</Text>
                <TouchableOpacity onPress={() => setModalCategoryVisible(true)} style={styles.input}>
                  <Text style={{ color: searchText ? primaryColor : secondaryColor }}>
                    {searchText || "Select Category"}
                  </Text>
                </TouchableOpacity>

                {/* Category Picker Modal */}
                <Modal visible={modalCategoyVisible} animationType="slide" transparent>
                  <TouchableWithoutFeedback onPress={() => setModalCategoryVisible(false)}>
                    <View style={styles.modalCategoryContainer}>
                      <View style={styles.modalCategoryContent}>
                        <FlatList
                          data={filteredCategories.length ? filteredCategories : categories}
                          keyExtractor={(item) => item.id.toString()}
                          renderItem={({ item }) => (
                            <TouchableOpacity style={styles.categoryModelItem} onPress={() => handleSelectCategory(item)}>
                              <Text style={styles.categoryModelText}>{item.name}</Text>
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>

              </View>


              <View style={styles.inputGroup}>
                <Text style={styles.label}>Amount (Rs.)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Expense Amount"
                  placeholderTextColor={secondaryColor}
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>


              <View style={styles.inputGroup}>
                <Text style={styles.label}>Expense Date</Text>
                <TouchableOpacity onPress={() => showCurrentDatePicker(true)} style={styles.dateButton}>
                  <Text style={styles.input}>
                    {date.toDateString()} {/* Display selected date */}
                  </Text>
                </TouchableOpacity>




                {/* Date Picker Component */}
                {currentDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      if (selectedDate) {
                        setDate(selectedDate);
                      }
                      showCurrentDatePicker(false); // Close picker after selection
                    }}
                  />
                )}

              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Enter Description"
                  placeholderTextColor={secondaryColor}
                  value={description}
                  onChangeText={setDescription}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
              <View style={styles.modalButtons}>

                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setModalVisible(false);
                    resetInputFields();
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={saveExpense}>
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

export default ExpenseScreen;

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

  textArea: {
    borderWidth: 1,
    borderColor: "#444",
    padding: 10,
    borderRadius: 5,
    minHeight: 80,  // Ensures a good textarea height
    textAlignVertical: "top",  // Aligns text to top
    color: primaryColor,
    backgroundColor: "#000000",
    marginBottom: 20
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
  expenseItem: {
    padding: 12, borderRadius: 5, elevation: 2, borderColor: '#000000', borderTopWidth: 0.9, justifyContent: "space-between", // ✅ Push text & icon apart
    flexDirection: "row", // ✅ Align text & icon horizontally
    alignItems: "center",
    marginBottom: 7
  },
  lastExpenseItem: {
    borderBottomWidth: 0.3, // ✅ Add bottom border only for last item
  },
  rightIcon: {
    marginLeft: 10, // ✅ Space between text & icon
  },
  expenseText: { fontSize: 14, color: primaryColor },
  swipeActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  //editButton: { backgroundColor: secondaryColor, padding: 7, justifyContent: 'center', borderRadius: 10, marginHorizontal: 5 },

  swipeContainer: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  editButton: {
    backgroundColor: buttonColor,
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
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 20, color: primaryColor },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: secondaryColor,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    padding: 10,
    borderRadius: 5,
    color: primaryColor,
    backgroundColor: "#000000",
  },
  //input: { borderWidth: 1, borderColor: "#444", padding: 10, borderRadius: 5, marginBottom: 10, color: "#fff" },
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInputGroup: {
    width: "48%",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#444",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#222",
  },
  selectedText: {
    color: "#fff",
  },
  placeholderText: {
    color: "#ffffff",
  },
  pickerContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#333",
    padding: 20,
  },
  pickerItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },
  pickerText: {
    color: secondaryColor,
    fontSize: 16,
  },
  categoryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  categoryText: {
    fontSize: 16,
  },
  modalCategoryContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.8)" },
  modalCategoryContent: { backgroundColor: "#1e1e1e", padding: 5, borderRadius: 10, width: "80%", height: '40%' },
  categoryModelItem: {
    padding: 20,
    borderBottomWidth: 0.3,
    borderBottomColor: '#000000',
  },
  categoryModelText: {
    fontSize: 12,
    color: primaryColor
  },
});