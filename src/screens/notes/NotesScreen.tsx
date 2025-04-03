import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    TextInput,
    Alert,
    Modal,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import Toast from "react-native-toast-message";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
    buttonColor,
    buttonTextColor,
    primaryColor,
    secondaryColor,
    designBackgoundColor,
} from '../../utils/globalStyle';
import { AxiosError } from "axios";
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/types.ts';
import Swipeable from "react-native-gesture-handler/Swipeable";
import { api } from "../../config/api"; // Import Axios instance

interface Note {
    id: number;
    title: string;
    content: string;
}

const NotesScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();


    const [modalVisible, setModalVisible] = useState(false);
    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editNote, setEditNote] = useState<Note | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const filteredNotes = notes.filter(cat =>
        cat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    interface SwipeableRefs {
        [key: string]: Swipeable | null;
    }

    const swipeableRefs = useRef<SwipeableRefs>({});

 

    useEffect(() => {
        fetchNotes();
    }, []);

    const getColorForLetter = (letter : String) => {
        const colors = [
          '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#33FFF5', 
          '#F5FF33', '#A133FF', '#FF8C33', '#33FFA1', '#A1FF33'
        ];
        
        const index = letter.charCodeAt(0) % colors.length; // Consistent index
        return colors[index];
      };
      

    const renderRightActions = (item: Note) => (
        <View style={styles.swipeActions}>
            <TouchableOpacity style={styles.editButton} onPress={() => {
                setEditNote(item);
                setTitle(item.title);
                setContent(item.content);
                setModalVisible(true);
            }}>
                <Ionicons name="pencil" size={20} color='#000' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteNote(item.id)}>
                {/* <Text style={styles.buttonText}>Delete</Text> */}
                <Ionicons name="close" size={20} color='#000' />
            </TouchableOpacity>
        </View>
    );

    // Add or Edit a note
    const saveNote = async () => {
        if (!title.trim()) return;
        if (!content.trim()) return;
        try {
            if (editNote) {
                await api.post(`/note/edit/${editNote.id}`, { title: title, content: content });
                setNotes(notes.map(note => note.id === editNote.id ? { ...note, title: title, content: content } : note));
                if (editNote && swipeableRefs.current[editNote.id]) {
                    swipeableRefs.current[editNote.id]?.close();
                }
            } else {
                const response = await api.post("/note/add", { title: title, content: content });
                setNotes([response.data.data, ...notes]);
            }
            setModalVisible(false);
            setTitle("");
            setContent("");
            setEditNote(null);

        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("Error fetching notes:", axiosError.response?.data || axiosError.message);
        }
    };

    // Fetch notes from API
    const fetchNotes = async () => {
        setLoading(true);
        try {
            const response = await api.get("/note");
            setNotes(response.data.data);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("Error fetching notes:", axiosError.response?.data || axiosError.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteNote = async (id: string | number) => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete this note?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            const response = await api.delete(`/note/delete/${id}`);

                            if (response.data.success === false) {
                                // Show toast message if deletion is restricted
                                Toast.show({
                                    type: "error",
                                    text1: "Delete Restriction.",
                                    text2: "Try again later!",
                                });
                                return;
                            }

                            setNotes(notes.filter(cat => cat.id !== id));

                            if (swipeableRefs.current[id]) {
                                swipeableRefs.current[id].close();
                            }

                        } catch (error) {
                            const axiosError = error as AxiosError;
                            console.error("Error fetching notes:", axiosError.response?.data || axiosError.message);
                        }
                    },
                    style: "destructive", // Makes the delete button red (iOS only)
                },
            ]
        );
    };

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
                        <Text style={styles.title}>Note</Text>
                        {/* <Text style={styles.subTitle}>Expense Note</Text> */}
                    </View>

                    {/* Add Icon on Right */}
                    <TouchableOpacity onPress={() => setModalVisible(true)} >
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
                    <View style={{ height: 500 }}>
                        <FlatList
                            data={filteredNotes}
                            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                            renderItem={({ item, index }) => {
                                const isLastItem = index === filteredNotes.length - 1;

                                return (
                                    <Swipeable
                                        //ref={(ref) => (item.id ? (swipeableRefs.current[item.id] = ref) : null)}

                                        ref={(ref) => {
                                            if (item.id) {
                                                swipeableRefs.current[item.id] = ref;  // Assign Swipeable ref for the item.id
                                            }
                                        }}

                                        renderRightActions={() => renderRightActions(item)}
                                        overshootRight={false}
                                    >
                                        <View
                                            style={[
                                                styles.noteItem,
                                                isLastItem && styles.lastNoteItem,
                                            ]}
                                        >
                                            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                                                {/* ✅ Round Icon with First Letter */}
                                                <View style={[styles.iconCircle, { backgroundColor: getColorForLetter(item.title.charAt(0).toUpperCase()) }]}>
                                                    <Text style={styles.iconText}>
                                                        {item.title.charAt(0).toUpperCase()}
                                                    </Text>
                                                </View>

                                                {/* ✅ Note Name (with spacing) */}
                                                <Text style={styles.noteText}>{item.title}</Text>

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
                {/* Add/Edit Note Modal */}
                <Modal visible={modalVisible} animationType="slide" transparent>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>

                            <Text style={styles.modalTitle}>{editNote ? "Edit Note" : "Add Note"}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Title"
                                value={title}
                                onChangeText={setTitle}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Enter Note"
                                value={content}
                                onChangeText={setContent}
                            />
                            <View style={styles.modalButtons}>

                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={() => {
                                        setModalVisible(false);
                                        setEditNote(null);
                                        setTitle("");
                                        setContent("");
                                    }}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={saveNote}>
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
    noteItem: {
        padding: 12, borderRadius: 5, elevation: 2, borderColor: '#000000', borderTopWidth: 0.9, justifyContent: "space-between", // ✅ Push text & icon apart
        flexDirection: "row", // ✅ Align text & icon horizontally
        alignItems: "center",
        marginBottom: 7
    },
    lastNoteItem: {
        borderBottomWidth: 0.3, // ✅ Add bottom border only for last item
    },
    rightIcon: {
        marginLeft: 10, // ✅ Space between text & icon
    },
    noteText: { fontSize: 14, color: primaryColor },
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

export default NotesScreen;
