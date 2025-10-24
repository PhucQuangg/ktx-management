package com.stu.edu.ktx_management.service.student;

import com.stu.edu.ktx_management.dto.StudentProfileDTO;
import com.stu.edu.ktx_management.entity.Student;
import com.stu.edu.ktx_management.repository.StudentRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ModelMapper modelMapper;


    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Integer id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên với id: " + id));
    }

    public Student createStudent(Student student) {
        // Mã hóa mật khẩu khi tạo tài khoản mới
        if (student.getPassword() != null) {
            student.setPassword(passwordEncoder.encode(student.getPassword()));
        }
        return studentRepository.save(student);
    }

    public Student updateStudent(Integer id, Student studentDetails) {
        Student s = getStudentById(id);

        if (studentDetails.getFullName() != null) s.setFullName(studentDetails.getFullName());
        if (studentDetails.getEmail() != null) s.setEmail(studentDetails.getEmail());
        if (studentDetails.getPhone() != null) s.setPhone(studentDetails.getPhone());
        if (studentDetails.getClassName() != null) s.setClassName(studentDetails.getClassName());
        if (studentDetails.getDateOfBirth() != null) s.setDateOfBirth(studentDetails.getDateOfBirth());
        if (studentDetails.getGender() != null) s.setGender(studentDetails.getGender());

        return studentRepository.save(s);
    }

    public void deleteStudent(Integer id) {
        studentRepository.deleteById(id);
    }

    public StudentProfileDTO getStudentByUsername(String username) {
        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên: " + username));

        return modelMapper.map(student, StudentProfileDTO.class);
    }

    public Student updateMyProfile(String username, StudentProfileDTO request) {
        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản: " + username));

        if (request.getFullName() != null && !request.getFullName().isEmpty()) {
            student.setFullName(request.getFullName());
        }
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            student.setEmail(request.getEmail());
        }
        if (request.getPhone() != null && !request.getPhone().isEmpty()) {
            student.setPhone(request.getPhone());
        }
        if (request.getClassName() != null && !request.getClassName().isEmpty()) {
            student.setClassName(request.getClassName());
        }
        if (request.getDateOfBirth() != null) {
            student.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getGender() != null) {
            student.setGender(request.getGender());
        }

        return studentRepository.save(student);
    }

    public Optional<Student> findByUsername(String username){
        return studentRepository.findByUsername(username);
    }
    public Optional<Student> findByEmail(String email){
        return studentRepository.findByEmail(email);
    }
}
