package com.stu.edu.ktx_management.config.payment;
import com.stu.edu.ktx_management.entity.Invoice;
import com.stu.edu.ktx_management.entity.InvoiceStatus;
import com.stu.edu.ktx_management.repository.InvoiceRepository;
import com.stu.edu.ktx_management.service.EmailService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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
    @Autowired
    private final EmailService emailService;

    // ================= CREATE PAYMENT =================
    public String createPaymentUrl(Integer invoiceId, HttpServletRequest request) throws Exception {

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        String txnRef = String.valueOf(System.currentTimeMillis());

        invoice.setTxnRef(txnRef);
        invoice.setStatus(InvoiceStatus.UNPAID);
        invoiceRepository.save(invoice);

        long amount = (invoice.getTotalAmount() == null ? 0 :
                invoice.getTotalAmount().longValue()) * 100;

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
        params.put("vnp_IpAddr", "127.0.0.1");

        String createDate = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        params.put("vnp_CreateDate", createDate);

        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (int i = 0; i < fieldNames.size(); i++) {

            String key = fieldNames.get(i);
            String value = params.get(key);

            if (value == null) value = "";

            // HASH (raw)
            hashData.append(key)
                    .append('=')
                    .append(URLEncoder.encode(value, StandardCharsets.US_ASCII));

            // QUERY (encode)
            query.append(URLEncoder.encode(key, StandardCharsets.UTF_8))
                    .append('=')
                    .append(URLEncoder.encode(value, StandardCharsets.UTF_8));

            if (i < fieldNames.size() - 1) {
                hashData.append('&');
                query.append('&');
            }
        }

        String secureHash = hmacSHA512(config.getHashSecret(), hashData.toString());
        System.out.println("=== HASH DATA ===");
        System.out.println(hashData.toString());

        System.out.println("=== SIGNATURE ===");
        System.out.println(secureHash);

        System.out.println("QUERY: " + query.toString());
        System.out.println("HASH: " + hashData.toString());

        return config.getPayUrl()
                + "?" + query
                + "&vnp_SecureHash=" + secureHash;
    }

    // ================= HMAC =================
    public String hmacSHA512(String key, String data) throws Exception {
        Mac hmac512 = Mac.getInstance("HmacSHA512");

        SecretKeySpec secretKey = new SecretKeySpec(
                key.getBytes(StandardCharsets.UTF_8),
                "HmacSHA512"
        );

        hmac512.init(secretKey);

        byte[] bytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));

        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }

        return sb.toString();
    }

    // ================= IPN (FIXED 100%) =================
    public void handleIPN(Map<String, String> fields) throws Exception {

        String secureHash = fields.get("vnp_SecureHash");
        fields.remove("vnp_SecureHash");

        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();

        for (int i = 0; i < fieldNames.size(); i++) {

            String key = fieldNames.get(i);
            String value = fields.get(key);

            hashData.append(key).append('=').append(value);

            if (i < fieldNames.size() - 1) {
                hashData.append('&');
            }
        }

        String checkHash = hmacSHA512(config.getHashSecret(), hashData.toString());

        if (!checkHash.equals(secureHash)) {
            throw new RuntimeException("Invalid signature");
        }

        String txnRef = fields.get("vnp_TxnRef");
        String responseCode = fields.get("vnp_ResponseCode");

        Invoice invoice = invoiceRepository.findByTxnRef(txnRef).orElse(null);

        if (invoice != null && "00".equals(responseCode)) {
            invoice.setStatus(InvoiceStatus.PAID);
            emailService.sendPaymentSuccessEmail(invoice);
            invoiceRepository.save(invoice);
        }
    }

    // ================= IP helper =================
    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null) {
            return xfHeader.split(",")[0];
        }
        return request.getRemoteAddr();
    }

    public String handleReturn(Map<String, String> fields) throws Exception {

        String secureHash = fields.get("vnp_SecureHash");

        fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();

        Iterator<String> itr = fieldNames.iterator();

        while (itr.hasNext()) {

            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);

            if (fieldValue != null && !fieldValue.isEmpty()) {

                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(fieldValue);

                if (itr.hasNext()) {
                    hashData.append('&');
                }
            }
        }

        String signValue =
                hmacSHA512(
                        config.getHashSecret(),
                        hashData.toString()
                );

        System.out.println("===== RETURN =====");
        System.out.println("HASH DATA = " + hashData);
        System.out.println("VNP HASH  = " + secureHash);
        System.out.println("MY HASH   = " + signValue);

        if (!signValue.equalsIgnoreCase(secureHash)) {
            return "INVALID_SIGNATURE";
        }

        String responseCode = fields.get("vnp_ResponseCode");

        if (!"00".equals(responseCode)) {
            return "FAILED";
        }

        String txnRef = fields.get("vnp_TxnRef");

        Invoice invoice = invoiceRepository
                .findByTxnRef(txnRef)
                .orElse(null);

        if (invoice == null) {
            return "NOT_FOUND";
        }

        if (invoice.getStatus() != InvoiceStatus.PAID) {
            invoice.setStatus(InvoiceStatus.PAID);
            invoiceRepository.save(invoice);
        }

        return "SUCCESS";
    }
}