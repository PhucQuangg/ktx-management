package com.stu.edu.ktx_management.service;

import com.stu.edu.ktx_management.entity.Room;
import com.stu.edu.ktx_management.entity.RoomStatus;
import com.stu.edu.ktx_management.entity.TypeRoom;
import com.stu.edu.ktx_management.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {
    @Autowired
    private RoomRepository roomRepository;

    public List<Room> getAllRoom(){
        return roomRepository.findAll();
    }
    public Room getRoomById(int id){
        return roomRepository.findById(id).orElseThrow(()->new RuntimeException("Không tìm thấy phòng với id: "+id));
    }
    public List<Room> searchRooms(Integer id, String roomName){
        if(id != null){
            Room room = roomRepository.findById(id).orElseThrow(()->new RuntimeException("Không tìm thấy phòng với id: "+id));
            return List.of(room);
        }
        else if(roomName != null && !roomName.isEmpty())
        {
            List<Room> rooms = roomRepository.findByNameContainingIgnoreCase(roomName);
            if (rooms.isEmpty()){
                throw new RuntimeException("Không tìm thấy phòng với tên chứa: "+roomName);
            }
            return rooms;
        }
        throw new RuntimeException("Vui lòng nhập id hoặc name để tìm kiếm");
    }

    public Room createRoom(Room room){
        if (roomRepository.existsByName(room.getName())){
            throw new RuntimeException("Phòng đã tồn tại");
        }
        room.setStatus(RoomStatus.AVAILABLE);
        room.setCurrent_people(0);
        return roomRepository.save(room);
    }
    public Room deleteRoom(Integer id){
        Room room= roomRepository.findById(id).orElseThrow(()->new RuntimeException("Không tìm thấy phòng với id: "+id));
        roomRepository.delete(room);
        return room;
    }
    public Room updateRoom(Integer id, Room roomDetails) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với id: " + id));

        if (roomDetails.getName() != null) {
            room.setName(roomDetails.getName());
        }
        if (roomDetails.getCapacity() != null) {
            room.setCapacity(roomDetails.getCapacity());
        }
        if (roomDetails.getCurrent_people() != null) {
            room.setCurrent_people(roomDetails.getCurrent_people());
        }
        if (roomDetails.getPrice() != null) {
            room.setPrice(roomDetails.getPrice());
        }
        if (roomDetails.getStatus() != null) {
            room.setStatus(roomDetails.getStatus());
        }

        return roomRepository.save(room);
    }
    public List<Room> getAvailableRoomsByType(TypeRoom type) {
        List<Room> rooms = roomRepository.findByStatusAndType(RoomStatus.AVAILABLE, type);
        System.out.println("Rooms size: " + rooms.size());
        return rooms;
    }

}
