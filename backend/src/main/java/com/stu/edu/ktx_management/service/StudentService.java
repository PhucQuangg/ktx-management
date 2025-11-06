package com.stu.edu.ktx_management.service;
import com.stu.edu.ktx_management.dto.StudentProfileDTO;
import com.stu.edu.ktx_management.entity.ApprovalStatus;
import com.stu.edu.ktx_management.entity.Role;
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
    private EmailService emailService;

    @Autowired
    private ModelMapper modelMapper;


    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student approveStudent(Integer studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên!"));

        if (student.getRole() == Role.ADMIN) {
            throw new RuntimeException("Tài khoản admin không cần duyệt!");
        }

        student.setApprovalStatus(ApprovalStatus.APPROVED);
        student.setUsername(student.getUsername());
        student.setPassword(passwordEncoder.encode("12345678"));
        studentRepository.save(student);


        emailService.sendApprovalEmail(student);
        return student;
    }

    // ✅ Từ chối hồ sơ sinh viên
    public Student rejectStudent(Integer studentId, String reason) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên!"));

        student.setApprovalStatus(ApprovalStatus.REJECTED);
        studentRepository.delete(student);

        emailService.sendRejectionEmail(student, reason);
        return student;
    }


    public Student getStudentById(Integer id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên với id: " + id));
    }

    public Student createStudent(Student student) {
        if (student.getPassword() != null) {
            student.setPassword(passwordEncoder.encode(student.getPassword()));
        }
        if (studentRepository.findByUsername(student.getUsername()).isPresent()){
            throw new RuntimeException("Sinh viên đã tồn tại");
        }
        if (studentRepository.findByEmail(student.getEmail()).isPresent()){
            throw new RuntimeException("Email đã tồn tại");
        }
        return studentRepository.save(student);
    }

    public Student updateStudent(Integer id, Student studentDetails) {
        Student s = getStudentById(id);


        if (studentDetails.getFullName() != null) {
            s.setFullName(studentDetails.getFullName());
        }
        if (studentDetails.getEmail() != null) {
            checkEmailExists(studentDetails.getEmail(),s);
            s.setEmail(studentDetails.getEmail());
        }

        if (studentDetails.getUsername() != null) {
            Optional<Student> existingStudent = studentRepository.findByUsername(studentDetails.getUsername());

            if (existingStudent.isPresent() &&
                    !existingStudent.get().getUsername().equalsIgnoreCase(s.getUsername())) {
                throw new RuntimeException("Tên đăng nhập đã tồn tại!");
            }

            s.setUsername(studentDetails.getUsername());
        }

        if (studentDetails.getUsername() != null) {
            s.setUsername(studentDetails.getUsername());
        }

        if (studentDetails.getPhone() != null) s.setPhone(studentDetails.getPhone());
        if (studentDetails.getClassName() != null) s.setClassName(studentDetails.getClassName());
        if (studentDetails.getDateOfBirth() != null) s.setDateOfBirth(studentDetails.getDateOfBirth());
        if (studentDetails.getGender() != null) s.setGender(studentDetails.getGender());

        return studentRepository.save(s);
    }

    public Student deleteStudent(Integer id) {
        Student room= studentRepository.findById(id).orElseThrow(()->new RuntimeException("Không tìm thấy sinh viên với id: "+id));
        studentRepository.delete(room);
        return room;
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
        if (request.getEmail() != null) {
           checkEmailExists(request.getEmail(),student);
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
    private void checkEmailExists(String email, Student student) {
        Optional<Student> existingStudent = studentRepository.findByEmail(email);
        if (existingStudent.isPresent() &&
                !existingStudent.get().getEmail().equalsIgnoreCase(student.getEmail())) {
            throw new RuntimeException("Email đã tồn tại!");
        }
    }

}
