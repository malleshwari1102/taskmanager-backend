package com.example.taskmanager.controller;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.service.TaskService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    private final TaskService taskService;

    // Constructor Injection
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // ✅ Get all tasks (pagination)
    @GetMapping
    public Page<Task> getTasks(
            @RequestParam int page,
            @RequestParam int size) {

        return taskService.getTasks(PageRequest.of(page, size));
    }

    // ✅ Get all (no pagination)
    @GetMapping("/all")
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    // 🔍 Search
    @GetMapping("/search")
    public List<Task> searchTasks(@RequestParam String title) {
        return taskService.searchTasks(title);
    }

    // ✅ Create
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskService.createTask(task);
    }

    // ✅ Update
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
        return taskService.updateTask(id, task);
    }

    // ✅ Delete
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

    // 🔄 Toggle status
    @PutMapping("/{id}/toggle")
    public Task toggleStatus(@PathVariable Long id) {
        return taskService.toggleStatus(id);
    }
}