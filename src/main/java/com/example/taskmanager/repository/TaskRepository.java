package com.example.taskmanager.repository;

import com.example.taskmanager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

List<Task>findByTitleContainingIgnoreCase(String title);

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
}