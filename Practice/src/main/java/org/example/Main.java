package org.example;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {
    public static void main(String[] args) {

        Student s1 = new Student("Nick", 27);
        Student s2 = new Student("Lexi", 21);
        Student s3 = new Student("Neal", 23);
        Student s4 = new Student("Wei", 30);

        List<Student> ls = new ArrayList<>();
        ls.add(s1);
        ls.add(s2);
        ls.add(s3);
        ls.add(s4);

        System.out.println(ls);

        ls.sort(Comparator.comparingInt(s -> s.age));

        System.out.println(ls);

        ls.forEach(student -> student.toString());
        }
    }
