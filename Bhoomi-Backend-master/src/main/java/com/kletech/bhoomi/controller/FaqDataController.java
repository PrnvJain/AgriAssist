package com.kletech.bhoomi.controller;

import com.kletech.bhoomi.Commons.Constants;
import com.kletech.bhoomi.model.FaqData;
import com.kletech.bhoomi.service.FAQService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = Constants.crossOrigins)
@RestController
@RequestMapping("/faqdata")
public class FaqDataController {
    @Autowired
    FAQService faqService;

    @PostMapping("/add")
    public FaqData addFAQ(@RequestBody FaqData faqData) {
        return faqService.addFAQ(faqData);
    }

    @GetMapping("/getall")
    public List<FaqData> getAllFAQs() {
        return faqService.getAllFAQs();
    }

    @GetMapping("/{id}")
    public FaqData getFAQById(@PathVariable Long id) {
        return faqService.getFAQById(id);
    }

    @PutMapping("/update")
    public FaqData updateFAQ(@RequestBody FaqData faqData) {
        return faqService.updateFAQ(faqData);
    }

    @GetMapping("/check/{id}")
    public FaqData checkFAQExist(@PathVariable Long id) {
        return faqService.checkFAQExist(id);
    }
}
