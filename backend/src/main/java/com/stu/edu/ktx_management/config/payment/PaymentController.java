package com.stu.edu.ktx_management.config.payment;



import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final VnpayService vnpayService;

    @GetMapping("/create/{invoiceId}")
    public String create(@PathVariable Integer invoiceId,
                         HttpServletRequest request) throws Exception {
        return vnpayService.createPaymentUrl(invoiceId, request);
    }

    @GetMapping("/ipn")
    public String ipn(HttpServletRequest request) throws Exception {

        Map<String, String> fields = new HashMap<>();

        request.getParameterMap().forEach((k, v) -> fields.put(k, v[0]));

        vnpayService.handleIPN(fields);

        return "OK";
    }
    @GetMapping("/return")
    public String paymentReturn(
            @RequestParam Map<String,String> fields
    ) throws Exception {

        System.out.println("===== VNPAY RETURN =====");

        fields.forEach((k,v) ->
                System.out.println(k + "=" + v)
        );

        return vnpayService.handleReturn(fields);
    }
}