package com.stu.edu.ktx_management.service.student;

import com.stu.edu.ktx_management.dto.StudentProfileDTO;
import com.stu.edu.ktx_management.entity.Student;
import com.stu.edu.ktx_management.entity.User;
import com.stu.edu.ktx_management.repository.StudentRepository;
import com.stu.edu.ktx_management.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private ModelMapper modelMapper;

    public List<StudentProfileDTO> getAllStudents() {
        return studentRepository.findAll().stream().map(student -> new StudentProfileDTO(
                student.getUser().getUsername(),
                student.getUser().getFullName(),
                student.getUser().getEmail(),
                student.getPhone(),
                student.getClassName(),
                student.getDateOfBirth(),
                student.getGender()
        )).toList();
    }

    public Student getStudentById(Integer id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên với id: " + id));
    }

    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    public Student updateStudent(Integer id, Student studentDetails) {
        Student s = getStudentById(id);
        if (studentDetails.getDateOfBirth() != null) s.setDateOfBirth(studentDetails.getDateOfBirth());
        if (studentDetails.getGender() != null) s.setGender(studentDetails.getGender());
        if (studentDetails.getPhone() != null) s.setPhone(studentDetails.getPhone());
        if (studentDetails.getClassName() != null) s.setClassName(studentDetails.getClassName());
        return studentRepository.save(s);
    }

    public void deleteStudent(Integer id) {
        studentRepository.deleteById(id);
    }

    public Student getStudentByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user: " + username));

        return studentRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy student với user: " + username));
    }


    public Student updateMyProfile(String username, StudentProfileDTO request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Update Student
        if (request.getPhone() != null) student.setPhone(request.getPhone());
        if (request.getClassName() != null) student.setClassName(request.getClassName());
        if (request.getDateOfBirth() != null) student.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) student.setGender(request.getGender());

        // Update User
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userRepository.save(user);
        return studentRepository.save(student);
    }

}
