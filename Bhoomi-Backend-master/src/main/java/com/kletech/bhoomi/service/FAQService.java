package com.kletech.bhoomi.service;

import com.kletech.bhoomi.model.FaqData;
import com.kletech.bhoomi.repository.FaqDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FAQService {
    @Autowired
    private FaqDataRepository faqDataRepository;

    public FaqData addFAQ(FaqData faqData) {
        return faqDataRepository.save(faqData);
    }

    public FaqData updateFAQ(FaqData faqData) {
        if (faqDataRepository.existsById(faqData.getId())) {
            return faqDataRepository.save(faqData);
        }
        return null;
    }

    public FaqData getFAQById(Long id) {
        Optional<FaqData> opt = faqDataRepository.findById(id);
        return opt.orElse(null);
    }

    public List<FaqData> getAllFAQs() {
        return faqDataRepository.findAll();
    }

    public FaqData checkFAQExist(Long id) {
        Optional<FaqData> opt = faqDataRepository.findById(id);
        return opt.orElse(null);
    }
}
