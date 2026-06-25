package com.stu.edu.ktx_management.service;

import com.stu.edu.ktx_management.dto.RoomFacilityDTO;
import com.stu.edu.ktx_management.entity.FacilityType;
import com.stu.edu.ktx_management.entity.Room;
import com.stu.edu.ktx_management.entity.RoomFacility;
import com.stu.edu.ktx_management.repository.FacilityTypeRepository;
import com.stu.edu.ktx_management.repository.RoomFacilityRepository;
import com.stu.edu.ktx_management.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomFacilityService {

    @Autowired
    private RoomFacilityRepository roomFacilityRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private FacilityTypeRepository facilityTypeRepository;

    public List<RoomFacilityDTO> getAll() {

        return roomFacilityRepository.findAll()
                .stream()
                .map(rf -> {

                    RoomFacilityDTO dto =
                            new RoomFacilityDTO();

                    dto.setId(rf.getId());

                    dto.setRoomId(
                            rf.getRoom().getId()
                    );

                    dto.setRoomName(
                            rf.getRoom().getName()
                    );

                    dto.setFacilityTypeId(
                            rf.getFacilityType().getId()
                    );

                    dto.setFacilityName(
                            rf.getFacilityType().getName()
                    );

                    dto.setQuantity(
                            rf.getQuantity()
                    );

                    dto.setStatus(
                            rf.getStatus()
                    );

                    return dto;

                })
                .toList();
    }

    public RoomFacility create(RoomFacilityDTO dto) {

        Room room =
                roomRepository.findById(
                        dto.getRoomId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy phòng"
                        ));

        FacilityType facilityType =
                facilityTypeRepository
                        .findByName(
                                dto.getFacilityName()
                        )
                        .orElse(null);

        if (facilityType == null) {

            facilityType =
                    new FacilityType();

            facilityType.setName(
                    dto.getFacilityName()
            );

            facilityType =
                    facilityTypeRepository.save(
                            facilityType
                    );
        }

        RoomFacility rf =
                new RoomFacility();

        rf.setRoom(room);

        rf.setFacilityType(
                facilityType
        );

        rf.setQuantity(
                dto.getQuantity()
        );

        rf.setStatus(
                dto.getStatus()
        );

        return roomFacilityRepository.save(
                rf
        );
    }

    public void delete(Integer id) {
        roomFacilityRepository.deleteById(id);
    }

    public RoomFacilityDTO getById(Integer id) {

        RoomFacility rf = roomFacilityRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy thiết bị"));

        RoomFacilityDTO dto = new RoomFacilityDTO();

        dto.setId(rf.getId());

        dto.setRoomId(
                rf.getRoom().getId()
        );

        dto.setRoomName(
                rf.getRoom().getName()
        );

        dto.setFacilityName(
                rf.getFacilityType().getName()
        );

        dto.setQuantity(
                rf.getQuantity()
        );

        dto.setStatus(
                rf.getStatus()
        );

        return dto;
    }
    public RoomFacility update(
            Integer id,
            RoomFacilityDTO dto
    ) {

        RoomFacility rf =
                roomFacilityRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Không tìm thấy thiết bị"));

        rf.setQuantity(dto.getQuantity());

        rf.setStatus(dto.getStatus());

        return roomFacilityRepository.save(rf);
    }
}
