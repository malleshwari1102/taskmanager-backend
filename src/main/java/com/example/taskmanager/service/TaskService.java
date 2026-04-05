package com.example.taskmanager.service;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.repository.TaskRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
public class TaskService {

    @Autowired
    private TaskRepository repo;

    public Page<Task> getTasks(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repo.findAll(pageable);
    }

    public Task saveTask(Task task) {
        if (task.getStatus() == null) {
            task.setStatus("Pending");
        }
        return repo.save(task);
    }

    public void deleteTask(Long id) {
        repo.deleteById(id);
    }

    public Task toggleStatus(Long id) {
        Task task = repo.findById(id).orElseThrow();
        task.setStatus(task.getStatus().equals("Pending") ? "Completed" : "Pending");
        return repo.save(task);
    }

    public Task updateTask(Long id, Task newTask) {
        Task task = repo.findById(id).orElseThrow();
        task.setTitle(newTask.getTitle());
        task.setDescription(newTask.getDescription());
        return repo.save(task);
    }
}