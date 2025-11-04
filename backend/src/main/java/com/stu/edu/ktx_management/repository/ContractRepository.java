package com.stu.edu.ktx_management.repository;

import com.stu.edu.ktx_management.entity.Contract;
import com.stu.edu.ktx_management.entity.ContractStatus;
import com.stu.edu.ktx_management.entity.Room;
import com.stu.edu.ktx_management.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ContractRepository extends JpaRepository<Contract, Integer> {
    List<Contract> findByStudent(Student student);
    Optional<Contract> findByStudentAndStatus (Student student, ContractStatus status);
    List<Contract> findByStatusAndEndDateBefore(ContractStatus status, LocalDate date);
}
