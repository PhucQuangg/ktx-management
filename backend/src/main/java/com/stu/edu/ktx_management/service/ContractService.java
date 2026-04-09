package com.stu.edu.ktx_management.service;

import com.stu.edu.ktx_management.dto.ContractDTO;
import com.stu.edu.ktx_management.dto.StudentContractDTO;
import com.stu.edu.ktx_management.dto.StudentDTO;
import com.stu.edu.ktx_management.dto.mapper.ContractMapper;
import com.stu.edu.ktx_management.entity.*;
import com.stu.edu.ktx_management.repository.ContractRepository;
import com.stu.edu.ktx_management.repository.RoomRepository;
import com.stu.edu.ktx_management.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContractService {

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private EmailService emailService;

    // ================= GET ALL =================
    public List<Contract> getAllContract() {
        return contractRepository.findAll();
    }

    public ContractDTO getContractById(Integer id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng"));

        return new ContractDTO(
                contract.getId(),
                contract.getStudent().getFullName(),
                contract.getStudent().getUsername(),
                contract.getStudent().getEmail(),
                contract.getRoom().getName(),
                contract.getStartDate(),
                contract.getEndDate(),
                contract.getStatus().toString()
        );
    }


    // ================= GET CURRENT USER =================
    private Student getLoggedInStudent() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return studentRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));
    }

    private Integer getCurrentStudentId() {
        return getLoggedInStudent().getId();
    }

    // ================= STUDENTS IN ROOM =================
    public List<StudentDTO> getStudentsInRoom(Integer roomId) {
        List<Contract> contracts = contractRepository.findByRoomId(roomId);

        return contracts.stream()
                .filter(c -> c.getStatus() == ContractStatus.ACTIVE)
                .map(c -> new StudentDTO(
                        c.getStudent().getUsername(),
                        c.getStudent().getFullName(),
                        c.getStudent().getClassName()
                ))
                .collect(Collectors.toList());
    }

    // ================= REGISTER =================
    public Contract registerRoomBySemester(Integer roomId) {
        Student student = getLoggedInStudent();
        LocalDate now = LocalDate.now();

        LocalDate start;
        LocalDate end;

        if (now.getMonthValue() <= 6) {
            start = LocalDate.of(now.getYear(), 1, 1);
            end = LocalDate.of(now.getYear(), 6, 30);
        } else {
            start = LocalDate.of(now.getYear(), 7, 1);
            end = LocalDate.of(now.getYear(), 12, 31);
        }

        return createContract(student.getId(), roomId, start, end);
    }

    public Contract registerRoomCustom(Integer roomId, LocalDate startDate, LocalDate endDate) {
        Student student = getLoggedInStudent();
        return createContract(student.getId(), roomId, startDate, endDate);
    }

    private Contract createContract(Integer studentId, Integer roomId, LocalDate startDate, LocalDate endDate) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng"));

        if (room.getCurrent_people() >= room.getCapacity()) {
            throw new RuntimeException("Phòng đã đầy, vui lòng chọn phòng khác");
        }

        if (room.getStatus() == RoomStatus.MAINTENANCE) {
            throw new RuntimeException("Phòng đang bảo trì");
        }

        if (contractRepository.findByStudentAndStatus(student, ContractStatus.ACTIVE).isPresent()) {
            throw new RuntimeException("Bạn đã có hợp đồng đang hoạt động");
        }

        Contract contract = new Contract();
        contract.setStudent(student);
        contract.setRoom(room);
        contract.setStartDate(startDate);
        contract.setEndDate(endDate);
        contract.setStatus(ContractStatus.PENDING);

        return contractRepository.save(contract);
    }

    // ================= APPROVE =================
    public Contract approveContract(Integer contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng"));

        if (contract.getStatus() != ContractStatus.PENDING) {
            throw new RuntimeException("Hợp đồng không ở trạng thái chờ duyệt");
        }

        Room room = contract.getRoom();

        if (room.getCurrent_people() >= room.getCapacity()) {
            throw new RuntimeException("Phòng đã đầy, không thể duyệt hợp đồng");
        }

        contract.setStatus(ContractStatus.ACTIVE);
        room.setCurrent_people(room.getCurrent_people() + 1);

        if (room.getCurrent_people() >= room.getCapacity()) {
            room.setStatus(RoomStatus.FULL);
        }

        roomRepository.save(room);
        return contractRepository.save(contract);
    }

    // ================= REJECT =================
    public Contract rejectContract(Integer contractId, String reason) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng"));

        if (contract.getStatus() != ContractStatus.PENDING) {
            throw new RuntimeException("Chỉ có thể từ chối hợp đồng ở trạng thái chờ duyệt");
        }

        contract.setStatus(ContractStatus.REJECTED);

        contract.setReason(reason);

        contractRepository.save(contract);

        emailService.sendRejectionContract(contract, reason);

        return contract;
    }


    // ================= CANCEL =================
    public Contract cancelContract(Integer contractId, String reason) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng"));

        if (contract.getStatus() == ContractStatus.CANCELED) {
            throw new RuntimeException("Hợp đồng đã bị hủy trước đó");
        }

        Room room = contract.getRoom();

        if (contract.getStatus() == ContractStatus.ACTIVE && room.getCurrent_people() > 0) {
            room.setCurrent_people(room.getCurrent_people() - 1);
        }

        if (room.getStatus() == RoomStatus.FULL && room.getCurrent_people() < room.getCapacity()) {
            room.setStatus(RoomStatus.AVAILABLE);
        }

        contract.setStatus(ContractStatus.CANCELED);
        roomRepository.save(room);

        contractRepository.save(contract);
        emailService.sendCancelContract(contract,reason);
        return contract;
    }

    // ================= EXPIRE =================
    public void expireContracts() {
        LocalDate today = LocalDate.now();

        List<Contract> expiredContracts =
                contractRepository.findByStatusAndEndDateBefore(ContractStatus.ACTIVE, today);

        for (Contract contract : expiredContracts) {
            contract.setStatus(ContractStatus.EXPIRED);

            Room room = contract.getRoom();

            if (room != null && room.getCurrent_people() > 0) {
                room.setCurrent_people(room.getCurrent_people() - 1);

                if (room.getStatus() == RoomStatus.FULL &&
                        room.getCurrent_people() < room.getCapacity()) {
                    room.setStatus(RoomStatus.AVAILABLE);
                }

                roomRepository.save(room);
            }

            contractRepository.save(contract);
        }
    }

    // ================= CHECK ACTIVE =================
    public boolean hasActiveContract(Student student) {
        List<Contract> contracts = contractRepository.findByStudent(student);
        LocalDate now = LocalDate.now();

        return contracts.stream()
                .anyMatch(c ->
                        !c.getStartDate().isAfter(now) &&
                                !c.getEndDate().isBefore(now)
                );
    }

    // ================= MY CONTRACT =================
    public List<StudentContractDTO> getContractsByStudentId() {
        Integer studentId = getCurrentStudentId();

        return contractRepository.findByStudentId(studentId)
                .stream()
                .map(ContractMapper::toStudentDTO)
                .toList();
    }

    // ================= DETAIL =================
    public ContractDTO getContractDetail(Integer contractId) {
        Integer studentId = getCurrentStudentId(); // ✅ FIX CHÍNH

        Contract contract = contractRepository
                .findByIdAndStudentId(contractId, studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng"));

        return ContractMapper.toDetailDTO(contract);
    }

    // ================= AUTO SCHEDULE =================
    @Scheduled(cron = "0 0 0 * * *")
    public void autoExpireContracts() {
        expireContracts();
    }
}
