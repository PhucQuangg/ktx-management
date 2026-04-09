package com.stu.edu.ktx_management.service;
import com.stu.edu.ktx_management.dto.StudentDTO;
import com.stu.edu.ktx_management.dto.StudentProfileDTO;
import com.stu.edu.ktx_management.entity.*;
import com.stu.edu.ktx_management.repository.ContractRepository;
import com.stu.edu.ktx_management.repository.StudentRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

    @Autowired
    private ContractRepository contractRepository;


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

    public Student registerStudent(Student student) {

        if (studentRepository.findByUsername(student.getUsername()).isPresent()) {
            throw new RuntimeException("Mã số sinh viên đã tồn tại!");
        }

        if (studentRepository.findByEmail(student.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        if (student.getPassword() != null) {
            student.setPassword(passwordEncoder.encode(student.getPassword()));
        }

        student.setRole(Role.STUDENT);
        student.setApprovalStatus(ApprovalStatus.PENDING);

        return studentRepository.save(student);
    }

    // dành cho admin tạo thủ công
    public Student createStudentByAdmin(StudentDTO studentDTO){
        if (studentRepository.findByUsername(studentDTO.getUsername()).isPresent()){
            throw new RuntimeException("Sinh viên đã tồn tại");
        }
        if (studentRepository.findByEmail(studentDTO.getEmail()).isPresent()){
            throw new RuntimeException("Email đã tồn tại");
        }
        Student student = new Student();
        student.setFullName(studentDTO.getFullName());
        student.setUsername(studentDTO.getUsername());
        student.setEmail(studentDTO.getEmail());
        student.setPhone(studentDTO.getPhone());
        student.setClassName(studentDTO.getClassName());
        student.setDateOfBirth(studentDTO.getDateOfBirth());
        student.setGender(studentDTO.getGender());

        if (studentDTO.getRole() != null) {
            try {
                student.setRole(Role.valueOf(studentDTO.getRole().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Role không hợp lệ (ADMIN hoặc STUDENT)");
            }
        } else {
            student.setRole(Role.STUDENT);
        }
        student.setApprovalStatus(ApprovalStatus.APPROVED);
        student.setPassword(passwordEncoder.encode("12345678"));
        studentRepository.save(student);
        emailService.sendCreatedEmail(student);
        return student;
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
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên với id: " + id));

        List<Contract> contracts = contractRepository.findByStudent(student);

        boolean hasActiveContract = contracts.stream()
                .anyMatch(c -> c.getStatus() == ContractStatus.ACTIVE &&
                        c.getEndDate().isAfter(LocalDate.now()));

        if (hasActiveContract) {
            throw new RuntimeException("Không thể xóa sinh viên vì đang có hợp đồng còn hiệu lực.");
        }

        try {
            studentRepository.delete(student);
        } catch (Exception e) {
            throw new RuntimeException("Không thể xóa sinh viên do liên kết dữ liệu khác.");
        }

        return student;
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

    private void checkEmailExists(String email, Student student) {
        Optional<Student> existingStudent = studentRepository.findByEmail(email);
        if (existingStudent.isPresent() &&
                !existingStudent.get().getEmail().equalsIgnoreCase(student.getEmail())) {
            throw new RuntimeException("Email đã tồn tại!");
        }
    }

}
