package com.stu.edu.ktx_management.service;

import com.stu.edu.ktx_management.dto.RegisterStudentDTO;
import com.stu.edu.ktx_management.dto.ResidenceInfoDTO;
import com.stu.edu.ktx_management.dto.StudentDTO;
import com.stu.edu.ktx_management.dto.ProfileDTO;
import com.stu.edu.ktx_management.entity.*;
import com.stu.edu.ktx_management.repository.ContractRepository;
import com.stu.edu.ktx_management.repository.ResidenceInfoRepository;
import com.stu.edu.ktx_management.repository.StudentRepository;
import com.stu.edu.ktx_management.repository.StudentVerificationRepository;
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

    @Autowired
    private StudentVerificationRepository verificationRepository;

    @Autowired
    private ResidenceInfoRepository residenceInfoRepository;


    public List<ProfileDTO> getAllStudents() {

        return studentRepository.findAll()
                .stream()
                .filter(student -> student.getRole() == Role.STUDENT)
                .map(student -> {

                    ProfileDTO dto = modelMapper.map(student, ProfileDTO.class);

                    if (student.getResidenceInfo() != null) {
                        dto.setResidenceInfo(
                                new ResidenceInfoDTO(student.getResidenceInfo())
                        );
                    }

                    return dto;

                })
                .toList();
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

    public Student rejectStudent(Integer studentId, String reason) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy sinh viên!")
                );

        student.setApprovalStatus(ApprovalStatus.REJECTED);

        studentRepository.save(student);

        emailService.sendRejectionEmail(student, reason);

        return student;
    }


    public StudentDTO getStudentById(Integer id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy sinh viên với id: " + id
                        )
                );

        StudentDTO dto = modelMapper.map(student, StudentDTO.class);

        dto.setApprovalStatus(student.getApprovalStatus().name());

        dto.setRole(student.getRole().name());

        if (student.getResidenceInfo() != null) {

            dto.setResidenceInfo(
                    new ResidenceInfoDTO(
                            student.getResidenceInfo()
                    )
            );

        }

        return dto;
    }

    public Student registerStudent(RegisterStudentDTO dto) {

        StudentVerification verification =
                verificationRepository.findByMssv(dto.getUsername())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Mã số sinh viên không tồn tại"
                                )
                        );

        if (!verification.getDateOfBirth().equals(dto.getDateOfBirth())) {

            throw new RuntimeException(
                    "Sai thông tin ngày sinh"
            );
        }

        if (!verification.getClassName().equals(dto.getClassName())) {

            throw new RuntimeException(
                    "Sai thông tin lớp"
            );
        }


        if (!verification.getEmail().equalsIgnoreCase(dto.getEmail())) {

            throw new RuntimeException(
                    "Email không tồn tại"
            );
        }

        Student student;

        var existingStudent =
                studentRepository
                        .findByUsernameIgnoreCase(
                                dto.getUsername()
                        );


        if (existingStudent.isPresent()) {

            Student oldStudent = existingStudent.get();

            if (oldStudent.getApprovalStatus() != ApprovalStatus.REJECTED) {
                if (oldStudent.getApprovalStatus() == ApprovalStatus.PENDING) {
                    throw new RuntimeException(
                            "Hồ sơ của bạn đang chờ xét duyệt!"
                    );
                }

                if (oldStudent.getApprovalStatus() == ApprovalStatus.APPROVED) {
                    throw new RuntimeException(
                            "Tài khoản của bạn đã được duyệt!"
                    );
                }
                throw new RuntimeException(
                        "Mã số sinh viên đã tồn tại!"
                );
            }


            student = oldStudent;

        } else {
            student = new Student();
        }


        var existingEmail =
                studentRepository.findByEmail(dto.getEmail());


        if (existingEmail.isPresent()) {

            Student emailOwner = existingEmail.get();

            if (student.getId() == null || !emailOwner.getId().equals(student.getId())) {

                throw new RuntimeException(
                        "Email đã được sử dụng!"
                );
            }
        }

        student.setUsername(dto.getUsername());

        student.setPassword(passwordEncoder.encode(dto.getPassword()));

        student.setEmail(dto.getEmail());

        student.setFullName(dto.getFullName());

        student.setDateOfBirth(dto.getDateOfBirth());

        student.setGender(dto.getGender());

        student.setPhone(dto.getPhone());

        student.setClassName(dto.getClassName());


        student.setRole(Role.STUDENT);

        student.setApprovalStatus(ApprovalStatus.PENDING);

        ResidenceInfo residence;

        if (student.getResidenceInfo() != null) {

            residence = student.getResidenceInfo();

        } else {

            residence = new ResidenceInfo();
        }

        residence.setIdentityNumber(dto.getResidenceInfo().getIdentityNumber());

        residence.setIdentityIssueDate(dto.getResidenceInfo().getIdentityIssueDate());

        residence.setIdentityIssuePlace(dto.getResidenceInfo().getIdentityIssuePlace());

        residence.setNationality(dto.getResidenceInfo().getNationality());

        residence.setPlaceOfBirth(dto.getResidenceInfo().getPlaceOfBirth());

        residence.setEthnicity(dto.getResidenceInfo().getEthnicity());

        residence.setReligion(dto.getResidenceInfo().getReligion());

        residence.setProvince(dto.getResidenceInfo().getProvince());

        residence.setDistrict(dto.getResidenceInfo().getDistrict());

        residence.setWard(dto.getResidenceInfo().getWard());

        residence.setAddress(dto.getResidenceInfo().getAddress());

        residence.setStudent(student);

        student.setResidenceInfo(residence
        );

        return studentRepository.save(student);
    }

    public Student createStudentByAdmin(StudentDTO studentDTO) {
        if (studentRepository.findByUsernameIgnoreCase(studentDTO.getUsername()).isPresent()) {
            throw new RuntimeException("Sinh viên đã tồn tại");
        }
        if (studentRepository.findByEmail(studentDTO.getEmail()).isPresent()) {
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

    public Student updateStudent(Integer id, StudentDTO dto) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy sinh viên với id: " + id));

        if (dto.getFullName() != null) {
            student.setFullName(dto.getFullName());
        }

        if (dto.getEmail() != null) {
            checkEmailExists(dto.getEmail(), student);
            student.setEmail(dto.getEmail());
        }

        if (dto.getUsername() != null) {

            Optional<Student> existingStudent =
                    studentRepository.findByUsernameIgnoreCase(dto.getUsername());

            if (existingStudent.isPresent()
                    && !existingStudent.get().getId().equals(student.getId())) {

                throw new RuntimeException("Tên đăng nhập đã tồn tại!");
            }

            student.setUsername(dto.getUsername());
        }

        if (dto.getPhone() != null) {
            student.setPhone(dto.getPhone());
        }

        if (dto.getClassName() != null) {
            student.setClassName(dto.getClassName());
        }

        if (dto.getDateOfBirth() != null) {
            student.setDateOfBirth(dto.getDateOfBirth());
        }

        if (dto.getGender() != null) {
            student.setGender(dto.getGender());
        }

        if (dto.getResidenceInfo() != null) {

            ResidenceInfo residenceInfo = student.getResidenceInfo();

            if (residenceInfo == null) {
                residenceInfo = new ResidenceInfo();
                residenceInfo.setStudent(student);
                student.setResidenceInfo(residenceInfo);
            }

            ResidenceInfoDTO r = dto.getResidenceInfo();

            residenceInfo.setIdentityNumber(r.getIdentityNumber());
            residenceInfo.setIdentityIssueDate(r.getIdentityIssueDate());
            residenceInfo.setIdentityIssuePlace(r.getIdentityIssuePlace());

            residenceInfo.setNationality(r.getNationality());
            residenceInfo.setPlaceOfBirth(r.getPlaceOfBirth());
            residenceInfo.setEthnicity(r.getEthnicity());
            residenceInfo.setReligion(r.getReligion());

            residenceInfo.setProvince(r.getProvince());
            residenceInfo.setDistrict(r.getDistrict());
            residenceInfo.setWard(r.getWard());
            residenceInfo.setAddress(r.getAddress());
        }

        return studentRepository.save(student);
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

    public ProfileDTO getStudentByUsername(String username) {

        Student student = studentRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy sinh viên: " + username
                        )
                );

        ProfileDTO dto = modelMapper.map(student, ProfileDTO.class);

        if (student.getResidenceInfo() != null) {
            dto.setResidenceInfo(
                    new ResidenceInfoDTO(student.getResidenceInfo())
            );
        }

        return dto;
    }

    public Student updateMyProfile(String username, ProfileDTO request) {

        Student student = studentRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy tài khoản: " + username
                        )
                );

        if (request.getFullName() != null && !request.getFullName().isEmpty()) {
            student.setFullName(request.getFullName());
        }

        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            checkEmailExists(request.getEmail(), student);
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

        if (request.getResidenceInfo() != null) {

            ResidenceInfoDTO dto = request.getResidenceInfo();

            ResidenceInfo residence = student.getResidenceInfo();

            if (residence == null) {

                residence = new ResidenceInfo();

                residence.setStudent(student);

                student.setResidenceInfo(residence);
            }

            if (dto.getIdentityNumber() != null) {
                residence.setIdentityNumber(dto.getIdentityNumber());
            }


            if (dto.getIdentityIssueDate() != null) {
                residence.setIdentityIssueDate(dto.getIdentityIssueDate());
            }

            if (dto.getIdentityIssuePlace() != null) {
                residence.setIdentityIssuePlace(dto.getIdentityIssuePlace());
            }

            if (dto.getNationality() != null) {
                residence.setNationality(dto.getNationality());
            }

            if (dto.getPlaceOfBirth() != null) {
                residence.setPlaceOfBirth(dto.getPlaceOfBirth());
            }

            if (dto.getEthnicity() != null) {
                residence.setEthnicity(dto.getEthnicity());
            }

            if (dto.getReligion() != null) {
                residence.setReligion(dto.getReligion());
            }

            if (dto.getProvince() != null) {
                residence.setProvince(dto.getProvince());
            }

            if (dto.getDistrict() != null) {
                residence.setDistrict(dto.getDistrict());
            }

            if (dto.getWard() != null) {
                residence.setWard(dto.getWard());
            }

            if (dto.getAddress() != null) {
                residence.setAddress(dto.getAddress());
            }

        }

        return studentRepository.save(student);
    }

    public Optional<Student> findByUsername(String username) {
        return studentRepository.findByUsernameIgnoreCase(username);
    }

    private void checkEmailExists(String email, Student student) {
        Optional<Student> existingStudent = studentRepository.findByEmail(email);
        if (existingStudent.isPresent() &&
                !existingStudent.get().getEmail().equalsIgnoreCase(student.getEmail())) {
            throw new RuntimeException("Email đã tồn tại!");
        }
    }

    public List<Student> filterStudents(String fullName, String className) {

        List<Student> students;

        if (fullName != null && !fullName.isEmpty()
                && className != null && !className.isEmpty()) {

            students = studentRepository
                    .findByFullNameContainingIgnoreCaseAndClassNameContainingIgnoreCase(
                            fullName,
                            className
                    );

        } else if (fullName != null && !fullName.isEmpty()) {

            students = studentRepository
                    .findByFullNameContainingIgnoreCase(fullName);

        } else if (className != null && !className.isEmpty()) {

            students = studentRepository
                    .findByClassNameContainingIgnoreCase(className);

        } else {

            students = studentRepository.findAll();
        }

        return students.stream()
                .filter(s -> s.getRole() == Role.STUDENT)
                .filter(s -> s.getApprovalStatus() == ApprovalStatus.APPROVED)
                .toList();
    }
}
