package com.stu.edu.ktx_management.config.payment;

import com.stu.edu.ktx_management.entity.Invoice;
import com.stu.edu.ktx_management.entity.InvoiceStatus;
import com.stu.edu.ktx_management.repository.InvoiceRepository;
import com.stu.edu.ktx_management.service.EmailService;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class VnpayService {

    private final VnpayConfig config;

    private final InvoiceRepository invoiceRepository;

    private final EmailService emailService;

    public String createPaymentUrl(
            Integer invoiceId,
            HttpServletRequest request
    ) throws Exception {

        Invoice invoice =
                invoiceRepository.findById(invoiceId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Không tìm thấy hóa đơn."
                                )
                        );

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new RuntimeException(
                    "Hóa đơn này đã được thanh toán."
            );
        }

        String txnRef = String.valueOf(System.currentTimeMillis());

        invoice.setTxnRef(txnRef);

        invoice.setStatus(InvoiceStatus.UNPAID);

        invoiceRepository.save(invoice);

        long amount = (
                        invoice.getTotalAmount() == null
                                ? 0
                                : invoice
                                .getTotalAmount()
                                .longValue()
                ) * 100;


        Map<String, String> params = new HashMap<>();

        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", config.getTmnCode());
        params.put("vnp_Amount", String.valueOf(amount));
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", "Invoice_" + invoiceId);
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", config.getReturnUrl());
        params.put("vnp_IpAddr", getClientIp(request));

        String createDate = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());

        params.put("vnp_CreateDate", createDate);

        List<String> fieldNames = new ArrayList<>(params.keySet());

        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();

        StringBuilder query = new StringBuilder();

        for (int i = 0; i < fieldNames.size(); i++) {
            String key = fieldNames.get(i);
            String value = params.get(key);
            if (value == null) {
                value = "";
            }

            hashData.append(key).append("=").append(
                            URLEncoder.encode(
                                    value,
                                    StandardCharsets.US_ASCII
                            )
                    );

            query.append(
                            URLEncoder.encode(
                                    key,
                                    StandardCharsets.UTF_8
                            )
                    )
                    .append("=")
                    .append(
                            URLEncoder.encode(
                                    value,
                                    StandardCharsets.UTF_8
                            )
                    );

            if (i < fieldNames.size() - 1) {
                hashData.append("&");
                query.append("&");
            }
        }

        String secureHash = hmacSHA512(config.getHashSecret(), hashData.toString());

//        System.out.println(
//                "===== CREATE PAYMENT ====="
//        );
//
//        System.out.println(
//                "HASH DATA = "
//                        + hashData
//        );
//
//        System.out.println(
//                "HASH = "
//                        + secureHash
//        );

        return config.getPayUrl()
                + "?"
                + query
                + "&vnp_SecureHash="
                + secureHash;
    }

    public String hmacSHA512(String key, String data) throws Exception {

        Mac hmac512 = Mac.getInstance("HmacSHA512");

        SecretKeySpec secretKey = new SecretKeySpec(
                        key.getBytes(StandardCharsets.UTF_8
                        ),
                        "HmacSHA512"
                );

        hmac512.init(secretKey);

        byte[] bytes = hmac512.doFinal(
                        data.getBytes(StandardCharsets.UTF_8)
                );

        StringBuilder sb = new StringBuilder();

        for (byte b : bytes) {

            sb.append(String.format("%02x", b));
        }

        return sb.toString();
    }

    public void handleIPN(Map<String, String> fields) throws Exception {

        String secureHash = fields.get("vnp_SecureHash");

        fields.remove("vnp_SecureHash");

        fields.remove("vnp_SecureHashType");

        List<String> fieldNames = new ArrayList<>(fields.keySet());

        Collections.sort(fieldNames);

        List<String> hashParts = new ArrayList<>();

        for (String fieldName : fieldNames) {

            String fieldValue = fields.get(fieldName);

            if (fieldValue != null && !fieldValue.isEmpty()) {

                hashParts.add(fieldName + "=" + fieldValue);
            }
        }

        String hashData = String.join("&", hashParts);

        String checkHash = hmacSHA512(config.getHashSecret(), hashData);

        if (secureHash == null || !checkHash.equalsIgnoreCase(secureHash)) {

            throw new RuntimeException(
                    "Invalid signature"
            );
        }

        String txnRef = fields.get("vnp_TxnRef");

        String responseCode = fields.get("vnp_ResponseCode");

        Invoice invoice = invoiceRepository.findByTxnRef(txnRef).orElse(null);

        if (invoice == null) {
            return;
        }

        if ("00".equals(responseCode) && invoice.getStatus() != InvoiceStatus.PAID) {

            invoice.setStatus(InvoiceStatus.PAID);

            Invoice savedInvoice = invoiceRepository.saveAndFlush(invoice);

//            System.out.println(
//                    "IPN PAID invoice = "
//                            + savedInvoice.getId()
//            );

            emailService.sendPaymentSuccessEmail(savedInvoice.getId());
        }
    }

    public String handleReturn(Map<String, String> fields) throws Exception {

        String secureHash = fields.get("vnp_SecureHash");

        fields.remove("vnp_SecureHash");

        fields.remove("vnp_SecureHashType");

        List<String> fieldNames = new ArrayList<>(fields.keySet());

        Collections.sort(fieldNames);

        List<String> hashParts = new ArrayList<>();

        for (String fieldName : fieldNames) {

            String fieldValue = fields.get(fieldName);

            if (fieldValue != null && !fieldValue.isEmpty()) {

                hashParts.add(fieldName + "=" + fieldValue);
            }
        }

        String hashData = String.join("&", hashParts);

        String signValue = hmacSHA512(config.getHashSecret(), hashData);

        System.out.println(
                "===== RETURN ====="
        );

        System.out.println("HASH DATA = " + hashData);

        System.out.println("VNP HASH = " + secureHash);

        System.out.println("MY HASH = " + signValue);

        if (secureHash == null || !signValue.equalsIgnoreCase(secureHash)) {
            return "INVALID_SIGNATURE";
        }

        String responseCode = fields.get("vnp_ResponseCode");

        if (!"00".equals(responseCode)) {
            return "FAILED";
        }

        String txnRef = fields.get("vnp_TxnRef");

        Invoice invoice = invoiceRepository.findByTxnRef(txnRef).orElse(null);

        if (invoice == null) {
            return "NOT_FOUND";
        }

        if (invoice.getStatus() != InvoiceStatus.PAID) {
            invoice.setStatus(InvoiceStatus.PAID
            );

            Invoice savedInvoice = invoiceRepository.saveAndFlush(invoice);

            System.out.println("RETURN PAID invoice = " + savedInvoice.getId());

            emailService.sendPaymentSuccessEmail(savedInvoice.getId());
        }

        return "SUCCESS";
    }


    private String getClientIp(HttpServletRequest request) {

        String xfHeader = request.getHeader("X-Forwarded-For");

        if (xfHeader != null && !xfHeader.isBlank()) {

            return xfHeader.split(",")[0].trim();
        }

        String ip = request.getRemoteAddr();

        if (ip == null || ip.isBlank() || "::1".equals(ip) || "0:0:0:0:0:0:0:1".equals(ip)) {
            return "127.0.0.1";
        }


        return ip;
    }
}