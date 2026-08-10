package com.stu.edu.ktx_management.service;

import com.stu.edu.ktx_management.entity.SemesterRegistration;
import com.stu.edu.ktx_management.repository.SemesterRegistrationRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SemesterRegistrationService {

    private final SemesterRegistrationRepository semesterRepository;

    public List<SemesterRegistration> getAll() {

        checkAndCloseExpiredRegistration();

        return semesterRepository.findAll();
    }

    public SemesterRegistration getActiveSemester() {

        checkAndCloseExpiredRegistration();

        return semesterRepository
                .findByActiveTrue()
                .stream()
                .findFirst()
                .orElse(null);
    }

    @Transactional
    public SemesterRegistration updateRegistrationTime(Integer id, SemesterRegistration request) {

        SemesterRegistration semester = semesterRepository.findById(id).orElseThrow(
                                () -> new RuntimeException(
                                        "Không tìm thấy học kỳ."
                                )
                        );

        if (
                request.getRegisterStartMonth() == null ||
                        request.getRegisterStartDay() == null ||
                        request.getRegisterEndMonth() == null ||
                        request.getRegisterEndDay() == null
        ) {

            throw new RuntimeException(
                    "Vui lòng nhập đầy đủ thời gian đăng ký."
            );
        }

        validateDate(
                request.getRegisterStartMonth(),
                request.getRegisterStartDay(),
                "Ngày bắt đầu"
        );

        validateDate(
                request.getRegisterEndMonth(),
                request.getRegisterEndDay(),
                "Ngày kết thúc"
        );

        semester.setRegisterStartMonth(request.getRegisterStartMonth());

        semester.setRegisterStartDay(request.getRegisterStartDay());

        semester.setRegisterEndMonth(request.getRegisterEndMonth());

        semester.setRegisterEndDay(request.getRegisterEndDay());

        return semesterRepository.save(semester);
    }

    @Transactional
    public SemesterRegistration openRegistration(Integer id) {

        SemesterRegistration semester = semesterRepository.findById(id).orElseThrow(
                                () -> new RuntimeException(
                                        "Không tìm thấy học kỳ."
                                )
                        );

        if (
                semester.getRegisterStartMonth() == null ||
                        semester.getRegisterStartDay() == null ||
                        semester.getRegisterEndMonth() == null ||
                        semester.getRegisterEndDay() == null
        ) {
            throw new RuntimeException(
                    "Học kỳ chưa được thiết lập thời gian đăng ký."
            );
        }

        validateDate(
                semester.getRegisterStartMonth(),
                semester.getRegisterStartDay(),
                "Ngày bắt đầu"
        );

        validateDate(
                semester.getRegisterEndMonth(),
                semester.getRegisterEndDay(),
                "Ngày kết thúc"
        );

        List<SemesterRegistration> activeSemesters = semesterRepository.findByActiveTrue();

        for (SemesterRegistration activeSemester : activeSemesters) {

            if (!activeSemester.getId().equals(id)) {

                activeSemester.setActive(false);

                semesterRepository.save(activeSemester);
            }
        }

        semester.setActive(true);

        return semesterRepository.save(semester);
    }

    @Transactional
    public SemesterRegistration closeRegistration(Integer id) {

        SemesterRegistration semester = semesterRepository.findById(id).orElseThrow(
                                () -> new RuntimeException(
                                        "Không tìm thấy học kỳ."
                                )
                        );

        if (!Boolean.TRUE.equals(semester.getActive())) {
            throw new RuntimeException(
                    "Học kỳ này hiện không mở đăng ký."
            );
        }

        semester.setActive(false);

        return semesterRepository.save(semester);
    }

    @Transactional
    public void checkAndCloseExpiredRegistration() {

        LocalDate today = LocalDate.now();

        List<SemesterRegistration> activeSemesters = semesterRepository.findByActiveTrue();

        for (SemesterRegistration semester : activeSemesters) {

            if (
                    semester.getRegisterStartMonth() == null ||
                            semester.getRegisterStartDay() == null ||
                            semester.getRegisterEndMonth() == null ||
                            semester.getRegisterEndDay() == null
            ) {

                semester.setActive(false);

                semesterRepository.save(semester);

                continue;
            }


            LocalDate startDate;

            LocalDate endDate;

            try {

                startDate =
                        LocalDate.of(
                                today.getYear(),
                                semester.getRegisterStartMonth(),
                                semester.getRegisterStartDay()
                        );

                endDate =
                        LocalDate.of(
                                today.getYear(),
                                semester.getRegisterEndMonth(),
                                semester.getRegisterEndDay()
                        );

            } catch (DateTimeException e) {

                semester.setActive(false);

                semesterRepository.save(semester);

                continue;
            }

            if (endDate.isBefore(startDate)) {
                if (today.getMonthValue() == 12) {
                    endDate = endDate.plusYears(1);
                } else {
                    startDate = startDate.minusYears(1);
                }
            }

            if (today.isAfter(endDate)) {
                semester.setActive(false);
                semesterRepository.save(semester);
            }
        }
    }

    @Scheduled(cron = "0 5 0 * * *")
    public void autoCloseExpiredRegistration() {
        checkAndCloseExpiredRegistration();
    }

    private void validateDate(
            Integer month,
            Integer day,
            String fieldName
    ) {

        if (month == null || day == null) {

            throw new RuntimeException(
                    fieldName + " không được để trống."
            );
        }

        try {
            LocalDate.of(2024, month, day);

        } catch (DateTimeException e) {

            throw new RuntimeException(
                    fieldName + " không hợp lệ."
            );
        }
    }
}