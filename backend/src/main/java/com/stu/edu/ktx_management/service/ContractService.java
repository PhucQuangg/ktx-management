package com.stu.edu.ktx_management.service;

import com.stu.edu.ktx_management.dto.StudentProfileDTO;
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

    public List<Contract> getAllContract(){
        return contractRepository.findAll();
    }
    public List<Contract> getContractsByStudentId() {
        Student student = getLoggedInStudent(); // lấy sinh viên đang đăng nhập
        return contractRepository.findByStudent(student);
    }
    public List<StudentProfileDTO> getStudentsInRoom(Integer roomId) {
        List<Contract> contracts = contractRepository.findByRoomId(roomId);
        return contracts.stream()
                .filter(c->c.getStatus() == ContractStatus.ACTIVE)
                .map(c -> new StudentProfileDTO(
                        c.getStudent().getUsername(),
                        c.getStudent().getFullName(),
                        c.getStudent().getClassName()
                ))
                .collect(Collectors.toList());
    }

    private Student getLoggedInStudent() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return studentRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên đang đăng nhập"));
    }


    public Contract registerRoomBySemester(Integer roomId) {
        Student student = getLoggedInStudent();
        LocalDate now = LocalDate.now();
        LocalDate start;
        LocalDate end;

        if (now.getMonthValue() <= 6) {
            // Học kỳ 2: 01/01 - 30/06
            start = LocalDate.of(now.getYear(), 1, 1);
            end = LocalDate.of(now.getYear(), 6, 30);
        } else {
            // Học kỳ 1: 01/07 - 31/12
            start = LocalDate.of(now.getYear(), 7, 1);
            end = LocalDate.of(now.getYear(), 12, 31);
        }

        return createContract(student.getId(), roomId, start, end);
    }


    public Contract registerRoomCustom(Integer roomId, LocalDate startDate, LocalDate endDate) {
        Student student = getLoggedInStudent();
        return createContract(student.getId(), roomId, startDate, endDate);
    }


    // ✅ Tạo hợp đồng (chờ admin duyệt)
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

    public Contract rejectContract(Integer contractId){
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng"));
        if(contract.getStatus() != ContractStatus.PENDING){
            throw new RuntimeException("Chỉ có thể từ chối hợp đồng ở trạng thái chờ duyệt");
        }
        contract.setStatus(ContractStatus.REJECTED);
        return contractRepository.save(contract);
    }


    public Contract cancelContract(Integer contractId) {
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
        return contractRepository.save(contract);
    }

    public void  expireContracts(){
        LocalDate today = LocalDate.now();
        List<Contract> expiredContracts = contractRepository.findByStatusAndEndDateBefore(ContractStatus.ACTIVE, today);

        for (Contract contract : expiredContracts){
            contract.setStatus(ContractStatus.EXPIRED);

            Room room = contract.getRoom();
            if(room != null && room.getCurrent_people() >0){
                room.setCurrent_people(room.getCurrent_people() - 1 );

                if(room.getStatus() == RoomStatus.FULL && room.getCurrent_people() < room.getCapacity()){
                    room.setStatus(RoomStatus.AVAILABLE);
                }
                roomRepository.save(room);
            }

            contractRepository.save(contract);
        }
    }
    @Scheduled(cron = "0 0 0 * * *") // mỗi ngày lúc 00:00
    public void autoExpireContracts() {
        expireContracts();
    }
}

