 package com.example.taskmanager.service;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.exception.TaskNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    // Constructor Injection
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // 🔍 Search
    public List<Task> searchTasks(String title) {
        return taskRepository.findByTitleContainingIgnoreCase(title);
    }

    // Get all tasks
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Pagination
    public Page<Task> getTasks(Pageable pageable) {
        return taskRepository.findAll(pageable);
    }

    // Create task
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    // Update task
    public Task updateTask(Long id, Task updatedTask) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setStatus(updatedTask.getStatus());

        return taskRepository.save(task);
    }

    // Delete task
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        taskRepository.delete(task);
    }

    // 🔄 Toggle Status (FIXED)
    public Task toggleStatus(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        if ("Pending".equals(task.getStatus())) {
            task.setStatus("Completed");
        } else {
            task.setStatus("Pending");
        }

        return taskRepository.save(task);
    }
}