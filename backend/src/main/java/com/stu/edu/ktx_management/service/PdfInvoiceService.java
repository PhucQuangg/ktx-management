package com.stu.edu.ktx_management.service;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;

import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import com.stu.edu.ktx_management.entity.Invoice;
import com.stu.edu.ktx_management.entity.InvoiceServices;
import com.stu.edu.ktx_management.entity.InvoiceStatus;

import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.time.LocalDate;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

@Service
public class PdfInvoiceService {

    public File generateInvoicePdf(
            Invoice invoice
    ) throws Exception {

        if (invoice == null) {
            throw new IllegalArgumentException(
                    "Hóa đơn không được để trống."
            );
        }

        File file = File.createTempFile(
                "invoice_" +
                        (
                                invoice.getId() != null
                                        ? invoice.getId()
                                        : "temp"
                        ),
                ".pdf"
        );

        Document document = new Document(
                PageSize.A4,
                50,
                50,
                40,
                40
        );

        PdfWriter.getInstance(
                document,
                new FileOutputStream(file)
        );

        document.open();

        try {
            /*
             * =====================================================
             * FONT
             * =====================================================
             */

            BaseFont baseFont =
                    BaseFont.createFont(
                            "C:/Windows/Fonts/arial.ttf",
                            BaseFont.IDENTITY_H,
                            BaseFont.EMBEDDED
                    );

            Font titleFont =
                    new Font(
                            baseFont,
                            16,
                            Font.BOLD
                    );

            Font headerFont =
                    new Font(
                            baseFont,
                            12,
                            Font.BOLD
                    );

            Font normalFont =
                    new Font(
                            baseFont,
                            12
                    );

            Font boldFont =
                    new Font(
                            baseFont,
                            12,
                            Font.BOLD
                    );

            Font totalFont =
                    new Font(
                            baseFont,
                            13,
                            Font.BOLD
                    );

            /*
             * =====================================================
             * HEADER
             * =====================================================
             */

            PdfPTable header =
                    new PdfPTable(2);

            header.setWidthPercentage(100);

            PdfPCell leftCell =
                    new PdfPCell();

            leftCell.setBorder(
                    Rectangle.NO_BORDER
            );

            Paragraph school =
                    new Paragraph(
                            "TRƯỜNG ĐẠI HỌC CÔNG NGHỆ SÀI GÒN",
                            headerFont
                    );

            school.setAlignment(
                    Element.ALIGN_CENTER
            );

            Paragraph dorm =
                    new Paragraph(
                            "KÝ TÚC XÁ SINH VIÊN",
                            normalFont
                    );

            dorm.setAlignment(
                    Element.ALIGN_CENTER
            );

            leftCell.addElement(school);
            leftCell.addElement(dorm);

            PdfPCell rightCell =
                    new PdfPCell();

            rightCell.setBorder(
                    Rectangle.NO_BORDER
            );

            Paragraph nation =
                    new Paragraph(
                            "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
                            headerFont
                    );

            nation.setAlignment(
                    Element.ALIGN_CENTER
            );

            Paragraph freedom =
                    new Paragraph(
                            "Độc lập - Tự do - Hạnh phúc",
                            normalFont
                    );

            freedom.setAlignment(
                    Element.ALIGN_CENTER
            );

            rightCell.addElement(nation);
            rightCell.addElement(freedom);

            header.addCell(leftCell);
            header.addCell(rightCell);

            document.add(header);

            /*
             * =====================================================
             * TITLE
             * =====================================================
             */

            Paragraph title =
                    new Paragraph(
                            "BIÊN NHẬN THANH TOÁN\n" +
                                    "PHÍ NỘI TRÚ KÝ TÚC XÁ",
                            titleFont
                    );

            title.setAlignment(
                    Element.ALIGN_CENTER
            );

            title.setSpacingBefore(20);
            title.setSpacingAfter(20);

            document.add(title);

            /*
             * =====================================================
             * STUDENT INFORMATION
             * =====================================================
             */

            document.add(
                    new Paragraph(
                            "Sinh viên: " +
                                    getStudentName(invoice),
                            normalFont
                    )
            );

            document.add(
                    new Paragraph(
                            "MSSV: " +
                                    getStudentUsername(invoice),
                            normalFont
                    )
            );

            document.add(
                    new Paragraph(
                            "Phòng: " +
                                    getRoomName(invoice),
                            normalFont
                    )
            );

            document.add(
                    new Paragraph(
                            "Tháng thanh toán: " +
                                    getInvoiceMonth(invoice),
                            normalFont
                    )
            );

            document.add(
                    new Paragraph(
                            "Ngày lập hóa đơn: " +
                                    getCreatedDate(invoice),
                            normalFont
                    )
            );

            document.add(
                    new Paragraph(" ")
            );

            /*
             * =====================================================
             * CONTENT
             * =====================================================
             */

            Paragraph content =
                    new Paragraph(
                            "Biên nhận này xác nhận sinh viên đã thực hiện thanh toán các khoản phí nội trú ký túc xá theo thông tin dưới đây.",
                            normalFont
                    );

            content.setFirstLineIndent(20);

            document.add(content);

            document.add(
                    new Paragraph(" ")
            );

            /*
             * =====================================================
             * PAYMENT TABLE
             * =====================================================
             */

            PdfPTable table =
                    new PdfPTable(2);

            table.setWidthPercentage(100);

            table.setWidths(
                    new float[]{
                            4,
                            2
                    }
            );

            addHeaderCell(
                    table,
                    "Khoản thu",
                    headerFont
            );

            addHeaderCell(
                    table,
                    "Số tiền",
                    headerFont
            );

            /*
             * Tiền phòng
             */

            table.addCell(
                    createCell(
                            "Tiền phòng",
                            normalFont
                    )
            );

            table.addCell(
                    createMoneyCell(
                            formatMoney(
                                    invoice.getRoomPrice()
                            ),
                            normalFont
                    )
            );

            /*
             * Chi tiết dịch vụ
             */

            List<InvoiceServices> invoiceServices =
                    invoice.getInvoiceServices();

            double totalServiceFee = 0;

            if (
                    invoiceServices != null &&
                            !invoiceServices.isEmpty()
            ) {

                for (
                        InvoiceServices invoiceService :
                        invoiceServices
                ) {

                    String serviceName =
                            getServiceName(
                                    invoiceService
                            );

                    double serviceAmount =
                            getServiceAmount(
                                    invoiceService
                            );

                    totalServiceFee +=
                            serviceAmount;

                    table.addCell(
                            createCell(
                                    serviceName,
                                    normalFont
                            )
                    );

                    table.addCell(
                            createMoneyCell(
                                    formatMoney(
                                            serviceAmount
                                    ),
                                    normalFont
                            )
                    );
                }

            } else {

                /*
                 * Dùng cho các hóa đơn cũ chưa có
                 * danh sách InvoiceServices.
                 */

                totalServiceFee =
                        invoice.getServiceFee() != null
                                ? invoice.getServiceFee()
                                : 0;

                table.addCell(
                        createCell(
                                "Phí dịch vụ",
                                normalFont
                        )
                );

                table.addCell(
                        createMoneyCell(
                                formatMoney(
                                        totalServiceFee
                                ),
                                normalFont
                        )
                );
            }

            /*
             * Tổng phí dịch vụ
             */

            PdfPCell serviceTotalLabel =
                    new PdfPCell(
                            new Phrase(
                                    "Tổng phí dịch vụ",
                                    boldFont
                            )
                    );

            serviceTotalLabel.setPadding(10);

            serviceTotalLabel.setBackgroundColor(
                    new BaseColor(
                            245,
                            247,
                            250
                    )
            );

            PdfPCell serviceTotalValue =
                    new PdfPCell(
                            new Phrase(
                                    formatMoney(
                                            totalServiceFee
                                    ),
                                    boldFont
                            )
                    );

            serviceTotalValue.setPadding(10);

            serviceTotalValue.setHorizontalAlignment(
                    Element.ALIGN_RIGHT
            );

            serviceTotalValue.setBackgroundColor(
                    new BaseColor(
                            245,
                            247,
                            250
                    )
            );

            table.addCell(
                    serviceTotalLabel
            );

            table.addCell(
                    serviceTotalValue
            );

            /*
             * Tổng cộng
             */

            PdfPCell totalLabel =
                    new PdfPCell(
                            new Phrase(
                                    "TỔNG CỘNG",
                                    boldFont
                            )
                    );

            totalLabel.setBackgroundColor(
                    BaseColor.LIGHT_GRAY
            );

            totalLabel.setPadding(10);

            PdfPCell totalValue =
                    new PdfPCell(
                            new Phrase(
                                    formatMoney(
                                            invoice.getTotalAmount()
                                    ),
                                    boldFont
                            )
                    );

            totalValue.setBackgroundColor(
                    BaseColor.LIGHT_GRAY
            );

            totalValue.setPadding(10);

            totalValue.setHorizontalAlignment(
                    Element.ALIGN_RIGHT
            );

            table.addCell(totalLabel);
            table.addCell(totalValue);

            document.add(table);

            document.add(
                    new Paragraph(" ")
            );

            /*
             * =====================================================
             * STATUS
             * =====================================================
             */

            String statusText =
                    invoice.getStatus() ==
                            InvoiceStatus.PAID
                            ? "ĐÃ THANH TOÁN"
                            : "CHƯA THANH TOÁN";

            Paragraph status =
                    new Paragraph(
                            statusText,
                            totalFont
                    );

            status.setAlignment(
                    Element.ALIGN_CENTER
            );

            document.add(status);

            document.add(
                    new Paragraph(" ")
            );

            document.add(
                    new Paragraph(" ")
            );

            /*
             * =====================================================
             * COMMITMENT
             * =====================================================
             */

            Paragraph commit =
                    new Paragraph(
                            "Biên nhận được lập để xác nhận việc thanh toán phí nội trú ký túc xá. Sinh viên vui lòng lưu giữ để đối chiếu khi cần thiết.",
                            normalFont
                    );

            commit.setFirstLineIndent(20);

            document.add(commit);

            /*
             * =====================================================
             * DATE
             * =====================================================
             */

            LocalDate today =
                    LocalDate.now();

            Paragraph date =
                    new Paragraph(
                            "TP. Hồ Chí Minh, ngày " +
                                    today.getDayOfMonth() +
                                    " tháng " +
                                    today.getMonthValue() +
                                    " năm " +
                                    today.getYear(),
                            normalFont
                    );

            date.setAlignment(
                    Element.ALIGN_RIGHT
            );

            date.setSpacingBefore(20);

            document.add(date);

            /*
             * =====================================================
             * SIGNATURE
             * =====================================================
             */

            PdfPTable signTable =
                    new PdfPTable(2);

            signTable.setWidthPercentage(100);

            signTable.setWidths(
                    new float[]{
                            1f,
                            1f
                    }
            );

            signTable.setSpacingBefore(50);

            PdfPCell studentSign =
                    new PdfPCell();

            studentSign.setBorder(
                    Rectangle.NO_BORDER
            );

            Paragraph studentTitle =
                    new Paragraph(
                            "Sinh viên",
                            boldFont
                    );

            studentTitle.setAlignment(
                    Element.ALIGN_CENTER
            );

            Paragraph studentNote =
                    new Paragraph(
                            "\n\n\n\n(Ký và ghi rõ họ tên)",
                            normalFont
                    );

            studentNote.setAlignment(
                    Element.ALIGN_CENTER
            );

            studentSign.addElement(
                    studentTitle
            );

            studentSign.addElement(
                    studentNote
            );

            PdfPCell adminSign =
                    new PdfPCell();

            adminSign.setBorder(
                    Rectangle.NO_BORDER
            );

            Paragraph adminTitle =
                    new Paragraph(
                            "Ban Quản lý KTX",
                            boldFont
                    );

            adminTitle.setAlignment(
                    Element.ALIGN_CENTER
            );

            Paragraph adminNote =
                    new Paragraph(
                            "\n\n\n\n(Ký tên và đóng dấu)",
                            normalFont
                    );

            adminNote.setAlignment(
                    Element.ALIGN_CENTER
            );

            adminSign.addElement(
                    adminTitle
            );

            adminSign.addElement(
                    adminNote
            );

            signTable.addCell(
                    studentSign
            );

            signTable.addCell(
                    adminSign
            );

            document.add(signTable);

        } finally {
            document.close();
        }

        return file;
    }

    /*
     * =====================================================
     * TABLE HELPERS
     * =====================================================
     */

    private void addHeaderCell(
            PdfPTable table,
            String text,
            Font font
    ) {

        PdfPCell cell =
                new PdfPCell(
                        new Phrase(
                                text,
                                font
                        )
                );

        cell.setHorizontalAlignment(
                Element.ALIGN_CENTER
        );

        cell.setVerticalAlignment(
                Element.ALIGN_MIDDLE
        );

        cell.setBackgroundColor(
                BaseColor.LIGHT_GRAY
        );

        cell.setPadding(10);

        table.addCell(cell);
    }

    private PdfPCell createCell(
            String text,
            Font font
    ) {

        PdfPCell cell =
                new PdfPCell(
                        new Phrase(
                                text,
                                font
                        )
                );

        cell.setPadding(10);

        cell.setVerticalAlignment(
                Element.ALIGN_MIDDLE
        );

        return cell;
    }

    private PdfPCell createMoneyCell(
            String text,
            Font font
    ) {

        PdfPCell cell =
                new PdfPCell(
                        new Phrase(
                                text,
                                font
                        )
                );

        cell.setPadding(10);

        cell.setHorizontalAlignment(
                Element.ALIGN_RIGHT
        );

        cell.setVerticalAlignment(
                Element.ALIGN_MIDDLE
        );

        return cell;
    }

    /*
     * =====================================================
     * FORMAT HELPERS
     * =====================================================
     */

    private String formatMoney(
            Double amount
    ) {

        double safeAmount =
                amount != null
                        ? amount
                        : 0;

        NumberFormat numberFormat =
                NumberFormat.getNumberInstance(
                        new Locale(
                                "vi",
                                "VN"
                        )
                );

        return numberFormat.format(
                safeAmount
        ) + " VNĐ";
    }

    private String formatMoney(
            double amount
    ) {

        NumberFormat numberFormat =
                NumberFormat.getNumberInstance(
                        new Locale(
                                "vi",
                                "VN"
                        )
                );

        return numberFormat.format(
                amount
        ) + " VNĐ";
    }

    /*
     * =====================================================
     * DATA HELPERS
     * =====================================================
     */

    private String getStudentName(
            Invoice invoice
    ) {

        if (
                invoice.getStudent() == null ||
                        invoice.getStudent()
                                .getFullName() == null ||
                        invoice.getStudent()
                                .getFullName()
                                .isBlank()
        ) {
            return "Chưa cập nhật";
        }

        return invoice.getStudent()
                .getFullName();
    }

    private String getStudentUsername(
            Invoice invoice
    ) {

        if (
                invoice.getStudent() == null ||
                        invoice.getStudent()
                                .getUsername() == null ||
                        invoice.getStudent()
                                .getUsername()
                                .isBlank()
        ) {
            return "Chưa cập nhật";
        }

        return invoice.getStudent()
                .getUsername();
    }

    private String getRoomName(
            Invoice invoice
    ) {

        if (
                invoice.getRoom() == null ||
                        invoice.getRoom()
                                .getName() == null ||
                        invoice.getRoom()
                                .getName()
                                .isBlank()
        ) {
            return "Chưa cập nhật";
        }

        return invoice.getRoom()
                .getName();
    }

    private String getInvoiceMonth(
            Invoice invoice
    ) {

        if (
                invoice.getMonth() == null ||
                        invoice.getMonth()
                                .isBlank()
        ) {
            return "Chưa cập nhật";
        }

        return invoice.getMonth();
    }

    private String getCreatedDate(
            Invoice invoice
    ) {

        if (
                invoice.getCreatedAt() == null
        ) {
            return "Chưa cập nhật";
        }

        return invoice.getCreatedAt()
                .toLocalDate()
                .toString();
    }

    private String getServiceName(
            InvoiceServices invoiceService
    ) {

        if (
                invoiceService == null ||
                        invoiceService.getService() == null ||
                        invoiceService.getService()
                                .getName() == null ||
                        invoiceService.getService()
                                .getName()
                                .isBlank()
        ) {
            return "Dịch vụ";
        }

        return invoiceService
                .getService()
                .getName();
    }

    private double getServiceAmount(
            InvoiceServices invoiceService
    ) {

        if (
                invoiceService == null ||
                        invoiceService.getAmount() == null
        ) {
            return 0;
        }

        return invoiceService.getAmount();
    }
}