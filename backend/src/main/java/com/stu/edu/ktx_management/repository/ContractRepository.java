package com.stu.edu.ktx_management.repository;

import com.stu.edu.ktx_management.entity.Contract;
import com.stu.edu.ktx_management.entity.ContractStatus;
import com.stu.edu.ktx_management.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ContractRepository extends JpaRepository<Contract, Integer> {

    List<Contract> findByStudent(Student student);

    List<Contract> findByStudentId(Integer studentId);

    Optional<Contract> findByStudentAndStatus(Student student, ContractStatus status);

    Optional<Contract> findByIdAndStudentId(Integer id, Integer studentId);

    List<Contract> findByRoomId(Integer roomId);

    List<Contract> findByStatusAndEndDateBefore(ContractStatus status, LocalDate date);
}
