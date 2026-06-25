package com.stu.edu.ktx_management.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.stu.edu.ktx_management.entity.Invoice;
import com.stu.edu.ktx_management.entity.InvoiceStatus;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.time.LocalDate;

@Service
public class PdfInvoiceService {

    public File generateInvoicePdf(Invoice invoice) throws Exception {

        File file = File.createTempFile(
                "invoice_" + invoice.getId(),
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

        // ================= FONT =================

        BaseFont baseFont = BaseFont.createFont(
                "C:/Windows/Fonts/arial.ttf",
                BaseFont.IDENTITY_H,
                BaseFont.EMBEDDED
        );

        Font titleFont = new Font(baseFont, 16, Font.BOLD);
        Font headerFont = new Font(baseFont, 12, Font.BOLD);
        Font normalFont = new Font(baseFont, 12);
        Font boldFont = new Font(baseFont, 12, Font.BOLD);
        Font totalFont = new Font(baseFont, 13, Font.BOLD);

        // ================= HEADER =================

        PdfPTable header = new PdfPTable(2);
        header.setWidthPercentage(100);

        PdfPCell leftCell = new PdfPCell();
        leftCell.setBorder(Rectangle.NO_BORDER);

        Paragraph school = new Paragraph(
                "TRƯỜNG ĐẠI HỌC CÔNG NGHỆ SÀI GÒN",
                headerFont
        );
        school.setAlignment(Element.ALIGN_CENTER);

        Paragraph dorm = new Paragraph(
                "KÝ TÚC XÁ SINH VIÊN",
                normalFont
        );
        dorm.setAlignment(Element.ALIGN_CENTER);

        leftCell.addElement(school);
        leftCell.addElement(dorm);

        PdfPCell rightCell = new PdfPCell();
        rightCell.setBorder(Rectangle.NO_BORDER);

        Paragraph nation = new Paragraph(
                "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
                headerFont
        );
        nation.setAlignment(Element.ALIGN_CENTER);

        Paragraph freedom = new Paragraph(
                "Độc lập - Tự do - Hạnh phúc",
                normalFont
        );
        freedom.setAlignment(Element.ALIGN_CENTER);

        rightCell.addElement(nation);
        rightCell.addElement(freedom);

        header.addCell(leftCell);
        header.addCell(rightCell);

        document.add(header);

        // ================= TITLE =================

        Paragraph title = new Paragraph(
                "BIÊN NHẬN THANH TOÁN\nPHÍ NỘI TRÚ KÝ TÚC XÁ",
                titleFont
        );

        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingBefore(20);
        title.setSpacingAfter(20);

        document.add(title);

        // ================= STUDENT INFO =================

        document.add(new Paragraph(
                "Sinh viên: "
                        + invoice.getStudent().getFullName(),
                normalFont
        ));

        document.add(new Paragraph(
                "MSSV: "
                        + invoice.getStudent().getUsername(),
                normalFont
        ));

        document.add(new Paragraph(
                "Phòng: "
                        + invoice.getRoom().getName(),
                normalFont
        ));

        document.add(new Paragraph(
                "Tháng thanh toán: "
                        + invoice.getMonth(),
                normalFont
        ));

        document.add(new Paragraph(
                "Ngày lập hóa đơn: "
                        + invoice.getCreatedAt().toLocalDate(),
                normalFont
        ));

        document.add(new Paragraph(" "));

        // ================= CONTENT =================

        Paragraph content = new Paragraph(
                "Biên nhận này xác nhận sinh viên đã thực hiện thanh toán các khoản phí nội trú ký túc xá theo thông tin dưới đây.",
                normalFont
        );

        content.setFirstLineIndent(20);

        document.add(content);

        document.add(new Paragraph(" "));

        // ================= TABLE =================

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{4, 2});

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

        table.addCell(
                createCell(
                        "Tiền phòng",
                        normalFont
                )
        );

        table.addCell(
                createCell(
                        formatMoney(invoice.getRoomPrice()),
                        normalFont
                )
        );

        table.addCell(
                createCell(
                        "Phí dịch vụ",
                        normalFont
                )
        );

        table.addCell(
                createCell(
                        formatMoney(invoice.getServiceFee()),
                        normalFont
                )
        );

        PdfPCell totalLabel = new PdfPCell(
                new Phrase(
                        "TỔNG CỘNG",
                        boldFont
                )
        );

        totalLabel.setBackgroundColor(
                BaseColor.LIGHT_GRAY
        );

        totalLabel.setPadding(10);

        PdfPCell totalValue = new PdfPCell(
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

        table.addCell(totalLabel);
        table.addCell(totalValue);

        document.add(table);

        document.add(new Paragraph(" "));

        // ================= STATUS =================

        String statusText =
                invoice.getStatus() == InvoiceStatus.PAID
                        ? "✓ ĐÃ THANH TOÁN"
                        : "⌛ CHƯA THANH TOÁN";

        Paragraph status = new Paragraph(
                statusText,
                totalFont
        );

        status.setAlignment(Element.ALIGN_CENTER);

        document.add(status);

        document.add(new Paragraph(" "));
        document.add(new Paragraph(" "));

        // ================= COMMIT =================

        Paragraph commit = new Paragraph(
                "Biên nhận được lập để xác nhận việc thanh toán phí nội trú ký túc xá. Sinh viên vui lòng lưu giữ để đối chiếu khi cần thiết.",
                normalFont
        );

        commit.setFirstLineIndent(20);

        document.add(commit);

        LocalDate today = LocalDate.now();

        Paragraph date = new Paragraph(
                "TP. Hồ Chí Minh, ngày "
                        + today.getDayOfMonth()
                        + " tháng "
                        + today.getMonthValue()
                        + " năm "
                        + today.getYear(),
                normalFont
        );
        date.setAlignment(Element.ALIGN_RIGHT);
        date.setSpacingBefore(20);
        document.add(date);
        // ================= SIGNATURE =================

        PdfPTable signTable = new PdfPTable(2);
        signTable.setWidthPercentage(100);
        signTable.setWidths(new float[]{1f, 1f});
        signTable.setSpacingBefore(50);

        PdfPCell studentSign = new PdfPCell();
        studentSign.setBorder(Rectangle.NO_BORDER);

        Paragraph studentTitle = new Paragraph(
                "Sinh viên",
                boldFont
        );
        studentTitle.setAlignment(Element.ALIGN_CENTER);

        Paragraph studentNote = new Paragraph(
                "\n\n\n\n(Ký và ghi rõ họ tên)",
                normalFont
        );
        studentNote.setAlignment(Element.ALIGN_CENTER);

        studentSign.addElement(studentTitle);
        studentSign.addElement(studentNote);

        PdfPCell adminSign = new PdfPCell();
        adminSign.setBorder(Rectangle.NO_BORDER);

        Paragraph adminTitle = new Paragraph(
                "Ban quản lý KTX",
                boldFont
        );
        adminTitle.setAlignment(Element.ALIGN_CENTER);

        Paragraph adminNote = new Paragraph(
                "\n\n\n\n(Ký tên và đóng dấu)",
                normalFont
        );
        adminNote.setAlignment(Element.ALIGN_CENTER);

        adminSign.addElement(adminTitle);
        adminSign.addElement(adminNote);

        signTable.addCell(studentSign);
        signTable.addCell(adminSign);

        document.add(signTable);

        document.close();

        return file;
    }

    private void addHeaderCell(
            PdfPTable table,
            String text,
            Font font
    ) {

        PdfPCell cell = new PdfPCell(
                new Phrase(text, font)
        );

        cell.setHorizontalAlignment(
                Element.ALIGN_CENTER
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

        PdfPCell cell = new PdfPCell(
                new Phrase(text, font)
        );

        cell.setPadding(10);

        return cell;
    }

    private String formatMoney(
            Double amount
    ) {

        if (amount == null) {
            return "0 VNĐ";
        }

        return String.format(
                "%,.0f VNĐ",
                amount
        );
    }
}