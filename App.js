import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const App = () => {
  const [task, setTask] = useState('');
  const [time, setTime] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [editedTask, setEditedTask] = useState('');
  const [editedTime, setEditedTime] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(-1);

  const formatTimeInput = (value) => {
    const digitsOnly = value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    const parts = [];

    for (let i = 0; i < Math.ceil(digitsOnly.length / 2); i++) {
      parts.push(digitsOnly.slice(i * 2, (i + 1) * 2));
    }

    let formattedTime = parts.join(':');

    // Adicione a formatação para segundos
    if (formattedTime.length === 5) {
      formattedTime += ':00';
    }

    return formattedTime;
  };

  const addTask = () => {
    if (task.trim().length === 0) {
      setError(<Text testID="error" style={styles.boldText}>Para adicionar uma tarefa, escolha um nome!</Text>);
      setTimeout(() => setError(''), 3000);
      return;
    }
  
    if (time.trim().length === 0) {
      setError(<Text testID="error" style={styles.boldText}>Defina um tempo de conclusão!</Text>);
      setTimeout(() => setError(''), 3000);
      return;
    }
  
    const formattedTime = formatTimeInput(time);
  
    setTaskList([...taskList, { name: task, time: formattedTime, completed: false }]);
    setTask('');
    setTime('');
    setError('');
    setSuccessMessage(<Text testID="success" style={styles.boldText}>Tarefa adicionada com sucesso!</Text>);
    setTimeout(() => setSuccessMessage(''), 3000);
  };  

  const deleteTask = (index) => {
    setDeleteIndex(index);
    setConfirmModalVisible(true);
  };

  const [modalVisible, setModalVisible] = useState(false);
const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);

  const confirmDeleteTask = () => {
    const updatedList = [...taskList];
    updatedList.splice(deleteIndex, 1);
    setTaskList(updatedList);
    setConfirmModalVisible(false);
  };

  const cancelDeleteTask = () => {
    setConfirmModalVisible(false);
  };

  const editTask = (index, currentTask) => {
    setEditedTask(currentTask.name);
    setEditedTime(currentTask.time);
    setEditIndex(index);
  };

  const saveTask = (index) => {
    const updatedList = [...taskList];
    updatedList[index].name = editedTask;
    updatedList[index].time = editedTime;
    setTaskList(updatedList);
    setEditIndex(-1);
    setEditedTask('');
    setEditedTime('');
  };

  const toggleCompletion = (index) => {
    const updatedList = [...taskList];
    updatedList[index].completed= !updatedList[index].completed;
    setTaskList(updatedList);
  };

  const formatTime = (time) => {
    const hours = parseInt(time.split(':')[0]);
    const minutes = parseInt(time.split(':')[1]);
    const days = Math.floor(hours / 8);
    const remainingHours = hours % 8;
  
    let formattedTime = '';
  
    if (days > 0) {
      formattedTime += `${days} ${days === 1 ? 'dia' : 'dias'}`;
      if (remainingHours > 0) {
        formattedTime += ` e ${remainingHours} ${remainingHours === 1 ? 'hora' : 'horas'}`;
      }
    } else if (remainingHours > 0) {
      formattedTime += `${remainingHours} ${remainingHours === 1 ? 'hora' : 'horas'}`;
    }
  
    if (minutes > 0) {
      if (remainingHours === 0) {
        formattedTime += `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
      } else {
        formattedTime += ` e ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
      }
    }
  
    return formattedTime;
  };   

  const filterTasks = () => {
    switch (filter) {
      case 'pending':
        return taskList.filter((task) => !task.completed);
      case 'completed':
        return taskList.filter((task) => task.completed);
      default:
        return taskList;
    }
  };

  const renderItem = ({ item, index }) => {
    const isEditing = index === editIndex;

    return (
      <View testID={`task-${index}`} style={styles.taskContainer}>
        <TouchableOpacity style={styles.checkbox} onPress={() => toggleCompletion(index)}>
          {item.completed && <Icon name="checkmark-circle-outline" size={20} color="green" />}
          {!item.completed && <Icon name="ellipse-outline" size={20} color="gray" />}
        </TouchableOpacity>
        {isEditing ? (
          <TextInput
            style={styles.taskText}
            value={editedTask}
            onChangeText={(text) => setEditedTask(text)}
            maxLength={30}
          />
        ) : (
          <Text testID={`task-name-${index}`} style={[styles.taskText, item.completed && styles.completedTask]}>
            {item.name} - {formatTime(item.time)}
          </Text>
        )}
        <View style={styles.iconContainer}>
          {isEditing ? (
            <TouchableOpacity onPress={() => saveTask(index)}>
              <Icon name="checkmark" size={20} color="green" />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity onPress={() => editTask(index, item)}>
                <Icon name="pencil-outline" size={20} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(index)}>
                <Icon name="trash-outline" size={20} color="red" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text testID="title" style={styles.title}>Lista de Tarefas</Text>
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <TextInput
            testID="task-input"
            style={styles.input}
            placeholder="Escolha o nome deuma tarefa"
            value={task}
            onChangeText={(text) => setTask(text)}
            maxLength={30}
          />
          <TextInput
            testID="time-input"
            style={styles.input}
            placeholder="Tempo de conclusão (HH:MM)"
            value={time}
            onChangeText={(text) => setTime(text)}
            maxLength={5}
          />
          <TouchableOpacity testID="add-button" style={styles.addButton} onPress={() => addTask()}>
            <Text style={styles.buttonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
        {error ? <Text testID="error-message" style={styles.errorText}>{error}</Text> : null}
        {successMessage ? <Text testID="success-message" style={styles.successText}>{successMessage}</Text> : null}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            testID="filter-all"
            style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
            onPress={() => setFilter('all')}
          >
            <Text style={styles.filterButtonText}>Todas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="filter-pending"
            style={[styles.filterButton, filter === 'pending' && styles.activeFilter]}
            onPress={() => setFilter('pending')}
          >
            <Text style={styles.filterButtonText}>Pendentes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="filter-completed"
            style={[styles.filterButton, filter === 'completed' && styles.activeFilter]}
            onPress={() => setFilter('completed')}
          >
            <Text style={styles.filterButtonText}>Concluídas</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          testID="task-list"
          data={filterTasks()}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
        />
      </View>
      <Modal testID="confirm-modal" visible={confirmModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Essa ação é permanente, você tem certeza que deseja excluir essa tarefa?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={cancelDeleteTask}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="confirm-delete"
                style={[
                  styles.modalButton,
                  styles.deleteButton,
                  deleteButtonClicked && styles.deleteButtonClicked,
                ]}
                onPress={confirmDeleteTask}
                onPressIn={() => setDeleteButtonClicked(true)}
                onPressOut={() => setDeleteButtonClicked(false)}
              >
                <Text style={styles.modalButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  boldText: {
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 4,
    height: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    marginTop: 20,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
    flex: 1,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  checkbox: {
    marginRight: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    textAlign: 'center',
  },
  successText: {
    color: 'green',
    marginTop: 4,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
  filterButtonText: {
    fontSize: 14,
  },
  activeFilter: {
    backgroundColor: '#ccc',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 4,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 10,
  },
  modalButtonText: {
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#ccc',
  },
  deleteButtonClicked: {
    backgroundColor: 'red',
  },
  
});

export default App;