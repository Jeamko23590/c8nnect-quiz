package com.quiz.app.config;

import com.quiz.app.model.Question;
import com.quiz.app.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Check if questions already exist
        if (questionRepository.count() == 0) {
            // Initialize with 10 questions
            questionRepository.save(new Question(null, 
                "A store wants to record sales and automatically update transactions. What system does it need?",
                "Inventory Management System",
                "Point-of-Sale (POS) System",
                "Appointment Booking System",
                "Learning Management System",
                "B"));
            
            questionRepository.save(new Question(null,
                "A business wants to know how many products are left in stock. What system does it need?",
                "Inventory Management System",
                "Payroll System",
                "Customer Relationship Management System",
                "Reservation System",
                "A"));
            
            questionRepository.save(new Question(null,
                "A salon wants customers to book appointments online. What system does it need?",
                "Accounting System",
                "Inventory Management System",
                "Appointment Booking System",
                "Document Management System",
                "C"));
            
            questionRepository.save(new Question(null,
                "A restaurant wants customers to order food online. What system does it need?",
                "Payroll System",
                "Online Ordering System",
                "Employee Management System",
                "Inventory Management System",
                "B"));
            
            questionRepository.save(new Question(null,
                "A company wants to store customer information and track customer interactions. What system does it need?",
                "Customer Relationship Management (CRM) System",
                "Inventory Management System",
                "Payroll System",
                "Learning Management System",
                "A"));
            
            questionRepository.save(new Question(null,
                "A business wants to calculate employee salaries and manage deductions. What system does it need?",
                "Reservation System",
                "Point-of-Sale System",
                "Payroll System",
                "Customer Support System",
                "C"));
            
            questionRepository.save(new Question(null,
                "A school wants students to access lessons, activities, and learning materials online. What system does it need?",
                "Inventory Management System",
                "Learning Management System (LMS)",
                "Accounting System",
                "Appointment Booking System",
                "B"));
            
            questionRepository.save(new Question(null,
                "A company wants to track customer complaints and support requests. What system does it need?",
                "Customer Support or Helpdesk System",
                "Payroll System",
                "Online Ordering System",
                "Inventory Management System",
                "A"));
            
            questionRepository.save(new Question(null,
                "A business wants to monitor income, expenses, and financial reports. What system does it need?",
                "Reservation System",
                "Employee Management System",
                "Accounting System",
                "Learning Management System",
                "C"));
            
            questionRepository.save(new Question(null,
                "A company wants to manage employee records, attendance, and leave requests. What system does it need?",
                "Online Ordering System",
                "Human Resource Management System (HRMS)",
                "Customer Relationship Management System",
                "Point-of-Sale System",
                "B"));
            
            System.out.println("Database initialized with 10 questions");
        } else {
            System.out.println("Questions already exist in database");
        }
    }
}
